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
  ExternalLink,
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
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Function untuk handle download file yang proper
  const handleDownload = async () => {
    if (!doc.fileUrl) return;

    try {
      setLoading(true);

      // Download melalui backend endpoint
      const response = await api.get(`/api/documents/${id}/download`);

      // Check if response is JSON (redirect info) or blob (direct file)
      if (
        response.data &&
        typeof response.data === "object" &&
        response.data.redirectUrl
      ) {
        // Backend memberikan URL redirect, download langsung
        try {
          const directResponse = await fetch(response.data.redirectUrl);
          if (directResponse.ok) {
            const blob = await directResponse.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = response.data.fileName;
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            return;
          }
        } catch (directError) {
          // Fallback: buka di tab baru
          window.open(response.data.redirectUrl, "_blank");
          return;
        }
      }

      // Fallback: treat as blob (file streaming dari backend)
      const blobResponse = await api.get(`/api/documents/${id}/download`, {
        responseType: "blob",
      });

      const blob = blobResponse.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Dapatkan nama file dari header atau gunakan default
      const contentDisposition = blobResponse.headers["content-disposition"];
      let fileName = `${doc.judul}.pdf`;

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch) {
          fileName = fileNameMatch[1];
        }
      }

      link.download = fileName;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      setError(`Gagal mengunduh file: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function untuk get file type
  const getFileType = (url) => {
    if (!url) return "unknown";
    const extension = url.split(".").pop().toLowerCase();
    return extension;
  };

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/documents/${id}`);
        setDoc(data);
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

  if (!doc) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <Link
        to={`/documents/type/${encodeURIComponent(doc.jenisDokumen)}`}
        className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline mb-6"
      >
        <ArrowLeft size={18} className="mr-2" />
        Kembali ke Daftar {doc.jenisDokumen}
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {doc.judul}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Nomor Surat: {doc.nomorSurat}
          </p>
        </div>
        {doc.fileUrl && (
          <div className="mt-4 md:mt-0 space-x-2">
            <button
              onClick={handleDownload}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Download size={18} className="mr-2" />
              {loading ? "Mengunduh..." : "Unduh File"}
            </button>

            {/* Test connectivity button */}
            <button
              onClick={async () => {}}
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Test Server
            </button>
          </div>
        )}
      </div>

      {/* Preview Section - Langsung muncul jika ada file */}
      {doc.fileUrl && (
        <div className="mt-6 border-t dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Preview Dokumen
          </h3>
          <div
            className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
            style={{ minHeight: "400px" }}
          >
            {getFileType(doc.fileUrl) === "pdf" ? (
              <div className="relative">
                {/* Coba gunakan embed PDF, jika gagal tampilkan fallback */}
                <iframe
                  src={
                    doc.fileUrl.includes("cloudinary.com")
                      ? `https://docs.google.com/viewer?url=${encodeURIComponent(
                          doc.fileUrl
                        )}&embedded=true`
                      : doc.fileUrl
                  }
                  className="w-full border-0"
                  style={{ height: "600px" }}
                  title={`Preview ${doc.judul}`}
                  onLoad={(e) => {
                    // Hide fallback if iframe loads successfully
                    const fallback = document.getElementById("pdf-fallback");
                    if (fallback) fallback.style.display = "none";
                  }}
                  onError={(e) => {
                    console.error(
                      "PDF iframe failed to load, showing fallback"
                    );
                    e.target.style.display = "none";
                    const fallback = document.getElementById("pdf-fallback");
                    if (fallback) fallback.style.display = "block";
                  }}
                />
                {/* Fallback content */}
                <div id="pdf-fallback" className="hidden">
                  <div className="flex flex-col items-center justify-center h-96 text-gray-500 dark:text-gray-400">
                    <FileText size={48} className="mb-4" />
                    <p className="text-lg font-medium mb-2">
                      Preview PDF dalam browser
                    </p>
                    <p className="text-sm mb-4 text-center">
                      Klik tombol di bawah untuk membuka atau mendownload file.
                    </p>
                    <div className="flex gap-3">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        <ExternalLink size={16} className="mr-2" />
                        Buka di Tab Baru
                      </a>
                      <button
                        onClick={handleDownload}
                        className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      >
                        <Download size={16} className="mr-2" />
                        Download File
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : ["jpg", "jpeg", "png"].includes(getFileType(doc.fileUrl)) ? (
              <img
                src={doc.fileUrl}
                alt={`Preview ${doc.judul}`}
                className="w-full h-auto max-h-96 object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "block";
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <FileText size={48} className="mx-auto mb-2" />
                  <p>Preview tidak tersedia untuk tipe file ini</p>
                  <p className="text-sm">
                    Silakan unduh file untuk melihat isinya
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="border-t dark:border-gray-700 my-6"></div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
        <DetailItem
          icon={FileText}
          label="Jenis Dokumen"
          value={doc.jenisDokumen}
        />
        <DetailItem
          icon={Calendar}
          label="Tanggal Dokumen"
          value={new Date(doc.tanggalDokumen).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        />
        <DetailItem icon={Building} label="Nama PT" value={doc.namaPT} />
        <DetailItem
          icon={User}
          label="Dibuat Oleh"
          value={doc.createdBy?.namaLengkap || "N/A"}
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
