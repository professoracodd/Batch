// Batch – offline support. Always tries the internet first so updates show right away,
// and falls back to the saved copy when there's no signal.
const CACHE = 'batch-any-v1';
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(
    ['manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-180.png'].map(u => c.add(u).catch(() => {}))
  )));
});
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  e.respondWith(
    fetch(r).then(res => {
      if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); }
      return res;
    }).catch(() => caches.match(r, { ignoreSearch: true }))
  );
});
