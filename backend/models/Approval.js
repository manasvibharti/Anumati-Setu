const mongoose = require("mongoose");

const approvalSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  requirementCode: { type: String, required: true, index: true },
  title: { type: String, required: true },
  department: { type: String, default: "Statutory Authority" },
  category: { type: String, default: "General Business" },
  status: {
    type: String,
    enum: ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "CLARIFICATION REQUIRED", "INSPECTION REQUIRED", "APPROVED", "REJECTED"],
    default: "DRAFT"
  },
  submittedDate: { type: String, default: null },
  createdDate: { type: String, default: null },
  inspectionRequired: { type: Boolean, default: false },
  inspectionDate: { type: String, default: null },
  clarificationMessage: { type: String, default: null },
  notes: { type: String, default: "" },
  documentsAttached: { type: [String], default: [] },
  authorityId: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.models.Approval || mongoose.model("Approval", approvalSchema);
