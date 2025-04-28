const CACHE_NAME = 'mobcontrol-cache-v1';
const FILES_TO_CACHE = [
  './',               // Pašreizējā mape
  './index.html',
  './MobControlWeb.html',
];

// Instalācija – kešo tikai lokālos failus
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .catch(err => {
        console.error('❌ Kešatmiņas kļūda instalācijas laikā:', err);
      })
  );
  self.skipWaiting();
});

// Aktivizācija – tīra veco kešu
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      })
    ))
  );
  self.clients.claim();
});

// Fetch – kešs tikai! (bez interneta pārbaudes)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // ✅ Atgriež tikai no keša
        } else {
          console.error('❌ Nav kešā:', event.request.url);
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        }
      })
  );
});
