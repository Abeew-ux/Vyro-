/* VYRO — service worker : démarrage rapide, hors-ligne de base, clic sur une notification */
const V = 'vyro-v10';
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
const replyActions = d => (d.t === 'msg' && d.rt && d.ru) ? [{ action: 'reply', type: 'text', title: 'Répondre', placeholder: 'Écrire un message…' }] : [];
// boîte d'envoi : les réponses faites depuis la notification attendent ici que l'appli les range dans la conversation
const obDb = () => new Promise((res, rej) => { const r = indexedDB.open('vyro_outbox', 1); r.onupgradeneeded = () => r.result.createObjectStore('o', { keyPath: 'id' }); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
const obPut = async it => { const db = await obDb(); await new Promise((res, rej) => { const tx = db.transaction('o', 'readwrite'); tx.objectStore('o').put(it); tx.oncomplete = res; tx.onerror = () => rej(tx.error); }); db.close(); };
async function sendReply(e, dt) {
  const text = (e.reply || '').trim(), n = e.notification, tag = n.tag;
  if (!text) return;
  let ok = false, res = null;
  try {
    const r = await fetch(dt.ru, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ t: dt.rt, text }) });
    if (r.ok) { res = await r.json(); ok = true; }
  } catch (_) {}
  if (ok) {
    try { await obPut({ id: res.id, cid: res.cid, uid: res.uid, body: text, created_at: res.created_at }); } catch (_) {}
    const cs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    cs.forEach(c => c.postMessage({ outbox: 1 }));
  }
  const short = text.length > 90 ? text.slice(0, 89) + '…' : text;
  await self.registration.showNotification(dt.title || 'VYRO', {
    body: ok ? '✓ Toi : ' + short : '⚠️ Envoi impossible : appuie pour ouvrir VYRO',
    tag, renotify: false, silent: true, icon: 'icon-192.png', badge: 'icon-192.png',
    actions: ok ? replyActions({ t: 'msg', rt: dt.rt, ru: dt.ru }) : [],
    data: dt
  });
}
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
      actions: replyActions(d),
      data: { cid: d.cid || null, v: d.v || null, t: d.t || 'msg', rt: d.rt || null, ru: d.ru || null, title: d.title || 'VYRO' }
    });
  })());
});
self.addEventListener('notificationclick', e => {
  const dt = e.notification.data || {};
  if (e.action === 'reply' && dt.rt && dt.ru && typeof e.reply === 'string') { e.waitUntil(sendReply(e, dt)); return; }
  e.notification.close();
  const cid = e.notification.data && e.notification.data.cid, vid = e.notification.data && e.notification.data.v;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    if (cs.length) { cs[0].focus(); if (cid) cs[0].postMessage({ open: cid }); else if (vid) cs[0].postMessage({ video: vid }); return; }
    return self.clients.openWindow(cid ? './?open=' + encodeURIComponent(cid) : vid ? './?v=' + encodeURIComponent(vid) : './');
  }));
});
