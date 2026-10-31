importScripts('./js/version.js');
const CACHE_NAME = 'cosmic-code-' + APP_VERSION;
// [1.2.17] هشدار انتشار: مرورگرِ آپدیتِ سرویس‌ورکر را فقط با مقایسهٔ بایت‌به‌بایتِ همین فایل تشخیص می‌دهد.
// پس با هر انتشار جدید، علاوه بر js/version.js، شمارهٔ خط «build:» پایین را هم دقیقاً همان عدد کنید.
// build: 1.2.28
const ASSETS = ['./','./index.html','./offline.html','./privacy.html','./manifest.json','./data/data.js','./data/tables.js','./fonts/Sahel-Bold.woff2','./fonts/Sahel-Black.woff2',
'./js/cosmic_logic.js','./js/natal_chart.js','./js/zodiac.js','./js/content_modules.js','./js/version.js','./js/baby_name.js','./js/number_info.js','./js/app.js','./js/auth.js','./js/push.js',
'./icons/icon-192.png','./icons/icon-512.png','./icons/icon-192-maskable.png','./icons/icon-512-maskable.png',
'./icons/apple-touch-icon.png','./icons/favicon-32.png','./icons/favicon-16.png','./icons/hand-glow.png',
'./icons/menu/icon_app_192.png','./icons/menu/icon_app_512.png','./icons/menu/icon_baby.webp','./icons/menu/icon_gratitude.webp','./icons/menu/icon_compare.webp',
'./icons/menu/icon_elham.webp','./icons/menu/icon_hafez.webp','./icons/menu/icon_munajat.webp','./icons/menu/icon_natal.webp',
'./icons/menu/icon_profiles.png','./icons/menu/icon_zamanbandi.webp','./icons/menu/icon_zodiac.webp'];
// [1.2.17] hafez_modern.js (۱.۵۵ مگابایت) از precache حذف شد تا نصب اولیهٔ سرویس‌ورکر سبک و کم‌خطا بماند؛
// این فایل بار اولِ باز کردن «فال حافظ» دانلود و کش می‌شود (شاخهٔ heavy-data پایین همین کار را انجام می‌دهد).
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// [1.2.17] آستانهٔ تازگی: اگر نسخهٔ کش‌شده جدیدتر از این بازه باشد، پس‌زمینه هیچ دانلودی انجام نمی‌دهد
// (صرفه‌جویی جدی در اینترنت همراه؛ فایل data.js حدود ۱.۳ مگابایت است).
const FRESH_MS = 10 * 60 * 1000;
function isFresh(cached){
  if(!cached) return false;
  const t = Date.parse(cached.headers.get('date') || '');
  if(!t) return false; // بدون تاریخ قابل اتکا → محتاط باش و تازه‌سازی کن
  return (Date.now() - t) < FRESH_MS;
}
// تازه‌سازی بی‌صدا در پس‌زمینه؛ هیچ‌وقت خطا به بالا نمی‌دهد و صفحه را معطل نمی‌کند.
function refreshInBackground(request){
  fetch(request, {cache: 'no-store'}).then((fresh) => {
    if(fresh && fresh.ok){
      const copy = fresh.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
    }
  }).catch(() => {});
}
self.addEventListener('fetch', (event) => {
  if(event.request.method !== 'GET') return;
  // فقط منابع هم‌مبدأ مدیریت می‌شوند؛ پاسخ‌های API و سرویس‌های خارجی هرگز در کش ذخیره نمی‌شوند.
  if(new URL(event.request.url).origin !== self.location.origin) return;
  const isImage = /\.(png|jpg|jpeg|svg|webp|ico)$/i.test(event.request.url);
  const isHeavyData = /\/data\/(data|tables|hafez_modern)\.js(\?|$)/i.test(event.request.url); // [1.2.28] ?v=نسخه هم جواب می‌دهد — فیکس «تفسیر با AI نمی‌آید» (کلید کش تازه به ازای هر نسخه)
  if(isImage && /\/icons\//i.test(event.request.url)){
    // آیکون‌ها: فقط یک بار دانلود و کش بشن (بدون دانلود دوباره‌ی پس‌زمینه در هر بار باز کردن اپ)
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request).then((fresh) => {
        if(fresh.ok){ const copy = fresh.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)); }
        return fresh;
      }))
    );
    return;
  }
  if(isImage || isHeavyData){
    // تصاویر و داده‌های سنگین: فوری از کش، و اگر تازه نبود در پس‌زمینه نسخهٔ تازه بگیر.
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if(cached){
          if(!isFresh(cached)) refreshInBackground(event.request);
          return cached;
        }
        return fetch(event.request).then((fresh) => {
          if(fresh.ok){ const c1 = fresh.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(event.request, c1)); }
          return fresh;
        });
      })
    );
    return;
  }
  // کد و پوستهٔ اپ (HTML/JS/CSS/فونت/مانیفست): [1.2.17] استراتژی «کش فوری + تازه‌سازی پس‌زمینه».
  // چرا؟ در 1.2.16 هر درخواست تا ۳.۵ ثانیه منتظر شبکه می‌ماند؛ در مسیر کندِ ایران (GitHub Pages/Fastly)
  // شبکه تقریباً هیچ‌وقت زودتر از تایمر جواب نمی‌داد، پس هر بار باز شدنِ اپ ~۴ ثانیه طول می‌کشید
  // حتی با کشِ کامل. الان نسخهٔ کش‌شده بلافاصله پاسخ می‌شود (باز شدن تقریباً آنی) و در پس‌زمینه
  // نسخهٔ تازه گرفته و کش می‌شود تا باز شدنِ بعدی به‌روز باشد. آپدیت نسخه‌ها هم از مسیر خودِ
  // سرویس‌ورکر تضمین می‌شود: بایت‌های service-worker.js با هر انتشار عوض می‌شود (تگ build) →
  // نصب SW جدید → precache کامل نسخهٔ جدید در کشِ جدید → activate. اگر کشی نداریم (اولین بازدید)
  // مثل قبل منتظر شبکه می‌مانیم.
  event.respondWith((async () => {
    try {
      const cached = await caches.match(event.request);
      if(cached){
        if(!isFresh(cached)) refreshInBackground(event.request);
        return cached;
      }
      const fresh = await fetch(event.request, {cache: 'no-store'});
      if(fresh && fresh.ok){
        const copy = fresh.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      }
      return fresh;
    } catch (err) {
      const cachedFallback = await caches.match(event.request);
      if (cachedFallback) return cachedFallback;
      if (event.request.mode === 'navigate') return caches.match('./offline.html');
      return Response.error();
    }
  })());
});
self.addEventListener('push', (event) => {
  let data = { title: '🎂 یادآوری تولد', body: 'امروز یه تولد ویژه داری!' };
  try { if (event.data) data = event.data.json(); } catch (e) {}
  event.waitUntil(self.registration.showNotification(data.title, {
    body: data.body,
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png',
    dir: 'rtl',
    lang: 'fa',
  }));
});
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) { if ('focus' in client) return client.focus(); }
      if (self.clients.openWindow) return self.clients.openWindow('./');
    })
  );
});
