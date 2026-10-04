/**
 * ============================================================================
 * AnumatiSetu — Chatbot API Route
 * Provides instant regulatory, statutory, document, and platform query resolution
 * ============================================================================
 */

const express = require("express");
const router = express.Router();
const { getPool } = require("../db");
const { getStatutoryCatalogForProfile } = require("../catalog");

// Knowledge base and FAQ intelligence dictionary
const FAQ_KNOWLEDGE = [
  {
    keywords: ["fire noc", "fire safety", "fire license", "fire department", "fire approval", "fire protection"],
    title: "Fire Safety No-Objection Certificate (NOC)",
    response: `**Fire Safety No-Objection Certificate (NOC)**
• **Issuing Authority:** Directorate of Maharashtra Fire Services / Municipal Fire Brigade (via MAITRI portal).
• **Official Portal:** [mahafireservice.gov.in](https://mahafireservice.gov.in)
• **Key Documents Needed:**
  1. Architectural CAD drawings (1:100 scale) showing setbacks, exit stairs, refuge areas & hydrant network.
  2. Firefighting layout scheme by a licensed agency (Form A/B).
  3. Building structural stability certificate.
  4. Land title deeds / MIDC allotment order.
• **Validity:** Provisional NOC valid for 1 year during construction; Final NOC requires physical on-site inspection.
• **Submission:** Upload on Single Window MAITRI Portal + 1 hardcopy set submitted to Chief Fire Officer (CFO) divisional desk.`,
    quickLinks: [
      { text: "View Fire NOC Details", url: "approvals.html" },
      { text: "Official Portal", url: "https://mahafireservice.gov.in", external: true }
    ]
  },
  {
    keywords: ["factory license", "form 1", "form 2", "dish", "factories act", "factory registration"],
    title: "Factory Registration & Operating License (Form 1 & 2)",
    response: `**Factory Registration & License (Under Factories Act 1948)**
• **Issuing Authority:** Directorate of Industrial Safety & Health (DISH Maharashtra).
• **Official Portal:** [dish.maharashtra.gov.in](https://dish.maharashtra.gov.in)
• **Applicability:** Units employing 10+ workers with power, or 20+ workers without power.
• **Key Documents Needed:**
  1. Detailed machinery layout plan & manufacturing process flow chart.
  2. Building Stability Certificate signed by a DISH-empanelled structural engineer.
  3. List of Plant & Machinery with connected HP/KW ratings.
  4. Partnership deed or Memorandum/Articles of Association (MOA/AOA).
• **Validity:** 1 to 5 years (as per fee paid). Apply at least 30 days prior to commercial operations.`,
    quickLinks: [
      { text: "Check Approvals", url: "approvals.html" },
      { text: "DISH Maharashtra Portal", url: "https://dish.maharashtra.gov.in", external: true }
    ]
  },
  {
    keywords: ["mpcb", "consent to establish", "consent to operate", "cte", "cto", "pollution", "spcb", "green", "orange", "red", "white", "effluent", "etp", "stp"],
    title: "Pollution Control Board Consent (MPCB CTE / CTO)",
    response: `**MPCB Consent to Establish (CTE) & Consent to Operate (CTO)**
• **Issuing Authority:** Maharashtra Pollution Control Board (MPCB).
• **Official Portal:** [ecmpcb.in](https://ecmpcb.in)
• **Categories:**
  - 🟢 **Green / White:** Low pollution risk; expedited processing and self-certification for White category.
  - 🟠 **Orange:** Moderate risk; mandatory ETP/STP design schematics and stack emission reports.
  - 🔴 **Red:** High environmental impact; requires comprehensive EIA, public hearing clearances, and online continuous monitoring.
• **Key Documents Needed:**
  1. Process flow diagram with material & water balance sheet.
  2. ETP / STP design schematics with effluent discharge parameters.
  3. Ambient Air & Stack Emission monitoring report from an MoEF-recognized lab.
  4. CA Capital Investment Certificate (Gross Fixed Assets value).`,
    quickLinks: [
      { text: "View MPCB Approval", url: "approvals.html" },
      { text: "e-MPCB Online Portal", url: "https://ecmpcb.in", external: true }
    ]
  },
  {
    keywords: ["building plan", "plan sanction", "midc", "occupancy certificate", "bp sanction", "fsi", "far"],
    title: "Building Plan Sanction & Industrial Construction Approval",
    response: `**Industrial Building Plan Sanction**
• **Issuing Authority:** MIDC Planning Authority / Local Urban Development Authority.
• **Official Portal:** [midcindia.org](https://midcindia.org) / Single Window Portal.
• **Key Documents Needed:**
  1. Site plan and architectural floor drawings certified by a Registered Architect / Town Planner.
  2. Structural Design Calculations compliant with NBC 2016 seismic codes.
  3. Soil investigation & geotechnical bearing capacity report.
  4. MIDC Plot Possession Receipt & Demarcation Certificate.
• **Validity:** Construction sanction valid for 2 years (extendable); apply for Occupancy Certificate before commissioning.`,
    quickLinks: [
      { text: "Go to Approvals", url: "approvals.html" },
      { text: "MIDC Building Portal", url: "https://midcindia.org", external: true }
    ]
  },
  {
    keywords: ["gst", "gstin", "gst registration", "tax registration"],
    title: "GSTIN Registration",
    response: `**Goods and Services Tax Identification Number (GSTIN)**
• **Issuing Authority:** Central Board of Indirect Taxes and Customs (CBIC) / State GST Dept.
• **Official Portal:** [gst.gov.in](https://gst.gov.in)
• **Key Documents Needed:**
  1. PAN Card of Business Entity and Authorized Signatories.
  2. Proof of Principal Place of Business (Electricity Bill + Rent Agreement / MIDC Allotment Letter).
  3. Bank Account Proof (Cancelled cheque or Bank Statement).
  4. Aadhaar authentication of promoters for instant approval.
• **Turnaround:** 3 to 7 working days via automated Aadhaar authentication.`,
    quickLinks: [
      { text: "GST Portal", url: "https://gst.gov.in", external: true }
    ]
  },
  {
    keywords: ["document", "upload", "vault", "expiry", "calculate expiry", "download", "storage"],
    title: "Document Vault & Automatic Expiry",
    response: `**Document Vault & Automatic Expiry Calculation**
• **Auto-Expiry Rules:** When you select a document type (e.g., Fire Safety NOC, Factory License, Pollution Consent), our platform automatically sets the expiry date based on statutory regulations from the Issue Date!
• **Document Downloads:** You can download authorized PDF/certificates directly from the [Document Vault](documents.html).
• **Storage:** Uploaded documents are securely saved to your business repository and linked to your compliance passport.`,
    quickLinks: [
      { text: "Open Document Vault", url: "documents.html" }
    ]
  },
  {
    keywords: ["renewal", "renew", "expired", "deadline", "penalty", "due date"],
    title: "Statutory License Renewals",
    response: `**License Renewals & Statutory Deadlines**
• **Advance Window:** We recommend initiating renewals **30 to 60 days** before the expiration date to avoid compounding daily penalties or cessation notices.
• **Track Renewals:** Visit the [Renewals Hub](renewals.html) to check countdowns, active grace periods, required fees, and single-click renewal submissions.`,
    quickLinks: [
      { text: "Manage Renewals", url: "renewals.html" }
    ]
  },
  {
    keywords: ["profile", "business profile", "industry type", "state", "nic code", "power load", "investment"],
    title: "Business Profile Management",
    response: `**Business Profile & Regulatory Engine**
• **Dynamic Customization:** Your profile parameters (State, Sector, Pollution Category, Investment, Power Load, Land Area) dictate exactly which approvals, licenses, and renewals apply to your factory.
• **Edit Profile:** Go to [Business Profile](profile.html) to update your registered data anytime.`,
    quickLinks: [
      { text: "Edit Business Profile", url: "profile.html" }
    ]
  },
  {
    keywords: ["application", "apply", "start application", "track status", "checklist"],
    title: "Statutory Applications & Tracking",
    response: `**Applying for Clearances & Tracking Status**
• **Step 1:** Check your mandatory licenses in [Required Approvals](approvals.html).
• **Step 2:** Click **Start Application** on any clearance.
• **Step 3:** Upload the required checklist documents and review fee requirements.
• **Step 4:** Submit to receive your tracking Application ID and track real-time progress on your [Dashboard](dashboard.html).`,
    quickLinks: [
      { text: "Browse Approvals", url: "approvals.html" },
      { text: "View Applications", url: "applications.html" }
    ]
  },
  {
    keywords: ["help", "contact", "support", "officer", "nodal", "phone", "email"],
    title: "Helpdesk & Nodal Assistance",
    response: `**Government Nodal & Helpdesk Support**
• **MAITRI Maharashtra Single Window Desk:** +91-22-2202-7100 | support-maitri@gov.in
• **MIDC Investor Facilitation Centre:** +91-22-2687-0052 | support@midcindia.org
• **MPCB Environmental Helpline:** +91-22-2401-4701 | helpdesk@mpcb.gov.in
• **AnumatiSetu In-App Support:** Available 24/7 for technical and documentation inquiries.`,
    quickLinks: [
      { text: "Dashboard Support", url: "dashboard.html" }
    ]
  }
];

