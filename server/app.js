
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/auth.routes.js");
const clientRoutes = require("./routes/client.routes.js");
const serviceRoutes = require("./routes/service.routes.js");
const translationRoutes = require("./routes/translation.routes.js");
const taskRoutes = require("./routes/task.routes.js");
const calendarRoutes = require("./routes/calendar.routes.js");
const templateRoutes = require("./routes/template.routes.js");
const documentRoutes = require("./routes/document.routes.js");
const communicationRoutes = require("./routes/communication.routes.js");
const contentRoutes = require("./routes/content.routes.js");
const reportRoutes = require("./routes/report.routes.js");

// Create Express app
const app = express();

// Enhanced security and CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:8080",
  credentials: true,
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/translation", translationRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/communication", communicationRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/reports", reportRoutes);

// API status endpoint
app.get("/api/status", (req, res) => {
  res.json({ status: "API is running", timestamp: new Date() });
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";
  
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

module.exports = app;
