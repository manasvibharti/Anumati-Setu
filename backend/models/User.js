const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  businessName: { type: String, default: "" },
  role: { type: String, enum: ["user", "admin", "officer"], default: "user" },
  sessions: [
    {
      token: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
