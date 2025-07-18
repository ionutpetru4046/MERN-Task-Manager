const express = require("express");
const notesRoutes = require("./routes/notesRoutes.js");
const connectDB = require("./config/db.js");
const dotenv = require("dotenv");
const rateLimiter = require("./middleware/rateLimiter.js");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json()); // Parse JSON bodies
app.use(rateLimiter); // Apply rate limiter globally

// Custom logging middleware
app.use((req, res, next) => {
  console.log(`Req method: ${req.method} | Req URL: ${req.url}`);
  next();
});

// Routes
app.use("/api/notes", notesRoutes);

// Global error handler (single instance only)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});
