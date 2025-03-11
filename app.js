// app.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const schoolRoutes = require("./routes/schoolRoutes");

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to School Management API",
    endpoints: {
      addSchool: "POST /addSchool",
      listSchools: "GET /listSchools?latitude=VALUE&longitude=VALUE",
    },
  });
});

// Routes
app.use(schoolRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

module.exports = app;
