import React from "react";
import { NavLink } from "react-router-dom";
// 1. Impor ikon baru untuk Hak Akses
import {
  LayoutDashboard,
  User,
  FileText,
  Users,
  X,
  ShieldCheck,
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, setSidebarOpen, userData }) => {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Profil Akun", icon: User, path: "/profile" },
    { name: "Dokumen Saya", icon: FileText, path: "/documents" },
  ];

  // Cek jika userData ada sebelum mengakses propertinya
  if (userData && userData.tipeAkses === "admin") {
    menuItems.push({ name: "Pengelolaan Akun", icon: Users, path: "/users" });
    // 2. Tambahkan menu "Hak Akses" hanya untuk admin
    menuItems.push({
      name: "Hak Akses",
      icon: ShieldCheck,
      path: "/permissions",
    });
  }

  const linkClass = ({ isActive }) =>
    `flex items-center p-3 my-1 rounded-lg transition-colors ${
      isActive
        ? "bg-indigo-600 text-white"
        : "hover:bg-gray-100 dark:hover:bg-gray-700"
    }`;

  return (
    <>
      <div
        className={`fixed inset-0 bg-gray-900/50 z-30 lg:hidden transition-opacity ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      <aside
        className={`fixed top-0 left-0 h-full w-64 flex flex-col z-40 transform transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold">Manajemen App</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 dark:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex-grow p-2">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  className={linkClass}
                  onClick={() =>
                    window.innerWidth < 1024 && setSidebarOpen(false)
                  }
                >
                  <item.icon className="mr-3" size={20} />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <footer className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          © 2025 Perusahaan Anda
        </footer>
      </aside>
    </>
  );
};

export default Sidebar;
