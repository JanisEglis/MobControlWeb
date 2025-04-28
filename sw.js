const CACHE_NAME = 'mobcontrol-cache-v1';
const FILES_TO_CACHE = [
  './',               // Pašreizējā mape
  './index.html',     // Poga lapa
  './MobControlWeb.html' // Platformas lapa
];

// Instalācija – saglabā tikai lokālos failus
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(FILES_TO_CACHE);
      })
      .catch(err => {
        console.error('❌ Kešatmiņas kļūda instalācijas laikā:', err);
      })
  );
  self.skipWaiting();
});

// Aktivizācija – iztīra veco kešu
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

// Fetch – ja ir kešs, izmanto to, ja nav – mēģina no interneta
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
      .catch(() => {
        // Ja ne kešā, ne internetā – nedara neko
      })
  );
});
