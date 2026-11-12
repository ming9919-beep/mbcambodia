"use strict";

/**
 * 客户（customers）与个人流水（transactions）的 Postgres 持久层。
 *
 * 与 store.js 里的 JSON 状态彼此独立：
 * - store 继续负责演示用的账户/支付单/转账（保持原有接口不变）
 * - 这里用真正的关系表存「客户资料」和「每个客户的交易流水」，可按客户查询、汇总
 * - store 侧发生转账/扫码支付时，会把事件镜像到这里（recordTransfer / recordKhqr），
 *   并把最新余额同步到 customer_accounts，保证两边金额一致
 *
 * 没有配置 DATABASE_URL 时所有方法都返回 UNAVAILABLE，接口层据此回 503，
 * 不会影响原有的支付流程。
 */

const crypto = require("crypto");
const db = require("./db");

const CURRENCIES = ["USD", "KHR"];
const KINDS = ["transfer", "khqr", "deposit", "withdrawal", "fee", "refund"];
const DIRECTIONS = ["in", "out"];

let ready = false;
let initResult = { ok: false, reason: "尚未初始化" };

const SCHEMA = [
  "create table if not exists customers (" +
    "id text primary key, " +
    "name text not null, " +
    "phone text, " +
    "email text, " +
    "national_id text, " +
    "bakong_account text, " +
    "kyc_status text not null default 'pending', " +
    "note text, " +
    "created_at timestamptz not null default now(), " +
    "updated_at timestamptz not null default now())",
  "create unique index if not exists customers_phone_key on customers (phone) " +
    "where phone is not null and phone <> ''",
  "create table if not exists customer_accounts (" +
    "account_id text primary key, " +
    "customer_id text not null references customers(id) on delete cascade, " +
    "label text, " +
    "currency text not null, " +
    "balance numeric(18,4) not null default 0, " +
    "created_at timestamptz not null default now())",
  "create index if not exists customer_accounts_customer_idx on customer_accounts (customer_id)",
  "create table if not exists transactions (" +
    "id bigserial primary key, " +
    "ref text not null, " +
    "customer_id text references customers(id) on delete set null, " +
    "account_id text, " +
    "kind text not null default 'transfer', " +
    "direction text not null default 'out', " +
    "amount numeric(18,4) not null, " +
    "currency text not null, " +
    "counterparty text, " +
    "counterparty_account text, " +
    "status text not null default 'completed', " +
    "note text, " +
    "external_ref text, " +
    "balance_after numeric(18,4), " +
    "created_at timestamptz not null default now())",
  "create unique index if not exists transactions_ref_key on transactions (ref)",
  "create index if not exists transactions_customer_idx on transactions (customer_id, created_at desc)"
];

function pool() {
  return db.getPool();
}

async function init() {
  const p = pool();
  if (!p) {
    ready = false;
    initResult = { ok: false, reason: "DATABASE_URL 未配置" };
    return initResult;
  }
  try {
    for (const sql of SCHEMA) await p.query(sql);
    ready = true;
    initResult = { ok: true };
    return initResult;
  } catch (err) {
    ready = false;
    initResult = { ok: false, reason: String((err && err.message) || err) };
    return initResult;
  }
}

function enabled() {
  return Boolean(db.enabled());
}

function status() {
  if (ready) return "postgres";
  return enabled() ? "postgres (unavailable)" : "unavailable";
}

function available() {
  return ready;
}

function unavailable() {
  return { ok: false, code: "DB_UNAVAILABLE", message: "客户/流水数据库不可用（" + initResult.reason + "）" };
}

/* ---------------- 工具 ---------------- */

function newId(prefix) {
  return prefix + crypto.randomBytes(4).toString("hex").toUpperCase();
}

function clean(v, max) {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  if (!s) return null;
  return max ? s.slice(0, max) : s;
}

function money(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function currency(v) {
  const c = String(v || "").toUpperCase();
  return CURRENCIES.includes(c) ? c : null;
}

function round(n, cur) {
  return cur === "KHR" ? Math.round(n) : Math.round(n * 100) / 100;
}

function mapCustomer(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    nationalId: row.national_id,
    bakongAccount: row.bakong_account,
    kycStatus: row.kyc_status,
    note: row.note,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at
  };
}

function mapAccount(row) {
  if (!row) return null;
  return {
    accountId: row.account_id,
    customerId: row.customer_id,
    label: row.label,
    currency: row.currency,
    balance: Number(row.balance),
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at
  };
}

