const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorHandler");

// Connect to database
connectDB();

const app = express();

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/budget", require("./routes/budgetRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "API is healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    name: "KantongVura API",
    version: "1.0.0",
    status: "running",
    environment: process.env.NODE_ENV,
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;
