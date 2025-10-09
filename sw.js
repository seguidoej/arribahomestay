const CACHE_NAME = 'arriba-homestay-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/public/logo/logo.png',
  '/public/hero/hero.png',
  '/public/gallery/1.jpg',
  '/public/gallery/2.jpg',
  '/public/gallery/3.jpg',
  '/public/gallery/5.jpg',
  '/public/gallery/6.jpg',
  '/public/gallery/7.jpg',
  '/public/gallery/8.jpg',
  '/public/attractions/cloud9.jpg',
  '/public/attractions/General luna beach.jpg',
  '/public/attractions/sugba lagoon.jpg',
  '/public/attractions/naked island.jpg'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/public/logo/logo.png',
    badge: '/public/logo/logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/public/logo/logo.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/public/logo/logo.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Arriba Homestay', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
