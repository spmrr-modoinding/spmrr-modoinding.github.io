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

// DATA STRUKTUR PROGRAM KERJA
const programStruktur = {
    "BIDANG I : MENJAGA PERSEKUTUAN DAN KEPEMIMPINAN YANG MELAYANI": ["1. Menata Struktur dan Manajemen Pastoral Paroki", "2. Menanamkan Dalam Diri Calon Pastor / Imam Pola Kepemimpinan Pastor yang Melayani, Kolegial, Transparan, Suka Mengunjungi Keluarga, Menjadi Mediator Dalam Konflik, dan Memahami manajemen Pastoral.", "3. Mengembangkan Sistem Pembinaan Berkelanjutan Bagi Para Imam / Pastor Untuk Menerapkan Pola Kepemimpinan Pastor yang Melayani, Kolegial, Transparan, Suka Mengunjungi Keluarga, Menjadi Mediator Dalam Konflik, dan Memahami Manajemen Pastoral.", "4. Menghidupkan Spritualitas KBG Sebagai Cara Hidup Mengumat yang Bercorak Ministerial / Kolegial dan Sinergis Dalam Persekutuan Wilayah Rohani dan Kelompok Kategorial", "5. Mengembangkan Situasi dan Semangat Hidup Kekeluargaan dan Persaudaraan", "6. Mempersiapkan Pemekaran Keuskupan Baru"],
    "BIDANG II : Menjaga Perbendaharaan Iman": ["7. Memperkuat Sistem dan Peran Seksi Pewartaan / Katekese Paroki", "8. Menyusun Modul Seksi Pewartaan/Katekese Paroki", "9. Kebutuhan: Meningkatkan Katekese Untuk Menunjang Kegiatan Pewartaan dan Pendalaman Iman di Tingkat Paroki", "10. Menata Kursus Perkawinan, Teologi Dasar, Kitab Suci Dasar, Liturgi Dasar, Untuk Umat (Teritorial & Kategorial)", "11. Menyiapkan dan Mengadakan Pembinaan Tenaga Katekese: Katekis, Para Calon Imam, Para Imam & Biarawan Biarawati", "12. Menyiapkan Sarana & Prasarana Katekese"],
    "BIDANG III : Pelayanan Sabda Dan Sakramen-Sakramen": ["13. Mempekuat Seksi Liturgi Paroki", "14. Menyusun Pedoman Liturgi Sakramen & Peribadatan Pada Umumnya", "15. Meningkatkan Kesadaran & Pentingnya Faktor Keteladanan & Kompetensi Para Pemimpin Liturgi Dalam Melaksanakan Liturgi Yang Benar & Sesuai Aturan", "16. Melengkapi Sarana & Prasarana Liturgi", "17. Mengembangkan Pendidikan & Pemahaman Tentang Musik Liturgi", "18. Mengembangkan Pendidikan & Pemahaman Tentang Inkulturasi"],
    "BIDANG IV : Memajukan Martabat & Peran Kaum Awam Yang Khas Dalam Perutusan Gereja": ["19. Mengembangkan Pembinaan Keluarga Secara Integral", "20. Membina & Memberdayakan Kerasulan Awam Untuk Membantu Karya Pelayanan Paroki", "21. Menanamkan Nilai Unitas & Solidaritas Antara Kaum Awam & Para Pelayan Tertahbis Dalam Semangat Cinta Kasih", "22. Memberdayakan Kualitas Kehidupan Sosial Ekonomi Umat", "23. Mengaktualisasikan Keberpihakan Kepada Kaum Miskin , Marjinal, & Yang Terbuang Berbasis Pemberdayaan Semua Potensi Paroki & Kebijakan Untuk Mengangkat Harkat & Martabat Mereka", "24. Mengembangkan Kualitas & Relasi Antar Umat Beragama di Tingkat Paroki", "25. Meningkatkan Keberpihakan Terhadap Pelestarian Lingkungan"],
    "BIDANG V : Pendidikan Katolik": ["26. Memberdayakan Kelembagaan & Meningkatkan Mutu Manajemen Institusi Pendidkan YPK (Sekolah)", "27. Memberdayakan Kelembagaan & Meningkatkan Mutu Manajemen YPTKKM & Institusi Pendidikan Yang Diselenggarakan", "28. Memberdayakan Kelembagaan & Meningkatkan Mutu Manajemen YPTU De La Salle & Institusi Pendidikan Yang Diselenggarakan", "29. Pengembangan Kerjasama & Sinergitas Antaryayasan Pendidkan di Keuskupan Manado", "30. Pengembangan Pendidikan Katolik Bagi Siswa & Mahasiswa Yang Bersekolah Diluar Lembaga Pendidikan Katolik", "31. Memberi Perhatian Terhadap Pendidikan Usia Dini", "32. Mengembangkan Model Pendidkan Nonformal & Pendidkan Keterampilan"],
    "BIDANG VI : Pengelolaan Harta Benda Gereja": ["33. Menyusun Pedoman Pengelolaan Harta Benda Gereja Yang Mencakup Pedoman Keuangan Serta Tugas Pokok, Tanggung Jawab, & Fungsi Dewan Keuangan Keuskupan, Badan Amal & Milik Keuskupan, Prokur & Komisi Pembangunan", "34. Membangun Sinergitas Antar Badan Pengelola Harta Benda Gereja Di Tingkat Paroki", "35. Mengembangkan Kompetensi, Sistem Kerja, & Sinergitas BadanBadan Pengelola Harta Benda Gereja Mulai Dari Tingkat Paroki Sampai Tingkat Basis", "36. Membangun Sistem Informasi Keuangan Yang Transparan & Terintegrasi Antara Paroki & Kelompok Basis Umat Secata Timbal Balik", "37. Membangun Sistem Manajemen Aset", "38. Pemberdayaan Harta Benda Gereja Melalui Manajemen Investasi Demi Pembangunan Kualitas Kehidupan Umat."]
};

