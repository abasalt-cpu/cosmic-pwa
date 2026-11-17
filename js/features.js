// ============================================================
// [1.3.3] بخش‌های تازه‌ی کد کیهانی — آیکون‌ها از تصاویر کاربر با پس‌زمینه‌ی شفاف (مثل بقیه‌ی آیکون‌ها):
//   🎁 هدیه امروز (زنجیره‌ی ورود روزانه + پاداش)
//   ☕ فال قهوه (عکس فنجان + تفسیر نشانه‌ها)
//   🃏 فال تاروت (پراکند سه‌کارتی فارسی)
//   🌟 طالع هفته (طالع‌بینی هفتگی ۱۲ برج)
//   🖼 کارت اشتراک‌گذاری (Canvas) + 🎉 مناسبت‌های تقویم شمسی
// همه‌چیز سمتِ کلاینت است؛ بدون اینترنت هم کار می‌کند.
// این فایل «قبل» از app.js لود می‌شود و فقط تابع‌های تازه تعریف می‌کند.
// ============================================================
(function(){
  if(document.getElementById('cc-features-css')) return;
  const st=document.createElement('style'); st.id='cc-features-css';
  st.textContent=`
/* [1.3.3] پس‌زمینه‌ی کارت هدیه دقیقاً هم‌رنگ کارت «خوش اومدی» است (همان گرادیانت .card)؛
   آیکونِ هدیه هم پس‌زمینه‌ی شفاف دارد تا هیچ مربعِ ناهم‌رنگ دیده نشود. */
.cc-gift{display:flex; flex-direction:row-reverse; gap:12px; align-items:center; border:1.5px solid #caa14e; border-radius:24px;
  background:linear-gradient(180deg,#0e1030e6,#0a0b22f2); padding:14px 16px; margin:8px 0; box-shadow:0 0 0 1px #e8b84b1f, 0 0 30px #e8b84b14, inset 0 0 24px #e8b84b0a;}
.cc-gift .g-art{flex:0 0 112px; width:112px; height:112px; border-radius:18px; border:none;
  background:transparent; padding:0; object-fit:contain;}
.cc-gift .g-tx{flex:1; min-width:0;}
.cc-gift .g-title{color:#f7cf6b; font-weight:800; font-size:16.5px; margin:0; line-height:1.6;}
.cc-gift .g-sub{color:#d3cbf1; font-size:12.5px; margin:2px 0 10px; line-height:1.8;}
.cc-gift .g-chip{display:inline-flex; align-items:center; gap:6px; border:1.5px solid #e0a94e; border-radius:999px;
  padding:8px 18px; color:#f0c96a; font-weight:800; font-size:13px; background:rgba(232,150,45,.13);}
.cc-gift .g-btn{width:auto; min-width:150px; align-self:flex-start; padding:10px 24px; font-size:14.5px; border-radius:999px; animation:ccPulse 2.2s ease-in-out infinite;}
@keyframes ccPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
.cc-occ{display:flex; gap:10px; align-items:center; border:1px solid #e8b84b44; border-radius:18px;
  background:linear-gradient(160deg,#191040,#0d0f2b); padding:10px 14px; margin:0 0 8px;}
.cc-occ .og{font-size:22px;}
.cc-occ .ot{font-size:12.5px; line-height:1.9; color:var(--text);}
.cc-occ .ot b{color:#f0c96a;}
.cc-hero{width:190px; height:190px; border-radius:26px; border:1.5px solid #e8b84b; display:block;
  margin:4px auto 10px; object-fit:cover; box-shadow:0 0 26px #7a3cbe55, 0 0 0 4px #e8b84b18;}
.cc-limit{color:var(--text-dim); font-size:12px; text-align:center; margin:2px 0 10px; line-height:1.8;}
.cc-sec{color:#f0c96a; font-weight:800; font-size:15px; margin:16px 0 8px; display:flex; align-items:center; gap:6px;}
.cc-sym{display:flex; gap:10px; align-items:flex-start; border:1px solid #e8b84b44; border-radius:14px;
  padding:10px 12px; margin:8px 0; background:#0b0d2a99;}
.cc-sym .sg{flex:0 0 34px; font-size:26px; text-align:center;}
.cc-sym .st b{color:#f0c96a; font-size:14px;} .cc-sym .st p{margin:2px 0 0; font-size:13px; line-height:2;}
.cc-msg{border:1px solid #e8b84b55; border-radius:16px; background:linear-gradient(160deg,#191040,#0d0f2b);
  padding:14px; margin:10px 0;}
.cc-msg p{margin:0 0 10px; font-size:14px; line-height:2.2; text-align:justify; text-align-last:right;}
.cc-msg p:last-child{margin:0;}
.cc-chiprow{display:flex; gap:8px; flex-wrap:wrap; justify-content:center; margin:12px 0 4px;}
.cc-up{border:1.5px dashed #e8b84b66; border-radius:18px; padding:18px 14px; text-align:center; background:#0b0d2a66;}
.cc-up img{max-width:100%; max-height:230px; border-radius:14px; border:1px solid #e8b84b55;}
.cc-up .hint{font-size:12px; color:var(--text-dim); margin:8px 0 0; line-height:1.9;}
.cc-tarot-row{display:flex; gap:8px; justify-content:center; margin:16px 0 4px;}
.cc-tcard{flex:1 1 0; max-width:104px; aspect-ratio:5/8.2; perspective:900px; cursor:pointer; -webkit-tap-highlight-color:transparent;}
.cc-tinner{position:relative; width:100%; height:100%; transform-style:preserve-3d; transition:transform .8s cubic-bezier(.4,.2,.2,1);}
.cc-tcard.rev .cc-tinner{transform:rotateY(180deg);}
.cc-tback,.cc-tfront{position:absolute; inset:0; backface-visibility:hidden; -webkit-backface-visibility:hidden;
  border-radius:12px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px;}
.cc-tback{background:linear-gradient(160deg,#1c1040,#0d0f2b); border:1.5px solid #e8b84b; color:#f0c96a;
  font-size:24px; box-shadow:inset 0 0 0 4px #e8b84b12, 0 6px 18px #0007;}
.cc-tback .tb{font-size:9px; letter-spacing:1px; opacity:.75;}
.cc-tfront{transform:rotateY(180deg); background:linear-gradient(180deg,#241a4e,#14103a); border:1.5px solid #e8b84b; padding:6px 4px;}
.cc-tfront .g{font-size:28px; filter:drop-shadow(0 0 8px #e8b84b66);}
.cc-tfront .nm{font-size:11.5px; font-weight:800; color:#f6efdc; text-align:center; line-height:1.5;}
.cc-tfront .nn{font-size:9.5px; color:#b9a8e8;}
.cc-tcard.dis{cursor:default; opacity:.85;}
.cc-tlabel{text-align:center; font-size:11px; color:#f0c96a; border:1px solid #e8b84b55; border-radius:999px;
  padding:2px 10px; margin-top:5px; width:fit-content;}
.cc-chipgrid{display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin:10px 0;}
.cc-wchip{border:1px solid #e8b84b55; border-radius:14px; padding:10px 4px; text-align:center; cursor:pointer;
  background:linear-gradient(160deg,#16193f,#0d0f2b);}
.cc-wchip:active{transform:scale(.96);}
.cc-wchip.on{border-color:#e8b84b; box-shadow:0 0 12px #e8b84b33;}
.cc-wchip .g{font-size:20px;} .cc-wchip .nm{font-size:12px; font-weight:700; color:#f6efdc; margin-top:2px;}
.cc-wchip .mo{font-size:10px; color:#b9a8e8;}
.cc-spin{display:inline-block; font-size:38px; animation:ccSpin 1.8s linear infinite;}
@keyframes ccSpin{to{transform:rotate(360deg)}}
.cc-share-row{display:flex; gap:10px; margin-top:14px;}
.cc-share-row .btn{flex:1; padding:11px 10px; font-size:14.5px;}
`;
  document.head.appendChild(st);
})();

