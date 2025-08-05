import Document from "../models/Document.js";
import Permission from "../models/Permission.js";
import { v2 as cloudinary } from "cloudinary";

// Helper function untuk memeriksa hak akses
const checkPermission = async (user, documentType) => {
  // Admin selalu diizinkan
  if (user.tipeAkses === "admin") return true;

  // Cari aturan untuk jabatan pengguna
  const permission = await Permission.findOne({ jabatan: user.jabatan });

  // Kembalikan true jika ada aturan DAN jenis dokumen ini termasuk yang diizinkan
  return permission && permission.allowedDocumentTypes.includes(documentType);
};

// --- FUNGSI BARU UNTUK MENGAMBIL SATU DOKUMEN ---
// (Fungsi ini sebelumnya tidak ada, sekarang ditambahkan dan diamankan)
export const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).populate(
      "createdBy",
      "namaLengkap email"
    );

    if (!document) {
      return res.status(404).json({ message: "Dokumen tidak ditemukan" });
    }

    // PERIKSA HAK AKSES SEBELUM MENGIRIM DOKUMEN
    const hasPermission = await checkPermission(
      req.user,
      document.jenisDokumen
    );
    if (!hasPermission) {
      return res
        .status(403)
        .json({
          message: "Anda tidak memiliki hak akses untuk melihat dokumen ini.",
        });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const createDocument = async (req, res) => {
  const { jenisDokumen } = req.body;

  // --- PERUBAHAN DI SINI ---
  // PERIKSA HAK AKSES SEBELUM MEMBUAT DOKUMEN
  const hasPermission = await checkPermission(req.user, jenisDokumen);
  if (!hasPermission) {
    return res
      .status(403)
      .json({
        message:
          "Anda tidak memiliki hak akses untuk membuat jenis dokumen ini.",
      });
  }
  // --- AKHIR PERUBAHAN ---

  const { judul, nomorSurat, tanggalDokumen, namaPT, isi } = req.body;
  try {
    const newDocument = new Document({
      judul,
      jenisDokumen,
      nomorSurat,
      tanggalDokumen,
      namaPT,
      isi,
      fileUrl: req.file ? req.file.path : null,
      filePublicId: req.file ? req.file.filename : null,
      createdBy: req.user._id,
    });
    const createdDocument = await newDocument.save();
    res.status(201).json(createdDocument);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateDocument = async (req, res) => {
  const { jenisDokumen } = req.body;
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Dokumen tidak ditemukan" });
    }

    // --- PERUBAHAN DI SINI ---
    // PERIKSA HAK AKSES SEBELUM MENGEDIT
    const hasPermission = await checkPermission(
      req.user,
      document.jenisDokumen
    );
    if (!hasPermission) {
      return res
        .status(403)
        .json({
          message:
            "Anda tidak memiliki hak akses untuk mengedit jenis dokumen ini.",
        });
    }
    // --- AKHIR PERUBAHAN ---

    if (req.file && document.filePublicId) {
      await cloudinary.uploader.destroy(document.filePublicId);
    }

    const { judul, nomorSurat, tanggalDokumen, namaPT, isi } = req.body;
    document.judul = judul || document.judul;
    document.jenisDokumen = jenisDokumen || document.jenisDokumen;
    document.nomorSurat = nomorSurat || document.nomorSurat;
    document.tanggalDokumen = tanggalDokumen || document.tanggalDokumen;
    document.namaPT = namaPT || document.namaPT;
    document.isi = isi || document.isi;
    if (req.file) {
      document.fileUrl = req.file.path;
      document.filePublicId = req.file.filename;
    }
    const updatedDocument = await document.save();
    res.json(updatedDocument);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Dokumen tidak ditemukan" });
    }

    // --- PERUBAHAN DI SINI ---
    // PERIKSA HAK AKSES SEBELUM MENGHAPUS
    const hasPermission = await checkPermission(
      req.user,
      document.jenisDokumen
    );
    if (!hasPermission) {
      return res
        .status(403)
        .json({
          message:
            "Anda tidak memiliki hak akses untuk menghapus jenis dokumen ini.",
        });
    }
    // --- AKHIR PERUBAHAN ---

    if (document.filePublicId) {
      await cloudinary.uploader.destroy(document.filePublicId);
    }
    await document.deleteOne();
    res.json({ message: "Dokumen berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getDocumentsByType = async (req, res) => {
  const { type } = req.params;

  // --- PERUBAHAN DI SINI ---
  // PERIKSA HAK AKSES SEBELUM MELIHAT DAFTAR
  const hasPermission = await checkPermission(req.user, type);
  if (!hasPermission) {
    return res
      .status(403)
      .json({
        message:
          "Anda tidak memiliki hak akses untuk melihat jenis dokumen ini.",
      });
  }
  // --- AKHIR PERUBAHAN ---

  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "desc";
    const sortOptions = { [sortBy]: sortOrder };
    const query = { jenisDokumen: type };
    const count = await Document.countDocuments(query);
    const documents = await Document.find(query)
      .sort(sortOptions)
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res.json({
      documents,
      page,
      totalPages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const searchDocuments = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const { q, jenisDokumen, namaPT, startDate, endDate } = req.query;
    const filter = {};

    // --- PERUBAHAN DI SINI ---
    // Filter hasil pencarian berdasarkan hak akses pengguna
    if (req.user.tipeAkses !== "admin") {
      const permission = await Permission.findOne({
        jabatan: req.user.jabatan,
      });
      const allowedTypes = permission ? permission.allowedDocumentTypes : [];
      filter.jenisDokumen = { $in: allowedTypes };
    }
    // --- AKHIR PERUBAHAN ---

    if (q) filter.$text = { $search: q };
    if (jenisDokumen) filter.jenisDokumen = jenisDokumen;
    if (namaPT) filter.namaPT = { $regex: namaPT, $options: "i" };
    if (startDate || endDate) {
      filter.tanggalDokumen = {};
      if (startDate) filter.tanggalDokumen.$gte = new Date(startDate);
      if (endDate) filter.tanggalDokumen.$lte = new Date(endDate);
    }
    const count = await Document.countDocuments(filter);
    const documents = await Document.find(filter)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });
    res.json({
      documents,
      page,
      totalPages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
