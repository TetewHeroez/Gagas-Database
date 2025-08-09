import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/api";
import { FileText, ArrowLeft, Loader2, SearchX, Filter } from "lucide-react";
import Pagination from "../components/Pagination";

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State untuk hasil pencarian dan UI
  const [documents, setDocuments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State untuk form filter
  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    jenisDokumen: searchParams.get("jenisDokumen") || "",
    namaPT: searchParams.get("namaPT") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  });

  const documentTypes = [
    "RAB",
    "Berita Acara",
    "Jadwal Piket",
    "Surat Jalan",
    "Laporan Proyek",
    "Absensi Karyawan",
    "Notulen Rapat",
    "Arsip Kontrak",
  ];

  useEffect(() => {
    const fetchResults = async (pageNumber) => {
      try {
        setLoading(true);
        setError("");

        // Bangun query string dari state filter
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
        params.append("pageNumber", pageNumber);

        const { data } = await api.get(
          `/api/documents/search?${params.toString()}`
        );

        setDocuments(data.documents);
        setPage(data.page);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError("Gagal melakukan pencarian. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };
    fetchResults(1); // Selalu fetch halaman pertama saat filter berubah
  }, [filters]); // Effect ini akan berjalan setiap kali state 'filters' berubah

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    // Perbarui URL saat filter diubah
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev);
        if (value) {
          newParams.set(name, value);
        } else {
          newParams.delete(name);
        }
        return newParams;
      },
      { replace: true }
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters({
      q: searchParams.get("q") || "",
      jenisDokumen: searchParams.get("jenisDokumen") || "",
      namaPT: searchParams.get("namaPT") || "",
      startDate: searchParams.get("startDate") || "",
      endDate: searchParams.get("endDate") || "",
    });
  };

  const handlePageChange = (newPage) => {
    // Fungsi ini belum diimplementasikan, akan kita tambahkan nanti
  };

  // Kelas konsisten untuk input form
  const inputClass =
    "w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Panel Filter */}
      <div className="lg:w-1/4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md sticky top-6">
          <h2 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white mb-4">
            <Filter size={18} className="mr-2" /> Filter Pencarian
          </h2>
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <input
              type="text"
              name="q"
              value={searchParams.get("q") || ""}
              onChange={handleFilterChange}
              placeholder="Kata Kunci..."
              className={inputClass}
            />
            <select
              name="jenisDokumen"
              value={searchParams.get("jenisDokumen") || ""}
              onChange={handleFilterChange}
              className={inputClass}
            >
              <option value="">Semua Jenis</option>
              {documentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="namaPT"
              value={searchParams.get("namaPT") || ""}
              onChange={handleFilterChange}
              placeholder="Nama PT..."
              className={inputClass}
            />
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Dari Tanggal:
              </label>
              <input
                type="date"
                name="startDate"
                value={searchParams.get("startDate") || ""}
                onChange={handleFilterChange}
                className={`${inputClass} mt-1 dark:color-scheme-dark`}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sampai Tanggal:
              </label>
              <input
                type="date"
                name="endDate"
                value={searchParams.get("endDate") || ""}
                onChange={handleFilterChange}
                className={`${inputClass} mt-1 dark:color-scheme-dark`}
              />
            </div>
            <button
              type="submit"
              className="w-full p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Terapkan Filter
            </button>
          </form>
        </div>
      </div>

      {/* Hasil Pencarian */}
      <div className="lg:w-3/4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Hasil Pencarian
          </h1>
          {loading && (
            <div className="flex justify-center p-8">
              <Loader2 className="animate-spin w-8 h-8 text-indigo-500" />
            </div>
          )}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && !error && (
            <>
              <div className="space-y-3">
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <div
                      key={doc._id}
                      className="p-4 border rounded-lg dark:border-gray-700 flex items-center justify-between"
                    >
                      <div className="flex items-center overflow-hidden">
                        <FileText className="w-6 h-6 text-gray-500 mr-4 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {doc.judul}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Jenis: {doc.jenisDokumen} | No: {doc.nomorSurat}
                          </p>
                        </div>
                      </div>
                      <Link
                        to={`/documents/view/${doc._id}`}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 ml-4 flex-shrink-0"
                      >
                        Lihat
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <SearchX className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Tidak ada dokumen yang cocok. Coba ubah filter Anda.
                    </p>
                  </div>
                )}
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
