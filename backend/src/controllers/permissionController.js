import Permission from "../models/Permission.js";

export const getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find({});
    res.json(permissions);
  } catch (error) {
    console.error("❌ Error getting permissions:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const setPermission = async (req, res) => {
  // Menggunakan 'divisi' bukan 'jabatan'
  const { divisi, allowedDocumentTypes } = req.body;

  if (!divisi || !allowedDocumentTypes) {
    return res.status(400).json({
      message: "Divisi dan jenis dokumen yang diizinkan harus diisi.",
    });
  }

  try {
    const permission = await Permission.findOneAndUpdate(
      { divisi }, // Cari berdasarkan 'divisi'
      { allowedDocumentTypes },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(201).json(permission);
  } catch (error) {
    console.error("❌ Permission update error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
