const CACHE_NAME = 'molscreen-v7-final';

const ASSETS = [
  './index.html',
  'https://raw.githubusercontent.com/lukamikautadze/Mallscreen/main/video1.mp4',
  'https://raw.githubusercontent.com/lukamikautadze/Mallscreen/main/video2.mp4'
];

// ინსტალაციისას სათითაოდ ვამატებთ ფაილებს, რომ ერთმა დიდმა არ გააფუჭოს ყველაფერი
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('სათითაოდ ვაქეშირებთ ფაილებს...');
      return Promise.allSettled(
        ASSETS.map(url => cache.add(url).catch(err => console.error("ვერ ჩაიწერა:", url, err)))
      );
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
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // ვიდეოებისთვის ვიყენებთ Range request-ების მხარდაჭერას (მნიშვნელოვანია დიდი ფაილებისთვის)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
