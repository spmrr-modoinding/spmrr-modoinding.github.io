// PETUNJUK: PASTE KONFIGURASI FIREBASE ANDA DI BAWAH INI
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
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Mengambil elemen dari form
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

// Menambahkan event listener saat form disubmit
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const username = usernameInput.value;
    const password = passwordInput.value;
    errorMessage.textContent = '';

    try {
        // Langkah 1: Cari dokumen di Firestore berdasarkan username
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('username', '==', username).get();

        if (snapshot.empty) {
            errorMessage.textContent = 'Username tidak ditemukan.';
            return;
        }

        let userEmail = '';
        let userDocId = '';
        snapshot.forEach(doc => {
            userEmail = doc.data().email;
            userDocId = doc.id; // Kita ambil ID dokumennya juga (ini adalah User UID)
        });

        // Langkah 2: Lakukan login menggunakan email yang didapat
        const userCredential = await auth.signInWithEmailAndPassword(userEmail, password);
        const user = userCredential.user;

        // --- PERUBAHAN UTAMA DIMULAI DI SINI ---
        // Langkah 3: Periksa peran (role) pengguna dari Firestore
        const userDoc = await db.collection('users').doc(user.uid).get();

        if (userDoc.exists) {
            const userData = userDoc.data();
            if (userData.peran === 'admin') {
                // Jika peran adalah admin, arahkan ke dashboard admin
                console.log('Admin login berhasil. Mengarahkan ke admin-dashboard.html');
                window.location.href = 'admin-dashboard.html';
            } else {
                // Jika peran adalah unit (atau lainnya), arahkan ke dashboard biasa
                console.log('User login berhasil. Mengarahkan ke dashboard.html');
                window.location.href = 'dashboard.html';
            }
        } else {
            // Jika data user tidak ditemukan di firestore (seharusnya tidak terjadi)
            throw new Error('Data pengguna tidak ditemukan di database.');
        }
        // --- AKHIR DARI PERUBAHAN ---

    } catch (error) {
        console.error('Error saat login:', error.code, error.message);
        if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            errorMessage.textContent = 'Password salah. Silakan coba lagi.';
        } else {
            errorMessage.textContent = 'Terjadi kesalahan saat login.';
        }
    }
});