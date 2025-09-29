// script.js (Versi Final & Lengkap)

let publicUmatChart = null;

// =================================================================
// DATA DOA-DOA (Disimpan di sini, bukan di Firebase)
// =================================================================
const prayersData = [
    {
        title: 'Tanda Salib',
        content: {
            indonesia: `<p>Dalam nama Bapa dan Putra dan Roh Kudus. Amin.</p>`,
            latin: `<p>In nomine Patris, et Filii, et Spiritus Sancti. Amen.</p>`
        }
    },
    {
        title: 'Bapa Kami',
        content: {
            indonesia: `<p>Bapa kami yang ada di surga, dimuliakanlah nama-Mu.<br>
Datanglah kerajaan-Mu. Jadilah kehendak-Mu di atas bumi seperti di dalam surga.</p>
<p>Berilah kami rezeki pada hari ini, dan ampunilah kesalahan kami, seperti kami pun mengampuni yang bersalah kepada kami.</p>
<p>Dan janganlah masukkan kami ke dalam pencobaan, tetapi bebaskanlah kami dari yang jahat. Amin.</p>`,
            latin: `<p>Pater noster, qui es in caelis: sanctificetur Nomen Tuum;<br>
adveniat Regnum Tuum; fiat voluntas Tua, sicut in caelo, et in terra.</p>
<p>Panem nostrum cotidianum da nobis hodie; et dimitte nobis debita nostra, sicut et nos dimittimus debitoribus nostris;</p>
<p>et ne nos inducas in tentationem; sed libera nos a Malo. Amen.</p>`
        }
    },
    {
        title: 'Aku Percaya (Syahadat Para Rasul)',
        content: {
            indonesia: `<p>Aku percaya akan Allah, Bapa yang Mahakuasa, pencipta langit dan bumi.<br>
Dan akan Yesus Kristus, Putra-Nya yang tunggal, Tuhan kita.<br>
Yang dikandung dari Roh Kudus, dilahirkan oleh Perawan Maria.</p>
<p>Yang menderita sengsara dalam pemerintahan Pontius Pilatus, disalibkan, wafat, dan dimakamkan.<br>
Yang turun ke tempat penantian, pada hari ketiga bangkit dari antara orang mati.<br>
Yang naik ke surga, duduk di sebelah kanan Allah Bapa yang Mahakuasa.<br>
Dari situ Ia akan datang mengadili orang hidup dan mati.</p>
<p>Aku percaya akan Roh Kudus, Gereja Katolik yang kudus, persekutuan para kudus, pengampunan dosa, kebangkitan badan, kehidupan kekal. Amin.</p>`,
            latin: `<p>Credo in Deum Patrem omnipotentem, Creatorem caeli et terrae, et in Iesum Christum, Filium Eius unicum, Dominum nostrum, qui conceptus est de Spiritu Sancto, natus ex Maria Virgine, passus sub Pontio Pilato, crucifixus, mortuus, et sepultus, descendit ad inferos, tertia die resurrexit a mortuis, ascendit ad caelos, sedet ad dexteram Dei Patris omnipotentis, inde venturus est iudicare vivos et mortuos. Credo in Spiritum Sanctum, sanctam Ecclesiam catholicam, sanctorum communionem, remissionem peccatorum, carnis resurrectionem, vitam aeternam. Amen.</p>`
        }
    },
    {
        title: 'Salam Maria',
        content: {
            indonesia: `<p>Salam Maria, penuh rahmat, Tuhan sertamu,<br>
terpujilah engkau di antara wanita, dan terpujilah buah tubuhmu, Yesus.</p>
<p>Santa Maria, bunda Allah, doakanlah kami yang berdosa ini, sekarang dan waktu kami mati. Amin.</p>`,
            latin: `<p>Ave Maria, gratia plena, Dominus tecum, benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.</p>`
        }
    },
    {
        title: 'Kemuliaan',
        content: {
            indonesia: `<p>Kemuliaan kepada Bapa dan Putra dan Roh Kudus,<br>
seperti pada permulaan, sekarang, selalu, dan sepanjang segala abad. Amin.</p>`,
            latin: `<p>Gloria Patri, et Filio, et Spiritui Sancto.<br>
Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen.</p>`
        }
    },
    {
        title: 'Doa Tobat / Actus Contritionis',
        content: {
            indonesia: `<p>Allah yang maharahim, aku menyesal atas dosa-dosaku. Aku sungguh patut Engkau hukum, terutama karena aku telah tidak setia kepada Engkau yang maha pengasih dan mahabaik bagiku.</p><p>Aku benci akan segala dosaku, dan berjanji dengan pertolongan rahmat-Mu hendak memperbaiki hidupku dan tidak akan berbuat dosa lagi. Allah yang mahamurah, ampunilah aku, orang berdosa. Amin.</p>`,
            latin: `<p>Deus meus, ex toto corde pænitet me ómnium meórum peccatórum, eáque detéstor, quia peccándo, non solum pœnas a Te iuste statútas proméritus sum, sed præsértim quia offéndi Te, summum bonum, ac dignum qui super ómnia diligáris.</p><p>Ídeo fírmiter propóno, adiuvánte grátia tua, de cétero me non peccatúrum peccandíque occasiónes próximas fugitúrum. Amen.</p>`
        }
    },
    {
        title: 'Doa Malaikat Tuhan / Angelus',
        content: {
            indonesia: `<p>P. Maria diberi kabar oleh malaikat Tuhan,<br>
U. Maka ia mengandung dari Roh Kudus. (Salam Maria...)</p>
<p>P. Aku ini hamba Tuhan,<br>
U. Terjadilah padaku menurut perkataanmu. (Salam Maria...)</p>
<p>P. Sabda sudah menjadi daging,<br>
U. Dan tinggal di antara kita. (Salam Maria...)</p>
<p>P. Doakanlah kami, ya Santa Bunda Allah,<br>
U. Supaya kami dapat menikmati janji Kristus.</p>
<p><b>Marilah berdoa:</b><br>
Ya Allah, karena kabar malaikat kami mengetahui bahwa Yesus Kristus, Putra-Mu, telah menjadi manusia; curahkanlah rahmat-Mu ke dalam hati kami, supaya karena sengsara dan salib-Nya, kami dibawa kepada kebangkitan yang mulia. Sebab Dialah Tuhan, pengantara kami. Amin.</p>`,
            latin: `<p>V. Angelus Domini nuntiavit Mariæ,<br>
R. Et concepit de Spiritu Sancto. (Ave Maria...)</p>
<p>V. Ecce ancilla Domini,<br>
R. Fiat mihi secundum verbum tuum. (Ave Maria...)</p>
<p>V. Et Verbum caro factum est,<br>
R. Et habitavit in nobis. (Ave Maria...)</p>
<p>V. Ora pro nobis, Sancta Dei Genetrix,<br>
R. Ut digni efficiamur promissionibus Christi.</p>
<p><b>Oremus:</b><br>
Gratiam tuam, quæsumus, Domine, mentibus nostris infunde; ut qui, Angelo nuntiante, Christi Filii tui incarnationem cognovimus, per passionem eius et crucem, ad resurrectionis gloriam perducamur. Per eundem Christum Dominum nostrum. Amen.</p>`
        }
    },
    {
        title: 'Doa Wasiat',
        content: {
            indonesia: `<h4>Doa Kepada Salib Suci Kristus</h4><p>Terpujilah Tuhan Yesus Kristus,<br>Yang wafat di kayu salib,<br>disalib untuk dosa kita.</p><p>Kristus Suci yang disalibkan, mohon selalu beserta kami;<br>Kristus Suci yang disalibkan, mohon perlindungan;<br>Kristus Suci yang disalibkan, Kau adalah terang Abadi untuk keluarga kami;<br>Kristus Suci yang disalibkan, lindungilah kami dari senjata tajam;<br>Kristus Suci yang disalibkan, datanglah di akhir perjalanan hidup kami;<br>Kristus Suci yang disalibkan, lindungilah kami dari godaan dalam menghadapi maut;<br>Kristus Suci yang disalibkan, lindungilah kami dari malapetaka;</p><p>Salib Suci Kristus kami luhurkan Dikau,<br>O Yesus dari Nazareth yang disalib,<br>dan lindungilah kami dari seteru jahat yang terlihat, dan tidak terlihat,<br>sekarang dan selama-lamanya.</p><hr><h4>Doa untuk Menghormati Yesus Kristus yang Mati Disalib</h4><p>Untuk menghormati kebajikan-Nya yang Ilahi,<br>sehingga dapat membawa kita ke kehidupan abadi yang luhur;<br>Sesungguhnya, bahwa Yesus lahir pada malam Natal;<br>Sesungguhnya, bahwa Yesus dikhitankan pada hari Senin;<br>Sesungguhnya, bahwa Tiga Raja memepersembahkan pujaan-pujaan pada hari ke-13;<br>Sesungguhnya, bahwa Yesus disalibkan pada hari Jumat Suci;<br>Sesungguhnya, bahwa Nikodemus dan Yusuf mengambil Yesus dari Salib, dan menguburnya;<br>Sesungguhnya, bahwa Yesus naik ke Surga.</p><p>Begitulah Tuhan akan melindungi kami sekarang sampai di akhirat.</p><p>O, Bapa yang ada di Surga,<br>di dalam tangan-Mu kami menyerahkan jiwa kami:<br>Yesus, Maria, Anna;<br>Yesus, Maria, Yosef;<br>Yesus, Maria, Yoakim;</p><p>O, Tuhan Yesus Kristus,<br>Karena kesengsaraan yang Kau alami di Kayu Salib;<br>terutama takala jiwa-Mu akan meninggalkan tubuh-Mu,<br>Kasihanilah jiwa kami jika Ia akan meninggalkan dunia ini.</p><p>O, Yesus berilah kami tekad untuk memanggul salibku dengan Dikau,<br>dan ajarilah kami untuk mengganggap kesengsaraan sebagai anugrah,<br>agar kekuasaan Bapa menutupi kami,<br>kebijaksanaan Putra memberkati kami;<br>Kesucian Roh Kudus melindungi kami,<br>agar Tritunggal Suci menerima kami dan<br>membawa kami ke kehidupan kekal.<br>Amin.</p><hr><h4>Kepada Bunda Yesus dari Hati Suci Yesus</h4><p>Ingatlah, O Bunda dari Hati Kudus,<br>Yang mempunyai pengaruh tak terhingga atas Putra-Mu Yesus Kristus,<br>dengan penuh harapan kami mohon perlindunganMu.</p><p>O… O… ibu dari Yesus,<br>sumber abadi suci,<br>yang dapat kaualirkan kepada para umat yang berisi kekayaan cinta kasih,<br>kebijaksanaan, terang dan keluhuran,<br>kami mohon …<br>kami tidak ditolak,<br>karena kau Ibu kami.</p><p>O, ibu yang manis dari Hati Suci Yesus,<br>kabulkan permohonan kami.<br>Amin.</p><hr><h4>Catatan</h4><p><i>Doa Wasiat ini diketemukan pada makam Kristus pada tahun 1515 dan dikirim oleh Santo Bapa kepada Keizer Karel sewaktu akan berangkat perang, juga kepada St. Michael di Paris, di mana sampai sekarang masih tertulis dengan huruf emas.</i></p><p><i>Siapa saja yang setiap hari membaca doa ini, atau mendengarkan, atau membawanya, ia tidak akan mati mendadak, atau mati tenggelam, atau mati di tangan musuh, atau tertawan di dalam peperangan. jika seorang ibu mau melahirkan dan membaca doa ini, atau membawanya akan lekas tertolong dan bayinya akan terhindar dari 82 kecelakaan.</i></p><p><i>Siapa yang membaca doa ini akan terhindar dari penyakit-penyakit. Jika kamu melihat ada seseorang jatuh karena penyakit ayan, letakanlah Doa ini di sebelah kanannya, dia akan bangun dan gembira lagi.</i></p><p><i>Siapa yang memberi doa ini kepada salah seorang (satu keluarga), dia akan saya beri Rahmat, Ucapan Kristus sungguh nyata, seperti Injil Suci.</i></p><p><i>Jika doa ini ada di rumah, tidak akan ada kecelakaan petir dan geludug. Siapa yang membaca, mendengarkan, membawa doa ini, akan tiga hari sebelum ia mati diberi Tuhan tanda, di mana kita dapat tahu “inilah hari kematianku”.</i></p>`,
            latin: `<p><i>(Versi Latin untuk doa ini tidak tersedia.)</i></p>`
        }
    },
    {
        title: 'Doa Pagi',
        content: {
            indonesia: `<p>Ya Tuhanku dan Allahku, aku berlutut, di hadapan-Mu dan bersembah sujud kepada-Mu, Raja tertinggi. Aku mengucap syukur kepada-Mu atas segala kemurahanMu, terlebih atas pemeliharaan-Mu pada malam tadi.</p><p>Aku menyerahkan kepada-Mu jiwa dan badanku serta segala milikku. Aku mempersembahkan kepada-Mu semua saja yang akan ku lakukan hari ini demi kemuliaan nama-Mu, keselamatan manusia dan kejayaan Gereja-Mu.</p><p>Bapa yang penuh kasih sayang kepadaku, aku berniat sungguh-sungguh untuk hidup sebagai seorang Kristen yang sejati pada hari ini dan tidak mau menghinakan Dikau. Aku mau memenuhi kewajibanku dengan sebaik-baiknya. Allah yang Maha Rahim, berikanlah aku rahmat-Mu agar aku setia pada niatku ini. Amin.</p>`,
            latin: `<p><i>(Versi Latin untuk doa ini tidak tersedia.)</i></p>`
        }
    },
    {
        title: 'Doa Malam',
        content: {
            indonesia: `<p>Ya Tuhanku dan Allahku, Aku berlutut di hadapan-Mu dan bersembah sujud kepada-Mu, Raja Tertinggi. Aku mengucap syukur kepada-Mu atas segala kemurahanMu, terlebih ata pemeliharaan-Mu pada hari yang lalu.</p><p>Datanglah hai Roh Kudus, terangilah akal budiku, supaya aku mengetahui dosa-dosaku dan berilah aku rahmat-Mu supaya aku dapat menyesal sungguh atas dosa-dosaku itu. Amin.</p>`,
            latin: `<p><i>(Versi Latin untuk doa ini tidak tersedia.)</i></p>`
        }
    },
    {
        title: 'Ratu Surga (Masa Paskah)',
        content: {
            indonesia: `<p>P. Ratu surga bersukacitalah, Alleluya.<br>U. Sebab Dia yang boleh kau kandungkan, Alleluya.</p><p>P. Telah bangkit seperti disabdakan-Nya, Alleluya.<br>U. Doakanlah kami pada Allah, Alleluya.</p><p>P. Bersukacitalah dan bergembiralah Perawan Maria, Alleluya.<br>U. Sebab Tuhan sungguh telah bangkit, Alleluya.</p><p><b>Marilah kita berdoa:</b><br>Ya Allah, Engkau telah berkenan menggembirakan dunia dengan kebangkitan Tuhan kami Yesus Kristus. Kami mohon, berilah supaya dengan pengantaraan Bunda-Nya, Perawan Maria, kami bersukacita dalam kehidupan yang kekal. Karena Kristus Tuhan kami. Amin.</p>`,
            latin: `<p><i>(Versi Latin untuk doa ini tidak tersedia.)</i></p>`
        }
    },
    {
        title: 'Doa Datanglah Roh Kudus',
        content: {
            indonesia: `<p>Datanglah, ya Roh Kudus, penuhilah hati umat-Mu dan nyalakanlah di dalamnya api cinta-Mu. Utuslah Roh-Mu maka semuanya akan dijadikan lagi, dan Engkau akan membaharui muka bumi.</p><p><b>Marilah berdoa:</b><br>Ya Allah, Engkau telah mengajar hati umat-Mu dengan penerangan Roh Kudus. Berilah supaya berkat Roh Kudus itu kami senantiasa berpikir benar dan bijaksana, serta selalu merasa gembira karena penghibur-Nya. Demi Kristus, Tuhan kami. Amin.</p>`,
            latin: `<p><i>(Versi Latin untuk doa ini tidak tersedia.)</i></p>`
        }
    },
    {
        title: 'Rosario Tujuh Duka Maria',
        content: {
            indonesia: `<h4>Pembukaan</h4><p>Tuhan, aku mempersembahkan Rosario ini bagi kemuliaan-Mu, agar aku dapat menghormati Bunda Yesus, Perawan Terberkati, sehingga aku dapat berbagi dan merenungkan penderitaan Yesus melalui penderitaan dirinya. Aku dengan rendah hati memohon kepada-Mu untuk memberikan pertobatan sejati bagi semua dosa-dosa yang telah kuperbuat, dan mohon berilah aku kebijaksanaan, dan kerendahan hati.</p><p><b>Awal doa:</b><br>Ya Allah, datanglah menolong aku, O Tuhan bersegeralah menolongku,<br>Kemuliaan kepada Bapa, Putera dan Roh Kudus, sekarang dan selama-lamanya. Amin.</p><p><b>Doa sebelum renungan:</b><br>Bundaku, bagilah kesedihanmu kepadaku,<br>Biarlah aku ikut menanggungnya bersamamu, untuk merenungkan kematian Yesusmu bersamaku.</p><hr><p><b>Doa Tobat</b><br>Allah yang maharahim, aku menyesal atas dosa-dosaku...</p><p><b>Salam Maria (3 kali)</b><br>Salam Maria, penuh rahmat, Tuhan sertamu...</p><p>Lalu disambung dengan doa singkat berikut:<br><i>Bersama airmata kasih sayang Dukacita Bunda kami dan untuk mempersembahkan paduan air mata kami dengan airmata-nya.</i></p><p>Sebelum setiap misteri, doakan:<br><i>Bunda Kerahiman, ingatkan kami selalu pada derita Putera-mu, Yesus.</i></p><hr><h4>Duka ke-1: Nubuat Simeon (Luk 2 : 34-35)</h4><p>Bunda yang berduka, aku turut bersedih karena pedang penderitaan pertama yang menusuk hatimu; pada saat di Bait Allah, Simeon tua bernubuat bahwa segala kekejaman akan dialami oleh Yesusmu terkasih...</p><p><i>1x Bapa kami, 7x Salam Maria, 1x Bundaku, …</i></p><hr><h4>Duka ke-2 : Pelarian ke Mesir (Mat 2 : 13-14)</h4><p>Bunda yang berduka. Aku turut bersedih karena pedang penderitaan kedua yang menusuk hatimu...</p><p><i>1x Bapa kami, 7x Salam Maria, 1x Bundaku,…</i></p><hr><h4>Duka ke-3: Yesus hilang di Yerusalem (Luk 2:43-45)</h4><p>Bunda yang berduka, aku ikut bersedih karena pedang penderitaan ketiga yang menusuk hatimu...</p><p><i>1x Bapa kami, 7x Salam Maria, 1x Bundaku,…</i></p><hr><h4>Duka ke-4: Maria bertemu Yesus di jalan menuju Kalvari (Luk 23:27-31)</h4><p>Bunda yang berduka, aku ikut bersedih karena pedang penderitaan keempat yang menusuk hatimu...</p><p><i>1x Bapa kami, 7x Salam Maria, 1x Bundaku,…</i></p><hr><h4>Duka ke-5: Yesus wafat di kayu salib (Yoh 19:25-27)</h4><p>Bunda yang berduka, aku turut bersedih karena pedang penderitaan kelima yang menusuk hatimu...</p><p><i>1x Bapa kami, 7x Salam Maria, 1x Bundaku,…</i></p><hr><h4>Duka ke-6: Yesus diturunkan dari kayu salib (Yoh 19:40)</h4><p>Bunda yang berduka, aku ikut bersedih karena pedang penderitaan keenam yang menusuk hatimu...</p><p><i>1x Bapa kami, 7x Salam Maria, 1x Bundaku,…</i></p><hr><h4>Duka ke-7: Yesus dimakamkan (Yoh 19:38-42)</h4><p>Bunda yang berduka, aku turut bersedih karena pedang penderitaan ketujuh yang menusuk hatimu...</p><p><i>1x Bapa kami, 7x Salam Maria, 1x Bundaku,…</i></p><hr><h4>Doa Penutup</h4><p>Ya Allah, karena sengsara-Mu yang telah dinubuatkan oleh Simeon... Amin.</p>`,
            latin: `<p><i>(Versi Latin untuk doa ini tidak tersedia.)</i></p>`
        }
    },
    {
        title: 'Novena Hati Kudus Yesus',
        content: {
            indonesia: `<h4>Pengantar</h4><p>Hati Kudus Yesus adalah hati umat manusia yang merupakan lambang pusat kepribadian Yesus...</p><p>Novena ini dilakukan selama 9 hari berturut-turut pada jam yang sama.</p><hr><h4>Urutan Doa Novena Kepada Hati Kudus Yesus</h4><h5>1. Doa Pembukaan</h5><p><b>Syahadat Para Rasul</b><br>Aku percaya akan Allah, Bapa Yang Maha Kuasa, pencipta langit dan bumi...</p><h5>2. Novena Kepada Hati Kudus Yesus</h5><p>Ya Yesus, Engkau berkata: “Mintalah, maka akan diberikan kepadamu...<br><i>(Sebutkan permohonan/ujud doa pribadi ….)</i></p><hr><p>Ya Yesus, Engkau berkata: “Apa saja yang kau minta kepada Bapa-Ku dengan nama-Ku...<br><i>(Sebutkan permohonan/ujud doa pribadi ….)</i></p><hr><p>Ya Yesus, Engkau berkata: “Langit dan bumi akan musnah, tetapi Sabda-Ku tidak akan musnah.”<br><i>(Sebutkan permohonan/ujud doa pribadi ….)</i></p><hr><p>Yesusku, Tuhan jiwaku, Engkau berjanji bahwa Hati Kudus-Mu akan menjadi laut kerahiman...</p><hr><p>Ya Yesus, aku berharap pada-Mu dan percaya...</p><p><b>Bapa Kami (1x)</b>...<br><b>Salam Maria (1x)</b>...<br><b>Kemuliaan (1x)</b>...</p><hr><p><b>Hati Kudus Yesus, aku berharap pada-Mu (10x)</b></p><p>Ya Yesus yang baik, Engkau berkata: “Jika engkau hendak menyenangkan Daku, percayalah kepada-Ku...</p><h5>3. Doa Kepada Hati Kudus Yesus</h5><p>Ya Tuhan, aku berdoa, agar di rumahku ada damai, ketenangan dan kesejahteraan di dalam naungan-Mu... Amin.</p>`,
            latin: `<p><i>(Versi Latin untuk novena ini tidak tersedia.)</i></p>`
        }
    },
    {
        title: 'Novena Kerahiman Ilahi',
        content: {
            indonesia: `<h4>Pengantar</h4><p>Fokus utama dari Devosi Kerahiman Ilahi adalah cinta belas kasihan Allah...</p><hr><h4>Urutan Doa Novena Kerahiman Ilahi</h4><h5>1. Bacaan Dari Kitab Suci</h5><p><i>(Bacalah bagian Kitab Suci yang ditentukan pada hari itu, kemudian renungkanlah.)</i></p><p><b>Hari Pertama:</b> Perumpamaan tentang domba yang hilang (Luk 15:1-10)...</p><p>... <i>(dan seterusnya untuk hari-hari lain)</i> ...</p><h5>2. Doa Koronka</h5><p><i>(Doa Koronka/Kerahiman diajarkan Tuhan Yesus sendiri...)</i></p><p><b>Bapa Kami</b>...<br><b>Salam Maria</b>...<br><b>Syahadat Para Rasul</b>...</p><p><b>Pada manik besar (Bapa Kami), doakan:</b><br>Bapa yang kekal kupersembahkan kepada-Mu...</p><p><b>Pada setiap sepuluhan manik kecil (Salam Maria), doakan:</b><br>Demi sengsara Yesus yang pedih...</p><p><b>Diakhiri dengan tiga kali mengucapkan:</b><br>Allah yang kudus, kudus dan berkuasa...</p><hr><h5>Litani Kerahiman Ilahi</h5><p>Tuhan kasihanilah kami...<br><b>Marilah berdoa:</b><br>Allah, yang kerahiman-Mu tak dapat dipahami... Amin.</p>`,
            latin: `<p><i>(Versi Latin untuk novena ini tidak tersedia.)</i></p>`
        }
    }
];

