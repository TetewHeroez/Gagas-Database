import React, { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { Search, Plus, Loader2 } from "lucide-react";
import AddDocumentModal from "../components/AddDocumentModal";
import { documentTypesDetails } from "../constants/documentTypes";

const DocumentCard = ({ name, icon: Icon, color, slug }) => (
  <Link
    to={`/documents/type/${encodeURIComponent(slug)}`}
    className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
  >
    <div className="flex items-center space-x-4">
      <Icon className={`w-10 h-10 ${color}`} />
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Lihat Dokumen
        </p>
      </div>
    </div>
  </Link>
);

const DocumentsPage = () => {
  const { userData, allowedTypes } = useOutletContext();
  const [loading, setLoading] = useState(!allowedTypes); // Tampilkan loading jika allowedTypes belum ada
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleDocumentAdded = (newDocument) => {
    navigate(`/documents/type/${encodeURIComponent(newDocument.jenisDokumen)}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Jenis Dokumen
          </h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <form
              onSubmit={handleSearch}
              className="w-full md:w-auto flex-grow"
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari dokumen..."
                  className="w-full p-2 pl-10 rounded-lg border dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  aria-label="Cari"
                  className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-shrink-0 flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus size={20} className="mr-2" />
              Tambah
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {documentTypesDetails
            .filter((doc) => allowedTypes.includes(doc.slug))
            .map((doc) => (
              <DocumentCard key={doc.name} {...doc} />
            ))}
        </div>
        {allowedTypes.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed rounded-lg mt-6">
            <p className="text-gray-500 dark:text-gray-400">
              Anda tidak memiliki hak akses untuk melihat jenis dokumen apapun.
            </p>
          </div>
        )}
      </div>
      <AddDocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDocumentAdded={handleDocumentAdded}
        allowedTypes={allowedTypes}
      />
    </>
  );
};

export default DocumentsPage;