// ELEMEN DOM
const welcomeTitle = document.getElementById('welcome-title');
const logoutButton = document.getElementById('logout-button');
const printBtn = document.getElementById('print-btn');

// Program Kerja
const programsTableBody = document.getElementById('programs-table-body');
const tableFooter = document.getElementById('table-footer');
const addProgramBtn = document.getElementById('add-program-btn');
const programModal = document.getElementById('program-modal');
const programModalTitle = document.getElementById('program-modal-title');
const programForm = document.getElementById('program-form');
const modalBidang = document.getElementById('modal-bidang');
const modalSubBidang = document.getElementById('modal-sub-bidang');
const modalAddAnggaranBtn = document.getElementById('modal-add-anggaran-btn');
const modalAnggaranContainer = document.getElementById('modal-anggaran-items-container');
const modalTotalAnggaranDisplay = document.getElementById('modal-total-anggaran-display');
const programFormMessage = document.getElementById('program-form-message');
let currentEditProgramId = null;

// Pengumuman
const announcementsTableBody = document.getElementById('announcements-table-body');
const addAnnouncementBtn = document.getElementById('add-announcement-btn');
const announcementModal = document.getElementById('announcement-modal');
const announcementModalTitle = document.getElementById('announcement-modal-title');
const announcementForm = document.getElementById('announcement-form');
const announcementFormMessage = document.getElementById('announcement-form-message');
let currentEditAnnouncementId = null;

// Liturgi
const liturgiesTableBody = document.getElementById('liturgies-table-body');
const addLiturgyBtn = document.getElementById('add-liturgy-btn');
const liturgyModal = document.getElementById('liturgy-modal');
const liturgyModalTitle = document.getElementById('liturgy-modal-title');
const liturgyForm = document.getElementById('liturgy-form');
const liturgyFormMessage = document.getElementById('liturgy-form-message');
let currentEditLiturgyId = null;

// LOGIKA NAVIGASI TAB
const navTabs = document.querySelectorAll('.nav-tab-btn');
const managementSections = document.querySelectorAll('.management-section');
navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        navTabs.forEach(t => t.classList.remove('active'));
        managementSections.forEach(s => s.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.target).classList.add('active');
    });
});

// AUTH GUARD & INISIALISASI
auth.onAuthStateChanged(async (user) => {
    if (user) {
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists && userDoc.data().peran === 'admin') {
            welcomeTitle.textContent = `PROGRAM KERJA: ${userDoc.data().nama_unit}`;
            loadAllPrograms();
            loadAllAnnouncements();
            loadAllLiturgies();
            setupDropdowns();
        } else {
            alert('Anda tidak memiliki hak akses untuk halaman ini.');
            window.location.href = 'login.html';
        }
    } else {
        window.location.href = 'login.html';
    }
});

