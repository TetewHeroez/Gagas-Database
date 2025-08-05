import User from "../models/User.js"; // Impor model User

// --- FUNGSI BARU UNTUK MENGAMBIL PROFIL PENGGUNA LOGIN ---
export const getUserProfile = async (req, res) => {
  // Middleware 'protect' sudah bekerja di sini. Ia mengambil token,
  // memverifikasinya, dan melampirkan data pengguna ke 'req.user'.
  // Jadi, kita hanya perlu mengirim kembali data tersebut.
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(404).json({ message: "Pengguna tidak ditemukan" });
  }
};

// --- FUNGSI CREATE USER ---
export const createUser = async (req, res) => {
  const { username, email, namaLengkap, password, tipeAkses, jabatan } =
    req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "Email sudah terdaftar." });
    }

    const user = await User.create({
      username,
      email,
      namaLengkap,
      password,
      tipeAkses,
      jabatan,
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

// --- FUNGSI UPDATE USER ---
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.namaLengkap = req.body.namaLengkap || user.namaLengkap;
      user.tipeAkses = req.body.tipeAkses || user.tipeAkses;
      user.jabatan = req.body.jabatan || user.jabatan;
      // Logika untuk mengubah password bisa ditambahkan di sini jika perlu

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

// --- FUNGSI BARU UNTUK GANTI PASSWORD ---
export const changeUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Password lama dan baru harus diisi." });
  }

  try {
    // Cari pengguna berdasarkan ID dari URL
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan." });
    }

    // Cocokkan password lama yang dimasukkan dengan yang ada di database
    if (await user.matchPassword(currentPassword)) {
      // Jika cocok, set password baru.
      // Hook pre-save di model User akan otomatis mengenkripsinya.
      user.password = newPassword;
      await user.save();
      res.json({ message: "Password berhasil diperbarui!" });
    } else {
      // Jika password lama tidak cocok
      res.status(401).json({ message: "Password lama salah." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// --- FUNGSI BARU UNTUK HAPUS PENGGUNA ---
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Tambahan: Jangan biarkan admin menghapus akunnya sendiri
      // Anda perlu cara untuk mendapatkan ID admin yang sedang login dari token,
      // untuk saat ini kita asumsikan tidak bisa menghapus 'admin@example.com'
      if (user.email === "admin@example.com") {
        res.status(400);
        throw new Error("Tidak dapat menghapus akun administrator utama.");
      }

      await user.deleteOne();
      res.json({ message: "Pengguna berhasil dihapus" });
    } else {
      res.status(404);
      throw new Error("Pengguna tidak ditemukan");
    }
  } catch (error) {
    // Pastikan untuk mengirim status yang sesuai jika sudah diatur
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "desc";

    // Buat filter berdasarkan query status
    const statusFilter = req.query.status ? { status: req.query.status } : {};

    const sortOptions = { [sortBy]: sortOrder };

    const count = await User.countDocuments(statusFilter);
    const users = await User.find(statusFilter)
      .sort(sortOptions)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .select("-password");

    res.json({
      users,
      page,
      totalPages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// --- FUNGSI DELETE DIGANTI MENJADI TOGGLE STATUS ---
export const toggleUserStatus = async (req, res) => {
  try {
    // req.user._id disediakan oleh middleware 'protect'
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
