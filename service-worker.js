const CACHE_NAME = 'cosmic-number-v17';
const ASSETS = ['./','./index.html','./offline.html','./manifest.json','./data/data.js','./data/tables.js',
'./js/cosmic_logic.js','./js/natal_chart.js','./js/zodiac.js','./js/content_modules.js','./js/baby_name.js','./js/app.js','./js/auth.js',
'./icons/icon-192.png','./icons/icon-512.png','./icons/icon-192-maskable.png','./icons/icon-512-maskable.png',
'./icons/apple-touch-icon.png','./icons/favicon-32.png','./icons/favicon-16.png','./icons/hand-glow.png',
'./icons/menu/icon_app_192.png','./icons/menu/icon_app_512.png','./icons/menu/icon_baby.png','./icons/menu/icon_compare.png',
'./icons/menu/icon_elham.png','./icons/menu/icon_hafez.png','./icons/menu/icon_munajat.png','./icons/menu/icon_natal.png',
'./icons/menu/icon_profiles.png','./icons/menu/icon_zamanbandi.png','./icons/menu/icon_zodiac.png'];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  if(event.request.method !== 'GET') return;
  const isImage = /\.(png|jpg|jpeg|svg|webp|ico)$/i.test(event.request.url);
  if(isImage){
    // تصاویر سنگین: اول فوری از کش نشون بده، بعد در پس‌زمینه یه نسخه‌ی تازه بگیر و برای دفعه‌ی بعد کش کن.
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const network = fetch(event.request).then((fresh) => {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, fresh.clone()));
          return fresh;
        }).catch(() => cached);
        return cached || network;
      })
    );
    return;
  }
  // کد و داده (JS/HTML/JSON): همیشه از سرور تازه بگیر تا آپدیت‌ها بلافاصله اعمال بشن.
  event.respondWith(
    fetch(event.request, {cache: 'no-store'}).then((fresh) => {
      const copy = fresh.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      return fresh;
    }).catch(() => caches.match(event.request).then((cached) => {
      if (cached) return cached;
      if (event.request.mode === 'navigate') return caches.match('./offline.html');
      return Response.error();
    }))
  );
});
