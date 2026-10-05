const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: "" },
  passwordHash: { type: String, required: true },
  businessName: { type: String, default: "" },
  role: { type: String, enum: ["user", "admin", "officer"], default: "user" },
  department: { type: String, default: "ALL" },
  otp: {
    code: { type: String, default: null },
    expiresAt: { type: Date, default: null }
  },
  sessions: [
    {
      token: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
