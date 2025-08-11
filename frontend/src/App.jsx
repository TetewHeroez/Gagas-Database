import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import api from "./api/api";
import { Loader2 } from "lucide-react";

// Layouts and Pages
import DashboardLayout from "./layouts/DashboardLayout";
import PublicLayout from "./layouts/PublicLayout";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFoundPage from "./pages/NotFoundPage";
import DashboardContent from "./pages/DashboardContent";
import ProfilePage from "./pages/ProfilePage";
import UserManagementPage from "./pages/UserManagementPage";
import DocumentsPage from "./pages/DocumentsPage";
import DocumentListPage from "./pages/DocumentListPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import PermissionManagementPage from "./pages/PermissionManagementPage";
import DocumentDetailPage from "./pages/DocumentDetailPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedInStatus = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const { data } = await api.get("/api/users/profile");
          setUser(data);
        } catch (error) {
          console.error("Sesi tidak valid:", error);
          localStorage.removeItem("authToken");
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkLoggedInStatus();
  }, []);

  const handleLogin = (dataFromBackend) => {
    setUser(dataFromBackend.user);

    // Simpan token dengan error handling
    try {
      localStorage.setItem("authToken", dataFromBackend.token);
    } catch (error) {
      console.error("Error saving token to localStorage:", error);
    }

    navigate("/");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route 
          path="/login" 
          element={
            showForgotPassword ? (
              <ForgotPasswordPage onBackToLogin={handleBackToLogin} />
            ) : (
              <LoginPage onLogin={handleLogin} onForgotPassword={handleForgotPassword} />
            )
          } 
        />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      <Route
        path="/*"
        element={
          <ProtectedRoute user={user}>
            <DashboardLayout userData={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardContent />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="documents/type/:type" element={<DocumentListPage />} />
        <Route path="documents/view/:id" element={<DocumentDetailPage />} />
        <Route path="search" element={<SearchResultsPage />} />

        {/* Kelompokkan rute khusus admin */}
        {user?.tipeAkses === "admin" && (
          <>
            <Route path="users" element={<UserManagementPage />} />
            <Route path="permissions" element={<PermissionManagementPage />} />
          </>
        )}
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
