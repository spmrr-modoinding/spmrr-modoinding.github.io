// firebase-config.js
// Berkas ini berfungsi sebagai pusat konfigurasi Firebase untuk seluruh aplikasi.

// Ganti dengan konfigurasi Firebase proyek Anda.
const firebaseConfig = {
    apiKey: "AIzaSyC-KNi0YqnlxtzkeoemEFWN5xusjxpWV_I",
    authDomain: "paroki-modoinding.firebaseapp.com",
    projectId: "paroki-modoinding",
    storageBucket: "paroki-modoinding.appspot.com",
    messagingSenderId: "615770618729",
    appId: "1:615770618729:web:0f6d67c62512c21f2e5bf8",
    measurementId: "G-ECLMPR9NJ2"
};

// Inisialisasi Firebase (mencegah inisialisasi ganda jika skrip dimuat lebih dari sekali)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}