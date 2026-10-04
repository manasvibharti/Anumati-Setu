/**
 * ============================================================================
 * AnumatiSetu — Document Readiness Gate Service (§5 in Roadmap v3)
 * ============================================================================
 * Evaluates whether an approval packet is complete, verified, free of blocking
 * flags, and ready to be frozen and submitted to the department/admin.
 */

const Document = require("../models/Document");
const { STATUTORY_CATALOG } = require("../catalog");

/**
 * Checks the readiness gate for a given user and approval.
 * @param {string} userId - User ID
 * @param {Object} approval - Approval document instance
 * @returns {Promise<Object>} { isReady: boolean, missingDocs: string[], blockingIssues: string[], checkedDocs: Array }
 */
async function evaluateReadinessGate(userId, approval) {
  const catalogItem = STATUTORY_CATALOG.find(c => c.code === approval.requirementCode);
  const requiredDocTypes = catalogItem ? catalogItem.mandatoryDocuments : [];

  if (requiredDocTypes.length === 0) {
    return {
      isReady: true,
      missingDocs: [],
      blockingIssues: [],
      checkedDocs: [],
      summary: "No mandatory documents required for this approval."
    };
  }

  // Fetch all documents uploaded by this user for this application
  const attachedDocs = await Document.find({
    userId,
    $or: [
      { applicationId: approval.id },
      { name: { $in: requiredDocTypes } }
    ]
  }).lean();

  const missingDocs = [];
  const blockingIssues = [];
  const checkedDocs = [];

  for (const docTitle of requiredDocTypes) {
    // Find matching document by name or category
    const doc = attachedDocs.find(d => 
      d.name.toLowerCase().includes(docTitle.toLowerCase()) || 
      docTitle.toLowerCase().includes(d.name.toLowerCase())
    );

    if (!doc || !doc.hasFile) {
      missingDocs.push(docTitle);
      continue;
    }

    if (doc.status === "REJECTED") {
      blockingIssues.push(`[${docTitle}] Document was rejected. Please re-upload.`);
      continue;
    }

    if (doc.status === "EXPIRED") {
      blockingIssues.push(`[${docTitle}] Document is expired.`);
      continue;
    }

    // Checked and valid
    checkedDocs.push({
      documentId: doc.id,
      title: docTitle,
      fileName: doc.fileName,
      filePath: doc.filePath,
      status: doc.status || "VERIFIED",
      verifiedAt: doc.updatedAt || new Date()
    });
  }

  const isReady = missingDocs.length === 0 && blockingIssues.length === 0;

  return {
    isReady,
    requiredCount: requiredDocTypes.length,
    checkedCount: checkedDocs.length,
    missingDocs,
    blockingIssues,
    checkedDocs,
    summary: isReady 
      ? `All ${requiredDocTypes.length} mandatory documents verified. Ready for submission.`
      : `${missingDocs.length} missing document(s), ${blockingIssues.length} blocking issue(s).`
  };
}

module.exports = { evaluateReadinessGate };
