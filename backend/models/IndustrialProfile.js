const mongoose = require("mongoose");

const industrialProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  businessName: { type: String, required: true, trim: true },
  industryType: { type: String, default: "Manufacturing" },
  businessStage: { type: String, default: "New Setup" },
  location: { type: String, required: true, trim: true },
  district: { type: String, default: "" },
  state: { type: String, default: "Maharashtra" },
  investmentScale: { type: String, default: "" },
  employeesCount: { type: Number, default: 0 },
  businessCategory: { type: String, default: "Small Enterprise" },
  pollutionCategory: { type: String, enum: ["White", "Green", "Orange", "Red", ""], default: "Orange" },
  powerLoadKW: { type: Number, default: 0 },
  landAreaSqM: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.models.IndustrialProfile || mongoose.model("IndustrialProfile", industrialProfileSchema);
