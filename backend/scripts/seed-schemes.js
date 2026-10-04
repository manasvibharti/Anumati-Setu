/**
 * ============================================================================
 * Seed Script: Curated Central & State Government Support Schemes (MSME & Large)
 * ============================================================================
 */

require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const mongoose = require("mongoose");
const Scheme = require("../models/Scheme");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/anumatisetu";

const curatedSchemes = [
  {
    code: "MH-PSI-2019",
    title: "Maharashtra Package Scheme of Incentives (PSI 2019)",
    category: "Capital Subsidy",
    state: "Maharashtra",
    eligibleSectors: ["Manufacturing", "Engineering", "Textiles", "Chemicals", "Food Processing", "Electronics", "Automotive"],
    maxSubsidy: "Up to 80% of Eligible Capital Investment (FCI)",
    description: "Flagship incentive scheme by the Government of Maharashtra to encourage industrial investment in developing zones (Group B, C, D, D+). Includes Industrial Promotion Subsidy (IPS) equivalent to 100% of SGST paid.",
    eligibilitySummary: "New or expanding manufacturing MSMEs and Large Enterprises with valid Factory License and MPCB Consent to Operate in Maharashtra.",
    applicationUrl: "https://maitri.mahaonline.gov.in",
    active: true
  },
  {
    code: "PMEGP-CENTRAL",
    title: "Prime Minister Employment Generation Programme (PMEGP)",
    category: "Capital Subsidy",
    state: "All",
    eligibleSectors: ["All", "Manufacturing", "Services", "Food Processing"],
    maxSubsidy: "Up to 35% Margin Money Subsidy (Max ₹50 Lakh Project)",
    description: "Credit-linked subsidy programme by Ministry of MSME to assist entrepreneurs in setting up micro-enterprises in non-farm manufacturing and service sectors.",
    eligibilitySummary: "Any individual above 18 years; minimum 8th standard pass for projects costing > ₹10 Lakhs in manufacturing sector.",
    applicationUrl: "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp",
    active: true
  },
  {
    code: "CLCSS-TECH",
    title: "Credit Linked Capital Subsidy Scheme for Technology Upgradation (CLCSS)",
    category: "Capital Subsidy",
    state: "All",
    eligibleSectors: ["Manufacturing", "Engineering", "Pharmaceuticals", "Plastic", "Textiles"],
    maxSubsidy: "15% Capital Subsidy (Max ₹15 Lakhs)",
    description: "Facilitates technology upgradation of MSMEs by providing 15% upfront capital subsidy for institutional finance availed to purchase modern plant & machinery.",
    eligibilitySummary: "Existing or new Micro & Small Enterprises with valid Udyam Registration investing in approved cutting-edge sub-sector machinery.",
    applicationUrl: "https://clcss.dcmsme.gov.in",
    active: true
  },
  {
    code: "ZED-GREEN-CERT",
    title: "MSME Sustainable (ZED) Certification & Technology Reimbursement",
    category: "Green Tech Incentive",
    state: "All",
    eligibleSectors: ["All", "Manufacturing"],
    maxSubsidy: "Up to 80% Subsidy on Certification + ₹5 Lakhs for Clean Tech",
    description: "Encourages MSMEs to adopt Zero Defect Zero Effect manufacturing practices. Provides financial assistance for assessment, bronze/silver/gold certification, and clean green technology adoption.",
    eligibilitySummary: "Manufacturing MSMEs with active Udyam Registration.",
    applicationUrl: "https://zed.msme.gov.in",
    active: true
  },
  {
    code: "MH-POWER-TARIFF",
    title: "Maharashtra Industrial Power Tariff Concession Scheme",
    category: "Power Tariff Subsidy",
    state: "Maharashtra",
    eligibleSectors: ["Manufacturing", "Textiles", "Cold Storage", "Agro-Processing"],
    maxSubsidy: "₹1.00 to ₹1.50 per unit rebate for 3–5 Years",
    description: "Electricity tariff subsidy provided to industrial consumers located in Vidarbha, Marathwada, North Maharashtra, and tribal/underdeveloped talukas to lower operational costs.",
    eligibilitySummary: "HT/LT Industrial electricity consumers with valid CEIG installation approval and DISCOM connection in eligible talukas.",
    applicationUrl: "https://maitri.mahaonline.gov.in",
    active: true
  },
  {
    code: "SOLAR-ROOFTOP-MSME",
    title: "Industrial Rooftop Solar & Renewable Energy Subsidy",
    category: "Green Tech Incentive",
    state: "All",
    eligibleSectors: ["All", "Manufacturing", "Warehousing"],
    maxSubsidy: "Accelerated Depreciation (40%) + Low-Interest Green Loans",
    description: "Promotes on-site captive solar power generation for factories, reducing peak grid electricity bills by 60% with accelerated tax depreciation benefits and SIDBI 4E green financing.",
    eligibilitySummary: "Industrial units with owned or long-lease factory roof space and Discom net-metering NOC.",
    applicationUrl: "https://solarrooftop.gov.in",
    active: true
  },
  {
    code: "CGTMSE-COLLATERAL-FREE",
    title: "Credit Guarantee Fund Trust for Micro & Small Enterprises (CGTMSE)",
    category: "Interest Subvention",
    state: "All",
    eligibleSectors: ["All", "Manufacturing", "Services"],
    maxSubsidy: "Collateral-Free Credit Guarantee up to ₹5 Crores",
    description: "Enables MSMEs to secure business & working capital term loans from scheduled banks without pledging third-party collateral or personal real-estate guarantees.",
    eligibilitySummary: "New and existing Micro and Small Enterprises with viable business models and bank loan sanction.",
    applicationUrl: "https://www.cgtmse.in",
    active: true
  }
];

async function seedSchemes() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to database:", mongoose.connection.name);

    for (const schemeData of curatedSchemes) {
      await Scheme.findOneAndUpdate(
        { code: schemeData.code },
        { $set: schemeData },
        { upsert: true, new: true }
      );
      console.log(`✅ Seeded Scheme: [${schemeData.code}] ${schemeData.title}`);
    }

    console.log("\n🎉 All 7 Government Support Schemes successfully seeded/updated!");
  } catch (err) {
    console.error("Error seeding schemes:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  }
}

seedSchemes();
