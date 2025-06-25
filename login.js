// Konfigurasi Firebase Anda
const firebaseConfig = {
    apiKey: "AIzaSyC-KNi0YqnlxtzkeoemEFWN5xusjxpWV_I",
    authDomain: "paroki-modoinding.firebaseapp.com",
    projectId: "paroki-modoinding",
    storageBucket: "paroki-modoinding.appspot.com",
    messagingSenderId: "615770618729",
    appId: "1:615770618729:web:0f6d67c62512c21f2e5bf8",
    measurementId: "G-ECLMPR9NJ2"
};

// Inisialisasi Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// Mengambil elemen dari form
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email'); // Diubah dari usernameInput
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

// Menambahkan event listener saat form disubmit
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;
    errorMessage.textContent = '';
    const submitButton = loginForm.querySelector('button');
    submitButton.disabled = true;
    submitButton.textContent = 'Memproses...';

    try {
        // Langkah 1: Langsung lakukan login dengan email dan password
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Langkah 2: Periksa peran (role) pengguna dari Firestore setelah berhasil login
        const userDoc = await db.collection('users').doc(user.uid).get();

        if (userDoc.exists) {
            const userData = userDoc.data();
            // Arahkan ke dashboard admin, karena hanya admin yang punya dashboard saat ini
            if (userData.peran === 'admin') {
                console.log('Admin login berhasil. Mengarahkan ke admin-dashboard.html');
                window.location.href = 'admin-dashboard.html';
            } else {
                // Untuk masa depan jika ada peran lain
                auth.signOut(); // Logout jika peran tidak sesuai
                throw new Error('Anda tidak memiliki hak akses dashboard.');
            }
        } else {
            auth.signOut(); // Logout jika data tidak ada di firestore
            throw new Error('Data pengguna tidak ditemukan di database.');
        }

    } catch (error) {
        console.error('Error saat login:', error.code, error.message);
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
            errorMessage.textContent = 'Email tidak terdaftar.';
        } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            errorMessage.textContent = 'Password salah. Silakan coba lagi.';
        } else {
            errorMessage.textContent = error.message; // Tampilkan pesan error yang lebih spesifik
        }
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Login';
    }
});