/**
 * ============================================================================
 * AnumatiSetu — Profile Routes (Mongoose / User Scoped)
 * ============================================================================
 */

const express = require("express");
const router = express.Router();
const IndustrialProfile = require("../models/IndustrialProfile");
const User = require("../models/User");
const Approval = require("../models/Approval");
const { evaluateApprovalsForProfile } = require("../services/ruleEngine");
const { logActivity } = require("../helpers");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

// GET /api/profile
router.get("/", async (req, res) => {
  try {
    const profile = await IndustrialProfile.findOne({ userId: req.user.id }).lean();
    if (!profile) return res.json(null);

    res.json({
      businessName:     profile.businessName,
      industryType:     profile.industryType,
      businessStage:    profile.businessStage,
      location:         profile.location,
      district:         profile.district,
      state:            profile.state,
      investmentScale:  profile.investmentScale,
      employeesCount:   profile.employeesCount,
      businessCategory: profile.businessCategory,
      pollutionCategory: profile.pollutionCategory,
      powerLoadKW:      profile.powerLoadKW,
      landAreaSqM:      profile.landAreaSqM,
      updatedAt:        profile.updatedAt,
      isComplete:       !!(profile.businessName && profile.location),
    });
  } catch (err) {
    console.error("[Profile GET]", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/profile
router.post("/", async (req, res) => {
  const { businessName, industryType, businessStage, location, district, state,
          investmentScale, employeesCount, businessCategory, pollutionCategory, powerLoadKW, landAreaSqM } = req.body;

  if (!businessName || !location) {
    return res.status(400).json({ error: "businessName and location are required." });
  }

  try {
    const profileData = {
      userId: req.user.id,
      businessName: businessName.trim(),
      industryType: industryType || "Manufacturing",
      businessStage: businessStage || "New Setup",
      location: location.trim(),
      district: district || "",
      state: state || "Maharashtra",
      investmentScale: investmentScale || "",
      employeesCount: parseInt(employeesCount) || 0,
      businessCategory: businessCategory || "Small Enterprise",
      pollutionCategory: pollutionCategory || "Orange",
      powerLoadKW: parseFloat(powerLoadKW) || 0,
      landAreaSqM: parseFloat(landAreaSqM) || 0,
    };

    const updated = await IndustrialProfile.findOneAndUpdate(
      { userId: req.user.id },
      profileData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await User.updateOne({ id: req.user.id }, { businessName: businessName.trim() });
    await logActivity(req.user.id, `Business Profile updated: ${businessName.trim()}`, "Profile");

    res.json({ success: true, businessName: updated.businessName });
  } catch (err) {
    console.error("[Profile POST]", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/profile/requirements
router.get("/requirements", async (req, res) => {
  try {
    const profile = await IndustrialProfile.findOne({ userId: req.user.id }).lean();
    if (!profile) return res.json([]);

    const existingApps = await Approval.find({ userId: req.user.id }).lean();
    const requirements = await evaluateApprovalsForProfile(profile, existingApps);

    res.json(requirements);
  } catch (err) {
    console.error("[Profile Requirements GET]", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
