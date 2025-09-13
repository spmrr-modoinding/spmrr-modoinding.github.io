// script.js (Versi Final & Lengkap)

let publicUmatChart = null;

// =================================================================
// DATA DOA-DOA (Disimpan di sini, bukan di Firebase)
// Teks kini diformat dengan tag HTML (<p>, <h4>, dll.) untuk jarak yang lebih baik.
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
            latin: `<p>Credo in unum Deum, Patrem omnipotentem, factorem caeli et terrae, visibilium omnium, et invisibilium.</p>
<p>Et in unum Dominum Jesum Christum, Filium Dei unigenitum. Et ex Patre natum ante omnia saecula. Deum de Deo, Lumen de lumine, Deum verum de Deo vero. Genitum, non factum, consubstantialem Patri: per quem omnia facta sunt.</p>
<p>Qui propter nos homines, et propter nostram salutem descendit de caelis. Et incarnatus est de Spiritu Sancto ex Maria Virgine: Et homo factus est. Crucifixus etiam pro nobis: sub Pontio Pilato passus, et sepultus est. Et resurrexit tertia die, secundum Scripturas. Et ascendit in caelum: sedet ad dexteram Patris.</p>
<p>Et iterum venturus est cum gloria, judicare vivos et mortuos: cuius regni non erit finis.</p>
<p>Et in Spiritum Sanctum, Dominum, et vivificantem: qui ex Patre Filioque procedit. Qui cum Patre et Filio simul adoratur, et conglorificatur: qui locutus est per Prophetas.</p>
<p>Et unam sanctam catholicam et apostolicam Ecclesiam. Confiteor unum baptisma in remissionem peccatorum. Et exspecto resurrectionem mortuorum. Et vitam venturi saeculi. Amen.</p>`
        }
    },
    {
        title: 'Salam Maria',
        content: {
            indonesia: `<p>Salam Maria, penuh rahmat, Tuhan sertamu,<br>
terpujilah engkau di antara wanita, dan terpujilah buah tubuhmu, Yesus.</p>
<p>Santa Maria, bunda Allah, doakanlah kami yang berdosa ini, sekarang dan waktu kami mati. Amin.</p>`,
            latin: `<p>Ave Maria, gratia plena, Dominus tecum,<br>
benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus.</p>
<p>Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.</p>`
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
            indonesia: `<h4>Doa Kepada Salib Suci Kristus</h4>
<p>Terpujilah Tuhan Yesus Kristus,<br>
Yang wafat di kayu salib,<br>
disalib untuk dosa kita.</p>
<p>Kristus Suci yang disalibkan, mohon selalu beserta kami;<br>
Kristus Suci yang disalibkan, mohon perlindungan;<br>
Kristus Suci yang disalibkan, Kau adalah terang Abadi untuk keluarga kami;<br>
Kristus Suci yang disalibkan, lindungilah kami dari senjata tajam;<br>
Kristus Suci yang disalibkan, datanglah di akhir perjalanan hidup kami;<br>
Kristus Suci yang disalibkan, lindungilah kami dari godaan dalam menghadapi maut;<br>
Kristus Suci yang disalibkan, lindungilah kami dari malapetaka;</p>
<p>Salib Suci Kristus kami luhurkan Dikau,<br>
O Yesus dari Nazareth yang disalib,<br>
dan lindungilah kami dari seteru jahat yang terlihat, dan tidak terlihat,<br>
sekarang dan selama-lamanya.</p>
<hr>
<h4>Doa untuk Menghormati Yesus Kristus yang Mati Disalib</h4>
<p>Untuk menghormati kebajikan-Nya yang Ilahi,<br>
sehingga dapat membawa kita ke kehidupan abadi yang luhur;<br>
Sesungguhnya, bahwa Yesus lahir pada malam Natal;<br>
Sesungguhnya, bahwa Yesus dikhitankan pada hari Senin;<br>
Sesungguhnya, bahwa Tiga Raja memepersembahkan pujaan-pujaan pada hari ke-13;<br>
Sesungguhnya, bahwa Yesus disalibkan pada hari Jumat Suci;<br>
Sesungguhnya, bahwa Nikodemus dan Yusuf mengambil Yesus dari Salib, dan menguburnya;<br>
Sesungguhnya, bahwa Yesus naik ke Surga.</p>
<p>Begitulah Tuhan akan melindungi kami sekarang sampai di akhirat.</p>
<p>O, Bapa yang ada di Surga,<br>
di dalam tangan-Mu kami menyerahkan jiwa kami:<br>
Yesus, Maria, Anna;<br>
Yesus, Maria, Yosef;<br>
Yesus, Maria, Yoakim;</p>
<p>O, Tuhan Yesus Kristus,<br>
Karena kesengsaraan yang Kau alami di Kayu Salib;<br>
terutama takala jiwa-Mu akan meninggalkan tubuh-Mu,<br>
Kasihanilah jiwa kami jika Ia akan meninggalkan dunia ini.</p>
<p>O, Yesus berilah kami tekad untuk memanggul salibku dengan Dikau,<br>
dan ajarilah kami untuk mengganggap kesengsaraan sebagai anugrah,<br>
agar kekuasaan Bapa menutupi kami,<br>
kebijaksanaan Putra memberkati kami;<br>
Kesucian Roh Kudus melindungi kami,<br>
agar Tritunggal Suci menerima kami dan<br>
membawa kami ke kehidupan kekal.<br>
Amin.</p>
<hr>
<h4>Kepada Bunda Yesus dari Hati Suci Yesus</h4>
<p>Ingatlah, O Bunda dari Hati Kudus,<br>
Yang mempunyai pengaruh tak terhingga atas Putra-Mu Yesus Kristus,<br>
dengan penuh harapan kami mohon perlindunganMu.</p>
<p>O… O… ibu dari Yesus,<br>
sumber abadi suci,<br>
yang dapat kaualirkan kepada para umat yang berisi kekayaan cinta kasih,<br>
kebijaksanaan, terang dan keluhuran,<br>
kami mohon …<br>
kami tidak ditolak,<br>
karena kau Ibu kami.</p>
<p>O, ibu yang manis dari Hati Suci Yesus,<br>
kabulkan permohonan kami.<br>
Amin.</p>
<hr>
<h4>Catatan</h4>
<p><i>Doa Wasiat ini diketemukan pada makam Kristus pada tahun 1515 dan dikirim oleh Santo Bapa kepada Keizer Karel sewaktu akan berangkat perang, juga kepada St. Michael di Paris, di mana sampai sekarang masih tertulis dengan huruf emas.</i></p>
<p><i>Siapa saja yang setiap hari membaca doa ini, atau mendengarkan, atau membawanya, ia tidak akan mati mendadak, atau mati tenggelam, atau mati di tangan musuh, atau tertawan di dalam peperangan. jika seorang ibu mau melahirkan dan membaca doa ini, atau membawanya akan lekas tertolong dan bayinya akan terhindar dari 82 kecelakaan.</i></p>
<p><i>Siapa yang membaca doa ini akan terhindar dari penyakit-penyakit. Jika kamu melihat ada seseorang jatuh karena penyakit ayan, letakanlah Doa ini di sebelah kanannya, dia akan bangun dan gembira lagi.</i></p>
<p><i>Siapa yang memberi doa ini kepada salah seorang (satu keluarga), dia akan saya beri Rahmat, Ucapan Kristus sungguh nyata, seperti Injil Suci.</i></p>
<p><i>Jika doa ini ada di rumah, tidak akan ada kecelakaan petir dan geludug. Siapa yang membaca, mendengarkan, membawa doa ini, akan tiga hari sebelum ia mati diberi Tuhan tanda, di mana kita dapat tahu “inilah hari kematianku”.</i></p>`,
            latin: `<p><i>(Versi Latin untuk doa ini tidak tersedia.)</i></p>`
        }
    },
    {
        title: 'Doa Pagi',
        content: {
            indonesia: `<p>Ya Tuhanku dan Allahku, aku berlutut, di hadapan-Mu dan bersembah sujud kepada-Mu, Raja tertinggi. Aku mengucap syukur kepada-Mu atas segala kemurahanMu, terlebih atas pemeliharaan-Mu pada malam tadi.</p>
<p>Aku menyerahkan kepada-Mu jiwa dan badanku serta segala milikku. Aku mempersembahkan kepada-Mu semua saja yang akan ku lakukan hari ini demi kemuliaan nama-Mu, keselamatan manusia dan kejayaan Gereja-Mu.</p>
<p>Bapa yang penuh kasih sayang kepadaku, aku berniat sungguh-sungguh untuk hidup sebagai seorang Kristen yang sejati pada hari ini dan tidak mau menghinakan Dikau. Aku mau memenuhi kewajibanku dengan sebaik-baiknya. Allah yang Maha Rahim, berikanlah aku rahmat-Mu agar aku setia pada niatku ini. Amin.</p>`,
            latin: `<p><i>(Versi Latin untuk doa ini tidak tersedia.)</i></p>`
        }
    },
    {
        title: 'Doa Malam',
        content: {
            indonesia: `<p>Ya Tuhanku dan Allahku, Aku berlutut di hadapan-Mu dan bersembah sujud kepada-Mu, Raja Tertinggi. Aku mengucap syukur kepada-Mu atas segala kemurahanMu, terlebih ata pemeliharaan-Mu pada hari yang lalu.</p>
<p>Datanglah hai Roh Kudus, terangilah akal budiku, supaya aku mengetahui dosa-dosaku dan berilah aku rahmat-Mu supaya aku dapat menyesal sungguh atas dosa-dosaku itu. Amin.</p>`,
            latin: `<p><i>(Versi Latin untuk doa ini tidak tersedia.)</i></p>`
        }
    },
    {
        title: 'Ratu Surga (Masa Paskah)',
        content: {
            indonesia: `<p>P. Ratu surga bersukacitalah, Alleluya.<br>
U. Sebab Dia yang boleh kau kandungkan, Alleluya.</p>
<p>P. Telah bangkit seperti disabdakan-Nya, Alleluya.<br>
U. Doakanlah kami pada Allah, Alleluya.</p>
<p>P. Bersukacitalah dan bergembiralah Perawan Maria, Alleluya.<br>
U. Sebab Tuhan sungguh telah bangkit, Alleluya.</p>
<p><b>Marilah kita berdoa:</b><br>
Ya Allah, Engkau telah berkenan menggembirakan dunia dengan kebangkitan Tuhan kami Yesus Kristus. Kami mohon, berilah supaya dengan pengantaraan Bunda-Nya, Perawan Maria, kami bersukacita dalam kehidupan yang kekal. Karena Kristus Tuhan kami. Amin.</p>`,
            latin: `<p><i>(Versi Latin untuk doa ini tidak tersedia.)</i></p>`
        }
    },
    {
        title: 'Doa Datanglah Roh Kudus',
        content: {
            indonesia: `<p>Datanglah, ya Roh Kudus, penuhilah hati umat-Mu dan nyalakanlah di dalamnya api cinta-Mu. Utuslah Roh-Mu maka semuanya akan dijadikan lagi, dan Engkau akan membaharui muka bumi.</p>
<p><b>Marilah berdoa:</b><br>
Ya Allah, Engkau telah mengajar hati umat-Mu dengan penerangan Roh Kudus. Berilah supaya berkat Roh Kudus itu kami senantiasa berpikir benar dan bijaksana, serta selalu merasa gembira karena penghibur-Nya. Demi Kristus, Tuhan kami. Amin.</p>`,
            latin: `<p><i>(Versi Latin untuk doa ini tidak tersedia.)</i></p>`
        }
    },
    {
        title: 'Rosario Tujuh Duka Maria',
        content: {
            indonesia: `<h4>Pembukaan</h4>
<p>Tuhan, aku mempersembahkan Rosario ini bagi kemuliaan-Mu, agar aku dapat menghormati Bunda Yesus, Perawan Terberkati, sehingga aku dapat berbagi dan merenungkan penderitaan Yesus melalui penderitaan dirinya. Aku dengan rendah hati memohon kepada-Mu untuk memberikan pertobatan sejati bagi semua dosa-dosa yang telah kuperbuat, dan mohon berilah aku kebijaksanaan, dan kerendahan hati.</p>
<p><b>Awal doa:</b><br>
Ya Allah, datanglah menolong aku, O Tuhan bersegeralah menolongku,<br>
Kemuliaan kepada Bapa, Putera dan Roh Kudus, sekarang dan selama-lamanya. Amin.</p>
<p><b>Doa sebelum renungan:</b><br>
Bundaku, bagilah kesedihanmu kepadaku,<br>
Biarlah aku ikut menanggungnya bersamamu, untuk merenungkan kematian Yesusmu bersamaku.</p>
<hr>
<p><b>Doa Tobat</b><br>Allah yang maharahim, aku menyesal atas dosa-dosaku...</p>
<p><b>Salam Maria (3 kali)</b><br>Salam Maria, penuh rahmat, Tuhan sertamu...</p>
<p>Lalu disambung dengan doa singkat berikut:<br>
<i>Bersama airmata kasih sayang Dukacita Bunda kami dan untuk mempersembahkan paduan air mata kami dengan airmata-nya.</i></p>
<p>Sebelum setiap misteri, doakan:<br>
<i>Bunda Kerahiman, ingatkan kami selalu pada derita Putera-mu, Yesus.</i></p>
<hr>
<h4>Duka ke-1: Nubuat Simeon (Luk 2 : 34-35)</h4>
<p>Bunda yang berduka, aku turut bersedih karena pedang penderitaan pertama yang menusuk hatimu; pada saat di Bait Allah, Simeon tua bernubuat bahwa segala kekejaman akan dialami oleh Yesusmu terkasih. Kau telah mengetahuinya dari Kitab Suci, bahwa kekejaman akan mengakibatkan kematian-Nya di depan matamu, diatas kayu salib hina, kehabisan darah, ditolak oleh banyak orang; sedangkan engkau tak berdaya membela atau menolongnya. Demi penderitaan hatimu aku mohon padamu, Ratuku, perolehkanlah bagiku rahmat sehingga selama hidup dan pada saat ajal aku selalu mengingat akan sengsara Yesus, dan kedukaanmu selalu tertanam dihatiku.</p>
<p><i>1x Bapa kami, 7x Salam Maria, 1x Bundaku, …</i></p>
<hr>
<h4>Duka ke-2 : Pelarian ke Mesir (Mat 2 : 13-14)</h4>
<p>Bunda yang berduka. Aku turut bersedih karena pedang penderitaan kedua yang menusuk hatimu; pada saat tak lama setelah kelahiran-Nya, puteramu yang tak berdosa terancam kematian, yang dilakukan justru oleh orang-orang yang akan diselamatkan-Nya dengan kedatangan-Nya di dunia ini sehingga dalam kegelapan malam engkau beserta puteramu dan suamimu St.Josef lari ke Mesir. Dan engkau, wanita muda yang lemah lembut, telah melakukan perjalanan panjang yang melelahkan dengan mengalami banyak kesulitan bersama puteramu yang masih lemah, melalui padang pasir dan kota yang tidak bersahabat, dan akhirnya, sebagai orang asing yang tidak mengenal siapapun, engkau telah hidup selama bertahun-tahun dalam kemiskinan dan kehinaan. Aku mohon, Bundaku terkasih, perolehkanlah bagiku rahmat untuk menderita bersamamu dengan kesabaran hingga ajal, yang merupakan akhir kehidupan yang menyedihkan ini, sehingga akhirnya aku diperkenankan untuk menghindari hukuman abadi neraka yang pantas ku peroleh.</p>
<p><i>1x Bapa kami, 7x Salam Maria, 1x Bundaku,…</i></p>
<hr>
<h4>Duka ke-3: Yesus hilang di Yerusalem (Luk 2:43-45)</h4>
<p>Bunda yang berduka, aku ikut bersedih karena pedang penderitaan ketiga yang menusuk hatimu; pada saat di Yerusalem engkau kehilangan puteramu terkasih selama 3 hari. Tidak melihat belahan hatimu disampingmu dan tidak mengetahui alasan perbuatan-Nya, dapat kubayangkan dengan baik, Ratuku terkasih, bahwa selama malam-malam itu engkau tidak dapat tidur dengan nyenyak dan hanya memikirkan Dia, hartamu satu-satunya. Demi kepedihan hatimu selama 3 hari yang terasa panjang dan pahit, aku mohon padamu, perolehkanlah bagiku rahmat agar aku tidak akan pernah kehilangan Tuhanku, selalu berpegang teguh pada-Nya, sehingga pada saat aku meninggalkan dunia ini, aku akan disatukan dengan-Nya.</p>
<p><i>1x Bapa kami, 7x Salam Maria, 1x Bundaku,…</i></p>
<hr>
<h4>Duka ke-4: Maria bertemu Yesus di jalan menuju Kalvari (Luk 23:27-31)</h4>
<p>Bunda yang berduka, aku ikut bersedih karena pedang penderitaan keempat yang menusuk hatimu; pada saat engkau melihat puteramu terkasih dijatuhi hukuman mati, diikat dengan tali dan rantai, tubuh tertutup darah dan luka, dimahkotai duri-duri kasar, jatuh dibawah salib berat yang dipanggul-Nya di atas pundak terluka, berjalan bagai domba tak bersalah untuk mati demi cinta-Nya pada kami. Matamu memandang-Nya dan Dia menatapmu, pandangan yang sekejap itu bagaikan beribu-ribu panah yang melukai hatimu yang manis. Demi penderitaan yang sangat sedih itu, aku mohon padamu, perolehkanlah bagiku rahmat untuk hidup, sesuai dengan kehendak Tuhanku dan memanggul salibku dengan suka cita bersama dengan Yesus sampai akhir hayatku.</p>
<p><i>1x Bapa kami, 7x Salam Maria, 1x Bundaku,…</i></p>
<hr>
<h4>Duka ke-5: Yesus wafat di kayu salib (Yoh 19:25-27)</h4>
<p>Bunda yang berduka, aku turut bersedih karena pedang penderitaan kelima yang menusuk hatimu; pada saat di Golgota engkau melihat puteramu Yesus terkasih wafat secara perlahan-lahan di depan matamu, dengan begitu banyak siksaan dan penghinaan, pada kayu salib hina. Engkau tak berdaya memberikan penghiburan yang terkecil sekalipun seperti yang diberikan pada seorang penjahat besar yang mendekati ajalnya. Bundaku yang paling kukasihi, aku mohon, demi penderitaan yang engkau alami bersama dengan puteramu yang wafat, dan demi kepedihan yang engkau rasakan terutama pada saat-saat terakhir dimana Dia berbicara padamu dari atas kayu salib, mengucapkan selamat tinggal dan meninggalkan kami semua dalam diri Yohanes murid-Nya sehingga menjadikan kami semua anak-anakmu, dan setelah ketetapan tersebut engkau melihat-Nya menundukkan kepala dan wafat; perolehkanlah rahmat dari kekasih tersalibmu agar aku dapat hidup dan mati dengan menyangkal segala hal duniawi sehingga aku dapat menghabiskan hidupku hanya untuk Allah dan kemudian pada saat memasuki surga untuk menikmati-Nya, dengan saling bertatap muka.</p>
<p><i>1x Bapa kami, 7x Salam Maria, 1x Bundaku,…</i></p>
<hr>
<h4>Duka ke-6: Yesus diturunkan dari kayu salib (Yoh 19:40)</h4>
<p>Bunda yang berduka, aku ikut bersedih karena pedang penderitaan keenam yang menusuk hatimu; pada saat engkau melihat hati manis puteramu ditusuk dengan tombak. Dia telah wafat bagi manusia yang tidak tahu terima kasih yang setelah kematian-Nya tidak puas dengan siksaan dan penghinaan yang telah diberikan kepada-Nya. Demi penderitaan hebat yang telah kau jalani ini, aku mohon padamu, perolehkanlah rahmat bagiku untuk masuk ke dalam Hati Yesus yang terluka dan terbuka untukku, sehingga di dalam Hati itu, aku dapat merasakan bahwa disanalah satu-satunya tempat terindah dari kasih, dimana jiwa-jiwa yang mengasihi Allah beristirahat dan hidup di dalam-Nya. Aku tidak boleh mengasihi apapun kecuali Allah, perawan tersuci, engkau dapat memperolehkannya bagiku, aku berharap padamu.</p>
<p><i>1x Bapa kami, 7x Salam Maria, 1x Bundaku,…</i></p>
<hr>
<h4>Duka ke-7: Yesus dimakamkan (Yoh 19:38-42)</h4>
<p>Bunda yang berduka, aku turut bersedih karena pedang penderitaan ketujuh yang menusuk hatimu; pada saat engkau melihat puteramu yang telah wafat dalam pelukanmu, tidak seindah dan sempurna seperti pada saat engkau menerima-Nya di palungan Bethlehem, tetapi dengan tubuh tertutup darah, pucat dan dikoyak oleh luka-luka sehingga tulang-Nya pun terlihat; dan engkau kemudian berkata : “Puteraku, puteraku, beginikah kasih memperlakukan-Mu?” Pada saat Dia dibawa ke makam, engkau ingin menemani-Nya dan meletakkan-Nya dengan tanganmu sendiri dan mengatakan salam perpisahan yang terakhir, kemudian engkau meninggalkan hatimu yang penuh kasih terkubur bersama puteramu. Dengan pengorbanan dan kepedihan jiwamu yang suci, aku mohon, perolehkanlah bagiku, o Bunda yang penuh kasih, pengampunan dari segala perbuatanku yang menyakiti dan melawan Tuhanku terkasih, yang kusesali dengan sepenuh hati. Mohon kuatkanlah aku dalam pencobaan, temanilah aku pada saat ajalku, selamatkanlah jiwaku melalui kemurahan Yesus dan engkau, sehingga pada suatu saat setelah segala sesuatu yang buruk ini, aku boleh sampai ke surga untuk menyanyikan lagu pujian bagi Yesus dan engkau untuk sepanjang masa.</p>
<p><i>1x Bapa kami, 7x Salam Maria, 1x Bundaku,…</i></p>
<hr>
<h4>Doa Penutup</h4>
<p>Ya Allah, karena sengsara-Mu yang telah dinubuatkan oleh Simeon, pedang penderitaan telah menikam hati termanis Bunda Maria, Perawan yang terkudus dan termulia. Anugerahkanlah pada kami yang merenungkan dan menghormati dukanya, agar diperbolehkan menikmati pahala yang penuh rahmat dari sengsara-Mu, karena Engkau yang hidup dan berkuasa sepanjang segala masa. Amin.</p>`,
            latin: `<p><i>(Versi Latin untuk doa ini tidak tersedia.)</i></p>`
        }
    },
    {
        title: 'Novena Hati Kudus Yesus',
        content: {
            indonesia: `<h4>Pengantar</h4>
<p>Hati Kudus Yesus adalah hati umat manusia yang merupakan lambang pusat kepribadian Yesus. Sebab hati merupakan pusat perasaan, kebebasan dan kesadaran Yesus. Dalam hati-Nya, Dia menyerahkan diri kepada misteri Allah dan karya keselamatan-Nya demi manusia.</p>
<p>Novena kepada hati kudus Yesus adalah sarana untuk mengembangkan hubungan pribadi dengan Yesus. Dalam Perjanjian Baru, khususnya dalam tulisan St. Yohanes, terdapat ungkapan hubungan pribadi itu dan nilai Hati Yesus sebagai lambang cinta kasih-Nya.</p>
<p>Novena ini dilakukan selama 9 hari berturut-turut pada jam yang sama.</p>
<hr>
<h4>Urutan Doa Novena Kepada Hati Kudus Yesus</h4>
<h5>1. Doa Pembukaan</h5>
<p><b>Syahadat Para Rasul</b><br>Aku percaya akan Allah, Bapa Yang Maha Kuasa, pencipta langit dan bumi...</p>
<h5>2. Novena Kepada Hati Kudus Yesus</h5>
<p>Ya Yesus, Engkau berkata: “Mintalah, maka akan diberikan kepadamu. Carilah, maka kamu akan mendapat. Ketuklah, maka pintu akan dibukakan bagimu.”<br>Dengan perantaraan Maria, Bunda-Mu tersuci, aku memanggil Engkau. Aku mencari dan memohon kepada-Mu untuk mendengarkan permohonanku ini.<br><i>(Sebutkan permohonan/ujud doa pribadi ….)</i></p>
<hr>
<p>Ya Yesus, Engkau berkata: “Apa saja yang kau minta kepada Bapa-Ku dengan nama-Ku, Dia akan memberikannya kepadamu.”<br>Aku memohon dengan rendah hati dan penuh kepercayaan dari Bapa Surgawi dalam nama-Mu, dengan perantaraan Maria, Bunda-Mu tersuci, untuk mengabulkan permohonanku ini.<br><i>(Sebutkan permohonan/ujud doa pribadi ….)</i></p>
<hr>
<p>Ya Yesus, Engkau berkata: “Langit dan bumi akan musnah, tetapi Sabda-Ku tidak akan musnah.”<br>Dengan perantaraan Maria Bunda-Mu tersuci, aku percaya bahwa permohonanku akan dikabulkan.<br><i>(Sebutkan permohonan/ujud doa pribadi ….)</i></p>
<hr>
<p>Yesusku, Tuhan jiwaku, Engkau berjanji bahwa Hati Kudus-Mu akan menjadi laut kerahiman bagi orang-orang yang berharap pada-Mu. Aku sungguh percaya bahwa Engkau akan mengabulkan apa yang aku minta, walaupun itu memerlukan mukjizat. Pada siapa aku akan mengetuk kalau bukan pada hati-Mu.<br>Terberkatilah mereka yang berharap pada-Mu. Ya Yesus, aku mempersembahkan kepada Hati-Mu penyakit/jiwa/permohonan ini. Pandanglah dan buatlah apa yang hati-Mu kehendaki.</p>
<hr>
<p>Ya Yesus, aku berharap pada-Mu dan percaya. Kepada-Mu aku mempersembahkan diriku. Di dalam Engkau aku merasa aman.</p>
<p><b>Bapa Kami (1x)</b><br>Bapa kami yang ada di surga, dimuliakanlah nama-Mu...</p>
<p><b>Salam Maria (1x)</b><br>Salam Maria, penuh rahmat Tuhan sertamu...</p>
<p><b>Kemuliaan (1x)</b><br>Kemuliaan kepada Bapa, dan Putra, dan Roh Kudus...</p>
<hr>
<p><b>Hati Kudus Yesus, aku berharap pada-Mu (10x)</b></p>
<p>Ya Yesus yang baik, Engkau berkata: “Jika engkau hendak menyenangkan Daku, percayalah kepada-Ku. Jika engkau hendak lebih menyenangkan Daku, berharaplah pada-Ku selalu.”<br>Padamu Tuhan, aku berharap, agar aku tidak binasa selamanya. Amin.</p>
<h5>3. Doa Kepada Hati Kudus Yesus</h5>
<p>Ya Tuhan, aku berdoa, agar di rumahku ada damai, ketenangan dan kesejahteraan di dalam naungan-Mu. Berkatilah dan lindungilah usahaku, pekerjaanku, segala keinginanku dan semua yang Kau serahkan kepadaku. Usirlah nafsu dari dalam hatiku, rencana palsu, dan pikiran jahat. Tuangkanlah di dalam hatiku, cinta kepada sesama dan anugerahkanlah kepadaku semangat penyerahan yang teguh, teristimewa pada saat kemalangan, agar supaya aku bangun dari kebimbangan.</p>
<p>Ya Tuhan, bimbinglah dan lindungilah hidupku dari bahaya-bahaya dan ketidaktentuan dunia. Jangan lupa, ya Yesusku, orang-orang yang kukasihi, baik yang masih hidup maupun yang sudah meninggal, yang menyebabkan kesedihan kami tetapi kami dihibur oleh ketaatan mereka waktu mereka masih hidup, sehingga Engkau tidak menyerahkan mereka kepada maut. Kasihanilah mereka Tuhan, dan bawalah mereka kepada kemuliaan surgawi. Amin.</p>`,
            latin: `<p><i>(Versi Latin untuk novena ini tidak tersedia.)</i></p>`
        }
    },
    {
        title: 'Novena Kerahiman Ilahi',
        content: {
            indonesia: `<h4>Pengantar</h4>
<p>Fokus utama dari Devosi Kerahiman Ilahi adalah cinta belas kasihan Allah dan keinginan untuk membiarkan cinta dan rahmat tersebut mengalir melalui hati seseorang terhadap orang-orang yang membutuhkan hal itu...</p>
<p>Novena ini bisa diadakan kapan saja, tetapi teristimewa adalah pada Jumat Agung sampai Minggu Paskah II.</p>
<hr>
<h4>Urutan Doa Novena Kerahiman Ilahi</h4>
<h5>1. Bacaan Dari Kitab Suci</h5>
<p><i>(Bacalah bagian Kitab Suci yang ditentukan pada hari itu, kemudian renungkanlah.)</i></p>
<p><b>Hari Pertama:</b> Meditasi Kitab Suci: Perumpamaan tentang domba yang hilang (Luk 15:1-10)...</p>
<p><b>Hari Kedua:</b> Meditasi Kitab Suci: Belas kasihan Yesus terhadap orang banyak (Mat 9:35-38)...</p>
<p><b>Hari Ketiga:</b> Meditasi Kitab Suci: Yesus Kristus batu penjuru (1Ptr 2:1-10)...</p>
<p><b>Hari Keempat:</b> Meditasi Kitab Suci: Why 21:5-8...</p>
<p><b>Hari Kelima:</b> Meditasi Kitab Suci: Ef 4:2-7 dan Ef 4:11-16...</p>
<p><b>Hari Keenam:</b> Meditasi Kitab Suci: Yesus memberkati anak-anak (Luk 18:15-17)...</p>
<p><b>Hari Ketujuh:</b> Meditasi Kitab Suci: Yesus diurapi oleh perempuan berdosa (Luk 7:36-50)...</p>
<p><b>Hari Kedelapan:</b> Meditasi Kitab Suci : 2Ptr 3:9-14...</p>
<p><b>Hari Kesembilan:</b> Meditasi Kitab Suci : Why 3:15-19...</p>
<h5>2. Doa Koronka</h5>
<p><i>(Doa Koronka/Kerahiman diajarkan Tuhan Yesus sendiri pada penampakan tahun 1935 kepada Suster Faustina...)</i></p>
<p><b>Bapa Kami</b>...<br><b>Salam Maria</b>...<br><b>Syahadat Para Rasul</b>...</p>
<p><b>Pada manik besar (Bapa Kami), doakan:</b><br>Bapa yang kekal kupersembahkan kepada-Mu, Tubuh dan Darah, Jiwa dan Ke-Illahi-an Putera-Mu terkasih Tuhan kami Yesus Kristus, sebagai pemulihan dosa-dosa kami dan dosa seluruh dunia.</p>
<p><b>Pada setiap sepuluhan manik kecil (Salam Maria), doakan:</b><br>Demi sengsara Yesus yang pedih, tunjukkanlah belaskasih-Mu kepada kami dan seluruh dunia.</p>
<p><b>Diakhiri dengan tiga kali mengucapkan:</b><br>Allah yang kudus, kudus dan berkuasa, kudus dan kekal, kasihanilah kami dan seluruh dunia. Amin.</p>
<hr>
<h5>Litani Kerahiman Ilahi</h5>
<p>Tuhan kasihanilah kami, Tuhan kasihanilah kami.<br>Kristus kasihanilah kami, Kristus kasihanilah kami.<br>... <i>(dst)</i></p>
<p><b>Marilah berdoa:</b><br>Allah, yang kerahiman-Mu tak dapat dipahami dan yang belas kasih-Mu tak terbatas, pandanglah kami dengan mata belas kasih-Mu... Amin.</p>`,
            latin: `<p><i>(Versi Latin untuk novena ini tidak tersedia.)</i></p>`
        }
    }
];


