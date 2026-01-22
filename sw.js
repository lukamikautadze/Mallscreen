const CACHE_NAME = 'molscreen-v2'; // სახელი შევცვალოთ (v2), რომ ბრაუზერმა განახლება დაინახოს
const urlsToCache = [
  './index.html',
  'https://www.dropbox.com/scl/fi/p3jnpcnq5zq0i00y423lj/.mp4?rlkey=c87u2tmn8amluocftqtn792cl&st=d1wh4tew&raw=1',
  'https://www.dropbox.com/scl/fi/v2bx6rptchmopoyj2wg84/.mp4?rlkey=a8d5xdh97r1k0b5y1p06mmvkr&st=05anps8s&raw=1'
];

self.addEventListener('install', event => {
  // skipWaiting აიძულებს ბრაუზერს მაშინვე გამოიყენოს ახალი ვერსია
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching videos...');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // თუ ფაილი ქეშშია, იქიდან აიღებს, თუ არა - ინტერნეტიდან
      return response || fetch(event.request);
    })
  );
});
