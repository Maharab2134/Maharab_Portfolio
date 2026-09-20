const CACHE_NAME = 'portfolio-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install a service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Cache and return requests
self.addEventListener('fetch', event => {
  // Only handle GET requests from http/https schemes
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        // Fallback response for when both network and cache fail (e.g., offline or blocked requests)
        return new Response('Network error or offline', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
    })
  );
});

// Update a service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
