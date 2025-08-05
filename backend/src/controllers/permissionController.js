import Permission from "../models/Permission.js";

// Mengambil semua aturan hak akses
export const getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find({});
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Membuat atau memperbarui aturan hak akses untuk sebuah jabatan
export const setPermission = async (req, res) => {
  const { jabatan, allowedDocumentTypes } = req.body;
  if (!jabatan || !allowedDocumentTypes) {
    return res
      .status(400)
      .json({
        message: "Jabatan dan jenis dokumen yang diizinkan harus diisi.",
      });
  }
  try {
    // 'upsert: true' akan membuat dokumen baru jika jabatan belum ada
    const permission = await Permission.findOneAndUpdate(
      { jabatan },
      { allowedDocumentTypes },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(201).json(permission);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
