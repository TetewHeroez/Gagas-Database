import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import {
  Loader2,
  ArrowLeft,
  FileText,
  Calendar,
  Building,
  User,
  Download,
} from "lucide-react";

// Komponen kecil untuk menampilkan detail
const DetailItem = ({ icon: Icon, label, value }) => (
  <div>
    <dt className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </dt>
    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{value}</dd>
  </div>
);

const DocumentDetailPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/documents/${id}`);
        setDocument(data);
      } catch (err) {
        setError("Gagal memuat detail dokumen. Mungkin dokumen ini tidak ada.");
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  if (!document) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <Link
        to={`/documents/type/${encodeURIComponent(document.jenisDokumen)}`}
        className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline mb-6"
      >
        <ArrowLeft size={18} className="mr-2" />
        Kembali ke Daftar {document.jenisDokumen}
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {document.judul}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Nomor Surat: {document.nomorSurat}
          </p>
        </div>
        {document.fileUrl && (
          <a
            href={document.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={18} className="mr-2" />
            Unduh File
          </a>
        )}
      </div>

      <div className="border-t dark:border-gray-700 my-6"></div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
        <DetailItem
          icon={FileText}
          label="Jenis Dokumen"
          value={document.jenisDokumen}
        />
        <DetailItem
          icon={Calendar}
          label="Tanggal Dokumen"
          value={new Date(document.tanggalDokumen).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        />
        <DetailItem icon={Building} label="Nama PT" value={document.namaPT} />
        <DetailItem
          icon={User}
          label="Dibuat Oleh"
          value={document.createdBy?.namaLengkap || "N/A"}
        />
      </dl>

      <div className="mt-6 border-t dark:border-gray-700 pt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Isi / Ringkasan
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
          {document.isi}
        </p>
      </div>
    </div>
  );
};

export default DocumentDetailPage;
