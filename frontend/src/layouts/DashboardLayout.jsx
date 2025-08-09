import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import api from "../api/api";
import { documentTypesList } from "../constants/documentTypes";

const DashboardLayout = ({ userData, onLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [allowedTypes, setAllowedTypes] = useState([]); // State baru untuk hak akses

  // useEffect untuk mengambil hak akses berdasarkan pengguna yang login
  useEffect(() => {
    const fetchPermissions = async () => {
      if (!userData) return;
      // Admin diizinkan mengakses semua jenis dokumen
      if (userData.tipeAkses === "admin") {
        setAllowedTypes(documentTypesList);
        return;
      }
      // Pengguna biasa akan mengambil hak akses dari server
      try {
        const { data } = await api.get("/api/permissions");
        const userPerms = data.find((p) => p.jabatan === userData.jabatan);
        setAllowedTypes(userPerms ? userPerms.allowedDocumentTypes : []);
      } catch (error) {
        console.error("Gagal memuat hak akses di layout", error);
        setAllowedTypes([]);
      }
    };
    fetchPermissions();
  }, [userData]); // Jalankan ulang jika userData berubah

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 5000,
          style: { background: "#333", color: "#fff" },
        }}
      />
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userData={userData}
      />
      <div className="lg:ml-64 flex flex-col flex-grow">
        <Header
          setSidebarOpen={setSidebarOpen}
          onLogout={onLogout}
          userData={userData}
        />
        <main className="p-6 flex-grow">
          {/* Teruskan userData dan allowedTypes ke semua halaman anak */}
          <Outlet context={{ userData, allowedTypes }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
