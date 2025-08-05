import React, { useState, useEffect } from "react";
import { X, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/api";

const EditDocumentModal = ({
  isOpen,
  onClose,
  documentToEdit,
  onDocumentUpdated,
  allowedTypes,
}) => {
  const [formData, setFormData] = useState({
    judul: "",
    jenisDokumen: "",
    nomorSurat: "",
    tanggalDokumen: "",
    namaPT: "",
    isi: "",
  });
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Pilih file baru (opsional)...");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (documentToEdit) {
      setFormData({
        judul: documentToEdit.judul,
        jenisDokumen: documentToEdit.jenisDokumen,
        nomorSurat: documentToEdit.nomorSurat,
        tanggalDokumen: new Date(documentToEdit.tanggalDokumen)
          .toISOString()
          .split("T")[0],
        namaPT: documentToEdit.namaPT,
        isi: documentToEdit.isi,
      });
    }
  }, [documentToEdit]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(
      e.target.files[0]
        ? e.target.files[0].name
        : "Pilih file baru (opsional)..."
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const uploadData = new FormData();
    Object.keys(formData).forEach((key) =>
      uploadData.append(key, formData[key])
    );
    if (file) {
      uploadData.append("documentFile", file);
    }
    try {
      const { data } = await api.put(
        `/api/documents/${documentToEdit._id}`,
        uploadData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Dokumen berhasil diperbarui!");
      onDocumentUpdated(data);
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Gagal memperbarui dokumen."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Edit Dokumen
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="judul"
            value={formData.judul}
            onChange={handleChange}
            placeholder="Judul Dokumen"
            required
            className={inputClass}
          />
          <select
            name="jenisDokumen"
            value={formData.jenisDokumen}
            onChange={handleChange}
            className={inputClass}
          >
            {allowedTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            name="nomorSurat"
            value={formData.nomorSurat}
            onChange={handleChange}
            placeholder="Nomor Surat"
            required
            className={inputClass}
          />
          <input
            name="tanggalDokumen"
            value={formData.tanggalDokumen}
            type="date"
            onChange={handleChange}
            required
            className={`${inputClass} dark:color-scheme-dark`}
          />
          <input
            name="namaPT"
            value={formData.namaPT}
            onChange={handleChange}
            placeholder="Nama PT"
            className={inputClass}
          />
          <textarea
            name="isi"
            value={formData.isi}
            onChange={handleChange}
            placeholder="Isi / Ringkasan Dokumen"
            required
            rows="3"
            className={inputClass}
          ></textarea>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label
                  htmlFor="edit-file-upload"
                  className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                >
                  <span>Ganti file</span>
                  <input
                    id="edit-file-upload"
                    name="documentFile"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">atau seret dan lepas</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {fileName}
              </p>
            </div>
          </div>
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

export default EditDocumentModal;
