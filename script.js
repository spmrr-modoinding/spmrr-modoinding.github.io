document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("konten.json");
  const data = await response.json();
  const main = document.getElementById("main-content");
  const nav = document.querySelector(".nav");

  const tabs = [
    { id: "beranda", icon: "fa-home", label: "Beranda" },
    { id: "agenda", icon: "fa-calendar-alt", label: "Agenda/Pengumuman" },
    { id: "angelus", icon: "fa-praying-hands", label: "Angelus" },
    { id: "pastor", icon: "fa-user", label: "Pastor" },
    { id: "sekretariat", icon: "fa-envelope", label: "Sekretariat & Komsos" },
    { id: "statistik", icon: "fa-chart-bar", label: "Statistik Umat" },
    { id: "tentang", icon: "fa-info-circle", label: "Tentang Paroki" }
  ];

  tabs.forEach(tab => {
    const btn = document.createElement("button");
    btn.className = "tab-button";
    btn.dataset.tab = tab.id;
    btn.innerHTML = `<i class="fas ${tab.icon} me-2"></i>${tab.label}`;
    nav.appendChild(btn);

    const section = document.createElement("section");
    section.className = "tab-content";
    section.id = tab.id;
    section.innerHTML = data[tab.id] || `<p>Kosong</p>`;
    main.appendChild(section);
  });

  function activateTab(tabId) {
    document.querySelectorAll(".tab-button").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabId);
    });
    document.querySelectorAll(".tab-content").forEach(content => {
      content.classList.toggle("active", content.id === tabId);
    });
  }

  activateTab("beranda");

  document.querySelectorAll(".tab-button").forEach(btn => {
    btn.addEventListener("click", () => activateTab(btn.dataset.tab));
  });

  document.querySelectorAll(".indicator").forEach(indicator => {
    const text = indicator.textContent.toLowerCase();
    const isHadir = text.includes("ada");
    indicator.classList.remove("green", "red");
    indicator.classList.add(isHadir ? "green" : "red");
    indicator.textContent = isHadir ? "Ada" : "Tidak Ada";
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
try {
  const response = await fetch("konten.json");
  if (!response.ok) throw new Error("konten.json gagal dimuat.");
  const data = await response.json();
  // lanjut render konten...
} catch (err) {
  document.getElementById("main-content").innerHTML = `<p style="color:red;">Gagal memuat konten.json: ${err.message}</p>`;
}