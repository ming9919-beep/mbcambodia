"use strict";

/**
 * MongoDB Atlas 持久化层（可选）。
 *
 * 配置 MONGODB_URI 后，账户 / 支付单 / 流水 / Bakong 额度计数都存到 Atlas，
 * Render 这类临时磁盘的托管环境重启或重新部署都不会丢数据；没有配置时
 * store.js 自动退回 JSON 文件存储。
 *
 * 与 lib/db.js（Postgres）保持同一套接口：
 *   enabled / init / loadState / saveState / status / close
 * 这样 store.js 只需要换一个 backend，不需要改任何业务函数。
 */

const { MongoClient } = require("mongodb");

const URI = String(process.env.MONGODB_URI || "").trim();
const DB_NAME = String(process.env.MONGODB_DB || "mbcambodia").trim();
const STATE_ID = String(process.env.MONGODB_STATE_ID || "main").trim();

let client = null;
let collection = null;
let ready = false;

function enabled() {
  return Boolean(URI);
}

async function getCollection() {
  if (!enabled()) return null;
  if (collection) return collection;

  const timeoutMs = Number(process.env.MONGODB_TIMEOUT_MS || 8000);
  client = new MongoClient(URI, {
    appName: process.env.MONGODB_APP_NAME || "mb-cambodia-server",
    serverSelectionTimeoutMS: timeoutMs,
    connectTimeoutMS: timeoutMs,
    socketTimeoutMS: 20000,
    retryWrites: true,
    w: "majority",
    maxPoolSize: Number(process.env.MONGODB_POOL_MAX || 5)
  });

  await client.connect();
  const db = client.db(DB_NAME);
  collection = db.collection("app_state");
  // 只有一条主状态文档，_id 固定；updatedAt 便于在 Atlas 里肉眼看新鲜度
  await collection.createIndex({ updatedAt: -1 });
  return collection;
}

async function init() {
  if (!enabled()) return { ok: false, reason: "MONGODB_URI 未配置" };
  try {
    const col = await getCollection();
    await col.findOne({ _id: STATE_ID }, { projection: { _id: 1 } });
    ready = true;
    return { ok: true, db: DB_NAME };
  } catch (err) {
    ready = false;
    await close();
    return { ok: false, reason: String((err && err.message) || err) };
  }
}

async function loadState() {
  if (!ready) return null;
  const doc = await collection.findOne({ _id: STATE_ID });
  if (!doc || !doc.data || typeof doc.data !== "object") return null;
  return doc.data;
}

async function saveState(data) {
  if (!ready) return;
  await collection.updateOne(
    { _id: STATE_ID },
    { $set: { data, updatedAt: new Date() } },
    { upsert: true }
  );
}

function status() {
  if (ready) return "mongodb";
  return enabled() ? "file (mongodb unavailable)" : "file";
}

async function close() {
  ready = false;
  collection = null;
  if (client) {
    await client.close().catch(() => {});
    client = null;
  }
}

module.exports = { enabled, init, loadState, saveState, status, close, dbName: DB_NAME };