// --- FUNGSI-FUNGSI CRUD PROGRAM KERJA ---
const setupDropdowns = () => {
    modalBidang.innerHTML = '<option value="" disabled selected>Pilih Bidang...</option>';
    Object.keys(programStruktur).forEach(bidang => {
        const option = document.createElement('option');
        option.value = bidang;
        option.textContent = bidang;
        modalBidang.appendChild(option);
    });
    modalBidang.addEventListener('change', () => {
        const selectedBidang = modalBidang.value;
        const subBidangList = programStruktur[selectedBidang] || [];
        modalSubBidang.innerHTML = '<option value="" disabled selected>Pilih Sub-Kelompok...</option>';
        modalSubBidang.disabled = subBidangList.length === 0;
        subBidangList.forEach(sub => {
            const option = document.createElement('option');
            option.value = sub;
            option.textContent = sub;
            modalSubBidang.appendChild(option);
        });
    });
};

const loadAllPrograms = async () => {
    programsTableBody.innerHTML = `<tr><td colspan="17" style="text-align:center;">Memuat data program kerja...</td></tr>`;
    tableFooter.innerHTML = '';
    try {
        const snapshot = await db.collection('programs').get();
        if (snapshot.empty) {
            programsTableBody.innerHTML = '<tr><td colspan="17" style="text-align:center;">Belum ada data program kerja.</td></tr>';
            return;
        }
        const programs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        programs.sort((a, b) => {
            const timeA = a.createdAt ? a.createdAt.toMillis() : 0;
            const timeB = b.createdAt ? b.createdAt.toMillis() : 0;
            return (a.bidang || '').localeCompare(b.bidang || '') || (a.sub_bidang_title || '').localeCompare(b.sub_bidang_title || '') || (timeA - timeB);
        });
        const groupedData = {};
        programs.forEach(program => {
            const bidang = program.bidang || 'Lain-lain';
            const subBidang = program.sub_bidang_title || 'Tanpa Sub-Judul';
            if (!groupedData[bidang]) groupedData[bidang] = {};
            if (!groupedData[bidang][subBidang]) groupedData[bidang][subBidang] = [];
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
                    html += `<tr data-id="${program.id}"><td rowspan="${rowCount}">${program.pusat_paroki_stasi||'-'}</td><td rowspan="${rowCount}">${program.nama_unit||'-'}</td><td rowspan="${rowCount}">${program.nama_kegiatan||'-'}</td><td rowspan="${rowCount}">${program.sasaran||'-'}</td><td rowspan="${rowCount}">${program.indikator||'-'}</td><td rowspan="${rowCount}">${program.model_materi||'-'}</td><td rowspan="${rowCount}">${program.materi||'-'}</td><td rowspan="${rowCount}">${program.tempat_waktu||'-'}</td><td rowspan="${rowCount}">${program.pic||'-'}</td><td>${hasAnggaran?(program.anggaran[0].perincian||'-'):'-'}</td><td>${hasAnggaran?(program.anggaran[0].volume||'-'):'-'}</td><td>${hasAnggaran?(program.anggaran[0].satuan||'-'):'-'}</td><td>${hasAnggaran?(program.anggaran[0].harga_satuan||0).toLocaleString('id-ID'):'-'}</td><td>${hasAnggaran?(program.anggaran[0].jumlah||0).toLocaleString('id-ID'):'-'}</td><td rowspan="${rowCount}">${(program.total_anggaran||0).toLocaleString('id-ID')}</td><td rowspan="${rowCount}">${program.sumber_dana_kas||'-'}</td><td rowspan="${rowCount}">${program.sumber_dana_swadaya||'-'}</td><td rowspan="${rowCount}" class="no-print"><button class="action-btn-sm edit edit-program">Edit</button><button class="action-btn-sm delete delete-program">Hapus</button></td></tr>`;
                    if (hasAnggaran && program.anggaran.length > 1) {
                        for (let i = 1; i < program.anggaran.length; i++) {
                            const item = program.anggaran[i];
                            html += `<tr data-id="${program.id}"><td>${item.perincian||'-'}</td><td>${item.volume||'-'}</td><td>${item.satuan||'-'}</td><td>${(item.harga_satuan||0).toLocaleString('id-ID')}</td><td>${(item.jumlah||0).toLocaleString('id-ID')}</td></tr>`;
                        }
                    }
                });
            }
        }
        programsTableBody.innerHTML = html;
        tableFooter.innerHTML = `<tr><td colspan="14" style="text-align:right; font-weight:bold;">JUMLAH BUDGET</td><td style="font-weight:bold;">${grandTotal.toLocaleString('id-ID')}</td><td colspan="2"></td><td class="no-print"></td></tr>`;
    } catch (error) {
        console.error("Error memuat program kerja:", error);
        programsTableBody.innerHTML = `<tr><td colspan="17" style="text-align:center;">Gagal memuat data. Silakan cek konsol (F12).</td></tr>`;
    }
};

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

