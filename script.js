// =================================================================
// 1. DATA STATIC & VARIABLES
// =================================================================
// (Catatan: Koneksi Firebase kini ditangani secara terpusat oleh firebase-config.js)

// Variabel Global untuk menyimpan data Paus dan Doa
let globalPausData = [];
let prayersData = []; 
let allPrayersData = []; 

// Data Formulir PDF (Sesuaikan nama file dengan folder 'formulir/')
const formsData = [
    { title: 'Formulir Baptis', file: 'formulir/formulir-baptis.pdf' },
    { title: 'Formulir Krisma', file: 'formulir/formulir-krisma.pdf' },
    { title: 'Formulir Perkawinan', file: 'formulir/formulir-perkawinan.pdf' },
    { title: 'Formulir Penerimaan Anggota', file: 'formulir/formulir-penerimaan-anggota-baru.pdf' },
    { title: 'Formulir Komuni Pertama', file: 'formulir/formulir-komuni-pertama.pdf' },
    { title: 'Formulir Kursus Persiapan Perkawinan (KPP)', file: 'formulir/formulir-kursus-persiapan-perkawinan.pdf' }
];

// =================================================================
// 2. MAIN LOGIC (DOM LOADED)
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
    loadAgendaRealtime();
    loadLatestTPE();
    loadStatistikRealtime();
    loadSejarahPaus(); 
    loadPrayers(); 
    renderFormsList(); 
    
    setupMobileMenu(); 
    initNotificationCenter(); 
});

// --- FUNGSI LOAD TPE TERBARU ---
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
    if (!content || content.trim() === '' || content === '<p><br></p>') return '';
    return `
        <div class="tpe-section-block">
            <span class="tpe-label ${extraClass}">${label}</span>
            <div class="tpe-text">${content}</div>
        </div>
    `;
}

// --- FUNGSI STATISTIK & CHART ---
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

// --- FUNGSI AGENDA ---
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

// --- FUNGSI SEJARAH PAUS (JSON) ---
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

window.filterPaus = function() {
    const query = document.getElementById('search-pope').value.toLowerCase();
    const filtered = globalPausData.filter(p => 
        p.nama.toLowerCase().includes(query) || 
        p.nama_latin.toLowerCase().includes(query) ||
        p.catatan.toLowerCase().includes(query)
    );
    renderSejarahPaus(filtered);
}

// --- FUNGSI DOA (SISTEM AKORDION DARI FIREBASE) ---
function loadPrayers() {
    const c = document.getElementById('prayer-accordion-container');
    if(!c) return;
    
    c.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Memuat pustaka doa...</div>';

    db.collection('prayers_library').orderBy('urutan', 'asc').onSnapshot(snap => {
        if(snap.empty) {
            c.innerHTML = '<p style="color:#888; text-align:center;">Pustaka doa belum tersedia.</p>';
            return;
        }

        allPrayersData = []; 
        prayersData = []; 
        let i = 0;

        snap.forEach(doc => {
            const d = doc.data();
            const prayerObj = {
                index: i,
                kategori: d.kategori || 'Lain-lain',
                title: d.judul || 'Tanpa Judul',
                content: {
                    indonesia: d.indo || '',
                    latin: d.latin || ''
                }
            };
            allPrayersData.push(prayerObj);
            prayersData.push(prayerObj);
            i++;
        });
        
        renderPrayerCategories(allPrayersData);
    });
}

function renderPrayerCategories(data) {
    const container = document.getElementById('prayer-accordion-container');
    if(!container) return;
    container.innerHTML = '';

    if(data.length === 0) {
        container.innerHTML = '<p style="color:#888; text-align:center; padding: 2rem;">Doa tidak ditemukan.</p>';
        return;
    }

    const grouped = data.reduce((acc, prayer) => {
        if (!acc[prayer.kategori]) acc[prayer.kategori] = [];
        acc[prayer.kategori].push(prayer);
        return acc;
    }, {});

    for (const kategori in grouped) {
        const section = document.createElement('div');
        section.className = 'category-block';
        
        section.innerHTML = `
            <div class="category-header" onclick="togglePrayerCategory(this)">
                <span>${kategori}</span>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="category-content">
                ${grouped[kategori].map(p => `
                    <div class="prayer-item-link" onclick="showPrayer(${p.index})">
                        <i class="fas fa-pray"></i> ${p.title}
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(section);
    }
}

window.togglePrayerCategory = function(element) {
    const content = element.nextElementSibling;
    const icon = element.querySelector('i');
    
    if (content.style.display === "block") {
        content.style.display = "none";
        icon.className = "fas fa-chevron-down";
    } else {
        content.style.display = "block";
        icon.className = "fas fa-chevron-up";
    }
}

window.filterPrayers = function() {
    const query = document.getElementById('search-prayer').value.toLowerCase();
    const filtered = allPrayersData.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.kategori.toLowerCase().includes(query)
    );
    renderPrayerCategories(filtered);
    
    if (query !== "") {
        document.querySelectorAll('.category-content').forEach(c => c.style.display = "block");
        document.querySelectorAll('.category-header i').forEach(i => i.className = "fas fa-chevron-up");
    }
}

// --- FUNGSI FORMULIR & PDF PREVIEW ---
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