function mapTxn(row) {
  if (!row) return null;
  return {
    id: Number(row.id),
    ref: row.ref,
    customerId: row.customer_id,
    accountId: row.account_id,
    kind: row.kind,
    direction: row.direction,
    amount: Number(row.amount),
    currency: row.currency,
    counterparty: row.counterparty,
    counterpartyAccount: row.counterparty_account,
    status: row.status,
    note: row.note,
    externalRef: row.external_ref,
    balanceAfter: row.balance_after === null ? null : Number(row.balance_after),
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at
  };
}

/* ---------------- 客户 ---------------- */

async function createCustomer(input) {
  if (!ready) return unavailable();
  const name = clean(input && input.name, 80);
  if (!name) return { ok: false, code: "NAME_REQUIRED", message: "客户姓名必填" };

  const phone = clean(input && input.phone, 32);
  const email = clean(input && input.email, 120);
  const nationalId = clean(input && input.nationalId, 40);
  const bakongAccount = clean(input && input.bakongAccount, 60);
  const kycStatus = clean(input && input.kycStatus, 20) || "pending";
  const note = clean(input && input.note, 240);
  const id = clean(input && input.id, 32) || newId("MB");

  try {
    const r = await pool().query(
      "insert into customers (id, name, phone, email, national_id, bakong_account, kyc_status, note) " +
        "values ($1,$2,$3,$4,$5,$6,$7,$8) returning *",
      [id, name, phone, email, nationalId, bakongAccount, kycStatus, note]
    );
    return { ok: true, customer: mapCustomer(r.rows[0]) };
  } catch (err) {
    if (err.code === "23505") {
      return { ok: false, code: "DUPLICATE", message: "手机号已被其他客户使用" };
    }
    return { ok: false, code: "DB_ERROR", message: String(err.message || err) };
  }
}

async function listCustomers(opts) {
  if (!ready) return unavailable();
  const q = clean(opts && opts.q, 60);
  const limit = Math.min(Math.max(Number((opts && opts.limit) || 50), 1), 200);
  const sql =
    "select c.*, " +
    "coalesce(a.account_count, 0) as account_count " +
    "from customers c left join lateral (" +
    "  select count(*)::int as account_count from customer_accounts ca where ca.customer_id = c.id" +
    ") a on true " +
    (q ? "where c.name ilike $2 or c.phone ilike $2 or c.bakong_account ilike $2 " : "") +
    "order by c.created_at desc limit $1";
  const params = q ? [limit, "%" + q + "%"] : [limit];
  const r = await pool().query(sql, params);
  return {
    ok: true,
    customers: r.rows.map((row) => Object.assign(mapCustomer(row), { accountCount: row.account_count }))
  };
}

async function getCustomer(id) {
  if (!ready) return unavailable();
  const r = await pool().query("select * from customers where id = $1", [String(id)]);
  if (!r.rows.length) return { ok: false, code: "NOT_FOUND", message: "客户不存在" };
  const customer = mapCustomer(r.rows[0]);
  const accounts = (await pool().query("select * from customer_accounts where customer_id = $1 order by created_at", [id]))
    .rows.map(mapAccount);
  const summary = await customerSummary(id);
  return { ok: true, customer, accounts, summary: summary.ok ? summary.summary : null };
}

async function updateCustomer(id, patch) {
  if (!ready) return unavailable();
  const fields = [];
  const params = [];
  const p = patch || {};
  const set = (col, val) => {
    params.push(val);
    fields.push(col + " = $" + params.length);
  };
  if (p.name !== undefined) {
    const name = clean(p.name, 80);
    if (!name) return { ok: false, code: "NAME_REQUIRED", message: "客户姓名不能为空" };
    set("name", name);
  }
  if (p.phone !== undefined) set("phone", clean(p.phone, 32));
  if (p.email !== undefined) set("email", clean(p.email, 120));
  if (p.nationalId !== undefined) set("national_id", clean(p.nationalId, 40));
  if (p.bakongAccount !== undefined) set("bakong_account", clean(p.bakongAccount, 60));
  if (p.kycStatus !== undefined) set("kyc_status", clean(p.kycStatus, 20) || "pending");
  if (p.note !== undefined) set("note", clean(p.note, 240));
  if (!fields.length) return { ok: false, code: "NO_FIELDS", message: "没有可更新的字段" };

  params.push(id);
  try {
    const r = await pool().query(
      "update customers set " + fields.join(", ") + ", updated_at = now() where id = $" + params.length + " returning *",
      params
    );
    if (!r.rows.length) return { ok: false, code: "NOT_FOUND", message: "客户不存在" };
    return { ok: true, customer: mapCustomer(r.rows[0]) };
  } catch (err) {
    if (err.code === "23505") return { ok: false, code: "DUPLICATE", message: "手机号已被其他客户使用" };
    return { ok: false, code: "DB_ERROR", message: String(err.message || err) };
  }
}

