const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  category: { type: String, default: "General" },
  fileName: { type: String, required: true },
  filePath: { type: String, default: null },
  fileSize: { type: String, default: "—" },
  uploadedDate: { type: String, default: null },
  expiryDate: { type: String, default: null },
  status: {
    type: String,
    enum: ["UPLOADED", "VERIFIED", "REJECTED", "EXPIRED"],
    default: "UPLOADED"
  },
  applicationId: { type: String, default: null },
  hasFile: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.Document || mongoose.model("Document", documentSchema);
