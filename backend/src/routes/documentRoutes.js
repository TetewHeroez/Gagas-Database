import express from "express";
import {
  getDocumentsByType,
  searchDocuments,
  deleteDocument,
  createDocument,
  updateDocument,
  getDocumentById,
  downloadFile,
} from "../controllers/documentController.js";
import { protect } from "../middleware/authMiddleware.js";
import getUpload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Middleware untuk menangani error upload
const handleUploadError = (err, req, res, next) => {
  if (err) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File terlalu besar. Maksimal 10MB.",
      });
    }

    if (err.message && err.message.includes("Jenis file tidak diizinkan")) {
      return res.status(400).json({
        message: err.message,
      });
    }

    if (err.message && err.message.includes("Must supply api_key")) {
      return res.status(500).json({
        message: "Konfigurasi server error. Silakan hubungi administrator.",
      });
    }

    return res.status(400).json({
      message: "Error upload file: " + err.message,
    });
  }
  next();
};

// Rute untuk membuat dokumen baru
router.route("/").post(
  protect,
  (req, res, next) => {
    try {
      const upload = getUpload();
      upload.single("documentFile")(req, res, next);
    } catch (error) {
      return res.status(500).json({
        message: "Upload service tidak tersedia: " + error.message,
      });
    }
  },
  handleUploadError,
  createDocument
);

// Rute spesifik didefinisikan sebelum rute dengan parameter :id
router.get("/search", protect, searchDocuments);
router.get("/type/:type", protect, getDocumentsByType);
router.get("/:id/download", protect, downloadFile);

// Rute untuk operasi pada satu dokumen berdasarkan ID
router
  .route("/:id")
  .get(protect, getDocumentById)
  .delete(protect, deleteDocument)
  .put(
    protect,
    (req, res, next) => {
      try {
        const upload = getUpload();
        upload.single("documentFile")(req, res, next);
      } catch (error) {
        return res.status(500).json({
          message: "Upload service tidak tersedia: " + error.message,
        });
      }
    },
    handleUploadError,
    updateDocument
  );

export default router;