// ---------- ابزارهای عمومی ----------
function ccTehranDateKey(off){
  off=off||0;
  const d=new Date(Date.now()+12600000+off*86400000); // تقویم تهران (UTC+3:30) — هماهنگ با jalaliStrFa
  return d.getUTCFullYear()+'-'+(d.getUTCMonth()+1)+'-'+d.getUTCDate();
}
function ccRng(seed){
  let a=seed>>>0;
  return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; };
}
function ccHashString(s){
  let h=2166136261;
  for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); }
  return h>>>0;
}
async function ccHashFile(file){
  try{
    const u8=new Uint8Array(await file.arrayBuffer());
    let h=2166136261;
    const step=u8.length>200000?Math.ceil(u8.length/200000):1;
    for(let i=0;i<u8.length;i+=step){ h^=u8[i]; h=Math.imul(h,16777619); }
    return (h>>>0)^(u8.length*2654435761);
  }catch(e){ return Date.now()>>>0; }
}
function ccToast(msg){
  const el=document.createElement('div'); el.className='balloon-msg'; el.style.zIndex='999'; el.innerHTML=msg;
  document.body.appendChild(el);
  setTimeout(()=>{ try{ if(el&&el.remove)el.remove(); }catch(e){} },7000);
}
function ccPickN(arr,n,rng){
  const idx=arr.map((_,i)=>i), out=[];
  while(out.length<n && idx.length){ const k=Math.floor(rng()*idx.length); out.push(idx.splice(k,1)[0]); }
  return out;
}

// ---------- [1.3.4] منبع واحدِ شانس — عدد شانس و رنگ هفته، شخصی برای هر کاربر ----------
// [1.3.2] بین بخش‌های اپ یکی شد؛ ولی نباید بین همه‌ی کاربرها هم یکی باشد.
// پس seed = شناسه‌ی دستگاه + هفته‌ی ISO تهران: هر کاربر عدد و رنگِ مخصوصِ خودش را دارد؛
// در طولِ هفته ثابت است و با آغاز هفته‌ی تازه عوض می‌شود.
// [1.3.6] نمایش فقط در «طالع هفته» است — از نتیجه‌ی قهوه و طالع‌بینی روزانه حذف شد
// تا صفحه‌ها تمیز بمانند؛ مقدار برای یک کاربر همچنان در کل اپ یکی است.
function ccWeekKey(){
  const t=new Date(Date.now()+12600000);
  const iw=(typeof ccIsoWeek==='function')?ccIsoWeek(t):null;
  return iw?(iw.year+'-W'+iw.week):ccTehranDateKey();
}
function ccLuckWho(){
  let id='';
  try{ if(typeof getDeviceId==='function'){ const g=getDeviceId(); if(g) id=g; } }catch(e){}
  return id||'anon';
}
function ccLuckyNum(){ return 1+(ccHashString('cc-luckynum-'+ccLuckWho()+'-'+ccWeekKey())%99); }
function ccWeekColor(){
  const colors=(typeof CC_WEEK_COLORS!=='undefined'&&CC_WEEK_COLORS.length)?CC_WEEK_COLORS:['بنفشِ ستاره‌ای'];
  return colors[ccHashString('cc-weekcolor-'+ccLuckWho()+'-'+ccWeekKey())%colors.length];
}
// [1.3.6] فقط در نتیجه‌ی «طالع هفته» استفاده می‌شود
function ccLuckyChipsHTML(){
  return `<div class="cc-chiprow">
        <span class="chip2">🔢 عدد شانس این هفته: ${toFa(ccLuckyNum())}</span>
        <span class="chip2">🎨 رنگ هفته: ${ccWeekColor()}</span>
      </div>
      <p class="cc-limit">🔢 عدد شانس و 🎨 رنگ هفته‌ی این هفته مخصوصِ خودت است — در طولِ هفته ثابت است و با آغازِ هفته‌ی بعد عوض می‌شود ✨</p>`;
}

// ---------- [1.3.2] هدیه‌ی ویژه‌ی امروز — هر روز یک بخشِ قفل‌دار، رندوم ----------
// استخر در features_data.js (CC_GIFT_FEATURES) است: بخش‌هایی که بدون عضویت طلایی محدودیت دارند.
// انتخاب رندوم روزانه بر اساس شناسه‌ی دستگاه + تاریخ تهران؛ با گرفتن هدیه، همان بخش تا پایان
// روز بی‌نهایت باز می‌شود (داخل hasFeatureAccess در app.js به‌صورت خودکار چک می‌شود).
function ccGiftFeatureToday(){
  const pool=(typeof CC_GIFT_FEATURES!=='undefined'&&CC_GIFT_FEATURES)?CC_GIFT_FEATURES:[];
  if(!pool.length) return null;
  let id='anon'; try{ id=(typeof getDeviceId==='function'&&getDeviceId())||'anon'; }catch(e){ id='anon'; }
  const seed=ccHashString('cc-giftfeat-'+id+'-'+ccTehranDateKey());
  return pool[seed%pool.length];
}
function ccGiftFeatureActive(key){
  if(!ccGiftClaimedToday()) return false;
  const f=ccGiftFeatureToday();
  if(!f) return false;
  return key?f.key===key:true;
}

