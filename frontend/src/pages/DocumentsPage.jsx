import React, { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import {
  Book,
  FileBarChart,
  Calendar,
  ClipboardList,
  FileText,
  Users,
  Briefcase,
  FileClock,
  Search,
  Plus,
} from "lucide-react";
import AddDocumentModal from "../components/AddDocumentModal";

const allDocumentTypes = [
  { name: "RAB", icon: FileBarChart, color: "text-blue-500", slug: "RAB" },
  {
    name: "Berita Acara",
    icon: ClipboardList,
    color: "text-green-500",
    slug: "Berita Acara",
  },
  {
    name: "Jadwal Piket",
    icon: Calendar,
    color: "text-yellow-500",
    slug: "Jadwal Piket",
  },
  {
    name: "Surat Jalan",
    icon: FileText,
    color: "text-purple-500",
    slug: "Surat Jalan",
  },
  {
    name: "Laporan Proyek",
    icon: Briefcase,
    color: "text-red-500",
    slug: "Laporan Proyek",
  },
  {
    name: "Absensi Karyawan",
    icon: Users,
    color: "text-teal-500",
    slug: "Absensi Karyawan",
  },
  {
    name: "Notulen Rapat",
    icon: Book,
    color: "text-orange-500",
    slug: "Notulen Rapat",
  },
  {
    name: "Arsip Kontrak",
    icon: FileClock,
    color: "text-pink-500",
    slug: "Arsip Kontrak",
  },
];

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
  const { allowedTypes } = useOutletContext(); // Ambil hak akses dari layout
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
          {allDocumentTypes
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
        allowedTypes={allowedTypes} // Teruskan hak akses ke modal
      />
    </>
  );
};

export default DocumentsPage;
