import User from "../models/User.js";
import Document from "../models/Document.js";

// @desc    Mendapatkan statistik dasar
// @route   GET /api/dashboard/stats
// @access  Private
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDocuments = await Document.countDocuments();

    // Menghitung dokumen yang dibuat dalam 30 hari terakhir
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentDocuments = await Document.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    res.json({
      totalUsers,
      totalDocuments,
      recentDocuments,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Mendapatkan dokumen yang baru diubah
// @route   GET /api/dashboard/recent-documents
// @access  Private
export const getRecentDocuments = async (req, res) => {
  try {
    const recentDocs = await Document.find()
      .sort({ updatedAt: -1 }) // Urutkan berdasarkan yang paling baru diubah
      .limit(5) // Ambil 5 teratas
      .populate("createdBy", "namaLengkap"); // Ambil nama pembuatnya

    res.json(recentDocs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
