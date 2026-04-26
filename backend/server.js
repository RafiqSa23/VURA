const app = require("./src/app");
const connectDB = require("./src/config/database");
require("dotenv").config();

const PORT = process.env.PORT || 3000; // Ubah ke 3000 sesuai PRD

// Koneksi ke database
connectDB();

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);
});

// Handle unhandled promise rejections (untuk production)
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM (untuk graceful shutdown)
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Closing server gracefully...");
  server.close(() => {
    console.log("Process terminated!");
  });
});
