/*
 * script.js (Versi Final & Rapi - Migrasi ke Firebase v9)
 * File skrip utama untuk halaman publik Paroki.
 *
 * * PERUBAHAN (FULL FIX v4 - V2.0):
 * - (B11, B44) Migrasi penuh ke Firebase v9 SDK (modular).
 * - (A8) Menambahkan Kalender Agenda & Kalender Liturgi (FullCalendar).
 * - (B15, B42) Menambahkan DOMPurify.sanitize() untuk keamanan XSS.
 * - (B25) Menambahkan logika pencarian untuk Pustaka Doa.
 * - (A9) Menambahkan fungsi Ekspor TPE ke PDF (html2pdf.js).
 * - (A11) Menambahkan fungsi Dark Mode (toggle) & penyimpanan localStorage.
 * - (B3, B17) Menggabungkan setFeedback() + aria.
 * - (A6) Memperbarui logika setupNavigation untuk atribut aria-.
 */

// [PERUBAHAN] Impor Firebase v9 (Poin B11)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, limit, where, documentId } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js"; // [PERUBAHAN] Impor config

// =================================================================
// INISIALISASI & VARIABEL GLOBAL
// =================================================================

// [PERUBAHAN] Inisialisasi Firebase v9
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let publicUmatChart = null; 
const loadedTabs = new Set(); 
let liturgicalCalendar = null;
let agendaCalendar = null;
let eventDetailModal = null;

// Inisialisasi Modal Bootstrap
if (document.getElementById('eventDetailModal')) {
    eventDetailModal = new bootstrap.Modal(document.getElementById('eventDetailModal'));
}

// Panggil fungsi Dark Mode segera untuk menghindari kedipan (FOUC)
loadTheme();

// Inisialisasi library pihak ketiga
GLightbox({ selector: '.glightbox' });
particlesJS.load('particles-js', 'assets/particles.json', () => {});


// =================================================================
// FUNGSI BANTU (HELPERS)
// =================================================================

const setFeedback = (container, type, message) => {
    if (!container) return;
    let html = '';
    switch (type) {
        case 'loading':
            html = `<div class="feedback-container" role="status" aria-live="polite"><div class="spinner"></div><p>${message}</p></div>`;
            break;
        case 'error':
            html = `<div class"error-alert" role="alert"><strong>Gagal Memuat:</strong> ${message}</div>`;
            break;
        case 'empty':
            html = `<div class="feedback-container" role="status" aria-live="polite"><p>${message}</p></div>`;
            break;
    }
    container.innerHTML = html;
};

// =================================================================
// FUNGSI FITUR V2.0 (DARK MODE & PDF)
// =================================================================

/**
 * Menerapkan tema (Dark/Light) dari localStorage atau preferensi sistem (Poin A11)
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let currentTheme = 'light'; // Default
    
    if (savedTheme) {
        currentTheme = savedTheme;
    } else if (systemPrefersDark) {
        currentTheme = 'dark';
    }
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    // [PERBAIKAN] Ganti body, bukan html, untuk dark mode
    document.body.setAttribute('data-theme', currentTheme);
}

/**
 * Mengganti tema dan menyimpannya di localStorage (Poin A11)
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = (currentTheme === 'light') ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // [PERBAIKAN] Update warna chart jika ada
    if (publicUmatChart) {
        const newColor = (newTheme === 'dark') ? '#e0e0e0' : '#333';
        publicUmatChart.options.scales.y.ticks.color = newColor;
        publicUmatChart.options.scales.x.ticks.color = newColor;
        publicUmatChart.options.plugins.title.color = newColor;
        publicUmatChart.update();
    }
}

/**
 * Mencetak TPE ke PDF menggunakan html2pdf (Poin A9)
 */