addProgramBtn.addEventListener('click', () => {
    currentEditProgramId = null;
    programModalTitle.textContent = 'Tambah Program Kerja Baru';
    programForm.reset();
    modalSubBidang.innerHTML = '<option value="" disabled selected>Pilih Bidang terlebih dahulu...</option>';
    modalSubBidang.disabled = true;
    modalAnggaranContainer.innerHTML = '';
    addModalAnggaranRow();
    calculateModalTotal();
    programFormMessage.textContent = '';
    programModal.classList.remove('hidden');
});

programsTableBody.addEventListener('click', async (e) => {
    const target = e.target;
    const row = target.closest('tr');
    if (!row) return;
    const docId = row.dataset.id;
    if (target.classList.contains('delete-program')) {
        if (confirm(`Apakah Anda yakin ingin menghapus program ini?`)) {
            await db.collection('programs').doc(docId).delete();
            loadAllPrograms();
        }
    }
    if (target.classList.contains('edit-program')) {
        const doc = await db.collection('programs').doc(docId).get();
        if (doc.exists) {
            const program = doc.data();
            currentEditProgramId = docId;
            programModalTitle.textContent = 'Edit Program Kerja';
            modalBidang.value = program.bidang || '';
            modalBidang.dispatchEvent(new Event('change'));
            setTimeout(() => { modalSubBidang.value = program.sub_bidang_title || ''; }, 100);
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
            programFormMessage.textContent = '';
            programModal.classList.remove('hidden');
        }
    }
});

programForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    programFormMessage.textContent = 'Menyimpan...';
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
        bidang: modalBidang.value,
        sub_bidang_title: modalSubBidang.value,
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
        if (currentEditProgramId) {
            await db.collection('programs').doc(currentEditProgramId).update(programData);
            programFormMessage.textContent = 'Berhasil diperbarui!';
        } else {
            programData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('programs').add(programData);
            programFormMessage.textContent = 'Berhasil disimpan!';
        }
        programFormMessage.classList.add('success');
        loadAllPrograms();
        setTimeout(() => programModal.classList.add('hidden'), 1500);
    } catch (error) {
        console.error("Error menyimpan data program:", error);
        programFormMessage.textContent = 'Gagal menyimpan data.';
        programFormMessage.classList.add('error');
    }
});

modalAnggaranContainer.addEventListener('click', (e) => { if (e.target.classList.contains('remove-btn')) { e.target.parentElement.remove(); calculateModalTotal(); }});
modalAnggaranContainer.addEventListener('input', calculateModalTotal);
modalAddAnggaranBtn.addEventListener('click', () => addModalAnggaranRow());