document.addEventListener('DOMContentLoaded', () => {

    const db = firebase.firestore();
    const lightbox = GLightbox({ selector: '.glightbox' });
    particlesJS.load('particles-js', 'assets/particles.json', () => {});

    const showLoading = (container, message = 'Memuat data...') => {
        if (!container) return;
        container.innerHTML = `<div class="feedback-container"><div class="spinner"></div><p>${message}</p></div>`;
    };
    const showError = (container, message) => {
        if (container) {
            container.innerHTML = `<div class="error-alert"><strong>Gagal Memuat:</strong> ${message}</div>`;
        }
    };

    const loadWeeklyLiturgy = async () => {
        const currentContainer = document.getElementById('current-week-tpe');
        const nextContainer = document.getElementById('next-week-tpe');
        const controlsContainer = document.getElementById('tpe-preview-controls');
        const previewBtn = document.getElementById('tpe-preview-btn');
    
        if (!currentContainer) return;
    
        const now = new Date();
        const dayOfWeek = now.getDay();
        const diffToLastSaturday = (dayOfWeek + 1) % 7;
        const lastSaturday = new Date(now);
        lastSaturday.setDate(now.getDate() - diffToLastSaturday);
        lastSaturday.setHours(0, 1, 0, 0);
    
        const year = lastSaturday.getFullYear();
        const month = String(lastSaturday.getMonth() + 1).padStart(2, '0');
        const day = String(lastSaturday.getDate()).padStart(2, '0');
        const targetDateString = `${year}-${month}-${day}`;
    
        const createTpeHtml = (data) => {
            if (!data) {
                return '<div class="alert alert-warning text-center">Tata Perayaan Ekaristi untuk minggu ini belum tersedia.</div>';
            }

            const tableRows = (data.jadwal_misa || []).map(misa => `
                <tr>
                    <td data-label="Jam">${misa.jam || '-'}</td>
                    <td data-label="Tempat">${misa.tempat || '-'}</td>
                    <td data-label="Perayaan">${misa.perayaan || '-'}</td>
                    <td data-label="Pelayan">${misa.pelayan || '-'}</td>
                </tr>
            `).join('');
            
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
                if (!htmlContent) return '';
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = htmlContent;
                const paragraphs = tempDiv.querySelectorAll('p');
                let result = '';
                paragraphs.forEach(p => {
                    const text = p.textContent.trim();
                    if (text.startsWith('P:') || text.startsWith('I:')) {
                        p.classList.add('doa-umat-baris', 'pemimpin');
                    } else if (text.startsWith('U:')) {
                        p.classList.add('doa-umat-baris', 'umat');
                    } else {
                         p.classList.add('doa-umat-baris');
                    }
                    result += p.outerHTML;
                });
                return `<div class="section-content">${result}</div>`;
            };

            const createSection = (title, content) => {
                if (!content) return '';
                
                let contentHtml;
                if (title === 'Doa Umat') {
                    contentHtml = formatDoaUmat(content);
                } else {
                    contentHtml = `<div class="section-content">${content}</div>`;
                }

                return `<div class="tpe-section">
                          <h4 class="section-title"><i class="bi bi-cross"></i> ${title}</h4>
                          ${contentHtml}
                        </div>`;
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
                        <div class="tpe-content">
                            ${jadwalHtml}
                            ${tpeHtml}
                        </div>
                    </div>`;
        };
    
        try {
            const snapshot = await db.collection('tata_perayaan_mingguan')
                                     .where(firebase.firestore.FieldPath.documentId(), '>=', targetDateString)
                                     .orderBy(firebase.firestore.FieldPath.documentId(), 'asc')
                                     .limit(2)
                                     .get();
    
            if (snapshot.empty) {
                showError(currentContainer, 'Tata Perayaan Ekaristi untuk minggu ini belum tersedia.');
                return;
            }
    
            const currentData = snapshot.docs[0]?.data();
            const nextData = snapshot.docs[1]?.data();
            currentContainer.innerHTML = createTpeHtml(currentData);
    
            if (nextData) {
                nextContainer.innerHTML = createTpeHtml(nextData);
                controlsContainer.style.display = 'block';
                previewBtn.onclick = () => {
                    const isShowingPreview = nextContainer.style.display === 'block';
                    nextContainer.style.display = isShowingPreview ? 'none' : 'block';
                    currentContainer.style.display = isShowingPreview ? 'block' : 'none';
                    previewBtn.innerHTML = isShowingPreview ? 'Lihat Pratinjau Minggu Depan &gt;&gt;' : '&lt;&lt; Kembali ke Minggu Ini';
                };
            } else {
                controlsContainer.style.display = 'none';
            }
    
        } catch (error) {
            console.error("Gagal memuat TPE:", error);
            showError(currentContainer, `Gagal memuat data. (${error.message})`);
        }
    };
    
    const initAccordions = (containerId) => {
        const container = document.getElementById(containerId);
        if(!container) return;

        const activeHeader = container.querySelector('.accordion-header.active');
        if (activeHeader) {
            const content = activeHeader.nextElementSibling;
            if (content) {
                content.style.padding = "1rem";
                content.style.maxHeight = content.scrollHeight + "px";
            }
        }

        container.addEventListener('click', function(event) {
            const header = event.target.closest('.accordion-header');
            if (!header) return;

            const content = header.nextElementSibling;
            header.classList.toggle('active');

            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                content.style.padding = "0 1rem";
            } else {
                content.style.padding = "1rem";
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    };

    const loadAnnouncementsPublic = async () => {
        const container = document.querySelector('#agenda-container');
        if (!container) return;
        showLoading(container, 'Memuat agenda terbaru...');
        try {
            const snapshot = await db.collection('announcements').orderBy('createdAt', 'desc').get();
            if (snapshot.empty) {
                container.innerHTML = '<p class="text-center my-4">Saat ini belum ada agenda / pengumuman terbaru.</p>';
                return;
            }
            container.innerHTML = snapshot.docs.map(doc => {
                const item = doc.data();
                const catatanFormatted = (item.catatan || 'Tidak ada catatan.').replace(/\n/g, '<br>');
                return `<div class="col-12 mb-4"><div class="card shadow-sm agenda-card"><div class="card-body"><h5 class="card-title text-primary"><i class="bi bi-bookmark-fill me-2"></i>${item.judul}</h5><div class="mt-3 pt-3 border-top"><p class="mb-2"><i class="bi bi-calendar-event me-2"></i><strong>Tanggal:</strong> ${item.tanggal || '-'}</p><p class="mb-2"><i class="bi bi-clock me-2"></i><strong>Jam:</strong> ${item.jam || '-'}</p><p class="mb-2"><i class="bi bi-geo-alt-fill me-2"></i><strong>Lokasi:</strong> ${item.lokasi || '-'}</p><p class="mb-0 mt-3"><i class="bi bi-info-circle-fill me-2"></i><strong>Catatan:</strong><br><span class="d-inline-block mt-1 ps-4">${catatanFormatted}</span></p></div></div></div></div>`;
            }).join('');
        } catch (error) {
            console.error("Gagal memuat pengumuman: ", error);
            showError(container, `Terjadi kesalahan saat memuat agenda. (${error.message})`);
        }
    };
    const loadPastorStatus = async () => {
        const container = document.querySelector('#pastor'); if (!container) return; showLoading(container, 'Memuat status pastor...');
        try {
            const snapshot = await db.collection('pastors').orderBy('order').get(); if (snapshot.empty) { container.innerHTML = '<h2>Kehadiran Pastor Hari Ini</h2><p>Data pastor belum tersedia.</p>'; return; }
            const statusItems = snapshot.docs.map(doc => { const p = doc.data(); const isHadir = p.status === 'Di Tempat'; const indicatorClass = isHadir ? 'green' : 'red'; return `<div><img alt="${p.name}" class="pastor-photo" src="${p.photoUrl}" /><p>${p.name}</p><span class="indicator ${indicatorClass}">${p.status}</span></div>`; }).join('');
            container.innerHTML = `<h2>Kehadiran Pastor Hari Ini</h2><div class="pastor-status">${statusItems}</div><p class="mt-3" style="font-size: 0.9rem; color: #555;">Keterangan:<br/><span class="indicator green" style="padding: 2px 10px;">Di Tempat</span> = Pastor berada di pastoran.<br/><span class="indicator red" style="padding: 2px 10px;">Lainnya</span> = Pastor sedang pelayanan di luar, cuti, atau sakit.</p>`;
        } catch (error) { console.error("Gagal memuat status pastor:", error); showError(container, `Gagal memuat status pastor. (${error.message})`); }
    };
    const loadPublicStats = async () => {
        const tableContainer = document.querySelector('#statistik-table-container');
        const mainContainer = document.querySelector('#statistik');
        if (!tableContainer || !mainContainer) return;
        showLoading(tableContainer, 'Memuat statistik umat...');
        try {
            const snapshot = await db.collection('parish_stats').orderBy('order').get();
            if (snapshot.empty) { mainContainer.innerHTML = '<h2>Statistik Umat</h2><p>Data belum tersedia.</p>'; return; }
            let totalKK = 0, totalLaki = 0, totalPerempuan = 0;
            const tableRows = snapshot.docs.map(doc => { const w = doc.data(); const jumlah = (w.laki_laki || 0) + (w.perempuan || 0); totalKK += w.kk || 0; totalLaki += w.laki_laki || 0; totalPerempuan += w.perempuan || 0; return `<tr><td>${w.order}</td><td>${w.name}</td><td>${w.kk}</td><td>${w.laki_laki}</td><td>${w.perempuan}</td><td>${jumlah}</td></tr>`; }).join('');
            const totalJiwa = totalLaki + totalPerempuan;
            const totalRow = `<tfoot><tr><td colspan="2">Jumlah</td><td>${totalKK}</td><td>${totalLaki}</td><td>${totalPerempuan}</td><td>${totalJiwa}</td></tr></tfoot>`;
            tableContainer.innerHTML = `<table class="stats-table"><thead><tr><th>No</th><th>Nama Wilayah</th><th>KK</th><th>Laki-laki</th><th>Perempuan</th><th>Jumlah Jiwa</th></tr></thead><tbody>${tableRows}</tbody>${totalRow}</table>`;
            const labels = snapshot.docs.map(doc => doc.data().name);
            const data = snapshot.docs.map(doc => (doc.data().laki_laki || 0) + (doc.data().perempuan || 0));
            const ctx = document.getElementById('public-umat-chart').getContext('2d');
            if (publicUmatChart) { publicUmatChart.destroy(); }
            publicUmatChart = new Chart(ctx, { type: 'bar', data: { labels: labels, datasets: [{ label: 'Jumlah Jiwa', data: data, backgroundColor: 'rgba(0, 74, 153, 0.7)', borderColor: 'rgba(0, 74, 153, 1)', borderWidth: 1 }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false }, title: { display: true, text: 'Visualisasi Jumlah Umat per Wilayah/Stasi' } } } });
        } catch (error) { console.error("Gagal memuat statistik umat:", error); showError(mainContainer, `Gagal memuat data. (${error.message})`); }
    };
    const loadSejarahPausFromJson = async () => {
        const container = document.querySelector('#sejarah-paus-container'); if (!container) return; showLoading(container, 'Memuat sejarah Paus...');
        try {
            const response = await fetch('sejarah_paus.json'); if (!response.ok) throw new Error(`Gagal memuat file: ${response.statusText}`);
            const allPopes = await response.json();
            const renderTable = (popes) => { const tableBody = document.getElementById('pope-table-body'); if (!tableBody) return; tableBody.innerHTML = popes.map(pope => `<tr><td data-label="No.">${pope.urutan}</td><td data-label="Nama Paus"><strong>${pope.nama}</strong><small class="pope-latin-name">${pope.nama_latin}</small></td><td data-label="Masa Jabatan">${pope.masa_jabatan}</td><td data-label="Negara Asal">${pope.negara_asal || '-'}</td><td data-label="Catatan">${pope.catatan || '-'}</td></tr>`).join(''); };
            container.innerHTML = `<div class="pope-search-wrapper"><input type="text" id="popeSearchInput" class="form-control" placeholder="Cari Paus (nama, tahun, negara)..."></div><div class="pope-table-wrapper"><table class="pope-table"><thead><tr><th>No.</th><th>Nama Paus</th><th>Masa Jabatan</th><th>Negara Asal</th><th>Catatan Singkat</th></tr></thead><tbody id="pope-table-body"></tbody></table></div>`;
            renderTable(allPopes);
            document.getElementById('popeSearchInput').addEventListener('input', (e) => { const query = e.target.value.toLowerCase(); const filteredPopes = allPopes.filter(pope => pope.nama.toLowerCase().includes(query) || pope.nama_latin.toLowerCase().includes(query) || pope.masa_jabatan.includes(query) || (pope.negara_asal && pope.negara_asal.toLowerCase().includes(query))); renderTable(filteredPopes); });
        } catch (error) { console.error("Gagal memuat Sejarah Paus dari JSON:", error); showError(container, `Pastikan file 'sejarah_paus.json' ada. (${error.message})`); }
    };
    const loadKalenderFromJson = async () => {
        const container = document.querySelector('#kalender-container'); if (!container) return;
        const currentYear = new Date().getFullYear();
        showLoading(container, `Memuat kalender liturgi ${currentYear}...`);
        try {
            const response = await fetch('kalender_liturgi_2025.json'); if (!response.ok) throw new Error(`Gagal memuat file: ${response.statusText}`);
            const data = await response.json();
            const groupedByMonth = data.reduce((acc, item) => { const date = new Date(item.tanggal + 'T12:00:00Z'); const monthYear = date.toLocaleString('id-ID', { month: 'long', year: 'numeric' }); if (!acc[monthYear]) acc[monthYear] = []; acc[monthYear].push(item); return acc; }, {});
            let html = '';
            const sortedMonths = Object.keys(groupedByMonth).sort((a, b) => new Date('01 ' + a.replace(' ', ' ')) - new Date('01 ' + b.replace(' ', ' ')));
            for (const month of sortedMonths) {
                html += `<h3 class="kalender-bulan">${month}</h3><ul class="kalender-list">`;
                groupedByMonth[month].forEach(item => { const date = new Date(item.tanggal + 'T12:00:00Z'); const judul = item.judul || 'Tidak ada judul'; const getWarnaClass = (j) => { if (j.includes('Hari Raya')) return 'dot-red'; if (j.includes('Pesta')) return 'dot-white'; if (j.includes('Biasa')) return 'dot-green'; if (j.includes('Adven') || j.includes('Prapaskah')) return 'dot-purple'; return 'dot-default'; }; html += `<li class="kalender-item"><div class="kalender-tanggal"><span class="tanggal-angka">${date.getDate()}</span><span class="tanggal-hari">${date.toLocaleDateString('id-ID', { weekday: 'long' })}</span></div><div class="kalender-info"><span class="kalender-judul ${getWarnaClass(judul)}">${judul}</span><span class="kalender-deskripsi">${(item.deskripsi || '').replace(/\n/g, '<br>')}</span></div></li>`; });
                html += '</ul>';
            }
            container.innerHTML = html;
        } catch (error) { console.error("Gagal memuat Kalender Liturgi dari JSON:", error); showError(container, `Pastikan file 'kalender_liturgi_2025.json' ada. (${error.message})`); }
    };
    const loadPrayers = () => {
        const listContainer = document.querySelector('#doa-list-container');
        const detailContainer = document.querySelector('#doa-detail-container');
        const doaList = document.querySelector('#doa-list');
        const backBtn = document.querySelector('#doa-back-btn');
        const detailTitle = document.querySelector('#doa-detail-title');
        const detailContent = document.querySelector('#doa-detail-content');
        const langSelector = document.querySelector('#doa-lang-selector');

        if (!listContainer || !prayersData) return;
        let currentPrayer = null;
        doaList.innerHTML = prayersData.map(prayer => `<button type="button" class="list-group-item list-group-item-action">${prayer.title}</button>`).join('');
        const renderPrayerContent = (lang) => {
            if (currentPrayer) {
                detailContent.innerHTML = currentPrayer.content[lang];
                langSelector.querySelectorAll('button').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
            }
        };
        doaList.addEventListener('click', (e) => {
            if (e.target && e.target.matches('button.list-group-item-action')) {
                const clickedTitle = e.target.textContent.trim();
                currentPrayer = prayersData.find(p => p.title === clickedTitle);
                if (currentPrayer) {
                    detailTitle.textContent = currentPrayer.title;
                    renderPrayerContent('indonesia');
                    listContainer.style.display = 'none';
                    detailContainer.style.display = 'block';
                }
            }
        });
        backBtn.addEventListener('click', () => {
            detailContainer.style.display = 'none';
            listContainer.style.display = 'block';
            currentPrayer = null;
        });
        langSelector.addEventListener('click', (e) => {
            if (e.target && e.target.matches('button')) {
                renderPrayerContent(e.target.dataset.lang);
            }
        });
    };

    function activateTab(tabId) {
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
        document.querySelectorAll('.tab-content').forEach(content => {
            const isActive = content.id === tabId;
            content.classList.toggle('active', isActive);
            if (content.id === 'doa' && !isActive) {
                document.querySelector('#doa-detail-container').style.display = 'none';
                document.querySelector('#doa-list-container').style.display = 'block';
            }
        });
        const sidebarMenu = document.getElementById('sidebarMenu');
        if (window.innerWidth <= 992 && sidebarMenu.classList.contains('active')) {
            sidebarMenu.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        }
    }
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    const sidebarMenu = document.getElementById('sidebarMenu');
    if (sidebarToggleBtn && sidebarMenu) {
        sidebarToggleBtn.addEventListener('click', () => {
            sidebarMenu.classList.toggle('active');
            document.body.classList.toggle('sidebar-open');
        });
        document.body.addEventListener('click', (event) => {
            if (window.innerWidth <= 992 && document.body.classList.contains('sidebar-open') && !sidebarMenu.contains(event.target) && !sidebarToggleBtn.contains(event.target)) {
                sidebarMenu.classList.remove('active');
                document.body.classList.remove('sidebar-open');
            }
        });
    }
    document.querySelectorAll('#sidebarMenu .tab-button[data-tab]').forEach(button => {
        button.addEventListener('click', (event) => { event.preventDefault(); activateTab(button.dataset.tab); });
    });
    
    const loadInitialData = async () => {
        await loadWeeklyLiturgy(); 
        initAccordions('current-week-tpe');
        initAccordions('next-week-tpe');
        loadAnnouncementsPublic();
        loadPastorStatus();
        loadPublicStats();
        loadKalenderFromJson();
        loadSejarahPausFromJson();
        loadPrayers();
    };
    
    loadInitialData();
    activateTab('beranda');
    
    const previewModal = document.getElementById('previewModal');
    if (previewModal) {
      const modalTitle = document.getElementById('previewModalLabel');
      const pdfViewer = document.getElementById('pdf-viewer');
      const downloadBtn = document.getElementById('download-pdf-btn');
      const printBtn = document.getElementById('print-pdf-btn');
    
      previewModal.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;
        const pdfSrc = button.getAttribute('data-pdf-src');
        const formName = button.textContent.trim();
        modalTitle.textContent = 'Pratinjau: ' + formName;
        pdfViewer.src = pdfSrc;
        downloadBtn.href = pdfSrc;
        downloadBtn.setAttribute('download', formName.replace(/\s+/g, '-') + '.pdf');
      });
    
      printBtn.addEventListener('click', function () {
        if (pdfViewer.contentWindow) {
            pdfViewer.contentWindow.print();
        }
      });
    
      previewModal.addEventListener('hidden.bs.modal', function () {
        pdfViewer.src = 'about:blank';
      });
    }
});