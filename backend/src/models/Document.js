import mongoose from "mongoose";
import { documentTypesEnum } from "../constants/documentConstants.js"; // Impor daftar jenis dokumen yang baru

const documentSchema = new mongoose.Schema(
  {
    judul: { type: String, required: true },
    jenisDokumen: {
      type: String,
      required: true,
      enum: documentTypesEnum,
    },
    nomorSurat: { type: String, required: true, unique: true },
    tanggalDokumen: { type: Date, required: true },
    namaPT: { type: String, default: "Perusahaan Anda" },
    // --- PERUBAHAN DI SINI ---
    perihal: { type: String, required: true }, // Mengganti 'isi'
    hardCopyLocation: { type: String, required: false }, // Field baru, opsional
    // --- ---
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

// Perbarui text index untuk menyertakan 'perihal'
documentSchema.index({ judul: "text", perihal: "text", namaPT: "text" });
const Document = mongoose.model("Document", documentSchema);
export default Document;
