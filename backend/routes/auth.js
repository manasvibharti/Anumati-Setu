/**
 * ============================================================================
 * AnumatiSetu — Authentication & Multi-Account Routes (MongoDB / Mongoose)
 * ============================================================================
 */

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const IndustrialProfile = require("../models/IndustrialProfile");
const { generateId, generateToken, hashPassword, logActivity, addNotification } = require("../helpers");
const { requireAuth } = require("../middleware/auth");

// POST /api/auth/send-otp (Generates 6-digit OTP for email/phone)
router.post("/send-otp", async (req, res) => {
  const { email, phone } = req.body;
  if (!email && !phone) {
    return res.status(400).json({ error: "Email or phone number is required to send OTP." });
  }

  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanPhone = (phone || "").trim();

  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    let user = await User.findOne({
      $or: [
        ...(cleanEmail ? [{ email: cleanEmail }] : []),
        ...(cleanPhone ? [{ phone: cleanPhone }] : [])
      ]
    });

    if (user) {
      user.otp = { code: otpCode, expiresAt };
      await user.save();
    } else {
      // Create temporary placeholder user if registering via OTP
      const userId = generateId("USR");
      user = await User.create({
        id: userId,
        email: cleanEmail || `user_${Date.now()}@secure.anumatisetu.in`,
        phone: cleanPhone,
        passwordHash: hashPassword("OtpSecure@123"),
        businessName: "New Enterprise",
        otp: { code: otpCode, expiresAt }
      });
    }

    console.log(`\n[AUTH OTP] Sent OTP ${otpCode} to ${cleanEmail || cleanPhone}\n`);

    res.json({
      success: true,
      message: `OTP sent successfully to ${cleanEmail || cleanPhone}`,
      // Return preview of code for instant feedback/testing
      otpPreview: otpCode
    });
  } catch (err) {
    console.error("[Send OTP Error]", err);
    res.status(500).json({ error: "Failed to generate OTP" });
  }
});

// POST /api/auth/verify-otp (Validates OTP and issues session token)
router.post("/verify-otp", async (req, res) => {
  const { email, phone, otp } = req.body;
  if (!otp || (!email && !phone)) {
    return res.status(400).json({ error: "Identifier and 6-digit OTP are required." });
  }

  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanPhone = (phone || "").trim();

  try {
    const user = await User.findOne({
      $or: [
        ...(cleanEmail ? [{ email: cleanEmail }] : []),
        ...(cleanPhone ? [{ phone: cleanPhone }] : [])
      ]
    });

    if (!user) {
      return res.status(404).json({ error: "User account not found." });
    }

    if (!user.otp || !user.otp.code || user.otp.code !== otp.trim()) {
      return res.status(401).json({ error: "Invalid OTP. Please check and try again." });
    }

    if (new Date() > new Date(user.otp.expiresAt)) {
      return res.status(401).json({ error: "OTP has expired. Please request a new one." });
    }

    // Clear OTP and create session
    user.otp = { code: null, expiresAt: null };
    const token = generateToken();
    user.sessions.push({ token, createdAt: new Date() });
    await user.save();

    const profile = await IndustrialProfile.findOne({ userId: user.id }).lean();

    await logActivity(user.id, `User signed in via OTP`, "Auth");

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        businessName: user.businessName,
        role: user.role
      },
      profile
    });
  } catch (err) {
    console.error("[Verify OTP Error]", err);
    res.status(500).json({ error: "OTP verification failed" });
  }
});

// POST /api/auth/register (Standard Enterprise Registration)
router.post("/register", async (req, res) => {
  const { email, password, businessName, phone } = req.body;

  if (!email || !password || !businessName) {
    return res.status(400).json({ error: "Business name, email, and password are required." });
  }

  const cleanEmail = email.trim().toLowerCase();
  try {
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists. Please sign in." });
    }

    const userId = generateId("USR");
    const token = generateToken();
    const passwordHash = hashPassword(password);

    const user = await User.create({
      id: userId,
      email: cleanEmail,
      phone: (phone || "").trim(),
      passwordHash,
      businessName: businessName.trim(),
      sessions: [{ token, createdAt: new Date() }]
    });

    await IndustrialProfile.create({
      userId: user.id,
      businessName: businessName.trim(),
      industryType: "Manufacturing",
      location: "Maharashtra",
      state: "Maharashtra"
    });

    await logActivity(user.id, `Account created for ${businessName.trim()}`, "Auth");
    await addNotification(user.id, `Welcome to AnumatiSetu! Your workspace is ready.`, "success");

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        businessName: user.businessName,
        role: user.role
      }
    });
  } catch (err) {
    console.error("[Register Error]", err);
    res.status(500).json({ error: err.message || "Registration failed" });
  }
});

// POST /api/auth/register-and-profile (Atomic registration & profile setup)
router.post("/register-and-profile", async (req, res) => {
  const { email, password, phone, businessName, industryType, businessStage, location, state,
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
      if (phone) user.phone = phone.trim();
      await user.save();
    } else {
      const userId = generateId("USR");
      const passwordHash = hashPassword(rawPassword);

      user = await User.create({
        id: userId,
        email: cleanEmail,
        phone: (phone || "").trim(),
        passwordHash,
        businessName: businessName.trim(),
        role: "user",
        sessions: [{ token, createdAt: new Date() }]
      });
    }

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
    await addNotification(user.id, `Profile created! Statutory clearances have been calculated.`, "success");

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        businessName: user.businessName,
      },
      profile
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

    await logActivity(user.id, `User logged in with password`, "Auth");

    const profile = await IndustrialProfile.findOne({ userId: user.id }).lean();

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        businessName: user.businessName,
        role: user.role,
        department: user.department || "ALL"
      },
      profile
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

    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        businessName: req.user.businessName,
        role: req.user.role,
        department: req.user.department || "ALL"
      },
      profile: profile ? {
        ...profile,
        isComplete: !!(profile.businessName && profile.location)
      } : null,
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
