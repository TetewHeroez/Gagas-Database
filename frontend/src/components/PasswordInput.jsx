import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({
  value,
  onChange,
  placeholder,
  id,
  required = false,
}) => {
  // State untuk melacak apakah password sedang ditampilkan atau tidak
  const [showPassword, setShowPassword] = useState(false);

  // Fungsi untuk mengganti state
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    // Gunakan 'relative' agar kita bisa menempatkan tombol ikon di dalamnya
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"} // Tipe input berubah secara dinamis
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        // Beri padding di kanan agar teks tidak tertutup ikon
        className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white p-2 pr-10 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
      />
      <button
        type="button" // PENTING: agar tidak men-submit form
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        aria-label={
          showPassword ? "Sembunyikan password" : "Tampilkan password"
        }
      >
        {/* Ikon berubah secara dinamis */}
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

export default PasswordInput;
