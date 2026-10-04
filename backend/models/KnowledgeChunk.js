const mongoose = require("mongoose");

const KnowledgeChunkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  category: { type: String, default: "General Statutory" },
  keywords: [{ type: String }],
  content: { type: String, required: true },
  embedding: { type: [Number], default: [] },
  sourceUrl: { type: String, default: "" },
  actName: { type: String, default: "" },
  validityYears: { type: Number, default: 1 },
  turnaroundDays: { type: Number, default: 30 }
}, { timestamps: true });

KnowledgeChunkSchema.index({ title: "text", content: "text", keywords: "text" });

module.exports = mongoose.models.KnowledgeChunk || mongoose.model("KnowledgeChunk", KnowledgeChunkSchema);