function printTPE() {
    const printBtn = document.getElementById('print-tpe-btn');
    const originalText = printBtn.innerHTML;
    
    printBtn.disabled = true;
    printBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Mengunduh...';

    const currentTpe = document.getElementById('current-week-tpe');
    const nextTpe = document.getElementById('next-week-tpe');
    
    let elementToPrint, perayaanNama;
    
    if (currentTpe.style.display !== 'none' && currentTpe.querySelector('.tpe-container-final')) {
        elementToPrint = currentTpe.querySelector('.tpe-container-final');
        perayaanNama = elementToPrint.querySelector('.perayaan').textContent.trim();
    } else if (nextTpe.style.display !== 'none' && nextTpe.querySelector('.tpe-container-final')) {
        elementToPrint = nextTpe.querySelector('.tpe-container-final');
        perayaanNama = elementToPrint.querySelector('.perayaan').textContent.trim();
    } else {
        // Fallback jika salah satu tidak ada
        elementToPrint = currentTpe.querySelector('.tpe-container-final') || nextTpe.querySelector('.tpe-container-final');
        if (!elementToPrint) {
             printBtn.disabled = false;
             printBtn.innerHTML = "Gagal, TPE tidak ada";
             return;
        }
        perayaanNama = elementToPrint.querySelector('.perayaan').textContent.trim();
    }

    const filename = `TPE - ${perayaanNama}.pdf`;

    const opt = {
        margin:       10,
        filename:     filename,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(elementToPrint).save().then(() => {
        printBtn.disabled = false;
        printBtn.innerHTML = originalText;
    }).catch((err) => {
        console.error("Gagal membuat PDF:", err);
        printBtn.disabled = false;
        printBtn.innerHTML = "Gagal, Coba Lagi";
    });
}

// =================================================================
// FUNGSI-FUNGSI UTAMA PEMUAT DATA (VERSI FIREBASE v9)
// =================================================================

const createTpeHtml = (data) => {
    if (!data) {
        return '<div class="alert alert-warning text-center">Tata Perayaan Ekaristi belum tersedia.</div>';
    }

    const jadwalMisa = data.jadwal_misa || [];
    const tableRows = jadwalMisa.length > 0 ? jadwalMisa.map(misa => `
        <tr>
            <td data-label="Jam">${misa.jam || '-'}</td>
            <td data-label="Tempat">${misa.tempat || '-'}</td>
            <td data-label="Perayaan">${misa.perayaan || '-'}</td>
            <td data-label="Pelayan">${misa.pelayan || '-'}</td>
        </tr>
    `).join('') : '<tr><td colspan="4" class="text-center">Jadwal Misa belum tersedia.</td></tr>';
    
    const jadwalHtml = `
        <h3 class="tpe-content-title">Jadwal Misa & Tema</h3>
        <div class="table-scroll-wrapper">
            <table class="jadwal-misa-table">
                <thead><tr><th>Jam</th><th>Tempat</th><th>Perayaan</th><th>Pelayan</th></tr></thead>
                <tbody>${tableRows}</tbody>
            </table>
        </div>
        ${data.tema ? `<p class="text-center fst-italic mt-3"><strong>Tema:</strong> "${data.tema}"</p>` : ''}
    `;
    
    const tpe = data.tata_perayaan || {};
    
    const formatDoaUmat = (htmlContent) => {
        if (!htmlContent || htmlContent.trim() === '') return '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = DOMPurify.sanitize(htmlContent, {USE_PROFILES: {html: true}});
        tempDiv.querySelectorAll('p').forEach(p => {
            const text = p.textContent.trim();
            if (text.startsWith('P:') || text.startsWith('I:')) p.classList.add('doa-umat-baris', 'pemimpin');
            else if (text.startsWith('U:')) p.classList.add('doa-umat-baris', 'umat');
            else p.classList.add('doa-umat-baris');
        });
        return `<div class="section-content">${tempDiv.innerHTML}</div>`;
    };

    const createSection = (title, content) => {
        if (!content || content.trim() === '') return '';
        const contentHtml = (title === 'Doa Umat') 
            ? formatDoaUmat(content) 
            : `<div class="section-content">${DOMPurify.sanitize(content, {USE_PROFILES: {html: true}})}</div>`;
        return `<div class="tpe-section"><h4 class="section-title"><i class="bi bi-cross"></i> ${title}</h4>${contentHtml}</div>`;
    };
    
    const tpeHtml = `
        <hr class="my-4">
        <h3 class="tpe-content-title">Tata Perayaan Ekaristi</h3>
        ${createSection('Antifon Pembuka', tpe.antifon_pembuka)}
        ${createSection('Doa Kolekta', tpe.doa_kolekta)}
        ${createSection('Bacaan I', tpe.bacaan_1)}
        ${createSection('Mazmur Tanggapan', tpe.mazmur_tanggapan)}
        ${createSection('Bacaan II', tpe.bacaan_2)}
        ${createSection('Bait Pengantar Injil', tpe.bait_pengantar_injil)}
        ${createSection('Bacaan Injil', tpe.bacaan_injil)}
        ${createSection('Doa Umat', tpe.doa_umat)}
        ${createSection('Doa Atas Persembahan', tpe.doa_persembahan)}
        ${createSection('Antifon Komuni', tpe.antifon_komuni)}
        ${createSection('Doa Sesudah Komuni', tpe.doa_sesudah_komuni)}
    `;

    return `<div class="tpe-container-final">
                <div class="tpe-header">
                    <p class="tanggal">${data.tanggal_display || ''}</p>
                    <h2 class="perayaan">${data.nama_perayaan || 'Tata Perayaan Ekaristi'}</h2>
                    <p class="tahun-liturgi">${data.tahun_liturgi || ''}</p>
                </div>
                <div class="tpe-content">${jadwalHtml}${tpeHtml}</div>
            </div>`;
};
    
const loadWeeklyLiturgy = async () => {
    const currentContainer = document.getElementById('current-week-tpe');
    const nextContainer = document.getElementById('next-week-tpe');
    const controlsContainer = document.getElementById('tpe-preview-controls');
    const printWrapper = document.querySelector('.tpe-print-wrapper');
    if (!currentContainer) return;
    
    setFeedback(currentContainer, 'loading', 'Memuat Jadwal & Tata Perayaan Ekaristi...');
    if (printWrapper) printWrapper.style.display = 'none';

    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToLastSaturday = (dayOfWeek + 1) % 7;
    const lastSaturday = new Date(now);
    lastSaturday.setDate(now.getDate() - diffToLastSaturday);
    lastSaturday.setHours(0, 1, 0, 0);
    const targetDateString = lastSaturday.toISOString().split('T')[0];

    try {
        // [PERUBAHAN] Sintaks v9 (Poin B11)
        const tpeRef = collection(db, 'tata_perayaan_mingguan');
        const q = query(tpeRef, 
            where(documentId(), '>=', targetDateString), 
            orderBy(documentId(), 'asc'), 
            limit(2)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            setFeedback(currentContainer, 'error', 'Tata Perayaan Ekaristi untuk minggu ini belum tersedia.');
            if (printWrapper) printWrapper.style.display = 'none';
            return;
        }

        const currentData = snapshot.docs[0]?.data();
        currentContainer.innerHTML = createTpeHtml(currentData);
        if (printWrapper) printWrapper.style.display = 'block';

        const nextData = snapshot.docs[1]?.data();
        if (nextData) {
            nextContainer.innerHTML = createTpeHtml(nextData);
            controlsContainer.style.display = 'block';
            document.getElementById('tpe-preview-btn').onclick = () => {
                const isShowingPreview = nextContainer.style.display === 'block';
                nextContainer.style.display = isShowingPreview ? 'none' : 'block';
                currentContainer.style.display = isShowingPreview ? 'block' : 'none';
                document.getElementById('tpe-preview-btn').innerHTML = isShowingPreview ? 'Lihat Pratinjau Minggu Depan &gt;&gt;' : '&lt;&lt; Kembali ke Minggu Ini';
            };
        } else {
            controlsContainer.style.display = 'none';
        }

    } catch (error) {
        console.error("Gagal memuat TPE:", error);
        setFeedback(currentContainer, 'error', `Gagal memuat data. (${error.message})`);
        if (printWrapper) printWrapper.style.display = 'none';
    }
};

/**
 * [PERUBAHAN] Inisialisasi Kalender Agenda dari Firestore (Poin A8)
 */
const initializeAgendaCalendar = () => {
    const calendarEl = document.getElementById('agenda-calendar-container');
    if (!calendarEl) return;
    
    if (typeof FullCalendar === 'undefined') {
        setFeedback(calendarEl, 'error', 'Library kalender gagal dimuat.');
        return;
    }
    
    if (agendaCalendar) {
        agendaCalendar.render();
        return;
    }

    agendaCalendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'id',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,listWeek'
        },
        buttonText: {
            today: 'Hari Ini',
            month: 'Bulan',
            week: 'Minggu',
            list: 'Daftar'
        },
        height: 'auto',
        
        // [PERUBAHAN] Ambil events dari Firestore v9 (Poin B11)
        events: async (fetchInfo, successCallback, failureCallback) => {
            try {
                const annRef = collection(db, 'announcements');
                const snapshot = await getDocs(annRef);
                const events = snapshot.docs.map(doc => {
                    const item = doc.data();
                    
                    let startDateTime = item.tanggal;
                    if (item.tanggal && item.jam) {
                        startDateTime = `${item.tanggal}T${item.jam}`;
                    }
                    
                    return {
                        title: item.judul,
                        start: startDateTime,
                        allDay: !item.jam,
                        extendedProps: {
                            lokasi: item.lokasi || '-',
                            catatan: item.catatan || 'Tidak ada catatan.',
                            jam: item.jam || 'Seharian'
                        }
                    };
                });
                successCallback(events);
            } catch (error) {
                console.error("Gagal memuat agenda: ", error);
                failureCallback(error);
                setFeedback(calendarEl, 'error', `Gagal memuat data agenda. (${error.message})`);
            }
        },
        
        eventClick: function(info) {
            const props = info.event.extendedProps;
            
            document.getElementById('eventDetailModalLabel').innerText = info.event.title;
            
            let tanggalEvent = info.event.start.toLocaleDateString('id-ID', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            });
            
            document.getElementById('eventDetailModalBody').innerHTML = DOMPurify.sanitize(`
                <p>
                    <strong><i class="bi bi-calendar-event me-2"></i>Kapan:</strong><br>
                    ${tanggalEvent}
                    <br>
                    <strong><i class="bi bi-clock me-2"></i>Jam:</strong> ${props.jam}
                </p>
                <p>
                    <strong><i class="bi bi-geo-alt-fill me-2"></i>Lokasi:</strong><br>
                    ${props.lokasi}
                </p>
                <hr>
                <p><strong><i class="bi bi-info-circle-fill me-2"></i>Catatan:</strong></p>
                <div>${props.catatan}</div>
            `);
            
            if (eventDetailModal) {
                eventDetailModal.show();
            }
        }
    });

    agendaCalendar.render();
};

