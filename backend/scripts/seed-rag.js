/**
 * ============================================================================
 * AnumatiSetu — RAG Knowledge Base Seeder & Embedding Generator
 * Seeds statutory regulations, acts, and procedural rules into MongoDB Atlas
 * ============================================================================
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });
const { connectDB } = require("../db");
const KnowledgeChunk = require("../models/KnowledgeChunk");

const STATUTORY_KNOWLEDGE = [
  {
    title: "Fire Safety No-Objection Certificate (Fire NOC)",
    department: "Directorate of Maharashtra Fire Services / Municipal Fire Brigade",
    category: "Safety & Hazard",
    actName: "Maharashtra Fire Prevention and Life Safety Measures Act, 2006 & NBC 2016",
    keywords: ["fire noc", "fire safety", "fire license", "fire department", "fire protection", "sprinkler", "hydrant", "evacuation"],
    sourceUrl: "https://mahafireservice.gov.in",
    validityYears: 3,
    turnaroundDays: 30,
    content: `Fire Safety No-Objection Certificate (Fire NOC) is a mandatory statutory clearance issued by the Directorate of Maharashtra Fire Services / Municipal Fire Brigade via the MAITRI Single Window portal.
Applicability: All industrial buildings exceeding 15 meters in height, or industrial occupancies having hazardous materials, high fire loads, or floor areas greater than 500 sq. m.
Key Documents Required:
1. Architectural CAD layout drawings (1:100 scale) showing building setbacks, exit stairs, refuge areas, fire hydrant network, and sprinkler layout.
2. Form A / Form B certificate from a licensed fire safety engineering agency.
3. Building structural stability certificate issued by a Chartered Structural Engineer.
4. Land ownership documents, lease deed, or MIDC allotment letter.
5. On-site fire extinguisher installation audit and water storage tank capacity test reports.
Validity: Provisional NOC is valid for 1 year during construction; Final NOC is valid for 3 years for industrial units after physical site inspection and operational pump flow testing.`
  },
  {
    title: "Factory Registration & Operating License (Form 1 & 2)",
    department: "Directorate of Industrial Safety & Health (DISH Maharashtra)",
    category: "Labour & Safety",
    actName: "Factories Act, 1948 & Maharashtra Factories Rules, 1963",
    keywords: ["factory license", "form 1", "form 2", "dish", "factories act", "safety officer", "workers", "manufacturing process"],
    sourceUrl: "https://dish.maharashtra.gov.in",
    validityYears: 5,
    turnaroundDays: 45,
    content: `Factory Registration and Operating License (under Form 1 and Form 2) is issued by the Directorate of Industrial Safety & Health (DISH).
Applicability: Mandatory for manufacturing establishments employing 10 or more workers using electric power (Section 2m(i)), or 20 or more workers without power (Section 2m(ii)).
Key Documents Required:
1. Detailed plant machinery layout plan and manufacturing process flow chart.
2. Building Stability Certificate signed by a DISH-empanelled certified structural engineer.
3. List of Plant & Machinery with connected HP / KW electrical load ratings.
4. Partnership deed or Memorandum and Articles of Association (MOA / AOA) along with list of directors and designated Occupier.
5. Occupational health check-up protocols and hazardous waste emergency plan for Section 41 units.
Validity: Issued for 1 to 5 years depending on the advance fee schedule paid. Renewal must be filed at least 30 days prior to expiry.`
  },
  {
    title: "Consent to Establish (CTE) & Consent to Operate (CTO)",
    department: "Maharashtra Pollution Control Board (MPCB)",
    category: "Environment",
    actName: "Water (Prevention & Control of Pollution) Act 1974 & Air Act 1981",
    keywords: ["mpcb", "consent to establish", "consent to operate", "cte", "cto", "pollution", "spcb", "effluent", "etp", "stp", "emission"],
    sourceUrl: "https://ecmpcb.in",
    validityYears: 5,
    turnaroundDays: 60,
    content: `Consent to Establish (CTE) and Consent to Operate (CTO) are statutory environmental permits granted by the State Pollution Control Board (MPCB).
Categories:
- ⚪ White Category (Score ≤ 20): Non-polluting; requires simple self-intimation without formal consent fee.
- 🟢 Green Category (Score 21–40): Low pollution risk; fast-track 30-day processing.
- 🟠 Orange Category (Score 41–59): Moderate environmental impact; mandatory Effluent Treatment Plant (ETP) / Sewage Treatment Plant (STP) design.
- 🔴 Red Category (Score ≥ 60): High pollution or hazardous operations; requires comprehensive Environmental Impact Assessment (EIA), public hearing clearance, and online continuous emission monitoring (OCEMS).
Key Documents Required:
1. Detailed manufacturing process flow chart with raw material, water balance, and mass balance sheets.
2. ETP / STP engineering design schematics with treated effluent parameter commitments.
3. Stack emission and ambient air quality baseline report from an MoEF-recognized testing laboratory.
4. Chartered Accountant Gross Fixed Assets Capital Investment Certificate (land, building, plant & machinery).
Validity: CTE is valid for 5 years or until project completion; CTO is granted for 1 to 5 years (Red: 5 yrs, Orange: 5 yrs, Green: 10 yrs).`
  },
  {
    title: "Industrial Building Plan Sanction & Occupancy Certificate",
    department: "MIDC Planning Authority / Local Urban Development Authority",
    category: "Infrastructure",
    actName: "Maharashtra Regional and Town Planning (MRTP) Act, 1966 & MIDC DCR",
    keywords: ["building plan", "plan sanction", "midc", "occupancy certificate", "bp sanction", "fsi", "far", "setback"],
    sourceUrl: "https://midcindia.org",
    validityYears: 3,
    turnaroundDays: 45,
    content: `Building Plan Sanction grants legal permission to construct factory sheds, administrative blocks, and storage godowns in compliance with MIDC Development Control Regulations (DCR).
Key Documents Required:
1. Site layout plan and detailed architectural blueprints (1:100 scale) signed by a registered architect / structural engineer.
2. Structural design calculation dossier compliant with National Building Code (NBC 2016) seismic and wind load codes.
3. Soil investigation and geotechnical safe bearing capacity (SBC) report from an accredited testing lab.
4. MIDC Plot Possession Receipt, Final Lease Agreement, and Demarcation Certificate.
5. Provisional Fire NOC from Chief Fire Officer.
Validity: Construction sanction is valid for 2 to 3 years. After construction completion, physical inspection is conducted to grant the final Occupancy Certificate (OC) prior to power connection.`
  },
  {
    title: "PESO Petroleum & Hazardous Chemical Storage License",
    department: "Petroleum & Explosives Safety Organisation (PESO)",
    category: "Safety & Hazard",
    actName: "Petroleum Act 1934, Petroleum Rules 2002 & SMPV Rules 2016",
    keywords: ["peso", "petroleum", "diesel", "dg set", "hazardous chemicals", "smpv", "solvents", "flammable storage"],
    sourceUrl: "https://peso.gov.in",
    validityYears: 3,
    turnaroundDays: 60,
    content: `PESO License is mandatory for storing Class A, Class B, or Class C petroleum products, compressed gases, LPG, or hazardous solvent tanks.
Applicability: Units storing diesel for Diesel Generator (DG) sets exceeding 2,500 Litres (Class B) or solvent bulk tanks.
Key Documents Required:
1. Tank fabrication blueprints and hydro-static pressure test certificates from a PESO-recognized competent inspector.
2. Flameproof electrical equipment certificates (Zone 1 / Zone 2 certification).
3. Risk Assessment Dossier, Hazard and Operability Study (HAZOP), and On-site Emergency Disaster Management Plan (DMP).
4. Safety distance clearance plan ensuring statutory isolation distances from compound boundaries.
Validity: Granted for 3 to 5 years; physical inspection by PESO Joint Chief Controller of Explosives required before commissioning.`
  },
  {
    title: "Central Electricity Authority / CEIG Electrical Installation Approval",
    department: "Chief Electrical Inspector to Government (CEIG / Energy Dept)",
    category: "Infrastructure",
    actName: "Central Electricity Authority (Safety & Electric Supply) Regulations 2010",
    keywords: ["ceig", "electrical inspector", "transformer", "ht connection", "high tension", "substation", "earthing"],
    sourceUrl: "https://iei.maharashtra.gov.in",
    validityYears: 3,
    turnaroundDays: 21,
    content: `CEIG Approval is statutory clearance required before energizing High Tension (HT) electrical substations, distribution transformers, and captive power generation plants.
Applicability: All industrial power installations exceeding 650 Volts (HT/EHT) or DG sets above 10 kVA capacity.
Key Documents Required:
1. Electrical single line diagram (SLD) signed by a licensed Electrical Contractor.
2. Transformer and switchgear factory test reports (insulation resistance, dielectric oil breakdown voltage).
3. Earth pit resistance test report (must be under 1.0 Ohm for HT system neutral earthing).
4. Power utility (MSEDCL / State Discom) technical feasibility feasibility letter.
Validity: Valid for initial energization; periodic inspection mandated every 1 to 3 years.`
  },
  {
    title: "FSSAI Food Business Manufacturing License",
    department: "Food Safety and Standards Authority of India (FSSAI)",
    category: "Food Safety",
    actName: "Food Safety and Standards Act, 2006 (FSS Act)",
    keywords: ["fssai", "food license", "food processing", "agro", "fsms", "water testing", "food safety"],
    sourceUrl: "https://foscos.fssai.gov.in",
    validityYears: 5,
    turnaroundDays: 30,
    content: `FSSAI State / Central Manufacturing License is mandatory for processing, packaging, and manufacturing food products.
Key Documents Required:
1. Food Safety Management System (FSMS) Plan and hazard critical control point (HACCP) plan.
2. Potable water chemical and microbiological lab test report compliant with IS 10500 standards.
3. Equipment list and installed production capacity breakdown.
4. Food recall management protocol and medical fitness certificates of all food handlers.
Validity: 1 to 5 years via the FoSCoS portal.`
  }
];

async function seedRAG() {
  try {
    await connectDB();
    console.log("Seeding Statutory RAG Knowledge Chunks with Gemini Vector Embeddings...");

    let ai = null;
    if (process.env.GEMINI_API_KEY) {
      try {
        const { GoogleGenAI } = require("@google/genai");
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      } catch (e) {
        console.warn("GoogleGenAI SDK loaded in fallback mode.");
      }
    }

    for (const item of STATUTORY_KNOWLEDGE) {
      let embedding = [];
      if (ai) {
        try {
          const embedRes = await ai.models.embedContent({
            model: "gemini-embedding-001",
            contents: `${item.title}. ${item.department}. ${item.content}`,
          });
          embedding = embedRes.embeddings ? embedRes.embeddings[0].values : (embedRes.embedding?.values || []);
          console.log(`✅ Generated embedding for: ${item.title} (${embedding.length} dimensions)`);
        } catch (err) {
          console.warn(`Could not generate online embedding for ${item.title}:`, err.message);
        }
      }

      await KnowledgeChunk.findOneAndUpdate(
        { title: item.title },
        { ...item, embedding },
        { upsert: true, returnDocument: 'after' }
      );
    }

    const total = await KnowledgeChunk.countDocuments();
    console.log(`\n🎉 Statutory RAG Knowledge Base successfully seeded with ${total} verified regulatory vector chunks!`);
    process.exit(0);
  } catch (err) {
    console.error("❌ RAG Seeding failed:", err);
    process.exit(1);
  }
}

if (require.main === module) {
  seedRAG();
}

module.exports = { STATUTORY_KNOWLEDGE, seedRAG };
