/**
 * ============================================================================
 * AnumatiSetu — Backend Helper Utilities (Mongoose & User Scoped)
 * ============================================================================
 */

const crypto = require("crypto");
const Notification = require("./models/Notification");
const AuditLog = require("./models/AuditLog");

async function addNotification(userId, message, type = "info") {
  if (!userId) return;
  try {
    const id = "NOTIF-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
    const now = new Date();
    const timeLabel = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
      ", " + now.toLocaleDateString([], { month: "short", day: "numeric" });

    await Notification.create({
      id,
      userId,
      message,
      type,
      timeLabel,
      isRead: false
    });

    // Keep latest 25 notifications per user
    const userNotifs = await Notification.find({ userId }).sort({ createdAt: -1 }).select("_id").lean();
    if (userNotifs.length > 25) {
      const idsToDelete = userNotifs.slice(25).map(n => n._id);
      await Notification.deleteMany({ _id: { $in: idsToDelete } });
    }
  } catch (err) {
    console.error("[addNotification Error]", err.message);
  }
}

async function logActivity(userId, text, module = "System", metadata = {}) {
  if (!userId) return;
  try {
    const id = "ACT-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
    const now = new Date();
    const timestampLabel = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
      ", " + now.toLocaleDateString([], { month: "short", day: "numeric" });

    await AuditLog.create({
      id,
      userId,
      text,
      module,
      timestampLabel,
      metadata
    });

    // Keep latest 30 audit logs per user
    const userLogs = await AuditLog.find({ userId }).sort({ createdAt: -1 }).select("_id").lean();
    if (userLogs.length > 30) {
      const idsToDelete = userLogs.slice(30).map(l => l._id);
      await AuditLog.deleteMany({ _id: { $in: idsToDelete } });
    }
  } catch (err) {
    console.error("[logActivity Error]", err.message);
  }
}

function generateId(prefix) {
  return prefix + "-" + Math.floor(100000 + Math.random() * 900000);
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashPassword(password) {
  return crypto.createHash("sha256").update(password + "anumatisetu_salt").digest("hex");
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

module.exports = { addNotification, logActivity, generateId, generateToken, hashPassword, todayStr };
