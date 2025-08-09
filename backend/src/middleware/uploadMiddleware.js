import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

// Lazy initialization untuk upload middleware
let uploadInstance = null;

const getUpload = () => {
  if (uploadInstance) {
    return uploadInstance;
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("Cloudinary credentials tidak lengkap. Periksa file .env");
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "manajemen_dokumen",
      allowed_formats: ["pdf", "doc", "docx", "jpg", "jpeg", "png"],
      resource_type: "auto",
    },
  });

  uploadInstance = multer({
    storage: storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];

      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new Error(
            "Jenis file tidak diizinkan. Hanya PDF, Word, atau Gambar."
          ),
          false
        );
      }
    },
  });

  return uploadInstance;
};

export default getUpload;
