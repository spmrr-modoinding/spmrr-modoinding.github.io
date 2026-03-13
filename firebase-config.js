// firebase-config.js
// Berkas ini berfungsi sebagai pusat konfigurasi Firebase untuk seluruh aplikasi Paroki.

const firebaseConfig = {
    apiKey: "AIzaSyC-KNi0YqnlxtzkeoemEFWN5xusjxpWV_I",
    authDomain: "paroki-modoinding.firebaseapp.com",
    projectId: "paroki-modoinding",
    storageBucket: "paroki-modoinding.appspot.com",
    messagingSenderId: "615770618729",
    appId: "1:615770618729:web:0f6d67c62512c21f2e5bf8",
    measurementId: "G-ECLMPR9NJ2"
};

// Inisialisasi Firebase (mencegah inisialisasi ganda)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Deklarasi global agar bisa dipakai langsung oleh script.js dan admin-dashboard.js
const db = firebase.firestore();
const auth = firebase.auth();