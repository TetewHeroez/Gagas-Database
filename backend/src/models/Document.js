import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    judul: { type: String, required: true },
    jenisDokumen: {
      type: String,
      required: true,
      enum: [
        "RAB",
        "Berita Acara",
        "Jadwal Piket",
        "Surat Jalan",
        "Laporan Proyek",
        "Absensi Karyawan",
        "Notulen Rapat",
        "Arsip Kontrak",
      ],
    },
    nomorSurat: { type: String, required: true, unique: true },
    tanggalDokumen: { type: Date, required: true },
    namaPT: { type: String, default: "Perusahaan Anda" },
    isi: { type: String, required: true },
    // Mengganti path lokal dengan URL Cloudinary
    fileUrl: { type: String, required: false },
    filePublicId: { type: String, required: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

documentSchema.index({ judul: "text", isi: "text", namaPT: "text" });
const Document = mongoose.model("Document", documentSchema);
export default Document;
