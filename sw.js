const CACHE = 'lesezeichen-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/sortiment.html',
  '/veranstaltungen.html',
  '/ueber-uns.html',
  '/kontakt.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/assets/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const isPage = req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html');

  if (isPage) {
    // Pages: network-first, so a page edit shows up immediately for anyone
    // online; only fall back to the cached copy when offline. This is the
    // site's own content, still changing often — it must not get stuck
    // showing an old version.
    event.respondWith(
      fetch(req)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy));
          }
          return response;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('/index.html')))
    );
    return;
  }

  // Static assets (css/js/manifest/icons): cache-first for instant loads,
  // refreshed quietly in the background so the NEXT load picks up changes.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
