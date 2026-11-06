/* VYRO — service worker : démarrage rapide, hors-ligne de base, clic sur une notification */
const V = 'vyro-v3';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL).catch(() => {})).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// réseau d'abord (toujours la dernière version), cache en secours
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;
  e.respondWith(
    fetch(r).then(res => {
      const cp = res.clone();
      caches.open(V).then(c => c.put(r, cp)).catch(() => {});
      return res;
    }).catch(() => caches.match(r).then(m => m || caches.match('./index.html')))
  );
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const cid = e.notification.data && e.notification.data.cid;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    if (cs.length) { cs[0].focus(); cs[0].postMessage({ open: cid }); return; }
    return self.clients.openWindow('./');
  }));
});
