const CACHE_NAME = 'cyber-tycoon-v1';
const assets = [
  '/',
  '/index.html',
  '/style.css',
  '/config.js',
  '/auth.js',
  '/game.js',
  '/manifest.json',
  '/icon.svg'
];

// Kurulum aşaması ve dosyaları önbelleğe alma
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    })
  );
  self.skipWaiting();
});

// Eski önbellekleri temizleme
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Dosyaları çevrimdışı sunma
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
