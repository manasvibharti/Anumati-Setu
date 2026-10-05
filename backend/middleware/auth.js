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
      department: user.department || "ALL",
      token,
    };

    next();
  } catch (err) {
    console.error("[Auth Middleware Error]", err);
    res.status(500).json({ error: "Authentication check failed" });
  }
}

function requireRole(allowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Access Denied: Requires ${roles.join(" or ")} privileges.` });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
