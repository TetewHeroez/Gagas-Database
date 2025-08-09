import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware untuk melindungi rute
const protect = async (req, res, next) => {
  let token;

  // Baca token dari header 'Authorization'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Ambil token dari header (format: "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      // Verifikasi token menggunakan kunci rahasia
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Ambil data pengguna dari token dan lampirkan ke object 'req'
      // Ini membuat data pengguna tersedia di semua controller selanjutnya
      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Tidak terotorisasi, pengguna tidak ditemukan" });
      }

      next(); // Lanjutkan ke controller berikutnya
    } catch (error) {
      console.error("Token verification error:", error.message);
      return res
        .status(401)
        .json({ message: "Tidak terotorisasi, token gagal" });
    }
  } else {
    return res
      .status(401)
      .json({ message: "Tidak terotorisasi, tidak ada token" });
  }
};

// Middleware untuk membatasi akses hanya untuk admin
const admin = (req, res, next) => {
  if (req.user && req.user.tipeAkses === "admin") {
    next(); // Lanjutkan jika pengguna adalah admin
  } else {
    res.status(403).json({ message: "Tidak diizinkan, hanya untuk admin" });
  }
};

export { protect, admin };
