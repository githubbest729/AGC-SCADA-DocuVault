/* ==========================================================================
   service-worker.js — AGC SCADA DocuVault
   App-shell precache + offline fallback. IndexedDB data lives in the page,
   not here — this only makes the app itself (HTML/CSS/JS/icons) available
   with zero network connection.
   ========================================================================== */

const CACHE_VERSION = "agc-docuvault-v2"; // Bumped version to force cache refresh
const APP_SHELL_CACHE = `${CACHE_VERSION}-shell`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

// Local files that make up the installable app shell.
// FIXED: Using relative paths ("./") so GitHub pages routing doesn't break.
const APP_SHELL_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./database.js",
  "./seed-data.js", // ADDED: Seed data script
  "./manifest.json",
  "./favicon.ico",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-192.png",
  "./icons/icon-maskable-512.png",
  "./icons/icon-152.png",
  "./icons/icon-180.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-16x16.png",
  "./icons/favicon-32x32.png",
  "./icons/favicon-48x48.png"
];

// Third-party CDN assets — cached at runtime (stale-while-revalidate) so the
// editor and PDF export still work offline after the first successful load.
const RUNTIME_ORIGINS = [
  "https://cdnjs.cloudflare.com", // For html2pdf
  "https://cdn.jsdelivr.net"      // ADDED: For marked.js
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

  // Navigation requests: try network first, fall back to cached shell.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(APP_SHELL_CACHE).then((cache) => cache.put("./index.html", copy));
          return res;
        })
        .catch(() =>
          caches.match("./index.html")
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