const loadPastorStatus = async () => {
    const container = document.querySelector('#pastor');
    if (!container) return;
    setFeedback(container, 'loading', 'Memuat status pastor...');
    try {
        // [PERUBAHAN] Sintaks v9 (Poin B11)
        const pastorsRef = collection(db, 'pastors');
        const q = query(pastorsRef, orderBy('order'));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            container.innerHTML = '<h2>Kehadiran Pastor Hari Ini</h2><p>Data pastor belum tersedia.</p>';
            return;
        }
        const statusItems = snapshot.docs.map(doc => {
            const p = doc.data();
            const indicatorClass = p.status === 'Di Tempat' ? 'green' : 'red';
            return `<div><img alt="${p.name}" class="pastor-photo" src="${p.photoUrl}" /><p>${p.name}</p><span class="indicator ${indicatorClass}">${p.status}</span></div>`;
        }).join('');
        container.innerHTML = `<h2>Kehadiran Pastor Hari Ini</h2><div class="pastor-status">${statusItems}</div><p class="mt-3" style="font-size: 0.9rem; color: #555;">Keterangan:<br/><span class="indicator green" style="padding: 2px 10px;">Di Tempat</span> = Pastor berada di pastoran.<br/><span class="indicator red" style="padding: 2px 10px;">Lainnya</span> = Pastor sedang pelayanan di luar, cuti, atau sakit.</p>`;
    } catch (error) {
        console.error("Gagal memuat status pastor:", error);
        setFeedback(container, 'error', `Gagal memuat status pastor. (${error.message})`);
    }
};

