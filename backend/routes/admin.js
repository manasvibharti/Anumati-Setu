/**
 * ============================================================================
 * AnumatiSetu — Admin Simulation Routes (§7 in Roadmap v3)
 * Simulates Government Departmental Clearance, Scrutiny, and Query Workflows
 * ============================================================================
 */

const express = require("express");
const router = express.Router();
const Approval = require("../models/Approval");
const ComplianceRequirement = require("../models/ComplianceRequirement");
const User = require("../models/User");
const IndustrialProfile = require("../models/IndustrialProfile");
const { STATUTORY_CATALOG } = require("../catalog");
const { addNotification, logActivity, generateId, todayStr } = require("../helpers");
const { requireAuth, requireRole } = require("../middleware/auth");

router.use(requireAuth);
router.use(requireRole(["admin", "officer"]));

// ----------------------------------------------------------------------------
// GET /api/admin/me (Current Officer / Admin Session Info)
// ----------------------------------------------------------------------------
router.get("/me", async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      businessName: req.user.businessName,
      role: req.user.role,
      department: req.user.department || "ALL"
    }
  });
});

// ----------------------------------------------------------------------------
// GET /api/admin/queue (Departmental Scrutiny Queue)
// ----------------------------------------------------------------------------
router.get("/queue", async (req, res) => {
  try {
    let { department, status } = req.query;
    
    // If officer is assigned to a specific department, enforce their department scope
    if (req.user.role === "officer" && req.user.department && req.user.department !== "ALL") {
      department = req.user.department;
    }

    const query = {
      status: { $in: ["SUBMITTED", "UNDER_REVIEW", "CLARIFICATION REQUIRED", "INSPECTION REQUIRED"] }
    };

    if (department && department !== "ALL") {
      query.department = new RegExp(department, "i");
    }

    if (status && status !== "ALL") {
      query.status = new RegExp(`^${status}$`, "i");
    }

    const queueItems = await Approval.find(query).sort({ updatedAt: -1 }).lean();

    // Attach applicant profiles for context
    const enriched = await Promise.all(queueItems.map(async (item) => {
      const profile = await IndustrialProfile.findOne({ userId: item.userId }).lean();
      const user = await User.findOne({ id: item.userId }).lean();
      return {
        ...item,
        applicantName: profile?.businessName || user?.businessName || "Registered Enterprise",
        applicantLocation: profile ? `${profile.location || profile.district || 'MIDC'}, ${profile.state || 'MH'}` : "Maharashtra",
        applicantSector: profile?.industryType || "Manufacturing",
        applicantScale: profile?.businessCategory || "MSME"
      };
    }));

    res.json(enriched);
  } catch (err) {
    console.error("[Admin Queue GET]", err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------------
// PATCH /api/admin/applications/:id/review (Mark Under Department Review)
// ----------------------------------------------------------------------------
router.patch("/applications/:id/review", async (req, res) => {
  try {
    const app = await Approval.findOne({ id: req.params.id });
    if (!app) return res.status(404).json({ error: "Application not found" });

    app.status = "UNDER_REVIEW";
    await app.save();

    await logActivity(app.userId, `[Department Simulation] ${app.department} marked ${app.title} as UNDER_REVIEW`, "Department");
    await addNotification(app.userId, `Your application for ${app.title} is now under active departmental scrutiny.`, "info");

    res.json({ success: true, application: app });
  } catch (err) {
    console.error("[Admin Review PATCH]", err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------------
// POST /api/admin/applications/:id/query (Raise Departmental Clarification Query)
// ----------------------------------------------------------------------------
router.post("/applications/:id/query", async (req, res) => {
  try {
    const { queryText, requestedDocs = [] } = req.body;
    if (!queryText) return res.status(400).json({ error: "queryText is required" });

    const app = await Approval.findOne({ id: req.params.id });
    if (!app) return res.status(404).json({ error: "Application not found" });

    app.status = "CLARIFICATION REQUIRED";
    app.clarificationMessage = queryText;
    if (notes) app.notes = (app.notes ? app.notes + "\n" : "") + `[Department Query]: ${queryText}`;
    await app.save();

    await logActivity(app.userId, `[Department Query] ${app.department} raised a query on ${app.title}: "${queryText}"`, "Department");
    await addNotification(app.userId, `Action Required: ${app.department} requested clarification on ${app.title}.`, "warning");

    res.json({ success: true, application: app });
  } catch (err) {
    console.error("[Admin Query POST]", err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------------
// PATCH /api/admin/applications/:id/schedule-inspection
// ----------------------------------------------------------------------------
router.patch("/applications/:id/schedule-inspection", async (req, res) => {
  try {
    const { inspectionDate } = req.body;
    if (!inspectionDate) return res.status(400).json({ error: "inspectionDate is required" });

    const app = await Approval.findOne({ id: req.params.id });
    if (!app) return res.status(404).json({ error: "Application not found" });

    app.status = "INSPECTION REQUIRED";
    app.inspectionRequired = true;
    app.inspectionDate = inspectionDate;
    await app.save();

    await logActivity(app.userId, `[Inspection Scheduled] ${app.department} scheduled on-site inspection for ${app.title} on ${inspectionDate}`, "Department");
    await addNotification(app.userId, `On-site statutory inspection scheduled for ${app.title} on ${inspectionDate}.`, "warning");

    res.json({ success: true, application: app });
  } catch (err) {
    console.error("[Admin Inspection PATCH]", err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------------
// PATCH /api/admin/applications/:id/approve (Grant Official Statutory Approval)
// ----------------------------------------------------------------------------
router.patch("/applications/:id/approve", async (req, res) => {
  try {
    const app = await Approval.findOne({ id: req.params.id });
    if (!app) return res.status(404).json({ error: "Application not found" });

    app.status = "APPROVED";
    await app.save();

    // Generate simulated license and register in Renewals/Compliance Calendar
    const catalogItem = STATUTORY_CATALOG.find(r => r.code === app.requirementCode);
    const validityYears = catalogItem ? catalogItem.validityYears : 1;

    const issueDate = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(issueDate.getFullYear() + validityYears);

    const licenseNumber = `SETU/${(app.category || "IND").substring(0, 3).toUpperCase()}/${Math.floor(10000 + Math.random() * 90000)}`;

    const existingComp = await ComplianceRequirement.findOne({ userId: app.userId, applicationId: app.id });
    if (!existingComp) {
      await ComplianceRequirement.create({
        id: generateId("LIC"),
        userId: app.userId,
        applicationId: app.id,
        requirementCode: app.requirementCode,
        title: app.title,
        department: app.department,
        licenseNumber,
        issueDate: issueDate.toISOString().split("T")[0],
        expiryDate: expiryDate.toISOString().split("T")[0],
        validityYears,
        status: "ACTIVE"
      });
    }

    await logActivity(app.userId, `[Approval Granted] ${app.department} APPROVED ${app.title} (License #${licenseNumber})`, "Department");
    await addNotification(app.userId, `Congratulations! Your statutory license for ${app.title} (${licenseNumber}) has been approved.`, "success");

    res.json({ success: true, licenseNumber, application: app });
  } catch (err) {
    console.error("[Admin Approve PATCH]", err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------------
// PATCH /api/admin/applications/:id/reject (Simulate Statutory Rejection)
// ----------------------------------------------------------------------------
router.patch("/applications/:id/reject", async (req, res) => {
  try {
    const { reason = "Statutory non-compliance with regional industrial norms." } = req.body;
    const app = await Approval.findOne({ id: req.params.id });
    if (!app) return res.status(404).json({ error: "Application not found" });

    app.status = "REJECTED";
    app.notes = (app.notes ? app.notes + "\n" : "") + `[Rejection Reason]: ${reason}`;
    await app.save();

    await logActivity(app.userId, `[Application Rejected] ${app.department} rejected ${app.title}: ${reason}`, "Department");
    await addNotification(app.userId, `Application for ${app.title} was rejected by ${app.department}.`, "danger");

    res.json({ success: true, application: app });
  } catch (err) {
    console.error("[Admin Reject PATCH]", err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------------
// POST /api/admin/seed-demo (One-Click Judge Presentation Demo State)
// ----------------------------------------------------------------------------
router.post("/seed-demo", async (req, res) => {
  try {
    const userId = req.user.id;

    // Reset current user's applications to a balanced, realistic multi-department state
    await Approval.deleteMany({ userId });
    await ComplianceRequirement.deleteMany({ userId });

    const demoClearances = [
      {
        id: generateId("APP"),
        userId,
        requirementCode: "REQ_TRADE_LICENSE",
        title: "Municipal Trade License",
        department: "Brihanmumbai Municipal Corporation (BMC)",
        category: "General Business",
        status: "APPROVED",
        createdDate: "2026-08-15",
        submittedDate: "2026-08-18"
      },
      {
        id: generateId("APP"),
        userId,
        requirementCode: "REQ_FIRE_NOC",
        title: "Fire Safety Certificate (Fire NOC)",
        department: "Directorate of Maharashtra Fire Services",
        category: "Safety & Hazard",
        status: "UNDER_REVIEW",
        createdDate: "2026-09-01",
        submittedDate: "2026-09-05",
        inspectionRequired: true
      },
      {
        id: generateId("APP"),
        userId,
        requirementCode: "REQ_BUILDING_SANCTION",
        title: "Industrial Building Plan Sanction",
        department: "Maharashtra Industrial Development Corporation (MIDC)",
        category: "Infrastructure",
        status: "CLARIFICATION REQUIRED",
        createdDate: "2026-09-08",
        submittedDate: "2026-09-10",
        clarificationMessage: "Please provide signed structural stability certificate from a chartered civil engineer."
      },
      {
        id: generateId("APP"),
        userId,
        requirementCode: "REQ_FACTORIES_LICENSE",
        title: "Factory Registration & Operating License (Form 2)",
        department: "Directorate of Industrial Safety & Health (DISH Maharashtra)",
        category: "Labour & Safety",
        status: "SUBMITTED",
        createdDate: "2026-09-15",
        submittedDate: "2026-09-20",
        inspectionRequired: true
      },
      {
        id: generateId("APP"),
        userId,
        requirementCode: "REQ_SPCB_CTE_CTO",
        title: "Pollution Consent to Operate (CTO - Air & Water Acts)",
        department: "Maharashtra Pollution Control Board (MPCB)",
        category: "Environment",
        status: "DRAFT",
        createdDate: "2026-09-22"
      }
    ];

    for (const item of demoClearances) {
      const created = await Approval.create(item);
      if (item.status === "APPROVED") {
        await ComplianceRequirement.create({
          id: generateId("LIC"),
          userId,
          applicationId: created.id,
          requirementCode: item.requirementCode,
          title: item.title,
          department: item.department,
          licenseNumber: `MH/BMC/TL-2026/8492`,
          issueDate: "2026-08-20",
          expiryDate: "2027-08-20",
          validityYears: 1,
          status: "ACTIVE"
        });
      }
    }

    await logActivity(userId, "⚡ Demo Presentation State successfully seeded with 5 multi-department licenses", "System");
    await addNotification(userId, "Demo scenario initialized: 1 Approved, 1 Under Review, 1 Query Raised, 1 Submitted, 1 Draft.", "info");

    res.json({ success: true, message: "Demo scenario successfully initialized." });
  } catch (err) {
    console.error("[Admin Seed Demo]", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
