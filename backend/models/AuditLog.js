const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  text: { type: String, required: true },
  module: { type: String, default: "System" },
  timestampLabel: { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

module.exports = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
