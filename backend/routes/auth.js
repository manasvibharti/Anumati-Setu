/**
 * ============================================================================
 * AnumatiSetu — Authentication Routes (Mongoose / MongoDB)
 * POST /api/auth/register-and-profile → Atomic registration & profile setup
 * POST /api/auth/login                → Sign in and issue token
 * GET  /api/auth/me                   → Get current user info & profile
 * POST /api/auth/logout               → Invalidate session
 * ============================================================================
 */

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const IndustrialProfile = require("../models/IndustrialProfile");
const { generateId, generateToken, hashPassword, logActivity, addNotification } = require("../helpers");
const { requireAuth } = require("../middleware/auth");

// POST /api/auth/register-and-profile (Atomic 1-step registration & profile creation)
router.post("/register-and-profile", async (req, res) => {
  const { email, password, businessName, industryType, businessStage, location, state,
          investmentScale, employeesCount, businessCategory, pollutionCategory, district } = req.body;

  if (!businessName || !location) {
    return res.status(400).json({ error: "Business name and operating location are required." });
  }

  const cleanEmail = (email || `user_${Date.now()}@company.local`).trim().toLowerCase();
  const rawPassword = password && password.length >= 6 ? password : "Password@123";

  try {
    let user = await User.findOne({ email: cleanEmail });
    let token = generateToken();

    if (user) {
      user.sessions.push({ token, createdAt: new Date() });
      if (businessName) user.businessName = businessName.trim();
      await user.save();
    } else {
      const userId = generateId("USR");
      const passwordHash = hashPassword(rawPassword);

      user = await User.create({
        id: userId,
        email: cleanEmail,
        passwordHash,
        businessName: businessName.trim(),
        role: "user",
        sessions: [{ token, createdAt: new Date() }]
      });
    }

    // Upsert Industrial Profile
    const profileData = {
      userId: user.id,
      businessName: businessName.trim(),
      industryType: industryType || "Manufacturing",
      businessStage: businessStage || "New Setup",
      location: location.trim(),
      district: district || "",
      state: state || "Maharashtra",
      investmentScale: investmentScale || "",
      employeesCount: parseInt(employeesCount) || 0,
      businessCategory: businessCategory || "Small Enterprise",
      pollutionCategory: pollutionCategory || "Orange"
    };

    const profile = await IndustrialProfile.findOneAndUpdate(
      { userId: user.id },
      profileData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await logActivity(user.id, `Business profile created for ${businessName.trim()}`, "Profile");
    await addNotification(user.id, `Profile created! Statutory clearances have been calculated for ${businessName.trim()}.`, "success");

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        businessName: user.businessName,
      },
      profile: {
        businessName: profile.businessName,
        industryType: profile.industryType,
        location: profile.location,
        state: profile.state,
        employeesCount: profile.employeesCount,
        businessCategory: profile.businessCategory,
        pollutionCategory: profile.pollutionCategory
      }
    });
  } catch (err) {
    console.error("[Auth Register & Profile Error]", err);
    res.status(500).json({ error: err.message || "Failed to create profile" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const cleanEmail = email.trim().toLowerCase();
    const passwordHash = hashPassword(password);

    const user = await User.findOne({ email: cleanEmail, passwordHash });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = generateToken();
    user.sessions.push({ token, createdAt: new Date() });
    await user.save();

    await logActivity(user.id, `User logged in`, "Auth");

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        businessName: user.businessName,
        role: user.role
      },
    });
  } catch (err) {
    console.error("[Auth Login Error]", err);
    res.status(500).json({ error: err.message || "Login failed" });
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  try {
    const profile = await IndustrialProfile.findOne({ userId: req.user.id }).lean();

    let formattedProfile = null;
    if (profile) {
      formattedProfile = {
        businessName: profile.businessName,
        industryType: profile.industryType,
        businessStage: profile.businessStage,
        location: profile.location,
        district: profile.district,
        state: profile.state,
        investmentScale: profile.investmentScale,
        employeesCount: profile.employeesCount,
        businessCategory: profile.businessCategory,
        pollutionCategory: profile.pollutionCategory,
        updatedAt: profile.updatedAt,
        isComplete: !!(profile.businessName && profile.location),
      };
    }

    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        businessName: req.user.businessName,
        role: req.user.role
      },
      profile: formattedProfile,
    });
  } catch (err) {
    console.error("[Auth Me Error]", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/logout
router.post("/logout", requireAuth, async (req, res) => {
  try {
    await User.updateOne(
      { id: req.user.id },
      { $pull: { sessions: { token: req.user.token } } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
