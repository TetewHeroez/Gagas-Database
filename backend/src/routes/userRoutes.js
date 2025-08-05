import express from "express";
import {
  createUser,
  updateUser,
  changeUserPassword,
  getUsers,
  getUserProfile,
  toggleUserStatus, // Ganti deleteUser
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, admin, getUsers)
  .post(protect, admin, createUser);

router.route("/profile").get(protect, getUserProfile);

// --- RUTE DELETE DIGANTI MENJADI PUT UNTUK STATUS ---
router.route("/:id/status").put(protect, admin, toggleUserStatus);

router.route("/:id").put(protect, admin, updateUser);
// .delete() sudah tidak ada lagi

router.put("/:id/password", protect, changeUserPassword);

export default router;
