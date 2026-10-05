/**
 * ============================================================================
 * Seed Script: Create Dedicated Government Officer & Admin Accounts (§7 & §15)
 * ============================================================================
 */

require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const User = require("../models/User");
const { hashPassword } = require("../helpers");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/anumatisetu";

const OFFICER_ACCOUNTS = [
  {
    id: "USR_GOV_ADMIN_01",
    email: "admin@gov.in",
    rawPassword: "Admin@123",
    businessName: "Directorate of Industrial Approvals (Govt of Maharashtra)",
    role: "admin",
    department: "ALL",
    phone: "9876543210"
  },
  {
    id: "USR_GOV_FIRE_01",
    email: "fire.officer@gov.in",
    rawPassword: "Fire@123",
    businessName: "Directorate of Maharashtra Fire & Emergency Services",
    role: "officer",
    department: "Fire Services",
    phone: "9876543211"
  },
  {
    id: "USR_GOV_MPCB_01",
    email: "mpcb.officer@gov.in",
    rawPassword: "Mpcb@123",
    businessName: "Maharashtra Pollution Control Board (MPCB)",
    role: "officer",
    department: "MPCB",
    phone: "9876543212"
  },
  {
    id: "USR_GOV_DISH_01",
    email: "dish.officer@gov.in",
    rawPassword: "Dish@123",
    businessName: "Directorate of Industrial Safety & Health (DISH)",
    role: "officer",
    department: "DISH",
    phone: "9876543213"
  }
];

async function seedAdmin() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to database:", mongoose.connection.name);

    for (const acc of OFFICER_ACCOUNTS) {
      const passwordHash = hashPassword(acc.rawPassword);
      const existing = await User.findOne({ email: acc.email });

      if (existing) {
        existing.role = acc.role;
        existing.department = acc.department;
        existing.passwordHash = passwordHash;
        existing.businessName = acc.businessName;
        await existing.save();
        console.log(`✅ Updated: [${acc.email}] (${acc.role} - ${acc.department})`);
      } else {
        await User.create({
          id: acc.id,
          email: acc.email,
          phone: acc.phone,
          passwordHash,
          businessName: acc.businessName,
          role: acc.role,
          department: acc.department,
          sessions: []
        });
        console.log(`✅ Created: [${acc.email}] (${acc.role} - ${acc.department})`);
      }
    }

    console.log("\n🎉 Government Officer Accounts Successfully Seeded!");
    console.log("=================================================");
    OFFICER_ACCOUNTS.forEach(a => {
      console.log(`• ${a.email.padEnd(20)} | Pwd: ${a.rawPassword.padEnd(10)} | Role: ${a.role.padEnd(8)} | Dept: ${a.department}`);
    });
    console.log("=================================================");
  } catch (err) {
    console.error("Error creating officer accounts:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  }
}

seedAdmin();
