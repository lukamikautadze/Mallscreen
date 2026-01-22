const CACHE_NAME = 'molscreen-v2'; // სახელი შევცვალოთ (v2), რომ ბრაუზერმა განახლება დაინახოს
const urlsToCache = [
  './index.html',
  'https://www.dropbox.com/scl/fi/fdey9od9eii498lsanwt6/Video-lyriced-by-kirkitaa7-music-lyricedits-k...-7594790642086087943.mp4?rlkey=5f5bv46xlacc7wrr0rgjqlnis&st=ooubh7e6&raw=1',
  'https://www.dropbox.com/scl/fi/15wx1gsxro91i7dnv42wz/KFC.mp4?rlkey=e6sn7glqwf2hl4bsqb1eve0f0&st=15baqphh&raw=1'
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
