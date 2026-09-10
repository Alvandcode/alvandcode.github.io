/* Alvandcode service worker — offline cache.
   Strategy: pages (HTML) are NETWORK-FIRST (always fresh after push,
   cache only as offline fallback). Static assets are STALE-WHILE-
   REVALIDATE (instant repeat visits, refreshed in background).
   Bump V after big asset changes to force a clean cache. */
const V = "alvand-v1";
const CORE = [
  "/",
  "/index.html",
  "/assets/css/style.css",
  "/assets/css/theme.css",
  "/assets/js/main.js",
  "/assets/js/lang.js",
  "/assets/js/i18n1.js",
  "/assets/js/i18n2.js",
  "/assets/js/i18n3.js",
  "/assets/js/github.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(V).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()).catch(() => {})
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return; // API + CDN + fonts: network only
  const p = u.pathname;
  const isPage = e.request.mode === "navigate" || p.endsWith(".html") || p.endsWith("/");
  if (isPage) {
    e.respondWith(
      fetch(e.request).then((r) => {
        const c = r.clone();
        caches.open(V).then((cc) => cc.put(e.request, c)).catch(() => {});
        return r;
      }).catch(() =>
        caches.match(e.request).then((m) => m || caches.match("/index.html"))
      )
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then((m) => {
      const f = fetch(e.request).then((r) => {
        if (r && r.ok) {
          const c = r.clone();
          caches.open(V).then((cc) => cc.put(e.request, c)).catch(() => {});
        }
        return r;
      }).catch(() => m);
      return m || f;
    })
  );
});
