const CACHE_NAME = 'paroki-modoinding-cache-v1';
// Daftar file inti yang akan disimpan untuk akses offline
const urlsToCache = [
  '/ParokiModoinding/',
  '/ParokiModoinding/index.html',
  '/ParokiModoinding/style.css',
  '/ParokiModoinding/script.js',
  '/ParokiModoinding/logo-paroki.png',
  '/ParokiModoinding/icon-192x192.png',
  '/ParokiModoinding/icon-512x512.png'
];

// Event saat Service Worker di-install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Event saat ada permintaan (fetch) dari aplikasi
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika file ditemukan di cache, langsung berikan dari cache
        if (response) {
          return response;
        }
        // Jika tidak, coba ambil dari internet
        return fetch(event.request);
      }
    )
  );
});