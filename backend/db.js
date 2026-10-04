/**
 * ============================================================================
 * AnumatiSetu — MongoDB & Mongoose Database Connection
 * Supports both standalone Express server and Vercel serverless execution
 * ============================================================================
 */

const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

let cachedConnection = null;

async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables.");
  }

  try {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    };

    const conn = await mongoose.connect(uri, opts);
    cachedConnection = conn;
    console.log(`[DB] Connected to MongoDB Atlas (${mongoose.connection.name})`);
    return cachedConnection;
  } catch (err) {
    console.error("[DB Connection Error]", err.message);
    throw err;
  }
}

module.exports = { connectDB, mongoose };