// ---------- هدیه امروز ----------
function ccGiftState(){
  try{ return safeJSONParse(localStorage.getItem('ccGift'), {last:'',streak:0,best:0}) || {last:'',streak:0,best:0}; }
  catch(e){ return {last:'',streak:0,best:0}; }
}
function ccBonusState(){
  const today=ccTehranDateKey();
  let b=null;
  try{ b=safeJSONParse(localStorage.getItem('ccGiftBonus'), null); }catch(e){ b=null; }
  if(!b || typeof b!=='object' || b.date!==today){ b={date:today, coffee:0, tarot:0}; }
  return b;
}
function ccBonusSave(b){ try{ localStorage.setItem('ccGiftBonus', JSON.stringify(b)); }catch(e){} }
function ccBonusLeft(f){ const b=ccBonusState(); return Math.max(0, Number(b[f])||0); }
function ccGiftClaimedToday(){ return ccGiftState().last===ccTehranDateKey(); }
function ccGiftMilestone(streak){
  const m=(typeof CC_GIFT_TEXTS!=='undefined'&&CC_GIFT_TEXTS.milestones)||{};
  return m[streak]||'';
}
function claimDailyGift(){
  const today=ccTehranDateKey(), yest=ccTehranDateKey(-1);
  const g=ccGiftState();
  if(g.last===today){ ccToast('هدیه‌ی امروز را گرفته‌ای — فردا بیا! 🎁'); return; }
  g.streak=(g.last===yest)?(Number(g.streak)||0)+1:1;
  g.best=Math.max(Number(g.best)||0, g.streak);
  g.last=today;
  try{ localStorage.setItem('ccGift', JSON.stringify(g)); }catch(e){}
  const b=ccBonusState(); b.coffee=(Number(b.coffee)||0)+1; b.tarot=(Number(b.tarot)||0)+1; ccBonusSave(b);
  showHome();
  const ms=ccGiftMilestone(g.streak);
  const feat=ccGiftFeatureToday();
  const isPrem=(typeof hasPremiumAccess==='function')?hasPremiumAccess():false;
  let reward=(typeof CC_GIFT_TEXTS!=='undefined')?CC_GIFT_TEXTS.toastReward:'🎁 هدیه‌ی امروز گرفتی!';
  if(!isPrem && feat){
    const prefix=(typeof CC_GIFT_TEXTS!=='undefined'&&CC_GIFT_TEXTS.toastFeatPrefix)||'🎁 هدیه‌ی ویژه‌ی امروز فعال شد:';
    reward=prefix+'<br><span style="color:#f0c96a; font-weight:800">'+feat.icon+' '+feat.title+'</span><br><span style="font-size:11.5px">'+feat.note+'</span>';
  }
  setTimeout(()=>ccToast(reward+(ms?('<br><span style="color:#f0c96a">'+ms+'</span>'):'')),400);
}
function giftBannerHTML(){
  const g=ccGiftState(), claimed=ccGiftClaimedToday();
  const art='icons/menu/icon_gift.webp';
  const isPrem=(typeof hasPremiumAccess==='function')?hasPremiumAccess():false;
  const feat=ccGiftFeatureToday();
  const featLabel=(typeof CC_GIFT_TEXTS!=='undefined'&&CC_GIFT_TEXTS.featLabel)||'هدیه‌ی ویژه‌ی امروز:';
  const featActive=(typeof CC_GIFT_TEXTS!=='undefined'&&CC_GIFT_TEXTS.featActiveNote)||'تا امشب برای تو باز است';
  if(!claimed){
    const sub=(!isPrem&&feat)?`${featLabel}<br><b style="color:#f7cf6b">${feat.icon} ${feat.title}</b> — ${feat.note}`:CC_GIFT_TEXTS.readySub;
    return `<div class="cc-gift ready">
      <img class="g-art" src="${art}" alt="هدیه" width="108" height="108" loading="lazy" decoding="async">
      <div class="g-tx">
        <p class="g-title">${CC_GIFT_TEXTS.readyTitle}</p>
        <p class="g-sub">${sub}</p>
        <button class="btn g-btn" onclick="claimDailyGift()">${CC_GIFT_TEXTS.readyBtn}</button>
      </div>
    </div>`;
  }
  const streak=Math.max(1, Number(g.streak)||1);
  const sub=(!isPrem&&feat)?`${feat.icon} <b style="color:#f7cf6b">${feat.title}</b> — ${featActive}`:CC_GIFT_TEXTS.doneSub;
  return `<div class="cc-gift">
    <img class="g-art" src="${art}" alt="هدیه" width="108" height="108" loading="lazy" decoding="async">
    <div class="g-tx">
      <p class="g-title">${CC_GIFT_TEXTS.doneTitle}</p>
      <p class="g-sub">${sub}</p>
      <span class="g-chip">${toFa(streak)} ${CC_GIFT_TEXTS.streakLabel} 🔥</span>
    </div>
  </div>`;
}
// ---------- مناسبت‌های تقویم شمسی ----------
function ccOccasionNow(){
  try{
    if(typeof gregorianToJalali!=='function') return null;
    const d=new Date(Date.now()+12600000);
    const [jy,jm,jd]=gregorianToJalali(d.getUTCFullYear(), d.getUTCMonth()+1, d.getUTCDate());
    if(jm===1 && jd===1) return CC_OCCASIONS[0];
    if(jm===1 && jd===13) return CC_OCCASIONS[1];
    if(jm===9 && jd===30) return CC_OCCASIONS[2];
    if(jm===12 && jd>=25 && d.getUTCDay()===2) return CC_OCCASIONS[3]; // آخرین سه‌شنبه‌ی سال
    return null;
  }catch(e){ return null; }
}
function occasionBannerHTML(){
  const o=ccOccasionNow();
  if(!o) return '';
  return `<div class="cc-occ"><span class="og">${o.glyph}</span><div class="ot"><b>${o.title} مبارک!</b> ${o.text}</div></div>`;
}
// ---------- تایل‌های منوی خانه ----------
function newFeatureTilesHTML(){
  return `
      <div class="menu-tile" onclick="showCoffeeFal()"><img src="icons/menu/icon_coffee.webp" class="icon-img" loading="lazy" width="88" height="88" decoding="async" alt=""><span class="label">فال قهوه</span></div>
      <div class="menu-tile" onclick="showTarotFal()"><img src="icons/menu/icon_tarot.webp" class="icon-img" loading="lazy" width="88" height="88" decoding="async" alt=""><span class="label">فال تاروت</span></div>
      <div class="menu-tile" onclick="showWeeklyFal()"><img src="icons/menu/icon_weekly.webp" class="icon-img" loading="lazy" width="88" height="88" decoding="async" alt=""><span class="label">طالع هفته</span></div>`;
}
// ---------- سهمیه‌ی رایگان + هدیه ----------
function ccCanUse(f){
  if(typeof hasFeatureAccess==='function' && hasFeatureAccess(f)) return true;
  const lim=(typeof FEATURE_FREE_LIMITS!=='undefined' && FEATURE_FREE_LIMITS[f])||1;
  const used=(typeof featureUsed==='function')?featureUsed(f):0;
  return used<lim || ccBonusLeft(f)>0;
}
function ccTryUse(f){
  if(typeof hasFeatureAccess==='function' && hasFeatureAccess(f)) return true;
  const lim=(typeof FEATURE_FREE_LIMITS!=='undefined' && FEATURE_FREE_LIMITS[f])||1;
  const used=(typeof featureUsed==='function')?featureUsed(f):0;
  if(used<lim){ if(typeof bumpFeature==='function')bumpFeature(f); return true; }
  if(ccBonusLeft(f)>0){ const b=ccBonusState(); b[f]=Math.max(0,(Number(b[f])||0)-1); ccBonusSave(b); return true; }
  return false;
}
function ccLimitNote(f,label){
  if(typeof hasFeatureAccess==='function' && hasFeatureAccess(f)) return `♾️ ${label} برای تو بی‌نهایت است — ${premBadgeFa()}`;
  const bonus=ccBonusLeft(f);
  return `🌙 هر روز ${toFa(1)} ${label}ی رایگان`+(bonus?` + ${toFa(bonus)} ${label}ی هدیه‌ی امروز 🎁`:'');
}

