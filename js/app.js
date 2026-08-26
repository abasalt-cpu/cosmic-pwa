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
document.querySelectorAll('nav.bottom .nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('nav.bottom .nav-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const target=btn.dataset.nav;
    if(target==='home')showHome(); else if(target==='cosmic')showCosmicForm();
    else if(target==='daily')showDailyMenu(); else if(target==='more')showMoreMenu();
  });
});
function setNav(key){document.querySelectorAll('nav.bottom .nav-btn').forEach(b=>b.classList.toggle('active', b.dataset.nav===key));}
function showHome(){
  setNav('home'); const last=state.lastProfile;
  render(`
    <div class="card"><h2>خوش اومدی 👋</h2>
      <p class="desc">${last?`آخرین محاسبه: <b>${esc(last.firstName)} ${esc(last.familyName)}</b>`:'هنوز محاسبه‌ای انجام ندادی. از «عدد کیهانی» شروع کن.'}</p>
      <button class="btn" onclick="showCosmicForm()">🔢 محاسبه‌ی عدد کیهانی</button></div>
    <div class="grid-menu">
      <div class="menu-tile gold" onclick="showHafez()"><img src="icons/menu/icon_hafez.png" class="icon-img"><span class="label">فال حافظ</span></div>
      <div class="menu-tile gold" onclick="showZodiacEntry()"><img src="icons/menu/icon_zodiac.png" class="icon-img"><span class="label">طالع‌بینی</span></div>
      <div class="menu-tile" onclick="showElham()"><img src="icons/menu/icon_elham.png" class="icon-img"><span class="label">الهام روز</span></div>
      <div class="menu-tile" onclick="showMunajat()"><img src="icons/menu/icon_munajat.png" class="icon-img"><span class="label">مناجات</span></div>
      <div class="menu-tile" onclick="showNatalEntry()"><img src="icons/menu/icon_natal.png" class="icon-img"><span class="label">زایچه‌ی تقریبی</span></div>
      <div class="menu-tile" onclick="showBabyNameForm()"><img src="icons/menu/icon_baby.png" class="icon-img"><span class="label">اسم فرزند</span></div>
      <div class="menu-tile" onclick="showCompareEntry()"><img src="icons/menu/icon_compare.png" class="icon-img"><span class="label">مقایسه‌ی دو نفر</span></div>
      <div class="menu-tile" onclick="showZamanbandi()"><img src="icons/menu/icon_zamanbandi.png" class="icon-img"><span class="label">زمان‌بندی خدا</span></div>
    </div>`);
}
function showDailyMenu(){
  setNav('daily');
  render(`<div class="grid-menu">
      <div class="menu-tile gold" onclick="showHafez()"><img src="icons/menu/icon_hafez.png" class="icon-img"><span class="label">فال حافظ</span></div>
      <div class="menu-tile gold" onclick="showZodiacEntry()"><img src="icons/menu/icon_zodiac.png" class="icon-img"><span class="label">طالع‌بینی امروز</span></div>
      <div class="menu-tile" onclick="showElham()"><img src="icons/menu/icon_elham.png" class="icon-img"><span class="label">الهام روز</span></div>
      <div class="menu-tile" onclick="showMunajat()"><img src="icons/menu/icon_munajat.png" class="icon-img"><span class="label">مناجات</span></div>
      <div class="menu-tile" onclick="showZamanbandi()"><img src="icons/menu/icon_zamanbandi.png" class="icon-img"><span class="label">زمان‌بندی خدا</span></div>
    </div>`);
}
function showMoreMenu(){
  setNav('more');
  render(`<div class="grid-menu">
      <div class="menu-tile" onclick="showNatalEntry()"><img src="icons/menu/icon_natal.png" class="icon-img"><span class="label">زایچه‌ی تقریبی</span></div>
      <div class="menu-tile" onclick="showBabyNameForm()"><img src="icons/menu/icon_baby.png" class="icon-img"><span class="label">اسم فرزند</span></div>
      <div class="menu-tile" onclick="showCompareEntry()"><img src="icons/menu/icon_compare.png" class="icon-img"><span class="label">مقایسه‌ی دو نفر</span></div>
      <div class="menu-tile" onclick="showSavedProfiles()"><img src="icons/menu/icon_profiles.png" class="icon-img"><span class="label">پروفایل‌های من</span></div>
    </div>
    <div class="small-note">این یه اپ کاملاً محلیه — هیچ اطلاعاتی به سروری فرستاده نمی‌شه، همه چیز روی خود گوشیت ذخیره می‌مونه.</div>`);
}
function backBtn(fn,label){return `<button class="back-btn" onclick="${fn}">→ ${label||'بازگشت'}</button>`;}
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
        <button class="btn secondary" onclick="showCosmicForm()">محاسبه‌ی جدید</button>
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
    <button class="btn small secondary" onclick="showFullGhazal('${g.id}')">📜 نمایش کل غزل</button></div>`;
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
  const item=getSampleZamanbandi();
  render(`${backBtn('showHome()')}<div class="card"><h2>⏳ به زمان‌بندی خدا اعتماد کن</h2>
      <p style="color:var(--gold-soft)">${item.time}</p>
      <div class="verse" style="line-height:2.1;margin-top:8px">${esc(item.quote)}</div>
      <p class="small-note">📖 این جمله از کتاب «به زمان‌بندی خدا اعتماد کن» (آکیرا، ترجمه‌ی نهال سهیلی‌فر) است.<br>
      <a href="${ZAMANBANDI_LINK}" target="_blank" style="color:var(--gold-soft)">برای خوندن کامل کتاب اینجا بزن</a></p>
      <button class="btn secondary" onclick="showZamanbandi()">🔄 یکی دیگه</button></div>`);
}
function showZodiacEntry(){
  if(state.savedProfiles.length>1){
    render(`${backBtn('showHome()')}<div class="card"><h2>♈️ طالع‌بینی — کدوم پروفایل؟</h2>
        ${state.savedProfiles.map(p=>`<div class="name-item" style="cursor:pointer" onclick="showZodiac(${p.jm})"><b>${esc(p.firstName)} ${esc(p.familyName)}</b> — ${new Date(p.date).toLocaleDateString('fa-IR')}</div>`).join('')}
      </div>`);
  } else if(state.lastProfile){ showZodiac(state.lastProfile.jm); }
  else { showMonthPickerForZodiac(); }
}
function showMonthPickerForZodiac(){
  render(`${backBtn('showHome()')}<div class="card"><h2>ماه تولدت رو انتخاب کن:</h2>
      <div class="chip-row">${PERSIAN_MONTHS.map((m,i)=>`<div class="chip" onclick="showZodiac(${i+1})">${m}</div>`).join('')}</div></div>`);
}
function showZodiac(jm){
  const text=formatHoroscope(jm);
  render(`${backBtn('showHome()')}<div class="card"><div class="verse" style="white-space:pre-line; line-height:2.1">${esc(text)}</div></div>`);
}
function showNatalEntry(){
  if(!state.lastProfile){
    render(`${backBtn('showHome()')}<div class="card"><h2>🌌 زایچه‌ی تقریبی</h2>
      <p class="desc">برای زایچه، اول یه‌بار «عدد کیهانی» رو محاسبه کن (چون از همون تاریخ تولد استفاده می‌کنیم).</p>
      <button class="btn" onclick="showCosmicForm()">محاسبه‌ی عدد کیهانی</button></div>`); return;
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
  render(`${backBtn('showHome()')}<div class="card"><h2>🔗 مقایسه‌ی دو نفر</h2>
      <p class="desc">اطلاعات هر دو نفر رو وارد کن:</p>
      <label>نام و فامیل نفر اول</label><input id="cp-n1" type="text" placeholder="مثلاً علی محمدی">
      <label>تاریخ تولد نفر اول (شمسی، مثلاً 1370/5/15)</label><input id="cp-d1" type="text" placeholder="سال/ماه/روز">
      <label>نام و فامیل نفر دوم</label><input id="cp-n2" type="text">
      <label>تاریخ تولد نفر دوم (شمسی)</label><input id="cp-d2" type="text" placeholder="سال/ماه/روز">
      <button class="btn" onclick="submitCompare()">مقایسه کن</button></div>`);
}
function parseDate(s){const parts=s.split('/').map(x=>parseInt(x.trim(),10)); if(parts.length!==3||parts.some(isNaN))return null; return {jy:parts[0],jm:parts[1],jd:parts[2]};}
function submitCompare(){
  const n1=document.getElementById('cp-n1').value.trim(), n2=document.getElementById('cp-n2').value.trim();
  const d1=parseDate(document.getElementById('cp-d1').value), d2=parseDate(document.getElementById('cp-d2').value);
  if(!n1||!n2||!d1||!d2){alert('همه‌ی فیلدها رو درست پر کن (فرمت تاریخ: سال/ماه/روز).'); return;}
  const [f1,...fam1]=n1.split(' '); const [f2,...fam2]=n2.split(' ');
  const r1=calculateCosmicReport(f1,fam1.join(' ')||f1,'',d1.jy,d1.jm,d1.jd);
  const r2=calculateCosmicReport(f2,fam2.join(' ')||f2,'',d2.jy,d2.jm,d2.jd);
  const fields=[["عدد سرنوشت","destinyNum"],["عدد تقدیر","fateNum"],["ارتعاش","vibrationNum"],["عدد باطن","batenNum"]];
  let shared=0;
  const lines=fields.map(([label,key])=>{const same=r1[key]===r2[key]; if(same)shared++; return `${label}: ${r1[key]} / ${r2[key]} ${same?'✅ مشترک':''}`;});
  const zc=zodiacCompatibility(d1.jm,d2.jm);
  render(`${backBtn('showCompareEntry()')}<div class="card"><h2>🔢 مقایسه‌ی عددی ${esc(n1)} و ${esc(n2)}</h2>
      <div style="white-space:pre-line; line-height:2">${lines.join('\n')}\n\nتعداد اعداد مشترک: ${shared} از ${fields.length}</div></div>
    <div class="card"><div style="white-space:pre-line; line-height:2">${esc(zc)}</div></div>`);
}
function showSavedProfiles(){
  render(`${backBtn('showMoreMenu()')}<div class="card"><h2>📇 پروفایل‌های من</h2>
      ${state.savedProfiles.length===0?'<p class="desc">هنوز پروفایلی ذخیره نشده.</p>':
        state.savedProfiles.map((p,i)=>`<div class="name-item" style="cursor:pointer" onclick="showSavedProfile(${i})"><b>${esc(p.firstName)} ${esc(p.familyName)}</b> — کد: ${esc(p.report.cosmicCode.slice(0,20))}...</div>`).join('')}
    </div>`);
}
function showSavedProfile(i){const p=state.savedProfiles[i]; showCosmicResult(p.firstName,p.familyName,p.report);}
showHome();
