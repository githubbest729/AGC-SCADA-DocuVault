/* ==========================================================================
   service-worker.js — AGC SCADA DocuVault
   App-shell precache + offline fallback. IndexedDB data lives in the page,
   not here — this only makes the app itself (HTML/CSS/JS/icons) available
   with zero network connection.
   ========================================================================== */

const CACHE_VERSION = "agc-docuvault-v1";
const APP_SHELL_CACHE = `${CACHE_VERSION}-shell`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

// Local files that make up the installable app shell.
// Update CACHE_VERSION whenever any of these change so old caches are purged.
const APP_SHELL_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./database.js",
  "./manifest.json",
  "./offline.html",
  "./icon-192.png",
  "./icon-512.png",
  "./favicon-16x16.png",
  "./favicon-32x32.png",
  "./favicon-48x48.png",
  "./favicon.ico",
  "./apple-touch-icon.png",
];

// Third-party CDN assets — cached at runtime (stale-while-revalidate) so the
// editor and PDF export still work offline after the first successful load.
const RUNTIME_ORIGINS = [
  "https://cdnjs.cloudflare.com",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(APP_SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL_FILES))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn("[SW] Precache failed:", err))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("agc-docuvault-") && key !== APP_SHELL_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

function isRuntimeCdnRequest(url) {
  return RUNTIME_ORIGINS.some((origin) => url.startsWith(origin));
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = req.url;

  // Navigation requests: try network first, fall back to cached shell, then offline page.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(APP_SHELL_CACHE).then((cache) => cache.put("./index.html", copy));
          return res;
        })
        .catch(() =>
          caches.match("./index.html").then((cached) => cached || caches.match("./offline.html"))
        )
    );
    return;
  }

  // CDN libraries (marked.js, html2pdf.js): stale-while-revalidate.
  if (isRuntimeCdnRequest(url)) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then((cache) =>
        cache.match(req).then((cached) => {
          const networkFetch = fetch(req)
            .then((res) => {
              cache.put(req, res.clone());
              return res;
            })
            .catch(() => cached);
          return cached || networkFetch;
        })
      )
    );
    return;
  }

  // Everything else in the app shell: cache-first, network fallback.
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(APP_SHELL_CACHE).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => cached);
    })
  );
});
