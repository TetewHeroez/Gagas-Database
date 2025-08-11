import React, { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import api from "../api/api";

function ForgotPasswordPage({ onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/api/auth/forgot-password", { email });
      setMessage(response.data.message);
      setIsSuccess(true);
    } catch (err) {
      console.error("Forgot password error:", err);
      const errorMessage =
        err.response?.data?.message || "Gagal mengirim email reset password.";
      setError(errorMessage);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-2xl max-w-md w-full">
      <div className="flex items-center mb-6">
        <button
          onClick={onBackToLogin}
          className="mr-3 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Lupa Password
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Masukkan email Anda untuk reset password
          </p>
        </div>
      </div>

      {!isSuccess ? (
        <form
          onSubmit={handleForgotPassword}
          className="flex flex-col space-y-4"
        >
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              placeholder="Masukkan email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 dark:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-indigo-500 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Mengirim..." : "Kirim Link Reset"}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4 mb-6">
            <div className="flex items-center justify-center mb-3">
              <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-green-700 dark:text-green-300 font-medium mb-2">
              Email Terkirim!
            </p>
            <p className="text-green-600 dark:text-green-400 text-sm">
              {message}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Periksa inbox email Anda dan ikuti instruksi untuk reset password.
            </p>
            <button
              onClick={onBackToLogin}
              className="w-full bg-gray-600 dark:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Kembali ke Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPasswordPage;