const loadPublicStats = async () => {
    const tableContainer = document.querySelector('#statistik-table-container');
    const mainContainer = document.querySelector('#statistik');
    if (!tableContainer || !mainContainer) return;
    setFeedback(tableContainer, 'loading', 'Memuat statistik umat...');
    try {
        // [PERUBAHAN] Sintaks v9 (Poin B11)
        const statsRef = collection(db, 'parish_stats');
        const q = query(statsRef, orderBy('order'));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
            mainContainer.innerHTML = '<h2>Statistik Umat</h2><p>Data belum tersedia.</p>';
            return;
        }
        let totalKK = 0, totalLaki = 0, totalPerempuan = 0;
        const tableRows = snapshot.docs.map(doc => {
            const w = doc.data();
            const jumlah = (w.laki_laki || 0) + (w.perempuan || 0);
            totalKK += w.kk || 0;
            totalLaki += w.laki_laki || 0;
            totalPerempuan += w.perempuan || 0;
            return `<tr><td>${w.order}</td><td>${w.name}</td><td>${w.kk}</td><td>${w.laki_laki}</td><td>${w.perempuan}</td><td>${jumlah}</td></tr>`;
        }).join('');
        
        const totalJiwa = totalLaki + totalPerempuan;
        const totalRow = `<tfoot><tr><td colspan="2">Jumlah</td><td>${totalKK}</td><td>${totalLaki}</td><td>${totalPerempuan}</td><td>${totalJiwa}</td></tr></tfoot>`;
        tableContainer.innerHTML = `<table class="stats-table"><thead><tr><th>No</th><th>Nama Wilayah</th><th>KK</th><th>Laki-laki</th><th>Perempuan</th><th>Jumlah Jiwa</th></tr></thead><tbody>${tableRows}</tbody>${totalRow}</table>`;

        const labels = snapshot.docs.map(doc => doc.data().name);
        const data = snapshot.docs.map(doc => (doc.data().laki_laki || 0) + (doc.data().perempuan || 0));
        const ctx = document.getElementById('public-umat-chart').getContext('2d');
        if (publicUmatChart) { publicUmatChart.destroy(); }
        
        // [PERBAIKAN] Ambil warna teks dari CSS Variables untuk Dark Mode
        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color') || '#333';

        publicUmatChart = new Chart(ctx, {
            type: 'bar',
            data: { labels: labels, datasets: [{ label: 'Jumlah Jiwa', data: data, backgroundColor: 'rgba(0, 74, 153, 0.7)', borderColor: 'rgba(0, 74, 153, 1)', borderWidth: 1 }] },
            options: { 
                responsive: true, 
                maintainAspectRatio: false, 
                scales: { 
                    y: { 
                        beginAtZero: true,
                        ticks: { color: textColor }
                    },
                    x: {
                        ticks: { color: textColor }
                    }
                }, 
                plugins: { 
                    legend: { display: false }, 
                    title: { display: true, text: 'Visualisasi Jumlah Umat per Wilayah/Stasi', color: textColor } 
                } 
            }
        });
    } catch (error) {
        console.error("Gagal memuat statistik umat:", error);
        setFeedback(mainContainer, 'error', `Gagal memuat data. (${error.message})`);
    }
};

