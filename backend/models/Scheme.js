const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  category: {
    type: String,
    enum: ["Capital Subsidy", "Interest Subvention", "Green Tech Incentive", "Export Promotion", "Employment & Skilling", "Power Tariff Subsidy"],
    default: "Capital Subsidy"
  },
  state: { type: String, default: "All", index: true }, // "Maharashtra", "Karnataka", "All", etc.
  eligibleSectors: { type: [String], default: ["All"] },
  maxSubsidy: { type: String, default: "Up to 30%" },
  description: { type: String, default: "" },
  eligibilitySummary: { type: String, default: "" },
  applicationUrl: { type: String, default: "" },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.models.Scheme || mongoose.model("Scheme", schemeSchema);
