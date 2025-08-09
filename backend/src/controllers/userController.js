import User from "../models/User.js";

// --- FUNGSI CREATEUSER (DIPERBARUI) ---
export const createUser = async (req, res) => {
  // Menggunakan 'divisi' bukan 'jabatan'
  const { username, email, namaLengkap, password, tipeAkses, divisi } =
    req.body;

  try {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(409).json({ message: "Email sudah terdaftar." });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res
        .status(409)
        .json({
          message: "Username sudah digunakan. Silakan pilih yang lain.",
        });
    }

    const user = await User.create({
      username,
      email,
      namaLengkap,
      password,
      tipeAkses,
      divisi,
    });

    if (user) {
      const { password: _, ...userWithoutPassword } = user.toObject();
      res.status(201).json({
        message: "Pengguna berhasil dibuat!",
        user: userWithoutPassword,
      });
    } else {
      res.status(400).json({ message: "Data pengguna tidak valid" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// --- FUNGSI UPDATEUSER (DIPERBARUI) ---
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (
        req.user._id.toString() === user._id.toString() &&
        user.tipeAkses === "admin" &&
        req.body.tipeAkses !== "admin"
      ) {
        return res
          .status(400)
          .json({
            message: "Anda tidak dapat mengubah tipe akses akun Anda sendiri.",
          });
      }

      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.namaLengkap = req.body.namaLengkap || user.namaLengkap;
      user.tipeAkses = req.body.tipeAkses || user.tipeAkses;
      // Menggunakan 'divisi' bukan 'jabatan'
      user.divisi = req.body.divisi || user.divisi;

      const updatedUser = await user.save();
      const { password: _, ...userWithoutPassword } = updatedUser.toObject();

      res.status(200).json({
        message: "Pengguna berhasil diperbarui!",
        user: userWithoutPassword,
      });
    } else {
      res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// --- FUNGSI LAINNYA ---
// (Fungsi lain seperti getUsers, getUserProfile, dll. tidak perlu diubah
// karena mereka tidak secara langsung memanipulasi field 'jabatan')
export const getUsers = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "desc";
    const statusFilter = req.query.status ? { status: req.query.status } : {};
    const sortOptions = { [sortBy]: sortOrder };
    const count = await User.countDocuments(statusFilter);
    const users = await User.find(statusFilter)
      .sort(sortOptions)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .select("-password");
    res.json({ users, page, totalPages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
export const getUserProfile = async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(404).json({ message: "Pengguna tidak ditemukan" });
  }
};
export const changeUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Password lama dan baru harus diisi." });
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan." });
    }
    if (await user.matchPassword(currentPassword)) {
      user.password = newPassword;
      await user.save();
      res.json({ message: "Password berhasil diperbarui!" });
    } else {
      res.status(401).json({ message: "Password lama salah." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};
export const toggleUserStatus = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Anda tidak dapat menonaktifkan akun Anda sendiri." });
    }
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === process.env.ADMIN_EMAIL) {
        return res
          .status(400)
          .json({
            message: "Tidak dapat menonaktifkan akun administrator utama.",
          });
      }
      user.status = user.status === "aktif" ? "nonaktif" : "aktif";
      await user.save();
      res.json({
        message: `Status pengguna berhasil diubah menjadi ${user.status}`,
      });
    } else {
      res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
