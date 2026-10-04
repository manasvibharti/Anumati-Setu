/**
 * ============================================================================
 * AnumatiSetu — Dashboard & Notifications Routes (Mongoose / User Scoped)
 * ============================================================================
 */

const express = require("express");
const router = express.Router();
const IndustrialProfile = require("../models/IndustrialProfile");
const Approval = require("../models/Approval");
const ComplianceRequirement = require("../models/ComplianceRequirement");
const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");
const { evaluateApprovalsForProfile } = require("../services/ruleEngine");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

// GET /api/dashboard
router.get("/", async (req, res) => {
  try {
    // Profile
    const profileDoc = await IndustrialProfile.findOne({ userId: req.user.id }).lean();
    const profile = profileDoc && profileDoc.location ? {
      businessName:     profileDoc.businessName,
      industryType:     profileDoc.industryType,
      businessStage:    profileDoc.businessStage,
      location:         profileDoc.location,
      district:         profileDoc.district,
      state:            profileDoc.state,
      employeesCount:   profileDoc.employeesCount,
      businessCategory: profileDoc.businessCategory,
      pollutionCategory: profileDoc.pollutionCategory,
    } : null;

    // Approvals / Applications
    const allApps = await Approval.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();

    const activeApps = allApps.filter(
      a => a.status !== "APPROVED" && a.status !== "REJECTED"
    );
    const pendingActions = allApps.filter(
      a => a.status === "CLARIFICATION REQUIRED" || a.status === "INSPECTION REQUIRED"
    );
    const recentApps = allApps.slice(0, 5).map(a => ({
      id:                a.id,
      title:             a.title,
      department:        a.department,
      status:            a.status,
      createdDate:       a.createdDate,
      documentsAttached: a.documentsAttached || [],
    }));

    // Requirements count from dynamic rule engine
    let totalRequiredApprovals = 0;
    if (profileDoc) {
      const requirements = await evaluateApprovalsForProfile(profileDoc, allApps);
      totalRequiredApprovals = requirements.length;
    }

    // Renewals / Compliance
    const renewals = await ComplianceRequirement.find({ userId: req.user.id }).lean();
    const now = new Date();
    const upcomingRenewals = renewals.filter(r => {
      if (!r.expiryDate) return false;
      const exp = new Date(r.expiryDate);
      const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
      return diffDays <= 60;
    });

    // Recent activity log
    const actRows = await AuditLog.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(5).lean();
    const recentActivities = actRows.map(a => ({
      id:        a.id,
      text:      a.text,
      module:    a.module,
      timestamp: a.timestampLabel,
    }));

    // Notifications
    const notifRows = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(5).lean();
    const notifications = notifRows.map(n => ({
      id:      n.id,
      message: n.message,
      type:    n.type,
      time:    n.timeLabel,
      read:    !!n.isRead,
    }));

    res.json({
      metrics: {
        hasProfile:              !!profile,
        profile,
        totalRequiredApprovals,
        activeApplicationsCount: activeApps.length,
        pendingActionsCount:     pendingActions.length,
        upcomingRenewalsCount:   upcomingRenewals.length,
        totalApplicationsCount:  allApps.length,
        approvedCount:           allApps.filter(a => a.status === "APPROVED").length,
      },
      recentApplications: recentApps,
      recentActivities,
      notifications,
    });
  } catch (err) {
    console.error("[Dashboard GET]", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/notifications
router.get("/notifications", async (req, res) => {
  try {
    const rows = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(20).lean();
    res.json(rows.map(n => ({
      id:      n.id,
      message: n.message,
      type:    n.type,
      time:    n.timeLabel,
      read:    !!n.isRead,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/dashboard/notifications/mark-read
router.post("/notifications/mark-read", async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id }, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