/* ---------------- 客户账户 ---------------- */

async function addAccount(customerId, input) {
  if (!ready) return unavailable();
  const cur = currency(input && input.currency);
  if (!cur) return { ok: false, code: "BAD_CURRENCY", message: "币种仅支持 USD / KHR" };
  const kind = String((input && input.type) || "Payment");
  const bal = money((input && input.balance) === undefined ? 0 : input.balance);
  if (bal === null || bal < 0) return { ok: false, code: "BAD_BALANCE", message: "初始余额不合法" };

  const exists = await pool().query("select 1 from customers where id = $1", [customerId]);
  if (!exists.rows.length) return { ok: false, code: "NOT_FOUND", message: "客户不存在" };

  let accountId = clean(input && input.accountId, 32);
  if (!accountId) {
    do {
      accountId = "000" + String(Math.floor(100000000 + Math.random() * 899999999));
    } while ((await pool().query("select 1 from customer_accounts where account_id = $1", [accountId])).rows.length);
  }
  const label = clean(input && input.label, 40) || cur + " · " + (kind === "Savings" ? "Savings" : "Current");

  try {
    const r = await pool().query(
      "insert into customer_accounts (account_id, customer_id, label, currency, balance) " +
        "values ($1,$2,$3,$4,$5) returning *",
      [accountId, customerId, label, cur, round(bal, cur)]
    );
    return { ok: true, account: mapAccount(r.rows[0]) };
  } catch (err) {
    if (err.code === "23505") return { ok: false, code: "DUPLICATE_ACCOUNT", message: "账户号已存在" };
    return { ok: false, code: "DB_ERROR", message: String(err.message || err) };
  }
}

/* ---------------- 流水 ---------------- */

async function customerSummary(customerId) {
  if (!ready) return unavailable();
  const r = await pool().query(
    "select direction, currency, count(*)::int as total," +
      " sum(amount) as amount from transactions where customer_id = $1 group by direction, currency",
    [customerId]
  );
  const summary = {};
  r.rows.forEach((row) => {
    const cur = row.currency;
    if (!summary[cur]) {
      summary[cur] = { currency: cur, count: 0, inCount: 0, inAmount: 0, outCount: 0, outAmount: 0, net: 0 };
    }
    const count = Number(row.total);
    const amount = Number(row.amount);
    summary[cur].count += count;
    if (row.direction === "in") {
      summary[cur].inCount = count;
      summary[cur].inAmount = amount;
    } else {
      summary[cur].outCount = count;
      summary[cur].outAmount = amount;
    }
    summary[cur].net = summary[cur].inAmount - summary[cur].outAmount;
  });
  const countRow = await pool().query("select count(*)::int as n, max(created_at) as last from transactions where customer_id = $1", [customerId]);
  return {
    ok: true,
    summary: {
      byCurrency: summary,
      transactionCount: countRow.rows[0].n,
      lastTransactionAt:
        countRow.rows[0].last instanceof Date ? countRow.rows[0].last.toISOString() : countRow.rows[0].last
    }
  };
}

async function listTransactions(customerId, opts) {
  if (!ready) return unavailable();
  const limit = Math.min(Math.max(Number((opts && opts.limit) || 50), 1), 200);
  const r = await pool().query(
    "select * from transactions where customer_id = $1 order by created_at desc, id desc limit $2",
    [customerId, limit]
  );
  return { ok: true, transactions: r.rows.map(mapTxn) };
}

/**
 * 写入一条流水。同一 ref 只记一次（重复调用返回已有记录）。
 * 传入 applyBalance=true 时，按方向同步增减对应客户账户的余额。
 */
