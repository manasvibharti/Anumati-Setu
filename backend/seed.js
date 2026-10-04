/**
 * ============================================================================
 * AnumatiSetu — MongoDB Reference Data Seeder
 * Seeds Authorities, State Mappings, and Government Schemes
 * ============================================================================
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { connectDB, mongoose } = require("./db");

const Authority = require("./models/Authority");
const StateAuthorityMapping = require("./models/StateAuthorityMapping");
const Scheme = require("./models/Scheme");
const { STATUTORY_CATALOG } = require("./catalog");

const AUTHORITIES_DATA = [
  {
    code: "MPCB",
    name: "Maharashtra Pollution Control Board",
    state: "Maharashtra",
    portalUrl: "https://ecmpcb.in",
    contactEmail: "helpdesk@mpcb.gov.in",
    contactPhone: "+91-22-2401-4701",
    description: "Nodal environmental authority granting Consent to Establish (CTE) & Consent to Operate (CTO)."
  },
  {
    code: "MIDC",
    name: "Maharashtra Industrial Development Corporation",
    state: "Maharashtra",
    portalUrl: "https://midcindia.org",
    contactEmail: "support@midcindia.org",
    contactPhone: "+91-22-2687-0052",
    description: "Industrial land allocation, infrastructure development, and building plan sanctions."
  },
  {
    code: "DISH_MH",
    name: "Directorate of Industrial Safety & Health (Maharashtra)",
    state: "Maharashtra",
    portalUrl: "https://dish.maharashtra.gov.in",
    contactEmail: "dish-mumbai@gov.in",
    contactPhone: "+91-22-2657-2510",
    description: "Enforces Factories Act 1948, workplace safety compliance, and factory operating licenses."
  },
  {
    code: "MAITRI",
    name: "Maharashtra Industry, Trade & Investment Facilitation Cell",
    state: "Maharashtra",
    portalUrl: "https://maitri.mahaonline.gov.in",
    contactEmail: "support-maitri@gov.in",
    contactPhone: "+91-22-2202-7100",
    description: "Single window portal for end-to-end statutory industrial approvals in Maharashtra."
  },
  {
    code: "FIRE_MH",
    name: "Directorate of Maharashtra Fire Services",
    state: "Maharashtra",
    portalUrl: "https://mahafireservice.gov.in",
    contactEmail: "fireservice@maharashtra.gov.in",
    contactPhone: "+91-22-2666-0287",
    description: "Fire prevention, life safety audit, and Fire Safety No-Objection Certificates."
  },
  {
    code: "PESO",
    name: "Petroleum and Explosives Safety Organisation",
    state: "All",
    portalUrl: "https://peso.gov.in",
    contactEmail: "explosives@explosives.gov.in",
    contactPhone: "+91-712-251-0248",
    description: "Statutory safety clearance for hazardous chemicals, petroleum, and compressed gas storage."
  },
  {
    code: "FSSAI",
    name: "Food Safety and Standards Authority of India",
    state: "All",
    portalUrl: "https://foscos.fssai.gov.in",
    contactEmail: "enquiry-foscos@fssai.gov.in",
    contactPhone: "1800-112-100",
    description: "National food safety licensing and regulatory compliance authority."
  },
  {
    code: "MSEDCL",
    name: "Maharashtra State Electricity Distribution Co. Ltd (Mahavitaran)",
    state: "Maharashtra",
    portalUrl: "https://www.mahadiscom.in",
    contactEmail: "customercare@mahadiscom.in",
    contactPhone: "1912",
    description: "Industrial HT/LT power connection sanction and billing."
  }
];

const SCHEMES_DATA = [
  {
    code: "PSI_MH_2019",
    title: "Package Scheme of Incentives (PSI Maharashtra 2019)",
    category: "Capital Subsidy",
    state: "Maharashtra",
    eligibleSectors: ["Manufacturing", "Food Processing", "Textile", "Chemicals", "Electronics"],
    maxSubsidy: "Up to 80% Gross Fixed Capital Investment",
    description: "Mega & MSME capital investment subsidy, industrial promotion subsidy, and stamp duty exemption.",
    eligibilitySummary: "New units or expansion units investing in specified talukas (Category B, C, D, D+).",
    applicationUrl: "https://maitri.mahaonline.gov.in",
    active: true
  },
  {
    code: "PMEGP",
    title: "Prime Minister's Employment Generation Programme (PMEGP)",
    category: "Capital Subsidy",
    state: "All",
    eligibleSectors: ["Manufacturing", "Services", "Food Processing"],
    maxSubsidy: "15% to 35% of Project Cost (up to ₹50 Lakhs)",
    description: "Credit-linked subsidy programme to generate employment opportunities in urban and rural areas.",
    eligibilitySummary: "Individuals aged 18+ starting new micro-enterprises.",
    applicationUrl: "https://www.kviconline.gov.in/pmegpeportal/",
    active: true
  },
  {
    code: "PLI_INDIA",
    title: "Production Linked Incentive (PLI) Scheme",
    category: "Capital Subsidy",
    state: "All",
    eligibleSectors: ["Electronics", "Chemicals", "Textile", "Food Processing", "Manufacturing"],
    maxSubsidy: "4% to 6% on Incremental Sales",
    description: "Incentivizes domestic manufacturing and attracts large-scale investments across priority sectors.",
    eligibilitySummary: "Companies meeting threshold investment and incremental production targets.",
    applicationUrl: "https://www.investindia.gov.in/production-linked-incentives-schemes-india",
    active: true
  },
  {
    code: "CLCSS_MSME",
    title: "Credit Linked Capital Subsidy Scheme (CLCSS)",
    category: "Interest Subvention",
    state: "All",
    eligibleSectors: ["Manufacturing", "Food Processing", "Textile", "Chemicals", "Electronics"],
    maxSubsidy: "15% upfront capital subsidy (up to ₹15 Lakhs)",
    description: "Facilitates technology up-gradation of Micro and Small Enterprises in approved sub-sectors.",
    eligibilitySummary: "Registered MSEs availing institutional finance for induction of proven technologies.",
    applicationUrl: "https://msme.gov.in",
    active: true
  },
  {
    code: "ZED_GREEN",
    title: "MSME Sustainable (ZED) Certification & Subsidy",
    category: "Green Tech Incentive",
    state: "All",
    eligibleSectors: ["All"],
    maxSubsidy: "Up to 80% subsidy on certification & ₹5 Lakhs for handholding",
    description: "Zero Defect Zero Effect scheme encouraging green manufacturing practices and energy efficiency.",
    eligibilitySummary: "Udyam registered manufacturing MSMEs.",
    applicationUrl: "https://zed.msme.gov.in",
    active: true
  }
];

async function seed() {
  try {
    await connectDB();
    console.log("Seeding reference data to MongoDB Atlas...");

    // 1. Seed Authorities
    for (const auth of AUTHORITIES_DATA) {
      await Authority.findOneAndUpdate({ code: auth.code }, auth, { upsert: true, new: true });
    }
    console.log(`✅ ${AUTHORITIES_DATA.length} Authorities seeded.`);

    // 2. Seed Schemes
    for (const scheme of SCHEMES_DATA) {
      await Scheme.findOneAndUpdate({ code: scheme.code }, scheme, { upsert: true, new: true });
    }
    console.log(`✅ ${SCHEMES_DATA.length} Government Schemes seeded.`);

    // 3. Seed StateAuthorityMappings for Maharashtra
    for (const item of STATUTORY_CATALOG) {
      const mapping = {
        state: "Maharashtra",
        requirementCode: item.code,
        title: item.title,
        authorityCode: item.deptKey ? item.deptKey.toUpperCase() : "GENERAL",
        deptKey: item.deptKey || "",
        defaultDept: item.defaultDept || item.department || "Statutory Authority",
        category: item.category || "General Business",
        description: item.description || "",
        mandatoryDocuments: item.mandatoryDocuments || [],
        inspectionRequired: !!item.inspectionRequired,
        validityYears: item.validityYears || 1,
        feeEstimate: item.feeEstimate || "As per schedule"
      };

      await StateAuthorityMapping.findOneAndUpdate(
        { state: "Maharashtra", requirementCode: item.code },
        mapping,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ ${STATUTORY_CATALOG.length} State Authority Mappings seeded.`);

    console.log("\n🎉 Database Seeding Completed Successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

if (require.main === module) {
  seed();
}

module.exports = { seed };
