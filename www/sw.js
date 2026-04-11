const CACHE_NAME = 'signaid-core-v1';
const STATIC_FILES = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/firebase.html',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];
const CDN_URLS = [
  'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js',
  'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
  'https://unpkg.com/three@0.128.0/build/three.module.js',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const url = event.request.url;
  // For CDN assets, try cache first
  if (CDN_URLS.some(cdn => url.includes(cdn))) {
    event.respondWith(
      caches.match(event.request).then(res => res || fetch(event.request))
    );
    return;
  }
  // For HTML navigation: network first, fallback to offline.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/offline.html'))
    );
    return;
  }
  // For other assets: cache first
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
