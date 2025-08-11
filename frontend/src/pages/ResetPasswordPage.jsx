import React, { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validatePassword = (pwd) => {
    return pwd.length >= 6;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!validatePassword(password)) {
      setError("Password minimal 6 karakter");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(`/api/auth/reset-password/${token}`, {
        password,
        confirmPassword
      });
      
      setMessage(response.data.message);
      setIsSuccess(true);
      
      // Redirect ke login setelah 3 detik
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (err) {
      console.error("Reset password error:", err);
      const errorMessage = err.response?.data?.message || "Gagal reset password.";
      setError(errorMessage);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-2xl max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <Lock className="h-10 w-10 text-indigo-600 dark:text-indigo-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            Reset Password
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm text-center mt-2">
            Masukkan password baru Anda
          </p>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleResetPassword} className="flex flex-col space-y-4">
            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password baru (minimal 6 karakter)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-12 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Konfirmasi password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-12 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Password Validation */}
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <div className={`flex items-center ${password.length >= 6 ? 'text-green-600' : ''}`}>
                <CheckCircle className={`h-3 w-3 mr-1 ${password.length >= 6 ? 'text-green-600' : 'text-gray-400'}`} />
                Minimal 6 karakter
              </div>
              <div className={`flex items-center ${password === confirmPassword && password ? 'text-green-600' : ''}`}>
                <CheckCircle className={`h-3 w-3 mr-1 ${password === confirmPassword && password ? 'text-green-600' : 'text-gray-400'}`} />
                Password cocok
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password || !confirmPassword}
              className="w-full bg-indigo-600 dark:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-indigo-500 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Reset Password"}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-6 mb-6">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
              <p className="text-green-700 dark:text-green-300 font-medium mb-2">
                Password Berhasil Direset!
              </p>
              <p className="text-green-600 dark:text-green-400 text-sm">
                {message}
              </p>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Anda akan diarahkan ke halaman login dalam beberapa detik...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
