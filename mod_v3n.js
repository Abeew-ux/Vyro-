/* ---------- VYRO World : écran d'accueil du jeu (le monde 3D viendra avec le jeu) ---------- */
(function(){
 const st=document.createElement('style');
 st.textContent=`
#s-world{background:#070b1d;color:#fff;overflow:hidden}
#s-world .wbg{position:absolute;inset:0;background:radial-gradient(70% 38% at 50% 52%,rgba(236,72,153,.42),rgba(168,85,247,.22) 45%,transparent 72%),linear-gradient(180deg,#0b1030 0%,#0a0f26 48%,#10112e 100%)}
#s-world .wfloor{position:absolute;left:-30%;right:-30%;bottom:-6%;height:50%;transform:perspective(380px) rotateX(62deg);transform-origin:50% 100%;background:linear-gradient(rgba(168,85,247,.55) 1px,transparent 1px) 0 0/100% 46px,linear-gradient(90deg,rgba(168,85,247,.55) 1px,transparent 1px) 0 0/46px 100%;-webkit-mask-image:linear-gradient(transparent,#000 40%);mask-image:linear-gradient(transparent,#000 40%);opacity:.55}
#s-world .wring{position:absolute;left:50%;top:56%;width:230px;height:230px;margin:-115px 0 0 -115px;border-radius:50%;border:2px solid rgba(236,72,153,.55);box-shadow:0 0 40px rgba(236,72,153,.45),inset 0 0 40px rgba(168,85,247,.35);transform:rotateX(68deg);animation:wpulse 3.2s ease-in-out infinite}
#s-world .wring.r2{width:150px;height:150px;margin:-75px 0 0 -75px;animation-delay:-1.6s;border-color:rgba(168,85,247,.7)}
@keyframes wpulse{50%{transform:rotateX(68deg) scale(1.12);opacity:.55}}
#s-world .wsoon{position:absolute;left:0;right:0;top:46%;text-align:center;font-weight:700;opacity:.7;font-size:15px;letter-spacing:.02em;pointer-events:none}
#s-world .wdots i{position:absolute;width:4px;height:4px;border-radius:50%;background:#fff;opacity:.5;animation:wfl 6s ease-in-out infinite}
@keyframes wfl{50%{transform:translateY(-18px);opacity:.15}}
#s-world .wtop{position:absolute;left:0;right:0;top:0;padding:calc(env(safe-area-inset-top,0px) + 12px) 14px 0;display:flex;align-items:center;gap:10px;z-index:2}
#s-world .wib{flex:none;width:44px;height:44px;border-radius:16px;border:1px solid rgba(255,255,255,.1);background:rgba(10,14,32,.72);color:#fff;display:grid;place-items:center;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
#s-world .wib .ic{width:22px;height:22px}
#s-world .wpill{margin-left:auto;display:flex;align-items:center;gap:10px;height:50px;padding:0 16px 0 5px;border-radius:26px;background:rgba(10,14,32,.72);border:1px solid rgba(255,255,255,.1);min-width:0;max-width:62%;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
#s-world .wpill .av{flex:none;width:40px!important;height:40px!important;box-shadow:0 0 0 2px #f5b04a}
#s-world .wpill b{font-size:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#s-world .wstats{position:absolute;left:14px;top:calc(env(safe-area-inset-top,0px) + 74px);z-index:2;display:flex;flex-direction:column;gap:9px;padding:13px 18px 13px 14px;border-radius:22px;background:rgba(10,14,32,.72);border:1px solid rgba(255,255,255,.1);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
#s-world .wst{display:flex;align-items:center;gap:12px;font-weight:800;font-size:20px;line-height:1}
#s-world .wst span{flex:none;width:30px;text-align:center;font-size:25px;filter:drop-shadow(0 0 8px rgba(250,204,21,.45))}
#s-world .wst.g span{filter:drop-shadow(0 0 8px rgba(56,189,248,.6))}
#s-world .wenter{position:absolute;left:18px;right:18px;bottom:calc(env(safe-area-inset-bottom,0px) + 106px);z-index:2;height:64px;border:3px solid #0b1a14;border-radius:34px;display:flex;align-items:center;justify-content:center;gap:12px;font-size:20px;font-weight:900;letter-spacing:.02em;color:#fff;background:linear-gradient(#34d762,#17a94a);box-shadow:0 6px 0 #0f7a33,0 12px 30px rgba(34,197,94,.35);text-transform:uppercase}
#s-world .wenter:active{transform:translateY(4px);box-shadow:0 2px 0 #0f7a33}
#s-world .wenter i{width:44px;height:36px;border-radius:9px;background:#fff;display:grid;place-items:center;color:#17a94a}
#s-world .wenter i .ic{width:20px;height:20px;fill:currentColor;stroke:none}
#s-world .wnav{position:absolute;left:0;right:0;bottom:0;z-index:2;display:flex;padding:8px 8px calc(env(safe-area-inset-bottom,0px) + 8px);background:rgba(8,12,28,.92);border-radius:30px 30px 0 0;border-top:1px solid rgba(255,255,255,.08)}
#s-world .wnav button{position:relative;flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;border:0;background:none;color:rgba(255,255,255,.72);font-weight:700;font-size:14px;padding:8px 0 10px}
#s-world .wnav svg{width:34px;height:34px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
#s-world .wnav button.cur{color:#fff}
#s-world .wnav button.cur::after{content:"";position:absolute;left:18%;right:18%;bottom:0;height:3px;border-radius:2px;background:#22c55e;box-shadow:0 0 10px #22c55e}
.wsoonbox{text-align:center;padding:18px 10px 8px}.wsoonbox .e{font-size:44px}.wsoonbox p{opacity:.7;margin:8px 0 0}
.wchar{position:absolute;left:50%;top:56%;width:112px;height:min(240px,33vh);margin:calc(-1 * min(224px,31vh)) 0 0 -56px;z-index:1;pointer-events:none;filter:drop-shadow(0 0 18px rgba(168,85,247,.55))}
.wchar svg{width:100%;height:100%;overflow:visible}
.wchar .bob{animation:wbob 3.4s ease-in-out infinite}
.wchar .al{transform-origin:30px 84px;animation:wsw 3.4s ease-in-out infinite}
.wchar .ar{transform-origin:90px 84px;animation:wsw 3.4s ease-in-out infinite reverse}
.wchar .cape{transform-origin:60px 84px;animation:wcape 3.4s ease-in-out infinite}
.wchar .eye{transform-origin:center;transform-box:fill-box;animation:wblink 4.6s infinite}
@keyframes wbob{50%{transform:translateY(-4px)}}
@keyframes wsw{50%{transform:rotate(4deg)}}
@keyframes wcape{50%{transform:skewX(3deg)}}
@keyframes wblink{0%,92%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
`;
 document.head.appendChild(st);
 const sec=document.createElement('section');sec.className='screen';sec.id='s-world';
 const IC={
  home:'<svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M10 20v-5.5h4V20"/></svg>',
  shop:'<svg viewBox="0 0 24 24"><path d="M3 4h2.5l2.2 11h10.6l2-8H6.3"/><circle cx="9.5" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/></svg>',
  bag:'<svg viewBox="0 0 24 24"><path d="M9 6V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V6"/><rect x="5" y="6" width="14" height="15" rx="4"/><path d="M9 14h6M8 10h8"/></svg>',
  users:'<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/><path d="M15.5 14.3c3 0 5.5 2 5.5 5.2"/></svg>'
 };
 sec.innerHTML=`<div class="wbg"></div><div class="wfloor"></div><div class="wring"></div><div class="wring r2"></div><div class="wchar" id="wChar"></div>
 <div class="wdots">${[[12,30,0],[84,22,1.2],[22,62,2.1],[76,58,.6],[50,18,3],[90,70,1.8],[8,76,2.7]].map(d=>`<i style="left:${d[0]}%;top:${d[1]}%;animation-delay:-${d[2]}s"></i>`).join('')}</div>
  <div class="wtop"><button type="button" class="wib" data-go="back" aria-label="Retour">${I('back')}</button><div class="wpill" id="wPill"></div><button type="button" class="wib" id="wGear" aria-label="Réglages">${I('gear')}</button></div>
 <div class="wstats"><div class="wst"><span>⭐</span><b id="wLv">Niv. 1</b></div><div class="wst"><span>🐝</span><b id="wBc">0</b></div><div class="wst g"><span>💎</span><b id="wGm">0</b></div></div>
 <button type="button" class="wenter" id="wEnter"><i>${I('play')}</i>Entrer dans le monde</button>
 <div class="wnav" id="wNav"><button type="button" data-w="home" class="cur">${IC.home}Accueil</button><button type="button" data-w="shop">${IC.shop}Boutique</button><button type="button" data-w="inv">${IC.bag}Inventaire</button><button type="button" data-w="friends">${IC.users}Amis</button></div>`;
 const host=document.getElementById('s-notifs');host.parentNode.insertBefore(sec,host.nextSibling);

  function wLook(){
  let S={};try{const d=JSON.parse(localStorage.getItem('monmonde5_'+(me&&me.id||''))||'null');if(d&&d.S)S=d.S}catch(e){}
  const hx=(c,d)=>{c=(typeof c==='number'?c:0)>>>0;let r=c>>16&255,g=c>>8&255,b=c&255;const f=d||0;r=Math.max(0,Math.min(255,Math.round(r*(1+f))));g=Math.max(0,Math.min(255,Math.round(g*(1+f))));b=Math.max(0,Math.min(255,Math.round(b*(1+f))));return'#'+((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1)};
  const skin=typeof S.skin==='number'?S.skin:0xf5c9a0,hair=typeof S.hair==='number'?S.hair:0xd2541c,shirt=typeof S.shirt==='number'?S.shirt:0x15151a,pants=typeof S.pants==='number'?S.pants:0x15151a;
  const own=S.own||{cape:0,helm:0,armor:0},eq=S.eq||{cape:1,helm:1,armor:1};
  const cape=own.cape&&eq.cape,helm=own.helm&&eq.helm,armor=own.armor&&eq.armor;
  const st='stroke="rgba(0,0,0,.45)" stroke-width="1.5" stroke-linejoin="round"';
  return `<svg viewBox="0 0 120 250" aria-hidden="true">
  <ellipse cx="60" cy="243" rx="40" ry="7" fill="rgba(0,0,0,.45)"/>
  <g class="bob">
   ${cape?`<g class="cape"><path d="M38 86 L82 86 L90 200 L30 200 Z" fill="#c0392b" ${st}/><path d="M60 86 L60 200" stroke="rgba(0,0,0,.2)" stroke-width="2"/></g>`:''}
   <rect x="38" y="152" width="20" height="84" rx="4" fill="${hx(pants)}" ${st}/><rect x="62" y="152" width="20" height="84" rx="4" fill="${hx(pants)}" ${st}/>
   <rect x="38" y="222" width="20" height="14" rx="3" fill="${hx(pants,-.35)}"/><rect x="62" y="222" width="20" height="14" rx="3" fill="${hx(pants,-.35)}"/>
   <g class="al"><rect x="14" y="84" width="20" height="62" rx="5" fill="${hx(shirt)}" ${st}/><rect x="14" y="132" width="20" height="16" rx="4" fill="${hx(skin)}" ${st}/></g>
   <g class="ar"><rect x="86" y="84" width="20" height="62" rx="5" fill="${hx(shirt)}" ${st}/><rect x="86" y="132" width="20" height="16" rx="4" fill="${hx(skin)}" ${st}/></g>
   <rect x="34" y="82" width="52" height="74" rx="6" fill="${armor?'#aab4c4':hx(shirt)}" ${st}/>
   <rect x="34" y="82" width="52" height="16" rx="6" fill="rgba(255,255,255,.12)"/>
   ${armor?'<path d="M60 90 L60 148" stroke="#6b7686" stroke-width="2"/><circle cx="60" cy="108" r="6" fill="#facc15" stroke="rgba(0,0,0,.4)"/>':''}
   <rect x="52" y="72" width="16" height="12" fill="${hx(skin,-.08)}"/>
   <rect x="38" y="22" width="44" height="52" rx="11" fill="${hx(skin)}" ${st}/>
   <path d="M38 40 Q38 20 60 20 Q82 20 82 40 L82 34 Q82 14 60 14 Q38 14 38 34 Z" fill="${hx(hair)}"/>
   <path d="M36 44 L36 28 Q36 12 60 12 Q84 12 84 28 L84 44 L78 44 L78 32 Q60 26 42 32 L42 44 Z" fill="${hx(hair)}" ${st}/>
   <rect class="eye" x="48" y="48" width="6" height="9" rx="2" fill="#111"/><rect class="eye" x="66" y="48" width="6" height="9" rx="2" fill="#111"/>
   <path d="M52 63 Q60 69 68 63" stroke="#111" stroke-width="2.2" fill="none" stroke-linecap="round"/>
   ${helm?`<path d="M34 42 L34 26 Q34 8 60 8 Q86 8 86 26 L86 42 L80 42 L80 30 L40 30 L40 42 Z" fill="#c4ccd8" ${st}/><rect x="56" y="8" width="8" height="22" fill="#9aa5b6"/>`:''}
  </g></svg>`;
 }
 function wChar(){const e=$('#wChar');if(e)e.innerHTML=wLook()}
 function wRender(){
  if(!me)return;
  wChar();
  const nm=me.display_name||me.username||'?';
  $('#wPill').innerHTML=av({name:nm,h:hue(me.username||nm),uid:me.id,avatar:me.avatar_url},40)+'<b>'+esc(nm)+'</b>';
  let bc=0;try{bc=+localStorage.getItem('vyro_bc_'+me.id)||0}catch(e){}
  $('#wBc').textContent=bc.toLocaleString('fr-FR');
 }
 window.worldSetTab=function(t){$$('#wNav button').forEach(b=>b.classList.toggle('cur',b.dataset.w===t))};
 async function wFriends(){
  const l=chats.filter(c=>c.type!=='group'&&c.uid);
  const sh=openSheet('Mes amis VYRO',l.length?`<div id="wFl">${l.map(c=>`<div class="urow" data-u="${c.uid}">${av(c,44)}<div><b>${esc(c.name)}</b><small>Ami VYRO</small></div></div>`).join('')}</div>`:'<p class="empty" style="padding:20px 10px;line-height:1.5">Pas encore d’amis ici.<br>Commence une discussion dans l’onglet Chat pour les retrouver dans VYRO World.</p>');
  sheetHook=()=>worldSetTab('home');
  sh.onclick=e=>{const u=e.target.closest('[data-u]');if(u){closeSheet();openProfile(u.dataset.u)}};
  if(!l.length)return;
  try{
   const {data}=await sb.rpc('vyro_presence',{p_ids:l.map(c=>c.uid).slice(0,50)});
   (data||[]).forEach(r=>{PRES[r.id]=r.last_seen});
   const el=$('#wFl');if(el)applyDots(el);
  }catch(e){}
 }
 function wSoon(t,e,m){openSheet(t,`<div class="wsoonbox"><div class="e">${e}</div><b>Bientôt disponible</b><p>${m}</p></div>`);sheetHook=()=>worldSetTab('home')}
 $('#wNav').addEventListener('click',e=>{
  const b=e.target.closest('[data-w]');if(!b)return;
  const w=b.dataset.w;worldSetTab(w);
  if(w==='home')closeSheet();
  else if(w==='shop')wSoon('Boutique','🛍️','Vêtements, accessoires et effets pour ton personnage, à payer en BeeCoins.');
  else if(w==='inv')wSoon('Inventaire','🎒','Retrouve ici tout ce que tu as acheté ou reçu.');
  else wFriends();
 });
 $('#wGear').onclick=()=>push('settings');
 $('#wEnter').onclick=()=>worldEnterGame();
 window.WORLD_ON=false; /* passer à true pour rouvrir VYRO World */
 window.openWorld=function(){
  if(!window.WORLD_ON){openSheet('VYRO World',`<div class="wsoonbox"><div class="e">🌍</div><b>Bientôt disponible</b><p>VYRO World est en pause pour le moment. On prépare une grosse mise à jour, reste connecté !</p></div>`);return}
  wRender();worldSetTab('home');push('world')};
 window.wRender=wRender;
})();

/* ---------- VYRO World : lancement du jeu (plein écran + paysage automatique) ---------- */
(function(){
 const st=document.createElement('style');
 st.textContent=`
#s-wgame{position:fixed;inset:0;z-index:400;background:#000;transform:none!important;overflow:hidden}
#wgBox{position:absolute;top:0;left:0;width:100%;height:100%;background:#000;overflow:hidden}
#wgBox.rot{transform-origin:0 0;transform:rotate(90deg)}
#wgFrame{position:absolute;inset:0;width:100%;height:100%;border:0;background:#9fd3ff}
#wgLoad{position:absolute;inset:0;z-index:2;overflow:hidden;color:#fff;text-align:center;background:#07030f;transition:opacity .6s ease,transform .6s ease}
#wgLoad.out{opacity:0;transform:scale(1.06);pointer-events:none}
#wgLoad .cb{position:absolute;inset:-8%;width:116%;height:116%;object-fit:cover;filter:blur(22px) brightness(.55) saturate(1.2)}
#wgLoad .ci{position:absolute;top:0;left:50%;height:100%;aspect-ratio:1;transform:translateX(-50%);object-fit:cover;animation:wgzoom 6s ease-out both}
@keyframes wgzoom{from{transform:translateX(-50%) scale(1.06)}to{transform:translateX(-50%) scale(1)}}
#wgLoad .lb{position:absolute;inset:0;pointer-events:none}
#wgLoad .lb>*{pointer-events:auto}
#wgLoad .bar{position:absolute;left:0;right:0;bottom:0;height:7px;background:rgba(255,255,255,.14);overflow:hidden}
#wgLoad .bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#a855f7,#ec4899,#22c55e);box-shadow:0 0 12px #ec4899;transition:width .25s}
#wgLoad small{position:absolute;right:calc(env(safe-area-inset-right,0px) + 16px);bottom:22px;max-width:22%;text-align:right;opacity:.9;font-size:13px;text-shadow:0 1px 6px #000}
#wgAct{position:absolute;left:50%;bottom:24px;transform:translateX(-50%);display:flex}
#wgLoad button{border:0;border-radius:18px;padding:10px 20px;font-weight:800;color:#fff;background:#7c3aed}
#wgLoad button.g{background:rgba(255,255,255,.14)}
`;
 document.head.appendChild(st);
 const sec=document.createElement('section');sec.className='screen';sec.id='s-wgame';
 sec.innerHTML=`<div id="wgBox"><iframe id="wgFrame" title="VYRO World" allow="fullscreen; autoplay; accelerometer; gyroscope"></iframe>
 <div id="wgLoad"><img class="cb" src="world-cover.jpg" alt=""><img class="ci" src="world-cover.jpg" alt=""><div class="lb"><div class="bar"><i id="wgBar"></i></div><small id="wgTip">Chargement du monde…</small><div id="wgAct" style="display:none;gap:10px"></div></div></div></div>`;
 document.body.appendChild(sec);

 const F=$('#wgFrame'),BOX=$('#wgBox'),LD=$('#wgLoad'),BAR=$('#wgBar'),TIP=$('#wgTip'),ACT=$('#wgAct');
 const META=document.querySelector('meta[name=viewport]');let metaOld=null,fsSeen=false,t0=0,pTimer=0,loading=false,readyT=0;
 const TIPS=['Parle aux Capitaines ⚓ pour voyager entre les îles','Appuie sur 🗺️ pour voir la carte de l’archipel','Chaque île a ses quêtes : cherche le panneau QUEST','Attention à la lave 🌋 : elle brûle !','Les ennemis des îles lointaines sont plus forts : monte de niveau','Un boss apparaît toutes les 5 vagues'];

 function fit(){
  if(!sec.classList.contains('on'))return;
  const W=window.innerWidth,H=window.innerHeight;
  if(H>W){BOX.classList.add('rot');BOX.style.width=H+'px';BOX.style.height=W+'px';BOX.style.left=W+'px'}
  else{BOX.classList.remove('rot');BOX.style.width='100%';BOX.style.height='100%';BOX.style.left='0'}
 }
 ['resize','orientationchange'].forEach(ev=>window.addEventListener(ev,()=>{fit();setTimeout(fit,150);setTimeout(fit,500)}));

 function setBar(p){BAR.style.width=Math.min(100,p)+'%'}
 function fail(msg){
  loading=false;clearInterval(pTimer);clearTimeout(readyT);
  TIP.textContent=msg;ACT.style.display='flex';
  ACT.innerHTML='<button type="button" id="wgRetry">Réessayer</button><button type="button" class="g" id="wgQuit">Retour</button>';
  $('#wgRetry').onclick=start;$('#wgQuit').onclick=leave;
 }
 function start(){
  loading=true;t0=Date.now();ACT.style.display='none';LD.classList.remove('out');setBar(6);
  TIP.textContent=TIPS[Math.floor(Math.random()*TIPS.length)];
  let p=6;clearInterval(pTimer);pTimer=setInterval(()=>{p+=(88-p)*.06;setBar(p)},180);
  const uid=(me&&me.id)||'';
  F.onload=()=>{
   if(!loading)return;
   let ok=false;try{ok=!!(F.contentWindow.BABYLON||F.contentWindow.THREE)}catch(e){}
   if(!ok)fail('Impossible de charger le jeu. Vérifie ta connexion.');
  };
  clearTimeout(readyT);readyT=setTimeout(()=>{if(loading)fail('Le chargement est trop long. Vérifie ta connexion.')},60000);
  F.onerror=()=>fail('Impossible de charger le jeu.');
  F.src='world.html?u='+encodeURIComponent(uid)+'&r='+Date.now();
 }
 function lockLandscape(){
  const el=document.documentElement;
  const lk=()=>{try{const o=screen.orientation;if(o&&o.lock)return o.lock('landscape').catch(()=>{})}catch(e){}};
  try{
   const r=el.requestFullscreen?el.requestFullscreen({navigationUI:'hide'}):el.webkitRequestFullscreen?el.webkitRequestFullscreen():null;
   if(r&&r.then)r.then(()=>{fsSeen=true;return lk()}).catch(()=>lk());else lk();
  }catch(e){lk()}
 }
 window.worldEnterGame=function(){
  if(!me){toast('Connecte-toi pour jouer');return}
  metaOld=META.getAttribute('content');
  META.setAttribute('content','width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no');
  lockLandscape();
  push('wgame');fit();setTimeout(fit,120);
  start();
 };
 function cleanup(){
  loading=false;clearInterval(pTimer);clearTimeout(readyT);
  try{F.onload=null;F.removeAttribute('src');F.src='about:blank'}catch(e){}
  if(metaOld!==null){META.setAttribute('content',metaOld);metaOld=null}
  try{if(screen.orientation&&screen.orientation.unlock)screen.orientation.unlock()}catch(e){}
  try{if(document.fullscreenElement)document.exitFullscreen();else if(document.webkitFullscreenElement)document.webkitExitFullscreen()}catch(e){}
  fsSeen=false;
 }
 function leave(){if(curScreen==='wgame')back()}
 const _show=show;
 show=function(n){
  const was=curScreen;
  _show.apply(this,arguments);
  if(n==='wgame')setTimeout(fit,0);
  if(was==='wgame'&&n!=='wgame'){cleanup();if(typeof wRender==='function')wRender()}
 };
 window.addEventListener('message',e=>{
  if(e.source!==F.contentWindow||!e.data)return;
  if(e.data.vyroWorld==='exit')leave();
  else if(e.data.vyroWorld==='ready'&&loading){
   clearInterval(pTimer);clearTimeout(readyT);setBar(100);
   setTimeout(()=>{LD.classList.add('out');loading=false;try{F.contentWindow.focus()}catch(e){}},Math.max(300,1500-(Date.now()-t0)));
  }
 });
 const fsch=()=>{
  const on=!!(document.fullscreenElement||document.webkitFullscreenElement);
  if(on)fsSeen=true;
  else if(fsSeen&&curScreen==='wgame'){fsSeen=false;leave()}
 };
 document.addEventListener('fullscreenchange',fsch);document.addEventListener('webkitfullscreenchange',fsch);
})();

/* mode léger automatique pour les téléphones modestes (moins d'animations et d'effets de flou) */
(()=>{let lite=false;try{const m=navigator.deviceMemory,c=navigator.hardwareConcurrency,f=localStorage.getItem('vyro_lite');lite=!!((m&&m<=3)||(c&&c<=4));if(f==='1')lite=true;if(f==='0')lite=false}catch(e){}
 if(lite)document.documentElement.classList.add('lite');
})();

/* ---------- appli Android native (Capacitor) : jeton de notifications, ouverture depuis une notification, appels ---------- */
const isNativeApp=()=>/VyroApp/.test(navigator.userAgent);
async function nativePushSave(){
 const t=window.__fcmTok;
 if(!t||typeof me==='undefined'||!me||!me.id||window.__fcmSaved===t)return;
 window.__fcmSaved=t;
 try{const {error}=await sb.rpc('vyro_fcm_save',{p_token:t});if(error)window.__fcmSaved=null}catch(e){window.__fcmSaved=null}
}
async function nativePushRemove(){
 try{if(window.__fcmTok){await sb.rpc('vyro_fcm_remove',{p_token:window.__fcmTok});window.__fcmSaved=null}}catch(e){}
}
if(isNativeApp()){
 document.documentElement.classList.add('native');
 window.addEventListener('vyro-fcm',nativePushSave);
 setInterval(nativePushSave,4000);
 setInterval(()=>{try{const c=$('meta[name=theme-color]').content;if(c&&c!==window.__bar&&window.VyroBar){window.__bar=c;window.VyroBar.set(c)}}catch(e){}},1500);
 setInterval(()=>{
  const q=window.__vyroOpenQ;
  if(q&&typeof chats!=='undefined'&&chats&&chats.length){
   window.__vyroOpenQ=null;
   const L=window.__vyroLast;if(L&&L.c===q&&Date.now()-L.t<9000)return;
   const c=chats.find(x=>x.id===q);if(c){window.__vyroLast={c:q,t:Date.now()};try{openThread(q)}catch(e){}}
  }
  if(window.__vyroCall){const t=window.__vyroCall;window.__vyroCall=0;if(Date.now()-t<15000&&typeof me!=='undefined'&&me)try{pendingInvites()}catch(e){}}
 },600);
}
