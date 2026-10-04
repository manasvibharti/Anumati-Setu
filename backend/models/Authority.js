const mongoose = require("mongoose");

const authoritySchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  state: { type: String, default: "Maharashtra" },
  portalUrl: { type: String, default: "" },
  contactEmail: { type: String, default: "" },
  contactPhone: { type: String, default: "" },
  description: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.models.Authority || mongoose.model("Authority", authoritySchema);
