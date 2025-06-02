document.addEventListener('DOMContentLoaded', () => {
  function activateTab(tabId) {
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === tabId);
    });
  }

  const nav = document.querySelector('.nav');
  const statistikBtn = document.createElement('button');
  statistikBtn.className = 'tab-button';
  statistikBtn.setAttribute('data-tab', 'statistik');
  statistikBtn.textContent = 'Statistik Umat';
  nav.appendChild(statistikBtn);

  const statistikSection = document.createElement('section');
  statistikSection.className = 'tab-content';
  statistikSection.id = 'statistik';
  statistikSection.innerHTML = `
    <h2>Statistik Umat per Tahun</h2>
    <p>Statistik umat akan dimuat di sini.</p>
  `;
  document.querySelector('main').appendChild(statistikSection);

  nav.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
      activateTab(button.dataset.tab);
    });
  });

  const firstTab = nav.querySelector('.tab-button');
  if (firstTab) activateTab(firstTab.dataset.tab);

  document.querySelectorAll('.indicator').forEach(indicator => {
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

  setInterval(() => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    if ((h === 6 || h === 12 || h === 18) && m === 0) {
      alert("🔔 Waktu untuk Doa Angelus. Mari kita berdoa.");
    }
  }, 60000);
});
