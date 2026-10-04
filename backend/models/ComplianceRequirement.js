const mongoose = require("mongoose");

const complianceRequirementSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  applicationId: { type: String, default: null },
  requirementCode: { type: String, required: true },
  title: { type: String, required: true },
  department: { type: String, default: "" },
  licenseNumber: { type: String, default: "" },
  issueDate: { type: String, default: null },
  expiryDate: { type: String, default: null },
  validityYears: { type: Number, default: 1 },
  frequency: {
    type: String,
    enum: ["ONE_TIME", "MONTHLY", "QUARTERLY", "HALF_YEARLY", "ANNUAL", "TRIENNIAL", "QUINQUENNIAL"],
    default: "ANNUAL"
  },
  dueDate: { type: String, default: null },
  status: {
    type: String,
    enum: ["ACTIVE", "PENDING", "SUBMITTED", "VERIFIED", "OVERDUE", "EXPIRING_SOON"],
    default: "ACTIVE"
  },
  penaltyRisk: { type: String, default: "Standard statutory interest & fine" },
  ruleReference: { type: String, default: "" },
  lastFiledDate: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.models.ComplianceRequirement || mongoose.model("ComplianceRequirement", complianceRequirementSchema);
