import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Konfigurasi penyimpanan ke Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "manajemen_dokumen", // Nama folder di Cloudinary
    allowed_formats: ["pdf", "doc", "docx", "jpg", "jpeg", "png"],
    resource_type: "auto",
  },
});

const upload = multer({ storage: storage });

export default upload;
