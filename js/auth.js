// ===== تنظیمات بک‌اند عضویت =====
// بعد از دیپلوی Worker روی Cloudflare (طبق راهنمای backend/README.md)، این آدرس رو با آدرس واقعی خودت عوض کن:
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
  const res = await fetch(AUTH_API_BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
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
  clearSession();
  if (typeof onAuthChanged === 'function') onAuthChanged(null);
}
async function refreshCurrentUser() {
  if (!authToken) return null;
  try {
    const data = await authFetch('/me', { headers: { Authorization: 'Bearer ' + authToken } });
    currentUser = data.user;
    if (typeof onAuthChanged === 'function') onAuthChanged(currentUser);
    return currentUser;
  } catch (e) {
    // توکن منقضی یا نامعتبره — خارج کن.
    clearSession();
    if (typeof onAuthChanged === 'function') onAuthChanged(null);
    return null;
  }
}
// اگه از قبل توکنی ذخیره شده، همون اول برنامه وضعیت ورود رو چک کن.
if (authToken) refreshCurrentUser();

function translateAuthError(err) {
  return err && err.message ? err.message : 'خطای ناشناخته رخ داد.';
}
