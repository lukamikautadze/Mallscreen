const CACHE_NAME = 'molscreen-v5.2'; // Changed version to force update
const ASSETS = [
  './index.html',
  'https://www.dropbox.com/scl/fi/p3jnpcnq5zq0i00y423lj/.mp4?rlkey=c87u2tmn8amluocftqtn792cl&st=d1wh4tew&raw=1',
  'https://www.dropbox.com/scl/fi/v2bx6rptchmopoyj2wg84/.mp4?rlkey=a8d5xdh97r1k0b5y1p06mmvkr&st=05anps8s&raw=1'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use cache.addAll — it handles the fetching and storing correctly
      // It will only cache if the response is 'OK' (status 200)
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  // Important: Take control of the page immediately
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return from cache, otherwise fetch from network
      return cachedResponse || fetch(event.request);
    })
  );
});
