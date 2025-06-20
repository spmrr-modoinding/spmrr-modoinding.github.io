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
const tableBody = document.getElementById('programs-table-body');

// --- AUTH GUARD & SETUP ---
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // Pengguna sudah login, periksa perannya
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists && userDoc.data().peran === 'admin') {
            // Jika pengguna adalah admin, lanjutkan
            welcomeTitle.textContent = `Admin Dashboard - ${userDoc.data().nama_unit}`;
            loadAllPrograms();
        } else {
            // Jika bukan admin, tendang ke halaman login
            alert('Anda tidak memiliki hak akses untuk halaman ini.');
            window.location.href = 'login.html';
        }
    } else {
        // Pengguna belum login, tendang ke halaman login
        window.location.href = 'login.html';
    }
});

// Fungsi untuk memuat semua program kerja dari Firestore
const loadAllPrograms = async () => {
    try {
        const snapshot = await db.collection('programs').orderBy('createdAt', 'desc').get();
        
        if (snapshot.empty) {
            tableBody.innerHTML = '<tr><td colspan="11" style="text-align:center;">Belum ada data program kerja yang di-input.</td></tr>';
            return;
        }

        let html = '';
        snapshot.forEach(doc => {
            const program = doc.data();
            const programId = doc.id;

            // Format rincian anggaran menjadi daftar list
            let anggaranHtml = '<ul class="anggaran-detail">';
            if(program.anggaran && program.anggaran.length > 0) {
                program.anggaran.forEach(item => {
                    anggaranHtml += `<li>${item.perincian}: Rp ${item.jumlah.toLocaleString('id-ID')}</li>`;
                });
            } else {
                anggaranHtml += '<li>-</li>';
            }
            anggaranHtml += '</ul>';

            html += `
                <tr data-id="${programId}">
                    <td>${program.nama_unit || '-'}</td>
                    <td>${program.nama_kegiatan || '-'}</td>
                    <td>${program.sasaran || '-'}</td>
                    <td>${program.indikator || '-'}</td>
                    <td>${program.model_materi || '-'}</td>
                    <td>${program.tempat_waktu || '-'}</td>
                    <td>${program.pic || '-'}</td>
                    <td>${anggaranHtml}</td>
                    <td>Rp ${(program.total_anggaran || 0).toLocaleString('id-ID')}</td>
                    <td>${program.sumber_dana || '-'}</td>
                    <td>
                        <button class="action-btn-sm edit">Edit</button>
                        <button class="action-btn-sm delete">Hapus</button>
                    </td>
                </tr>
            `;
        });

        tableBody.innerHTML = html;

    } catch (error) {
        console.error("Error memuat program kerja:", error);
        tableBody.innerHTML = '<tr><td colspan="11" style="text-align:center;">Gagal memuat data.</td></tr>';
    }
};

// --- EVENT LISTENERS ---

// Tombol Logout
logoutButton.addEventListener('click', () => {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    });
});