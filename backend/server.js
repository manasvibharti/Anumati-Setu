/**
 * ============================================================================
 * AnumatiSetu — Express Backend Server (MongoDB & Mongoose)
 * ============================================================================
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { connectDB } = require("./db");

const app = express();
const PORT = parseInt(process.env.PORT || "4000");

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use("/uploads", express.static(UPLOAD_DIR));

// Serve frontend static assets with no-cache headers for instant updates
const FRONTEND_DIR = path.join(__dirname, "..", "frontend");
app.use(express.static(FRONTEND_DIR, {
  etag: false,
  lastModified: false,
  setHeaders: (res) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
  }
}));

// ---------------------------------------------------------------------------
// API Routes
// ---------------------------------------------------------------------------
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/documents", require("./routes/documents"));
app.use("/api/renewals", require("./routes/renewals"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/schemes", require("./routes/schemes"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/admin", require("./routes/admin"));

// Health check
app.get("/api/health", (_req, res) => res.json({ status: "ok", database: "mongodb", timestamp: new Date().toISOString() }));

// 404 handler for API
app.use("/api/*", (_req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// Fallback to index.html for root path
app.get("/", (_req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error("[Server Error]", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// Startup
(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`\n✅ AnumatiSetu Backend running at http://localhost:${PORT}`);
      console.log(`   Health check: http://localhost:${PORT}/api/health`);
      console.log(`   Uploads served: http://localhost:${PORT}/uploads/\n`);
    });
  } catch (err) {
    console.error("\n❌ Failed to connect to MongoDB Atlas:", err.message);
    process.exit(1);
  }
})();
