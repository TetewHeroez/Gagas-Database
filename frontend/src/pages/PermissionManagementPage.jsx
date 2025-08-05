import React, { useState, useEffect } from "react";
import api from "../api/api";
import toast from "react-hot-toast";
import { Lock, Save, Loader2 } from "lucide-react";

const PermissionManagementPage = () => {
  const [permissions, setPermissions] = useState({});
  const [jabatans, setJabatans] = useState([]);
  const [loading, setLoading] = useState(true);

  const documentTypes = [
    "RAB",
    "Berita Acara",
    "Jadwal Piket",
    "Surat Jalan",
    "Laporan Proyek",
    "Absensi Karyawan",
    "Notulen Rapat",
    "Arsip Kontrak",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil semua pengguna untuk mendapatkan daftar jabatan unik
        const usersRes = await api.get("/api/users?pageSize=1000"); // Ambil semua user
        const uniqueJabatans = [
          ...new Set(usersRes.data.users.map((u) => u.jabatan)),
        ].sort();
        setJabatans(uniqueJabatans);

        // Ambil semua aturan hak akses yang sudah ada
        const permissionsRes = await api.get("/api/permissions");
        const permsMap = permissionsRes.data.reduce((acc, p) => {
          acc[p.jabatan] = new Set(p.allowedDocumentTypes);
          return acc;
        }, {});
        setPermissions(permsMap);
      } catch (error) {
        toast.error("Gagal memuat data hak akses.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCheckboxChange = (jabatan, docType) => {
    setPermissions((prev) => {
      // Salin state sebelumnya untuk dimodifikasi
      const newPerms = { ...prev };

      // Pastikan ada Set untuk jabatan ini
      if (!newPerms[jabatan]) {
        newPerms[jabatan] = new Set();
      }

      // Salin Set yang ada agar tidak memutasi state secara langsung
      const jabatanPerms = new Set(newPerms[jabatan]);

      // Tambah atau hapus item dari Set
      if (jabatanPerms.has(docType)) {
        jabatanPerms.delete(docType);
      } else {
        jabatanPerms.add(docType);
      }

      // Perbarui state dengan Set yang sudah dimodifikasi
      newPerms[jabatan] = jabatanPerms;
      return newPerms;
    });
  };

  const handleSave = async (jabatan) => {
    const toastId = toast.loading(`Menyimpan hak akses untuk ${jabatan}...`);
    try {
      const allowedDocumentTypes = permissions[jabatan]
        ? Array.from(permissions[jabatan])
        : [];
      await api.post("/api/permissions", { jabatan, allowedDocumentTypes });
      toast.success(`Hak akses untuk ${jabatan} berhasil disimpan.`, {
        id: toastId,
      });
    } catch (error) {
      toast.error(`Gagal menyimpan hak akses.`, { id: toastId });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Pengaturan Hak Akses Dokumen
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Atur jenis dokumen apa saja yang dapat diakses oleh setiap jabatan.
        Jangan lupa klik "Simpan" setelah membuat perubahan.
      </p>
      <div className="space-y-6">
        {jabatans.map((jabatan) => (
          <div
            key={jabatan}
            className="border dark:border-gray-700 rounded-lg p-4"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {jabatan}
              </h2>
              <button
                onClick={() => handleSave(jabatan)}
                className="flex items-center px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
              >
                <Save size={16} className="mr-2" /> Simpan
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {documentTypes.map((docType) => (
                <label
                  key={docType}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="rounded text-indigo-600 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-600"
                    checked={permissions[jabatan]?.has(docType) || false}
                    onChange={() => handleCheckboxChange(jabatan, docType)}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {docType}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermissionManagementPage;
