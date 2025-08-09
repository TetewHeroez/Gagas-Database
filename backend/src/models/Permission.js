import mongoose from "mongoose";
import { documentTypesEnum } from "../constants/documentConstants.js";

const permissionSchema = new mongoose.Schema(
  {
    // --- PERBAIKAN DI SINI ---
    // Pastikan field ini bernama 'divisi' bukan 'jabatan'
    divisi: {
      type: String,
      required: true,
      unique: true,
    },
    // --- ---
    allowedDocumentTypes: [
      {
        type: String,
        enum: documentTypesEnum,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Permission = mongoose.model("Permission", permissionSchema);

export default Permission;
