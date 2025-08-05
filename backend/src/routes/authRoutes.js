// src/routes/authRoutes.js
import express from "express";
import { loginUser } from "../controllers/authController.js";

// Membuat instance router dari Express
const router = express.Router();

// Mendefinisikan rute untuk login
// Ketika ada request POST ke '/login', jalankan fungsi loginUser dari controller
router.post("/login", loginUser);

// Export router agar bisa digunakan di server.js
export default router;
