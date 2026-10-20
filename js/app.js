const PERSIAN_MONTHS=["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
const ICON_CALC=`<span class="icon-calc-glyph" style="vertical-align:-11px; margin-inline-end:6px">∞</span>`;
const ICON_INFO=`<svg width="26" height="26" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="11" fill="url(#gInfo)"/><circle cx="12" cy="7.6" r="1.3" fill="#241742"/><rect x="10.8" y="10.6" width="2.4" height="7" rx="1.2" fill="#241742"/><defs><linearGradient id="gInfo" x1="0" y1="0" x2="24" y2="24"><stop stop-color="#f0c96a"/><stop offset="1" stop-color="#c9962e"/></linearGradient></defs></svg>`;
const ICON_ACCOUNT=`<svg width="26" height="26" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="11" fill="url(#gAcct)"/><circle cx="12" cy="9.3" r="3.1" fill="#241742"/><path d="M5.5 18.2c1.1-3 3.7-4.3 6.5-4.3s5.4 1.3 6.5 4.3c-1.9 1.6-4.1 2.5-6.5 2.5s-4.6-.9-6.5-2.5z" fill="#241742"/><defs><linearGradient id="gAcct" x1="0" y1="0" x2="24" y2="24"><stop stop-color="#f0c96a"/><stop offset="1" stop-color="#c9962e"/></linearGradient></defs></svg>`;
const ICON_PRIVACY=`<svg width="26" height="26" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="11" fill="url(#gLock)"/><rect x="7.8" y="11" width="8.4" height="6.6" rx="1.6" fill="#241742"/><path d="M9.2 11V9a2.8 2.8 0 0 1 5.6 0v2" stroke="#241742" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="12" cy="13.9" r="1" fill="#f0c96a"/><defs><linearGradient id="gLock" x1="0" y1="0" x2="24" y2="24"><stop stop-color="#f0c96a"/><stop offset="1" stop-color="#c9962e"/></linearGradient></defs></svg>`;
const ICON_TERMS=`<svg width="26" height="26" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="11" fill="url(#gDoc)"/><rect x="7.5" y="6.5" width="9" height="11" rx="1.3" fill="#241742"/><rect x="9.3" y="9.2" width="5.4" height="1.1" rx=".55" fill="#f0c96a"/><rect x="9.3" y="11.6" width="5.4" height="1.1" rx=".55" fill="#f0c96a"/><rect x="9.3" y="14" width="3.6" height="1.1" rx=".55" fill="#f0c96a"/><defs><linearGradient id="gDoc" x1="0" y1="0" x2="24" y2="24"><stop stop-color="#f0c96a"/><stop offset="1" stop-color="#c9962e"/></linearGradient></defs></svg>`;
const GOOGLE_G_LOGO=`<svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.9-2.26 5.36-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.94 23.94 0 0 0 0 24c0 3.87.92 7.53 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.92-2.14 15.89-5.82l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;
const state={lastProfile:JSON.parse(localStorage.getItem('lastProfile')||'null'), savedProfiles:JSON.parse(localStorage.getItem('savedProfiles')||'[]')};
function saveProfile(p){
  state.lastProfile=p; localStorage.setItem('lastProfile',JSON.stringify(p));
  state.savedProfiles=state.savedProfiles.filter(x=>!(x.firstName===p.firstName&&x.familyName===p.familyName));
  state.savedProfiles.unshift(p); state.savedProfiles=state.savedProfiles.slice(0,15);
  localStorage.setItem('savedProfiles',JSON.stringify(state.savedProfiles));
  if(typeof isBirthdayRemindersEnabled==='function' && isBirthdayRemindersEnabled()){
    syncBirthdayReminders().catch(()=>{});
  } else if(typeof maybeAutoEnableBirthdayReminders==='function'){
    maybeAutoEnableBirthdayReminders();
  }
  syncProfilesToServer();
}
function syncProfilesToServer(){
  if(typeof AUTH_API_BASE==='undefined' || AUTH_API_BASE.includes('YOUR-WORKER')) return;
  const deviceId=getDeviceId();
  const profiles=state.savedProfiles.map(p=>({
    firstName:p.firstName, familyName:p.familyName, motherName:p.motherName,
    jy:p.jy, jm:p.jm, jd:p.jd,
    report:p.report,
  }));
  // [S1-fix] درخواست از طریق authFetch می‌رود تا توکن به‌صورت خودکار ضمیمه شود:
  // - کاربر واردشده → پروفایل‌ها به «حساب» گره می‌خورند (userId فقط از توکن خوانده می‌شود، نه از بدنه)
  // - مهمان → مثل قبل با deviceId (اکنون تصادف رمزنگارانه) — همان طراحی Worker فعلی با پاک‌سازی حریم خصوصی
  authFetch('/profiles/sync', {
    method:'POST',
    body:JSON.stringify({deviceId, profiles}),
  }).catch(()=>{});
}
const app=document.getElementById('app');
let __suppressPush=true;
function currentNavKey(){const el=document.querySelector('nav.bottom .nav-btn.active'); return el?el.dataset.nav:null;}
function render(html){
  app.innerHTML=html; window.scrollTo(0,0);
  if(!__suppressPush){ history.pushState({html, navKey:currentNavKey()}, '', location.href); }
  else { history.replaceState({html, navKey:currentNavKey()}, '', location.href); __suppressPush=false; }
}
window.addEventListener('popstate', (e)=>{
  if(e.state && typeof e.state.html==='string'){
    app.innerHTML=e.state.html; window.scrollTo(0,0);
    if(e.state.navKey) setNav(e.state.navKey);
  }
});
function esc(s){return (s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function nl2br(s){return esc(s).replace(/\n/g,'<br>');}
document.querySelectorAll('nav.bottom .nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('nav.bottom .nav-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const target=btn.dataset.nav;
    if(target==='home')showHome(); else if(target==='cosmic')showCosmicInputForm();
    else if(target==='profiles')showSavedProfiles(); else if(target==='more')showMoreMenu();
  });
});
function setNav(key){document.querySelectorAll('nav.bottom .nav-btn').forEach(b=>b.classList.toggle('active', b.dataset.nav===key));}
function showHome(){ setNav('home'); __wcCondensed=false; render(hubHTML()); maybeShowBirthdayCelebration(); }
function getTodaysBirthdayProfiles(){
  const now=new Date();
  const m=now.getMonth()+1, d=now.getDate();
  return state.savedProfiles.filter(p=>p.report && p.report.gm===m && p.report.gd===d);
}
function maybeShowBirthdayCelebration(){
  const todays=getTodaysBirthdayProfiles();
  if(todays.length===0) return;
  if(sessionStorage.getItem('birthdayCelebrationShown')) return; // یه‌بار در هر بار باز کردن اپ، نه هر بار رفتن به خانه
  sessionStorage.setItem('birthdayCelebrationShown', '1');
  launchBalloons(todays.map(p=>`${p.firstName} ${p.familyName}`.trim()));
}
function launchBalloons(names){
  const overlay=document.createElement('div');
  overlay.className='balloon-overlay';
  const colors=['#e8546b','#4fb8e8','#f0c96a','#8a6fe0','#5fd18f','#ef8f4e'];
  let html='';
  for(let i=0;i<18;i++){
    const left=(Math.random()*94).toFixed(1);
    const delay=(Math.random()*1.8).toFixed(2);
    const duration=(6+Math.random()*3).toFixed(2);
    const color=colors[i%colors.length];
    html+=`<div class="balloon" style="left:${left}%; animation-delay:${delay}s; animation-duration:${duration}s;">
      <svg width="40" height="56" viewBox="0 0 40 56"><ellipse cx="20" cy="20" rx="18" ry="20" fill="${color}"/><path d="M20 40 L18 54 M20 40 L20 55 M20 40 L22 54" stroke="#ffffff55" stroke-width="1.3" fill="none"/><path d="M14 15c1-3 4-5 6-4" stroke="#ffffff77" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>
    </div>`;
  }
  const nameLine=names.length===1?`تولد ${esc(names[0])} مبارک 🎉`:`تولد ${names.map(esc).join(' و ')} مبارک 🎉`;
  overlay.innerHTML=html+`<div class="balloon-msg">🎂 ${nameLine}</div>`;
  document.body.appendChild(overlay);
  setTimeout(()=>{ overlay.remove(); }, 7000);
}
let __wcCondensed=false;
function updateWelcomeCardScrollState(){
  const bar=document.getElementById('wc-mini-bar');
  const card=document.getElementById('welcome-card');
  if(!bar || !card) return;
  const headerH=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h'))||100;
  const cardBottom=card.getBoundingClientRect().bottom;
  if(!__wcCondensed && cardBottom<headerH+8){
    __wcCondensed=true;
    bar.classList.add('is-visible');
  } else if(__wcCondensed && cardBottom>headerH+40){
    __wcCondensed=false;
    bar.classList.remove('is-visible');
  }
}
window.addEventListener('scroll', ()=>{ requestAnimationFrame(updateWelcomeCardScrollState); }, {passive:true});
function hubHTML(){
  const last=state.lastProfile;
  const lastLine = last ? `آخرین محاسبه: <b>${esc(last.firstName)} ${esc(last.familyName)}</b>${last.report&&last.report.destinyNum?` — عدد سرنوشت ${last.report.destinyNum}`:''}` : 'هنوز محاسبه‌ای نداری';
  return `
    <div class="wc-mini-bar" id="wc-mini-bar">
      <span class="wc-last">${lastLine}</span>
      <button class="btn wc-mini-btn" id="wc-mini-btn" onclick="showCosmicInputForm()"><span class="btn-inner">کد کیهانی<span class="btn-badge">${ICON_CALC}</span></span></button>
      <img src="icons/hand-glow.png" class="wc-mini-hand" id="wc-mini-hand" style="width:42px; height:42px" onclick="rerollSlogan()" alt="" role="button" aria-label="یه شعار دیگه">
    </div>
    <div class="card welcome-card" id="welcome-card">
      <div class="wc-full">
        <div class="w-text"><h2>خوش اومدی 👋</h2>
        <p class="desc">${last?lastLine:'هنوز محاسبه‌ای انجام ندادی. از دکمه‌ی زیر شروع کن.'}</p>
        <button class="btn" onclick="showCosmicInputForm()"><span class="btn-inner">محاسبه‌ی کد کیهانی<span class="btn-badge">${ICON_CALC}</span><span class="btn-chevron">›</span></span></button></div>
        <div class="welcome-icon-wrap">
          <div class="welcome-icon" onclick="rerollSlogan()" role="button" aria-label="یه شعار دیگه" style="cursor:pointer"><img src="icons/hand-glow.png" alt=""></div>
          <span class="orbit-dot d1"></span><span class="orbit-dot d2"></span><span class="orbit-dot d3"></span>
        </div>
      </div>
    </div>
    <div class="grid-menu">
      <div class="menu-tile" onclick="showHafez('modern')"><img src="icons/menu/icon_hafez.webp" class="icon-img" loading="lazy" width="88" height="88" decoding="async"><span class="label">فال حافظ</span><span class="desc">پیام امروز حافظ برات</span></div>
      <div class="menu-tile" onclick="showMunajat()"><img src="icons/menu/icon_munajat.webp" class="icon-img" loading="lazy" width="88" height="88" decoding="async"><span class="label">مناجات</span><span class="desc">متون معنوی و مناجات</span></div>
      <div class="menu-tile" onclick="showZamanbandi()"><img src="icons/menu/icon_zamanbandi.webp" class="icon-img" loading="lazy" width="88" height="88" decoding="async"><span class="label">زمان‌بندی خدا</span><span class="desc">زمان‌بندی الهی زندگیت</span></div>
      <div class="menu-tile" onclick="showElham()"><img src="icons/menu/icon_elham.webp" class="icon-img" loading="lazy" width="88" height="88" decoding="async"><span class="label">الهام روز</span><span class="desc">پیام و الهام روزانه</span></div>
      <div class="menu-tile" onclick="showZodiacEntry()"><img src="icons/menu/icon_zodiac.webp" class="icon-img" loading="lazy" width="88" height="88" decoding="async"><span class="label">طالع‌بینی</span><span class="desc">طالع روزانه و شخصی</span></div>
      <div class="menu-tile" onclick="showNatalEntry()"><img src="icons/menu/icon_natal.webp" class="icon-img" loading="lazy" width="88" height="88" decoding="async"><span class="label">زایچه‌ی تقریبی</span><span class="desc">تقویم شخصی شما</span></div>
      <div class="menu-tile" onclick="showCompareEntry()"><img src="icons/menu/icon_compare.webp" class="icon-img" loading="lazy" width="88" height="88" decoding="async"><span class="label">مقایسه‌ی دو نفر</span><span class="desc">سازگاری عددی دو نفر</span></div>
      <div class="menu-tile" onclick="showBabyNameForm()"><img src="icons/menu/icon_baby.webp" class="icon-img" loading="lazy" width="88" height="88" decoding="async"><span class="label">اسم فرزند</span><span class="desc">انتخاب اسم با معنا</span></div>
      <div class="menu-tile" onclick="showGratitude()"><img src="icons/menu/icon_gratitude.webp" class="icon-img" loading="lazy" width="88" height="88" decoding="async" onerror="if(!this.dataset.f){this.dataset.f=1;this.src='icons/menu/icon_gratitude.png'}else{this.outerHTML='<div class=&quot;icon-img&quot; style=&quot;display:flex;align-items:center;justify-content:center;font-size:40px&quot;>🙏</div>'}"><span class="label">شکرگزاری</span><span class="desc">یک جمله‌ی شکرگزاری روزانه</span></div>
    </div>
    <div class="card banner-card">
      <span class="b-icon">🌟</span>
      <div class="b-text" id="bannerSlogan">${esc(getSessionSlogan())}</div>
      <span class="b-icon"><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2 12c2.5-4.5 6-7 10-7s7.5 2.5 10 7c-2.5 4.5-6 7-10 7s-7.5-2.5-10-7z" fill="none" stroke="var(--gold-soft)" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="12" r="3.3" fill="var(--gold-soft)"/></svg></span>
    </div>`;
}
function showNotifications(){
  render(`${backBtn('showHome()')}<div class="card"><h2>🔔 اعلان‌ها</h2>
      <p class="desc">فعلاً اعلان جدیدی نداری.</p></div>`);
}
function showMoreMenu(){
  setNav('more');
  const adminBlock=(currentUser && currentUser.isAdmin)?`<div class="card">
      <div class="list-item" onclick="showAdminUsersPage()"><span class="li-label">👥 کاربران ثبت‌شده</span><span class="li-arrow">‹</span></div>
      <div class="list-item" onclick="showAdminProfilesPage()"><span class="li-label">📇 همه‌ی پروفایل‌ها</span><span class="li-arrow">‹</span></div>
      <div class="list-item" onclick="showAdminErrorsPage()"><span class="li-label">🐞 خطاهای اخیر</span><span class="li-arrow">‹</span></div>
    </div>`:'';
  render(`<div class="card">
      <div class="list-item" onclick="showAboutPage()"><span class="li-label">${ICON_INFO}درباره‌ی نرم‌افزار</span><span class="li-arrow">‹</span></div>
      <div class="list-item" onclick="showMembershipPage()"><span class="li-label">${ICON_ACCOUNT}حساب کاربری</span><span class="li-arrow">‹</span></div>
      <div class="list-item" onclick="showPrivacyPage()"><span class="li-label">${ICON_PRIVACY}حریم خصوصی</span><span class="li-arrow">‹</span></div>
      <div class="list-item" onclick="showTermsPage()"><span class="li-label">${ICON_TERMS}قوانین و شرایط استفاده</span><span class="li-arrow">‹</span></div>
    </div>
    ${adminBlock}
    <div class="small-note">اطلاعات پروفایل‌های شما (نام، تاریخ تولد و نتایج) بر روی دستگاه شما و همچنین سرور اختصاصی ما ذخیره می‌شود. جزئیات کامل در بخش «حریم خصوصی» ارائه شده است.</div>`);
}
async function showAdminUsersPage(){
  render(`${backBtn('showMoreMenu()')}<div class="card"><h2>👥 کاربران ثبت‌شده</h2><p class="desc" id="admin-status">در حال بارگذاری...</p></div><div id="admin-list"></div>`);
  try{
    const data=await authFetch('/admin/users', { headers:{ Authorization:'Bearer '+authToken } });
    document.getElementById('admin-status').textContent=`تعداد: ${data.users.length}`;
    document.getElementById('admin-list').innerHTML=data.users.map(u=>`
      <div class="card">
        <p style="margin:0; line-height:1.9">
          ${u.email?`✉️ ${esc(u.email)}<br>`:''}${u.phone?`📱 ${esc(u.phone)}<br>`:''}${u.display_name?`👤 ${esc(u.display_name)}<br>`:''}
          <span class="small-note">عضویت: ${new Date(u.created_at).toLocaleString('fa-IR')}</span>
        </p>
      </div>`).join('') || '<div class="card"><p class="desc" style="margin:0">هنوز کاربری ثبت‌نام نکرده.</p></div>';
  }catch(e){
    document.getElementById('admin-status').textContent='';
    document.getElementById('admin-list').innerHTML=`<div class="card"><p class="desc" style="margin:0; color:#ff8a8a">${esc(translateAuthError(e))}</p></div>`;
  }
}
async function showAdminErrorsPage(){
  render(`${backBtn('showMoreMenu()')}<div class="card"><h2>🐞 خطاهای اخیر</h2><p class="desc" id="admin-status">در حال بارگذاری...</p></div><div id="admin-list"></div>`);
  try{
    const data=await authFetch('/admin/errors', { headers:{ Authorization:'Bearer '+authToken } });
    document.getElementById('admin-status').textContent=`تعداد: ${data.errors.length} (آخرین ۲۰۰ مورد)`;
    document.getElementById('admin-list').innerHTML=data.errors.map(er=>`
      <div class="card">
        <p style="margin:0; line-height:1.9">
          <b style="color:#ff8a8a">${esc(er.message||'')}</b><br>
          ${er.url?`🔗 <span style="direction:ltr; unicode-bidi:isolate; font-size:12px">${esc(er.url)}</span><br>`:''}
          ${er.stack?`<span class="small-note" style="direction:ltr; unicode-bidi:isolate; display:block; white-space:pre-wrap; word-break:break-all">${esc(er.stack)}</span><br>`:''}
          <span class="small-note">${new Date(er.created_at).toLocaleString('fa-IR')}</span>
        </p>
      </div>`).join('') || '<div class="card"><p class="desc" style="margin:0">هنوز خطایی ثبت نشده 🎉</p></div>';
  }catch(e){
    document.getElementById('admin-status').textContent='';
    document.getElementById('admin-list').innerHTML=`<div class="card"><p class="desc" style="margin:0; color:#ff8a8a">${esc(translateAuthError(e))}</p></div>`;
  }
}
async function showAdminProfilesPage(){
  render(`${backBtn('showMoreMenu()')}<div class="card"><h2>📇 همه‌ی پروفایل‌ها</h2><p class="desc" id="admin-status">در حال بارگذاری...</p></div><div id="admin-list"></div>`);
  try{
    const data=await authFetch('/admin/profiles', { headers:{ Authorization:'Bearer '+authToken } });
    document.getElementById('admin-status').textContent=`تعداد: ${data.profiles.length}`;
    document.getElementById('admin-list').innerHTML=data.profiles.map(p=>`
      <div class="card">
        <p style="margin:0; line-height:1.9">
          <b>${esc(p.first_name||'')} ${esc(p.family_name||'')}</b><br>
          ${p.jy&&p.jm&&p.jd?`🗓️ تولد: ${p.jy}/${p.jm}/${p.jd}<br>`:''}
          کد: <span style="direction:ltr; unicode-bidi:isolate; color:var(--gold-soft)">${esc(p.cosmic_code||'-')}</span><br>
          <span class="small-note">${p.user_id?'وابسته به حساب کاربری':'بدون حساب (محلی)'} — به‌روزرسانی: ${new Date(p.updated_at).toLocaleString('fa-IR')}</span>
        </p>
      </div>`).join('') || '<div class="card"><p class="desc" style="margin:0">هنوز پروفایلی ثبت نشده.</p></div>';
  }catch(e){
    document.getElementById('admin-status').textContent='';
    document.getElementById('admin-list').innerHTML=`<div class="card"><p class="desc" style="margin:0; color:#ff8a8a">${esc(translateAuthError(e))}</p></div>`;
  }
}
const PV_ICONS={
shield:'<path d="M12 3l7.5 3v5.5c0 4.6-3.1 8.1-7.5 9.5C7.6 19.6 4.5 16.1 4.5 11.5V6z"/><rect x="9" y="10.5" width="6" height="5" rx="1"/><path d="M10 10.5V9a2 2 0 014 0v1.5"/>',
doc:'<path d="M7 3h7l4 4v5"/><path d="M7 3v18h5"/><path d="M9.5 9h4M9.5 12.5h3"/><rect x="14" y="15" width="6.5" height="5.5" rx="1"/><path d="M15.7 15v-1.3a1.5 1.5 0 013 0V15"/>',
eye:'<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path d="M4 20L20 4"/>',
eyeOpen:'<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
lock:'<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 018 0v2.5"/><circle cx="12" cy="15.5" r="1.2"/>',
info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
calc:'<rect x="5" y="3" width="14" height="18" rx="2"/><rect x="8" y="6" width="8" height="3"/><path d="M8.5 13h.01M12 13h.01M15.5 13h.01M8.5 16.5h.01M12 16.5h.01M15.5 16.5h.01"/>',
feather:'<path d="M20 4c-8 0-13 5-13 12l-3 4"/><path d="M20 4c0 8-5 13-12 13"/><path d="M9 15l6-6"/>',
wheel:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.6 5.6l4.3 4.3M14.1 14.1l4.3 4.3M18.4 5.6l-4.3 4.3M9.9 14.1l-4.3 4.3"/>',
people:'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3.5 19c.6-3.3 2.9-5 5.5-5s4.9 1.7 5.5 5"/><path d="M15 14.2c.7-.2 1.3-.2 1.9-.2 2 0 3.6 1.3 4.1 4"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4.5-6.5 8-6.5s7 2 8 6.5"/>',
bell:'<path d="M6 16v-5a6 6 0 0112 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 004 0"/>',
compass:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
refresh:'<path d="M20 11a8 8 0 10-2.3 5.7"/><path d="M20 5v6h-6"/>',
trash:'<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/>'
};
function pvCard(title,text,ic){return `<div class="pv-card"><div class="pv-ic"><svg viewBox="0 0 24 24">${PV_ICONS[ic]}</svg></div><div class="pv-tx"><h3>${title}</h3><p>${text}</p></div></div>`;}
function showAboutPage(){
  render(`${backBtn('showMoreMenu()')}${pageHead('','درباره‌ی نرم‌افزار')}
    <div class="card orn pv-text">
      <p>«کد کیهانی» راهی است به‌سوی شناخت عمیق‌تر خویش و رمزگشایی از نظام هستی.</p>
      <p>این نرم‌افزار با تلفیق عددشناسی، طالع‌بینی و گنجینه‌ی ادب فارسی، تجربه‌ای شخصی‌سازی‌شده برای کاوش در شخصیت، مسیر زندگی و روزهای شما فراهم می‌آورد.</p>
      <p>از محاسبه‌ی کد کیهانی و زایچه‌ی تقریبی گرفته تا فال حافظ، مناجات و متون الهام‌بخش، همه‌ی بخش‌ها برای همراهی شما در سفر درون و برون طراحی شده‌اند. این نرم‌افزار به‌منظور کاوش و خودشناسی ارائه می‌شود و جنبه‌ی پیش‌گویی قطعی ندارد.</p>
    </div>
    <h2 class="sec-title">✦ امکانات نرم‌افزار</h2>
    ${pvCard('محاسبه‌ی کد کیهانی','استخراج کد کیهانی، عدد سرنوشت، تقدیر، باطن، پایگاه اجتماعی و وضعیت درآمد بر پایه‌ی نام و تاریخ تولد.','calc')}
    ${pvCard('فال حافظ و متون معنوی','فال حافظ روزانه (حداکثر سه‌بار در روز)، مناجات، الهام روز و عبارت‌های «زمان‌بندی خدا».','feather')}
    ${pvCard('طالع‌بینی و زایچه‌ی تقریبی','طالع‌بینی شخصی و روزانه و محاسبه‌ی زایچه‌ی تقریبی بر اساس زمان و محل تولد.','wheel')}
    ${pvCard('مقایسه و پیشنهاد نام','مقایسه‌ی عددی و ستاره‌ای دو نفر و پیشنهاد نام فرزند با توجه به نام خانوادگی و نام مادر.','people')}
    ${pvCard('پروفایل‌ها و حساب کاربری','ذخیره‌ی پروفایل چند نفر و عضویت اختیاری از طریق ایمیل یا حساب گوگل.','user')}
    ${pvCard('یادآوری‌ها','یادآوری روزانه‌ی فال و یادآوری تولد، در صورت فعال‌سازی توسط کاربر.','bell')}
    <p class="small-note center">نسخه‌ی فعلی: ${toFa('1.0.0')} — این نرم‌افزار به‌طور مستمر به‌روزرسانی می‌شود و امکانات تازه به آن افزوده خواهد شد.</p>`);
}
function togglePw(){const i=document.getElementById('auth-password'),b=document.getElementById('pw-eye'); if(!i) return; const show=i.type==='password'; i.type=show?'text':'password'; b.innerHTML=`<svg viewBox="0 0 24 24">${PV_ICONS[show?'eye':'eyeOpen']}</svg>`;}
function showMembershipPage(){
  if(currentUser){
    const label = currentUser.displayName || currentUser.email || currentUser.phone || 'کاربر';
    const sub = currentUser.email || currentUser.phone || '';
    render(`${backBtn('showMoreMenu()')}${pageHead('','حساب کاربری')}
      <div class="card orn center">
        <div class="pv-ic acc-av"><svg viewBox="0 0 24 24">${PV_ICONS.user}</svg></div>
        <div class="acc-name">${esc(label)}</div>
        ${sub && sub!==label?`<div class="acc-sub">${esc(sub)}</div>`:''}
        ${ORN_DIV}
        <p class="small-note center">شما با این حساب وارد شده‌اید.</p>
        <button class="btn secondary" onclick="handleSignOut()">خروج از حساب</button>
      </div>`);
    return;
  }
  render(`${backBtn('showMoreMenu()')}${pageHead('','عضویت / ورود','برای ورود یا عضویت، یکی از روش‌های زیر را انتخاب کنید.')}
    <div class="card orn">
      <div id="google-btn-container" class="google-wrap"></div>
      <p class="small-note center">ورود با گوگل ممکن است بدون استفاده از VPN امکان‌پذیر نباشد.</p>
      <div class="auth-box">
        <div class="auth-title"><span></span><b>ورود با ایمیل</b><span></span></div>
        <label>ایمیل</label>
        <input id="auth-email" class="ic-mail" type="email" dir="ltr" placeholder="example@email.com">
        <label>رمز عبور</label>
        <div class="pw-wrap"><input id="auth-password" class="ic-lock" type="password" placeholder="رمز عبور (حداقل ۶ نویسه)"><button type="button" id="pw-eye" class="pw-eye" onclick="togglePw()" aria-label="نمایش رمز عبور"><svg viewBox="0 0 24 24">${PV_ICONS.eyeOpen}</svg></button></div>
        <p id="auth-error" class="small-note" style="color:#ff8a8a; min-height:18px"></p>
        <button class="btn" onclick="handleEmailSignIn()">ورود</button>
        <button class="btn secondary" onclick="handleEmailSignUp()">ساخت حساب جدید</button>
      </div>
    </div>`);
  initGoogleButton();
}
let googleTokenClient=null;
function initGoogleButton(attempt){
  attempt=attempt||0;
  const el=document.getElementById('google-btn-container');
  if(!el) return;
  if(GOOGLE_CLIENT_ID==='YOUR_GOOGLE_CLIENT_ID') return;
  if(typeof google==='undefined' || !google.accounts || !google.accounts.oauth2){
    // اسکریپت گوگل ممکنه هنوز کامل لود نشده باشه — به‌جای جاخالی‌دادن، چندبار دیگه امتحان کن.
    if(attempt<20){ setTimeout(()=>initGoogleButton(attempt+1), 250); return; }
    el.innerHTML='<p class="small-note">ورود با گوگل در حال حاضر در دسترس نیست؛ لطفاً اتصال اینترنت خود را بررسی کنید.</p>';
    return;
  }
  el.innerHTML=`<button type="button" class="google-btn" onclick="handleGoogleButtonClick()">${GOOGLE_G_LOGO}<span>ورود با اکانت گوگل</span></button>`;
  googleTokenClient=google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: 'openid email profile',
    callback: handleGoogleTokenResponse
  });
}
function handleGoogleButtonClick(){
  if(googleTokenClient) googleTokenClient.requestAccessToken();
}
function handleGoogleTokenResponse(response){
  if(!response || response.error){ return; }
  signInWithGoogleCredential(response.access_token).then(()=>{ showMembershipPage(); }).catch((err)=>{ alert(translateAuthError(err)); });
}
function authGuard(elId){
  if(typeof AUTH_API_BASE==='undefined' || AUTH_API_BASE.includes('YOUR-WORKER')){
    const el=document.getElementById(elId);
    if(el){ el.style.color='#ff8a8a'; el.textContent='پیکربندی سرویس عضویت هنوز تکمیل نشده است.'; }
    return false;
  }
  return true;
}
function handleOtpRequest(){
  if(!authGuard('otp-error')) return;
  const phone=document.getElementById('auth-phone').value.trim();
  const errEl=document.getElementById('otp-error');
  errEl.style.color='#ff8a8a'; errEl.textContent='';
  requestOtp(phone).then(()=>{
    document.getElementById('otp-verify-section').style.display='block';
    errEl.style.color='var(--gold-soft)';
    errEl.textContent='کد تایید برات پیامک شد.';
  }).catch((err)=>{ errEl.style.color='#ff8a8a'; errEl.textContent=translateAuthError(err); });
}
function handleOtpVerify(){
  const phone=document.getElementById('auth-phone').value.trim();
  const code=document.getElementById('auth-otp-code').value.trim();
  const errEl=document.getElementById('otp-error');
  errEl.style.color='#ff8a8a'; errEl.textContent='';
  verifyOtp(phone,code).then(()=>{ showMembershipPage(); }).catch((err)=>{ errEl.style.color='#ff8a8a'; errEl.textContent=translateAuthError(err); });
}
function handleEmailSignIn(){
  if(!authGuard('auth-error')) return;
  const email=document.getElementById('auth-email').value.trim();
  const password=document.getElementById('auth-password').value;
  const errEl=document.getElementById('auth-error');
  errEl.textContent='';
  signInWithEmail(email,password).then(()=>{ showMembershipPage(); }).catch((err)=>{ errEl.textContent=translateAuthError(err); });
}
function handleEmailSignUp(){
  if(!authGuard('auth-error')) return;
  const email=document.getElementById('auth-email').value.trim();
  const password=document.getElementById('auth-password').value;
  const errEl=document.getElementById('auth-error');
  errEl.textContent='';
  signUpWithEmail(email,password).then(()=>{ showMembershipPage(); }).catch((err)=>{ errEl.textContent=translateAuthError(err); });
}
function handleSignOut(){
  signOutUser().then(()=>{
    // پروفایل‌های محلی رو هم پاک می‌کنیم تا حساب بعدی که وارد می‌شه، پروفایل‌های این حساب رو نبینه.
    state.savedProfiles=[];
    localStorage.removeItem('savedProfiles');
    showMembershipPage();
  });
}
function onAuthChanged(user){
  if(user) mergeAndRestoreProfilesOnLogin();
}
async function mergeAndRestoreProfilesOnLogin(){
  const localProfiles=state.savedProfiles.slice(); // اسنپ‌شات از پروفایل‌های محلی قبل از بازنویسی
  await fetchMyProfilesFromServer(); // حالا state.savedProfiles = لیست همین حساب روی سرور
  let merged=false;
  for(const lp of localProfiles){
    const exists=state.savedProfiles.some(sp=>sp.firstName===lp.firstName && sp.familyName===lp.familyName);
    if(!exists){ state.savedProfiles.unshift(lp); merged=true; }
  }
  if(merged){
    localStorage.setItem('savedProfiles', JSON.stringify(state.savedProfiles));
    syncProfilesToServer(); // فقط بعد از merge، لیست کامل رو دوباره به سرور می‌فرستیم
  }
}
async function fetchMyProfilesFromServer(){
  if(typeof AUTH_API_BASE==='undefined' || AUTH_API_BASE.includes('YOUR-WORKER') || !authToken) return;
  try{
    const data=await authFetch('/profiles/mine', { headers:{ Authorization:'Bearer '+authToken } });
    state.savedProfiles=data.profiles.map(row=>({
      firstName:row.first_name, familyName:row.family_name, motherName:row.mother_name,
      jy:row.jy, jm:row.jm, jd:row.jd,
      report: row.report_json ? JSON.parse(row.report_json) : { gm:row.gm, gd:row.gd, cosmicCode:row.cosmic_code },
      date: new Date(row.updated_at).toISOString(),
    }));
    localStorage.setItem('savedProfiles', JSON.stringify(state.savedProfiles));
  }catch(e){ console.error('fetch my profiles failed', e); }
}
function showPrivacyPage(){
  render(`${backBtn('showMoreMenu()')}${pageHead('','حریم خصوصی')}
    ${pvCard('احترام به حریم خصوصی شما','حفظ حریم خصوصی شما برای ما اهمیت بسیار دارد. تمام امکانات اصلی نرم‌افزار، از جمله محاسبه‌ی کد کیهانی، فال و طالع‌بینی، بدون نیاز به عضویت و به‌صورت محلی بر روی دستگاه شما در دسترس است؛ عضویت صرفاً یک امکان اختیاری است.','shield')}
    ${pvCard('اطلاعات ذخیره‌شده','نام، تاریخ تولد و نتایج محاسبات هر پروفایل، هم بر روی دستگاه شما و هم، به‌منظور پشتیبانی و بهبود خدمات، بر روی سرور اختصاصی ما (Cloudflare) نگهداری می‌شود. این اطلاعات به فروش نمی‌رسد و با هیچ شخص ثالثی به اشتراک گذاشته نمی‌شود.','doc')}
    ${pvCard('اطلاعات حساب کاربری','در صورت عضویت با ایمیل، نشانی ایمیل و رمز عبور (به‌صورت رمزنگاری‌شده) ذخیره می‌شود. در صورت ورود با گوگل، تنها نشانی ایمیل و نامی که گوگل در اختیار ما قرار می‌دهد برای شناسایی حساب نگهداری می‌شود. ورود با شماره‌ی تلفن همراه در آینده افزوده خواهد شد و شماره صرفاً برای ارسال یک‌باره‌ی کد تأیید به کار می‌رود.','user')}
    ${pvCard('اعلان‌ها','در صورت فعال‌سازی یادآوری‌ها، شناسه‌ی فنی اشتراک اعلان دستگاه شما صرفاً برای ارسال یادآوری‌های انتخابی ذخیره می‌شود و با غیرفعال‌سازی یادآوری، این اشتراک لغو می‌گردد.','bell')}
    ${pvCard('استفاده از اطلاعات','اطلاعات شما صرفاً برای ارائه و بهبود خدمات، شخصی‌سازی نتایج و ارسال یادآوری‌های انتخابی به کار می‌رود و بدون رضایت شما در اختیار دیگران قرار نخواهد گرفت.','eye')}
    ${pvCard('آمار و ردیابی','برای بهبود نرم‌افزار از آمار بازدید ناشناس و بدون کوکی (Cloudflare Analytics) استفاده می‌شود که هیچ اطلاعات شخصی یا قابل‌شناسایی گردآوری نمی‌کند. از کوکی یا ابزار ردیابی تبلیغاتی استفاده نمی‌شود.','lock')}
    ${pvCard('حذف اطلاعات','شما می‌توانید در هر زمان با پاک‌کردن داده‌های مرورگر یا برنامه، اطلاعات ذخیره‌شده بر روی دستگاه را حذف کنید و از حساب کاربری خود خارج شوید.','trash')}`);
}
function showTermsPage(){
  render(`${backBtn('showMoreMenu()')}${pageHead('','قوانین و شرایط استفاده','','sm')}
    ${pvCard('پذیرش شرایط','استفاده از «کد کیهانی» به منزله‌ی مطالعه و پذیرش شرایط زیر است.','doc')}
    ${pvCard('ماهیت محتوا','محتوای نرم‌افزار (عددشناسی، طالع‌بینی، فال حافظ و مناجات) جنبه‌ی سرگرمی، فرهنگی و خودشناسی دارد و جایگزین مشاوره‌ی علمی، پزشکی، روان‌شناختی، حقوقی یا مالی نیست.','compass')}
    ${pvCard('مسئولیت تصمیم‌گیری','از اتخاذ تصمیم‌های مهم زندگی صرفاً بر پایه‌ی نتایج این نرم‌افزار خودداری کنید.','info')}
    ${pvCard('صحت اطلاعات','مسئولیت صحت اطلاعات واردشده، از جمله نام و تاریخ تولد، بر عهده‌ی کاربر است.','user')}
    ${pvCard('حساب کاربری','در صورت ایجاد حساب کاربری، حفظ رمز عبور و امنیت حساب بر عهده‌ی کاربر است و هر حساب منحصراً به یک نفر تعلق دارد.','lock')}
    ${pvCard('تغییرات و به‌روزرسانی','محتوا و امکانات نرم‌افزار ممکن است بدون اطلاع قبلی تغییر کند یا به‌روزرسانی شود.','refresh')}
    ${pvCard('سلب مسئولیت','این نرم‌افزار به همان صورتی که هست و بدون هیچ‌گونه ضمانتی ارائه می‌شود و تضمینی برای دقت کامل نتایج وجود ندارد.','shield')}`);
}
function backBtn(fn,label){return `<button class="back-btn" aria-label="${label||'بازگشت'}" onclick="${fn}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>`;}
const ORN_DIV='<div class="orn-div"><span></span><i>✦</i><span></span></div>';
function pageHead(icon,title,sub,cls){return `<div class="pg-head">${icon?`<div class="pg-ic">${icon}</div>`:''}<h1 class="pg-title ${cls||''}">${title}</h1>${ORN_DIV}${sub?`<p class="pg-sub">${sub}</p>`:''}</div>`;}
function toFa(n){return String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);}
function showCosmicInputForm(){
  setNav('cosmic');
  render(`${backBtn('showHome()')}${pageHead('✦','محاسبه‌ی کد کیهانی','اطلاعات خود را وارد کنید تا کد کیهانی شما محاسبه شود.')}
    <div class="card orn">
      <label>نام</label><input id="cf-first" class="ic-user" type="text" placeholder="نام خود را وارد کنید">
      <label>نام خانوادگی</label><input id="cf-family" class="ic-user" type="text" placeholder="نام خانوادگی خود را وارد کنید">
      <label>نام مادر <span style="opacity:.6">(اختیاری، برای پایگاه اجتماعی)</span></label><input id="cf-mother" class="ic-user" type="text" placeholder="نام مادر خود را وارد کنید">
      <label>تاریخ تولد شمسی</label>
      <div class="date-row">
        <div><input id="cf-year" type="number" placeholder="1370" min="1300" max="1420"><small>سال</small></div>
        <div><select id="cf-month">${PERSIAN_MONTHS.map((m,i)=>`<option value="${i+1}">${m}</option>`).join('')}</select><small>ماه</small></div>
        <div><input id="cf-day" type="number" placeholder="15" min="1" max="31"><small>روز</small></div>
      </div>
      <button class="btn" onclick="submitCosmicForm()">✦ محاسبه کن</button>
      <p class="small-note center">✦ کد شما، منحصر به شماست.</p></div>`);
}
function submitCosmicForm(){
  const firstName=document.getElementById('cf-first').value.trim();
  const familyName=document.getElementById('cf-family').value.trim();
  const motherName=document.getElementById('cf-mother').value.trim();
  const jd=parseInt(document.getElementById('cf-day').value,10);
  const jm=parseInt(document.getElementById('cf-month').value,10);
  const jy=parseInt(document.getElementById('cf-year').value,10);
  if(!firstName||!familyName||!jd||!jy||jd<1||jd>31||jy<1300||jy>1420){alert('لطفاً نام، نام خانوادگی و تاریخ تولد رو کامل و درست وارد کن.'); return;}
  const report=calculateCosmicReport(firstName,familyName,motherName,jy,jm,jd);
  saveProfile({firstName,familyName,motherName,jy,jm,jd,report,date:new Date().toISOString()});
  showCosmicResult(firstName,familyName,report);
}
function shortText(t,n){t=String(t||'').replace(/\s+/g,' ').trim(); if(t.length<=n) return t; const c=t.slice(0,n); const i=c.lastIndexOf(' '); return c.slice(0,i>n*0.6?i:n)+'…';}
function fitCode(){const el=document.querySelector('.code'), sp=document.getElementById('code-span'); if(!el||!sp) return; el.style.fontSize='30px'; const avail=el.clientWidth-28, w=sp.getBoundingClientRect().width; if(w>0) el.style.fontSize=Math.max(9,Math.min(30,Math.floor(30*avail/w)))+'px';}
let lastCosmic=null;
function reopenCosmic(){ if(lastCosmic) showCosmicResult(lastCosmic.f,lastCosmic.l,lastCosmic.r); else showCosmicInputForm(); }
function numKeyFor(kind,r){
  if(kind==='income'){for(const k in INCOME_TEXT) if(INCOME_TEXT[k]===r.incomeText) return k; return '2';}
  if(kind==='status') return r.statusText||'راکد';
  return String({destiny:r.destinyNum,fate:r.fateNum,vibration:r.vibrationNum,baten:r.batenNum}[kind]);
}
const NUM_KINDS={destiny:{label:'سرنوشت',ic:'🪷',tbl:()=>SARNEVESHT_TABLE},fate:{label:'تقدیر',ic:'🧭',tbl:()=>TAGHDIR_TABLE},vibration:{label:'ارتعاش تاریخ تولد',ic:'〰️',tbl:()=>ERTEASH_TABLE},baten:{label:'باطن',ic:'🌙',tbl:()=>BATEN_TABLE}};
function numDetail(kind,r){
  const key=numKeyFor(kind,r);
  if(kind==='income'){const i=INCOME_INFO[key]; return {big:'💰',fs:90,title:'وضعیت درآمد - '+i.name,secs:[['وضعیت کلی',i.d,'compass'],['فرصت‌ها',i.s,'shield'],['چالش‌ها',i.c,'mount'],['توصیه‌ها',i.a,'lotus']]};}
  if(kind==='status'){const i=STATUS_INFO[key]||STATUS_INFO['راکد']; return {big:i.ic,fs:110,title:'پایگاه اجتماعی - '+key,secs:[['وضعیت کلی',i.d,'compass'],['فرصت‌ها',i.s,'shield'],['چالش‌ها',i.c,'mount'],['توصیه‌ها',i.a,'lotus']]};}
  const k=NUM_KINDS[kind], e=NUM_INFO[key]||NUM_INFO['9'], main=(k.tbl()||{})[key]||'';
  return {big:toFa(key),fs:key.length>1?96:120,title:`عدد ${toFa(key)} - عدد ${k.label==='ارتعاش تاریخ تولد'?'ارتعاش':k.label} و ${e.name}`,secs:[['ویژگی‌های شخصیتی',main,'compass'],['نقاط قوت',e.s,'shield'],['چالش‌ها',e.c,'mount'],['توصیه‌ها',e.a,'lotus']]};
}
const DT_ICONS={compass:'<path d="M24 3l5 16 16 5-16 5-5 16-5-16-16-5 16-5z"/>',shield:'<path d="M24 4l16 6v12c0 10-7 18-16 22C15 40 8 32 8 22V10z"/><path d="M24 15l2.6 5.6 6 .7-4.4 4.1 1.2 6-5.4-3-5.4 3 1.2-6-4.4-4.1 6-.7z"/>',mount:'<path d="M4 43l14-24 8 12 6-8 12 20z"/><path d="M18 19V6l10 3-10 3"/>',lotus:'<path d="M24 41c-8-3-13-9-13-17 5 0 10 2 13 6 3-4 8-6 13-6 0 8-5 14-13 17z"/><path d="M24 31c-4-6-4-14 0-20 4 6 4 14 0 20z"/>'};
function medalSVG(t,fs){
  let dots=''; for(let i=0;i<24;i++){const a=i*Math.PI/12; dots+=`<circle cx="${(120+95*Math.cos(a)).toFixed(1)}" cy="${(120+95*Math.sin(a)).toFixed(1)}" r="${i%2?1.5:2.6}" fill="#f0c96a"/>`;}
  const dia=[0,90,180,270].map(a=>`<path d="M120 2l8 24h-16z" fill="#f0c96a" transform="rotate(${a} 120 120)"/>`).join('');
  return `<svg viewBox="0 0 240 240" width="210" height="210"><defs><radialGradient id="mg"><stop offset="0" stop-color="#e8b84b" stop-opacity=".35"/><stop offset="1" stop-color="#e8b84b" stop-opacity="0"/></radialGradient></defs><circle cx="120" cy="120" r="118" fill="url(#mg)"/>${dia}${dots}<circle cx="120" cy="120" r="82" fill="#0b0d2a" stroke="#e8b84b" stroke-width="3"/><circle cx="120" cy="120" r="72" fill="none" stroke="#e8b84b" stroke-width="1" stroke-dasharray="2 4"/><circle cx="120" cy="120" r="88" fill="none" stroke="#e8b84b" stroke-width="1" opacity=".6"/><text x="120" y="120" text-anchor="middle" dominant-baseline="central" font-size="${fs*0.62}" font-weight="800" fill="#f0c96a" font-family="VazirLocal,Vazirmatn,Tahoma,sans-serif">${t}</text></svg>`;
}
function showNumberDetail(kind){
  const r=lastCosmic&&lastCosmic.r; if(!r) return showCosmicInputForm();
  const d=numDetail(kind,r);
  const shareTxt=`🌌 ${d.title}\n\n${d.secs.map(x=>x[0]+': '+x[1]).join('\n\n')}\n\nکد کیهانی خودتم اینجا بگیر 👇\n${APP_SHARE_URL}`;
  render(`${backBtn('reopenCosmic()')}<div class="medal">${medalSVG(d.big,d.fs)}</div>
    <h2 class="dt-title">${esc(d.title)}</h2>${ORN_DIV}
    <div class="card orn">${d.secs.map(x=>`<div class="dt-sec"><div style="flex:1"><h3>${x[0]}</h3><p>${esc(x[1])}</p></div><div class="dt-ic"><svg viewBox="0 0 48 48">${DT_ICONS[x[2]]}</svg></div></div>`).join('')}</div>
    <button class="btn" onclick='shareText(${JSON.stringify(shareTxt)})'>📤 اشتراک‌گذاری</button>`);
  window.scrollTo(0,0);
}
function showCosmicResult(firstName,familyName,r){
  lastCosmic={f:firstName,l:familyName,r};
  const card=(kind,ic,t,big,txt)=>`<div class="num-card" onclick="showNumberDetail('${kind}')"><div class="nc-ic">${ic}</div><h4>${t}</h4>${big!==''?`<div class="big">${big}</div>`:''}${txt?`<p>${esc(shortText(txt,70))}</p>`:''}<span class="nc-more">مشاهده‌ی کامل ›</span></div>`;
  const st=r.statusText||'راکد', stInfo=STATUS_INFO[st]||STATUS_INFO['راکد'];
  const incKey=numKeyFor('income',r);
  const bt=(typeof BATEN_TABLE!=='undefined'&&BATEN_TABLE[String(r.batenNum)])||(NUM_INFO[String(r.batenNum)]||{}).s||'';
  const pad=n=>String(n).padStart(2,'0');
  render(`${backBtn('showCosmicInputForm()')}${pageHead('','کد کیهانی')}
    <div class="card orn center"><div class="code"><span id="code-span" style="display:inline-block">${esc(r.cosmicCode)}</span></div></div>
    <div class="cr-name">${esc(firstName)} ${esc(familyName)}</div>
    ${ORN_DIV}
    <div class="chips"><span class="chip2">📅 تاریخ تولد: ${toFa(r.jy)}/${toFa(pad(r.jm))}/${toFa(pad(r.jd))}</span><span class="chip2">☀️ عدد خورشیدی: ${toFa(r.solarNum)}</span></div>
    <div class="num-grid">
      ${card('destiny','🪷','عدد سرنوشت',toFa(r.destinyNum),r.destinyText)}
      ${card('fate','🧭','عدد تقدیر',toFa(r.fateNum),r.fateText)}
      ${card('vibration','〰️','ارتعاش تاریخ تولد',toFa(r.vibrationNum),r.vibrationText)}
      ${card('baten','🌙','عدد باطن',toFa(r.batenNum),bt)}
      ${card('status','👥','پایگاه اجتماعی',st,stInfo.d)}
      ${card('income','💰','وضعیت درآمد','💰',INCOME_INFO[incKey].d)}
    </div>
    <div class="btn-row">
      <button class="btn secondary" onclick="showCosmicInputForm()">🔄 محاسبه‌ی جدید</button>
      <button class="btn" onclick='shareText(${JSON.stringify(`🌌 کد کیهانی ${firstName} ${familyName}\nکد کیهانی: ${r.cosmicCode}\nعدد سرنوشت: ${r.destinyNum} | عدد تقدیر: ${r.fateNum}\n\nکد کیهانیِ خودتم اینجا بگیر 👇\n${APP_SHARE_URL}`)})'>📤 اشتراک‌گذاری</button>
    </div>`);
  fitCode(); if(document.fonts){ document.fonts.ready.then(fitCode); document.fonts.addEventListener&&document.fonts.addEventListener('loadingdone',fitCode); } setTimeout(fitCode,300); setTimeout(fitCode,1200);
}
const APP_SHARE_URL="https://abasalt-cpu.github.io/cosmic-pwa/";
function shareText(text){ if(navigator.share){navigator.share({text});} else {navigator.clipboard.writeText(text); alert('متن کپی شد.');} }
function getHafezDrawState(){
  const key='hafezDrawState'; const today=todayStr();
  let st=JSON.parse(localStorage.getItem(key)||'null');
  if(!st||st.date!==today){ st={date:today,count:0}; localStorage.setItem(key,JSON.stringify(st)); }
  return st;
}
let hafezMode='modern'; // پیش‌فرض: تفسیر مدرن
function getHafezModernToday(){
  const st=JSON.parse(localStorage.getItem('hafezModernState')||'null');
  return (st && st.date===todayStr()) ? st : null;
}
function loadHafezModernData(){
  if(typeof HAFEZ_MODERN_DATA!=='undefined') return Promise.resolve();
  return new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src='data/hafez_modern.js';
    s.onload=()=>resolve();
    s.onerror=()=>reject(new Error('بارگذاری تفسیر مدرن ناموفق بود. اتصال اینترنتت رو چک کن.'));
    document.head.appendChild(s);
  });
}
function renderHafezText(text){
  let html='', list=[], para=[], quote=[];
  const fq=()=>{ if(quote.length){ html+=`<div class="verse" style="margin:8px 0">${quote.join('<br>')}</div>`; quote=[]; } };
  const fp=()=>{ if(para.length){ html+=`<p style="line-height:2; margin:6px 0">${para.join('<br>')}</p>`; para=[]; } };
  const fl=()=>{ if(list.length){ html+=`<ul style="margin:6px 0; padding-inline-start:20px; line-height:2">${list.map(x=>`<li>${x}</li>`).join('')}</ul>`; list=[]; } };
  for(const raw of String(text||'').split('\n')){
    const l=raw.trim();
    if(!l){ fq(); fp(); fl(); continue; }
    if(l.startsWith('>')){ fp(); fl(); quote.push(esc(l.replace(/^>\s?/,''))); }
    else if(/^[*-]\s+/.test(l)){ fq(); fp(); list.push(esc(l.replace(/^[*-]\s+/,''))); }
    else { fq(); fl(); para.push(esc(l)); }
  }
  fq(); fp(); fl();
  return html;
}
function showHafez(mode){
  if(mode) hafezMode=mode;
  const modern=hafezMode==='modern';
  const st=getHafezDrawState(); const remaining=Math.max(0,3-st.count);
  const modernToday=getHafezModernToday();
  const falOn=typeof isDailyFalEnabled==='function' && isDailyFalEnabled();
  const opt=(m,label)=>`<div class="mode-opt${hafezMode===m?' on':''}" onclick="showHafez('${m}')">${hafezMode===m?'◉':'○'} ${label}</div>`;
  const mainBtn=modern
    ? (modernToday
        ? `<button class="btn" id="hafez-btn" disabled style="opacity:.5;cursor:not-allowed">✅ فال AI امروزت رو گرفتی</button>`
        : `<button class="btn" id="hafez-btn" onclick="revealHafezModern()">🌿 فالم رو با AI بگیر (۱ بار در روز)</button>`)
    : `<button class="btn" id="hafez-btn" onclick="revealHafez()"${remaining<=0?' disabled style="opacity:.5;cursor:not-allowed"':''}>🔮 فالم رو بگیر${remaining>0?` (${remaining} بار دیگه امروز)`:''}</button>`;
  const resultInit=(!modern && remaining<=0)?'<p class="small-note">امروز ۳ بار فال گرفتی؛ فردا دوباره سر بزن 🌙</p>':'';
  render(`${backBtn('showHome()')}${pageHead('🔮','فال حافظ')}<div class="card orn">
      <p class="desc">چند لحظه چشم‌هاتو ببند، یه آرزو یا سوال توی دلت نگه‌دار، و بعد نیت کن...</p>
      <div class="hafez-mode">${opt('modern','تفسیر با AI')}${opt('traditional','تفسیر سنتی')}</div>
      <p class="small-note" style="margin-top:0">${modern?'برداشتی امروزی از غزل، همراه با چالش‌ها و گام‌های عملی — روزی یک بار.':'معنی کلاسیک غزل — تا ۳ بار در روز.'}</p>
      ${mainBtn}
      <div id="hafez-result">${resultInit}</div></div>
    <div class="card">
      <h3 style="margin-bottom:8px">🔔 یادآوری فال روزانه</h3>
      <p class="desc">هر روز صبح یه اعلان بهت می‌رسه که یادت بندازه فالت رو بگیری.</p>
      <p id="fal-push-msg" class="small-note" style="min-height:18px"></p>
      <button class="btn${falOn?' secondary':''}" id="fal-push-btn" onclick="handleDailyFalToggle()">${falOn?'🔕 غیرفعال‌کردن یادآوری':'🔔 فعال‌کردن یادآوری روزانه'}</button>
    </div>`);
  if(modern && modernToday) renderHafezModernResult(modernToday.id);
  if(!modern){ try{ const ld=JSON.parse(localStorage.getItem('hafezLastDraw')||'null'); if(ld&&ld.date===todayStr()&&ld.g&&(3-st.count)===ld.remaining) renderTradResult(ld.g,ld.remaining); }catch(e){} }
}
async function revealHafezModern(){
  if(getHafezModernToday()) return;
  const btn=document.getElementById('hafez-btn');
  if(btn){ btn.disabled=true; btn.textContent='در حال آماده‌سازی...'; }
  try{ await loadHafezModernData(); }
  catch(e){
    if(btn){ btn.disabled=false; btn.textContent='🌿 فالم رو با AI بگیر (۱ بار در روز)'; }
    document.getElementById('hafez-result').innerHTML=`<p class="small-note" style="color:#ff8a8a">${esc(e.message)}</p>`;
    return;
  }
  const id=(simpleHash(getDeviceId()+'-modern-'+todayStr())%HAFEZ_MODERN_DATA.length)+1;
  localStorage.setItem('hafezModernState', JSON.stringify({date:todayStr(), id}));
  showHafez();
}
async function renderHafezModernResult(id){
  const box=document.getElementById('hafez-result');
  if(!box) return;
  box.innerHTML='<p class="small-note">در حال بارگذاری...</p>';
  try{ await loadHafezModernData(); }
  catch(e){ box.innerHTML=`<p class="small-note" style="color:#ff8a8a">${esc(e.message)}</p>`; return; }
  const g=HAFEZ_MODERN_DATA[id-1];
  if(!g){ box.innerHTML=''; return; }
  const shareTxt=`🔮 فال حافظِ من (تفسیر با AI):\n\n${g.p.join('\n')}\n\n${g.f.replace(/\s+/g,' ')}\n\nفال خودتم اینجا بگیر 👇\n${APP_SHARE_URL}`;
  box.innerHTML=`<div class="result-block">
    <div class="verse">${g.p.map(esc).join('<br>')}</div>
    ${g.t!==g.p[0]?`<h3 style="margin:12px 0 4px; color:var(--gold-soft)">${esc(g.t)}</h3>`:''}
    <p class="small-note" style="margin-top:6px">${esc(g.a)}</p>
    <h3 class="hz-sec">🪞 آینه‌ی غزل</h3>${renderHafezText(g.m)}
    <h3 class="hz-sec">⚡ چالش‌ها</h3>${renderHafezText(g.c)}
    <h3 class="hz-sec">🧭 گام‌های عملی</h3>${renderHafezText(g.x)}
    <h3 class="hz-sec">💬 پیام پایانی</h3>${renderHafezText(g.f)}
    <button class="btn small secondary" onclick="showFullGhazal('${id}')">📜 نمایش کل غزل</button>
    <button class="btn small secondary" onclick='shareText(${JSON.stringify(shareTxt)})'>📤 اشتراک‌گذاری</button>
  </div><p class="small-note">این فال امروزته — فردا می‌تونی دوباره بگیری 🌙</p>`;
}
function handleDailyFalToggle(){
  const btn=document.getElementById('fal-push-btn');
  const msg=document.getElementById('fal-push-msg');
  msg.textContent='';
  if(isDailyFalEnabled()){
    disableDailyFalReminder().then(()=>{ showHafez(); });
    return;
  }
  btn.disabled=true; btn.textContent='در حال فعال‌سازی...';
  enableDailyFalReminder().then(()=>{ showHafez(); }).catch((err)=>{
    btn.disabled=false; btn.textContent='🔔 فعال‌کردن یادآوری روزانه';
    msg.style.color='#ff8a8a'; msg.textContent=err.message||'خطایی پیش اومد.';
  });
}
function getDeviceId(){
  let id=localStorage.getItem('deviceId');
  if(!id){
    // [S1-hardening] شناسه دستگاه با تصادف رمزنگارانه (Math.random قابل پیش‌بینی است)
    const b=new Uint8Array(16); crypto.getRandomValues(b);
    id='dev-'+[...b].map(x=>x.toString(16).padStart(2,'0')).join('');
    localStorage.setItem('deviceId',id);
  }
  return id;
}
// ---------- ردیابی خطا (به‌جای Sentry، چون از ایران فیلتره) ----------
function reportError(message, stack){
  if(typeof AUTH_API_BASE==='undefined' || AUTH_API_BASE.includes('YOUR-WORKER')) return;
  try{
    fetch(AUTH_API_BASE+'/errors/log', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ message:String(message).slice(0,500), stack:stack?String(stack).slice(0,2000):null, url:location.href, deviceId:getDeviceId() }),
    }).catch(()=>{});
  }catch(e){}
}
window.addEventListener('error', (e)=>{ reportError(e.message, e.error&&e.error.stack); });
window.addEventListener('unhandledrejection', (e)=>{ reportError('Unhandled promise: '+(e.reason&&e.reason.message||e.reason), e.reason&&e.reason.stack); });
function getSessionSlogan(){
  let s=sessionStorage.getItem('sessionSlogan');
  if(!s){ s=getRandomSlogan(); sessionStorage.setItem('sessionSlogan', s); }
  return s;
}
function rerollSlogan(){
  const s=getRandomSlogan();
  sessionStorage.setItem('sessionSlogan', s);
  const el=document.getElementById('bannerSlogan');
  if(el) el.textContent=s;
}
function revealHafez(){
  const st=getHafezDrawState();
  if(st.count>=3) return;
  st.count++; localStorage.setItem('hafezDrawState', JSON.stringify(st));
  const g=getDailyFal(getDeviceId()+'-draw'+st.count);
  const remaining=3-st.count;
  localStorage.setItem('hafezLastDraw',JSON.stringify({date:todayStr(),remaining,g:{id:g.id,verses:g.verses,interpretation:g.interpretation}}));
  renderTradResult(g,remaining);
  const btn=document.getElementById('hafez-btn');
  if(btn){
    if(remaining<=0){ btn.disabled=true; btn.style.opacity='.5'; btn.style.cursor='not-allowed'; btn.textContent='🔮 فالم رو بگیر'; }
    else{ btn.textContent=`🔮 فالم رو بگیر (${remaining} بار دیگه امروز)`; }
  }
}
function renderTradResult(g,remaining){
  document.getElementById('hafez-result').innerHTML=`<div class="result-block"><div class="verse">${g.verses.join('<br>')}</div>
    <p style="margin-top:10px"><b class="hz-sec">✦ تعبیر فال:</b><br>${esc(g.interpretation)}</p>
    <button class="btn small secondary" onclick="showFullGhazal('${g.id}')">📜 نمایش کل غزل</button>
    <button class="btn small secondary" onclick='shareText(${JSON.stringify(`🔮 فال حافظ من:\n\n${g.verses.join("\n")}\n\nفال خودتم اینجا بگیر 👇\n${APP_SHARE_URL}`)})'>📤 اشتراک‌گذاری</button></div>
    <p class="small-note">${remaining>0?`${remaining} فال دیگه برات مونده امروز`:'فال‌های امروزت تموم شد؛ فردا دوباره بیا 🌙'}</p>`;
}
function showFullGhazal(id){
  const g=getGhazalById(id);
  render(`${backBtn('showHafez()')}${pageHead('📜','غزل شماره‌ی '+toFa(id.replace('hafez-extra-','')),'', 'sm')}<div class="card orn">
      <div class="verse" style="line-height:2.2">${(g.full_verses||g.verses).join('<br>')}</div></div>`);
}
function showMunajat(){
  const item=getRandomMunajat();
  render(`${backBtn('showHome()')}${pageHead('🕊','مناجات')}
    <div class="card orn center"><div class="verse">${esc(item.text)}</div>
      ${ORN_DIV}<div class="attrib">خواجه عبدالله انصاری</div>
      <button class="btn" onclick="showMunajat()">🔄 مناجات دیگر</button></div>`);
}
function showElham(){
  const item=getTodayElham();
  const shareTxt=`🌅 الهام امروز:\n\n${item.verses.join('\n')}${item.poet?'\n— '+item.poet:''}\n\nالهام روزانه‌ی خودتم اینجا بگیر 👇\n${APP_SHARE_URL}`;
  render(`${backBtn('showHome()')}${pageHead('🌅','الهام روز')}
    <div class="card orn"><div class="verse">${item.verses.join('<br>')}</div>
      ${item.poet?`${ORN_DIV}<div class="attrib center">${esc(item.poet)}</div>`:''}
      <div class="result-block"><b class="hz-sec">✦ تفسیر:</b><br>${esc(item.interpretation)}</div>
      <div class="small-note center">★ یک الهام ثابت در روز، بدون تکرار تا کل مجموعه تموم بشه.</div>
      <button class="btn" onclick='shareText(${JSON.stringify(shareTxt)})'>📤 اشتراک‌گذاری</button></div>`);
}
function showZamanbandi(){
  const item=getRandomZamanbandi();
  render(`${backBtn('showHome()')}${pageHead('⏳','به زمان‌بندی خدا اعتماد کن','','sm')}
    <div class="card orn center"><div class="big-time">${item.time}</div>${ORN_DIV}
      <div class="verse">${esc(item.quote)}</div>${ORN_DIV}
      <p class="small-note">📖 این جمله از کتاب «به زمان‌بندی خدا اعتماد کن» (آکیرا، ترجمه‌ی نهال سهیلی‌فر) است.<br>
      <a href="${ZAMANBANDI_LINK}" target="_blank" style="color:var(--gold-soft)">برای خوندن کامل کتاب اینجا بزن</a></p>
      <button class="btn" onclick="showZamanbandi()">🔄 یکی دیگه</button></div>`);
}
function showZodiacEntry(){
  if(state.savedProfiles.length>=1){
    render(`${backBtn('showHome()')}<div class="card"><h2>♈️ طالع‌بینی — کدوم پروفایل؟</h2>
        ${state.savedProfiles.map((p,i)=>`<div class="name-item" style="cursor:pointer" onclick="showZodiacForProfile(${i})"><b>${esc(p.firstName)} ${esc(p.familyName)}</b> — ${new Date(p.date).toLocaleDateString('fa-IR')}</div>`).join('')}
        <div class="name-item" style="cursor:pointer" onclick="showMonthPickerForZodiac()">👤 شخص دیگه (فقط انتخاب ماه تولد)</div>
      </div>`);
  } else { showMonthPickerForZodiac(); }
}
function showZodiacForProfile(i){
  const p=state.savedProfiles[i];
  showZodiac(p.jm, `${p.firstName} ${p.familyName}`);
}
function showMonthPickerForZodiac(){
  render(`${backBtn('showHome()')}<div class="card"><h2>ماه تولدت رو انتخاب کن:</h2>
      <div class="chip-row">${PERSIAN_MONTHS.map((m,i)=>`<div class="chip" onclick="showZodiac(${i+1})">${m}</div>`).join('')}</div></div>`);
}
function showZodiac(jm, name){
  const text=formatHoroscope(jm);
  render(`${backBtn('showHome()')}<div class="card">${name?`<h2>♈️ طالع‌بینی ${esc(name)}</h2>`:''}<div class="verse" style="white-space:pre-line; line-height:2.1">${esc(text)}</div></div>`);
}
function showNatalEntry(){
  if(!state.lastProfile){
    render(`${backBtn('showHome()')}${pageHead('🌌','زایچه‌ی تقریبی')}<div class="card orn">
      <p class="desc">برای زایچه، اول یه‌بار «کد کیهانی» رو محاسبه کن (چون از همون تاریخ تولد استفاده می‌کنیم).</p>
      <button class="btn" onclick="showCosmicInputForm()"><span class="btn-inner">محاسبه‌ی کد کیهانی<span class="btn-badge">${ICON_CALC}</span><span class="btn-chevron">›</span></span></button></div>`); return;
  }
  const p=state.lastProfile;
  render(`${backBtn('showHome()')}${pageHead('🌌','زایچه‌ی تقریبی')}<div class="card orn">
      <p class="desc">برای ${esc(p.firstName)} ${esc(p.familyName)} — به ساعت و شهر تولد هم نیاز داریم.</p>
      <label>ساعت تولد (۰ تا ۲۳)</label><input id="nt-hour" type="number" min="0" max="23" placeholder="مثلاً 14">
      <label>دقیقه تولد</label><input id="nt-min" type="number" min="0" max="59" placeholder="مثلاً 30">
      <label>شهر تولد</label><select id="nt-city">${Object.keys(IRAN_CITIES).map(k=>`<option value="${k}">${IRAN_CITIES[k].display_name}</option>`).join('')}</select>
      <button class="btn" onclick="submitNatal()">محاسبه‌ی زایچه</button></div>`);
}
function submitNatal(){
  const hour=parseInt(document.getElementById('nt-hour').value,10);
  const minute=parseInt(document.getElementById('nt-min').value,10)||0;
  const city=document.getElementById('nt-city').value;
  if(isNaN(hour)){alert('ساعت تولد رو وارد کن.'); return;}
  const p=state.lastProfile;
  const [gy,gm,gd]=jalaliToGregorian(p.jy,p.jm,p.jd);
  const result=calculateNatal(gy,gm,gd,hour,minute,city);
  render(`${backBtn('showNatalEntry()')}<div class="card orn"><div class="verse" style="white-space:pre-line; line-height:2.1; text-align:justify; text-align-last:right">${esc(formatNatal(result))}</div></div>`);
}
function showBabyNameForm(){
  render(`${backBtn('showHome()')}${pageHead('👶','پیشنهاد اسم فرزند')}<div class="card orn">
      <label>جنسیت فرزند</label>
      <div class="chip-row two"><div class="chip" id="bn-boy" onclick="pickGender('boy')">👦 پسر</div><div class="chip" id="bn-girl" onclick="pickGender('girl')">👧 دختر</div></div>
      <label>نام خانوادگی پدر</label><input id="bn-family" class="ic-user" type="text" placeholder="نام خانوادگی پدر">
      <label>نام مادر فرزند</label><input id="bn-mother" class="ic-user" type="text" placeholder="نام مادر">
      <label>وضعیت پایگاه اجتماعی</label>
      <select id="bn-status"><option value="any">فرقی نداره</option><option value="2" selected>صعودی</option><option value="1">نزولی</option><option value="03">راکد</option></select>
      <label>وضعیت درآمد</label>
      <select id="bn-income"><option value="any">فرقی نداره</option><option value="0">پایدار و بخت‌باز</option><option value="2" selected>متوسط رو به بالا</option><option value="1">پرنوسان</option></select>
      <button class="btn" onclick="submitBabyName()">پیشنهاد بده</button>
      <p class="small-note">اسم‌ها بر اساس ترکیب نام، فامیلی و نام مادر با وضعیت اجتماعی و درآمدی که انتخاب می‌کنی فیلتر می‌شن. هر کدوم رو «فرقی نداره» بذاری، گزینه‌های بیشتری می‌بینی.</p></div>`);
  window.selectedGender='boy'; document.getElementById('bn-boy').classList.add('active');
}
function pickGender(g){window.selectedGender=g; document.getElementById('bn-boy').classList.toggle('active',g==='boy'); document.getElementById('bn-girl').classList.toggle('active',g==='girl');}
let babyQuery=null;
function submitBabyName(){
  const family=document.getElementById('bn-family').value.trim();
  const mother=document.getElementById('bn-mother').value.trim();
  if(!family||!mother){alert('نام خانوادگی و نام مادر رو وارد کن.'); return;}
  const sv=document.getElementById('bn-status').value, iv=document.getElementById('bn-income').value;
  babyQuery={gender:window.selectedGender, family, mother, status:sv==='any'?null:(sv==='03'?['0','3']:sv), income:iv==='any'?null:iv, showTags:(sv==='any'||iv==='any')};
  renderBabyPage(0);
}
function renderBabyPage(page){
  const result=getAllMatches(babyQuery.gender,babyQuery.family,babyQuery.mother,babyQuery.status,babyQuery.income);
  const pageData=formatBabyNamePage(babyQuery.gender,result,page);
  render(`${backBtn('showBabyNameForm()')}<div class="card"><div style="white-space:pre-line; line-height:2">${esc(pageData.text)}</div>
      ${pageData.hasMore?`<button class="btn secondary" onclick="renderBabyPage(${page+1})">➡️ ۱۰ اسم بعدی</button>`:''}</div>`);
}
function showCompareEntry(){
  const hasProfiles=state.savedProfiles.length>0;
  const profileOptions=state.savedProfiles.map((p,i)=>`<option value="${i}">${esc(p.firstName)} ${esc(p.familyName)}</option>`).join('');
  function personBlock(n){
    if(!hasProfiles){
      return `<label>نام و فامیل نفر ${n}</label><input id="cp-n${n}" class="ic-user" type="text" placeholder="مثلاً علی محمدی">
        <label>تاریخ تولد نفر ${n} (شمسی، مثلاً 1370/5/15)</label><input id="cp-d${n}" type="text" placeholder="سال/ماه/روز">`;
    }
    return `<label>نفر ${n}</label>
      <select id="cp-sel${n}" onchange="toggleCompareManual(${n})">
        ${profileOptions}
        <option value="manual">شخص دیگر (وارد کردن دستی)</option>
      </select>
      <div id="cp-manual${n}" style="display:none">
        <label>نام و فامیل نفر ${n}</label><input id="cp-n${n}" class="ic-user" type="text" placeholder="مثلاً علی محمدی">
        <label>تاریخ تولد نفر ${n} (شمسی)</label><input id="cp-d${n}" type="text" placeholder="سال/ماه/روز">
      </div>`;
  }
  render(`${backBtn('showHome()')}${pageHead('🔗','مقایسه‌ی دو نفر','سرنوشت، شخصیت و انرژی شما دو نفر')}<div class="card orn">
      <p class="desc">${hasProfiles?'می‌تونی از پروفایل‌های ذخیره‌شده انتخاب کنی یا مشخصات یه نفر جدید رو وارد کنی:':'اطلاعات هر دو نفر رو وارد کن:'}</p>
      <div class="pg-person">✦ شخص اول ①</div>${personBlock(1)}
      ${ORN_DIV}
      <div class="pg-person">✦ شخص دوم ②</div>${personBlock(2)}
      <button class="btn" onclick="submitCompare()">مقایسه کن</button></div>`);
}
function toggleCompareManual(n){
  const sel=document.getElementById('cp-sel'+n).value;
  document.getElementById('cp-manual'+n).style.display = sel==='manual' ? 'block':'none';
}
function parseDate(s){const parts=(s||'').split('/').map(x=>parseInt(x.trim(),10)); if(parts.length!==3||parts.some(isNaN))return null; return {jy:parts[0],jm:parts[1],jd:parts[2]};}
function getComparePerson(n){
  const hasProfiles=state.savedProfiles.length>0;
  if(hasProfiles){
    const sel=document.getElementById('cp-sel'+n).value;
    if(sel!=='manual'){
      const p=state.savedProfiles[parseInt(sel,10)];
      return {name:`${p.firstName} ${p.familyName}`, jm:p.jm, report:p.report};
    }
  }
  const name=document.getElementById('cp-n'+n).value.trim();
  const d=parseDate(document.getElementById('cp-d'+n).value);
  if(!name||!d) return null;
  const [first,...fam]=name.split(' ');
  const report=calculateCosmicReport(first,fam.join(' ')||first,'',d.jy,d.jm,d.jd);
  return {name, jm:d.jm, report};
}
function traitText(table, num){ return table[String(num)] || ''; }
const SAME_INSIGHTS={
  destinyNum:'این اشتراک یعنی مسیر بزرگ زندگی و اهداف بلندمدتتون هم‌راستاست؛ یه پایه‌ی محکم برای ساختن برنامه‌های مشترک بلندمدت، از انتخاب شغل مشترک گرفته تا تصمیم‌های سرنوشت‌ساز خانوادگی.',
  fateNum:'این اشتراک یعنی در موقعیت‌های تصمیم‌گیری آنیِ روزمره، غریزه‌تون شبیه همه؛ بدون نیاز به توضیح زیاد، واکنش همدیگه رو پیش‌بینی می‌کنید.',
  vibrationNum:'این اشتراک یعنی ریتم و سرعت انرژی روزمره‌تون هماهنگه؛ برنامه‌ریزی، استراحت و فعالیت مشترک براتون طبیعی و بی‌دردسر پیش می‌ره.',
  batenNum:'این اشتراک یعنی انگیزه‌های عمیق و نیازهای درونی‌تون از یه جنسه؛ حتی وقتی حرفش رو نمی‌زنید هم ناخودآگاه همدیگه رو می‌فهمید.'
};
const DIFF_INSIGHTS={
  destinyNum:{
    close:'چون فاصله‌ی عدد سرنوشت‌تون کمه، مسیر بزرگ زندگی‌تون در عمیق‌ترین لایه هم‌جهته؛ حتی اگه ظاهراً سبک‌های متفاوتی داشته باشید، مقصد نهایی‌تون به هم نزدیکه.',
    moderate:'فاصله‌ی متوسط بین اعداد سرنوشتتون یعنی مسیرهای زندگی‌تون گاهی موازی و گاهی واگرا می‌شه. برای هماهنگی، باید هدف‌های بلندمدت‌تون رو صریح با هم در میون بذارید، وگرنه ممکنه هرکدوم بی‌خبر از دیگری مسیر خودش رو بره.',
    far:'فاصله‌ی زیاد بین اعداد سرنوشتتون نشون می‌ده مسیرهای زندگی‌تون از جنس خیلی متفاوتی هستن. این می‌تونه رابطه رو غنی کنه چون هرکدوم چیزی می‌بینه که دیگری نمی‌بینه، اما بدون گفت‌وگوی آگاهانه‌ی مداوم درباره‌ی اولویت‌های بلندمدت، ممکنه احساس کنید دارید در دو مسیر جدا از هم حرکت می‌کنید.'
  },
  fateNum:{
    close:'عدد تقدیرتون نزدیک به همه، یعنی واکنش غریزی‌تون در موقعیت‌های روزمره شبیه همه؛ این باعث می‌شه بدون نیاز به توضیح زیاد، همدیگه رو پیش‌بینی کنید.',
    moderate:'تفاوت متوسط در عدد تقدیر یعنی سبک تصمیم‌گیری آنی‌تون گاهی هم‌راستا و گاهی متضاده. یاد گرفتن اینکه کِی باید جلو رفت و کِی باید صبر کرد، نیاز به تمرین و صبر مشترک داره.',
    far:'فاصله‌ی زیاد در عدد تقدیر یعنی در لحظات تصمیم‌گیری سریع، واکنش‌هاتون کاملاً متفاوته. این تفاوت اگه مدیریت نشه، منبع اصلی سوءتفاهم‌های آنیه؛ بهتره قبل از تصمیم‌های مهم، صریح درباره‌ی غریزه‌ی اولیه‌تون حرف بزنید تا یکی‌تون احساس عجله‌ی بی‌مورد یا کندیِ آزاردهنده نکنه.'
  },
  vibrationNum:{
    close:'ریتم انرژی روزمره‌تون به هم نزدیکه؛ سرعت زندگی، میزان فعالیت و نیاز به استراحت‌تون هماهنگه و همین باعث می‌شه برنامه‌ریزی روزمره راحت‌تر پیش بره.',
    moderate:'یه اختلاف محسوس در ریتم انرژی‌تون هست؛ یکی‌تون ممکنه سریع‌تر حرکت کنه و دیگری کندتر. اگه این تفاوت رو زودتر بشناسید، می‌تونید سرعت مشترکی پیدا کنید که هیچ‌کدوم رو خسته نکنه.',
    far:'فاصله‌ی زیاد در ریتم انرژی یعنی سبک زندگی روزمره‌تون از نظر سرعت و شدت فعالیت خیلی فرق داره. این می‌تونه باعث بشه یکی احساس کنه دیگری خیلی کند یا خیلی تنده؛ هماهنگ‌کردن این ریتم نیاز به توافق آگاهانه روی زمان‌بندی‌های روزمره داره، نه انتظار اینکه یکی‌تون خودش رو کامل با اون یکی وفق بده.'
  },
  batenNum:{
    close:'نیازهای درونی و انگیزه‌های پنهان‌تون به هم نزدیکه؛ حتی چیزهایی که به زبون نمیارید رو ناخودآگاه در هم می‌فهمید.',
    moderate:'انگیزه‌های درونی‌تون تا حدی متفاوته؛ چیزی که یکی‌تون در عمق دنبالشه ممکنه برای دیگری اولویت نباشه. گفت‌وگو درباره‌ی نیازهای واقعی (نه فقط خواسته‌های ظاهری) کمک می‌کنه این فاصله پر بشه.',
    far:'باطن‌تون از دو جنس کاملاً متفاوته؛ انگیزه‌های عمیقی که هرکدوم رو به حرکت درمیاره، فرق زیادی با هم داره. این می‌تونه رابطه رو جذاب و پرکشش کنه، اما فقط اگه هرکدوم برای فهمیدن نیاز واقعیِ اون یکی، آگاهانه وقت بذاره.'
  }
};
function numDiffTier(key, n1, n2){
  const d=Math.abs(n1-n2);
  if(key==='vibrationNum'){ return d<=1?'close':(d===2?'moderate':'far'); }
  if(key==='batenNum'){ return d<=2?'close':(d<=5?'moderate':'far'); }
  return d<=3?'close':(d<=10?'moderate':'far');
}
function compareMetricBlock(label, emoji, table, n1, n2, name1, name2, key){
  const t1=traitText(table,n1), t2=traitText(table,n2);
  if(n1===n2){
    return `<div class="card"><h3>${emoji} ${label} مشترک: ${n1}</h3>
      <p style="line-height:1.9">${esc(t1)}</p>
      <p style="line-height:1.9">${esc(SAME_INSIGHTS[key])}</p></div>`;
  }
  const tier=numDiffTier(key,n1,n2);
  const insight=DIFF_INSIGHTS[key][tier];
  return `<div class="card"><h3>${emoji} ${label}: ${esc(name1)} (${n1}) — ${esc(name2)} (${n2})</h3>
    <p style="line-height:1.9"><b>${esc(name1)}:</b> ${esc(t1)}</p>
    <p style="line-height:1.9"><b>${esc(name2)}:</b> ${esc(t2)}</p>
    <p style="line-height:1.9">${esc(insight)}</p></div>`;
}
function metricScore(key,n1,n2){
  if(n1===n2) return 2;
  const t=numDiffTier(key,n1,n2);
  return t==='close'?1:(t==='moderate'?0:-1);
}
function overallVerdict(totalScore, shared){
  if(totalScore>=5) return {title:'سازگاری قوی', text:`با مجموع امتیاز بالا در معیارهای عددی، این دو نفر در بیشتر ابعاد شخصیتی هم‌راستا هستن. این یعنی زندگی مشترک یا همکاری نزدیک بین‌تون به‌طور طبیعی و با اصطکاک کم پیش می‌ره — نقطه‌ی قوت‌تون هماهنگی درونیه، نه شباهت سطحی.`};
  if(totalScore>=2) return {title:'سازگاری خوب با نقاط قابل‌کار', text:`ترکیبی از شباهت و تفاوت بین عددهاتون هست. این یعنی رابطه‌تون هم پایه‌ی مشترک محکمی داره و هم فضای رشد؛ نقاطی که فاصله دارن، دقیقاً همون جاهاییه که با گفت‌وگوی آگاهانه بیشترین رشد رو تجربه می‌کنید.`};
  if(totalScore>=-1) return {title:'سازگاری متعادل، نیازمند آگاهی', text:`تفاوت‌های عددی‌تون قابل‌توجه‌ست. این به‌معنای ناسازگاری نیست، بلکه یعنی باید فعالانه روی شناخت سبک‌های متفاوت هم کار کنید؛ رابطه‌هایی با این الگو معمولاً وقتی موفق‌ترن که هر دو طرف تفاوت رو به‌جای تهدید، فرصت یادگیری ببینن.`};
  return {title:'چالش‌برانگیز اما قابل‌مدیریت', text:`اکثر معیارهای عددی‌تون فاصله‌ی زیادی دارن؛ یعنی از نظر مسیر زندگی، غریزه‌ی تصمیم‌گیری، ریتم انرژی و انگیزه‌های درونی، دو الگوی متفاوت دارید. این ترکیب می‌تونه بسیار جذاب و پویا باشه، اما فقط با ارتباط صریح و مداوم پایدار می‌مونه — بدون گفت‌وگو، همین تفاوت‌ها می‌تونن به سوءتفاهم مزمن تبدیل بشن.`};
}
function buildCompareNarrative(person1, person2, r1, r2){
  return [
    compareMetricBlock('عدد سرنوشت','🌟',SARNEVESHT_TABLE,r1.destinyNum,r2.destinyNum,person1.name,person2.name,'destinyNum'),
    compareMetricBlock('عدد تقدیر','🔮',TAGHDIR_TABLE,r1.fateNum,r2.fateNum,person1.name,person2.name,'fateNum'),
    compareMetricBlock('عدد ارتعاش','⚡',ERTEASH_TABLE,r1.vibrationNum,r2.vibrationNum,person1.name,person2.name,'vibrationNum'),
    compareMetricBlock('عدد باطن','🔎',BATEN_TABLE,r1.batenNum,r2.batenNum,person1.name,person2.name,'batenNum'),
  ].join('');
}
function submitCompare(){
  const person1=getComparePerson(1), person2=getComparePerson(2);
  if(!person1||!person2){alert('اطلاعات هر دو نفر رو کامل و درست وارد کن.'); return;}
  const r1=person1.report, r2=person2.report;
  const fields=[["عدد سرنوشت","destinyNum"],["عدد تقدیر","fateNum"],["ارتعاش","vibrationNum"],["عدد باطن","batenNum"]];
  let shared=0, totalScore=0;
  fields.forEach(([label,key])=>{ if(r1[key]===r2[key])shared++; totalScore+=metricScore(key,r1[key],r2[key]); });
  const zc=zodiacCompatibility(person1.jm,person2.jm);
  const narrative=buildCompareNarrative(person1,person2,r1,r2);
  const verdict=overallVerdict(totalScore, shared);
  render(`${backBtn('showCompareEntry()')}<div class="card"><h2>🔗 مقایسه‌ی ${esc(person1.name)} و ${esc(person2.name)}</h2>
      <p class="desc">از ${fields.length} معیار عددی، ${shared} مورد مشترکه.</p></div>
    ${narrative}
    <div class="card"><h3>♈️ سازگاری طالعی</h3><div style="white-space:pre-line; line-height:1.9">${esc(zc)}</div></div>
    <div class="card" style="border-color:var(--gold, #e8b84b)"><h3>🧭 جمع‌بندی: ${esc(verdict.title)}</h3><p style="line-height:1.9">${esc(verdict.text)}</p></div>`);
}
function getGratitudeToday(){
  const todayKey=new Date().toDateString();
  function shuffleNew(){
    const arr=GRATITUDE_DATA.map(x=>x.day);
    for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; }
    return arr;
  }
  let order=JSON.parse(localStorage.getItem('gratitudeOrder')||'null');
  let position=parseInt(localStorage.getItem('gratitudePosition')||'-1',10);
  let lastDate=localStorage.getItem('gratitudeLastDate');

  if(!Array.isArray(order) || order.length!==GRATITUDE_DATA.length){
    order=shuffleNew(); position=-1; lastDate=null;
  }
  if(lastDate!==todayKey){
    position++;
    if(position>=order.length){ order=shuffleNew(); position=0; }
    localStorage.setItem('gratitudeOrder', JSON.stringify(order));
    localStorage.setItem('gratitudePosition', String(position));
    localStorage.setItem('gratitudeLastDate', todayKey);
  }
  const dayId=order[position];
  const entry=GRATITUDE_DATA.find(x=>x.day===dayId)||GRATITUDE_DATA[0];
  return { entry, position: position+1, total: order.length };
}
function showGratitude(){
  const { entry, position, total } = getGratitudeToday();
  render(`${backBtn('showHome()')}
    ${pageHead('🙏','شکرگزاری')}
    <div class="center"><span class="count-chip">✦ ${toFa(position)} از ${toFa(total)} روز</span></div>
    <div class="card orn">
      <p class="en-line">${esc(entry.english)}</p>
      <p class="verse" style="font-size:15.5px">${esc(entry.persian)}</p>
      <button class="btn" onclick='shareText(${JSON.stringify(`🙏 شکرگزاری امروزم:\n\n${entry.persian}\n\n${entry.english}\n\nتو هم اینجا یه جمله‌ی شکرگزاری روزانه بگیر 👇\n${APP_SHARE_URL}`)})'>📤 اشتراک‌گذاری</button>
    </div>`);
}
function showSavedProfiles(){
  setNav('profiles');
  const pushOn=typeof isBirthdayRemindersEnabled==='function' && isBirthdayRemindersEnabled();
  const now=new Date(); const todayM=now.getMonth()+1, todayD=now.getDate();
  render(`<div class="card"><h2>📇 پروفایل‌های من</h2>
      ${state.savedProfiles.length===0?'<p class="desc">هنوز پروفایلی ذخیره نشده.</p>':
        state.savedProfiles.map((p,i)=>{
          const isBday=p.report && p.report.gm===todayM && p.report.gd===todayD;
          const fullName=`${p.firstName} ${p.familyName}`.trim();
          const nameHtml=isBday
            ? `<span onclick="event.stopPropagation(); launchBalloons(['${esc(fullName).replace(/'/g,"\\'")}'])" style="cursor:pointer"><b>${esc(p.firstName)} ${esc(p.familyName)}</b></span>`
            : `<b>${esc(p.firstName)} ${esc(p.familyName)}</b>`;
          return `<div class="name-item" style="display:flex; align-items:center; justify-content:space-between; gap:8px; cursor:pointer${isBday?'; background:linear-gradient(90deg, #e8b84b22, transparent); border-radius:8px; padding-inline-start:8px':''}" onclick="showSavedProfile(${i})">
            <span style="flex:1; min-width:0; overflow-wrap:break-word">${isBday?'💐 ':''}${nameHtml}${isBday?' <span style="color:var(--gold-soft); font-size:12px">(امروز تولدشه 🎉)</span>':''} — کد: <span style="direction:ltr; unicode-bidi:isolate; color:var(--gold-soft); display:inline-block">${esc(p.report.cosmicCode)}</span></span>
            <button onclick="event.stopPropagation(); handleDeleteProfile(${i})" aria-label="حذف پروفایل" style="background:none; border:none; color:#ff8a8a; font-size:17px; cursor:pointer; padding:4px 6px; flex-shrink:0; line-height:1">🗑️</button>
          </div>`;
        }).join('')}
    </div>
    <div class="card">
      <h3 style="margin-bottom:8px">🎂 یادآوری تولد</h3>
      <p class="desc">روز تولد هرکدوم از این پروفایل‌ها، یه اعلان بهت می‌رسه — حتی وقتی اپ بسته‌ست.</p>
      <p id="push-status-msg" class="small-note" style="min-height:18px"></p>
      <button class="btn${pushOn?' secondary':''}" id="push-toggle-btn" onclick="handlePushToggle()">${pushOn?'🔕 غیرفعال‌کردن یادآوری':'🔔 فعال‌کردن یادآوری تولد'}</button>
    </div>`);
}
function handleDeleteProfile(i){
  const p=state.savedProfiles[i];
  if(!p) return;
  if(!confirm(`پروفایل «${p.firstName} ${p.familyName}» حذف بشه؟`)) return;
  state.savedProfiles.splice(i,1);
  localStorage.setItem('savedProfiles',JSON.stringify(state.savedProfiles));
  if(typeof isBirthdayRemindersEnabled==='function' && isBirthdayRemindersEnabled()){
    syncBirthdayReminders().catch(()=>{});
  }
  syncProfilesToServer();
  showSavedProfiles();
}
function handlePushToggle(){
  const btn=document.getElementById('push-toggle-btn');
  const msg=document.getElementById('push-status-msg');
  const isOn=isBirthdayRemindersEnabled();
  msg.textContent='';
  if(isOn){
    disableBirthdayReminders().then(()=>{ showSavedProfiles(); });
    return;
  }
  btn.disabled=true; btn.textContent='در حال فعال‌سازی...';
  enableBirthdayReminders().then(()=>{ showSavedProfiles(); }).catch((err)=>{
    btn.disabled=false; btn.textContent='🔔 فعال‌کردن یادآوری تولد';
    msg.style.color='#ff8a8a'; msg.textContent=err.message||'خطایی پیش اومد.';
  });
}
function showSavedProfile(i){const p=state.savedProfiles[i]; showCosmicResult(p.firstName,p.familyName,p.report);}
showHome();
(function hideSplash(){
  const splash=document.getElementById('splash-screen');
  if(!splash) return;
  splash.classList.add('hide');
  setTimeout(()=>splash.remove(), 500);
})();
