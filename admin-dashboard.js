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
const tableFooter = document.getElementById('table-footer');
const addProgramBtn = document.getElementById('add-program-btn');
const printBtn = document.getElementById('print-btn');

// Elemen DOM Modal
const modal = document.getElementById('add-program-modal');
const modalTitle = document.getElementById('modal-title');
const closeModalBtn = modal.querySelector('.close-modal-btn');
const modalForm = document.getElementById('modal-program-form');
const modalAddAnggaranBtn = document.getElementById('modal-add-anggaran-btn');
const modalAnggaranContainer = document.getElementById('modal-anggaran-items-container');
const modalTotalAnggaranDisplay = document.getElementById('modal-total-anggaran-display');
const modalFormMessage = document.getElementById('modal-form-message');

let currentEditId = null; 

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
    tableBody.innerHTML = `<tr><td colspan="17" style="text-align:center;">Memuat data...</td></tr>`;
    tableFooter.innerHTML = ''; 

    try {
        // PERBAIKAN: Mengambil data tanpa pengurutan rumit dari Firestore
        const snapshot = await db.collection('programs').get();
        if (snapshot.empty) {
            tableBody.innerHTML = '<tr><td colspan="17" style="text-align:center;">Belum ada data program kerja.</td></tr>';
            return;
        }

        const programs = [];
        snapshot.forEach(doc => {
            programs.push({ id: doc.id, ...doc.data() });
        });
        
        // PERBAIKAN: Melakukan pengurutan di sisi klien (browser)
        programs.sort((a, b) => {
            const bidangA = a.bidang || '';
            const bidangB = b.bidang || '';
            const subA = a.sub_bidang_title || '';
            const subB = b.sub_bidang_title || '';
            const timeA = a.createdAt ? a.createdAt.toMillis() : 0;
            const timeB = b.createdAt ? b.createdAt.toMillis() : 0;
            
            if (bidangA < bidangB) return -1;
            if (bidangA > bidangB) return 1;
            if (subA < subB) return -1;
            if (subA > subB) return 1;
            return timeA - timeB; // Urutan terakhir berdasarkan waktu pembuatan
        });


        const groupedData = {};
        programs.forEach(program => {
            const bidang = program.bidang || 'Lain-lain';
            const subBidang = program.sub_bidang_title || 'Tanpa Sub-Judul';

            if (!groupedData[bidang]) {
                groupedData[bidang] = {};
            }
            if (!groupedData[bidang][subBidang]) {
                groupedData[bidang][subBidang] = [];
            }
            groupedData[bidang][subBidang].push(program);
        });

        let html = '';
        let grandTotal = 0;

        for (const bidang in groupedData) {
            html += `<tr class="group-header-bidang"><td colspan="17">${bidang}</td></tr>`;
            for (const subBidang in groupedData[bidang]) {
                html += `<tr class="group-header-sub"><td colspan="17">${subBidang}</td></tr>`;
                
                groupedData[bidang][subBidang].forEach(program => {
                    grandTotal += program.total_anggaran || 0;
                    const hasAnggaran = program.anggaran && program.anggaran.length > 0;
                    const rowCount = hasAnggaran ? program.anggaran.length : 1;

                    html += `
                        <tr data-id="${program.id}">
                            <td rowspan="${rowCount}">${program.pusat_paroki_stasi || '-'}</td>
                            <td rowspan="${rowCount}">${program.nama_unit || '-'}</td>
                            <td rowspan="${rowCount}">${program.nama_kegiatan || '-'}</td>
                            <td rowspan="${rowCount}">${program.sasaran || '-'}</td>
                            <td rowspan="${rowCount}">${program.indikator || '-'}</td>
                            <td rowspan="${rowCount}">${program.model_materi || '-'}</td>
                            <td rowspan="${rowCount}">${program.materi || '-'}</td>
                            <td rowspan="${rowCount}">${program.tempat_waktu || '-'}</td>
                            <td rowspan="${rowCount}">${program.pic || '-'}</td>
                            <td>${hasAnggaran ? (program.anggaran[0].perincian || '-') : '-'}</td>
                            <td>${hasAnggaran ? (program.anggaran[0].volume || '-') : '-'}</td>
                            <td>${hasAnggaran ? (program.anggaran[0].satuan || '-') : '-'}</td>
                            <td>${hasAnggaran ? (program.anggaran[0].harga_satuan || 0).toLocaleString('id-ID') : '-'}</td>
                            <td>${hasAnggaran ? (program.anggaran[0].jumlah || 0).toLocaleString('id-ID') : '-'}</td>
                            <td rowspan="${rowCount}">${(program.total_anggaran || 0).toLocaleString('id-ID')}</td>
                            <td rowspan="${rowCount}">${program.sumber_dana_kas || '-'}</td>
                            <td rowspan="${rowCount}">${program.sumber_dana_swadaya || '-'}</td>
                            <td rowspan="${rowCount}" class="no-print">
                                <button class="action-btn-sm edit">Edit</button>
                                <button class="action-btn-sm delete">Hapus</button>
                            </td>
                        </tr>
                    `;

                    if (hasAnggaran && program.anggaran.length > 1) {
                        for (let i = 1; i < program.anggaran.length; i++) {
                            const item = program.anggaran[i];
                            html += `<tr data-id="${program.id}">
                                <td>${item.perincian || '-'}</td>
                                <td>${item.volume || '-'}</td>
                                <td>${item.satuan || '-'}</td>
                                <td>${(item.harga_satuan || 0).toLocaleString('id-ID')}</td>
                                <td>${(item.jumlah || 0).toLocaleString('id-ID')}</td>
                            </tr>`;
                        }
                    }
                });
            }
        }
        tableBody.innerHTML = html;

        tableFooter.innerHTML = `
            <tr>
                <td colspan="14" style="text-align:right; font-weight:bold;">JUMLAH BUDGET</td>
                <td style="font-weight:bold;">${grandTotal.toLocaleString('id-ID')}</td>
                <td colspan="2"></td>
                <td class="no-print"></td>
            </tr>
        `;

    } catch (error) {
        console.error("Error memuat program kerja:", error);
        tableBody.innerHTML = '<tr><td colspan="17" style="text-align:center;">Gagal memuat data. Silakan cek Console (F12).</td></tr>';
    }
};

