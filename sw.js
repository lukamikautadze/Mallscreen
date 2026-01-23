const CACHE_NAME = 'molscreen-v5.1';
const ASSETS = [
  './index.html',
  'https://www.dropbox.com/scl/fi/p3jnpcnq5zq0i00y423lj/.mp4?rlkey=c87u2tmn8amluocftqtn792cl&st=d1wh4tew&raw=1',
  'https://www.dropbox.com/scl/fi/v2bx6rptchmopoyj2wg84/.mp4?rlkey=a8d5xdh97r1k0b5y1p06mmvkr&st=05anps8s&raw=1'
];

// ინსტალაციისას ვიწერთ ყველაფერს
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        ASSETS.map(url => 
          fetch(url, {mode: 'no-cors'}) // no-cors აუცილებელია Dropbox-ისთვის
            .then(response => cache.put(url, response))
            .catch(err => console.log('Error caching:', url))
        )
      );
    })
  );
  self.skipWaiting();
});

// აქტივაციისას ვშლით ძველ ნაგავს
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// ინტერნეტის გათიშვისას ფაილის ამოღება ქეშიდან
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // თუ ქეშშია, ვაბრუნებთ ქეშიდან, თუ არა - მივდივართ ინტერნეტში
      return cachedResponse || fetch(event.request);
    })
  );
});
