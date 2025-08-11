import React from "react";
import { Menu, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Header = ({ setSidebarOpen, onLogout, userData }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
      {/* Tombol Menu untuk Mobile */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden text-gray-600 dark:text-gray-300"
      >
        <Menu size={24} />
      </button>

      {/* Judul Halaman (bisa dibuat dinamis nanti) */}
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white hidden lg:block">
        Selamat Datang, {userData.username}
      </h2>

      {/* Aksi di Kanan */}
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <button
          onClick={onLogout}
          className="flex items-center text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
        >
          <LogOut size={18} className="mr-1" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
