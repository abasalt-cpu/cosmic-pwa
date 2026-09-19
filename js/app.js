const PERSIAN_MONTHS=["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
const ICON_CALC=`<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-11px; margin-inline-end:6px"><circle cx="12" cy="12" r="8.2"/><path d="M8.7 12c0-1.5 1.15-2.5 2.35-1.75 1.05.65 1.05 2.85 0 3.5-1.2.75-2.35-.25-2.35-1.75Z"/><path d="M15.3 12c0-1.5-1.15-2.5-2.35-1.75-1.05.65-1.05 2.85 0 3.5 1.2.75 2.35-.25 2.35-1.75Z"/></svg>`;
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
      <button class="btn wc-mini-btn" onclick="showCosmicInputForm()">${ICON_CALC}کد کیهانی</button>
      <img src="icons/hand-glow.png" class="wc-mini-hand" onclick="rerollSlogan()" alt="" role="button" aria-label="یه شعار دیگه">
    </div>
    <div class="card welcome-card" id="welcome-card">
      <div class="wc-full">
        <div class="w-text"><h2>خوش اومدی 👋</h2>
        <p class="desc">${last?lastLine:'هنوز محاسبه‌ای انجام ندادی. از دکمه‌ی زیر شروع کن.'}</p>
        <button class="btn" onclick="showCosmicInputForm()">${ICON_CALC}محاسبه‌ی کد کیهانی</button></div>
        <div class="welcome-icon" onclick="rerollSlogan()" role="button" aria-label="یه شعار دیگه" style="cursor:pointer"><img src="icons/hand-glow.png" alt=""></div>
      </div>
    </div>
    <div class="grid-menu">
      <div class="menu-tile" onclick="showHafez()"><img src="icons/menu/icon_hafez.png" class="icon-img"><span class="label">فال حافظ</span><span class="desc">پیام امروز حافظ برات</span></div>
      <div class="menu-tile" onclick="showMunajat()"><img src="icons/menu/icon_munajat.png" class="icon-img"><span class="label">مناجات</span><span class="desc">متون معنوی و مناجات</span></div>
      <div class="menu-tile" onclick="showZamanbandi()"><img src="icons/menu/icon_zamanbandi.png" class="icon-img"><span class="label">زمان‌بندی خدا</span><span class="desc">زمان‌بندی الهی زندگیت</span></div>
      <div class="menu-tile" onclick="showElham()"><img src="icons/menu/icon_elham.png" class="icon-img"><span class="label">الهام روز</span><span class="desc">پیام و الهام روزانه</span></div>
      <div class="menu-tile" onclick="showZodiacEntry()"><img src="icons/menu/icon_zodiac.png" class="icon-img"><span class="label">طالع‌بینی</span><span class="desc">طالع روزانه و شخصی</span></div>
      <div class="menu-tile" onclick="showNatalEntry()"><img src="icons/menu/icon_natal.png" class="icon-img"><span class="label">زایچه‌ی تقریبی</span><span class="desc">تقویم شخصی شما</span></div>
      <div class="menu-tile" onclick="showCompareEntry()"><img src="icons/menu/icon_compare.png" class="icon-img"><span class="label">مقایسه‌ی دو نفر</span><span class="desc">سازگاری عددی دو نفر</span></div>
      <div class="menu-tile" onclick="showBabyNameForm()"><img src="icons/menu/icon_baby.png" class="icon-img"><span class="label">اسم فرزند</span><span class="desc">انتخاب اسم با معنا</span></div>
      <div class="menu-tile" onclick="showSavedProfiles()"><img src="icons/menu/icon_profiles.png" class="icon-img"><span class="label">پروفایل‌های من</span><span class="desc">لیست محاسبات ذخیره‌شده</span></div>
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
  render(`<div class="card">
      <div class="list-item" onclick="showAboutPage()"><span class="li-label">${ICON_INFO}درباره‌ی نرم‌افزار</span><span class="li-arrow">‹</span></div>
      <div class="list-item" onclick="showMembershipPage()"><span class="li-label">${ICON_ACCOUNT}حساب کاربری</span><span class="li-arrow">‹</span></div>
      <div class="list-item" onclick="showPrivacyPage()"><span class="li-label">${ICON_PRIVACY}حریم خصوصی</span><span class="li-arrow">‹</span></div>
      <div class="list-item" onclick="showTermsPage()"><span class="li-label">${ICON_TERMS}قوانین و شرایط استفاده</span><span class="li-arrow">‹</span></div>
    </div>
    <div class="small-note">اطلاعات پروفایل‌هات (اسم، تاریخ تولد و نتایج) فقط روی خود گوشیت ذخیره می‌شه. عضویت اختیاریه و فقط برای ورود به حساب استفاده می‌شه.</div>`);
}
function showAboutPage(){
  render(`${backBtn('showMoreMenu()')}
    <div class="card"><h2 style="display:flex; align-items:center; gap:8px">${ICON_INFO}درباره‌ی نرم‌افزار</h2>
      <p class="desc">«کد کیهانی» با ترکیب عددشناسی، طالع‌بینی و متون الهام‌بخش فارسی، یه نگاه تازه و شخصی‌سازی‌شده به شخصیت، مسیر زندگی و روزهای تو ارائه می‌ده — طراحی‌شده برای کاوش، نه برای پیش‌گویی قطعی.</p></div>
    <div class="card"><h3 style="margin-bottom:10px">امکانات نرم‌افزار</h3>
      <div style="line-height:2.1">
        🔢 محاسبه‌ی کد کیهانی از روی نام و تاریخ تولد<br>
        🔮 فال حافظ روزانه (با امکان سه‌بار فال در روز)<br>
        ⏳ زمان‌بندی خدا — جمله‌ای الهام‌بخش با ریتم روزانه<br>
        ♈ طالع‌بینی شخصی و روزانه<br>
        🕊️ مناجات و متون معنوی<br>
        🌅 الهام روز<br>
        🌌 زایچه‌ی تقریبی<br>
        ⚖️ مقایسه‌ی عددی و ستاره‌ای دو نفر<br>
        👶 پیشنهاد اسم برای فرزند<br>
        📇 ذخیره‌ی پروفایل‌های چند نفر روی گوشی<br>
        👤 عضویت اختیاری (ایمیل یا گوگل) برای ورود به حساب
      </div></div>
    <div class="card"><p class="desc" style="margin:0">نسخه‌ی فعلی: 1.0.0 — این نرم‌افزار به‌صورت مداوم در حال به‌روزرسانی و اضافه‌شدن امکانات جدیده.</p></div>`);
}
function showMembershipPage(){
  if(currentUser){
    const label = currentUser.displayName || currentUser.email || currentUser.phone || 'کاربر';
    const sub = currentUser.email || currentUser.phone || '';
    render(`${backBtn('showMoreMenu()')}
      <div class="card"><h2>👤 حساب کاربری</h2>
        <p class="desc">با حساب <b style="color:#4fd17a">${esc(label)}</b> وارد شدی.${sub && sub!==label?' (<span style="color:#4fd17a">'+esc(sub)+'</span>)':''}</p></div>
      <div class="card"><button class="btn secondary" onclick="handleSignOut()">🚪 خروج از حساب</button></div>`);
    return;
  }
  render(`${backBtn('showMoreMenu()')}
    <div class="card"><h2>👤 عضویت / ورود</h2>
      <p class="desc">با ساختن حساب، هویتت روی این اپ ثبت می‌شه. اطلاعات پروفایل‌هات همچنان روی خود گوشیت ذخیره می‌مونه.</p>
      <div id="google-btn-container" style="margin-top:12px; display:flex; justify-content:center"></div>
      <p class="small-note" style="text-align:center">ورود با گوگل ممکنه بدون VPN کار نکنه.</p>
    </div>
    <div class="card">
      <h3 style="margin-bottom:10px">✉️ ورود یا ثبت‌نام با ایمیل</h3>
      <label>ایمیل</label><input id="auth-email" type="email" placeholder="you@example.com">
      <label>رمز عبور</label><input id="auth-password" type="password" placeholder="حداقل ۶ کاراکتر">
      <p id="auth-error" class="small-note" style="color:#ff8a8a; min-height:18px"></p>
      <button class="btn" onclick="handleEmailSignIn()">ورود</button>
      <button class="btn secondary" onclick="handleEmailSignUp()">ساخت حساب جدید</button>
    </div>`);
  initGoogleButton();
}
let googleTokenClient=null;
function initGoogleButton(){
  const el=document.getElementById('google-btn-container');
  if(!el) return;
  if(typeof google==='undefined' || !google.accounts || !google.accounts.oauth2 || GOOGLE_CLIENT_ID==='YOUR_GOOGLE_CLIENT_ID'){
    el.innerHTML='<p class="small-note">ورود با گوگل هنوز تنظیم نشده.</p>';
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
    if(el){ el.style.color='#ff8a8a'; el.textContent='تنظیمات سرور عضویت هنوز کامل نشده.'; }
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
  signOutUser().then(()=>{ showMembershipPage(); });
}
function onAuthChanged(user){
  // در آینده می‌تونیم اینجا وضعیت ورود رو توی بخش‌های دیگه‌ی اپ هم نشون بدیم.
}
function showPrivacyPage(){
  render(`${backBtn('showMoreMenu()')}
    <div class="card"><h2 style="display:flex; align-items:center; gap:8px">${ICON_PRIVACY}حریم خصوصی</h2>
      <p class="desc">حریم خصوصی تو برای ما مهمه. تمام امکانات اصلی اپ (محاسبه‌ی کد کیهانی، فال، طالع‌بینی و...) بدون نیاز به ثبت‌نام و کاملاً محلی روی گوشیت کار می‌کنن؛ عضویت فقط یه قابلیت اختیاریه.</p></div>
    <div class="card"><h3 style="margin-bottom:10px">چه اطلاعاتی ذخیره می‌شه؟</h3>
      <div style="line-height:2.1">
        📱 نام، تاریخ تولد و نتایج محاسبات فقط روی خود گوشی تو (حافظه‌ی محلی مرورگر) ذخیره می‌شن و به هیچ سروری ارسال نمی‌شن.<br>
        👤 اگه با ایمیل یا شماره موبایل عضو بشی، فقط همون اطلاعات هویتی (ایمیل/رمز به‌صورت رمزنگاری‌شده، یا شماره موبایل) روی سرور اختصاصی خودمون ذخیره می‌شه — نه اطلاعات پروفایل‌ها یا نتایج محاسباتت.<br>
        🔵 اگه با گوگل وارد بشی، فقط ایمیل و نامی که گوگل در اختیارمون می‌ذاره برای شناسایی حسابت ذخیره می‌شه.<br>
        📲 برای ورود با موبایل (در آینده)، شماره‌ت فقط برای ارسال یک‌بار کد تایید استفاده می‌شه و جای دیگه‌ای ذخیره نمی‌مونه.<br>
        📊 برای بهتر شدن اپ، از آمار بازدید ناشناس و بدون کوکی (Cloudflare Analytics) استفاده می‌کنیم که هیچ اطلاعات شخصی یا قابل‌شناسایی جمع نمی‌کنه.<br>
        🚫 بدون عضویت هم می‌تونی از همه‌ی امکانات اصلی اپ استفاده کنی.<br>
        🍪 از کوکی یا ابزار ردیابی برای تبلیغات استفاده نمی‌کنیم.<br>
        🗑️ هر وقت بخوای می‌تونی از تنظیمات مرورگر، تمام اطلاعات ذخیره‌شده رو پاک کنی، یا از حسابت خارج بشی.
      </div></div>
    <div class="card"><p class="desc" style="margin:0">اگه سؤال یا نگرانی‌ای درباره‌ی حریم خصوصی داری، از بخش «درباره‌ی نرم‌افزار» می‌تونی با ما در ارتباط باشی.</p></div>`);
}
function showTermsPage(){
  render(`${backBtn('showMoreMenu()')}
    <div class="card"><h2 style="display:flex; align-items:center; gap:8px">${ICON_TERMS}قوانین و شرایط استفاده</h2>
      <p class="desc">با استفاده از «کد کیهانی» فرض می‌شه شرایط زیر رو مطالعه کرده و پذیرفتی:</p></div>
    <div class="card">
      <div style="line-height:2.1">
        🎭 محتوای این اپ (عددشناسی، طالع‌بینی، فال حافظ و مناجات) صرفاً جنبه‌ی سرگرمی، فرهنگی و خودشناسی داره و جایگزین مشاوره‌ی علمی، پزشکی، روان‌شناسی یا مالی نیست.<br>
        🧭 تصمیم‌های مهم زندگیت رو صرفاً بر پایه‌ی نتایج این اپ نگیر.<br>
        ✍️ مسئولیت صحت اطلاعاتی که وارد می‌کنی (نام، تاریخ تولد و...) با خودته.<br>
        🔐 اگه حساب کاربری می‌سازی، حفظ رمز عبور و امنیت حسابت با خودته؛ هر حساب مخصوص یک نفره.<br>
        🔄 محتوا و امکانات اپ ممکنه بدون اطلاع قبلی تغییر یا به‌روزرسانی بشه.<br>
        ⚠️ این نرم‌افزار «همان‌طور که هست» ارائه می‌شه و هیچ تضمینی برای دقت صددرصدی نتایج وجود نداره.
      </div></div>`);
}
function backBtn(fn,label){return `<button class="back-btn" onclick="${fn}">→ ${label||'بازگشت'}</button>`;}
function showCosmicInputForm(){
  setNav('cosmic');
  render(`${backBtn('showHome()')}<div class="card"><h2>🔢 محاسبه‌ی کد کیهانی</h2>
      <label>نام</label><input id="cf-first" type="text" placeholder="مثلاً علی">
      <label>نام خانوادگی</label><input id="cf-family" type="text" placeholder="مثلاً محمدی">
      <label>نام مادر <span style="opacity:.6">(اختیاری، برای پایگاه اجتماعی)</span></label><input id="cf-mother" type="text">
      <label>تاریخ تولد شمسی</label>
      <div style="display:flex; gap:8px;">
        <input id="cf-day" type="number" placeholder="روز" min="1" max="31" style="flex:1">
        <select id="cf-month" style="flex:1.4">${PERSIAN_MONTHS.map((m,i)=>`<option value="${i+1}">${m}</option>`).join('')}</select>
        <input id="cf-year" type="number" placeholder="سال" min="1300" max="1420" style="flex:1">
      </div>
      <button class="btn" onclick="submitCosmicForm()">محاسبه کن</button></div>`);
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
function showCosmicResult(firstName,familyName,r){
  render(`${backBtn('showCosmicInputForm()')}
    <div class="card"><h2>👤 ${esc(firstName)} ${esc(familyName)}</h2>
      <div class="code">${esc(r.cosmicCode)}</div>
      <div class="result-block">📅 <b>تاریخ میلادی:</b> ${r.gregorianDate}<br>☀️ <b>عدد خورشیدی:</b> <span class="num">${r.solarNum}</span></div>
      <div class="result-block"><b class="num">ارتعاش تاریخ تولد: ${r.vibrationNum}</b><br>${nl2br(r.vibrationText)}</div>
      <div class="result-block"><b class="num">عدد تقدیر: ${r.fateNum}</b><br>${nl2br(r.fateText)}</div>
      <div class="result-block"><b class="num">عدد سرنوشت: ${r.destinyNum}</b><br>${nl2br(r.destinyText)}</div>
      <div class="result-block">💰 <b>وضعیت درآمد:</b> ${nl2br(r.incomeText)}<br>🏛 <b>پایگاه اجتماعی:</b> ${r.statusText?r.statusText:'محاسبه نشد (نام مادر وارد نشده)'}<br>🔮 <b>عدد باطن فرد:</b> ${r.batenNum}</div>
      <div class="btn-row">
        <button class="btn secondary" onclick="showCosmicInputForm()">محاسبه‌ی جدید</button>
        <button class="btn secondary" onclick='shareText(${JSON.stringify(`گزارش کد کیهانی ${firstName} ${familyName}\nکد کیهانی: ${r.cosmicCode}\nعدد سرنوشت: ${r.destinyNum} | عدد تقدیر: ${r.fateNum}`)})'>اشتراک‌گذاری</button>
      </div></div>`);
}
function shareText(text){ if(navigator.share){navigator.share({text});} else {navigator.clipboard.writeText(text); alert('متن کپی شد.');} }
function getHafezDrawState(){
  const key='hafezDrawState'; const today=todayStr();
  let st=JSON.parse(localStorage.getItem(key)||'null');
  if(!st||st.date!==today){ st={date:today,count:0}; localStorage.setItem(key,JSON.stringify(st)); }
  return st;
}
function showHafez(){
  const st=getHafezDrawState(); const remaining=Math.max(0,3-st.count);
  render(`${backBtn('showHome()')}<div class="card"><h2>🔮 فال حافظ</h2>
      <p class="desc">چند لحظه چشم‌هاتو ببند، یه آرزو یا سوال توی دلت نگه‌دار، و بعد نیت کن...</p>
      <button class="btn" id="hafez-btn" onclick="revealHafez()"${remaining<=0?' disabled style="opacity:.5;cursor:not-allowed"':''}>🔮 فالم رو بگیر${remaining>0?` (${remaining} بار دیگه امروز)`:''}</button>
      <div id="hafez-result">${remaining<=0?'<p class="small-note">امروز ۳ بار فال گرفتی؛ فردا دوباره سر بزن 🌙</p>':''}</div></div>`);
}
function getDeviceId(){let id=localStorage.getItem('deviceId'); if(!id){id='dev-'+Math.random().toString(36).slice(2); localStorage.setItem('deviceId',id);} return id;}
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
  document.getElementById('hafez-result').innerHTML=`<div class="result-block"><div class="verse">${g.verses.join('<br>')}</div>
    <p style="margin-top:10px">📖 <b>تفسیر:</b><br>${esc(g.interpretation)}</p>
    <button class="btn small secondary" onclick="showFullGhazal('${g.id}')">📜 نمایش کل غزل</button></div>
    <p class="small-note">${remaining>0?`${remaining} فال دیگه برات مونده امروز`:'فال‌های امروزت تموم شد؛ فردا دوباره بیا 🌙'}</p>`;
  const btn=document.getElementById('hafez-btn');
  if(btn){
    if(remaining<=0){ btn.disabled=true; btn.style.opacity='.5'; btn.style.cursor='not-allowed'; btn.textContent='🔮 فالم رو بگیر'; }
    else{ btn.textContent=`🔮 فالم رو بگیر (${remaining} بار دیگه امروز)`; }
  }
}
function showFullGhazal(id){
  const g=getGhazalById(id);
  render(`${backBtn('showHafez()')}<div class="card"><h2>📜 غزل شماره‌ی ${id.replace('hafez-extra-','')} حافظ</h2>
      <div class="verse" style="line-height:2.2">${(g.full_verses||g.verses).join('<br>')}</div></div>`);
}
function showMunajat(){
  const item=getRandomMunajat();
  render(`${backBtn('showHome()')}<div class="card"><h2>🕊 مناجات</h2>
      <div class="verse" style="line-height:2.1">${esc(item.text)}</div>
      <p style="text-align:left;color:var(--text-dim);margin-top:10px">— خواجه عبدالله انصاری</p>
      <button class="btn secondary" onclick="showMunajat()">🔄 مناجات دیگر</button></div>`);
}
function showElham(){
  const item=getTodayElham();
  render(`${backBtn('showHome()')}<div class="card"><h2>🌅 الهام روز</h2>
      <div class="verse" style="line-height:2.1">${item.verses.join('<br>')}</div>
      ${item.poet?`<p style="text-align:left;color:var(--text-dim)">— ${esc(item.poet)}</p>`:''}
      <p style="margin-top:10px">📖 <b>تفسیر:</b><br>${esc(item.interpretation)}</p>
      <div class="small-note">یک الهام ثابت در روز، بدون تکرار تا کل مجموعه تموم بشه.</div></div>`);
}
function showZamanbandi(){
  const item=getRandomZamanbandi();
  render(`${backBtn('showHome()')}<div class="card"><h2>⏳ به زمان‌بندی خدا اعتماد کن</h2>
      <p style="color:var(--gold-soft)">${item.time}</p>
      <div class="verse" style="line-height:2.1;margin-top:8px">${esc(item.quote)}</div>
      <p class="small-note">📖 این جمله از کتاب «به زمان‌بندی خدا اعتماد کن» (آکیرا، ترجمه‌ی نهال سهیلی‌فر) است.<br>
      <a href="${ZAMANBANDI_LINK}" target="_blank" style="color:var(--gold-soft)">برای خوندن کامل کتاب اینجا بزن</a></p>
      <button class="btn secondary" onclick="showZamanbandi()">🔄 یکی دیگه</button></div>`);
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
    render(`${backBtn('showHome()')}<div class="card"><h2>🌌 زایچه‌ی تقریبی</h2>
      <p class="desc">برای زایچه، اول یه‌بار «کد کیهانی» رو محاسبه کن (چون از همون تاریخ تولد استفاده می‌کنیم).</p>
      <button class="btn" onclick="showCosmicInputForm()">${ICON_CALC}محاسبه‌ی کد کیهانی</button></div>`); return;
  }
  const p=state.lastProfile;
  render(`${backBtn('showHome()')}<div class="card"><h2>🌌 زایچه‌ی تقریبی</h2>
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
  render(`${backBtn('showNatalEntry()')}<div class="card"><div class="verse" style="white-space:pre-line; line-height:2.1">${esc(formatNatal(result))}</div></div>`);
}
function showBabyNameForm(){
  render(`${backBtn('showHome()')}<div class="card"><h2>👶 پیشنهاد اسم فرزند</h2>
      <label>جنسیت فرزند</label>
      <div class="chip-row"><div class="chip" id="bn-boy" onclick="pickGender('boy')">👦 پسر</div><div class="chip" id="bn-girl" onclick="pickGender('girl')">👧 دختر</div></div>
      <label>نام خانوادگی پدر</label><input id="bn-family" type="text">
      <label>نام مادر فرزند</label><input id="bn-mother" type="text">
      <button class="btn" onclick="submitBabyName()">پیشنهاد بده</button>
      <p class="small-note">پایگاه اجتماعی «صعودی» و درآمد «متوسط رو به بالا» به‌عنوان بهترین ترکیب پیش‌فرض در نظر گرفته می‌شه.</p></div>`);
  window.selectedGender='boy'; document.getElementById('bn-boy').classList.add('active');
}
function pickGender(g){window.selectedGender=g; document.getElementById('bn-boy').classList.toggle('active',g==='boy'); document.getElementById('bn-girl').classList.toggle('active',g==='girl');}
let babyQuery=null;
function submitBabyName(){
  const family=document.getElementById('bn-family').value.trim();
  const mother=document.getElementById('bn-mother').value.trim();
  if(!family||!mother){alert('نام خانوادگی و نام مادر رو وارد کن.'); return;}
  babyQuery={gender:window.selectedGender, family, mother, status:"2", income:"2"};
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
      return `<label>نام و فامیل نفر ${n}</label><input id="cp-n${n}" type="text" placeholder="مثلاً علی محمدی">
        <label>تاریخ تولد نفر ${n} (شمسی، مثلاً 1370/5/15)</label><input id="cp-d${n}" type="text" placeholder="سال/ماه/روز">`;
    }
    return `<label>نفر ${n}</label>
      <select id="cp-sel${n}" onchange="toggleCompareManual(${n})">
        ${profileOptions}
        <option value="manual">شخص دیگر (وارد کردن دستی)</option>
      </select>
      <div id="cp-manual${n}" style="display:none">
        <label>نام و فامیل نفر ${n}</label><input id="cp-n${n}" type="text" placeholder="مثلاً علی محمدی">
        <label>تاریخ تولد نفر ${n} (شمسی)</label><input id="cp-d${n}" type="text" placeholder="سال/ماه/روز">
      </div>`;
  }
  render(`${backBtn('showHome()')}<div class="card"><h2>🔗 مقایسه‌ی دو نفر</h2>
      <p class="desc">${hasProfiles?'می‌تونی از پروفایل‌های ذخیره‌شده انتخاب کنی یا مشخصات یه نفر جدید رو وارد کنی:':'اطلاعات هر دو نفر رو وارد کن:'}</p>
      ${personBlock(1)}
      ${personBlock(2)}
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