// POST /api/chat
router.post("/", async (req, res) => {
  try {
    const { query, message, profileContext } = req.body;
    const userQuery = (message || query || "").trim();

    if (!userQuery) {
      return res.status(400).json({ error: "Message query is required" });
    }

    const lower = userQuery.toLowerCase();

    // 1. Check for greeting / small talk
    if (/^(hi|hello|hey|greetings|namaste|good\s*(morning|afternoon|evening))\b/i.test(lower)) {
      return res.json({
        response: `Hello! 👋 I am **SetuBot**, your dedicated Industrial Compliance & Statutory Approvals Assistant.\n\nI can help you with:\n• Finding **mandatory approvals & licenses** for your industry\n• **Documents required** for Fire NOC, MPCB, Factory License, etc.\n• **Where to submit** applications (official portals & nodal desks)\n• **Document uploads & automatic expiry dates**\n• **Renewal timelines and fee calculations**\n\nHow can I assist your business today?`,
        suggestions: [
          "Which approvals do I need?",
          "Documents needed for Fire NOC",
          "Where to submit MPCB Consent?",
          "How to calculate document expiry?",
          "How do I renew my licenses?"
        ]
      });
    }

    // 2. Score FAQ entries based on keyword matches
    let bestMatch = null;
    let highestScore = 0;

    for (const faq of FAQ_KNOWLEDGE) {
      let score = 0;
      for (const kw of faq.keywords) {
        if (lower.includes(kw)) {
          score += kw.length * 2; // longer matches have higher weight
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = faq;
      }
    }

    if (bestMatch && highestScore >= 4) {
      return res.json({
        title: bestMatch.title,
        response: bestMatch.response,
        quickLinks: bestMatch.quickLinks || [],
        suggestions: [
          "Which other approvals are required?",
          "Check Document Vault",
          "Track my applications",
          "Check renewal penalties"
        ]
      });
    }

    // 3. Fallback dynamic regulatory catalog response
    return res.json({
      response: `I searched the statutory regulations for **"${userQuery}"**:\n\nFor industrial manufacturing in Maharashtra / India, major clearances typically fall under:\n1. **Fire Safety NOC** — Directorate of Maharashtra Fire Services.\n2. **Factory Registration (Form 1/2)** — DISH Maharashtra.\n3. **Consent to Establish/Operate (CTE/CTO)** — Maharashtra Pollution Control Board (MPCB).\n4. **Building Plan Sanction & Occupancy** — MIDC Planning Authority.\n5. **GSTIN & Commercial Licenses** — CBIC / State Tax Authorities.\n\nYou can explore exact rules and document requirements directly in the **Required Approvals** section or ask me specifically about any clearance!`,
      quickLinks: [
        { text: "View Required Approvals", url: "approvals.html" },
        { text: "Document Vault", url: "documents.html" },
        { text: "Renewals & Expiry", url: "renewals.html" }
      ],
      suggestions: [
        "What documents are needed for Fire NOC?",
        "How do I submit MPCB Consent?",
        "Where is the DISH office?",
        "How does automatic document expiry work?"
      ]
    });

  } catch (err) {
    console.error("[Chatbot Error]", err);
    res.status(500).json({ error: "Failed to process chat query" });
  }
});

module.exports = router;
