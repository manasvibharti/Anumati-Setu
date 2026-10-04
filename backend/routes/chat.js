/**
 * ============================================================================
 * AnumatiSetu — RAG Chatbot API Route (Google Gemini + Vector Search)
 * Grounded Regulatory, Clearance, and Statutory Compliance Intelligence
 * ============================================================================
 */

const express = require("express");
const router = express.Router();
const KnowledgeChunk = require("../models/KnowledgeChunk");

// Helper: Cosine Similarity between two numeric vectors
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0 || vecA.length !== vecB.length) return 0;
  let dotProduct = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ----------------------------------------------------------------------------
// POST /api/chat/query (RAG Grounded Chat with Gemini)
// ----------------------------------------------------------------------------
router.post("/query", async (req, res) => {
  try {
    const { query, history = [], userProfile = {} } = req.body;
    if (!query || typeof query !== "string" || !query.trim()) {
      return res.status(400).json({ error: "Query is required" });
    }

    const cleanQuery = query.trim();
    const apiKey = process.env.GEMINI_API_KEY;

    let aiClient = null;
    if (apiKey && apiKey.length > 15 && !apiKey.includes("your_gemini")) {
      try {
        const { GoogleGenAI } = require("@google/genai");
        aiClient = new GoogleGenAI({ apiKey });
      } catch (e) {
        console.warn("Could not instantiate GoogleGenAI SDK:", e.message);
      }
    }

    // Step 1: Retrieve all Knowledge Chunks from MongoDB Atlas
    const allChunks = await KnowledgeChunk.find({}).lean();

    let matchedChunks = [];

    // Step 2: Vector Search via Embeddings (if Gemini Key is available)
    if (aiClient) {
      try {
        const embedRes = await aiClient.models.embedContent({
          model: "gemini-embedding-001",
          contents: cleanQuery,
        });
        const queryVector = embedRes.embeddings ? embedRes.embeddings[0].values : (embedRes.embedding?.values || []);

        if (queryVector && queryVector.length > 0) {
          const scored = allChunks.map(chunk => ({
            ...chunk,
            similarity: chunk.embedding && chunk.embedding.length === queryVector.length
              ? cosineSimilarity(queryVector, chunk.embedding)
              : 0
          }));

          scored.sort((a, b) => b.similarity - a.similarity);
          matchedChunks = scored.slice(0, 3).filter(c => c.similarity > 0.35);
        }
      } catch (embedErr) {
        console.warn("Embedding search failed, using lexical relevance fallback:", embedErr.message);
      }
    }

    // Fallback: Lexical / Keyword Scoring if vector matches are insufficient
    if (matchedChunks.length === 0 && allChunks.length > 0) {
      const qLower = cleanQuery.toLowerCase();
      const scored = allChunks.map(chunk => {
        let score = 0;
        const titleLower = chunk.title.toLowerCase();
        const contentLower = chunk.content.toLowerCase();
        
        if (chunk.keywords && chunk.keywords.some(k => qLower.includes(k.toLowerCase()))) score += 10;
        if (qLower.split(" ").some(word => word.length > 3 && titleLower.includes(word))) score += 5;
        if (qLower.split(" ").some(word => word.length > 3 && contentLower.includes(word))) score += 2;
        return { ...chunk, score };
      });

      scored.sort((a, b) => b.score - a.score);
      matchedChunks = scored.slice(0, 3).filter(c => c.score > 0);
    }

    // If still no direct match, take top 2 default statutory references
    if (matchedChunks.length === 0 && allChunks.length > 0) {
      matchedChunks = allChunks.slice(0, 2);
    }

    // Step 3: Generate Grounded Answer using Gemini with Multi-Model Fallback Cascade
    if (aiClient) {
      const candidateModels = [
        "gemini-2.5-flash-lite",
        "gemini-3-flash-preview",
        "gemini-flash-latest",
        "gemini-2.5-pro"
      ];

      const contextStr = matchedChunks.length > 0 ? matchedChunks.map((c, i) => `
[Statutory Clause ${i + 1}: ${c.title}]
• Issuing Department: ${c.department}
• Act / Law: ${c.actName || 'General Statutory Code'}
• Official Portal: ${c.sourceUrl}
• Validity: ${c.validityYears} Year(s) | Estimated Turnaround: ${c.turnaroundDays} Days
• Statutory Details:
${c.content}
`).join("\n\n") : "No specific statutory clause matched directly.";

      const profileContext = userProfile.industryType
        ? `User Workspace Context: State = ${userProfile.state || 'Maharashtra'}, Industry = ${userProfile.industryType}, Scale = ${userProfile.businessCategory || 'MSME'}.`
        : `User Workspace Context: General Indian Industrial Jurisdiction.`;

      const systemPrompt = `
You are SetuBot, the premier AI Regulatory, Factory Compliance & Statutory Clearance Intelligence Assistant for AnumatiSetu (India's Industrial Governance Platform).

Your mission:
1. Answer the user's question directly, accurately, step-by-step, and authoritatively.
2. If the user asks about inspections, audits, officer visits, or statutory reviews (e.g. Factory Inspector / DISH, Pollution Control Board / MPCB, Fire Department, Labour Officer, CEIG Electrical):
   - Provide a clear, actionable **Inspection Preparedness Checklist**.
   - Detail what documents/registers must be physically ready (Form 1, 2, Muster Roll, Environmental Logs, Fire NOC copy, Calibration/Test certificates).
   - Detail how the on-site team should coordinate (verification of Officer ID/Notice, accompanying the inspector, noting remarks in Inspection Book, receiving Form 7/Show-Cause/Inspection Report).
   - Outline the post-inspection compliance timeline (submitting compliance response within 15-30 days).
3. If the user asks about specific clearances (Fire NOC, Factory License, MPCB Consent to Operate, Building Plan, PESO, CEIG), ground your answers in the Ground Truth clauses provided below and structure with:
   - **Clearance Overview & Statutory Applicability**
   - **Issuing Authority & Portal**
   - **Key Mandatory Documents Required**
   - **Validity & Turnaround Time**
4. Always maintain a helpful, professional, and clear tone using Markdown formatting with bold headers and bullet points.

--- GROUND TRUTH STATUTORY CLAUSES ---
${contextStr}

--- USER CONTEXT ---
${profileContext}
`;

      const formattedHistory = [
        ...history.slice(-4).map(h => ({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        })),
        { role: "user", parts: [{ text: cleanQuery }] }
      ];

      for (const modelName of candidateModels) {
        try {
          const response = await aiClient.models.generateContent({
            model: modelName,
            contents: formattedHistory,
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.3,
            }
          });

          if (response && response.text) {
            const citations = matchedChunks.map(c => ({
              title: c.title,
              department: c.department,
              url: c.sourceUrl
            }));

            const quickLinks = matchedChunks.slice(0, 2).map(c => ({
              text: `View ${c.title.split('(')[0].trim()}`,
              url: "approvals.html"
            }));

            return res.json({
              reply: response.text,
              citations,
              quickLinks,
              source: `gemini-rag (${modelName})`
            });
          }
        } catch (modelErr) {
          console.warn(`Model ${modelName} failed, attempting next candidate...`, modelErr.message);
        }
      }
    }

    // Step 4: Intelligent Fallback if all AI models are unreachable
    const isInspectionQuery = /inspect|audit|officer|visit|check|notice|penalty|fine/i.test(cleanQuery);
    if (isInspectionQuery) {
      return res.json({
        reply: `### 📋 Statutory Factory & Site Inspection Guidelines

When a regulatory officer (such as **Factory Inspector (DISH)**, **MPCB Environmental Officer**, or **Fire Safety Inspector**) visits your premises:

1. **Immediate Verification & Reception**:
   - Request and verify the officer's official Government ID card and Inspection Notice/Order.
   - Escort the officer to the conference room and assign your Plant Manager or Safety Compliance Officer to accompany them throughout.

2. **Mandatory Documents & Registers to Keep Ready**:
   - **Statutory Approvals File**: Display valid copies of Factory License, MPCB Consent to Operate (CTO), Fire NOC, and Building Sanction Plan.
   - **Statutory Registers**: Factory Inspection Book, Master Attendance/Muster Roll, Accident Register (Form 24), and Form 15 (Register of Leave with Wages).
   - **Safety & Equipment Records**: Electrical Earth Pit & CEIG reports, Pressure Vessel hydrostatic test certificates, and hazardous waste disposal manifests (Form 10).

3. **During the Site Walkthrough**:
   - Ensure all workers in operational zones are wearing mandated PPE (helmets, goggles, safety footwear).
   - Ensure fire hydrants, extinguishers, and emergency exits are unobstructed.

4. **Post-Inspection Procedure**:
   - Request the inspector to record observations in the official **Factory Inspection Book**.
   - If any notice or observation list is issued, file your formal **Action Taken Report (ATR) / Compliance Reply** within the stipulated timeframe (typically 15 to 30 days) via the department's online portal.`,
        citations: [
          { title: "Directorate of Industrial Safety & Health (DISH)", department: "Labour & Safety Dept", url: "https://dish.maharashtra.gov.in" },
          { title: "Maharashtra Pollution Control Board (MPCB)", department: "Environment Dept", url: "https://mpcb.gov.in" }
        ],
        quickLinks: [
          { text: "View Required Approvals", url: "approvals.html" },
          { text: "Statutory Document Vault", url: "documents.html" }
        ],
        source: "statutory-inspection-protocol"
      });
    }

    // Standard static clause fallback if needed
    const bestMatch = matchedChunks[0];
    if (bestMatch) {
      const fallbackReply = `**${bestMatch.title}**\n\n• **Issuing Authority:** ${bestMatch.department}\n• **Governing Act:** ${bestMatch.actName}\n• **Official Portal:** [${bestMatch.sourceUrl}](${bestMatch.sourceUrl})\n• **Turnaround Time:** ~${bestMatch.turnaroundDays} working days\n\n**Key Requirements & Procedure:**\n${bestMatch.content}`;

      return res.json({
        reply: fallbackReply,
        citations: [{ title: bestMatch.title, department: bestMatch.department, url: bestMatch.sourceUrl }],
        quickLinks: [
          { text: "View Required Approvals", url: "approvals.html" },
          { text: "Official Portal", url: bestMatch.sourceUrl, external: true }
        ],
        source: "atlas-knowledge-fallback"
      });
    }

    return res.json({
      reply: `I can help you with all Indian industrial statutory clearances including **Fire NOC**, **Factory Operating License**, **MPCB Consent to Establish/Operate (CTE/CTO)**, **Building Plan Sanction**, and **PESO Chemical Storage**.\n\nPlease specify which approval or industrial sector you would like guidance on!`,
      citations: [],
      quickLinks: [
        { text: "Required Approvals Hub", url: "approvals.html" },
        { text: "Document Vault", url: "documents.html" }
      ],
      source: "generic-assistant"
    });

  } catch (err) {
    console.error("Chatbot query error:", err);
    res.status(500).json({ error: "Failed to process chat query" });
  }
});

module.exports = router;

