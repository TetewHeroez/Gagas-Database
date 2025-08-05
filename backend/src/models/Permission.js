import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    jabatan: {
      type: String,
      required: true,
      unique: true, // Setiap jabatan hanya punya satu set aturan
    },
    allowedDocumentTypes: [
      {
        type: String,
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
    ],
  },
  {
    timestamps: true,
  }
);

const Permission = mongoose.model("Permission", permissionSchema);

export default Permission;
