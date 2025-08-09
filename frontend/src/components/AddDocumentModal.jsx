import React, { useState, useEffect } from "react";
import { X, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/api";
// Impor state awal
import { initialDocumentState } from "../constants/documentTypes";

const AddDocumentModal = ({
  isOpen,
  onClose,
  onDocumentAdded,
  allowedTypes,
}) => {
  // Gunakan state awal dari konstanta
  const [formData, setFormData] = useState(initialDocumentState);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Pilih file (opsional)...");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && allowedTypes && allowedTypes.length > 0) {
      // Set nilai default dropdown dan reset form saat modal dibuka
      setFormData({ ...initialDocumentState, jenisDokumen: allowedTypes[0] });
    }
  }, [isOpen, allowedTypes]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(
      e.target.files[0] ? e.target.files[0].name : "Pilih file (opsional)..."
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (
        !formData.judul ||
        !formData.jenisDokumen ||
        !formData.nomorSurat ||
        !formData.tanggalDokumen ||
        !formData.perihal
      ) {
        toast.error("Harap isi semua field yang wajib!");
        setLoading(false);
        return;
      }

      const uploadData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          // Only append non-empty values
          uploadData.append(key, formData[key]);
        }
      });

      if (file) {
        uploadData.append("documentFile", file);
      }

      const { data } = await api.post("/api/documents", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Dokumen berhasil disimpan!");
      onDocumentAdded(data);

      // Reset form
      setFormData(initialDocumentState);
      setFile(null);
      setFileName("Pilih file (opsional)...");
      onClose();
    } catch (error) {
      console.error("Error submitting document:", error);
      console.error("Error response:", error.response);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        toast.error(
          "Validation errors: " + error.response.data.errors.join(", ")
        );
      } else if (error.message) {
        toast.error("Error: " + error.message);
      } else {
        toast.error("Gagal menyimpan dokumen. Silakan coba lagi.");
      }
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
          Tambah Dokumen Baru
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
            name="perihal"
            value={formData.perihal}
            onChange={handleChange}
            placeholder="Isi / Perihal"
            required
            rows="3"
            className={inputClass}
          ></textarea>
          <input
            name="hardCopyLocation"
            value={formData.hardCopyLocation}
            onChange={handleChange}
            placeholder="Lokasi Hard Copy (Opsional)"
            className={inputClass}
          />
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                >
                  <span>Unggah file</span>
                  <input
                    id="file-upload"
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
              {loading ? "Mengunggah..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDocumentModal;
