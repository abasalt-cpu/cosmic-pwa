const CACHE_NAME = 'cosmic-number-v2';
const ASSETS = ['./','./index.html','./manifest.json','./data/data.js','./data/tables.js',
'./js/cosmic_logic.js','./js/natal_chart.js','./js/zodiac.js','./js/content_modules.js','./js/baby_name.js','./js/app.js',
'./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).catch(() => cached)));
});