// --- TAB NAVIGATION SYSTEM ---
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

// --- MOBILE MENU LOGIC ---
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

// --- LOGIKA MODAL DOA ---
let currPrayer = 0;
window.showPrayer = function(i) {
    currPrayer = i;
    document.getElementById('prayer-title-display').innerText = prayersData[i].title;
    document.getElementById('prayer-content-display').innerHTML = prayersData[i].content.indonesia;
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
        textEl.innerHTML = content || 'Terjemahan tidak tersedia.';
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

// =================================================================
// 4. IN-APP NOTIFICATION CENTER & PUSH LOGIC
// =================================================================
let allNotifications = [];

function initNotificationCenter() {
    const bellBtn = document.getElementById('notif-bell-btn');
    const panel = document.getElementById('notif-panel');
    const closeBtn = document.getElementById('close-notif-btn');
    const tabs = document.querySelectorAll('.notif-tab');

    if(bellBtn) bellBtn.addEventListener('click', () => panel.classList.toggle('show'));
    if(closeBtn) closeBtn.addEventListener('click', () => panel.classList.remove('show'));

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.notif-list').forEach(l => l.classList.remove('active'));
            
            e.target.classList.add('active');
            const targetId = e.target.getAttribute('data-tab');
            document.getElementById(`notif-list-${targetId}`).classList.add('active');
        });
    });

    db.collection('app_notifications').orderBy('tanggal', 'desc').limit(20).onSnapshot(snap => {
        allNotifications = [];
        snap.forEach(doc => {
            allNotifications.push({ id: doc.id, ...doc.data() });
        });
        renderNotifications();
    });

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    OneSignalDeferred.push(async function(OneSignal) {
        if(OneSignal.Notifications.permission === "granted") {
            const banner = document.getElementById('push-subscribe-banner');
            if(banner) banner.style.display = 'none';
        }
    });
}

function getLocalData(key) { return JSON.parse(localStorage.getItem(key) || '[]'); }
function saveLocalData(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

function renderNotifications() {
    const readIds = getLocalData('readNotifs');
    const deletedIds = getLocalData('deletedNotifs');

    const unreadList = document.getElementById('notif-list-unread');
    const readList = document.getElementById('notif-list-read');
    const badge = document.getElementById('notif-badge');

    let unreadHtml = '', readHtml = '', unreadCount = 0;

    allNotifications.forEach(n => {
        if (deletedIds.includes(n.id)) return; 

        const timeString = n.tanggal ? n.tanggal.toDate().toLocaleDateString('id-ID', {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'}) : 'Baru saja';
        const isRead = readIds.includes(n.id);

        const card = `
            <div class="notif-item ${isRead ? 'read' : ''}" onclick="bacaDanBuka('${n.id}', '${n.kategori || ''}')">
                <button class="n-del-btn" onclick="event.stopPropagation(); hapusNotif('${n.id}', ${!isRead})"><i class="fas fa-trash"></i></button>
                <h4>${n.judul}</h4>
                <p>${n.pesan}</p>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="n-time"><i class="far fa-clock"></i> ${timeString}</span>
                    <span class="click-hint">Klik untuk melihat</span>
                </div>
            </div>
        `;

        if (isRead) { readHtml += card; } else { unreadHtml += card; unreadCount++; }
    });

    if(unreadList) unreadList.innerHTML = unreadHtml || '<div class="empty-notif">Tidak ada notifikasi baru.</div>';
    if(readList) readList.innerHTML = readHtml || '<div class="empty-notif">Belum ada riwayat notifikasi.</div>';

    if (badge) {
        if (unreadCount > 0) { badge.style.display = 'flex'; badge.innerText = unreadCount; } 
        else { badge.style.display = 'none'; }
    }
}

window.bacaDanBuka = function(id, kategori) {
    const readIds = getLocalData('readNotifs');
    if (!readIds.includes(id)) {
        readIds.push(id);
        saveLocalData('readNotifs', readIds);
        renderNotifications();
    }
    
    const panel = document.getElementById('notif-panel');
    if(panel) panel.classList.remove('show');

    if (kategori === 'tpe') {
        openTab(null, 'beranda');
        window.scrollTo({top: 0, behavior: 'smooth'});
    } else if (kategori === 'pengumuman') {
        openTab(null, 'agenda');
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
}

window.hapusNotif = function(id, isUnread) {
    if (isUnread) {
        const confirmDelete = confirm("Pesan ini belum dibaca. Anda yakin ingin menghapusnya?");
        if (!confirmDelete) return;
    }
    const deletedIds = getLocalData('deletedNotifs');
    if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        saveLocalData('deletedNotifs', deletedIds);
        renderNotifications();
    }
}

window.memintaIzinNotifikasi = function() {
    window.OneSignalDeferred.push(async function(OneSignal) {
        await OneSignal.Slidedown.promptPush();
        OneSignal.Notifications.addEventListener("permissionChange", function(permissionChange) {
            if (permissionChange === "granted") {
                const banner = document.getElementById('push-subscribe-banner');
                if(banner) banner.style.display = 'none';
                alert("Terima kasih! Notifikasi background telah diaktifkan.");
            }
        });
    });
}