// --- FUNGSI-FUNGSI CRUD PENGUMUMAN ---
const loadAllAnnouncements = async () => {
    announcementsTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Memuat data pengumuman...</td></tr>`;
    try {
        const snapshot = await db.collection('announcements').orderBy('createdAt', 'desc').get();
        announcementsTableBody.innerHTML = snapshot.empty ? '<tr><td colspan="5" style="text-align:center;">Belum ada pengumuman.</td></tr>' : snapshot.docs.map(doc => {
            const ann = doc.data();
            return `<tr data-id="${doc.id}"><td>${ann.judul||'-'}</td><td>${ann.tanggal||''}${ann.jam ? ' | '+ann.jam : ''}</td><td>${ann.lokasi||'-'}</td><td>${ann.catatan||'-'}</td><td class="no-print"><button class="action-btn-sm edit edit-announcement">Edit</button><button class="action-btn-sm delete delete-announcement">Hapus</button></td></tr>`;
        }).join('');
    } catch (error) {
        console.error("Error memuat pengumuman:", error);
        announcementsTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Gagal memuat data.</td></tr>';
    }
};

addAnnouncementBtn.addEventListener('click', () => {
    currentEditAnnouncementId = null;
    announcementModalTitle.textContent = 'Tambah Pengumuman Baru';
    announcementForm.reset();
    announcementFormMessage.textContent = '';
    announcementModal.classList.remove('hidden');
});

announcementsTableBody.addEventListener('click', async (e) => {
    const target = e.target;
    const row = target.closest('tr');
    if (!row) return;
    const docId = row.dataset.id;
    if (target.classList.contains('edit-announcement')) {
        const doc = await db.collection('announcements').doc(docId).get();
        if (doc.exists) {
            const ann = doc.data();
            currentEditAnnouncementId = docId;
            announcementModalTitle.textContent = 'Edit Pengumuman';
            document.getElementById('ann-judul').value = ann.judul || '';
            document.getElementById('ann-tanggal').value = ann.tanggal || '';
            document.getElementById('ann-jam').value = ann.jam || '';
            document.getElementById('ann-lokasi').value = ann.lokasi || '';
            document.getElementById('ann-catatan').value = ann.catatan || '';
            announcementFormMessage.textContent = '';
            announcementModal.classList.remove('hidden');
        }
    }
    if (target.classList.contains('delete-announcement')) {
        if (confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
            await db.collection('announcements').doc(docId).delete();
            loadAllAnnouncements();
        }
    }
});

announcementForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    announcementFormMessage.textContent = 'Menyimpan...';
    const announcementData = {
        judul: document.getElementById('ann-judul').value,
        tanggal: document.getElementById('ann-tanggal').value,
        jam: document.getElementById('ann-jam').value,
        lokasi: document.getElementById('ann-lokasi').value,
        catatan: document.getElementById('ann-catatan').value,
    };
    try {
        if (currentEditAnnouncementId) {
            await db.collection('announcements').doc(currentEditAnnouncementId).update(announcementData);
        } else {
            announcementData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('announcements').add(announcementData);
        }
        announcementFormMessage.textContent = 'Berhasil disimpan!';
        announcementFormMessage.classList.add('success');
        loadAllAnnouncements();
        setTimeout(() => announcementModal.classList.add('hidden'), 1000);
    } catch (error) {
        console.error("Error menyimpan pengumuman:", error);
        announcementFormMessage.textContent = 'Gagal menyimpan data.';
        announcementFormMessage.classList.add('error');
    }
});


// --- FUNGSI-FUNGSI CRUD LITURGI ---
const loadAllLiturgies = async () => {
    liturgiesTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Memuat data liturgi...</td></tr>`;
    try {
        const snapshot = await db.collection('liturgies').orderBy('createdAt', 'desc').get();
        if (snapshot.empty) {
            liturgiesTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Belum ada data liturgi.</td></tr>';
            return;
        }
        let html = '';
        snapshot.forEach(doc => {
            const lit = doc.data();
            const statusClass = lit.isCurrent ? 'active' : 'archived';
            const statusText = lit.isCurrent ? 'Aktif' : 'Arsip';
            const makeCurrentBtnDisabled = lit.isCurrent ? 'disabled' : '';
            html += `<tr data-id="${doc.id}"><td>${lit.tanggal||'-'}</td><td>${lit.peringatan||'-'}</td><td>${lit.warna||'-'}</td><td><span class="status-badge ${statusClass}">${statusText}</span></td><td class="no-print"><button class="action-btn-sm edit make-current-btn" data-id="${doc.id}" ${makeCurrentBtnDisabled}>Jadikan Aktif</button><button class="action-btn-sm edit edit-liturgy">Edit</button><button class="action-btn-sm delete delete-liturgy">Hapus</button></td></tr>`;
        });
        liturgiesTableBody.innerHTML = html;
    } catch (error) {
        console.error("Error memuat liturgi:", error);
        liturgiesTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Gagal memuat data.</td></tr>';
    }
};

