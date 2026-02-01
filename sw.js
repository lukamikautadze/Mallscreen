const CACHE_NAME = 'molscreen-v135';
const ASSETS_TO_CACHE = [
  './',
  './index.html'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

function parseRange(rangeHeader, size) {
  // Expects a header like: "bytes=START-END"
  const m = /bytes=(\d*)-(\d*)/.exec(rangeHeader || '');
  if (!m) return null;
  // Handle omitted start or end
  let start = m[1] === '' ? 0 : parseInt(m[1], 10);
  let end = m[2] === '' ? (size - 1) : parseInt(m[2], 10);
  if (isNaN(start) || isNaN(end) || start > end || start < 0 || end >= size) return null;
  return { start, end };
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  const isVideo = req.destination === 'video' || url.pathname.endsWith('.mp4') || url.search.includes('raw=1');

  if (isVideo) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cacheKey = new Request(req.url);
      const rangeHeader = req.headers.get('range');

      // Try to find cached full response first
      let cached = await cache.match(cacheKey);

      // If client requested a Range and we have a full cached response, serve a sliced response
      if (rangeHeader && cached) {
        try {
          const cachedBlob = await cached.blob();
          const len = cachedBlob.size;
          const range = parseRange(rangeHeader, len);
          if (!range) return new Response('', { status: 416, statusText: 'Range Not Satisfiable' });

          const sliced = cachedBlob.slice(range.start, range.end + 1);
          const headers = new Headers({
            'Content-Type': cached.headers.get('Content-Type') || 'video/mp4',
            'Content-Range': `bytes ${range.start}-${range.end}/${len}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': String(range.end - range.start + 1)
          });
          return new Response(sliced, { status: 206, statusText: 'Partial Content', headers });
        } catch (e) {
          // If slicing fails, fall through to network attempt
          console.warn('Failed to serve range from cache, falling back to network', e);
        }
      }

      // Try network first for video (so we can cache/update), but fall back to cache on failure
      try {
        const networkResponse = await fetch(req);

        // Cache full 200 responses so we can serve ranges later.
        // Avoid caching partial (206) responses because they're not the full resource.
        if (networkResponse && networkResponse.status === 200) {
          try {
            // Store clone in cache. If CORS prevents it, this will throw; we catch to avoid failing request.
            await cache.put(cacheKey, networkResponse.clone());
          } catch (e) {
            // Could be opaque/no-cors response or quota error; ignore caching in that case.
            console.warn('Could not cache video response (CORS or quota)', e);
          }
        }

        // If the client requested a range but the network returned 200 with whole file,
        // we should pass networkResponse through (browser will handle range if needed).
        return networkResponse;
      } catch (err) {
        // Network failed — try to satisfy from cache.
        if (cached) {
          if (rangeHeader) {
            try {
              const cachedBlob = await cached.blob();
              const len = cachedBlob.size;
              const range = parseRange(rangeHeader, len);
              if (!range) return new Response('', { status: 416, statusText: 'Range Not Satisfiable' });

              const sliced = cachedBlob.slice(range.start, range.end + 1);
              const headers = new Headers({
                'Content-Type': cached.headers.get('Content-Type') || 'video/mp4',
                'Content-Range': `bytes ${range.start}-${range.end}/${len}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': String(range.end - range.start + 1)
              });
              return new Response(sliced, { status: 206, statusText: 'Partial Content', headers });
            } catch (e) {
              console.warn('Failed to slice cached video during offline fetch', e);
              return new Response('', { status: 503, statusText: 'Service Unavailable' });
            }
          } else {
            return cached;
          }
        }
        return new Response('', { status: 503, statusText: 'Service Unavailable' });
      }
    })());
    return;
  }

  // Default behavior for other assets: try cache, then network.
  event.respondWith(
    caches.match(req).then(response => response || fetch(req))
  );
});