document.addEventListener('DOMContentLoaded', () => {

    // INISIALISASI GLOBAL
    const db = firebase.firestore();
    const lightbox = GLightbox({ selector: '.glightbox' });
    particlesJS.load('particles-js', 'assets/particles.json', () => {});

    // FUNGSI-FUNGSI BANTUAN UI
    const showLoading = (container, message = 'Memuat data...') => {
        if (!container) return;
        if (container.id === 'agenda-container') {
            container.innerHTML = `<div class="skeleton-wrapper"><div class="col-12"><div class="skeleton-card"><div class="skeleton-line title"></div><div class="skeleton-line text"></div><div class="skeleton-line text-short"></div></div></div><div class="col-12"><div class="skeleton-card"><div class="skeleton-line title"></div><div class="skeleton-line text"></div><div class="skeleton-line text-short"></div></div></div></div>`;
        } else {
            container.innerHTML = `<div class="feedback-container"><div class="spinner"></div><p>${message}</p></div>`;
        }
    };
    const showError = (container, message) => {
        if (container) {
            container.innerHTML = `<div class="error-alert"><strong>Gagal Memuat:</strong> ${message}</div>`;
        }
    };

    // FUNGSI MEMUAT DATA (TIDAK ADA PERUBAHAN DI FUNGSI-FUNGSI INI)
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
    const loadActiveLiturgy = async () => {
        const berandaSection = document.getElementById('beranda');
        const flippers = { title: document.getElementById('title-flipper'), bacaan: document.getElementById('bacaan-flipper') };
        const containers = { bacaanFront: document.getElementById('bacaan-flipper-front'), bacaanBack: document.getElementById('bacaan-flipper-back'), tombol: document.getElementById('tombol-flip-container'), renunganTitle: document.getElementById('renungan-title'), renunganText: document.getElementById('renungan-text') };
        showLoading(containers.bacaanFront, 'Memuat liturgi...');
        showLoading(containers.renunganText, 'Memuat renungan...');
        const createLiturgiCardHTML = (lit) => { const colorMap = { "Hijau": "green", "Merah": "red", "Putih": "white", "Ungu": "purple", "Hitam": "black", "Mawar": "rose", "Biru": "blue" }; return `<div class="liturgi-card"><div class="liturgi-header"><span class="liturgi-date">${lit.tanggal}</span><span class="liturgi-color-dot ${colorMap[lit.warna] || 'default'}"></span></div><div class="liturgi-body"><h5 class="liturgi-perayaan">${lit.peringatan}</h5><div class="liturgi-detail"><div class="liturgi-label"><i class="bi bi-book-fill"></i><span>Bacaan 1</span></div><div class="liturgi-colon">:</div><div class="liturgi-value">${lit.bacaan1 || '-'}</div><div class="liturgi-label"><i class="bi bi-book-fill"></i><span>Bacaan 2</span></div><div class="liturgi-colon">:</div><div class="liturgi-value">${lit.bacaan2 || '-'}</div><div class="liturgi-label"><i class="bi bi-music-note-beamed"></i><span>Mazmur</span></div><div class="liturgi-colon">:</div><div class="liturgi-value">${lit.mazmur || '-'}</div><div class="liturgi-label"><i class="bi bi-journal-medical"></i><span>Injil</span></div><div class="liturgi-colon">:</div><div class="liturgi-value">${lit.injil || '-'}</div><div class="liturgi-label"><i class="bi bi-palette-fill"></i><span>Warna</span></div><div class="liturgi-colon">:</div><div class="liturgi-value">${lit.warna || '-'}</div></div></div></div>`; };
        const setWrapperHeight = (wrapper) => { if (!wrapper) return; const flipper = wrapper.querySelector('.flipper'); const front = flipper.querySelector('.front'); const back = flipper.querySelector('.back'); if (!flipper || !front || !back) return; front.style.position = 'relative'; back.style.position = 'relative'; const frontHeight = front.offsetHeight; const backHeight = back.offsetHeight; front.style.position = 'absolute'; back.style.position = 'absolute'; flipper.style.height = `${Math.max(frontHeight, backHeight, 50)}px`; };
        try {
            const today = new Date(); today.setHours(0, 0, 0, 0); 
            const currentSnapshot = await db.collection('liturgies').where('liturgyDate', '<=', today).orderBy('liturgyDate', 'desc').limit(1).get();
            const nextSnapshot = await db.collection('liturgies').where('liturgyDate', '>', today).orderBy('liturgyDate', 'asc').limit(1).get();
            if (currentSnapshot.empty) { showError(berandaSection, 'Data liturgi minggu ini belum diatur oleh Sekretariat.'); return; }
            const currentLit = currentSnapshot.docs[0].data(); const nextLit = nextSnapshot.empty ? null : nextSnapshot.docs[0].data();
            containers.bacaanFront.innerHTML = createLiturgiCardHTML(currentLit);
            containers.renunganText.innerHTML = `<p>${(currentLit.renungan || 'Renungan belum tersedia.').replace(/\n/g, '<br>')}</p>`;
            if (nextLit) {
                containers.bacaanBack.innerHTML = createLiturgiCardHTML(nextLit);
                setTimeout(() => { setWrapperHeight(flippers.title); setWrapperHeight(flippers.bacaan); }, 100);
                containers.tombol.innerHTML = `<button id="multi-flip-btn" class="btn btn-outline-primary">Lihat Minggu Depan &gt;&gt;&gt;</button>`;
                document.getElementById('multi-flip-btn').addEventListener('click', function() { const isFlipped = flippers.title.classList.contains('is-flipped'); this.innerHTML = isFlipped ? 'Lihat Minggu Depan &gt;&gt;&gt;' : '&lt;&lt;&lt; Kembali ke Minggu Ini'; flippers.title.classList.toggle('is-flipped'); flippers.bacaan.classList.toggle('is-flipped'); if (!isFlipped) { containers.renunganTitle.innerText = 'Renungan Minggu Depan'; containers.renunganText.innerHTML = `<p>${(nextLit.renungan || 'Renungan belum tersedia.').replace(/\n/g, '<br>')}</p>`; } else { containers.renunganTitle.innerText = 'Renungan Minggu Ini'; containers.renunganText.innerHTML = `<p>${(currentLit.renungan || 'Renungan belum tersedia.').replace(/\n/g, '<br>')}</p>`; } });
            } else { if(flippers.title) flippers.title.querySelector('.back').style.display = 'none'; if(flippers.bacaan) flippers.bacaan.querySelector('.back').style.display = 'none'; if(containers.tombol) containers.tombol.style.display = 'none'; setTimeout(() => { setWrapperHeight(flippers.title); setWrapperHeight(flippers.bacaan); }, 100); }
        } catch (error) { console.error("Gagal memuat liturgi:", error); showError(berandaSection, `Terjadi kesalahan saat memuat liturgi. Silakan cek konsol.`); }
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
            const groupedByMonth = data.reduce((acc, item) => { const date = new Date(item.tanggal + 'T00:00:00'); const monthYear = date.toLocaleString('id-ID', { month: 'long', year: 'numeric' }); if (!acc[monthYear]) acc[monthYear] = []; acc[monthYear].push(item); return acc; }, {});
            let html = '';
            const sortedMonths = Object.keys(groupedByMonth).sort((a, b) => new Date('01 ' + a.replace(' ', ' ')) - new Date('01 ' + b.replace(' ', ' ')));
            for (const month of sortedMonths) {
                html += `<h3 class="kalender-bulan">${month}</h3><ul class="kalender-list">`;
                groupedByMonth[month].forEach(item => { const date = new Date(item.tanggal + 'T00:00:00'); const judul = item.judul || 'Tidak ada judul'; const getWarnaClass = (j) => { if (j.includes('Hari Raya')) return 'dot-red'; if (j.includes('Pesta')) return 'dot-white'; if (j.includes('Biasa')) return 'dot-green'; if (j.includes('Adven') || j.includes('Prapaskah')) return 'dot-purple'; return 'dot-default'; }; html += `<li class="kalender-item"><div class="kalender-tanggal"><span class="tanggal-angka">${date.getDate()}</span><span class="tanggal-hari">${date.toLocaleDateString('id-ID', { weekday: 'long' })}</span></div><div class="kalender-info"><span class="kalender-judul ${getWarnaClass(judul)}">${judul}</span><span class="kalender-deskripsi">${(item.deskripsi || '').replace(/\n/g, '<br>')}</span></div></li>`; });
                html += '</ul>';
            }
            container.innerHTML = html;
        } catch (error) { console.error("Gagal memuat Kalender Liturgi dari JSON:", error); showError(container, `Pastikan file 'kalender_liturgi_2025.json' ada. (${error.message})`); }
    };
    
    // =================================================================
    // FUNGSI DOA-DOA DENGAN JARAK PARAGRAF YANG DIPERBAIKI
    // =================================================================
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

        // 1. Buat daftar doa dari data array 'prayersData'
        doaList.innerHTML = prayersData.map(prayer => {
            return `<button type="button" class="list-group-item list-group-item-action">
                        ${prayer.title}
                    </button>`;
        }).join('');

        // Fungsi untuk menampilkan konten doa
        const renderPrayerContent = (lang) => {
            if (currentPrayer) {
                detailContent.innerHTML = currentPrayer.content[lang]; // Langsung pakai HTML dari data
                langSelector.querySelectorAll('button').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.lang === lang);
                });
            }
        };

        // 2. Event listener untuk setiap tombol doa
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

        // 3. Fungsi untuk tombol kembali
        backBtn.addEventListener('click', () => {
            detailContainer.style.display = 'none';
            listContainer.style.display = 'block';
            currentPrayer = null;
        });

        // 4. Fungsi untuk tombol pilihan bahasa
        langSelector.addEventListener('click', (e) => {
            if (e.target && e.target.matches('button')) {
                const selectedLang = e.target.dataset.lang;
                renderPrayerContent(selectedLang);
            }
        });
    };

    // NAVIGASI TAB
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
        if (window.innerWidth <= 768 && sidebarMenu.classList.contains('active')) {
            sidebarMenu.classList.remove('active'); document.body.classList.remove('sidebar-open'); document.getElementById('sidebarToggleBtn').classList.remove('active');
        }
    }
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    const sidebarMenu = document.getElementById('sidebarMenu');
    if (sidebarToggleBtn && sidebarMenu) {
        sidebarToggleBtn.addEventListener('click', () => { sidebarMenu.classList.toggle('active'); sidebarToggleBtn.classList.toggle('active'); document.body.classList.toggle('sidebar-open'); });
        document.body.addEventListener('click', (event) => {
            if (window.innerWidth <= 768 && document.body.classList.contains('sidebar-open') && !sidebarMenu.contains(event.target) && !sidebarToggleBtn.contains(event.target)) {
                sidebarMenu.classList.remove('active'); sidebarToggleBtn.classList.remove('active'); document.body.classList.remove('sidebar-open');
            }
        });
    }
    document.querySelectorAll('#sidebarMenu .tab-button[data-tab]').forEach(button => {
        button.addEventListener('click', (event) => { event.preventDefault(); activateTab(button.dataset.tab); });
    });
    
    // PEMANGGILAN FUNGSI AWAL
    const loadInitialData = () => {
        loadAnnouncementsPublic();
        loadActiveLiturgy();
        loadPastorStatus();
        loadPublicStats();
        loadKalenderFromJson();
        loadSejarahPausFromJson();
        loadPrayers(); // Memanggil fungsi doa
    };
    loadInitialData();
    activateTab('beranda');
    
    // --- LOGIKA UNTUK MODAL PREVIEW FORMULIR ---
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