import express from "express";
import {
  getStats,
  getRecentDocuments,
} from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Semua rute dasbor memerlukan login
router.get("/stats", protect, getStats);
router.get("/recent-documents", protect, getRecentDocuments);

export default router;
