import Permission from "../models/Permission.js";
import { documentTypesEnum } from "../constants/documentConstants.js";

export const getPermissions = async (req, res) => {
  try {
    // Filter out Database Admin from permissions list
    const permissions = await Permission.find({ 
      divisi: { $ne: "Database Admin" } 
    });
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const setPermission = async (req, res) => {
  // Menggunakan 'divisi' bukan 'jabatan'
  const { divisi, allowedDocumentTypes } = req.body;

  // Prevent setting permissions for Database Admin
  if (divisi === "Database Admin") {
    return res.status(403).json({
      message: "Database Admin permissions cannot be modified.",
    });
  }

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
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
