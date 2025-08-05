import express from "express";
import {
  getDocumentsByType,
  searchDocuments,
  deleteDocument,
  createDocument,
  updateDocument,
} from "../controllers/documentController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.route("/").post(protect, upload.single("documentFile"), createDocument);

router
  .route("/:id")
  .delete(protect, deleteDocument)
  .put(protect, upload.single("documentFile"), updateDocument);

router.get("/search", protect, searchDocuments);
router.get("/type/:type", protect, getDocumentsByType);

export default router;
