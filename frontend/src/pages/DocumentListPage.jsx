import React, { useState, useEffect } from "react";
import { useParams, Link, useOutletContext } from "react-router-dom"; // 1. Impor useOutletContext
import api from "../api/api";
import toast from "react-hot-toast";
import {
  FileText,
  ArrowLeft,
  Loader2,
  Trash2,
  Edit,
  FileX2,
} from "lucide-react";
import ConfirmationModal from "../components/ConfirmationModal";
import EditDocumentModal from "../components/EditDocumentModal";
import { useUndo } from "../hooks/useUndo.jsx";
import Pagination from "../components/Pagination";
import SortableHeader from "../components/SortableHeader";

const DocumentListPage = () => {
  const { type } = useParams();
  const { allowedTypes } = useOutletContext(); // 2. Ambil hak akses dari layout
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State untuk pagination & sorting
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingDocument, setDeletingDocument] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);

  const triggerDocumentDelete = useUndo(
    documents,
    setDocuments,
    "Dokumen",
    "/api/documents"
  );

  useEffect(() => {
    const fetchDocuments = async (pageNumber, size, sort) => {
      try {
        setLoading(true);
        setError("");
        const params = new URLSearchParams({
          pageNumber,
          pageSize: size,
          sortBy: sort.key,
          sortOrder: sort.direction,
        });
        const { data } = await api.get(
          `/api/documents/type/${type}?${params.toString()}`
        );
        setDocuments(data.documents);
        setPage(data.page);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError("Gagal memuat dokumen. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments(page, pageSize, sortConfig);
  }, [type, page, pageSize, sortConfig]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setPage(1);
  };

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
    setPage(1);
  };

  const handleDocumentUpdated = (updatedDoc) => {
    setDocuments((currentDocs) =>
      currentDocs.map((doc) => (doc._id === updatedDoc._id ? updatedDoc : doc))
    );
  };

  const openDeleteModal = (doc) => {
    setDeletingDocument(doc);
    setIsDeleteModalOpen(true);
  };
  const openEditModal = (doc) => {
    setEditingDocument(doc);
    setIsEditModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingDocument) return;
    triggerDocumentDelete(deletingDocument);
    setIsDeleteModalOpen(false);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="animate-spin w-8 h-8 text-indigo-500" />
        </div>
      );
    }
    if (error) {
      return <p className="text-center text-red-500">{error}</p>;
    }
    if (documents.length === 0 && !loading) {
      return (
        <div className="text-center py-10 border-2 border-dashed rounded-lg mt-6">
          <FileX2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
            Tidak Ada Dokumen
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Belum ada dokumen yang ditambahkan untuk jenis ini.
          </p>
        </div>
      );
    }
    return (
      <>
        <div className="mt-6 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead>
                  <tr>
                    <SortableHeader
                      field="judul"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    >
                      Judul & Perihal
                    </SortableHeader>
                    <SortableHeader
                      field="nomorSurat"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    >
                      Nomor Surat
                    </SortableHeader>
                    <SortableHeader
                      field="tanggalDokumen"
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    >
                      Tanggal
                    </SortableHeader>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Dibuat Oleh
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                    >
                      <span className="sr-only">Aksi</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {documents.map((doc) => (
                    <tr key={doc._id}>
                      <td className="py-4 pl-4 pr-3 text-sm sm:pl-0">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {doc.judul}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {doc.perihal}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {doc.nomorSurat}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {new Date(doc.tanggalDokumen).toLocaleDateString(
                          "id-ID"
                        )}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {doc.createdBy?.namaLengkap || "N/A"}
                        </div>
                        <div className="text-xs">
                          {doc.createdBy?.divisi || ""}
                        </div>
                      </td>
                      <td className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 space-x-2">
                        <Link
                          to={`/documents/view/${doc._id}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Lihat
                        </Link>
                        <button
                          onClick={() => openEditModal(doc)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(doc)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <div>
            <label
              htmlFor="pageSizeSelectDoc"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2"
            >
              Baris per halaman:
            </label>
            <select
              id="pageSizeSelectDoc"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </>
    );
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <Link
          to="/documents"
          className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline mb-6"
        >
          <ArrowLeft size={18} className="mr-2" />
          Kembali ke Jenis Dokumen
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Daftar Dokumen: {type}
        </h1>
        {renderContent()}
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Dokumen"
        message={`Apakah Anda yakin ingin menghapus dokumen "${deletingDocument?.judul}"? Aksi ini tidak dapat dibatalkan.`}
      />
      {/* 3. Teruskan allowedTypes ke modal edit */}
      <EditDocumentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        documentToEdit={editingDocument}
        onDocumentUpdated={handleDocumentUpdated}
        allowedTypes={allowedTypes}
      />
    </>
  );
};

export default DocumentListPage;
