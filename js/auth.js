// ===== تنظیمات بک‌اند عضویت =====
// [DOMAIN 1.2.11] اتصال به دامنه‌ی اختصاصی api.cosmiccode.ir:
// workers.dev در ایران توسط بعضی اپراتورها فیلتر است و کاربر بدون فیلترشکن
// نمی‌توانست وارد شود. حالا همان Worker (cosmic-code-auth) با Custom Domain
// در اکانت کیهانی روی api.cosmiccode.ir سرو می‌شود — همان دیتابیس، همان
// توکن‌ها؛ کاربران واردشده هیچ تغییری حس نمی‌کنند.
// بازگشت اضطراری: مقدار قبلی = "https://cosmic-code-auth.cosmiccode396.workers.dev"
// (CSP در index.html فعلاً هر دو هاست را اجازه می‌دهد؛ workers.dev در نسخه‌ی
// بعدی که مطمئن شدیم همه‌چیز سالم است حذف می‌شود.)
// تاریخچه: [هاتفیکس 1.2.3] cosmic.carservbook.ir هرگز متصل نشد (ممنوعیت CNAME
// بین‌اکانتی Cloudflare — خطای 1014). این‌بار دامنه در همان اکانتِ Worker وصل
// شده و با تست واقعی (/iap) جواب گرفته، پس خطای 1014 تکرار نمی‌شود.
const AUTH_API_BASE = "https://api.cosmiccode.ir";
// Client ID که از Google Cloud Console گرفتی (مرحله‌ی ۹ راهنما) رو اینجا جایگزین کن:
const GOOGLE_CLIENT_ID = "948644041400-q6k9d730s9ml847t6us27ufumkijfetc.apps.googleusercontent.com";

let authToken = localStorage.getItem('authToken') || null;
// [S5-fix] اطلاعات کاربر هم کنار توکن در localStorage ذخیره می‌شود تا بعد از به‌روزرسانی اپ
// یا بازکردن دوباره‌ی برنامه، وضعیت «واردشده» از همان اول نمایش داده شود.
// قبلاً currentUser فقط در حافظه بود و تا برگشتن پاسخ /me (که روی دیتای موبایل/
// شبکه‌های فیلترشده ممکن است اصلاً برنگردد) صفحه‌ی حساب، فرم ورود نشان می‌داد و
// به نظر می‌رسید برنامه از حساب خارج شده است؛ در حالی که توکن ۳۰ روزه سالم بود.
let currentUser = null;
try { currentUser = JSON.parse(localStorage.getItem('authUser') || 'null'); } catch (e) { currentUser = null; }
if (currentUser && !authToken) { currentUser = null; localStorage.removeItem('authUser'); }

function saveSession(token, user) {
  authToken = token;
  currentUser = user;
  localStorage.setItem('authToken', token);
  try { localStorage.setItem('authUser', JSON.stringify(user || null)); } catch (e) {}
}
function clearSession() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
}

async function authFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  // [S1-fix] توکن به‌صورت خودکار به همه‌ی درخواست‌ها اضافه می‌شود
  // (قبلاً /push/subscribe و /push/reminders اصلاً توکن نمی‌فرستادند)
  if (authToken && !headers.Authorization) headers.Authorization = 'Bearer ' + authToken;
  let res;
  // [S3-fix] مهلت ۲۰ ثانیه: روی شبکه‌های فیلترشده/کند، درخواست بی‌نهایت معلق نمی‌ماند
  const ctl = ('AbortController' in window) ? new AbortController() : null;
  const timer = ctl ? setTimeout(() => ctl.abort(), 20000) : null;
  try {
    res = await fetch(AUTH_API_BASE + path, {
      ...options,
      headers,
      signal: ctl ? ctl.signal : undefined,
    });
  } catch (networkErr) {
    // خطای سطح شبکه (فیلترینگ، قطعی اینترنت، DNS، تایم‌اوت و...) — پیام خام مرورگر («Failed to fetch»)
    // برای کاربر بی‌معنی است؛ پیام قابل‌فهم جایگزین می‌کنیم.
    if (networkErr && networkErr.name === 'AbortError') {
      throw new Error('پاسخی از سرور دریافت نشد (مهلت ۲۰ ثانیه تمام شد). اتصال اینترنت را بررسی کنید؛ اگر نشد، با فیلترشکن امتحان کنید.');
    }
    throw new Error('ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید و دوباره تلاش کنید؛ اگر نشد، با فیلترشکن امتحان کنید.');
  } finally {
    if (timer) clearTimeout(timer);
  }
  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error('پاسخ نامعتبر از سرور.');
  }
  if (!res.ok) {
    throw new Error(data.error || 'خطای ناشناخته.');
  }
  return data;
}

