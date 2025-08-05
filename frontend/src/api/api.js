import axios from "axios";

// Membuat instance Axios dengan konfigurasi default
const api = axios.create({
  // Mengambil URL dasar dari environment variable yang kita buat
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Interceptor untuk menambahkan token otorisasi ke setiap permintaan
// Ini jauh lebih bersih daripada menambahkannya di setiap panggilan API
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

export default api;
