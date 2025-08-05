import User from "../models/User.js";
import Document from "../models/Document.js";

const seedData = async () => {
  try {
    // Seeding User
    const userCount = await User.countDocuments();
    let adminUser;

    if (userCount === 0) {
      console.log(
        "Database pengguna kosong. Membuat akun admin awal dari .env..."
      );

      // Ambil data admin dari environment variables
      const adminEmail = process.env.ADMIN_EMAIL;
      if (!adminEmail) {
        console.error(
          "❌ Variabel ADMIN_EMAIL tidak diatur di .env. Seeder dihentikan."
        );
        return;
      }

      adminUser = await User.create({
        username: process.env.ADMIN_USERNAME || "admin",
        email: adminEmail,
        namaLengkap: process.env.ADMIN_NAMA_LENGKAP || "Administrator",
        password: process.env.ADMIN_PASSWORD, // Pastikan ini diatur!
        tipeAkses: "admin",
        jabatan: process.env.ADMIN_JABATAN || "Administrator",
      });
      console.log(`✅ Akun admin awal untuk ${adminEmail} berhasil dibuat.`);
    } else {
      adminUser = await User.findOne({ tipeAkses: "admin" });
    }

    // Seeding Dokumen (tetap sama)
    const documentCount = await Document.countDocuments();
    if (documentCount === 0 && adminUser) {
      console.log("Database dokumen kosong. Membuat dokumen sampel...");
      const sampleDocuments = [
        {
          judul: "Rencana Anggaran Biaya Proyek Gedung Baru",
          jenisDokumen: "RAB",
          nomorSurat: "RAB/001/VII/2025",
          tanggalDokumen: new Date(),
          namaPT: "PT Maju Jaya",
          isi: "Detail anggaran untuk pembangunan gedung baru di Surabaya.",
          createdBy: adminUser._id,
        },
        {
          judul: "Berita Acara Serah Terima Inventaris Q2",
          jenisDokumen: "Berita Acara",
          nomorSurat: "BAST/012/VII/2025",
          tanggalDokumen: new Date(),
          namaPT: "PT Maju Jaya",
          isi: "Serah terima 10 unit laptop Dell kepada departemen IT.",
          createdBy: adminUser._id,
        },
      ];
      await Document.insertMany(sampleDocuments);
      console.log("✅ Dokumen sampel berhasil dibuat.");
    }
  } catch (error) {
    console.error("❌ Error saat menjalankan seeder:", error.message);
  }
};

export default seedData;
