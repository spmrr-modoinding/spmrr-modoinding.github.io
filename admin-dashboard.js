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

// Elemen DOM Utama
const welcomeTitle = document.getElementById('welcome-title');
const logoutButton = document.getElementById('logout-button');
const tableBody = document.getElementById('programs-table-body');
const addProgramBtn = document.getElementById('add-program-btn');

// Elemen DOM Modal
const modal = document.getElementById('add-program-modal');
const closeModalBtn = modal.querySelector('.close-modal-btn');
const modalForm = document.getElementById('modal-program-form');
const modalAddAnggaranBtn = document.getElementById('modal-add-anggaran-btn');
const modalAnggaranContainer = document.getElementById('modal-anggaran-items-container');
const modalTotalAnggaranDisplay = document.getElementById('modal-total-anggaran-display');
const modalFormMessage = document.getElementById('modal-form-message');

// --- AUTH GUARD & SETUP ---
auth.onAuthStateChanged(async (user) => {
    if (user) {
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists && userDoc.data().peran === 'admin') {
            welcomeTitle.textContent = `Admin Dashboard - ${userDoc.data().nama_unit}`;
            loadAllPrograms();
        } else {
            alert('Anda tidak memiliki hak akses untuk halaman ini.');
            window.location.href = 'login.html';
        }
    } else {
        window.location.href = 'login.html';
    }
});

// --- FUNGSI UTAMA ---
const loadAllPrograms = async () => {
    try {
        const snapshot = await db.collection('programs').orderBy('createdAt', 'desc').get();
        if (snapshot.empty) {
            tableBody.innerHTML = '<tr><td colspan="11" style="text-align:center;">Belum ada data program kerja.</td></tr>';
            return;
        }
        let html = '';
        snapshot.forEach(doc => {
            const program = doc.data();
            const programId = doc.id;
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

// --- LOGIKA MODAL ---
const openModal = () => modal.classList.remove('hidden');
const closeModal = () => modal.classList.add('hidden');

const addModalAnggaranRow = () => {
    const div = document.createElement('div');
    div.classList.add('anggaran-item');
    div.innerHTML = `<input type="text" placeholder="Perincian" class="anggaran-perincian" required> <input type="number" placeholder="Vol" class="anggaran-vol" value="1"> <input type="text" placeholder="Satuan" class="anggaran-satuan" value="Paket"> <input type="number" placeholder="Harga Satuan" class="anggaran-harga"> <input type="text" placeholder="Jumlah" class="anggaran-jumlah" readonly> <button type="button" class="remove-btn">&times;</button>`;
    modalAnggaranContainer.appendChild(div);
};

const calculateModalTotal = () => {
    let total = 0;
    modalAnggaranContainer.querySelectorAll('.anggaran-item').forEach(item => {
        const vol = item.querySelector('.anggaran-vol').value || 0;
        const harga = item.querySelector('.anggaran-harga').value || 0;
        const jumlah = vol * harga;
        item.querySelector('.anggaran-jumlah').value = `Rp ${jumlah.toLocaleString('id-ID')}`;
        total += jumlah;
    });
    modalTotalAnggaranDisplay.textContent = `Rp ${total.toLocaleString('id-ID')}`;
};

// --- EVENT LISTENERS ---
logoutButton.addEventListener('click', () => auth.signOut().then(() => window.location.href = 'index.html'));
addProgramBtn.addEventListener('click', () => {
    modalForm.reset();
    modalAnggaranContainer.innerHTML = '';
    addModalAnggaranRow();
    calculateModalTotal();
    modalFormMessage.textContent = '';
    openModal();
});
closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
modalAddAnggaranBtn.addEventListener('click', addModalAnggaranRow);
modalAnggaranContainer.addEventListener('click', (e) => { if (e.target.classList.contains('remove-btn')) { e.target.parentElement.remove(); calculateModalTotal(); }});
modalAnggaranContainer.addEventListener('input', calculateModalTotal);

// Event listener untuk submit form di dalam modal
modalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    modalFormMessage.textContent = 'Menyimpan...';
    modalFormMessage.className = 'form-message';
    
    const rincianAnggaran = [];
    modalAnggaranContainer.querySelectorAll('.anggaran-item').forEach(item => {
        const perincian = item.querySelector('.anggaran-perincian').value;
        if(perincian) {
            rincianAnggaran.push({
                perincian: perincian,
                volume: Number(item.querySelector('.anggaran-vol').value) || 0,
                satuan: item.querySelector('.anggaran-satuan').value,
                harga_satuan: Number(item.querySelector('.anggaran-harga').value) || 0,
                jumlah: (Number(item.querySelector('.anggaran-vol').value) || 0) * (Number(item.querySelector('.anggaran-harga').value) || 0)
            });
        }
    });

    const programData = {
        nama_unit: modalForm['modal-nama-unit'].value,
        bidang: modalForm['modal-bidang'].value,
        nama_kegiatan: modalForm['modal-nama_kegiatan'].value,
        sasaran: modalForm['modal-sasaran'].value,
        indikator: modalForm['modal-indikator'].value,
        model_materi: modalForm['modal-model'].value,
        tempat_waktu: modalForm['modal-waktu'].value,
        pic: modalForm['modal-pic'].value,
        sumber_dana: modalForm['modal-sumber_dana'].value,
        anggaran: rincianAnggaran,
        total_anggaran: parseFloat(modalTotalAnggaranDisplay.textContent.replace(/[^0-9]/g, '')),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        // Admin bisa menambahkan data atas nama unit lain, tapi kita tandai siapa yg input
        adminInputBy: auth.currentUser.uid 
    };

    try {
        await db.collection('programs').add(programData);
        modalFormMessage.textContent = 'Berhasil disimpan!';
        modalFormMessage.classList.add('success');
        loadAllPrograms(); // Muat ulang tabel untuk menampilkan data baru
        setTimeout(() => { closeModal(); }, 1500); // Tutup modal setelah 1.5 detik
    } catch (error) {
        console.error("Error menyimpan program:", error);
        modalFormMessage.textContent = 'Gagal menyimpan data.';
        modalFormMessage.classList.add('error');
    }
});