// ---------- کارت اشتراک‌گذاری (Canvas) ----------
let __ccShareBlob=null, __ccShareName='cosmic.png';
function ccShareCard(o){
  const W=720,H=1280;
  const c=document.createElement('canvas'); c.width=W; c.height=H;
  const x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,0,H); g.addColorStop(0,'#090a24'); g.addColorStop(1,'#1a1140');
  x.fillStyle=g; x.fillRect(0,0,W,H);
  const rg=x.createRadialGradient(W/2,330,40,W/2,330,330);
  rg.addColorStop(0,'rgba(122,60,190,.4)'); rg.addColorStop(1,'rgba(122,60,190,0)');
  x.fillStyle=rg; x.fillRect(0,0,W,H);
  const rr=ccRng(ccHashString(o.title||'cc')||7);
  for(let i=0;i<130;i++){
    x.fillStyle='rgba(255,255,255,'+(0.15+0.6*rr()).toFixed(2)+')';
    const r=0.8+1.8*rr();
    x.beginPath(); x.arc(rr()*W, rr()*H, r, 0, 7); x.fill();
  }
  x.strokeStyle='#e8b84b55'; x.lineWidth=2.5;
  x.beginPath(); x.arc(W/2,300,180,0,7); x.stroke();
  x.strokeStyle='#e8b84b22'; x.lineWidth=1.5;
  x.beginPath(); x.arc(W/2,300,200,0,7); x.stroke();
  const drawTexts=function(){
    x.textAlign='center'; x.textBaseline='middle';
    x.fillStyle='#f0c96a'; x.font='800 46px Vazirmatn, VazirLocal, Tahoma, sans-serif';
    x.fillText(o.title||'', W/2, 560);
    if(o.sub){
      x.fillStyle='#b9a8e8'; x.font='500 27px Vazirmatn, VazirLocal, Tahoma, sans-serif';
      x.fillText(o.sub, W/2, 615);
    }
    x.fillStyle='#f1eef9'; x.font='400 29px Vazirmatn, VazirLocal, Tahoma, sans-serif';
    let y=700;
    const wrap=(t)=>{
      const words=String(t).split(' '); let line='';
      for(const w of words){
        const cand=line?line+' '+w:w;
        if(x.measureText(cand).width>560 && line){ x.fillText(line,W/2,y); y+=48; line=w; }
        else line=cand;
      }
      if(line){ x.fillText(line,W/2,y); y+=48; }
    };
    (o.lines||[]).slice(0,7).forEach(wrap);
    x.fillStyle='#f0c96a'; x.font='800 34px Vazirmatn, VazirLocal, Tahoma, sans-serif';
    x.fillText('✦ کد کیهانی ✦', W/2, 1170);
    x.fillStyle='#8f86b8'; x.font='500 22px Vazirmatn, VazirLocal, Tahoma, sans-serif';
    x.fillText('cosmiccode.ir', W/2, 1210);
    try{ c.toBlob(function(b){ __ccShareBlob=b; __ccShareName=(o.file||'cosmic')+'.png';
      const url=URL.createObjectURL(b);
      const m=document.createElement('div'); m.className='modal-back'; m.id='cc-share-modal';
      m.onclick=function(ev){ if(ev.target===m) ccCloseShare(); };
      m.innerHTML=`<div class="modal-box"><div class="card orn center">
        <h2 style="margin:0 0 10px">🖼 کارت اشتراک‌گذاری</h2>
        <img src="${url}" alt="کارت" style="width:100%; max-width:290px; border-radius:14px; border:1px solid #e8b84b66">
        <div class="cc-share-row">
          <button class="btn secondary" onclick="ccDownloadShare()">⬇️ ذخیره</button>
          <button class="btn" onclick="ccDoShare()">📤 اشتراک‌گذاری</button>
        </div>
        <p class="small-note" style="margin-top:8px">کارت را در استوری، واتساپ یا تلگرام بفرست.</p>
      </div></div>`;
      document.body.appendChild(m);
    },'image/png'); }catch(e){ ccToast('ساخت کارت ناموفق بود 😕'); }
  };
  if(o.art){
    const img=new Image();
    img.onload=function(){
      const s=296, px=W/2-s/2, py=300-s/2;
      x.save();
      x.beginPath(); x.arc(W/2,300,s/2-6,0,7); x.closePath(); x.clip();
      x.drawImage(img,px,py,s,s); x.restore();
      drawTexts();
    };
    img.onerror=function(){ drawTexts(); };
    img.src=o.art;
  } else drawTexts();
}
function ccCloseShare(){
  const m=document.getElementById('cc-share-modal');
  if(m&&m.remove)m.remove();
}
function ccDownloadShare(){
  if(!__ccShareBlob) return;
  const a=document.createElement('a');
  a.href=URL.createObjectURL(__ccShareBlob); a.download=__ccShareName;
  document.body.appendChild(a); a.click(); a.remove();
}
function ccDoShare(){
  if(!__ccShareBlob) return;
  const file=null;
  try{
    const f=new File([__ccShareBlob], __ccShareName, {type:'image/png'});
    if(navigator.canShare && navigator.canShare({files:[f]})){
      navigator.share({files:[f], title:'کد کیهانی'}).catch(()=>{});
      return;
    }
    ccToast('اشتراک‌گذاری مستقیم در این مرورگر نیست — از «ذخیره» استفاده کن.');
  }catch(e){ ccToast('اشتراک‌گذاری ممکن نشد — از «ذخیره» استفاده کن.'); }
}

