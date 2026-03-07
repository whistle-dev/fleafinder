const SHELL_CACHE = "fleafinder-shell-v1";
const DATA_CACHE = "fleafinder-data-v1";
const DETAIL_CACHE = "fleafinder-detail-v1";

const OFFLINE_SHELL = ["/da", "/en", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(OFFLINE_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => ![SHELL_CACHE, DATA_CACHE, DETAIL_CACHE].includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (url.pathname.startsWith("/api/explorer")) {
    event.respondWith(networkFirst(event.request, DATA_CACHE, new Response(JSON.stringify({ markets: [], offline: true }), { headers: { "Content-Type": "application/json" } })));
    return;
  }

  if (url.pathname.includes("/markets/")) {
    event.respondWith(staleWhileRevalidate(event.request, DETAIL_CACHE));
    return;
  }

  if (url.pathname === "/da" || url.pathname === "/en" || url.pathname.endsWith("/markets")) {
    event.respondWith(networkFirst(event.request, SHELL_CACHE));
    return;
  }

  if (event.request.destination === "image") {
    event.respondWith(cacheFirst(event.request, DETAIL_CACHE));
  }
});

async function networkFirst(request, cacheName, fallbackResponse) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch {
    return (await cache.match(request)) || fallbackResponse || caches.match("/da");
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached || caches.match("/da"));

  return cached || networkPromise;
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  cache.put(request, response.clone());
  return response;
}
