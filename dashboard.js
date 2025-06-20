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
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Elemen DOM
const welcomeTitle = document.getElementById('welcome-title');
const logoutButton = document.getElementById('logout-button');
const programForm = document.getElementById('program-form');
const addAnggaranBtn = document.getElementById('add-anggaran-btn');
const anggaranItemsContainer = document.getElementById('anggaran-items-container');
const totalAnggaranDisplay = document.getElementById('total-anggaran-display');
const formMessage = document.getElementById('form-message');

let currentUser = null;
let currentUserData = null;

// Fungsi untuk menambah baris rincian anggaran baru
const addAnggaranRow = () => {
    const div = document.createElement('div');
    div.classList.add('anggaran-item');
    div.innerHTML = `
        <input type="text" placeholder="Perincian (e.g., Konsumsi)" class="anggaran-perincian" required>
        <input type="number" placeholder="Vol" class="anggaran-vol" value="1">
        <input type="text" placeholder="Satuan" class="anggaran-satuan" value="Paket">
        <input type="number" placeholder="Harga Satuan" class="anggaran-harga">
        <input type="text" placeholder="Jumlah" class="anggaran-jumlah" readonly>
        <button type="button" class="remove-btn"><i class="bi bi-trash-fill"></i></button>
    `;
    anggaranItemsContainer.appendChild(div);
};

// Fungsi untuk menghitung total anggaran
const calculateTotal = () => {
    let total = 0;
    document.querySelectorAll('.anggaran-item').forEach(item => {
        const vol = item.querySelector('.anggaran-vol').value || 0;
        const harga = item.querySelector('.anggaran-harga').value || 0;
        const jumlah = vol * harga;
        item.querySelector('.anggaran-jumlah').value = `Rp ${jumlah.toLocaleString('id-ID')}`;
        total += jumlah;
    });
    totalAnggaranDisplay.textContent = `Rp ${total.toLocaleString('id-ID')}`;
};

// --- AUTH GUARD & SETUP ---
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // Pengguna sudah login
        currentUser = user;
        try {
            // Ambil data pengguna dari Firestore
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                currentUserData = userDoc.data();
                welcomeTitle.textContent = `Dashboard - ${currentUserData.nama_unit}`;
                // Tambah satu baris anggaran saat halaman dimuat
                addAnggaranRow();
            } else {
                // Dokumen pengguna tidak ditemukan di Firestore
                welcomeTitle.textContent = 'Dashboard Pelaporan';
                alert('Data unit Anda tidak ditemukan. Hubungi admin.');
            }
        } catch (error) {
            console.error("Error mengambil data user:", error);
            welcomeTitle.textContent = 'Gagal memuat data';
        }
    } else {
        // Pengguna belum login, tendang ke halaman login
        console.log('Pengguna belum login, mengarahkan ke login.html');
        window.location.href = 'login.html';
    }
});

// --- EVENT LISTENERS ---

// Tombol Logout
logoutButton.addEventListener('click', () => {
    auth.signOut().then(() => {
        console.log('Logout berhasil');
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Error saat logout:', error);
    });
});

// Tombol Tambah Rincian Anggaran
addAnggaranBtn.addEventListener('click', addAnggaranRow);

// Event listener untuk container anggaran (menangani hapus & kalkulasi)
anggaranItemsContainer.addEventListener('click', (e) => {
    if (e.target.closest('.remove-btn')) {
        e.target.closest('.anggaran-item').remove();
        calculateTotal();
    }
});
anggaranItemsContainer.addEventListener('input', calculateTotal);

// Submit Form Program Kerja
programForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser || !currentUserData) {
        alert('Data pengguna tidak valid. Silakan login ulang.');
        return;
    }

    formMessage.textContent = 'Menyimpan...';
    formMessage.className = 'form-message';

    // Kumpulkan data rincian anggaran
    const rincianAnggaran = [];
    document.querySelectorAll('.anggaran-item').forEach(item => {
        const perincian = item.querySelector('.anggaran-perincian').value;
        if(perincian) { // Hanya simpan jika ada isinya
            rincianAnggaran.push({
                perincian: perincian,
                volume: Number(item.querySelector('.anggaran-vol').value) || 0,
                satuan: item.querySelector('.anggaran-satuan').value,
                harga_satuan: Number(item.querySelector('.anggaran-harga').value) || 0,
                jumlah: (Number(item.querySelector('.anggaran-vol').value) || 0) * (Number(item.querySelector('.anggaran-harga').value) || 0)
            });
        }
    });

    // Kumpulkan semua data program
    const programData = {
        userId: currentUser.uid,
        nama_unit: currentUserData.nama_unit,
        bidang: programForm.bidang.value,
        nama_kegiatan: programForm.nama_kegiatan.value,
        sasaran: programForm.sasaran.value,
        indikator: programForm.indikator.value,
        model_materi: programForm.model.value,
        tempat_waktu: programForm.waktu.value,
        pic: programForm.pic.value,
        sumber_dana: programForm.sumber_dana.value,
        anggaran: rincianAnggaran,
        total_anggaran: parseFloat(totalAnggaranDisplay.textContent.replace(/[^0-9]/g, '')),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        // Simpan ke Firestore
        await db.collection('programs').add(programData);
        formMessage.textContent = 'Program Kerja berhasil disimpan!';
        formMessage.classList.add('success');
        programForm.reset();
        anggaranItemsContainer.innerHTML = ''; // Kosongkan rincian
        addAnggaranRow(); // Tambah satu baris baru
        calculateTotal();
    } catch (error) {
        console.error("Error menyimpan program:", error);
        formMessage.textContent = 'Gagal menyimpan data. Coba lagi.';
        formMessage.classList.add('error');
    }
});