const loadSejarahPausFromJson = async () => {
    const container = document.querySelector('#sejarah-paus-container');
    if (!container) return;
    setFeedback(container, 'loading', 'Memuat sejarah Paus...');
    try {
        const response = await fetch('sejarah_paus.json');
        if (!response.ok) throw new Error(`Gagal memuat file: ${response.statusText}`);
        const allPopes = await response.json();

        const renderTable = (popes) => {
            const tableBody = document.getElementById('pope-table-body');
            if (!tableBody) return;
            tableBody.innerHTML = popes.map(pope => `<tr><td data-label="No.">${pope.urutan}</td><td data-label="Nama Paus"><strong>${pope.nama}</strong><small class="pope-latin-name">${pope.nama_latin}</small></td><td data-label="Masa Jabatan">${pope.masa_jabatan}</td><td data-label="Negara Asal">${pope.negara_asal || '-'}</td><td data-label="Catatan">${pope.catatan || '-'}</td></tr>`).join('');
        };

        container.innerHTML = `<div class="pope-search-wrapper"><input type="text" id="popeSearchInput" class="form-control" placeholder="Cari Paus (nama, tahun, negara)..."></div><div class="pope-table-wrapper"><table class="pope-table"><thead><tr><th>No.</th><th>Nama Paus</th><th>Masa Jabatan</th><th>Negara Asal</th><th>Catatan Singkat</th></tr></thead><tbody id="pope-table-body"></tbody></table></div>`;
        renderTable(allPopes);

        document.getElementById('popeSearchInput').addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filteredPopes = allPopes.filter(pope => 
                pope.nama.toLowerCase().includes(query) || 
                pope.nama_latin.toLowerCase().includes(query) || 
                pope.masa_jabatan.includes(query) || 
                (pope.negara_asal && pope.negara_asal.toLowerCase().includes(query))
            );
            renderTable(filteredPopes);
        });
    } catch (error) {
        console.error("Gagal memuat Sejarah Paus dari JSON:", error);
        setFeedback(container, 'error', `Pastikan file 'sejarah_paus.json' ada. (${error.message})`);
    }
};

