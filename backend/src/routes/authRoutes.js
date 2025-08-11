// src/routes/authRoutes.js
import express from "express";
import { loginUser, forgotPassword, resetPassword } from "../controllers/authController.js";

// Membuat instance router dari Express
const router = express.Router();

// Mendefinisikan rute untuk login
// Ketika ada request POST ke '/login', jalankan fungsi loginUser dari controller
router.post("/login", loginUser);

// Rute untuk forgot password
router.post("/forgot-password", forgotPassword);

// Rute untuk reset password
router.post("/reset-password/:token", resetPassword);

// Export router agar bisa digunakan di server.js
export default router;
