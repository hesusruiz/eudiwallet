const CACHE_NAME = 'eudi-wallet-v1';

/** @type {ServiceWorkerGlobalScope} */
// @ts-ignore
const sw = self;

// vite-plugin-pwa injects the list of files here
// @ts-expect-error
const INJECTED_ASSETS = self.__WB_MANIFEST;

// Convert the manifest list (which might be objects {url, revision}) to just URLs
const PRECACHE_ASSETS = INJECTED_ASSETS ? INJECTED_ASSETS.map(entry => typeof entry === 'string' ? entry : entry.url) : [];


sw.addEventListener('install', (event) => {
    // Pre-cache all app resources.
    // This is critical for "never refreshed again" behavior.
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(PRECACHE_ASSETS))
            .then(() => sw.skipWaiting()) // Activate immediately to take control
    );
});

sw.addEventListener('activate', (event) => {
    // Clean up old caches immediately
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => sw.clients.claim()) // Take control of all clients immediately
    );
});

sw.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // CACHE-FIRST STRATEGY
    // 1. Check cache.
    // 2. If present, return it (never go to network).
    // 3. If missing, fetch from network (and optionally cache it).
    
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then((networkResponse) => {
                // Optional: Cache new resources dynamically
                // For a strict "pre-cached only" app, you might want to omit this,
                // but checking for validity and caching is usually safer.
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }

                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return networkResponse;
            });
        })
    );
});