const initializeLiturgicalCalendar = () => {
    const calendarEl = document.getElementById('kalender-container');
    if (!calendarEl) return;

    if (typeof FullCalendar === 'undefined') {
        setFeedback(calendarEl, 'error', 'Library kalender gagal dimuat.');
        return;
    }

    if (liturgicalCalendar) {
        liturgicalCalendar.render();
        return;
    }

    liturgicalCalendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'id', 
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,listWeek'
        },
        buttonText: {
            today: 'Hari Ini',
            month: 'Bulan',
            week: 'Minggu',
            list: 'Daftar'
        },
        height: 'auto',
        eventSources: [
            {
                url: 'kalender_liturgi_2025.json',
                failure: function() {
                    setFeedback(calendarEl, 'error', 'Gagal memuat data kalender_liturgi_2025.json');
                }
            }
        ],
        eventDataTransform: function(eventData) {
            let color = 'var(--blue-main)'; // Default
            let textColor = '#FFFFFF';
            const judul = eventData.judul || '';
            
            if (judul.startsWith('🔴')) {
                color = 'var(--red)';
            } else if (judul.startsWith('🟢')) {
                color = 'var(--green)';
            } else if (judul.startsWith('🟣')) {
                color = '#6f42c1'; 
            } else if (judul.startsWith('⚪')) {
                if (judul.includes('[P]') || judul.includes('[H]')) {
                     color = '#FFFFFF';
                     textColor = '#333333';
                }
            }

            return {
                title: judul.substring(2).trim(),
                start: eventData.tanggal,
                allDay: true,
                color: color,
                textColor: textColor,
                description: eventData.deskripsi
            };
        },
        eventMouseEnter: function(info) {
            if (info.event.extendedProps.description) {
                info.el.title = info.event.extendedProps.description;
            }
        }
    });

    liturgicalCalendar.render();
};
    
