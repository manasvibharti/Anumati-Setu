/**
 * ============================================================================
 * AnumatiSetu — Vercel Serverless Function API Entrypoint
 * ============================================================================
 */

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
const UPLOAD_DIR = path.join(__dirname, "..", "backend", "uploads");
app.use("/uploads", express.static(UPLOAD_DIR));

// API Routes
app.use("/api/auth", require("../backend/routes/auth"));
app.use("/api/profile", require("../backend/routes/profile"));
app.use("/api/applications", require("../backend/routes/applications"));
app.use("/api/documents", require("../backend/routes/documents"));
app.use("/api/renewals", require("../backend/routes/renewals"));
app.use("/api/dashboard", require("../backend/routes/dashboard"));
app.use("/api/chat", require("../backend/routes/chat"));

// Health check
app.get("/api/health", (_req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

// 404 handler for API
app.use("/api/*", (_req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// Global Error handler
app.use((err, _req, res, _next) => {
  console.error("[Vercel API Uncaught Error]", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error"
  });
});

module.exports = app;
