import Document from "../models/Document.js";
import Permission from "../models/Permission.js";
import { v2 as cloudinary } from "cloudinary";

// Helper function untuk memeriksa hak akses
const checkPermission = async (user, documentType) => {
  if (!user || !documentType) return false;
  if (user.tipeAkses === "admin") return true;
  
  // Database Admin has access to all documents automatically
  if (user.divisi === "Database Admin") return true;
  
  const permission = await Permission.findOne({ divisi: user.divisi });
  return permission && permission.allowedDocumentTypes.includes(documentType);
};

export const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).populate(
      "createdBy",
      "namaLengkap email divisi"
    );
    if (!document) {
      return res.status(404).json({ message: "Dokumen tidak ditemukan" });
    }
    const hasPermission = await checkPermission(
      req.user,
      document.jenisDokumen
    );
    if (!hasPermission) {
      return res.status(403).json({
        message: "Anda tidak memiliki hak akses untuk melihat dokumen ini.",
      });
    }
    res.json(document);
  } catch (error) {
    console.error("Error in getDocumentById:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const createDocument = async (req, res) => {
  const {
    judul,
    jenisDokumen,
    nomorSurat,
    tanggalDokumen,
    namaPT,
    perihal,
    hardCopyLocation,
  } = req.body;

  try {
    // Validation untuk field wajib
    if (!judul || !jenisDokumen || !nomorSurat || !tanggalDokumen || !perihal) {
      return res.status(400).json({
        message:
          "Field wajib harus diisi: judul, jenisDokumen, nomorSurat, tanggalDokumen, perihal",
      });
    }

    const hasPermission = await checkPermission(req.user, jenisDokumen);
    if (!hasPermission) {
      return res.status(403).json({
        message:
          "Anda tidak memiliki hak akses untuk membuat jenis dokumen ini.",
      });
    }

    const docExists = await Document.findOne({ nomorSurat });
    if (docExists) {
      return res.status(409).json({ message: "Nomor Surat sudah digunakan." });
    }

    const newDocument = new Document({
      judul,
      jenisDokumen,
      nomorSurat,
      tanggalDokumen,
      namaPT,
      perihal,
      hardCopyLocation,
      fileUrl: req.file ? req.file.path : null,
      filePublicId: req.file ? req.file.filename : null,
      createdBy: req.user._id,
    });
    const createdDocument = await newDocument.save();
    res.status(201).json(createdDocument);
  } catch (error) {
    console.error("Error in createDocument:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateDocument = async (req, res) => {
  const { id } = req.params;

  try {
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Dokumen tidak ditemukan" });
    }

    const hasPermissionForOldType = await checkPermission(
      req.user,
      document.jenisDokumen
    );
    if (!hasPermissionForOldType) {
      return res.status(403).json({
        message:
          "Anda tidak memiliki hak akses untuk mengedit jenis dokumen ini.",
      });
    }

    const { jenisDokumen, nomorSurat } = req.body;
    if (jenisDokumen && jenisDokumen !== document.jenisDokumen) {
      const hasPermissionForNewType = await checkPermission(
        req.user,
        jenisDokumen
      );
      if (!hasPermissionForNewType) {
        return res.status(403).json({
          message: `Anda tidak memiliki hak akses untuk mengubah dokumen menjadi jenis "${jenisDokumen}".`,
        });
      }
    }

    if (nomorSurat && nomorSurat !== document.nomorSurat) {
      const existingDocWithNumber = await Document.findOne({
        nomorSurat: nomorSurat,
      });
      if (
        existingDocWithNumber &&
        existingDocWithNumber._id.toString() !== id
      ) {
        return res
          .status(409)
          .json({ message: "Nomor Surat sudah digunakan oleh dokumen lain." });
      }
    }

    const updateFields = {};
    const allowedFields = [
      "judul",
      "jenisDokumen",
      "nomorSurat",
      "tanggalDokumen",
      "namaPT",
      "perihal",
      "hardCopyLocation",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    if (req.file) {
      if (document.filePublicId) {
        await cloudinary.uploader.destroy(document.filePublicId);
      }
      updateFields.fileUrl = req.file.path;
      updateFields.filePublicId = req.file.filename;
    }

    Object.assign(document, updateFields);

    const updatedDocument = await document.save();
    res.json(updatedDocument);
  } catch (error) {
    console.error("FATAL ERROR in updateDocument:", error);
    res.status(500).json({
      message: "Terjadi kesalahan fatal di server",
      error: error.message,
    });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Dokumen tidak ditemukan" });
    }
    const hasPermission = await checkPermission(
      req.user,
      document.jenisDokumen
    );
    if (!hasPermission) {
      return res.status(403).json({
        message:
          "Anda tidak memiliki hak akses untuk menghapus jenis dokumen ini.",
      });
    }
    if (document.filePublicId) {
      await cloudinary.uploader.destroy(document.filePublicId);
    }
    await document.deleteOne();
    res.json({ message: "Dokumen berhasil dihapus" });
  } catch (error) {
    console.error("Error in deleteDocument:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getDocumentsByType = async (req, res) => {
  const { type } = req.params;
  try {
    const hasPermission = await checkPermission(req.user, type);
    if (!hasPermission) {
      return res.status(403).json({
        message:
          "Anda tidak memiliki hak akses untuk melihat jenis dokumen ini.",
      });
    }

    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "desc";
    const sortOptions = { [sortBy]: sortOrder };
    const query = { jenisDokumen: type };
    const count = await Document.countDocuments(query);
    const documents = await Document.find(query)
      .populate("createdBy", "namaLengkap divisi")
      .sort(sortOptions)
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res.json({ documents, page, totalPages: Math.ceil(count / pageSize) });
  } catch (error) {
    console.error("Error in getDocumentsByType:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const searchDocuments = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const { q, jenisDokumen, namaPT, startDate, endDate } = req.query;
    const filter = {};

    if (req.user.tipeAkses !== "admin") {
      const permission = await Permission.findOne({ divisi: req.user.divisi });
      const allowedTypes = permission ? permission.allowedDocumentTypes : [];
      filter.jenisDokumen = { $in: allowedTypes };
    }
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
    res.json({ documents, page, totalPages: Math.ceil(count / pageSize) });
  } catch (error) {
    console.error("Error in searchDocuments:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// --- FUNGSI BARU YANG HILANG ---
export const downloadFile = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Dokumen tidak ditemukan" });
    }
    if (!document.fileUrl) {
      return res
        .status(404)
        .json({ message: "Dokumen ini tidak memiliki file." });
    }
    // Redirect ke URL Cloudinary untuk mengunduh
    res.redirect(document.fileUrl);
  } catch (error) {
    console.error("Error in downloadFile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
