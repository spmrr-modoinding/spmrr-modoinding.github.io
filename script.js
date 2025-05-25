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

// Notifikasi Angelus otomatis (pukul 6, 12, 18)
function checkAngelusTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  if ((hours === 6 || hours === 12 || hours === 18) && minutes === 0) {
    alert('🔔 Waktu untuk Doa Angelus. Mari kita berdoa.');
  }
}
setInterval(checkAngelusTime, 60000);

// Event saat halaman dimuat
window.addEventListener('DOMContentLoaded', () => {
  updatePastorStatusColors();

  // Tambah tab Statistik
  const nav = document.querySelector('.nav');
  const tabBtn = document.createElement('button');
  tabBtn.className = 'tab-button';
  tabBtn.setAttribute('data-tab', 'statistik');
  tabBtn.textContent = 'Statistik Umat';
  nav.appendChild(tabBtn);

  const contentContainer = document.querySelector('.tabs');
  const statistikTab = document.createElement('section');
  statistikTab.className = 'tab-content';
  statistikTab.id = 'statistik';
  statistikTab.innerHTML = `
    <h2>Statistik Umat per Tahun</h2>
    <div class="overflow-auto">
      <table class="stats-table">
        <thead>
          <tr>
            <th>No.</th>
            <th style="text-align:left;">Nama Wilayah</th>
            <th>KK</th>
            <th>Laki-Laki</th>
            <th>Perempuan</th>
            <th>Jumlah Jiwa</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>St. Fransiskus Asisi Sinisir</td><td>23</td><td>41</td><td>30</td><td>71</td></tr>
          <tr><td>2</td><td>St. Dominikus Sinisir</td><td>22</td><td>28</td><td>31</td><td>59</td></tr>
          <tr><td>3</td><td>St. Ignasius Sinisir</td><td>20</td><td>24</td><td>25</td><td>49</td></tr>
          <tr><td>4</td><td>Sta. Skolastika Sinisir</td><td>26</td><td>39</td><td>32</td><td>71</td></tr>
          <tr><td>5</td><td>St. Vincensius Sinisir</td><td>20</td><td>28</td><td>28</td><td>56</td></tr>
          <tr><td>6</td><td>St. Stefanus Sinisir</td><td>21</td><td>23</td><td>28</td><td>51</td></tr>
          <tr><td>7</td><td>Sta. Ursula Sinisir</td><td>19</td><td>26</td><td>34</td><td>60</td></tr>
          <tr><td>8</td><td>Sta. Maria Bunda Karmel Sinisir</td><td>21</td><td>29</td><td>34</td><td>63</td></tr>
          <tr><td>9</td><td>St. Romualdus Sinisir</td><td>21</td><td>33</td><td>35</td><td>68</td></tr>
          <tr><td>10</td><td>Sta. Faustina Sinisir</td><td>19</td><td>30</td><td>26</td><td>56</td></tr>
          <tr><td>11</td><td>Sta. Theresia Sinisir</td><td>22</td><td>38</td><td>28</td><td>66</td></tr>
          <tr><td>12</td><td>St. Mikael Sinisir</td><td>13</td><td>16</td><td>17</td><td>33</td></tr>
          <tr><td>13</td><td>Antonius Maria Claret Makaaroyen</td><td>20</td><td>30</td><td>28</td><td>58</td></tr>
          <tr><td>14</td><td>St. Alfonsus Maria de Liquori Makaaroyen</td><td>19</td><td>23</td><td>29</td><td>52</td></tr>
          <tr><td>15</td><td>Sta. Angela Merici Tambelang</td><td>21</td><td>35</td><td>28</td><td>63</td></tr>
          <tr><td>16</td><td>St. Aloysius Gonzaga Tambelang</td><td>22</td><td>46</td><td>34</td><td>80</td></tr>
          <tr><td>17</td><td>Sta. Katarina Siena Tambelang</td><td>20</td><td>26</td><td>31</td><td>57</td></tr>
          <tr><td>18</td><td>St. Robertus Bellarminus Tambelang</td><td>20</td><td>33</td><td>26</td><td>59</td></tr>
          <tr><td>19</td><td>St. Yohanes Krisostomus Tambelang</td><td>15</td><td>19</td><td>27</td><td>46</td></tr>
          <tr><td>20</td><td>St. Fransiskus de Sales Tambelang</td><td>19</td><td>34</td><td>33</td><td>67</td></tr>
          <tr><td>21</td><td>St. Pius X Tambelang</td><td>20</td><td>43</td><td>32</td><td>75</td></tr>
          <tr><td>22</td><td>St. Hieronimus Kinamang</td><td>22</td><td>38</td><td>32</td><td>70</td></tr>
          <tr><td>23</td><td>St. Lukas Kinamang</td><td>24</td><td>32</td><td>45</td><td>77</td></tr>
          <tr><td>24</td><td>Sta. Agata Kinamang</td><td>23</td><td>36</td><td>30</td><td>66</td></tr>
          <tr><td>25</td><td>Sta. Rita de Cascia Kinamang</td><td>23</td><td>36</td><td>30</td><td>66</td></tr>
          <tr><td>26</td><td>St. Laurensius Kinamang</td><td>21</td><td>28</td><td>27</td><td>66</td></tr>
          <tr><td>27</td><td>Stasi Christus Rex Liningaan</td><td>22</td><td>34</td><td>19</td><td>75</td></tr>
          <tr><td>28</td><td>Stasi Hati Kudus Yesus Mobuya</td><td>11</td><td>22</td><td>16</td><td>49</td></tr>
          <tr style="font-weight:bold; background:#e0f7fa">
            <td colspan="2">Jumlah</td>
            <td>569</td>
            <td>870</td>
            <td>815</td>
            <td>1.729</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
  contentContainer.appendChild(statistikTab);

  // Efek transisi antar tab
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  nav.addEventListener('click', (event) => {
    const button = event.target.closest('.tab-button');
    if (!button) return;

    const tabId = button.getAttribute('data-tab');

    tabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    tabContents.forEach(content => {
      if (content.id === tabId) {
        content.classList.add('active');
        content.classList.add('fade-in-up');
        setTimeout(() => content.classList.remove('fade-in-up'), 500);
      } else {
        content.classList.remove('active');
      }
    });
  });
});
// script.js

document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  // Fungsi untuk mengaktifkan tab tertentu
  function activateTab(tabId) {
    tabButtons.forEach(btn => {
      if (btn.dataset.tab === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    tabContents.forEach(content => {
      if (content.id === tabId) {
        content.classList.add('active', 'fade-in-up');
      } else {
        content.classList.remove('active', 'fade-in-up');
      }
    });
  }

  // Set tab pertama aktif saat halaman dimuat
  if (tabButtons.length > 0) {
    activateTab(tabButtons[0].dataset.tab);
  }

  // Event listener untuk klik tab
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      activateTab(button.dataset.tab);
    });
  });
});
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class dari semua button
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    // Tambah active class ke button yang diklik
    button.classList.add('active');

    // Sembunyikan semua tab content
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    // Tampilkan tab content yang sesuai data-tab
    const tabId = button.getAttribute('data-tab');
    const tabToShow = document.getElementById(tabId);
    if (tabToShow) tabToShow.classList.add('active');
  });
});
