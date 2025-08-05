import React from "react";
import { Outlet } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

// Komponen ini berfungsi sebagai wrapper untuk semua halaman publik
const PublicLayout = () => {
  return (
    // Ini adalah div yang sebelumnya ada di App.jsx
    <div className="relative min-h-screen w-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 font-sans transition-colors duration-300">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* <Outlet> adalah placeholder di mana React Router akan merender
          halaman yang cocok, dalam kasus ini adalah LoginPage */}
      <Outlet />
    </div>
  );
};

export default PublicLayout;