addLiturgyBtn.addEventListener('click', () => {
    currentEditLiturgyId = null;
    liturgyModalTitle.textContent = 'Tambah Liturgi Baru';
    liturgyForm.reset();
    liturgyFormMessage.textContent = '';
    liturgyModal.classList.remove('hidden');
});

liturgyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    liturgyFormMessage.textContent = 'Menyimpan...';
    const liturgyData = {
        tanggal: document.getElementById('lit-tanggal').value,
        peringatan: document.getElementById('lit-peringatan').value,
        warna: document.getElementById('lit-warna').value,
        bacaan1: document.getElementById('lit-bacaan1').value,
        bacaan2: document.getElementById('lit-bacaan2').value,
        mazmur: document.getElementById('lit-mazmur').value,
        injil: document.getElementById('lit-injil').value,
        renungan: document.getElementById('lit-renungan').value,
    };
    try {
        if (currentEditLiturgyId) {
            await db.collection('liturgies').doc(currentEditLiturgyId).update(liturgyData);
        } else {
            liturgyData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            liturgyData.isCurrent = false;
            await db.collection('liturgies').add(liturgyData);
        }
        liturgyFormMessage.textContent = 'Berhasil disimpan!';
        liturgyFormMessage.classList.add('success');
        loadAllLiturgies();
        setTimeout(() => liturgyModal.classList.add('hidden'), 1000);
    } catch (error) {
        console.error("Error menyimpan liturgi:", error);
        liturgyFormMessage.textContent = 'Gagal menyimpan data.';
        liturgyFormMessage.classList.add('error');
    }
});

liturgiesTableBody.addEventListener('click', async (e) => {
    const target = e.target;
    const row = target.closest('tr');
    if (!row) return;
    const docId = row.dataset.id;
    if (target.classList.contains('edit-liturgy')) {
        const doc = await db.collection('liturgies').doc(docId).get();
        if (doc.exists) {
            const lit = doc.data();
            currentEditLiturgyId = docId;
            liturgyModalTitle.textContent = 'Edit Liturgi';
            document.getElementById('lit-tanggal').value = lit.tanggal || '';
            document.getElementById('lit-peringatan').value = lit.peringatan || '';
            document.getElementById('lit-warna').value = lit.warna || '';
            document.getElementById('lit-bacaan1').value = lit.bacaan1 || '';
            document.getElementById('lit-bacaan2').value = lit.bacaan2 || '';
            document.getElementById('lit-mazmur').value = lit.mazmur || '';
            document.getElementById('lit-injil').value = lit.injil || '';
            document.getElementById('lit-renungan').value = lit.renungan || '';
            liturgyFormMessage.textContent = '';
            liturgyModal.classList.remove('hidden');
        }
    }
    if (target.classList.contains('delete-liturgy')) {
        if (confirm('Apakah Anda yakin ingin menghapus data liturgi ini?')) {
            await db.collection('liturgies').doc(docId).delete();
            loadAllLiturgies();
        }
    }
    if (target.classList.contains('make-current-btn')) {
        target.textContent = "Memproses...";
        target.disabled = true;
        const batch = db.batch();
        const currentActiveQuery = await db.collection('liturgies').where('isCurrent', '==', true).get();
        currentActiveQuery.forEach(doc => {
            batch.update(doc.ref, { isCurrent: false });
        });
        const newActiveRef = db.collection('liturgies').doc(docId);
        batch.update(newActiveRef, { isCurrent: true });
        await batch.commit();
        loadAllLiturgies();
    }
});


// --- EVENT LISTENERS UMUM ---
logoutButton.addEventListener('click', () => auth.signOut().then(() => { window.location.href = 'index.html' }));
printBtn.addEventListener('click', () => window.print());

document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => document.getElementById(btn.dataset.target).classList.add('hidden'));
});
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.add('hidden') });
});

// INISIALISASI PARTICLES.JS
if (typeof particlesJS !== 'undefined') {
  particlesJS("particles-js", {
      particles: { number: { value: 80 }, color: { value: "#004a99" }, shape: { type: "circle" }, opacity: { value: 0.5, anim: { enable: false } }, size: { value: 3, random: true }, line_linked: { enable: true, distance: 150, color: "#004a99", opacity: 0.4, width: 1 }, move: { enable: true, speed: 6 } },
      interactivity: { events: { onhover: { enable: true, mode: "repulse" } } },
      retina_detect: true
  });
}