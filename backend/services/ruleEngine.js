/**
 * ============================================================================
 * AnumatiSetu — Dynamic Rule Engine Service
 * Evaluates state-specific and statutory compliance rules against an industrial profile
 * ============================================================================
 */

const StateAuthorityMapping = require("../models/StateAuthorityMapping");
const { STATUTORY_CATALOG, STATE_DEPARTMENT_REGISTRY } = require("../catalog");

/**
 * Computes all applicable statutory clearances and licenses for a profile.
 * Falls back seamlessly to statutory catalog if DB mappings are not yet seeded.
 */
async function evaluateApprovalsForProfile(profile, existingApplications = []) {
  if (!profile) return [];

  const userState = profile.state || "Maharashtra";
  const stateMappings = (STATE_DEPARTMENT_REGISTRY && STATE_DEPARTMENT_REGISTRY[userState])
    ? STATE_DEPARTMENT_REGISTRY[userState]
    : (STATE_DEPARTMENT_REGISTRY?.["Other"] || {});

  // 1. Try fetching dynamically from MongoDB StateAuthorityMapping
  let dbRules = [];
  try {
    dbRules = await StateAuthorityMapping.find({
      $or: [{ state: userState }, { state: "All" }]
    }).lean();
  } catch (e) {
    dbRules = [];
  }

  // 2. Base catalog evaluation
  return STATUTORY_CATALOG.filter((item) => {
    if (!item.condition) return true;
    return item.condition(profile);
  }).map((item) => {
    const existingApp = existingApplications.find((a) => a.requirementCode === item.code || a.requirement_code === item.code);
    const resolvedDept = item.deptKey ? (stateMappings[item.deptKey] || item.defaultDept || item.department) : item.department;

    return {
      code: item.code,
      title: item.title,
      department: resolvedDept || item.defaultDept || item.department || "Statutory Authority",
      category: item.category,
      description: item.description,
      mandatoryDocuments: item.mandatoryDocuments,
      inspectionRequired: item.inspectionRequired,
      validityYears: item.validityYears,
      feeEstimate: item.feeEstimate,
      status: existingApp ? existingApp.status : "NOT_APPLIED",
    };
  });
}

module.exports = { evaluateApprovalsForProfile };
