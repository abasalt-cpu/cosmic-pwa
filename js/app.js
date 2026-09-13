const PERSIAN_MONTHS=["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
const state={lastProfile:JSON.parse(localStorage.getItem('lastProfile')||'null'), savedProfiles:JSON.parse(localStorage.getItem('savedProfiles')||'[]')};
function saveProfile(p){
  state.lastProfile=p; localStorage.setItem('lastProfile',JSON.stringify(p));
  state.savedProfiles=state.savedProfiles.filter(x=>!(x.firstName===p.firstName&&x.familyName===p.familyName));
  state.savedProfiles.unshift(p); state.savedProfiles=state.savedProfiles.slice(0,15);
  localStorage.setItem('savedProfiles',JSON.stringify(state.savedProfiles));
}
const app=document.getElementById('app');
function render(html){app.innerHTML=html; window.scrollTo(0,0);}
function esc(s){return (s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function nl2br(s){return esc(s).replace(/\n/g,'<br>');}

// ---------- سیستم تاریخچه‌ی ناوبری (برای دکمه‌ی برگشت اندروید) ----------
window.__navFns = {};
function registerNav(name, fn){ window.__navFns[name] = fn; }
function go(name, ...args){
  history.pushState({navName:name, navArgs:args}, '');
  window.__navFns[name](...args);
}
function pushNav(name, ...args){ go(name, ...args); }
window.addEventListener('popstate', (e)=>{
  if(e.state && e.state.navName && window.__navFns[e.state.navName]){
    window.__navFns[e.state.navName](...(e.state.navArgs||[]));
  } else {
    window.__navFns['showHome']();
  }
});
history.replaceState({navName:'showHome', navArgs:[]}, '');

document.querySelectorAll('nav.bottom .nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('nav.bottom .nav-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const target=btn.dataset.nav;
    if(target==='home')go('showHome'); else if(target==='cosmic')go('showCosmicForm');
    else if(target==='profiles')go('showSavedProfiles'); else if(target==='more')go('showMoreMenu');
  });
});
function setNav(key){document.querySelectorAll('nav.bottom .nav-btn').forEach(b=>b.classList.toggle('active', b.dataset.nav===key));}
const TILE_DESC = {
  hafez: 'فال روزانه‌ی دیوان حافظ', zodiac: 'طالع روزانه و شخصی', munajat: 'متون معنوی و مناجات',
  elham: 'پیام و الهام روزانه', natal: 'زایچه‌ی تقریبی شما', baby: 'انتخاب اسم با معنا',
  compare: 'هم‌خونی دو نفر', zamanbandi: 'اعتماد به زمان‌بندی خدا',
};
function showHome(){
  setNav('home'); const last=state.lastProfile;
  render(`
    <div class="card hero-card">
      <div class="hero-row">
        <div class="hero-icon">🖐️</div>
        <div class="hero-text">
          <h2>خوش اومدی 👋</h2>
          <p class="desc">${last?`آخرین محاسبه: <b>${esc(last.firstName)} ${esc(last.familyName)}</b>`:'هنوز محاسبه‌ای انجام ندادی.'}</p>
          <button class="btn" onclick="go('showCosmicForm')">${badgeIcon()} محاسبه‌ی کد کیهانی</button>
        </div>
      </div>
    </div>
    <div class="grid-menu two-col">
      <div class="menu-tile gold" onclick="go('showHafez')"><img src="${ICONS.hafez}" class="icon-img"><span class="label">فال حافظ</span><span class="tile-desc">${TILE_DESC.hafez}</span></div>
      <div class="menu-tile" onclick="go('showMunajat')"><img src="${ICONS.munajat}" class="icon-img"><span class="label">مناجات</span><span class="tile-desc">${TILE_DESC.munajat}</span></div>
      <div class="menu-tile" onclick="go('showElham')"><img src="${ICONS.elham}" class="icon-img"><span class="label">الهام روز</span><span class="tile-desc">${TILE_DESC.elham}</span></div>
      <div class="menu-tile gold" onclick="go('showZodiacEntry')"><img src="${ICONS.zodiac}" class="icon-img"><span class="label">طالع‌بینی</span><span class="tile-desc">${TILE_DESC.zodiac}</span></div>
      <div class="menu-tile" onclick="go('showNatalEntry')"><img src="${ICONS.natal}" class="icon-img"><span class="label">زایچه‌ی تقریبی</span><span class="tile-desc">${TILE_DESC.natal}</span></div>
      <div class="menu-tile" onclick="go('showBabyNameForm')"><img src="${ICONS.baby}" class="icon-img"><span class="label">اسم فرزند</span><span class="tile-desc">${TILE_DESC.baby}</span></div>
      <div class="menu-tile" onclick="go('showCompareEntry')"><img src="${ICONS.compare}" class="icon-img"><span class="label">مقایسه‌ی دو نفر</span><span class="tile-desc">${TILE_DESC.compare}</span></div>
      <div class="menu-tile" onclick="go('showZamanbandi')"><img src="${ICONS.zamanbandi}" class="icon-img"><span class="label">زمان‌بندی خدا</span><span class="tile-desc">${TILE_DESC.zamanbandi}</span></div>
    </div>
    <div class="card tagline-card">
      <span class="tl-ic">⭐</span>
      <div class="tl-text">هر عددی، داستانی از تو را روایت می‌کند...<br>کشف کن، بشناس و آگاهانه انتخاب کن.</div>
      <span class="tl-ic">∞</span>
    </div>
  `);
}
function badgeIcon(){ return '<span class="cta-badge">∞</span>'; }
function showDailyMenu(){
  setNav('daily');
  render(`<div class="grid-menu">
      <div class="menu-tile gold" onclick="go('showHafez')"><img src="${ICONS.hafez}" class="icon-img"><span class="label">فال حافظ</span></div>
      <div class="menu-tile gold" onclick="go('showZodiacEntry')"><img src="${ICONS.zodiac}" class="icon-img"><span class="label">طالع‌بینی امروز</span></div>
      <div class="menu-tile" onclick="go('showElham')"><img src="${ICONS.elham}" class="icon-img"><span class="label">الهام روز</span></div>
      <div class="menu-tile" onclick="go('showMunajat')"><img src="${ICONS.munajat}" class="icon-img"><span class="label">مناجات</span></div>
      <div class="menu-tile" onclick="go('showZamanbandi')"><img src="${ICONS.zamanbandi}" class="icon-img"><span class="label">زمان‌بندی خدا</span></div>
    </div>`);
}
function showMoreMenu(){
  setNav('more');
  render(`
    <div class="grid-menu">
      <div class="menu-tile" onclick="go('showNatalEntry')"><img src="${ICONS.natal}" class="icon-img"><span class="label">زایچه‌ی تقریبی</span></div>
      <div class="menu-tile" onclick="go('showBabyNameForm')"><img src="${ICONS.baby}" class="icon-img"><span class="label">اسم فرزند</span></div>
      <div class="menu-tile" onclick="go('showCompareEntry')"><img src="${ICONS.compare}" class="icon-img"><span class="label">مقایسه‌ی دو نفر</span></div>
      <div class="menu-tile" onclick="go('showSavedProfiles')"><img src="${ICONS.profiles}" class="icon-img"><span class="label">پروفایل‌های من</span></div>
    </div>
    <div class="card">
      <div class="name-item" style="cursor:pointer">ℹ️ درباره‌ی نرم‌افزار <span class="badge">به‌زودی</span></div>
      <div class="name-item" style="cursor:pointer">⭐ عضویت و اشتراک <span class="badge">به‌زودی</span></div>
      <div class="name-item" style="cursor:pointer">🔒 حریم خصوصی <span class="badge">به‌زودی</span></div>
      <div class="name-item" style="cursor:pointer; border-bottom:none">📜 قوانین و مقررات <span class="badge">به‌زودی</span></div>
    </div>
    <div class="small-note">این یه اپ کاملاً محلیه — هیچ اطلاعاتی به سروری فرستاده نمی‌شه، همه چیز روی خود گوشیت ذخیره می‌مونه.</div>`);
}
function backBtn(fn,label){return `<button class="back-btn" onclick="history.back()">→ ${label||'بازگشت'}</button>`;}
function showCosmicForm(){
  setNav('cosmic');
  render(`<div class="card"><h2>🔢 محاسبه‌ی عدد کیهانی</h2>
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
  render(`${backBtn('showCosmicForm()')}
    <div class="card"><h2>👤 ${esc(firstName)} ${esc(familyName)}</h2>
      <div class="code">${esc(r.cosmicCode)}</div>
      <div class="result-block">📅 <b>تاریخ میلادی:</b> ${r.gregorianDate}<br>☀️ <b>عدد خورشیدی:</b> <span class="num">${r.solarNum}</span></div>
      <div class="result-block"><b class="num">ارتعاش تاریخ تولد: ${r.vibrationNum}</b><br>${nl2br(r.vibrationText)}</div>
      <div class="result-block"><b class="num">عدد تقدیر: ${r.fateNum}</b><br>${nl2br(r.fateText)}</div>
      <div class="result-block"><b class="num">عدد سرنوشت: ${r.destinyNum}</b><br>${nl2br(r.destinyText)}</div>
      <div class="result-block">💰 <b>وضعیت درآمد:</b> ${nl2br(r.incomeText)}<br>🏛 <b>پایگاه اجتماعی:</b> ${r.statusText?r.statusText:'محاسبه نشد (نام مادر وارد نشده)'}<br>🔮 <b>عدد باطن فرد:</b> ${r.batenNum}</div>
      <div class="btn-row">
        <button class="btn secondary" onclick="go('showCosmicForm')">محاسبه‌ی جدید</button>
        <button class="btn secondary" onclick='shareText(${JSON.stringify(`گزارش عدد کیهانی ${firstName} ${familyName}\nکد کیهانی: ${r.cosmicCode}\nعدد سرنوشت: ${r.destinyNum} | عدد تقدیر: ${r.fateNum}`)})'>اشتراک‌گذاری</button>
      </div></div>`);
}
function shareText(text){ if(navigator.share){navigator.share({text});} else {navigator.clipboard.writeText(text); alert('متن کپی شد.');} }
function showHafez(){
  render(`${backBtn('showHome()')}<div class="card"><h2>🔮 فال حافظ</h2>
      <p class="desc">چند لحظه چشم‌هاتو ببند، یه آرزو یا سوال توی دلت نگه‌دار، و بعد نیت کن...</p>
      <button class="btn" onclick="revealHafez()">🔮 فالم رو بگیر</button>
      <div id="hafez-result"></div></div>`);
}
function getDeviceId(){let id=localStorage.getItem('deviceId'); if(!id){id='dev-'+Math.random().toString(36).slice(2); localStorage.setItem('deviceId',id);} return id;}
function revealHafez(){
  const g=getDailyFal(getDeviceId());
  document.getElementById('hafez-result').innerHTML=`<div class="result-block"><div class="verse">${g.verses.join('<br>')}</div>
    <p style="margin-top:10px">📖 <b>تفسیر:</b><br>${esc(g.interpretation)}</p>
    <button class="btn small secondary" onclick="go('showFullGhazal', '${g.id}')">📜 نمایش کل غزل</button></div>`;
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
      <button class="btn secondary" onclick="go('showMunajat')">🔄 مناجات دیگر</button></div>`);
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
  const item=getSampleZamanbandi();
  render(`${backBtn('showHome()')}<div class="card"><h2>⏳ به زمان‌بندی خدا اعتماد کن</h2>
      <p style="color:var(--gold-soft)">${item.time}</p>
      <div class="verse" style="line-height:2.1;margin-top:8px">${esc(item.quote)}</div>
      <p class="small-note">📖 این جمله از کتاب «به زمان‌بندی خدا اعتماد کن» (آکیرا، ترجمه‌ی نهال سهیلی‌فر) است.<br>
      <a href="${ZAMANBANDI_LINK}" target="_blank" style="color:var(--gold-soft)">برای خوندن کامل کتاب اینجا بزن</a></p>
      <button class="btn secondary" onclick="go('showZamanbandi')">🔄 یکی دیگه</button></div>`);
}
function showZodiacEntry(){
  if(state.savedProfiles.length>1){
    render(`${backBtn('showHome()')}<div class="card"><h2>♈️ طالع‌بینی — کدوم پروفایل؟</h2>
        ${state.savedProfiles.map(p=>`<div class="name-item" style="cursor:pointer" onclick="go('showZodiac', ${p.jm})"><b>${esc(p.firstName)} ${esc(p.familyName)}</b> — ${new Date(p.date).toLocaleDateString('fa-IR')}</div>`).join('')}
      </div>`);
  } else if(state.lastProfile){ showZodiac(state.lastProfile.jm); }
  else { showMonthPickerForZodiac(); }
}
function showMonthPickerForZodiac(){
  render(`${backBtn('showHome()')}<div class="card"><h2>ماه تولدت رو انتخاب کن:</h2>
      <div class="chip-row">${PERSIAN_MONTHS.map((m,i)=>`<div class="chip" onclick="go('showZodiac', ${i+1})">${m}</div>`).join('')}</div></div>`);
}
function showZodiac(jm){
  const text=formatHoroscope(jm);
  render(`${backBtn('showHome()')}<div class="card"><div class="verse" style="white-space:pre-line; line-height:2.1">${esc(text)}</div></div>`);
}
function showNatalEntry(){
  if(!state.lastProfile){
    render(`${backBtn('showHome()')}<div class="card"><h2>🌌 زایچه‌ی تقریبی</h2>
      <p class="desc">برای زایچه، اول یه‌بار «عدد کیهانی» رو محاسبه کن (چون از همون تاریخ تولد استفاده می‌کنیم).</p>
      <button class="btn" onclick="go('showCosmicForm')">محاسبه‌ی عدد کیهانی</button></div>`); return;
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
  const hasProfiles = state.savedProfiles.length > 0;
  const options = state.savedProfiles.map((p,i)=>`<option value="${i}">${esc(p.firstName)} ${esc(p.familyName)}</option>`).join('');
  render(`${backBtn('showHome()')}<div class="card"><h2>🔗 مقایسه‌ی دو نفر</h2>
      <p class="desc">${hasProfiles?'می‌تونی از پروفایل‌های ذخیره‌شده انتخاب کنی، یا دستی وارد کنی:':'اطلاعات هر دو نفر رو وارد کن:'}</p>

      <label>نفر اول</label>
      ${hasProfiles?`<select id="cp-sel1" onchange="toggleCompareManual(1)"><option value="manual">✏️ وارد کردن دستی</option>${options}</select>`:''}
      <div id="cp-manual1" style="${hasProfiles?'display:none; margin-top:10px':''}">
        <input id="cp-n1" type="text" placeholder="نام و فامیل، مثلاً علی محمدی">
        <input id="cp-d1" type="text" placeholder="تاریخ تولد شمسی: سال/ماه/روز" style="margin-top:8px">
      </div>

      <label style="margin-top:18px">نفر دوم</label>
      ${hasProfiles?`<select id="cp-sel2" onchange="toggleCompareManual(2)"><option value="manual">✏️ وارد کردن دستی</option>${options}</select>`:''}
      <div id="cp-manual2" style="${hasProfiles?'display:none; margin-top:10px':''}">
        <input id="cp-n2" type="text" placeholder="نام و فامیل، مثلاً رضا احمدی">
        <input id="cp-d2" type="text" placeholder="تاریخ تولد شمسی: سال/ماه/روز" style="margin-top:8px">
      </div>

      <button class="btn" onclick="submitCompare()">مقایسه کن</button></div>`);
  if(!hasProfiles){
    document.getElementById('cp-manual1').style.display='block';
    document.getElementById('cp-manual2').style.display='block';
  }
}
function toggleCompareManual(which){
  const sel = document.getElementById(`cp-sel${which}`).value;
  document.getElementById(`cp-manual${which}`).style.display = (sel==='manual') ? 'block' : 'none';
}
function getCompareePerson(which){
  const hasProfiles = state.savedProfiles.length > 0;
  const sel = hasProfiles ? document.getElementById(`cp-sel${which}`).value : 'manual';
  if(sel !== 'manual'){
    const p = state.savedProfiles[parseInt(sel,10)];
    return { name: `${p.firstName} ${p.familyName}`, jy:p.jy, jm:p.jm, jd:p.jd };
  }
  const name = document.getElementById(`cp-n${which}`).value.trim();
  const d = parseDate(document.getElementById(`cp-d${which}`).value);
  if(!name || !d) return null;
  return { name, jy:d.jy, jm:d.jm, jd:d.jd };
}
function parseDate(s){const parts=s.split('/').map(x=>parseInt(x.trim(),10)); if(parts.length!==3||parts.some(isNaN))return null; return {jy:parts[0],jm:parts[1],jd:parts[2]};}
function submitCompare(){
  const p1 = getCompareePerson(1), p2 = getCompareePerson(2);
  if(!p1||!p2){alert('اطلاعات هر دو نفر رو کامل کن (اسم و تاریخ تولد به فرمت سال/ماه/روز).'); return;}
  const [f1,...fam1]=p1.name.split(' '); const [f2,...fam2]=p2.name.split(' ');
  const r1=calculateCosmicReport(f1,fam1.join(' ')||f1,'',p1.jy,p1.jm,p1.jd);
  const r2=calculateCosmicReport(f2,fam2.join(' ')||f2,'',p2.jy,p2.jm,p2.jd);
  const fields=[["عدد سرنوشت","destinyNum"],["عدد تقدیر","fateNum"],["ارتعاش","vibrationNum"],["عدد باطن","batenNum"]];
  let shared=0;
  const lines=fields.map(([label,key])=>{const same=r1[key]===r2[key]; if(same)shared++; return `${label}: ${r1[key]} / ${r2[key]} ${same?'✅ مشترک':''}`;});
  const zc=zodiacCompatibility(p1.jm,p2.jm);
  render(`${backBtn('showCompareEntry()')}<div class="card"><h2>🔢 مقایسه‌ی عددی ${esc(p1.name)} و ${esc(p2.name)}</h2>
      <div style="white-space:pre-line; line-height:2">${lines.join('\n')}\n\nتعداد اعداد مشترک: ${shared} از ${fields.length}</div></div>
    <div class="card"><div style="white-space:pre-line; line-height:2">${esc(zc)}</div></div>`);
}
function showSavedProfiles(){
  render(`${backBtn('showMoreMenu()')}<div class="card"><h2>📇 پروفایل‌های من</h2>
      ${state.savedProfiles.length===0?'<p class="desc">هنوز پروفایلی ذخیره نشده.</p>':
        state.savedProfiles.map((p,i)=>`<div class="name-item" style="cursor:pointer" onclick="go('showSavedProfile', ${i})"><b>${esc(p.firstName)} ${esc(p.familyName)}</b> — کد: ${esc(p.report.cosmicCode.slice(0,20))}...</div>`).join('')}
    </div>`);
}
function showSavedProfile(i){const p=state.savedProfiles[i]; showCosmicResult(p.firstName,p.familyName,p.report);}

registerNav('showHafez', showHafez);
registerNav('showZodiacEntry', showZodiacEntry);
registerNav('showElham', showElham);
registerNav('showMunajat', showMunajat);
registerNav('showNatalEntry', showNatalEntry);
registerNav('showBabyNameForm', showBabyNameForm);
registerNav('showCompareEntry', showCompareEntry);
registerNav('showZamanbandi', showZamanbandi);
registerNav('showSavedProfiles', showSavedProfiles);
registerNav('showCosmicForm', showCosmicForm);
registerNav('showFullGhazal', showFullGhazal);
registerNav('showZodiac', showZodiac);
registerNav('showSavedProfile', showSavedProfile);
registerNav('showMoreMenu', showMoreMenu);
registerNav('showDailyMenu', showDailyMenu);
registerNav('showHome', showHome);

go('showHome');
