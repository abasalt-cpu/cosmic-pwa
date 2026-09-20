// ===== اعلان‌ها (Web Push): یادآوری تولد + فال روزانه =====
const VAPID_PUBLIC_KEY = "BDI555ZswaD3jKZgeLACbv0F6MQ_YwOiba85ejeRCZ0O617-U9iR6rBBYYvHghEUNxEpB3qzqZLzvTP9nQhEHzQ";

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}
function isPushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}
function isBirthdayRemindersEnabled() { return localStorage.getItem('birthdayRemindersEnabled') === '1'; }
function isDailyFalEnabled() { return localStorage.getItem('dailyFalEnabled') === '1'; }

// اطمینان از اینکه دستگاه اجازه‌ی اعلان داره و روی سرور ثبت شده — مشترک بین هر دو نوع یادآوری.
async function ensurePushSubscribed() {
  if (!isPushSupported()) throw new Error('مرورگرت از اعلان‌ها پشتیبانی نمی‌کنه.');
  if (typeof AUTH_API_BASE === 'undefined' || AUTH_API_BASE.includes('YOUR-WORKER')) throw new Error('این قابلیت هنوز تنظیم نشده.');

  const existingId = localStorage.getItem('pushSubscriptionId');
  if (existingId) return existingId;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('اجازه‌ی اعلان داده نشد.');

  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }
  const subJson = subscription.toJSON();
  const data = await authFetch('/push/subscribe', {
    method: 'POST',
    body: JSON.stringify({ endpoint: subJson.endpoint, keys: subJson.keys }),
  });
  localStorage.setItem('pushSubscriptionId', data.subscriptionId);
  return data.subscriptionId;
}
// وقتی دیگه نه تولد نه فال روزانه فعال نیست، کل اشتراک اعلان رو جمع می‌کنیم.
async function maybeFullyUnsubscribe() {
  if (isBirthdayRemindersEnabled() || isDailyFalEnabled()) return;
  const subscriptionId = localStorage.getItem('pushSubscriptionId');
  if (subscriptionId && typeof AUTH_API_BASE !== 'undefined' && !AUTH_API_BASE.includes('YOUR-WORKER')) {
    try { await authFetch('/push/unsubscribe', { method: 'POST', body: JSON.stringify({ subscriptionId }) }); } catch (e) {}
  }
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) await subscription.unsubscribe();
  } catch (e) {}
  localStorage.removeItem('pushSubscriptionId');
}

// ---------- یادآوری تولد ----------
function buildBirthdayReminders() {
  return state.savedProfiles
    .filter((p) => p.report && p.report.gm && p.report.gd)
    .map((p) => ({ name: `${p.firstName} ${p.familyName}`.trim(), month: p.report.gm, day: p.report.gd }));
}
async function syncBirthdayReminders() {
  const subscriptionId = localStorage.getItem('pushSubscriptionId');
  if (!subscriptionId || !isBirthdayRemindersEnabled()) return;
  try {
    await authFetch('/push/reminders', {
      method: 'POST',
      body: JSON.stringify({ subscriptionId, reminders: buildBirthdayReminders() }),
    });
  } catch (e) { console.error('sync reminders failed', e); }
}
async function enableBirthdayReminders() {
  await ensurePushSubscribed();
  localStorage.setItem('birthdayRemindersEnabled', '1');
  await syncBirthdayReminders();
  return true;
}
async function disableBirthdayReminders() {
  const subscriptionId = localStorage.getItem('pushSubscriptionId');
  localStorage.removeItem('birthdayRemindersEnabled');
  if (subscriptionId && typeof AUTH_API_BASE !== 'undefined' && !AUTH_API_BASE.includes('YOUR-WORKER')) {
    try { await authFetch('/push/reminders', { method: 'POST', body: JSON.stringify({ subscriptionId, reminders: [] }) }); } catch (e) {}
  }
  await maybeFullyUnsubscribe();
}
async function maybeAutoEnableBirthdayReminders() {
  if (!isPushSupported()) return;
  if (isBirthdayRemindersEnabled()) return;
  if (localStorage.getItem('birthdayPushAutoPrompted')) return; // فقط یه‌بار خودکار امتحان می‌کنیم
  if (typeof Notification !== 'undefined' && Notification.permission === 'denied') return; // قبلاً رد شده، دیگه مزاحم نشو
  localStorage.setItem('birthdayPushAutoPrompted', '1');
  try { await enableBirthdayReminders(); } catch (e) { /* کاربر رد کرد یا خطایی بود — بی‌سروصدا نادیده بگیر */ }
}

// ---------- فال روزانه ----------
async function enableDailyFalReminder() {
  const subscriptionId = await ensurePushSubscribed();
  await authFetch('/push/daily-fal', { method: 'POST', body: JSON.stringify({ subscriptionId, enabled: true }) });
  localStorage.setItem('dailyFalEnabled', '1');
  return true;
}
async function disableDailyFalReminder() {
  const subscriptionId = localStorage.getItem('pushSubscriptionId');
  localStorage.removeItem('dailyFalEnabled');
  if (subscriptionId && typeof AUTH_API_BASE !== 'undefined' && !AUTH_API_BASE.includes('YOUR-WORKER')) {
    try { await authFetch('/push/daily-fal', { method: 'POST', body: JSON.stringify({ subscriptionId, enabled: false }) }); } catch (e) {}
  }
  await maybeFullyUnsubscribe();
}
