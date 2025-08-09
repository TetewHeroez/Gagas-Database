import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/api";
import { useOutletContext } from "react-router-dom";
import { divisionList } from "../constants/divisions";

const EditUserModal = ({ isOpen, onClose, userToEdit, onUserUpdated }) => {
  const { userData } = useOutletContext();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    namaLengkap: "",
    tipeAkses: "user",
    divisi: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        username: userToEdit.username,
        email: userToEdit.email,
        namaLengkap: userToEdit.namaLengkap,
        tipeAkses: userToEdit.tipeAkses,
        divisi: userToEdit.divisi,
      });
    }
  }, [userToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.put(`/api/users/${userToEdit.id}`, formData);
      onUserUpdated(response.data.user);
      toast.success("Data pengguna berhasil diperbarui!");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memperbarui pengguna.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed";

  const isSelfEditingAdmin =
    userData?._id === userToEdit.id && userData?.tipeAkses === "admin";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Edit Pengguna
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
            className={inputClass}
          />
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className={inputClass}
          />
          <input
            name="namaLengkap"
            value={formData.namaLengkap}
            onChange={handleChange}
            placeholder="Nama Lengkap"
            required
            className={inputClass}
          />
          <select
            name="tipeAkses"
            value={formData.tipeAkses}
            onChange={handleChange}
            className={inputClass}
            disabled={isSelfEditingAdmin}
            title={
              isSelfEditingAdmin
                ? "Anda tidak dapat mengubah tipe akses akun Anda sendiri."
                : ""
            }
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <select
            name="divisi"
            value={formData.divisi}
            onChange={handleChange}
            className={inputClass}
          >
            {divisionList.map((div) => (
              <option key={div} value={div}>
                {div}
              </option>
            ))}
          </select>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
