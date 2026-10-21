// ===== تنظیمات بک‌اند عضویت =====
// ⚠️ دامنه‌ی workers.dev در ایران فیلتر است (خطای «Failed to fetch» در اپ).
// راه‌حل: دامنه‌ی شخصی را در Cloudflare به همین Worker وصل کن (Custom Domain) و
// فقط همین یک خط را با دامنه‌ی جدید عوض کن. بقیه‌ی کد نیازی به تغییر ندارد.
const AUTH_API_BASE = "https://cosmic-code-auth.cosmiccode396.workers.dev";
// Client ID که از Google Cloud Console گرفتی (مرحله‌ی ۹ راهنما) رو اینجا جایگزین کن:
const GOOGLE_CLIENT_ID = "948644041400-q6k9d730s9ml847t6us27ufumkijfetc.apps.googleusercontent.com";

let currentUser = null;
let authToken = localStorage.getItem('authToken') || null;

function saveSession(token, user) {
  authToken = token;
  currentUser = user;
  localStorage.setItem('authToken', token);
}
function clearSession() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('authToken');
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
