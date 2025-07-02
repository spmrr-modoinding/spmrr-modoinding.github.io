// firebase-messaging-sw.js

// Impor dan konfigurasikan Firebase
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyC-KNi0YqnlxtzkeoemEFWN5xusjxpWV_I",
  authDomain: "paroki-modoinding.firebaseapp.com",
  projectId: "paroki-modoinding",
  storageBucket: "paroki-modoinding.appspot.com",
  messagingSenderId: "615770618729",
  appId: "1:615770618729:web:0f6d67c62512c21f2e5bf8",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Menangani notifikasi saat aplikasi berada di background
messaging.onBackgroundMessage((payload) => {
  console.log('Menerima pesan di background ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/logo-paroki2.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});