async function recordTransaction(input) {
  if (!ready) return unavailable();
  const customerId = clean(input && input.customerId, 32);
  if (!customerId) return { ok: false, code: "CUSTOMER_REQUIRED", message: "缺少 client customerId" };

  const dir = String((input && input.direction) || "out").toLowerCase();
  if (!DIRECTIONS.includes(dir)) return { ok: false, code: "BAD_DIRECTION", message: "direction 仅支持 in / out" };
  const kind = String((input && input.kind) || "transfer").toLowerCase();
  if (!KINDS.includes(kind)) return { ok: false, code: "BAD_KIND", message: "不支持的流水类型：" + kind };
  const accountId = clean(input && input.accountId, 32);

  // 币种：显式传入优先，其次取账户币种，最后默认 USD
  let accountRow = null;
  if (accountId) {
    const acct = await pool().query("select * from customer_accounts where account_id = $1", [accountId]);
    if (acct.rows.length) {
      accountRow = acct.rows[0];
      if (accountRow.customer_id !== customerId) accountRow = null;
    }
  }
  const cur = currency(input && input.currency) || (accountRow && accountRow.currency) || "USD";
  const amount = money(input && input.amount);
  if (amount === null || amount <= 0) return { ok: false, code: "BAD_AMOUNT", message: "金额必须大于 0" };
  const value = round(amount, cur);
  const ref = clean(input && input.ref, 80) || newId("TX");
  const applyBalance = Boolean(input && input.applyBalance);

  let balanceAfter = null;
  if (applyBalance) {
    if (!accountId) return { ok: false, code: "ACCOUNT_REQUIRED", message: "调整余额时必须指定 accountId" };
    if (!accountRow) return { ok: false, code: "ACCOUNT_NOT_FOUND", message: "账户不属于该客户" };
    const row = accountRow;
    if (row.currency !== cur) return { ok: false, code: "CURRENCY_MISMATCH", message: "账户币种与流水币种不一致" };
    const delta = dir === "in" ? value : -value;
    if (dir === "out" && Number(row.balance) < value) {
      return { ok: false, code: "INSUFFICIENT_FUNDS", message: "余额不足" };
    }
    balanceAfter = round(Number(row.balance) + delta, cur);
    await pool().query("update customer_accounts set balance = $1 where account_id = $2", [balanceAfter, accountId]);
  }

  try {
    const r = await pool().query(
      "insert into transactions (ref, customer_id, account_id, kind, direction, amount, currency, " +
        "counterparty, counterparty_account, status, note, external_ref, balance_after) " +
        "values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) returning *",
      [
        ref,
        customerId,
        accountId,
        kind,
        dir,
        value,
        cur,
        clean(input && input.counterparty, 80),
        clean(input && input.counterpartyAccount, 60),
        clean(input && input.status, 20) || "completed",
        clean(input && input.note, 160),
        clean(input && input.externalRef, 120),
        balanceAfter
      ]
    );
    return { ok: true, transaction: mapTxn(r.rows[0]) };
  } catch (err) {
    if (err.code === "23505") {
      const dup = await pool().query("select * from transactions where ref = $1", [ref]);
      return { ok: true, transaction: mapTxn(dup.rows[0]), duplicate: true };
    }
    return { ok: false, code: "DB_ERROR", message: String(err.message || err) };
  }
}

/* ---------------- 与 store 的镜像同步 ---------------- */

async function customerOfAccount(accountId) {
  if (!ready || !accountId) return null;
  const r = await pool().query("select customer_id from customer_accounts where account_id = $1", [String(accountId)]);
  return r.rows.length ? r.rows[0].customer_id : null;
}

/** 把 store 里的一次内部转账镜像成两个客户（可能同一人）的流水 */
async function recordTransfer(transfer, accounts) {
  if (!ready || !transfer) return;
  try {
    const toName = (accounts || []).find((a) => a.id === transfer.to);
    const fromName = (accounts || []).find((a) => a.id === transfer.from);
    const fromCustomer = await customerOfAccount(transfer.from);
    const toCustomer = await customerOfAccount(transfer.to);

    if (fromCustomer) {
      await recordTransaction({
        customerId: fromCustomer,
        accountId: transfer.from,
        kind: "transfer",
        direction: "out",
        amount: transfer.amount,
        currency: transfer.currency,
        counterparty: (toName && (toName.name || toName.label)) || transfer.to,
        counterpartyAccount: transfer.to,
        ref: transfer.ref + "/out",
        note: transfer.note,
        status: transfer.status
      });
      await syncAccountBalance(transfer.from, (accounts || []).find((a) => a.id === transfer.from));
    }
    if (toCustomer) {
      await recordTransaction({
        customerId: toCustomer,
        accountId: transfer.to,
        kind: "transfer",
        direction: "in",
        amount: transfer.amount,
        currency: transfer.currency,
        counterparty: (fromName && (fromName.name || fromName.label)) || transfer.from,
        counterpartyAccount: transfer.from,
        ref: transfer.ref + "/in",
        note: transfer.note,
        status: transfer.status
      });
      await syncAccountBalance(transfer.to, (accounts || []).find((a) => a.id === transfer.to));
    }
  } catch (err) {
    console.error("[customers] 转账镜像失败:", err.message);
  }
}

