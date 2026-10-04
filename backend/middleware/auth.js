/**
 * ============================================================================
 * AnumatiSetu — Auth Middleware (MongoDB / Mongoose)
 * ============================================================================
 */

const User = require("../models/User");
const { connectDB } = require("../db");

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required. Please sign in." });
  }

  const token = authHeader.split(" ")[1];
  try {
    await connectDB();
    const user = await User.findOne({ "sessions.token": token });

    if (!user) {
      return res.status(401).json({ error: "Session expired or invalid. Please sign in again." });
    }

    req.user = {
      id: user.id,
      email: user.email,
      businessName: user.businessName,
      role: user.role,
      token,
    };

    next();
  } catch (err) {
    console.error("[Auth Middleware Error]", err);
    res.status(500).json({ error: "Authentication check failed" });
  }
}

module.exports = { requireAuth };