// ---------- ☕ فال قهوه ----------
let __ccCoffeeFile=null, __ccCoffeeUrl=null;
function showCoffeeFal(){
  const last=ccCoffeeToday();
  const can=ccCanUse('coffee');
  if(last && !can){ ccCoffeeResultPage(last,true); return; }
  if(!can){
    showFeaturePaywall('فال قهوه','سهمیه‌ی رایگان امروزت برای فال قهوه تمام شده. با عضویت طلایی بی‌نهایت فال بگیر، یا فردا دوباره سر بزن 🌙','showHome()');
    return;
  }
  render(`${backBtn('showHome()')}${pageHead('☕','فال قهوه','فنجونت را برعکس کن، صبر کن خنک شود، یک عکس از ته فنجان بگیر و برایت تفسیر کنیم.')}
    <div class="card">
      <img src="icons/menu/icon_coffee.webp" class="cc-hero" alt="" width="190" height="190" loading="lazy" decoding="async">
      <p class="cc-limit">${ccLimitNote('coffee','فال قهوه')}</p>
      <div class="cc-up">
        <div id="cc-coffee-prev"></div>
        <button class="btn secondary" id="cc-coffee-pick" onclick="document.getElementById('cc-coffee-file').click()">📷 انتخاب عکس فنجان</button>
        <input id="cc-coffee-file" type="file" accept="image/*" style="display:none" onchange="ccCoffeePicked(this)">
        <p class="hint">عکس را از <b>بالای فنجان</b> و نزدیک بگیر — فقط عکسِ واقعیِ ته‌فنجان تفسیر می‌شود و عکس‌های بی‌ربط پذیرفته نمی‌شوند. عکست فقط روی همین دستگاه می‌ماند و جایی فرستاده نمی‌شود.</p>
        <p class="hint" id="cc-coffee-err" style="display:none;color:#ff9d9d"></p>
      </div>
      ${last?`<p class="cc-limit"><a href="javascript:void(0)" onclick="ccCoffeeResultPage(ccCoffeeToday(),true)" style="color:#f0c96a">✅ فال امروزت را دوباره ببین</a></p>`:''}
      <button class="btn" id="cc-coffee-go" style="display:none; margin-top:12px" onclick="ccCoffeeInterpret()">☕ تفسیر فنجون</button>
    </div>
    <p class="small-note center">فال قهوه برای سرگرمی و تأمل است و جنبه‌ی پیش‌گویی قطعی ندارد.</p>`);
}
function ccCoffeePicked(inp){
  const f=inp.files && inp.files[0];
  if(!f) return;
  if(!/^image\//.test(f.type||'')){ ccToast('یک عکس انتخاب کن 📷'); return; }
  __ccCoffeeFile=f;
  if(__ccCoffeeUrl){ try{ URL.revokeObjectURL(__ccCoffeeUrl); }catch(e){} }
  __ccCoffeeUrl=URL.createObjectURL(f);
  const prev=document.getElementById('cc-coffee-prev');
  if(prev) prev.innerHTML=`<img src="${__ccCoffeeUrl}" alt="فنجان تو">`;
  const go=document.getElementById('cc-coffee-go');
  if(go) go.style.display='block';
  const pk=document.getElementById('cc-coffee-pick');
  if(pk) pk.textContent='📷 عکس دیگر';
}
// ---------- [1.3.6] تشخیصِ عکسِ فنجان — فقط عکسِ واقعیِ ته‌فنجان پذیرفته می‌شود ----------
// کاملاً آفلاین روی خودِ دستگاه: تصویر کوچک (۹۶×۹۶) و مرکز‌برش می‌شود و رنگ‌هایش تحلیل می‌شود.
// منطق: ته‌فنجانِ واقعی در «مرکزِ» عکس قهوه‌ایِ تیره دارد و دورش فنجان/بشقاب/میزِ روشن‌تر یا
// کفِ کرما/دست است. آستانه‌ها با ۱۷ تصویرِ آزمایشی کالیبره شده‌اند
// (scripts/coffee_detect_calib_136.py): ۷ عکسِ فنجان → همه پذیرفته؛ ۹ عکسِ بی‌ربط
// (آسمان، چمن، صورت، میزِ چوبی، ماشین، شب، دیوار، پوستر رنگی، خاکِ گلدان) → همه رد.
// محدودیتِ شناخته‌شده: کیکِ شکلاتیِ روی بشقابِ سفید از نظرِ رنگ شبیه ته‌فنجان است و پذیرفته
// می‌شود (بی‌ضرر). اگر مرورگرِ خیلی قدیمی createImageBitmap نداشته باشد، عکس پذیرفته می‌شود
// تا فال قهوه همچنان برای همه کار کند (fail-open).
async function ccLooksLikeCoffee(f){
  try{
    const bmp=await createImageBitmap(f);
    const S=96, cv=document.createElement('canvas');
    cv.width=S; cv.height=S;
    const ctx=cv.getContext('2d',{willReadFrequently:true});
    const side=Math.min(bmp.width,bmp.height);
    ctx.drawImage(bmp,(bmp.width-side)/2,(bmp.height-side)/2,side,side,0,0,S,S);
    if(bmp.close) bmp.close();
    const d=ctx.getImageData(0,0,S,S).data;
    const N=S*S, R2=S*0.30*S*0.30;
    let cof=0,cofC=0,cofR=0,soft=0,neu=0,ccC=0,ccR=0;
    for(let py=0;py<S;py++){
      const dy=py+0.5-S/2, dy2=dy*dy;
      for(let px=0;px<S;px++){
        const i=(py*S+px)*4, r=d[i]/255, g=d[i+1]/255, b=d[i+2]/255;
        const mx=Math.max(r,g,b), mn=Math.min(r,g,b), l=(mx+mn)/2;
        const sat=(mx-mn)/(1-Math.abs(2*l-1)+1e-6);
        let hue=-1;
        if(mx-mn>1e-6){
          if(mx===r) hue=60*(((g-b)/(mx-mn))%6);
          else if(mx===g) hue=60*((b-r)/(mx-mn)+2);
          else hue=60*((r-g)/(mx-mn)+4);
          if(hue<0) hue+=360;
        }
        const lum=l*100;
        const dx=px+0.5-S/2;
        const center=(dx*dx+dy2)<=R2;
        if(center) ccC++; else ccR++;
        const dw=(hue>=8&&hue<=60&&sat>=0.10&&lum>=5&&lum<=55)||(lum<5&&r>=g&&g>=b-0.02);
        if(dw){ cof++; if(center)cofC++; else cofR++; }
        else if(hue>=8&&hue<=60&&sat>=0.10&&lum>55&&lum<=80){ soft++; }
        else if((lum>=62&&sat<=0.25)||(sat<=0.12)){ neu++; }
      }
    }
    const cfAll=cof/N, cfC=cofC/(ccC||1), cfR=cofR/(ccR||1), cn=neu/N, softAll=soft/N;
    const r1=(cfC>=0.35)&&((cfC-cfR)>=0.10)&&((cfAll+cn)>=0.50);   // فنجانِ معمولی
    const r2=(cfC>=0.45)&&(cfR<=0.15)&&((softAll>=0.35)||(cn>=0.35)); // فنجان در دست / اسپرسو
    return !!(r1||r2);
  }catch(e){ return true; }
}
function ccCoffeeReject(){
  ccToast('☕ این عکس شبیه ته‌فنجان قهوه نیست');
  const err=document.getElementById('cc-coffee-err');
  if(err){ err.style.display='block'; err.textContent='☕ این عکس شبیهِ ته‌فنجانِ قهوه نیست. فنجان را برعکس کن و از بالای فنجان، نزدیک و با نورِ کافی عکس بگیر و دوباره امتحان کن.'; }
}
async function ccCoffeeInterpret(){
  if(!__ccCoffeeFile){ ccToast('اول عکس فنجان را انتخاب کن 📷'); return; }
  // [1.3.6] اول تشخیصِ فنجان — سهمیه فقط وقتی کم می‌شود که عکسِ واقعیِ ته‌فنجان باشد
  const looks=await ccLooksLikeCoffee(__ccCoffeeFile);
  if(!looks){ ccCoffeeReject(); return; }
  if(!ccTryUse('coffee')){ showCoffeeFal(); return; }
  render(`${backBtn('showHome()')}${pageHead('☕','فال قهوه')}
    <div class="card orn center">
      <span class="cc-spin">✨</span>
      <p class="desc" id="cc-coffee-msg" style="margin-top:10px">در حال خواندنِ نشانه‌های فنجان…</p>
    </div>`);
  const msgs=['نشانه‌ها لبه‌ی فنجان را می‌خوانیم…','ریزِ رسوب‌ها را بررسی می‌کنیم…','خط‌های ته فنجان را دنبال می‌کنیم…','چیدمانِ نشان‌ها را مرتب می‌کنیم…'];
  let mi=0;
  const timer=setInterval(()=>{
    const el=document.getElementById('cc-coffee-msg');
    if(!el){ clearInterval(timer); return; }
    mi=(mi+1)%msgs.length; el.textContent=msgs[mi];
  },1600);
  const h=await ccHashFile(__ccCoffeeFile);
  const seed=(h ^ ccHashString(ccTehranDateKey()))>>>0;
  const rng=ccRng(seed);
  const syms=ccPickN(CC_COFFEE_SYMBOLS,3,rng).map(i=>CC_COFFEE_SYMBOLS[i]);
  const open=CC_COFFEE_OPENINGS[Math.floor(rng()*CC_COFFEE_OPENINGS.length)];
  const close=CC_COFFEE_CLOSINGS[Math.floor(rng()*CC_COFFEE_CLOSINGS.length)];
  // [1.3.6] عدد شانس/رنگ هفته دیگر در نتیجه‌ی قهوه نمایش داده نمی‌شود (فقط طالع هفته)
  const res={date:ccTehranDateKey(), syms:syms, open:open, close:close};
  try{ localStorage.setItem('ccCoffeeLast', JSON.stringify(res)); }catch(e){}
  clearInterval(timer);
  setTimeout(()=>ccCoffeeResultPage(res,false), 2100);
}
function ccCoffeeToday(){
  const o=safeJSONParse(localStorage.getItem('ccCoffeeLast'), null);
  return (o && o.date===ccTehranDateKey()) ? o : null;
}
function ccCoffeeResultPage(res,fromCache){
  const shareLines=[];
  res.syms.forEach(s=>shareLines.push(s.g+' '+s.name+': '+s.line));
  render(`${backBtn('showHome()')}${pageHead('☕','فال قهوه‌ی تو','فنجانِ تو حرف‌هایش را زد؛ نشانه‌ها به ترتیبِ اهمیت:')}${fromCache?'<p class="cc-limit">✅ فال امروزت را گرفته‌ای — فردا فنجانِ تازه بیاور ☕</p>':''}
    <div class="card">
      ${res.syms.map(s=>`<div class="cc-sym"><span class="sg">${s.g}</span><div class="st"><b>${s.name}</b><p>${s.line}</p></div></div>`).join('')}
      <div class="cc-msg">
        <p>${res.open}</p>
        <p>${res.close}</p>
      </div>
      <div class="cc-share-row">
        <button class="btn" onclick="ccCoffeeShare()">🖼 کارت اشتراک‌گذاری</button>
        ${ccCanUse('coffee')?`<button class="btn secondary" onclick="showCoffeeFal()">☕ فال دیگر</button>`:''}
      </div>
    </div>
    <p class="small-note center">فال قهوه برای سرگرمی و تأمل است و جنبه‌ی پیش‌گویی قطعی ندارد.</p>`);
}
function ccCoffeeShare(){
  const r=ccCoffeeToday(); if(!r) return;
  ccShareCard({
    title:'☕ فال قهوه',
    sub:'نشانه‌های فنجانِ من',
    lines:r.syms.map(s=>s.g+' '+s.name+' — '+s.line).concat([r.close]),
    art:'icons/menu/icon_coffee.webp',
    file:'coffee-fal'
  });
}

// ---------- 🃏 فال تاروت ----------
var __tarot=null;
function showTarotFal(){
  const last=ccTarotToday();
  const can=ccCanUse('tarot');
  if(last && !can){ ccTarotResultPage(last,true); return; }
  if(!can){
    showFeaturePaywall('فال تاروت','سهمیه‌ی رایگان امروزت برای تاروت تمام شده. با عضویت طلایی بی‌نهایت پراکند بگیر، یا فردا دوباره سر بزن 🌙','showHome()');
    return;
  }
  const rng=ccRng((Date.now()&0x7fffffff)>>>0);
  const deck=ccPickN(CC_TAROT_DECK,7,rng).map(i=>CC_TAROT_DECK[i]);
  __tarot={deck:deck, q:'', picks:[], done:false};
  render(`${backBtn('showHome()')}${pageHead('🃏','فال تاروت','در دلت یک سؤال بگیر، یه لحظه روی آن فکر کن و سه کارت از هفت کارتِ روبرو انتخاب کن.')}
    <div class="card">
      <img src="icons/menu/icon_tarot.webp" class="cc-hero" alt="" width="190" height="190" loading="lazy" decoding="async">
      <p class="cc-limit">${ccLimitNote('tarot','پراکند تاروت')}</p>
      <input id="cc-tarot-q" type="text" placeholder="سؤالت را بنویس (اختیاری) — مثلاً: مسیر شغلی‌ام چطور است؟" maxlength="80" style="width:100%">
      ${last?`<p class="cc-limit"><a href="javascript:void(0)" onclick="ccTarotResultPage(ccTarotToday(),true)" style="color:#f0c96a">✅ پراکند امروزت را دوباره ببین</a></p>`:''}
      <div class="cc-tarot-row" id="cc-tarot-row">
        ${deck.map((c,i)=>`<div class="cc-tcard" id="cc-tc${i}" onclick="ccTarotTap(${i})">
          <div class="cc-tinner">
            <div class="cc-tback"><span>☾</span><span class="tb">کد کیهانی</span></div>
            <div class="cc-tfront"><span class="g">${c.glyph}</span><span class="nm">${c.name}</span><span class="nn">${toFa(c.n)}</span></div>
          </div>
        </div>`).join('')}
      </div>
      <p class="cc-limit" id="cc-tarot-hint">سه کارت را به ترتیب انتخاب کن — گذشته، حال، آینده.</p>
    </div>
    <div id="cc-tarot-summary"></div>`);
}
function ccTarotTap(i){
  if(!__tarot || __tarot.done) return;
  if(__tarot.picks.indexOf(i)>=0 || __tarot.picks.length>=3) return;
  const el=document.getElementById('cc-tc'+i);
  if(!el) return;
  __tarot.picks.push(i);
  el.classList.add('rev');
  setTimeout(()=>{ if(el) el.classList.add('dis'); },700);
  const hint=document.getElementById('cc-tarot-hint');
  const posName=CC_TAROT_POSITIONS[__tarot.picks.length-1][0];
  if(hint){
    if(__tarot.picks.length<3) hint.textContent=`کارت ${toFa(__tarot.picks.length)} = ${posName} — ${toFa(3-__tarot.picks.length)} کارت دیگر انتخاب کن.`;
    else hint.textContent='کارت‌هایت مشخص شد… در حال خواندنِ پیام‌ها ✨';
  }
  if(__tarot.picks.length===3){
    __tarot.done=true;
    if(!ccTryUse('tarot')){ __tarot.done=false; showFeaturePaywall('فال تاروت','سهمیه‌ی امروز تمام شده 🌙','showHome()'); return; }
    const qEl=document.getElementById('cc-tarot-q');
    if(qEl) __tarot.q=(qEl.value||'').trim();
    setTimeout(ccTarotSummary,1000);
  }
}
function ccTarotToday(){
  const o=safeJSONParse(localStorage.getItem('ccTarotLast'), null);
  return (o && o.date===ccTehranDateKey()) ? o : null;
}
function ccTarotSummary(){
  if(!__tarot || !__tarot.done) return;
  const posKeys=['past','present','future'];
  const cards=__tarot.picks.map(i=>__tarot.deck[i]);
  const res={date:ccTehranDateKey(), q:__tarot.q,
    cards:cards.map((c,k)=>({n:c.n,name:c.name,glyph:c.glyph,key:c.key,txt:c[posKeys[k]]})),
    sum:CC_TAROT_SUMMARY[ccHashString(cards.map(c=>c.n).join('-'))%CC_TAROT_SUMMARY.length]};
  try{ localStorage.setItem('ccTarotLast', JSON.stringify(res)); }catch(e){}
  const box=document.getElementById('cc-tarot-summary');
  if(box) box.outerHTML=ccTarotResultHTML(res,false);
  setTimeout(()=>{ const el=document.getElementById('cc-tarot-result'); if(el&&el.scrollIntoView) el.scrollIntoView({behavior:'smooth'}); },150);
}
function ccTarotResultHTML(res,fromCache){
  const posIcons=['🕰️','📍','🌅'];
  return `<div class="card" id="cc-tarot-result">
      ${res.q?`<p class="cc-limit">«${esc(res.q)}»</p>`:''}
      ${res.cards.map((c,k)=>`<div class="cc-sym"><span class="sg">${c.glyph}</span><div class="st">
        <b>${c.name}</b> <span style="color:var(--text-dim);font-size:11px">(${c.key}) — ${posIcons[k]} ${CC_TAROT_POSITIONS[k][0]}</span>
        <p>${c.txt}</p></div></div>`).join('')}
      <div class="cc-msg"><p>${res.sum}</p></div>
      <div class="cc-share-row">
        <button class="btn" onclick="ccTarotShare()">🖼 کارت اشتراک‌گذاری</button>
        ${ccCanUse('tarot')?`<button class="btn secondary" onclick="showTarotFal()">🃏 پراکند دیگر</button>`:''}
      </div>
    </div>
    <p class="small-note center">تاروت ابزاری برای تأمل و خودشناسی است و جنبه‌ی پیش‌گویی قطعی ندارد.</p>`;
}
function ccTarotResultPage(res,fromCache){
  render(`${backBtn('showHome()')}${pageHead('🃏','پراکند امروزِ تو')}${fromCache?'<p class="cc-limit">✅ پراکند امروزت را گرفتی — فردا کارت‌های تازه بیاور.</p>':''}${ccTarotResultHTML(res,fromCache)}`);
}
function ccTarotShare(){
  const r=ccTarotToday(); if(!r) return;
  ccShareCard({
    title:'🃏 فال تاروت',
    sub:'سه کارتِ امروزِ من',
    lines:r.cards.map(c=>c.glyph+' '+c.name+' — '+c.txt).concat([r.sum]),
    art:'icons/menu/icon_tarot.webp',
    file:'tarot-fal'
  });
}

// ---------- 🌟 طالع هفته ----------
function ccIsoWeek(d){
  const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));
  const day=(t.getUTCDay()+6)%7;
  t.setUTCDate(t.getUTCDate()-day+3);
  const firstThu=new Date(Date.UTC(t.getUTCFullYear(),0,4));
  const fd=(firstThu.getUTCDay()+6)%7;
  firstThu.setUTCDate(firstThu.getUTCDate()-fd+3);
  const wk=1+Math.round((t-firstThu)/(7*86400000));
  return {week:wk, year:t.getUTCFullYear()};
}
function showWeeklyFal(){
  const saved=localStorage.getItem('ccMySign');
  if(saved!==null && saved!=='' && Number(saved)>=0 && Number(saved)<=11){ ccWeekPage(Number(saved)); return; }
  render(`${backBtn('showHome()')}${pageHead('🌟','طالع هفته','برج‌ات را انتخاب کن تا هفته‌ات را برایت بخوانیم — دفعه‌ی بعد مستقیم می‌آیی.')}
    <div class="card">
      <img src="icons/menu/icon_weekly.webp" class="cc-hero" alt="" width="190" height="190" loading="lazy" decoding="async">
      <div class="cc-chipgrid">
        ${CC_WEEK_SIGNS.map((s,i)=>`<div class="cc-wchip" onclick="ccWeekPick(${i})">
          <div class="g">${s.glyph}</div><div class="nm">${s.name}</div><div class="mo">${s.month}</div>
        </div>`).join('')}
      </div>
    </div>
    <p class="small-note center">طالع‌بینی برای سرگرمی و تأمل است و جنبه‌ی پیش‌گویی قطعی ندارد.</p>`);
}
function ccWeekPick(i){
  try{ localStorage.setItem('ccMySign', String(i)); }catch(e){}
  ccWeekPage(i);
}
function ccWeekChange(){ try{ localStorage.removeItem('ccMySign'); }catch(e){} showWeeklyFal(); }
function ccWeekPage(si){
  const s=CC_WEEK_SIGNS[si];
  const t=new Date(Date.now()+12600000);
  const iw=ccIsoWeek(t);
  const [jy]=gregorianToJalali(t.getUTCFullYear(), t.getUTCMonth()+1, t.getUTCDate());
  const seed=(iw.year*100+iw.week)*13+si*7+1;
  const rng=ccRng(seed>>>0);
  const pick=(k)=>CC_WEEK_POOLS[k][Math.floor(rng()*CC_WEEK_POOLS[k].length)];
  const overall=pick('overall'), love=pick('love'), work=pick('work'), energy=pick('energy');
  // [1.3.4] عدد شانس و رنگ هفته شخصی (deviceId+هفته) — در همه‌ی بخش‌ها برای همین کاربر یکسان
  const color=ccWeekColor();
  const num=ccLuckyNum();
  const occ=ccOccasionNow();
  render(`${backBtn('showHome()')}${pageHead('🌟','طالع هفته')}
    <div class="pg-person">${s.glyph} ${s.name} — ${s.month}</div>
    <div class="card">
      <p class="cc-limit">🗓 هفته‌ی ${toFa(iw.week)} سال ${toFa(jy)} — ${esc(s.intro)}</p>
      <div class="cc-msg">
        <p><b style="color:#f0c96a">🔶 پیام هفته:</b> ${overall}</p>
        <p><b style="color:#f0c96a">💗 عشق و روابط:</b> ${love}</p>
        <p><b style="color:#f0c96a">💼 کار و مال:</b> ${work}</p>
        <p><b style="color:#f0c96a">🌿 انرژی و تندرستی:</b> ${energy}</p>
      </div>
      ${occ?`<div class="cc-occ"><span class="og">${occ.glyph}</span><div class="ot"><b>${occ.title} مبارک!</b> ${occ.text}</div></div>`:''}
      ${ccLuckyChipsHTML()}
      <div class="cc-share-row">
        <button class="btn" onclick="ccWeekShare(${si})">🖼 کارت اشتراک‌گذاری</button>
        <button class="btn secondary" onclick="ccWeekChange()">🔄 تغییر برج</button>
      </div>
    </div>
    <p class="small-note center">طالع‌بینی برای سرگرمی و تأمل است و جنبه‌ی پیش‌گویی قطعی ندارد.</p>`);
}
function ccWeekShare(si){
  const s=CC_WEEK_SIGNS[si];
  const t=new Date(Date.now()+12600000);
  const iw=ccIsoWeek(t);
  const seed=((iw.year*100+iw.week)*13+si*7+1)>>>0;
  const rng=ccRng(seed);
  const pick=(k)=>CC_WEEK_POOLS[k][Math.floor(rng()*CC_WEEK_POOLS[k].length)];
  ccShareCard({
    title:'🌟 طالع هفته — '+s.name,
    sub:'هفته‌ی '+toFa(iw.week),
    lines:[pick('overall'), pick('love'), pick('work')],
    art:'icons/menu/icon_weekly.webp',
    file:'weekly-'+s.name
  });
}
