/*
 * 后端接口地址配置
 * - 同源部署（server 同时托管静态页）：保持 "/api"
 * - 静态站部署（GitHub Pages 等）：填后端的完整地址，例如
 *   "https://xxx.trycloudflare.com/api"
 *   浏览器存在跨域，服务端已返回 Access-Control-Allow-Origin: *，无需额外配置。
 */
(function () {
  window.MB_API_BASE = "https://mb-cambodia-api.onrender.com/api";

  var base = window.MB_API_BASE;
  // 同源（或未配置）时不需要改写请求
  if (!base || base.charAt(0) === "/") return;

  var realFetch = window.fetch;
  if (!realFetch) return;

  window.fetch = function (input, init) {
    if (typeof input === "string" && input.indexOf("/api/") === 0) {
      // "/api/xxx" -> "<base>/xxx"
      input = base + input.slice(4);
    }
    return realFetch.call(window, input, init);
  };
})();
