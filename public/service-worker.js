// Service Worker for VistoriaPro PWA
const CACHE_NAME = 'vistoria-pro-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install service worker with improved error handling
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service worker caching files');
        return cache.addAll(urlsToCache).catch(err => {
          console.error('Cache addAll error:', err);
          // Continue with installation even if some files fail to cache
          return Promise.resolve();
        });
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Cache and return requests with proper fallbacks
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response because it's a one-time use stream
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              // Only cache same-origin requests to avoid CORS issues
              if (fetchRequest.url.startsWith(self.location.origin)) {
                cache.put(event.request, responseToCache);
              }
            });
            
          return response;
        }).catch(() => {
          // If fetch fails, show offline page if it's a page request
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
          
          // Otherwise just propagate the error
          return new Response('Network error occurred', {
            status: 503,
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
    );
});

// Update service worker
self.addEventListener('activate', (event) => {
  // Take control immediately
  self.clients.claim();
  
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: clearing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle offline fallback
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  
  // Don't cache API requests or third-party requests
  if (
    event.request.url.includes('/api/') || 
    !event.request.url.startsWith(self.location.origin)
  ) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // For navigation requests (HTML pages), show the offline page
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            
            // If it's an image, show a placeholder
            if (event.request.destination === 'image') {
              return caches.match('/placeholder.svg');
            }
            
            // Otherwise just respond with an error
            return new Response('You are offline', {
              status: 503,
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});
