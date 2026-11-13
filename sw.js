/* VYRO — service worker : démarrage rapide, hors-ligne de base, clic sur une notification */
const V = 'vyro-v27';
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
    tag, renotify: false, silent: true, icon: dt.ic || 'icon-192.png', badge: 'icon-192.png',
    actions: ok ? replyActions({ t: 'msg', rt: dt.rt, ru: dt.ru }) : [],
    data: dt
  });
}
// ---- icône ronde façon WhatsApp : photo du profil recadrée en cercle, ou initiale colorée si pas de photo
const ICN = new Map();
async function roundIcon(url, name) {
  const key = (url || '') + '|' + (name || '');
  if (ICN.has(key)) return ICN.get(key);
  let out = url || undefined;
  try {
    if (typeof OffscreenCanvas !== 'undefined') {
      const S = 128, cv = new OffscreenCanvas(S, S), g = cv.getContext('2d');
      g.beginPath(); g.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2); g.closePath(); g.clip();
      let ok = false;
      if (url) {
        try {
          const r = await fetch(url, { mode: 'cors' });
          if (r.ok) { const bm = await createImageBitmap(await r.blob()), m = Math.min(bm.width, bm.height); g.drawImage(bm, (bm.width - m) / 2, (bm.height - m) / 2, m, m, 0, 0, S, S); ok = true; }
        } catch (_) {}
      }
      if (!ok) {
        const nm = (name || '?').trim() || '?'; let h = 0; for (const ch of nm) h = (h * 31 + ch.charCodeAt(0)) % 360;
        g.fillStyle = 'hsl(' + h + ',55%,45%)'; g.fillRect(0, 0, S, S);
        g.fillStyle = '#fff'; g.font = 'bold 64px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillText(nm.charAt(0).toUpperCase(), S / 2, S / 2 + 4);
      }
      const blob = await cv.convertToBlob({ type: 'image/png' });
      out = await new Promise(res => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = () => res(url || undefined); fr.readAsDataURL(blob); });
    }
  } catch (_) { out = url || undefined; }
  if (ICN.size > 40) ICN.clear();
  ICN.set(key, out);
  return out;
}
const wait = ms => new Promise(r => setTimeout(r, ms));
const missedNote = async (d, icon) => self.registration.showNotification(d.title || 'VYRO', {
  body: '📞 Appel manqué', tag: 'missed-' + (d.from || 'x'), renotify: true, icon: icon || 'icon-192.png', badge: 'icon-192.png',
  vibrate: [120, 60, 120], data: { t: 'missed', title: d.title || 'VYRO' }
});
// appel entrant : la notification sonne en boucle (~36 s) jusqu'à ce qu'on réponde, qu'on la ferme ou que l'appelant raccroche
let CALL_END = 0;
async function ringCall(d, icon) {
  const t0 = Date.now();
  const o = () => ({
    body: d.body || '', tag: 'call', renotify: true, icon: icon || 'icon-192.png', badge: 'icon-192.png',
    vibrate: [500, 250, 500, 250, 500, 250, 500], requireInteraction: true, silent: false,
    actions: [{ action: 'answer', title: '📞 Répondre' }], data: { t: 'call', title: d.title || 'VYRO' }
  });
  await self.registration.showNotification(d.title || 'VYRO', o());
  for (let i = 0; i < 9; i++) {
    await wait(4000);
    const cur = await self.registration.getNotifications({ tag: 'call' });
    if (!cur.length || CALL_END >= t0) return;
    await self.registration.showNotification(d.title || 'VYRO', o());
  }
  const cur = await self.registration.getNotifications({ tag: 'call' });
  if (cur.length) { cur.forEach(n => n.close()); await missedNote(d, icon); }
}
// messages d'une même discussion : une seule notification qui s'empile (comme WhatsApp)
async function showMsg(d, icon) {
  const tag = d.tag || 'vyro';
  let lines = [], count = 0;
  try {
    const old = await self.registration.getNotifications({ tag });
    if (old.length) { const dd = old[0].data || {}; lines = dd.lines || (old[0].body ? [old[0].body] : []); count = dd.count || lines.length; }
  } catch (_) {}
  lines = lines.concat([d.body || '']).slice(-5); count += 1;
  await self.registration.showNotification((d.title || 'VYRO') + (count > 1 ? ' (' + count + ' messages)' : ''), {
    body: lines.join('\n'), tag, renotify: true, icon: icon || 'icon-192.png', badge: 'icon-192.png', vibrate: [120, 60, 120], silent: false,
    actions: replyActions(d),
    data: { cid: d.cid || null, v: d.v || null, t: d.t || 'msg', rt: d.rt || null, ru: d.ru || null, title: d.title || 'VYRO', ic: icon || null, lines, count }
  });
}
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data.json(); } catch (_) { d = { title: 'VYRO', body: e.data ? e.data.text() : '' }; }
  e.waitUntil((async () => {
    const cs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (cs.some(c => c.visibilityState === 'visible')) return; // appli ouverte : elle gère déjà alertes et sons
    const icon = await roundIcon(d.ic, d.nm || d.title);
    if (d.t === 'call') return ringCall(d, icon);
    if (d.t === 'callend') {
      CALL_END = Date.now();
      (await self.registration.getNotifications({ tag: 'call' })).forEach(n => n.close());
      return missedNote(d, icon);
    }
    if (d.t === 'msg') return showMsg(d, icon);
    await self.registration.showNotification(d.title || 'VYRO', {
      body: d.body || '', tag: d.tag || 'vyro', renotify: true, icon: icon || 'icon-192.png', badge: 'icon-192.png',
      vibrate: [120, 60, 120], silent: false,
      data: { cid: d.cid || null, v: d.v || null, t: d.t || 'msg', title: d.title || 'VYRO', ic: icon || null }
    });
  })());
});
self.addEventListener('notificationclick', e => {
  const dt = e.notification.data || {};
  if (e.action === 'reply' && dt.rt && dt.ru && typeof e.reply === 'string') { e.waitUntil(sendReply(e, dt)); return; }
  e.notification.close();
  const cid = dt.cid, vid = dt.v, isCall = dt.t === 'call';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    if (cs.length) { cs[0].focus(); if (isCall) cs[0].postMessage({ call: 1 }); else if (cid) cs[0].postMessage({ open: cid }); else if (vid) cs[0].postMessage({ video: vid }); return; }
    return self.clients.openWindow(isCall ? './?call=1' : cid ? './?open=' + encodeURIComponent(cid) : vid ? './?v=' + encodeURIComponent(vid) : './');
  }));
});