const openModal = () => modal.classList.remove('hidden');
const closeModal = () => modal.classList.add('hidden');

const addModalAnggaranRow = (item = {}) => {
    const div = document.createElement('div');
    div.classList.add('anggaran-item');
    div.innerHTML = `<input type="text" placeholder="Perincian" class="anggaran-perincian" value="${item.perincian || ''}" required> <input type="number" placeholder="Vol" class="anggaran-vol" value="${item.volume || 1}"> <input type="text" placeholder="Satuan" class="anggaran-satuan" value="${item.satuan || 'Paket'}"> <input type="number" placeholder="Harga Satuan" class="anggaran-harga" value="${item.harga_satuan || ''}"> <input type="text" placeholder="Jumlah" class="anggaran-jumlah" value="Rp ${(item.jumlah || 0).toLocaleString('id-ID')}" readonly> <button type="button" class="remove-btn">&times;</button>`;
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
printBtn.addEventListener('click', () => window.print());

addProgramBtn.addEventListener('click', () => {
    currentEditId = null;
    modalTitle.textContent = 'Tambah Program Kerja Baru';
    modalForm.reset();
    modalAnggaranContainer.innerHTML = '';
    addModalAnggaranRow();
    calculateModalTotal();
    modalFormMessage.textContent = '';
    openModal();
});

closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
modalAddAnggaranBtn.addEventListener('click', () => addModalAnggaranRow());
modalAnggaranContainer.addEventListener('click', (e) => { if (e.target.classList.contains('remove-btn')) { e.target.parentElement.remove(); calculateModalTotal(); }});
modalAnggaranContainer.addEventListener('input', calculateModalTotal);

tableBody.addEventListener('click', async (e) => {
    const target = e.target;
    if(target.closest('tr')) {
        const programId = target.closest('tr').dataset.id;
        if (!programId) return;
        
        if (target.classList.contains('delete')) {
            if (confirm(`Apakah Anda yakin ingin menghapus program ini?`)) {
                try {
                    await db.collection('programs').doc(programId).delete();
                    loadAllPrograms();
                } catch (error) { console.error("Error menghapus program:", error); }
            }
        }

        if (target.classList.contains('edit')) {
            try {
                const doc = await db.collection('programs').doc(programId).get();
                if (doc.exists) {
                    const program = doc.data();
                    currentEditId = programId;
                    
                    modalTitle.textContent = 'Edit Program Kerja';
                    document.getElementById('modal-bidang').value = program.bidang || '';
                    document.getElementById('modal-sub-bidang').value = program.sub_bidang_title || '';
                    document.getElementById('modal-lokasi').value = program.pusat_paroki_stasi || '';
                    document.getElementById('modal-nama-unit').value = program.nama_unit || '';
                    document.getElementById('modal-nama_kegiatan').value = program.nama_kegiatan || '';
                    document.getElementById('modal-sasaran').value = program.sasaran || '';
                    document.getElementById('modal-indikator').value = program.indikator || '';
                    document.getElementById('modal-model').value = program.model_materi || '';
                    document.getElementById('modal-materi').value = program.materi || '';
                    document.getElementById('modal-waktu').value = program.tempat_waktu || '';
                    document.getElementById('modal-pic').value = program.pic || '';
                    document.getElementById('modal-sumber-dana-kas').value = program.sumber_dana_kas || '-';
                    document.getElementById('modal-sumber-dana-swadaya').value = program.sumber_dana_swadaya || '-';

                    modalAnggaranContainer.innerHTML = '';
                    if (program.anggaran && program.anggaran.length > 0) {
                        program.anggaran.forEach(item => addModalAnggaranRow(item));
                    } else {
                        addModalAnggaranRow();
                    }
                    calculateModalTotal();
                    modalFormMessage.textContent = '';
                    openModal();
                }
            } catch (error) { console.error("Error mengambil data untuk diedit:", error); }
        }
    }
});

modalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    modalFormMessage.textContent = 'Menyimpan...';
    modalFormMessage.className = 'form-message';
    
    const rincianAnggaran = [];
    modalAnggaranContainer.querySelectorAll('.anggaran-item').forEach(item => {
        const perincian = item.querySelector('.anggaran-perincian').value;
        if (perincian) {
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
        bidang: document.getElementById('modal-bidang').value,
        sub_bidang_title: document.getElementById('modal-sub-bidang').value,
        pusat_paroki_stasi: document.getElementById('modal-lokasi').value,
        nama_unit: document.getElementById('modal-nama-unit').value,
        nama_kegiatan: document.getElementById('modal-nama_kegiatan').value,
        sasaran: document.getElementById('modal-sasaran').value,
        indikator: document.getElementById('modal-indikator').value,
        model_materi: document.getElementById('modal-model').value,
        materi: document.getElementById('modal-materi').value,
        tempat_waktu: document.getElementById('modal-waktu').value,
        pic: document.getElementById('modal-pic').value,
        sumber_dana_kas: document.getElementById('modal-sumber-dana-kas').value,
        sumber_dana_swadaya: document.getElementById('modal-sumber-dana-swadaya').value,
        anggaran: rincianAnggaran,
        total_anggaran: parseFloat(modalTotalAnggaranDisplay.textContent.replace(/[^0-9]/g, '')),
    };

    try {
        if (currentEditId) {
            await db.collection('programs').doc(currentEditId).update(programData);
            modalFormMessage.textContent = 'Berhasil diperbarui!';
        } else {
            programData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('programs').add(programData);
            modalFormMessage.textContent = 'Berhasil disimpan!';
        }
        
        modalFormMessage.classList.add('success');
        loadAllPrograms();
        setTimeout(() => { closeModal(); }, 1500);
    } catch (error) {
        console.error("Error menyimpan data:", error);
        modalFormMessage.textContent = 'Gagal menyimpan data.';
        modalFormMessage.classList.add('error');
    }
});
