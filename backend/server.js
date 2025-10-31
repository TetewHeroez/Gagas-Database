import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Configure dotenv FIRST before importing other modules
dotenv.config();

import connectDB from "./src/config/db.js";
import seedData from "./src/utils/seeder.js";

// Rute-rute
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import documentRoutes from "./src/routes/documentRoutes.js";
import permissionRoutes from "./src/routes/permissionRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js"; // <-- Impor rute baru

const app = express();
const PORT = process.env.PORT || 5001;
// FRONTEND_URL is usually set in production. For local development we also
// want to allow the Vite dev server at http://localhost:5173.
const URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Build allowed origins array. In development include the local Vite origin so
// preflight requests from the frontend are accepted.
const allowedOrigins = Array.isArray(URL) ? URL.slice() : [URL];
if (process.env.NODE_ENV !== "production") {
  const devOrigin = "http://localhost:5173";
  if (!allowedOrigins.includes(devOrigin)) allowedOrigins.push(devOrigin);
}

console.log("Allowed CORS origins:", allowedOrigins);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// Add request logging middleware for important requests
app.use((req, res, next) => {
  // Log hanya untuk request penting
  if (
    req.url.includes("/download") ||
    req.url.includes("/login") ||
    req.url.includes("/register") ||
    req.url.includes("/permissions")
  ) {
    // Debug logs removed for production
  }
  next();
});

// Daftarkan semua rute
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/dashboard", dashboardRoutes); // <-- Gunakan rute baru

app.get("/", (req, res) => res.send("API Manajemen Dokumen berjalan..."));

const startServer = async () => {
  await connectDB();
  await seedData();
  app.listen(PORT, () =>
    console.log(`🚀 Server berjalan dengan benar di ${URL}`)
  );
};

startServer();
