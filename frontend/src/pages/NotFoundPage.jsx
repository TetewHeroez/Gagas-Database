import React from "react";
import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";

const NotFoundPage = () => {
  return (
    // Kita gunakan layout yang sama seperti halaman login agar posisinya di tengah
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 font-sans">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <SearchX className="w-16 h-16 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          404 - Halaman Tidak Ditemukan
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
          >
            Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