const loadPrayers = async () => {
    const listContainer = document.querySelector('#doa-list-container');
    const detailContainer = document.querySelector('#doa-detail-container');
    const doaList = document.querySelector('#doa-list');
    const doaWrapper = document.querySelector('#doa-wrapper');
    const searchInput = document.getElementById('doaSearchInput'); 

    if (!listContainer || !doaWrapper) return;

    detailContainer.classList.add('hidden');
    
    setFeedback(doaList, 'loading', 'Memuat daftar doa...');

    try {
        // [PERUBAHAN] Sintaks v9 (Poin B11)
        const prayersRef = collection(db, 'prayers');
        const q = query(prayersRef, orderBy('order'));
        const snapshot = await getDocs(q);

        const prayersDataFromDb = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                title: data.title,
                content: {
                    indonesia: data.content_indonesia,
                    latin: data.content_latin
                }
            };
        });

        if (prayersDataFromDb.length === 0) {
            setFeedback(doaList, 'empty', 'Data doa belum tersedia.');
            searchInput.style.display = 'none'; 
            return;
        }

        let currentPrayer = null;

        const renderPrayerList = (filterQuery = '') => {
            const query = filterQuery.toLowerCase();
            const filteredPrayers = prayersDataFromDb.filter(prayer => 
                prayer.title.toLowerCase().includes(query)
            );
            
            if (filteredPrayers.length === 0) {
                doaList.innerHTML = '<p class="text-center">Doa tidak ditemukan.</p>';
            } else {
                doaList.innerHTML = filteredPrayers.map(prayer => 
                    `<button type="button" class="list-group-item list-group-item-action">${prayer.title}</button>`
                ).join('');
            }
        };
        
        renderPrayerList();

        searchInput.addEventListener('input', (e) => {
            renderPrayerList(e.target.value);
        });
        
        const renderPrayerContent = (lang) => {
            if (currentPrayer) {
                const contentElement = document.querySelector('#doa-detail-content');
                const content = currentPrayer.content[lang] || '<p><em>Konten tidak tersedia untuk bahasa ini.</em></p>';
                contentElement.innerHTML = DOMPurify.sanitize(content, {USE_PROFILES: {html: true}});
                
                document.querySelectorAll('#doa-lang-selector button').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
            }
        };

        doaList.addEventListener('click', (e) => {
            if (e.target.matches('button.list-group-item-action')) {
                const clickedTitle = e.target.textContent.trim();
                currentPrayer = prayersDataFromDb.find(p => p.title === clickedTitle);
                if (currentPrayer) {
                    document.querySelector('#doa-detail-title').textContent = currentPrayer.title;
                    renderPrayerContent('indonesia');
                    
                    listContainer.classList.add('hidden');
                    detailContainer.classList.remove('hidden');
                }
            }
        });

        document.querySelector('#doa-back-btn').addEventListener('click', () => {
            detailContainer.classList.add('hidden');
            listContainer.classList.remove('hidden');
            currentPrayer = null;
        });

        document.querySelector('#doa-lang-selector').addEventListener('click', (e) => {
            if (e.target.matches('button')) {
                renderPrayerContent(e.target.dataset.lang);
            }
        });

    } catch (error) {
        console.error("Gagal memuat data doa dari Firestore:", error);
        setFeedback(doaList, 'error', `Daftar doa tidak dapat ditampilkan.`);
    }
};


// =================================================================
// MANAJEMEN NAVIGASI & UI
// =================================================================

function activateTab(tabId) {
    document.querySelectorAll('.tab-button').forEach(btn => {
        const isActive = btn.dataset.tab === tabId;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false'); 
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === tabId);
    });
    
    const sidebarMenu = document.getElementById('sidebarMenu');
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    
    if (window.innerWidth <= 768 && sidebarMenu.classList.contains('active')) {
        sidebarMenu.classList.remove('active');
        document.body.classList.remove('sidebar-open');
        sidebarToggleBtn.classList.remove('active');
        sidebarToggleBtn.setAttribute('aria-expanded', 'false');
    }
}