/** 把 store 里的扫码/KHQR 支付镜像成付款人流水 */
async function recordKhqr(payment, record) {
  if (!ready || !record) return;
  try {
    const customerId = await customerOfAccount(record.from);
    if (!customerId) return;
    await recordTransaction({
      customerId,
      accountId: record.from,
      kind: "khqr",
      direction: "out",
      amount: record.amount,
      currency: record.currency,
      counterparty: record.to,
      counterpartyAccount: record.merchantId || null,
      ref: record.ref + "/qr",
      note: record.note,
      externalRef: record.externalRef,
      status: record.status,
      balanceAfter: record.balanceAfter === undefined ? null : record.balanceAfter
    });
    await syncBalance(record.from, record.balanceAfter);
  } catch (err) {
    console.error("[customers] 支付镜像失败:", err.message);
  }
}

async function syncAccountBalance(accountId, account) {
  if (!ready || !account) return;
  await syncBalance(accountId, account.balance);
}

async function syncBalance(accountId, balance) {
  if (!ready || !accountId || balance === undefined || balance === null) return;
  try {
    await pool().query(
      "update customer_accounts set balance = $1 where account_id = $2",
      [Number(balance), String(accountId)]
    );
  } catch (err) {
    console.error("[customers] 余额同步失败:", err.message);
  }
}

/**
 * 把 store 里新开的账户登记到第一个客户名下（已有则只同步余额），
 * 这样后续转账、扫码支付的流水才有归属客户。
 */
async function registerAccount(account) {
  if (!ready || !account || !account.id) return;
  const cur = currency(account.currency);
  if (!cur) return;
  try {
    const exists = await pool().query("select 1 from customer_accounts where account_id = $1", [account.id]);
    if (exists.rows.length) {
      await syncBalance(account.id, account.balance);
      return;
    }
    const def = await pool().query("select id from customers order by created_at asc limit 1");
    if (!def.rows.length) return;
    await pool().query(
      "insert into customer_accounts (account_id, customer_id, label, currency, balance) " +
        "values ($1,$2,$3,$4,$5) on conflict (account_id) do update set balance = excluded.balance",
      [account.id, def.rows[0].id, account.label || cur, cur, Number(account.balance) || 0]
    );
  } catch (err) {
    console.error("[customers] 账户登记失败:", err.message);
  }
}

/* ---------------- 迁移：把现有演示账户变成第一个客户 ---------------- */
async function migrateFromState(blob) {
  if (!ready) return { ok: false };
  const accounts = (blob && blob.accounts) || [];
  const transfers = (blob && blob.transfers) || [];
  const count = await pool().query("select count(*)::int as n from customers");
  if (Number(count.rows[0].n) > 0) return { ok: true, migrated: 0, skipped: true };
  if (!accounts.length) return { ok: true, migrated: 0 };

  const created = await createCustomer({
    name: (blob.accounts[0] && blob.accounts[0].name) || "MB Cambodia · 默认客户",
    note: "由原有演示账户自动迁移"
  });
  if (!created.ok) return created;
  const customerId = created.customer.id;

  let migrated = 0;
  for (const a of accounts) {
    const cur = currency(a.currency);
    if (!cur) continue;
    try {
      await pool().query(
        "insert into customer_accounts (account_id, customer_id, label, currency, balance) " +
          "values ($1,$2,$3,$4,$5) on conflict (account_id) do nothing",
        [a.id, customerId, a.label || cur, cur, Number(a.balance) || 0]
      );
      migrated += 1;
    } catch (err) {
      console.error("[customers] 账户迁移失败:", a.id, err.message);
    }
  }

  for (const t of transfers.slice(0, 200)) {
    try {
      await recordTransaction({
        customerId,
        accountId: t.from,
        kind: t.external ? "khqr" : "transfer",
        direction: "out",
        amount: t.amount,
        currency: t.currency || "USD",
        counterparty: t.to,
        counterpartyAccount: t.merchantId || null,
        ref: (t.ref || newId("TX")) + "/migrated",
        note: t.note,
        status: t.status || "completed",
        externalRef: t.externalRef
      });
    } catch (err) {
      console.error("[customers] 流水迁移失败:", err.message);
    }
  }

  return { ok: true, migrated, customerId };
}

module.exports = {
  init,
  status,
  available,
  createCustomer,
  listCustomers,
  getCustomer,
  updateCustomer,
  addAccount,
  listTransactions,
  recordTransaction,
  customerSummary,
  recordTransfer,
  recordKhqr,
  syncBalance,
  registerAccount,
  migrateFromState,
  customerOfAccount
};
