import React, { useState } from "react";
import { FileText } from "lucide-react";
import PasswordInput from "../components/PasswordInput";
import api from "../api/api"; // <-- 1. Impor instance api

function LoginPage({ onLogin, onForgotPassword }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // 2. Gunakan 'api' dan path relatif
      const response = await api.post(
        "/api/auth/login",
        { email, password },
        {
          // Suppress Axios warning/error untuk request ini
          validateStatus: (status) => status < 500, // Treat 4xx as valid response, not error
        }
      );

      // Cek manual apakah login berhasil (status 200-299)
      if (response.status >= 200 && response.status < 300) {
        onLogin(response.data);
      } else {
        // Status 4xx (seperti 401) - ambil pesan error dari response
        const errorMessage = response.data?.message || "Login gagal.";
        setError(errorMessage);
      }
    } catch (err) {
      // Hanya tangkap error 5xx atau network error
      const errorMessage =
        err.response?.data?.message || "Terjadi kesalahan pada server.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... (kode JSX tidak berubah) ...
    <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-2xl max-w-md w-full">
      <div className="flex flex-col items-center mb-6">
        <FileText className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
          Sistem Manajemen Dokumen
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Silakan login untuk melanjutkan
        </p>
      </div>
      <form onSubmit={handleLogin} className="flex flex-col space-y-4">
        <input
          type="email"
          placeholder="Email (cth: admin@example.com)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <PasswordInput
          id="login-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (cth: admin123)"
          required
        />
        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm text-center">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 dark:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Memproses..." : "Login"}
        </button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm underline transition-colors duration-200"
          >
            Lupa Password?
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
