/**
 * ============================================================================
 * AnumatiSetu — Schemes & Authorities Routes
 * ============================================================================
 */

const express = require("express");
const router = express.Router();
const Scheme = require("../models/Scheme");
const Authority = require("../models/Authority");
const IndustrialProfile = require("../models/IndustrialProfile");
const { requireAuth } = require("../middleware/auth");

// GET /api/schemes (Optionally filtered for current user's profile sector/state)
router.get("/", requireAuth, async (req, res) => {
  try {
    const profile = await IndustrialProfile.findOne({ userId: req.user.id }).lean();
    const userState = profile?.state || "Maharashtra";
    const userSector = profile?.industryType || "Manufacturing";

    const schemes = await Scheme.find({
      active: true,
      $or: [
        { state: "All" },
        { state: userState }
      ]
    }).lean();

    // Tag matching schemes for this specific industrial profile
    const enriched = schemes.map(s => {
      const sectorMatch = s.eligibleSectors.includes("All") || s.eligibleSectors.includes(userSector);
      return {
        ...s,
        isRecommended: sectorMatch
      };
    });

    res.json(enriched);
  } catch (err) {
    console.error("[Schemes GET]", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/schemes/authorities
router.get("/authorities", async (req, res) => {
  try {
    const authorities = await Authority.find().lean();
    res.json(authorities);
  } catch (err) {
    console.error("[Authorities GET]", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
