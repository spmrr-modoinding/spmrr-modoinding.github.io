// functions/index.js

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

/**
 * Fungsi ini akan terpicu setiap kali ada DOKUMEN BARU
 * yang dibuat di dalam koleksi 'announcements'.
 */
exports.sendAnnouncementNotification = functions.region('asia-southeast2') // Menentukan lokasi server (lebih dekat ke Indonesia)
  .firestore.document('announcements/{announcementId}')
  .onCreate(async (snap, context) => {

    // 1. Ambil data dari pengumuman yang baru dibuat
    const newAnnouncement = snap.data();
    const aTitle = newAnnouncement.judul || "Pengumuman Baru";

    console.log(`Pengumuman baru ditambahkan: ${aTitle}`);

    // 2. Siapkan payload notifikasi
    const payload = {
      notification: {
        title: "Agenda Baru Paroki",
        body: aTitle,
        icon: "/logo-paroki2.png", // Pastikan ikon ini ada di root website Anda
        click_action: "https://paroki-modoinding.firebaseapp.com/" // URL yang akan dibuka saat notif diklik
      }
    };

    // 3. Ambil semua token perangkat dari koleksi 'fcm_tokens'
    const tokensSnapshot = await admin.firestore().collection('fcm_tokens').get();
    if (tokensSnapshot.empty) {
        console.log("Tidak ada token perangkat untuk dikirimi notifikasi.");
        return;
    }

    const tokens = tokensSnapshot.docs.map(doc => doc.data().token);

    // 4. Kirim notifikasi ke semua token
    console.log(`Mengirim notifikasi ke ${tokens.length} perangkat.`);
    const response = await admin.messaging().sendToDevice(tokens, payload);

    // (Opsional) Bersihkan token yang tidak valid
    response.results.forEach((result, index) => {
      const error = result.error;
      if (error) {
        console.error('Gagal mengirim ke token:', tokens[index], error);
        if (error.code === 'messaging/registration-token-not-registered' || error.code === 'messaging/invalid-registration-token') {
          // Hapus token yang tidak valid dari database
          tokensSnapshot.docs[index].ref.delete();
        }
      }
    });

  });