async function signUpWithEmail(email, password) {
  const data = await authFetch('/signup', { method: 'POST', body: JSON.stringify({ email, password }) });
  saveSession(data.token, data.user);
  if (typeof onAuthChanged === 'function') onAuthChanged(currentUser);
  return data.user;
}
async function signInWithEmail(email, password) {
  const data = await authFetch('/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  saveSession(data.token, data.user);
  if (typeof onAuthChanged === 'function') onAuthChanged(currentUser);
  return data.user;
}
async function requestOtp(phone) {
  return authFetch('/otp/request', { method: 'POST', body: JSON.stringify({ phone }) });
}
async function verifyOtp(phone, code) {
  const data = await authFetch('/otp/verify', { method: 'POST', body: JSON.stringify({ phone, code }) });
  saveSession(data.token, data.user);
  if (typeof onAuthChanged === 'function') onAuthChanged(currentUser);
  return data.user;
}
async function signInWithGoogleCredential(accessToken) {
  const data = await authFetch('/google', { method: 'POST', body: JSON.stringify({ access_token: accessToken }) });
  saveSession(data.token, data.user);
  if (typeof onAuthChanged === 'function') onAuthChanged(currentUser);
  return data.user;
}
async function signOutUser() {
  try { if (authToken) await authFetch('/logout', { method: 'POST' }); } catch (e) {} // [S9-fix] ابطال نشست در سرور
  clearSession();
  if (typeof onAuthChanged === 'function') onAuthChanged(null);
}
async function refreshCurrentUser() {
  if (!authToken) return null;
  let res;
  try {
    res = await fetch(AUTH_API_BASE + '/me', { headers: { Authorization: 'Bearer ' + authToken } });
  } catch (networkErr) {
    // مشکل شبکه بود (قطعی موقت، آفلاین و...)، نه اینکه توکن نامعتبر باشه — نشست رو دست‌نخورده نگه دار.
    return currentUser;
  }
  if (res.status === 401) {
    // این‌جا سرور صراحتاً گفته توکن نامعتبر/منقضی‌شده — واقعاً خارج کن.
    clearSession();
    if (typeof onAuthChanged === 'function') onAuthChanged(null);
    return null;
  }
  try {
    const data = await res.json();
    if (!res.ok) return currentUser; // خطای دیگه‌ای غیر از ۴۰۱ بود — فعلاً نشست رو دست نزن
    currentUser = data.user;
    try { localStorage.setItem('authUser', JSON.stringify(data.user || null)); } catch (e) {}
    if (typeof onAuthChanged === 'function') onAuthChanged(currentUser);
    return currentUser;
  } catch (e) {
    return currentUser; // پاسخ قابل‌خوندن نبود — بازم نشست رو حفظ کن
  }
}
// اگه از قبل توکنی ذخیره شده، همون اول برنامه وضعیت ورود رو چک کن.
if (authToken) refreshCurrentUser();

function translateAuthError(err) {
  return err && err.message ? err.message : 'خطای ناشناخته رخ داد.';
}
