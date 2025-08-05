import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password harus diisi" });
  }

  try {
    const user = await User.findOne({ email });

    // Jika pengguna ditemukan DAN password cocok
    if (user && (await user.matchPassword(password))) {
      // --- PENGECEKAN BARU ---
      if (user.status === "nonaktif") {
        return res
          .status(403)
          .json({
            message:
              "Akun Anda telah dinonaktifkan. Silakan hubungi administrator.",
          });
      }
      // --- ---

      const token = generateToken(res, user._id, user.tipeAkses);
      const { password: _, ...userWithoutPassword } = user.toObject();

      res.status(200).json({
        message: "Login berhasil!",
        user: userWithoutPassword,
        token: token,
      });
    } else {
      res.status(401).json({ message: "Email atau password salah" });
    }
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
