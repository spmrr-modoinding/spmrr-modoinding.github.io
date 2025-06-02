// script.js

// Fungsi untuk mengubah warna indikator kehadiran pastor secara dinamis
function updatePastorStatusColors() {
  const indicators = document.querySelectorAll('.indicator');
  indicators.forEach(indicator => {
    const text = indicator.textContent.toLowerCase();
    if (text.includes('tidak')) {
      indicator.classList.remove('green');
      indicator.classList.add('red');
      indicator.textContent = "Tidak Ada";
    } else if (text.includes('ada')) {
      indicator.classList.remove('red');
      indicator.classList.add('green');
      indicator.textContent = "Ada";
    }
  });
}

// Fungsi untuk mengaktifkan tab tertentu
function activateTab(tabId) {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });

  tabContents.forEach(content => {
    content.classList.toggle('active', content.id === tabId);
  });
}

// Angelus reminder otomatis (pukul 6, 12, 18)
function checkAngelusTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  if ((hours === 6 || hours === 12 || hours === 18) && minutes === 0) {
    alert('🔔 Waktu untuk Doa Angelus. Mari kita berdoa.');
  }
}
setInterval(checkAngelusTime, 60000);

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  updatePastorStatusColors();

  const tabButtons = document.querySelectorAll('.tab-button');

  if (tabButtons.length > 0) {
    activateTab(tabButtons[0].dataset.tab); // Set tab pertama aktif
  }

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      activateTab(button.dataset.tab);
    });
  });

  // Tambah tab Statistik Umat secara dinamis jika perlu
  const nav = document.querySelector('nav');
  if (nav) {
    const tabBtn = document.createElement('button');
    tabBtn.className = 'tab-button';
    tabBtn.setAttribute('data-tab', 'statistik');
    tabBtn.textContent = 'Statistik Umat';
    nav.appendChild(tabBtn);

    const statistikTab = document.createElement('section');
    statistikTab.className = 'tab-content';
    statistikTab.id = 'statistik';
    statistikTab.innerHTML = `
      <h2>Statistik Umat per Tahun</h2>
      <p>Konten statistik umat bisa dimasukkan di sini.</p>
    `;
    const contentContainer = document.querySelector('main');
    contentContainer.appendChild(statistikTab);
  }
});