function setupEventListeners() {
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const printTpeBtn = document.getElementById('print-tpe-btn');

    if (sidebarToggleBtn && sidebarMenu) {
        sidebarToggleBtn.addEventListener('click', () => {
            const isActive = sidebarToggleBtn.classList.toggle('active');
            sidebarToggleBtn.setAttribute('aria-expanded', String(isActive));
            sidebarMenu.classList.toggle('active');
            document.body.classList.toggle('sidebar-open');
        });

        document.body.addEventListener('click', (event) => {
            if (window.innerWidth <= 768 && document.body.classList.contains('sidebar-open') && !sidebarMenu.contains(event.target) && !sidebarToggleBtn.contains(event.target) && !sidebarToggleBtn.contains(event.target.closest('.sidebar-toggle'))) {
                sidebarMenu.classList.remove('active');
                document.body.classList.remove('sidebar-open');
                sidebarToggleBtn.classList.remove('active');
                sidebarToggleBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    document.querySelectorAll('#sidebarMenu .tab-button[data-tab]').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const tabId = button.dataset.tab;
            activateTab(tabId); 

            if (!loadedTabs.has(tabId)) {
                console.log(`Memuat data untuk tab: ${tabId}`);
                switch (tabId) {
                    case 'agenda':
                        initializeAgendaCalendar();
                        break;
                    case 'pastor':
                        loadPastorStatus();
                        break;
                    case 'statistik':
                        loadPublicStats();
                        break;
                    case 'kalender':
                        initializeLiturgicalCalendar();
                        break;
                    case 'sejarah-paus':
                        loadSejarahPausFromJson();
                        break;
                    case 'doa':
                        loadPrayers();
                        break;
                }
                loadedTabs.add(tabId);
            }
            
            if (tabId === 'agenda' && agendaCalendar) {
                agendaCalendar.render();
            }
            if (tabId === 'kalender' && liturgicalCalendar) {
                liturgicalCalendar.render();
            }
        });
    });

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    if (printTpeBtn) {
        printTpeBtn.addEventListener('click', printTPE);
    }
}

function setupPreviewModal() {
    const previewModalEl = document.getElementById('previewModal');
    if (previewModalEl) {
        previewModalEl.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const pdfSrc = button.getAttribute('data-pdf-src');
            const formName = button.textContent.trim();
            
            document.getElementById('previewModalLabel').textContent = 'Pratinjau: ' + formName;
            document.getElementById('pdf-viewer').src = pdfSrc;
            const downloadBtn = document.getElementById('download-pdf-btn');
            downloadBtn.href = pdfSrc;
            downloadBtn.setAttribute('download', formName.replace(/\s+/g, '-') + '.pdf');
        });

        document.getElementById('print-pdf-btn').addEventListener('click', function () {
            const pdfViewer = document.getElementById('pdf-viewer');
            if (pdfViewer.contentWindow) {
                pdfViewer.contentWindow.print();
            }
        });
        
        previewModalEl.addEventListener('hidden.bs.modal', () => {
            document.getElementById('pdf-viewer').src = 'about:blank';
        });
    }
}

// =================================================================
// TITIK MASUK UTAMA (ENTRY POINT)
// =================================================================

const initializePage = () => {
    setupEventListeners();
    setupPreviewModal();
    
    loadWeeklyLiturgy();
    loadedTabs.add('beranda');
    
    activateTab('beranda');
};

// Cek library penting
if (typeof DOMPurify === 'undefined') {
    console.error("DOMPurify gagal dimuat. Keamanan konten terganggu.");
}
if (typeof FullCalendar === 'undefined') {
    console.error("FullCalendar gagal dimuat.");
}
if (typeof html2pdf === 'undefined') {
    console.error("html2pdf gagal dimuat.");
}

initializePage();