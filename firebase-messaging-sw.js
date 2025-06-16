// firebase-messaging-sw.js
// Service Worker utama yang menangani Push Notifications (FCM) dan Event Service Worker umum

// Import dan inisialisasi Firebase SDK
// Ganti 'YOUR_API_KEY', 'YOUR_PROJECT_ID', dll. dengan nilai dari Firebase Console Anda.
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

// Konfigurasi Firebase Anda (SAMA PERSIS DENGAN YANG ADA DI script.js)
const firebaseConfig = {
  apiKey: "AIzaSyBa4bYrJwIBYmq0E7pRg4k_xVDXvN9A9sM",
  authDomain: "parokispmrrmodoinding.firebaseapp.com",
  projectId: "parokispmrrmodoinding",
  storageBucket: "parokispmrrmodoinding.firebasestorage.app",
  messagingSenderId: "193278500984",
  appId: "1:193278500984:web:0720d3c4406d1f33324d8d",
  measurementId: "G-D977VXQHLW"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// --- Event Listener Service Worker Umum ---

// Event listener untuk instalasi Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed (Combined SW)');
  self.skipWaiting(); // Memaksa Service Worker baru untuk aktif segera
});

// Event listener untuk aktivasi Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated (Combined SW)');
  event.waitUntil(clients.claim()); // Mengklaim klien segera setelah aktivasi
});

// --- Event Listener Firebase Cloud Messaging (FCM) ---

// Handle pesan di latar belakang (push messages dari FCM)
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title || 'Notifikasi Angelus';
  const notificationOptions = {
    body: payload.notification.body || 'Waktu Doa Malaikat Tuhan telah tiba!',
    icon: payload.notification.icon || 'logo-paroki2.png', // Icon untuk notifikasi
    badge: 'logo-paroki2.png', // Badge (khusus Android)
    data: {
      url: payload.data.url || '/', // URL yang akan dibuka saat notifikasi diklik
    },
    vibrate: [200, 100, 200], // Pola getar (opsional)
    // Suara notifikasi. Pastikan file bell_sound.mp3 ada di root situs Anda.
    // Perilaku suara kustom sangat bergantung pada OS.
    sound: 'bell_sound.mp3' // Pastikan file bell_sound.mp3 ada di root
  };

  self.registration.showNotification(notificationTitle, notificationOptions)
    .catch(error => {
      console.error('Gagal menampilkan notifikasi di SW:', error);
    });
});

// Event listener ketika notifikasi diklik (baik notifikasi FCM maupun notifikasi Service Worker lainnya jika ada)
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked (Combined SW)');
  event.notification.close(); // Tutup notifikasi setelah diklik

  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          // Jika tab sudah terbuka, fokuskan
          return client.focus();
        }
      }
      // Jika tidak ada tab yang cocok, buka tab baru
      return clients.openWindow(urlToOpen);
    })
  );

  // Jika Anda ingin memutar suara saat notifikasi diklik (lebih reliable)
  // Ini adalah fallback atau tambahan, karena sound di options notifikasi sudah ada.
  // Namun, untuk memastikan suara diputar saat notifikasi diklik, ini bisa membantu.
  const audio = new Audio('bell_sound.mp3'); // Path ke file suara lonceng Anda
  audio.play().catch(e => console.warn("Gagal memutar suara di notificationclick:", e));
});

// Catatan: Jika ada logika 'fetch' (untuk caching aset offline) di service-worker.js Anda sebelumnya,
// Anda harus memindahkannya juga ke sini dalam event listener 'fetch'.
/*
self.addEventListener('fetch', (event) => {
  // Contoh logika caching:
  // event.respondWith(
  //   caches.match(event.request).then((response) => {
  //     return response || fetch(event.request);
  //   })
  // );
});
*/
