"use strict";

self.addEventListener("install", function (event) {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        return caches.delete(key);
      }));
    }).then(function () {
      return self.clients.claim();
    }).then(function () {
      return self.clients.matchAll({ type: "window" });
    }).then(function (clientList) {
      clientList.forEach(function (client) {
        client.navigate(client.url);
      });
    })
  );
});

self.addEventListener("fetch", function (event) {
  // Always fetch fresh from network to prevent stale caching during dev
  event.respondWith(fetch(event.request));
});
