const express = require("express");
const notesRoutes = require("./routes/notesRoutes.js");
const connectDB = require("./config/db.js");
const dotenv = require("dotenv");
const rateLimiter = require("./middleware/rateLimiter.js");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

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

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );
}

app.use(express.json()); // Parse JSON bodies
app.use(rateLimiter); // Apply rate limiter globally

// Custom logging middleware
app.use((req, res, next) => {
  console.log(`Req method: ${req.method} | Req URL: ${req.url}`);
  next();
});

// Routes
app.use("/api/notes", notesRoutes);

// Handle favicon request to avoid 500 errors
app.get('/favicon.ico', (req, res) => res.status(204));

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    const indexPath = path.join(frontendPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      console.error("index.html not found at:", indexPath);
      res.status(404).send("Frontend build not found");
    }
  });
}

// Global error handler (single instance only)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});
