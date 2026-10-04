const mongoose = require("mongoose");

const stateAuthorityMappingSchema = new mongoose.Schema({
  state: { type: String, required: true, index: true },
  requirementCode: { type: String, required: true, index: true },
  title: { type: String, required: true },
  authorityCode: { type: String, default: "" },
  deptKey: { type: String, default: "" },
  defaultDept: { type: String, default: "" },
  category: { type: String, default: "General Business" },
  description: { type: String, default: "" },
  mandatoryDocuments: { type: [String], default: [] },
  inspectionRequired: { type: Boolean, default: false },
  validityYears: { type: Number, default: 1 },
  feeEstimate: { type: String, default: "" },
  industryTypes: { type: [String], default: [] },
  minEmployees: { type: Number, default: 0 },
  pollutionCategories: { type: [String], default: [] },
  businessStages: { type: [String], default: [] },
  businessCategories: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.models.StateAuthorityMapping || mongoose.model("StateAuthorityMapping", stateAuthorityMappingSchema);
