import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { useOutletContext } from "react-router-dom";
import { Users, FileText, Clock, Loader2, Plus, UserCog } from "lucide-react";
import toast from "react-hot-toast";

// Komponen untuk kartu statistik
const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  </div>
);

const DashboardContent = () => {
  const { userData } = useOutletContext();
  const [stats, setStats] = useState(null);
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, recentDocsRes] = await Promise.all([
          api.get("/api/dashboard/stats"),
          api.get("/api/dashboard/recent-documents"),
        ]);
        setStats(statsRes.data);
        setRecentDocs(recentDocsRes.data);
      } catch (error) {
        toast.error("Gagal memuat data dasbor.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Sambutan */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Selamat Datang, {userData?.namaLengkap || "Pengguna"}!
      </h1>

      {/* Grid Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={FileText}
          title="Total Dokumen"
          value={stats?.totalDocuments}
          color="bg-blue-500"
        />
        <StatCard
          icon={Users}
          title="Total Pengguna"
          value={stats?.totalUsers}
          color="bg-green-500"
        />
        <StatCard
          icon={Clock}
          title="Dokumen Baru (30 Hari)"
          value={stats?.recentDocuments}
          color="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Aktivitas Terbaru */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Aktivitas Terbaru
          </h2>
          <div className="space-y-4">
            {recentDocs.length > 0 ? (
              recentDocs.map((doc) => (
                <div
                  key={doc._id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <Link
                      to={`/documents/view/${doc._id}`}
                      className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {doc.judul}
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Diubah oleh {doc.createdBy?.namaLengkap || "N/A"} -{" "}
                      {new Date(doc.updatedAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {doc.jenisDokumen}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Tidak ada aktivitas terbaru.
              </p>
            )}
          </div>
        </div>

        {/* Kolom Pintasan Cepat */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Pintasan Cepat
          </h2>
          <div className="space-y-3">
            <Link
              to="/documents"
              className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FileText
                size={20}
                className="mr-3 text-gray-600 dark:text-gray-300"
              />
              <span className="text-gray-600 dark:text-gray-300">
                Semua Dokumen
              </span>
            </Link>
            {userData?.tipeAkses === "admin" && (
              <Link
                to="/users"
                className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <UserCog
                  size={20}
                  className="mr-3 text-gray-600 dark:text-gray-300"
                />
                <span className="text-gray-600 dark:text-gray-300">
                  Kelola Pengguna
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
