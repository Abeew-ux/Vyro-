/* VYRO — service worker : démarrage rapide, hors-ligne de base, clic sur une notification */
const V = 'vyro-v8';
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
// notification push : message ou appel reçu appli fermée
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data.json(); } catch (_) { d = { title: 'VYRO', body: e.data ? e.data.text() : '' }; }
  e.waitUntil((async () => {
    const cs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (cs.some(c => c.visibilityState === 'visible')) return; // appli ouverte : elle gère déjà alertes et sons
    await self.registration.showNotification(d.title || 'VYRO', {
      body: d.body || '', tag: d.tag || 'vyro', renotify: true,
      icon: 'icon-192.png', badge: 'icon-192.png',
      vibrate: d.t === 'call' ? [400, 200, 400, 200, 400] : [120, 60, 120],
      requireInteraction: d.t === 'call', silent: false,
      data: { cid: d.cid || null, v: d.v || null, t: d.t || 'msg' }
    });
  })());
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const cid = e.notification.data && e.notification.data.cid, vid = e.notification.data && e.notification.data.v;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    if (cs.length) { cs[0].focus(); if (cid) cs[0].postMessage({ open: cid }); else if (vid) cs[0].postMessage({ video: vid }); return; }
    return self.clients.openWindow(cid ? './?open=' + encodeURIComponent(cid) : vid ? './?v=' + encodeURIComponent(vid) : './');
  }));
});
