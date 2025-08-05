import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { User, Mail, Briefcase, KeyRound, Loader2 } from "lucide-react";
import PasswordInput from "../components/PasswordInput";
import api from "../api/api"; // <-- Menggunakan api terpusat

const ProfileDetail = ({ icon: Icon, label, value }) => (
  <div className="flex items-center border-t border-gray-200 dark:border-gray-700 py-3">
    <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-4" />
    <div className="text-sm">
      <p className="font-medium text-gray-900 dark:text-white">{label}</p>
      <p className="text-gray-600 dark:text-gray-300">{value}</p>
    </div>
  </div>
);

const ProfilePage = () => {
  const { userData } = useOutletContext();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Password baru dan konfirmasi tidak cocok.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password baru minimal harus 6 karakter.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.put(
        // <-- Menggunakan api
        `/api/users/${userData._id}/password`,
        { currentPassword, newPassword }
      );
      setSuccess(response.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengganti password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Profil Saya
          </h2>
          <ProfileDetail
            icon={User}
            label="Nama Lengkap"
            value={userData.namaLengkap}
          />
          <ProfileDetail icon={Mail} label="Email" value={userData.email} />
          <ProfileDetail
            icon={Briefcase}
            label="Jabatan"
            value={userData.jabatan}
          />
          <ProfileDetail
            icon={KeyRound}
            label="Tipe Akses"
            value={userData.tipeAkses}
          />
        </div>
      </div>
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ganti Password
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password Saat Ini
              </label>
              <PasswordInput
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password Baru
              </label>
              <PasswordInput
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Konfirmasi Password Baru
              </label>
              <PasswordInput
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-500">{success}</p>}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
              >
                {loading ? "Menyimpan..." : "Simpan Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
