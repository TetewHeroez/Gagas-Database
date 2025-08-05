import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Terhubung: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error Koneksi MongoDB: ${error.message}`);
    process.exit(1); // Keluar dari proses jika koneksi gagal
  }
};

export default connectDB;
