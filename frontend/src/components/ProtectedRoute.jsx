import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Komponen ini akan menjadi penjaga untuk rute-rute privat
const ProtectedRoute = ({ user, children }) => {
  // Jika tidak ada data 'user' (artinya belum login)
  if (!user) {
    // Arahkan pengguna kembali ke halaman login
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login, tampilkan konten yang seharusnya (halaman dasbor, dll)
  // 'children' akan menjadi komponen <DashboardLayout> dari App.jsx
  // atau <Outlet /> untuk nested routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
