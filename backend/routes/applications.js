/**
 * ============================================================================
 * AnumatiSetu — Applications / Clearances Routes (Mongoose / User Scoped)
 * ============================================================================
 */

const express = require("express");
const router = express.Router();
const Approval = require("../models/Approval");
const ComplianceRequirement = require("../models/ComplianceRequirement");
const IndustrialProfile = require("../models/IndustrialProfile");
const { STATUTORY_CATALOG, STATE_DEPARTMENT_REGISTRY } = require("../catalog");
const { addNotification, logActivity, generateId, todayStr } = require("../helpers");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

function parseApp(doc) {
  if (!doc) return null;
  return {
    id:                   doc.id,
    requirementCode:      doc.requirementCode,
    title:                doc.title,
    department:           doc.department,
    category:             doc.category,
    status:               doc.status,
    submittedDate:        doc.submittedDate,
    createdDate:          doc.createdDate,
    inspectionRequired:   !!doc.inspectionRequired,
    inspectionDate:       doc.inspectionDate,
    clarificationMessage: doc.clarificationMessage,
    notes:                doc.notes,
    documentsAttached:    doc.documentsAttached || [],
    createdAt:            doc.createdAt,
  };
}

// GET /api/applications
router.get("/", async (req, res) => {
  try {
    const statusFilter = req.query.status;
    const query = { userId: req.user.id };

    if (statusFilter && statusFilter !== "ALL") {
      query.status = new RegExp(`^${statusFilter}$`, "i");
    }

    const apps = await Approval.find(query).sort({ createdAt: -1 }).lean();
    res.json(apps.map(parseApp));
  } catch (err) {
    console.error("[Applications GET]", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/applications/:id
router.get("/:id", async (req, res) => {
  try {
    const app = await Approval.findOne({ userId: req.user.id, id: req.params.id }).lean();
    if (!app) return res.status(404).json({ error: "Application not found" });
    res.json(parseApp(app));
  } catch (err) {
    console.error("[Application GET/:id]", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/applications
router.post("/", async (req, res) => {
  const { requirementCode, notes } = req.body;
  if (!requirementCode) return res.status(400).json({ error: "requirementCode is required" });

  const catalogItem = STATUTORY_CATALOG.find(r => r.code === requirementCode);
  if (!catalogItem) return res.status(400).json({ error: "Invalid requirementCode" });

  try {
    const existing = await Approval.findOne({ userId: req.user.id, requirementCode });
    if (existing) {
      return res.status(409).json({ error: "Application already exists for this requirement", existingId: existing.id });
    }

    // Resolve state-specific department name
    const profile = await IndustrialProfile.findOne({ userId: req.user.id }).lean();
    const userState = profile?.state || "Maharashtra";
    const stateMap = (STATE_DEPARTMENT_REGISTRY && STATE_DEPARTMENT_REGISTRY[userState])
      ? STATE_DEPARTMENT_REGISTRY[userState]
      : (STATE_DEPARTMENT_REGISTRY?.["Other"] || {});

    const resolvedDept = catalogItem.deptKey
      ? (stateMap[catalogItem.deptKey] || catalogItem.defaultDept || catalogItem.department || "Statutory Authority")
      : (catalogItem.department || catalogItem.defaultDept || "Statutory Authority");

    const newId = generateId("APP");
    const today = todayStr();

    const newApp = await Approval.create({
      id: newId,
      userId: req.user.id,
      requirementCode: catalogItem.code,
      title: catalogItem.title,
      department: resolvedDept,
      category: catalogItem.category || "General Business",
      status: "DRAFT",
      createdDate: today,
      inspectionRequired: !!catalogItem.inspectionRequired,
      notes: notes || "",
      documentsAttached: []
    });

    await logActivity(req.user.id, `Draft application created: ${catalogItem.title} (${newId})`, "Application");
    await addNotification(req.user.id, `Draft created for ${catalogItem.title}`, "info");

    res.status(201).json(parseApp(newApp));
  } catch (err) {
    console.error("[Application POST]", err);
    res.status(500).json({ error: err.message });
  }
});

const { evaluateReadinessGate } = require("../services/readinessGate");

// GET /api/applications/:id/readiness-gate (Check if ready to submit)
router.get("/:id/readiness-gate", async (req, res) => {
  try {
    const app = await Approval.findOne({ userId: req.user.id, id: req.params.id });
    if (!app) return res.status(404).json({ error: "Application not found" });

    const gateResult = await evaluateReadinessGate(req.user.id, app);
    res.json(gateResult);
  } catch (err) {
    console.error("[Readiness Gate GET]", err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/applications/:id/status (With Server-Side Readiness Enforcement on Submit)
router.patch("/:id/status", async (req, res) => {
  const { status, clarificationMessage, inspectionDate, notes, forceSubmit } = req.body;
  const appId = req.params.id;

  if (!status) return res.status(400).json({ error: "status is required" });

  try {
    const app = await Approval.findOne({ userId: req.user.id, id: appId });
    if (!app) return res.status(404).json({ error: "Application not found" });

    // SERVER-SIDE READINESS GATE ENFORCEMENT (§5)
    if (status === "SUBMITTED" && app.status !== "SUBMITTED") {
      const gate = await evaluateReadinessGate(req.user.id, app);
      if (!gate.isReady && !forceSubmit) {
        return res.status(422).json({
          error: "Document Readiness Gate Failed: License cannot be submitted until all mandatory documents are uploaded and verified.",
          gate
        });
      }

      // Freeze verified document set into a versioned submitted packet
      app.submittedPacket = {
        frozenAt: new Date().toISOString(),
        applicantId: req.user.id,
        requirementCode: app.requirementCode,
        documents: gate.checkedDocs,
        totalDocuments: gate.checkedCount
      };
      app.submittedDate = todayStr();
    }
    if (clarificationMessage !== undefined) {
      app.clarificationMessage = clarificationMessage || null;
    }
    if (inspectionDate !== undefined) {
      app.inspectionDate = inspectionDate || null;
    }
    if (notes !== undefined) {
      app.notes = notes || "";
    }

    await app.save();

    // If APPROVED → register compliance requirement / renewal tracking
    if (status === "APPROVED") {
      await registerApprovedLicense(req.user.id, parseApp(app));
    }

    const notifTypeMap = {
      APPROVED: "success",
      "CLARIFICATION REQUIRED": "warning",
      "INSPECTION REQUIRED": "warning",
      REJECTED: "danger",
    };

    await logActivity(req.user.id, `Application ${appId} (${app.title}) changed from ${oldStatus} to ${status}`, "Application");
    await addNotification(req.user.id, `Application ${appId} updated to ${status}`, notifTypeMap[status] || "info");

    res.json(parseApp(app));
  } catch (err) {
    console.error("[Application PATCH status]", err);
    res.status(500).json({ error: err.message });
  }
});

async function registerApprovedLicense(userId, application) {
  const existing = await ComplianceRequirement.findOne({ userId, applicationId: application.id });
  if (existing) return;

  const catalogItem = STATUTORY_CATALOG.find(r => r.code === application.requirementCode);
  const validityYears = catalogItem ? catalogItem.validityYears : 1;

  const issueDate = new Date();
  const expiryDate = new Date();
  expiryDate.setFullYear(issueDate.getFullYear() + validityYears);

  const newId = generateId("LIC");
  const licenseNumber = `SETU/${(application.category || "GEN").substring(0, 3).toUpperCase()}/${Math.floor(1000 + Math.random() * 9000)}`;

  await ComplianceRequirement.create({
    id: newId,
    userId,
    applicationId: application.id,
    requirementCode: application.requirementCode,
    title: application.title,
    department: application.department,
    licenseNumber,
    issueDate: issueDate.toISOString().split("T")[0],
    expiryDate: expiryDate.toISOString().split("T")[0],
    validityYears,
    status: "ACTIVE"
  });

  await logActivity(userId, `License registered for renewal tracking: ${application.title} (${licenseNumber})`, "Renewals");
}

module.exports = router;
