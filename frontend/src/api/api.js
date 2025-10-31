import axios from "axios";

// Use a sensible default for local development so the front-end points to the
// local backend if VITE_API_BASE_URL isn't set. In production, set
// VITE_API_BASE_URL explicitly in the environment.
const defaultDevBase = "http://localhost:5001";
const baseURL =
  import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? defaultDevBase : "");

// Membuat instance Axios dengan konfigurasi default
const api = axios.create({
  baseURL,
  withCredentials: true, // keep cookies if backend uses them
  timeout: 30000, // 30s timeout to tolerate slow starts locally
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menambahkan token otorisasi ke setiap permintaan
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani error umum seperti timeout dan 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      alert("Server tidak merespon. Silakan coba lagi nanti.");
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
