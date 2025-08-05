import React from "react";
import {
  Book,
  FileBarChart,
  Calendar,
  ClipboardList,
  FileText,
  Users,
  Briefcase,
  FileClock,
} from "lucide-react";

// Data untuk 8 jenis dokumen
const documentTypes = [
  { name: "RAB", icon: FileBarChart, color: "text-blue-500" },
  { name: "Berita Acara", icon: ClipboardList, color: "text-green-500" },
  { name: "Jadwal Piket", icon: Calendar, color: "text-yellow-500" },
  { name: "Surat Jalan", icon: FileText, color: "text-purple-500" },
  { name: "Laporan Proyek", icon: Briefcase, color: "text-red-500" },
  { name: "Absensi Karyawan", icon: Users, color: "text-teal-500" },
  { name: "Notulen Rapat", icon: Book, color: "text-orange-500" },
  { name: "Arsip Kontrak", icon: FileClock, color: "text-pink-500" },
];

const DocumentCard = ({ name, icon: Icon, color }) => (
  <a
    href="#"
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
  </a>
);

const DocumentsPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Jenis Dokumen
        </h1>
        {/* Di sini nanti kita bisa tambahkan tombol "Tambah Dokumen" dan "Cari" */}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {documentTypes.map((doc) => (
          <DocumentCard key={doc.name} {...doc} />
        ))}
      </div>
    </div>
  );
};

export default DocumentsPage;
