import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { sendResetPasswordEmail } from "../utils/emailService.js";
import crypto from "crypto";

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

// Forgot Password - Mengirim email reset password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email harus diisi" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    if (user.status === "nonaktif") {
      return res.status(403).json({ 
        message: "Akun Anda telah dinonaktifkan. Silakan hubungi administrator." 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token dan simpan ke database
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 jam

    await user.save();

    // Kirim email
    const emailResult = await sendResetPasswordEmail(user.email, resetToken, user.namaLengkap);

    if (!emailResult.success) {
      return res.status(500).json({ 
        message: "Gagal mengirim email reset password. Silakan coba lagi." 
      });
    }

    res.status(200).json({
      message: "Email reset password telah dikirim. Silakan cek inbox Anda."
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Reset Password - Mengubah password dengan token
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return res.status(400).json({ message: "Password dan konfirmasi password harus diisi" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Password dan konfirmasi password tidak cocok" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password minimal 6 karakter" });
  }

  try {
    // Hash token yang diterima
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Cari user dengan token yang valid dan belum kedaluwarsa
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Token reset password tidak valid atau sudah kedaluwarsa" 
      });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "Password berhasil direset. Silakan login dengan password baru."
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
