// =================================================================
// 1. FIREBASE CONFIGURATION
// =================================================================
const firebaseConfig = {
    apiKey: "AIzaSyC-KNi0YqnlxtzkeoemEFWN5xusjxpWV_I",
    authDomain: "paroki-modoinding.firebaseapp.com",
    projectId: "paroki-modoinding",
    storageBucket: "paroki-modoinding.appspot.com",
    messagingSenderId: "615770618729",
    appId: "1:615770618729:web:0f6d67c62512c21f2e5bf8",
    measurementId: "G-ECLMPR9NJ2"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// =================================================================
// 2. DATA STATIC & FORMULIR
// =================================================================

// Variabel Global untuk menyimpan data Paus dari JSON
let globalPausData = [];

const prayersData = [
    { title: 'Tanda Salib', content: { indonesia: `Dalam nama Bapa dan Putra dan Roh Kudus. Amin.`, latin: `In nomine Patris, et Filii, et Spiritus Sancti. Amen.` } },
    { title: 'Bapa Kami', content: { indonesia: `Bapa kami yang ada di surga, dimuliakanlah nama-Mu.\nDatanglah kerajaan-Mu. Jadilah kehendak-Mu di atas bumi seperti di dalam surga.\nBerilah kami rezeki pada hari ini, dan ampunilah kesalahan kami, seperti kami pun mengampuni yang bersalah kepada kami.\nDan janganlah masukkan kami ke dalam pencobaan, tetapi bebaskanlah kami dari yang jahat. Amin.`, latin: `Pater noster, qui es in caelis: sanctificetur Nomen Tuum;\nadveniat Regnum Tuum; fiat voluntas Tua, sicut in caelo, et in terra.\nPanem nostrum cotidianum da nobis hodie; et dimitte nobis debita nostra, sicut et nos dimittimus debitoribus nostris;\net ne nos inducas in tentationem; sed libera nos a Malo. Amen.` } },
    { title: 'Salam Maria', content: { indonesia: `Salam Maria, penuh rahmat, Tuhan sertamu,\nterpujilah engkau di antara wanita, dan terpujilah buah tubuhmu, Yesus.\nSanta Maria, bunda Allah, doakanlah kami yang berdosa ini, sekarang dan waktu kami mati. Amin.`, latin: `Ave Maria, gratia plena, Dominus tecum, benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.` } },
    { title: 'Kemuliaan', content: { indonesia: `Kemuliaan kepada Bapa dan Putra dan Roh Kudus,\nseperti pada permulaan, sekarang, selalu, dan sepanjang segala abad. Amin.`, latin: `Gloria Patri, et Filio, et Spiritui Sancto.\nSicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen.` } }
];

// DATA FORMULIR - Update sesuai file yang ada
const formsData = [
    { title: 'Formulir Baptis', file: 'formulir/formulir-baptis.pdf' },
    { title: 'Formulir Krisma', file: 'formulir/formulir-krisma.pdf' },
    { title: 'Formulir Perkawinan', file: 'formulir/formulir-perkawinan.pdf' },
    { title: 'Formulir Penerimaan Anggota', file: 'formulir/formulir-penerimaan-anggota-baru.pdf' },
    { title: 'Formulir Komuni Pertama', file: 'formulir/formulir-komuni-pertama.pdf' },
    { title: 'Formulir Kursus Persiapan Perkawinan (KPP)', file: 'formulir/formulir-kursus-persiapan-perkawinan.pdf' }
];

document.addEventListener('DOMContentLoaded', () => {
    loadAgendaRealtime();
    loadLatestTPE();
    loadStatistikRealtime();
    loadSejarahPaus(); // Memuat data Paus dari JSON
    loadPrayers();
    renderFormsList(); 
    setupMobileMenu(); 
    
    // --- LOAD TPE TERBARU ---
    function loadLatestTPE() {
        const container = document.getElementById('latest-tpe-container');
        db.collection('tata_perayaan_mingguan').limit(1).onSnapshot(snap => {
            if(snap.empty) { 
                container.innerHTML = '<div class="modern-card" style="text-align:center;">Belum ada Data TPE Minggu ini.</div>'; 
                return; 
            }
            
            const docs = snap.docs.sort((a,b) => b.id.localeCompare(a.id));
            const data = docs[0].data();
            const tpe = data.tata_perayaan || {};

            let html = `
                <div class="tpe-paper">
                    <div class="tpe-header">
                        <h2>${data.nama_perayaan}</h2>
                        <div class="tpe-meta">
                            ${data.tanggal_display} | ${data.tahun_liturgi || ''}
                        </div>
                        <p style="margin-top:10px; font-weight:500;">${data.tema || ''}</p>
                    </div>

                    <div class="tpe-content">
                        ${renderTPESection('Antifon Pembuka', tpe.antifon_pembuka)}
                        ${renderTPESection('Doa Kolekta', tpe.doa_kolekta)}
                        <hr style="margin: 2rem 0; border:0; border-top:1px solid #eee;">
                        ${renderTPESection('Bacaan Pertama', tpe.bacaan_1, 'label-bacaan')}
                        ${renderTPESection('Mazmur Tanggapan', tpe.mazmur_tanggapan)}
                        ${renderTPESection('Bacaan Kedua', tpe.bacaan_2, 'label-bacaan')}
                        ${renderTPESection('Bait Pengantar Injil', tpe.bait_pengantar_injil)}
                        ${renderTPESection('Bacaan Injil', tpe.bacaan_injil, 'label-bacaan')}
                        <hr style="margin: 2rem 0; border:0; border-top:1px solid #eee;">
                        ${renderTPESection('Doa Umat', tpe.doa_umat)}
                        ${renderTPESection('Doa Atas Persembahan', tpe.doa_persembahan)}
                        ${renderTPESection('Antifon Komuni', tpe.antifon_komuni)}
                        ${renderTPESection('Doa Sesudah Komuni', tpe.doa_sesudah_komuni)}
                    </div>
                </div>
            `;
            container.innerHTML = html;
        });
    }

    function renderTPESection(label, content, extraClass = '') {
        if (!content || content.trim() === '') return '';
        if (content === '<p><br></p>') return '';
        return `<div class="tpe-section-block"><span class="tpe-label ${extraClass}">${label}</span><div class="tpe-text">${content}</div></div>`;
    }

    function loadStatistikRealtime() {
        const tbody = document.getElementById('statistik-table-body');
        const tfoot = document.getElementById('statistik-table-foot');
        if(tbody) tbody.innerHTML = '<tr><td colspan="6" class="text-center"><div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Sinkronisasi data...</div></td></tr>';

        db.collection('parish_stats').orderBy('order').onSnapshot(snapshot => {
            if(snapshot.empty) { if(tbody) tbody.innerHTML = '<tr><td colspan="6" class="text-center">Belum ada data.</td></tr>'; return; }

            let htmlTable = '', totalKK = 0, totalL = 0, totalP = 0, totalJiwa = 0, labels = [], dataChart = [];

            snapshot.forEach(doc => {
                const d = doc.data();
                const jiw = (d.laki_laki || 0) + (d.perempuan || 0);
                totalKK += d.kk || 0; totalL += d.laki_laki || 0; totalP += d.perempuan || 0; totalJiwa += jiw;

                htmlTable += `<tr><td>${d.order}</td><td><strong>${d.name}</strong></td><td>${d.kk}</td><td>${d.laki_laki}</td><td>${d.perempuan}</td><td><span style="color:var(--primary-blue); font-weight:bold;">${jiw}</span></td></tr>`;
                labels.push(d.name.replace("Stasi", "").replace("St.", "").replace("Sta.", "").trim().substring(0, 15));
                dataChart.push(jiw);
            });

            if(tbody) tbody.innerHTML = htmlTable;
            if(tfoot) tfoot.innerHTML = `<tr><td colspan="2" style="text-align:center;">TOTAL</td><td>${totalKK}</td><td>${totalL}</td><td>${totalP}</td><td>${totalJiwa.toLocaleString()}</td></tr>`;
            renderChart(labels, dataChart);
        });
    }

    function renderChart(labels, data) {
        const ctx = document.getElementById('publicUmatChart');
        if(ctx) {
            const existingChart = Chart.getChart(ctx);
            if (existingChart) existingChart.destroy();
            new Chart(ctx, { type: 'bar', data: { labels: labels, datasets: [{ label: 'Jumlah Jiwa', data: data, backgroundColor: '#4A90E2', borderRadius: 5 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#f0f0f0' } }, x: { ticks: { autoSkip: false, maxRotation: 90, minRotation: 45, font: {size: 10} }, grid: { display: false } } } } });
        }
    }

    function loadAgendaRealtime() {
        const container = document.getElementById('agenda-container');
        db.collection('announcements').orderBy('createdAt', 'desc').limit(5).onSnapshot(snap => {
            if(snap.empty) { container.innerHTML = '<div class="modern-card">Belum ada pengumuman terbaru.</div>'; return; }
            let html = '';
            snap.forEach(d => {
                const data = d.data();
                html += `<div class="modern-card hover-lift"><div class="card-date"><i class="far fa-calendar"></i> ${data.tanggal || '-'} ${data.jam ? ' • '+data.jam : ''}</div><h3 class="card-title">${data.judul}</h3><p style="color:#555; margin-bottom:10px;">${data.catatan || ''}</p><small style="color:#888; border-top:1px solid #eee; padding-top:8px; display:block;"><i class="fas fa-map-marker-alt"></i> ${data.lokasi || 'Paroki'}</small></div>`;
            });
            container.innerHTML = html;
        });
    }

    // --- SEJARAH PAUS (FETCH JSON) ---
    async function loadSejarahPaus() {
        try {
            const response = await fetch('sejarah_paus.json');
            if (!response.ok) throw new Error("Gagal mengambil data");
            globalPausData = await response.json();
            renderSejarahPaus(globalPausData);
        } catch (error) {
            console.error("Error loading popes:", error);
            const container = document.getElementById('pope-container');
            if(container) container.innerHTML = '<p style="text-align:center; color:#999; padding:2rem;">Gagal memuat data sejarah Paus.<br>Pastikan file sejarah_paus.json ada di folder website.</p>';
        }
    }

    function renderSejarahPaus(data) {
        const container = document.getElementById('pope-container');
        if(!container) return;
        let html = '';
        data.forEach(d => {
            // Mapping data JSON ke HTML
            html += `
                <div class="modern-card hover-lift" style="flex-direction:row; align-items:center; gap:20px;">
                    <div class="pope-number">${d.urutan}</div>
                    <div style="flex:1;">
                        <h3 class="card-title" style="margin-bottom:5px; font-size:1.15rem;">
                            ${d.nama} 
                            <small style="font-weight:normal; font-size:0.9rem; color:#666;">(${d.nama_latin})</small>
                        </h3>
                        <div style="font-size:0.85rem; color:#888; margin-bottom:8px; display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                            <span><i class="far fa-clock"></i> ${d.masa_jabatan}</span>
                            <span>|</span>
                            <span><i class="fas fa-globe"></i> ${d.negara_asal}</span>
                        </div>
                        <p style="font-size:0.95rem; color:#444; line-height:1.5;">${d.catatan}</p>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }
    
    // Fungsi Filter/Search Paus
    window.filterPaus = function() {
        const query = document.getElementById('search-pope').value.toLowerCase();
        const filtered = globalPausData.filter(p => 
            p.nama.toLowerCase().includes(query) || 
            p.nama_latin.toLowerCase().includes(query) ||
            p.catatan.toLowerCase().includes(query)
        );
        renderSejarahPaus(filtered);
    }

    function loadPrayers() {
        const c = document.getElementById('prayer-buttons');
        if(!c) return;
        let h = '';
        prayersData.forEach((p, i) => h += `<button class="prayer-btn" onclick="showPrayer(${i})">${p.title}</button>`);
        c.innerHTML = h;
    }

    // --- FORMULIR RENDER & PREVIEW ---
    function renderFormsList() {
        const container = document.getElementById('forms-list-container');
        if(!container) return;
        let html = '';
        formsData.forEach((form, index) => {
            html += `
                <div class="form-item" onclick="openPdfPreview(${index})">
                    <div class="form-info">
                        <div class="form-name">${form.title}</div>
                    </div>
                    <div class="btn-preview-icon">
                        <i class="fas fa-external-link-alt"></i>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    window.openPdfPreview = function(index) {
        const form = formsData[index];
        const modal = document.getElementById('pdf-preview-modal');
        const iframe = document.getElementById('pdf-frame');
        const title = document.getElementById('pdf-title');
        const downloadBtn = document.getElementById('download-btn');
        
        title.innerText = "Pratinjau: " + form.title;
        iframe.src = form.file;
        downloadBtn.href = form.file;
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; 
    }

    window.closePdfPreview = function() {
        document.getElementById('pdf-preview-modal').style.display = 'none';
        document.getElementById('pdf-frame').src = "";
        document.body.style.overflow = 'auto';
    }

    window.printPdf = function() {
        const iframe = document.getElementById('pdf-frame');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.print();
        }
    }
});

function openTab(evt, tabName) {
    const tabContent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].classList.remove("active");
        if(tabContent[i].id !== tabName) tabContent[i].style.display = 'none';
    }
    const tabLinks = document.getElementsByClassName("tab-button");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
    }
    const activeTab = document.getElementById(tabName);
    if(activeTab) {
        activeTab.style.display = "block";
        setTimeout(() => { activeTab.classList.add("active"); }, 10);
    }
    if(evt) evt.currentTarget.classList.add("active");
    
    if (window.innerWidth <= 768) {
        const hamburger = document.getElementById('hamburger-menu');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        if(hamburger) hamburger.classList.remove('active');
        if(sidebar) sidebar.classList.remove('active');
        if(overlay) overlay.classList.remove('active');
    }
}

// =================================================================
// 3. LOGIKA SIDEBAR & HAMBURGER (FIX)
// =================================================================
function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger-menu');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    if (hamburger && sidebar && overlay) {
        const toggleMenu = () => {
            hamburger.classList.toggle('active');
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        };
        hamburger.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', () => {
            hamburger.classList.remove('active');
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
}

let currPrayer = 0;
window.showPrayer = function(i) {
    currPrayer = i;
    document.getElementById('prayer-title-display').innerText = prayersData[i].title;
    document.getElementById('prayer-content-display').innerText = prayersData[i].content.indonesia;
    document.getElementById('prayer-display').style.display = 'block';
    document.getElementById('btn-indo').classList.add('active');
    document.getElementById('btn-latin').classList.remove('active');
    document.getElementById('prayer-display').scrollIntoView({behavior: 'smooth', block: 'center'});
}

window.closePrayer = function() {
    document.getElementById('prayer-display').style.display = 'none';
}

window.switchLang = function(lang) {
    const content = lang === 'latin' ? prayersData[currPrayer].content.latin : prayersData[currPrayer].content.indonesia;
    const textEl = document.getElementById('prayer-content-display');
    textEl.style.opacity = '0';
    setTimeout(() => {
        textEl.innerText = content || 'Terjemahan tidak tersedia.';
        textEl.style.opacity = '1';
    }, 200);
    if(lang === 'indonesia') {
        document.getElementById('btn-indo').classList.add('active');
        document.getElementById('btn-latin').classList.remove('active');
    } else {
        document.getElementById('btn-indo').classList.remove('active');
        document.getElementById('btn-latin').classList.add('active');
    }
}