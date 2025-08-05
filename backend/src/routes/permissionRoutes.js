import express from "express";
import {
  getPermissions,
  setPermission,
} from "../controllers/permissionController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Semua rute ini hanya bisa diakses oleh admin yang sudah login
router
  .route("/")
  .get(protect, admin, getPermissions)
  .post(protect, admin, setPermission);

export default router;
