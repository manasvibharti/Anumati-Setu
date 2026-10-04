/**
 * ============================================================================
 * AnumatiSetu — Renewals & Compliance Routes (Mongoose / User Scoped)
 * ============================================================================
 */

const express = require("express");
const router = express.Router();
const ComplianceRequirement = require("../models/ComplianceRequirement");
const { addNotification, logActivity } = require("../helpers");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

function parseRenewal(doc) {
  if (!doc) return null;
  return {
    id:              doc.id,
    applicationId:   doc.applicationId,
    requirementCode: doc.requirementCode,
    title:           doc.title,
    department:      doc.department,
    licenseNumber:   doc.licenseNumber,
    issueDate:       doc.issueDate,
    expiryDate:      doc.expiryDate,
    validityYears:   doc.validityYears,
    status:          doc.status,
    frequency:       doc.frequency,
    dueDate:         doc.dueDate,
    penaltyRisk:     doc.penaltyRisk
  };
}

// GET /api/renewals
router.get("/", async (req, res) => {
  try {
    const list = await ComplianceRequirement.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    res.json(list.map(parseRenewal));
  } catch (err) {
    console.error("[Renewals GET]", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/renewals/:id/renew
router.post("/:id/renew", async (req, res) => {
  try {
    const item = await ComplianceRequirement.findOne({ userId: req.user.id, id: req.params.id });
    if (!item) return res.status(404).json({ error: "License record not found" });

    const currentExpiry = new Date(item.expiryDate || new Date());
    currentExpiry.setFullYear(currentExpiry.getFullYear() + (item.validityYears || 1));
    const newExpiry = currentExpiry.toISOString().split("T")[0];

    item.expiryDate = newExpiry;
    item.status = "ACTIVE";
    item.lastFiledDate = new Date().toISOString().split("T")[0];
    await item.save();

    await logActivity(req.user.id, `License renewed: ${item.title} until ${newExpiry}`, "Renewals");
    await addNotification(req.user.id, `License renewed for ${item.title}`, "success");

    res.json(parseRenewal(item));
  } catch (err) {
    console.error("[Renewals PATCH]", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
