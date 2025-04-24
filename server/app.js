const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes.js");
const clientRoutes = require("./routes/client.routes.js");
const serviceRoutes = require("./routes/service.routes.js");
const faqRoutes = require("./routes/faq.routes.js");
const languageRoutes = require("./routes/language.routes.js");
const contactRoutes = require("./routes/contact.routes.js");
const statsRoutes = require("./routes/stats.routes.js");
const profileRoutes = require("./routes/profile.routes.js");
const featureRoutes = require("./routes/feature.routes.js");
const messageRoutes = require("./routes/message.routes.js");
const { errorHandler } = require("./middleware/error.middleware.js");
const eventRoutes = require("./routes/events.routes.js");
const appointmentRoutes = require("./routes/appointments.routes.js");
const reminderRoutes = require("./routes/reminders.routes.js");
const path = require("path");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/languages", languageRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/features", featureRoutes);
app.use("/api/messages", messageRoutes);

app.use("/api/events", eventRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reminders", reminderRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
