import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null; // Jangan tampilkan pagination jika hanya ada satu halaman
  }

  return (
    <div className="flex items-center justify-between mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        <ChevronLeft size={18} className="mr-2" />
        Sebelumnya
      </button>

      <span className="text-sm text-gray-700 dark:text-gray-400">
        Halaman{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {page}
        </span>{" "}
        dari{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {totalPages}
        </span>
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        Berikutnya
        <ChevronRight size={18} className="ml-2" />
      </button>
    </div>
  );
};

export default Pagination;
