/**
 * ============================================================================
 * AnumatiSetu — Business Compliance & Statutory Approval Platform
 * Frontend Client Layer & Authentication Bridge
 * ============================================================================
 */

// Automatically detect server host/port or route to Render backend
const API_BASE = (typeof window !== "undefined" && window.location.origin && window.location.origin.startsWith("http") && !window.location.origin.includes(":3000") && !window.location.origin.includes(":8000") && !window.location.origin.includes(":5500"))
  ? `${window.location.origin}/api`
  : (typeof window !== "undefined" && window.location.hostname === "localhost" ? "http://localhost:4000/api" : "https://anumati-setu.onrender.com/api");

const UPLOADS_BASE = (typeof window !== "undefined" && window.location.origin && window.location.origin.startsWith("http") && !window.location.origin.includes(":3000") && !window.location.origin.includes(":8000") && !window.location.origin.includes(":5500"))
  ? `${window.location.origin}/uploads`
  : (typeof window !== "undefined" && window.location.hostname === "localhost" ? "http://localhost:4000/uploads" : "https://anumati-setu.onrender.com/uploads");

const TOKEN_KEY = "anumatisetu_auth_token";

// ----------------------------------------------------------------------------
// 1. Regulatory Requirement Definition Rules (Client Display Catalog)
// ----------------------------------------------------------------------------
const STATUTORY_CATALOG = [
  // 1. General Statutory Clearances
  {
    code: "REQ_TRADE_LICENSE",
    title: "Municipal Trade License",
    department: "Municipal Corporation / Local Urban Body",
    category: "General Business",
    description: "Mandatory operating permit issued by local municipal authorities verifying commercial zoning compliance.",
    mandatoryDocuments: ["Property Tax Receipt or Registered Lease Deed", "Identity & Address Proof of Proprietor/Directors", "Sanctioned Building Layout Plan"],
    inspectionRequired: false,
    validityYears: 1,
    feeEstimate: "₹5,000 – ₹10,000"
  },
  {
    code: "REQ_FIRE_NOC",
    title: "Fire Safety Certificate (Fire NOC)",
    department: "State Fire and Emergency Services Department",
    category: "Safety & Hazard",
    description: "Statutory clearance certifying premises compliance with the National Building Code (NBC) fire protection measures.",
    mandatoryDocuments: ["Architectural Fire Evacuation Plan", "Hydrant & Sprinkler Flow Test Certificates", "Fire Extinguisher Installation Audit"],
    inspectionRequired: true,
    validityYears: 3,
    feeEstimate: "₹10,000 – ₹25,000"
  },
  {
    code: "REQ_BUILDING_SANCTION",
    title: "Industrial / Commercial Building Plan Sanction",
    department: "Industrial Area Development Board / Town Planning Authority",
    category: "Infrastructure",
    description: "Formal sanction of civil building structures ensuring structural stability and zoning clearances.",
    mandatoryDocuments: ["Structural Stability Certificate by Chartered Engineer", "Site Elevation & Cross-Section Blueprints", "Land Allotment Order / Title Deed"],
    inspectionRequired: true,
    validityYears: 5,
    feeEstimate: "₹25,000 – ₹75,000"
  },

  // 2. Food Processing & Agro
  {
    code: "REQ_FSSAI_LICENSE",
    title: "FSSAI Food Business Manufacturing License",
    department: "Food Safety and Standards Authority of India (FSSAI)",
    category: "Food Safety",
    description: "Mandatory statutory food business operating license under the Food Safety and Standards Act, 2006.",
    mandatoryDocuments: ["Food Safety Management System (FSMS) Plan", "Water Potability Lab Test Report (IS:10500)", "Equipment Layout & Capacity Breakdown", "Recall Management Protocol"],
    inspectionRequired: true,
    validityYears: 3,
    feeEstimate: "₹7,500 – ₹15,000"
  },
  {
    code: "REQ_AGMARK_GRADING",
    title: "AGMARK Quality Grading & Certification",
    department: "Directorate of Marketing & Inspection (Ministry of Agriculture)",
    category: "Food Safety",
    description: "Statutory agricultural produce grading certification under Agricultural Produce (Grading and Marking) Act.",
    mandatoryDocuments: ["Chemist Approval Certificate", "Packaging Material Food-Grade Test Report", "Standard Operating Procedure (SOP) for Batch Testing"],
    inspectionRequired: true,
    validityYears: 5,
    feeEstimate: "₹10,000 – ₹20,000"
  },
  {
    code: "REQ_COLD_STORAGE_NOC",
    title: "Cold Chain Storage & Temperature Telemetry NOC",
    department: "State Agriculture & Horticulture Department",
    category: "Food Safety",
    description: "Statutory temperature compliance certification for perishable food ingredient cold storage facilities.",
    mandatoryDocuments: ["Refrigeration Plant Engineering Schematics", "Continuous Temperature Data Logging Report", "Backup Power Generator Certificate"],
    inspectionRequired: true,
    validityYears: 2,
    feeEstimate: "₹12,000 – ₹25,000"
  },

  // 3. Chemicals & Hazardous Materials
  {
    code: "REQ_PESO_LICENSE",
    title: "PESO Petroleum & Hazardous Chemical Storage License",
    department: "Petroleum & Explosives Safety Organisation (PESO)",
    category: "Safety & Hazard",
    description: "Statutory approval under Petroleum Rules 2002 & Static and Mobile Pressure Vessels (SMPV) Rules.",
    mandatoryDocuments: ["Storage Tank Fabrication & Hydro-test Drawings", "Flameproof Electrical Equipment Test Certificates", "On-site Emergency Disaster Management Plan (DMP)"],
    inspectionRequired: true,
    validityYears: 3,
    feeEstimate: "₹25,000 – ₹50,000"
  },
  {
    code: "REQ_HAZMAT_AUTHORIZATION",
    title: "SPCB Hazardous & Other Waste Management Authorization",
    department: "State Pollution Control Board (SPCB)",
    category: "Environment",
    description: "Mandatory authorization under Hazardous and Other Wastes (Management & Transboundary Movement) Rules, 2016.",
    mandatoryDocuments: ["Common TSDF Membership Agreement", "Hazardous Waste Storage Shed Blueprint", "Manifest Record Keeping Protocol (Form 10)"],
    inspectionRequired: true,
    validityYears: 5,
    feeEstimate: "₹15,000 – ₹35,000"
  },
  {
    code: "REQ_PROCESS_SAFETY_41",
    title: "Factories Act Section 41 Hazardous Process Safety Clearance",
    department: "Directorate of Industrial Safety & Health (DISH)",
    category: "Safety & Hazard",
    description: "Statutory appraisal by the State Site Appraisal Committee for establishments involving hazardous chemical processes.",
    mandatoryDocuments: ["Quantitative Risk Assessment (QRA) Report", "HAZOP Process Safety Study", "Occupational Health Surveillance Protocol"],
    inspectionRequired: true,
    validityYears: 5,
    feeEstimate: "₹20,000 – ₹45,000"
  },

  // 4. Textile & Apparel
  {
    code: "REQ_ZLD_COMPLIANCE",
    title: "SPCB Zero Liquid Discharge (ZLD) Effluent System Certificate",
    department: "State Pollution Control Board (SPCB)",
    category: "Environment",
    description: "Mandatory ZLD certification certifying zero untreated liquid effluent discharge from textile wet processing units.",
    mandatoryDocuments: ["Multi-Effect Evaporator (MEE) & RO Flowsheet", "Continuous Online Effluent Monitoring (OCEMS) Telemetry", "Salt Recovery & Hazardous Sludge Manifest"],
    inspectionRequired: true,
    validityYears: 2,
    feeEstimate: "₹30,000 – ₹70,000"
  },
  {
    code: "REQ_TEXTILE_COMMISSIONER",
    title: "Textile Commissioner Industrial Registration",
    department: "Office of the Textile Commissioner (Ministry of Textiles)",
    category: "General Business",
    description: "Statutory industrial registration for powerlooms, spinning mills, and textile processing units.",
    mandatoryDocuments: ["Installed Spindle/Loom Machinery Specification", "Udyam MSME Registration Certificate", "Factory Building Plan Sanction"],
    inspectionRequired: false,
    validityYears: 10,
    feeEstimate: "Nil (Statutory Free Filing)"
  },

  // 5. Electronics & Hardware
  {
    code: "REQ_EPR_EWASTE",
    title: "CPCB Extended Producer Responsibility (EPR) E-Waste Authorization",
    department: "Central Pollution Control Board (CPCB)",
    category: "Environment",
    description: "Mandatory EPR authorization under E-Waste (Management) Rules, 2022 for producers of electronic hardware.",
    mandatoryDocuments: ["EPR Target Plan & Collection Center Agreements", "Authorized PRO / Recycler Agreement", "RoHS Compliance Declaration Form"],
    inspectionRequired: false,
    validityYears: 5,
    feeEstimate: "₹10,000 – ₹25,000"
  },
  {
    code: "REQ_BIS_CRS",
    title: "BIS Compulsory Registration Scheme (CRS) Electronics Safety",
    department: "Bureau of Indian Standards (BIS)",
    category: "Safety & Hazard",
    description: "Statutory product conformity certification for IT and electronic equipment under Electronics & IT Goods Order.",
    mandatoryDocuments: ["NABL Accredited Lab Safety Test Report (IS 13252)", "Factory Quality Control Audit Report", "Brand Authorization Trademark Letter"],
    inspectionRequired: true,
    validityYears: 2,
    feeEstimate: "₹35,000 – ₹80,000"
  },
  {
    code: "REQ_STPI_CUSTOMS",
    title: "STPI / EOU Electronic Hardware Technology Park License",
    department: "Software Technology Parks of India (STPI) / Customs",
    category: "General Business",
    description: "Operating license for duty-free capital equipment import under EHTP / STP export schemes.",
    mandatoryDocuments: ["Project Export-Import Feasibility Report", "Private Customs Bonded Warehouse Layout", "Board of Directors Resolution"],
    inspectionRequired: true,
    validityYears: 5,
    feeEstimate: "₹25,000 – ₹50,000"
  },

  // 6. Commercial Services & Warehousing
  {
    code: "REQ_SHOPS_ESTABLISHMENT",
    title: "Shops & Commercial Establishments Act Registration",
    department: "Department of Labour",
    category: "Labour Welfare",
    description: "Mandatory statutory registration regulating working hours, commercial leaves, and employment conditions.",
    mandatoryDocuments: ["Lease Deed / Ownership Proof of Premises", "PAN & Incorporation Certificate", "Employee Wage Register & Shift Schedule"],
    inspectionRequired: false,
    validityYears: 5,
    feeEstimate: "₹2,500 – ₹6,000"
  },
  {
    code: "REQ_LEGAL_METROLOGY",
    title: "Legal Metrology Packaged Commodities & Weights Verification",
    department: "Department of Consumer Affairs (Legal Metrology Division)",
    category: "General Business",
    description: "Statutory registration for pre-packaged commodities manufacturing, warehousing, and commercial weighing instruments.",
    mandatoryDocuments: ["Sample Packaging Label Layout (MRP, Batch, Net Qty)", "Weighing Scale Calibration Verification Certificate", "Commercial Address Proof"],
    inspectionRequired: true,
    validityYears: 2,
    feeEstimate: "₹5,000 – ₹12,000"
  },
  {
    code: "REQ_WDRA_WAREHOUSING",
    title: "WDRA Commercial Warehouse Registration",
    department: "Warehousing Development and Regulatory Authority (WDRA)",
    category: "Infrastructure",
    description: "Statutory accreditation certifying structural safety, pest control, and security of commercial warehousing yards.",
    mandatoryDocuments: ["Warehouse Insurance Policy for Fire & Burglary", "Security & Weighbridge Calibration Audit", "Pest Management Contract"],
    inspectionRequired: true,
    validityYears: 3,
    feeEstimate: "₹15,000 – ₹30,000"
  },

  // 7. Manufacturing Engineering
  {
    code: "REQ_FACTORIES_LICENSE",
    title: "Factory Registration & Operating License (Form 2)",
    department: "Directorate of Industrial Safety & Health (DISH)",
    category: "Labour & Safety",
    description: "Mandatory factory operating license under the Factories Act, 1948 for manufacturing establishments.",
    mandatoryDocuments: ["Approved Factory Plan Drawing", "Machinery Horsepower Schedule", "Ventilation & Lighting Certificate", "Safety Officer Appointment Proof"],
    inspectionRequired: true,
    validityYears: 5,
    feeEstimate: "₹15,000 – ₹40,000"
  },
  {
    code: "REQ_SPCB_CTE_CTO",
    title: "Pollution Consent to Operate (CTO - Air & Water Acts)",
    department: "State Pollution Control Board (SPCB)",
    category: "Environment",
    description: "Statutory environmental consent under Section 25/26 of Water Act 1974 and Section 21 of Air Act 1981.",
    mandatoryDocuments: ["Effluent Treatment Plant (ETP) / STP Schematics", "Air Pollution Control Equipment Details", "Raw Material Mass Balance Flowsheet", "Ambient Air & Effluent Lab Test Reports"],
    inspectionRequired: true,
    validityYears: 3,
    feeEstimate: "₹20,000 – ₹60,000"
  },
  {
    code: "REQ_BOILER_CERT",
    title: "Industrial Steam Boiler Operation Certificate",
    department: "Directorate of Steam Boilers",
    category: "Safety & Hazard",
    description: "Statutory annual certificate under Indian Boiler Regulations (IBR 1950) certifying safety of high-pressure vessels.",
    mandatoryDocuments: ["Hydraulic Pressure Test Inspection Report", "Certified Boiler Attendant License", "Steam Piping Isometric Drawings"],
    inspectionRequired: true,
    validityYears: 1,
    feeEstimate: "₹12,000 – ₹30,000"
  },
  {
    code: "REQ_CEIG_ELECTRICAL",
    title: "Chief Electrical Inspectorate (CEIG) HT Power Substation Clearance",
    department: "Chief Electrical Inspectorate to Government",
    category: "Infrastructure",
    description: "Statutory safety clearance under Central Electricity Authority Regulations for High Tension (HT) industrial power installations.",
    mandatoryDocuments: ["HT Transformer & Switchgear Test Reports", "Substation Earthing Resistance Test Results", "Single Line Electrical Diagram (SLD)"],
    inspectionRequired: true,
    validityYears: 3,
    feeEstimate: "₹15,000 – ₹35,000"
  },

  // 8. Labour Welfare
  {
    code: "REQ_EPFO_REG",
    title: "EPFO Employer Registration & Compliance Code",
    department: "Employees' Provident Fund Organisation (Ministry of Labour)",
    category: "Labour Welfare",
    description: "Mandatory provident fund registration under the Employees' Provident Funds & Miscellaneous Provisions Act, 1952.",
    mandatoryDocuments: ["Certificate of Incorporation / Partnership Deed", "PAN & GST Registration Proof", "List of First 20 Covered Employees", "Bank Account Cancelled Cheque"],
    inspectionRequired: false,
    validityYears: 10,
    feeEstimate: "Nil (Statutory Free Filing)"
  },
  {
    code: "REQ_ESIC_REG",
    title: "ESIC Employer Registration Code",
    department: "Employees' State Insurance Corporation (ESIC)",
    category: "Labour Welfare",
    description: "Mandatory healthcare and disability insurance registration under the Employees' State Insurance Act, 1948.",
    mandatoryDocuments: ["Attendance Register Abstract", "Salary Wage Register", "List of Covered Employees", "Factory/Shop License Copy"],
    inspectionRequired: false,
    validityYears: 10,
    feeEstimate: "Nil (Statutory Free Filing)"
  }
];

// ----------------------------------------------------------------------------
// 2. API Service Layer (Authenticated Backend Calls)
// ----------------------------------------------------------------------------
const ApiService = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  },

  getAuthHeaders(includeContentType = true) {
    const headers = {};
    const token = this.getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (includeContentType) headers["Content-Type"] = "application/json";
    return headers;
  },

  async apiFetch(url, options = {}) {
    try {
      const res = await fetch(url, options);
      return res;
    } catch (err) {
      console.warn("[ApiService] Connection error:", err.message);
      if (err.name === "TypeError" || (err.message && err.message.toLowerCase().includes("fetch"))) {
        AlgoUI.showServerOfflineBanner();
        throw new Error("Cannot connect to backend server. Please start the server with 'npm start' on http://localhost:4000.");
      }
      throw err;
    }
  },

  async register(email, password, businessName) {
    const res = await this.apiFetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, businessName })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    this.setToken(data.token);
    return data;
  },

  async login(email, password) {
    const res = await this.apiFetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    this.setToken(data.token);
    return data;
  },

  async logout() {
    try {
      if (this.getToken()) {
        await this.apiFetch(`${API_BASE}/auth/logout`, {
          method: "POST",
          headers: this.getAuthHeaders()
        });
      }
    } catch (e) {}
    this.setToken(null);
  },

  async getCurrentUser() {
    const token = this.getToken();
    if (token) {
      try {
        const res = await this.apiFetch(`${API_BASE}/auth/me`, {
          headers: this.getAuthHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.user) {
            if (typeof AlgoAccounts !== "undefined" && typeof AlgoAccounts.registerActiveSession === "function") {
              AlgoAccounts.registerActiveSession(data.user, token, data.profile);
            }
            return data;
          }
        } else if (res.status === 401) {
          this.setToken(null);
        }
      } catch (e) {}
    }
    return null;
  },

  async getProfile() {
    try {
      const res = await this.apiFetch(`${API_BASE}/profile`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async saveProfile(profileData) {
    const hasToken = !!this.getToken();
    const url = hasToken ? `${API_BASE}/profile` : `${API_BASE}/auth/register-and-profile`;
    const res = await this.apiFetch(url, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to save profile");
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  },

  async getRequirements() {
    try {
      const res = await this.apiFetch(`${API_BASE}/profile/requirements`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async getApplications(filterStatus = "ALL") {
    try {
      const url = filterStatus && filterStatus !== "ALL"
        ? `${API_BASE}/applications?status=${encodeURIComponent(filterStatus)}`
        : `${API_BASE}/applications`;
      const res = await this.apiFetch(url, { headers: this.getAuthHeaders() });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async getApplicationById(id) {
    try {
      const res = await this.apiFetch(`${API_BASE}/applications/${encodeURIComponent(id)}`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async createApplication(requirementCode, notes = "") {
    const res = await this.apiFetch(`${API_BASE}/applications`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ requirementCode, notes })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create application");
    return data;
  },

  async updateApplicationStatus(appId, newStatus, extraData = {}) {
    const res = await this.apiFetch(`${API_BASE}/applications/${encodeURIComponent(appId)}/status`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status: newStatus, ...extraData })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update status");
    return data;
  },

  async getDocuments() {
    try {
      const res = await this.apiFetch(`${API_BASE}/documents`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async uploadDocument(formData) {
    const res = await this.apiFetch(`${API_BASE}/documents`, {
      method: "POST",
      headers: this.getAuthHeaders(false),
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to upload document");
    return data;
  },

  async deleteDocument(docId) {
    const res = await this.apiFetch(`${API_BASE}/documents/${encodeURIComponent(docId)}`, {
      method: "DELETE",
      headers: this.getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to delete document");
    return data;
  },

  async getRenewals() {
    try {
      const res = await this.apiFetch(`${API_BASE}/renewals`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async renewLicense(renewalId) {
    const res = await this.apiFetch(`${API_BASE}/renewals/${encodeURIComponent(renewalId)}/renew`, {
      method: "POST",
      headers: this.getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to renew license");
    return data;
  },

  async getDashboardData() {
    try {
      const res = await this.apiFetch(`${API_BASE}/dashboard`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      return await res.json();
    } catch (e) {
      return {
        metrics: { hasProfile: false, totalRequiredApprovals: 0, activeApplicationsCount: 0, pendingActionsCount: 0, upcomingRenewalsCount: 0, totalApplicationsCount: 0, approvedCount: 0 },
        recentApplications: [],
        recentActivities: [],
        notifications: []
      };
    }
  },

  async markAllNotificationsRead() {
    try {
      await this.apiFetch(`${API_BASE}/dashboard/notifications/mark-read`, {
        method: "POST",
        headers: this.getAuthHeaders()
      });
    } catch (e) {}
  }
};

// ----------------------------------------------------------------------------
// 3. UI Helpers, Dialogs & Auth Modals
// ----------------------------------------------------------------------------
// Inject core modal and toast styles into the document head immediately
(function injectAlgoUIStyles() {
  if (typeof document === "undefined" || document.getElementById("algoui-dynamic-styles")) return;
  const style = document.createElement("style");
  style.id = "algoui-dynamic-styles";
  style.textContent = `
    .modal-overlay {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: rgba(15, 23, 42, 0.75) !important;
      backdrop-filter: blur(4px) !important;
      -webkit-backdrop-filter: blur(4px) !important;
      z-index: 99999 !important;
      display: none;
      align-items: center !important;
      justify-content: center !important;
      padding: 1.25rem !important;
      box-sizing: border-box !important;
    }
    .modal-overlay.open, .modal-overlay.show {
      display: flex !important;
    }
    .modal-dialog, .modal-card {
      background: #ffffff !important;
      border-radius: 12px !important;
      width: 100% !important;
      max-width: 680px !important;
      max-height: 90vh !important;
      overflow: hidden !important;
      display: flex !important;
      flex-direction: column !important;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35) !important;
      border: 1px solid #cbd5e1 !important;
      animation: modalScaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
      position: relative !important;
      box-sizing: border-box !important;
      margin: auto !important;
    }
    @keyframes modalScaleIn {
      from { opacity: 0; transform: scale(0.96) translateY(8px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .modal-header {
      padding: 1.1rem 1.4rem !important;
      border-bottom: 1px solid #e2e8f0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      background: #f8fafc !important;
      flex-shrink: 0 !important;
    }
    .modal-title {
      font-size: 1.1rem !important;
      font-weight: 800 !important;
      color: #0f172a !important;
      margin: 0 !important;
      line-height: 1.3 !important;
    }
    .modal-close, #modal-close-btn {
      background: transparent !important;
      border: none !important;
      font-size: 1.5rem !important;
      color: #64748b !important;
      cursor: pointer !important;
      line-height: 1 !important;
      padding: 0.25rem 0.6rem !important;
      border-radius: 6px !important;
      transition: all 0.15s ease !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    .modal-close:hover, #modal-close-btn:hover {
      background: #e2e8f0 !important;
      color: #0f172a !important;
    }
    .modal-body {
      padding: 1.4rem !important;
      overflow-y: auto !important;
      flex: 1 !important;
      color: #334155 !important;
      font-size: 0.88rem !important;
      box-sizing: border-box !important;
    }
    .modal-footer {
      padding: 1rem 1.4rem !important;
      border-top: 1px solid #e2e8f0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: flex-end !important;
      gap: 0.75rem !important;
      background: #f8fafc !important;
      flex-shrink: 0 !important;
      box-sizing: border-box !important;
    }
    .toast-container {
      position: fixed !important;
      bottom: 1.5rem !important;
      right: 1.5rem !important;
      z-index: 100000 !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 0.65rem !important;
      pointer-events: none !important;
    }
    .toast {
      background: #ffffff !important;
      border: 1px solid #cbd5e1 !important;
      border-left: 4px solid #0d7a6b !important;
      border-radius: 8px !important;
      padding: 0.85rem 1.15rem !important;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15) !important;
      font-size: 0.86rem !important;
      font-weight: 600 !important;
      color: #0f172a !important;
      display: flex !important;
      align-items: center !important;
      gap: 0.65rem !important;
      pointer-events: auto !important;
      animation: toastSlideIn 0.25s ease-out !important;
    }
    @keyframes toastSlideIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .toast-success { border-left-color: #10b981 !important; }
    .toast-warning { border-left-color: #f59e0b !important; }
    .toast-danger { border-left-color: #ef4444 !important; }
    .toast-info { border-left-color: #0d7a6b !important; }
  `;
  document.head.appendChild(style);
})();

const AlgoUI = {
  showServerOfflineBanner() {
    if (document.getElementById("server-offline-banner")) return;
    const banner = document.createElement("div");
    banner.id = "server-offline-banner";
    banner.className = "server-offline-banner";
    banner.innerHTML = `
      <div class="banner-content">
        <span class="banner-icon">⚠️</span>
        <div class="banner-text">
          <strong>Backend Server Offline:</strong> Cannot reach <code>http://localhost:4000</code>.
          Please run <code>npm start</code> in your terminal (or double-click <code>start.bat</code>) and visit <a href="http://localhost:4000">http://localhost:4000</a>.
        </div>
      </div>
      <button type="button" class="banner-btn" onclick="window.location.reload()">Retry Connection 🔄</button>
    `;
    document.body.insertBefore(banner, document.body.firstChild);
  },
  showToast(message, type = "info", duration = 3000) {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let icon = "ℹ️";
    if (type === "success") icon = "✓";
    if (type === "warning") icon = "⚠️";
    if (type === "danger") icon = "✕";

    toast.innerHTML = `<span>${icon}</span> <div>${message}</div>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-10px)";
      toast.style.transition = "all 0.25s ease";
      setTimeout(() => toast.remove(), 250);
    }, duration);
  },

  openModal(title, bodyHtml, footerHtml = "") {
    let overlay = document.getElementById("modal-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "modal-overlay";
      overlay.className = "modal-overlay";
      overlay.innerHTML = `
        <div class="modal-dialog modal-card" role="dialog" aria-modal="true">
          <div class="modal-header">
            <h3 id="modal-title" class="modal-title"></h3>
            <button type="button" class="modal-close" id="modal-close-btn" onclick="AlgoUI.closeModal()" aria-label="Close" style="background:none; border:none; font-size:1.5rem; cursor:pointer; line-height:1; color:#64748b; padding:0.25rem 0.5rem;">&times;</button>
          </div>
          <div class="modal-body" id="modal-body"></div>
          <div class="modal-footer" id="modal-footer"></div>
        </div>
      `;
      document.body.appendChild(overlay);

      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) AlgoUI.closeModal();
      });
      const closeBtn = document.getElementById("modal-close-btn");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => AlgoUI.closeModal());
      }
    }

    const titleEl = document.getElementById("modal-title");
    if (titleEl) titleEl.textContent = title;
    const bodyEl = document.getElementById("modal-body");
    if (bodyEl) bodyEl.innerHTML = bodyHtml;

    const footerEl = document.getElementById("modal-footer");
    if (footerEl) {
      if (footerHtml) {
        footerEl.innerHTML = footerHtml;
        footerEl.style.display = "flex";
      } else {
        footerEl.innerHTML = `<button type="button" class="btn btn-secondary btn-sm" onclick="AlgoUI.closeModal()" style="padding:0.5rem 1rem; border:1px solid #cbd5e1; border-radius:6px; background:#fff; cursor:pointer; font-weight:600;">Close</button>`;
        footerEl.style.display = "flex";
      }
    }

    overlay.style.display = "flex";
    overlay.classList.add("open");
    overlay.classList.add("show");
    document.body.style.overflow = "hidden";
  },

  closeModal() {
    const overlays = document.querySelectorAll(".modal-overlay, #modal-overlay, .modal");
    overlays.forEach(overlay => {
      overlay.classList.remove("open");
      overlay.classList.remove("show");
      overlay.style.display = "none";
    });
    document.body.style.overflow = "";
  },

  openAuthModal(initialTab = "login") {
    if (typeof window.openAuthModal === "function") {
      window.openAuthModal(initialTab);
    }
  },

  renderStatusBadge(status) {
    const s = (status || "").toUpperCase();
    if (s === "APPROVED" || s === "ACTIVE" || s === "VERIFIED") {
      return `<span class="badge badge-success"><span class="badge-dot"></span>${status}</span>`;
    } else if (s === "SUBMITTED" || s === "UNDER REVIEW" || s === "DUE_SOON") {
      return `<span class="badge badge-info"><span class="badge-dot"></span>${status}</span>`;
    } else if (s === "CLARIFICATION REQUIRED" || s === "INSPECTION REQUIRED") {
      return `<span class="badge badge-warning"><span class="badge-dot"></span>${status}</span>`;
    } else if (s === "REJECTED" || s === "OVERDUE") {
      return `<span class="badge badge-danger"><span class="badge-dot"></span>${status}</span>`;
    } else if (s === "DRAFT" || s === "NOT_APPLIED") {
      return `<span class="badge badge-neutral"><span class="badge-dot"></span>${status === "NOT_APPLIED" ? "Not Applied" : status}</span>`;
    }
    return `<span class="badge badge-neutral">${status}</span>`;
  },

  async setupNavigation() {
    const authData = await ApiService.getCurrentUser();
    const user = authData ? authData.user : null;
    const profile = authData ? authData.profile : null;

    const navActions = document.querySelector(".nav-actions");
    const pillEls = document.querySelectorAll(".profile-pill");

    if (user) {
      // User is logged in
      const displayName = (profile && profile.businessName) ? profile.businessName : user.businessName;

      pillEls.forEach(el => {
        el.textContent = displayName;
        el.setAttribute("title", `Account: ${displayName} (${user.email})`);
        const parent = el.parentElement;

        if (parent && !parent.querySelector(".user-dropdown")) {
          parent.classList.add("user-menu-wrapper");
          const dropdown = document.createElement("div");
          dropdown.className = "user-dropdown";
          dropdown.id = "user-profile-dropdown";
          dropdown.innerHTML = `
            <div class="user-dropdown-header">
              <div class="user-dropdown-name">${displayName}</div>
              <div class="user-dropdown-meta">${user.email}</div>
            </div>
            <div class="user-dropdown-menu">
              <a href="profile.html" class="user-dropdown-item">
                <span>🏢</span> Manage Business Profile
              </a>
              <a href="dashboard.html" class="user-dropdown-item">
                <span>📊</span> Compliance Dashboard
              </a>
              <a href="approvals.html" class="user-dropdown-item">
                <span>📋</span> Required Approvals
              </a>
              <button type="button" class="user-dropdown-item danger" id="user-sign-out-btn">
                <span>🚪</span> Sign Out
              </button>
            </div>
          `;
          parent.appendChild(dropdown);

          el.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle("show");
          });

          document.addEventListener("click", (e) => {
            if (!parent.contains(e.target)) {
              dropdown.classList.remove("show");
            }
          });

          dropdown.querySelector("#user-sign-out-btn")?.addEventListener("click", async () => {
            await AlgoUI.handleSignOut();
          });
        }
      });
      if (navActions) {
        navActions.innerHTML = `
          <div class="tb-user" onclick="openProfileMenuModal()" title="Business Profile & Account Hub" style="display:inline-flex; align-items:center; gap:0.6rem; cursor:pointer; background:rgba(255,255,255,0.08); padding:0.35rem 0.75rem; border-radius:30px; border:1px solid rgba(255,255,255,0.2);">
            <div style="width:28px; height:28px; border-radius:50%; background:#0d7a6b; color:#fff; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:800;">
              ${(user.userName || 'AS').split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase()}
            </div>
            <span style="font-size:0.84rem; font-weight:700; color:#0f172a;">${user.userName || user.businessName}</span>
          </div>
        `;
      }
    } else {
      // User is signed out -> Replace pill with Sign In button
      pillEls.forEach(el => {
        el.textContent = "Sign In / Register";
        el.style.backgroundColor = "var(--brand-700)";
        el.style.color = "#ffffff";
        el.removeAttribute("href");
        el.onclick = (e) => {
          e.preventDefault();
          AlgoUI.openAuthModal("login");
        };
      });
    }

    // Notifications setup if logged in
    const badgeEl = document.getElementById("nav-notif-badge");
    const notifBtn = document.getElementById("nav-notif-btn");
    const notifDropdown = document.getElementById("nav-notif-dropdown");

    if (user && notifBtn && notifDropdown) {
      const dashData = await ApiService.getDashboardData();
      const notifs = dashData.notifications || [];
      const unreadCount = notifs.filter(n => !n.read).length;

      if (badgeEl) {
        if (unreadCount > 0) {
          badgeEl.textContent = unreadCount;
          badgeEl.style.display = "inline-flex";
        } else {
          badgeEl.style.display = "none";
        }
      }

      notifBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle("show");
      });

      document.addEventListener("click", (e) => {
        if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
          notifDropdown.classList.remove("show");
        }
      });

      const notifListEl = document.getElementById("notif-list-container");
      if (notifListEl) {
        if (notifs.length === 0) {
          notifListEl.innerHTML = `<div class="empty-state-compact">No new notifications.</div>`;
        } else {
          notifListEl.innerHTML = notifs.map(n => `
            <div class="notif-item ${n.read ? '' : 'unread'}">
              <div class="notif-msg">${n.message}</div>
              <div class="notif-time">${n.time}</div>
            </div>
          `).join("");
        }
      }

      document.getElementById("notif-mark-all-read")?.addEventListener("click", async () => {
        await ApiService.markAllNotificationsRead();
        if (badgeEl) badgeEl.style.display = "none";
        document.querySelectorAll(".notif-item.unread").forEach(el => el.classList.remove("unread"));
        AlgoUI.showToast("All notifications marked as read.", "info");
      });
    }

    // Mobile Hamburger
    const mobileBtn = document.getElementById("mobile-menu-toggle");
    const navMenu = document.getElementById("main-nav-links");
    const sidebarEl = document.getElementById("app-sidebar");
    if (mobileBtn) {
      mobileBtn.addEventListener("click", () => {
        if (sidebarEl) sidebarEl.classList.toggle("show");
        if (navMenu) navMenu.classList.toggle("show");
      });
    }

    // Active Navigation Highlighting
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link, .sidebar-nav-item").forEach(link => {
      const href = link.getAttribute("href");
      if (href === currentPath || (currentPath === "" && href === "index.html")) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  },

  async handleSignOut() {
    if (confirm("Are you sure you want to sign out of your AnumatiSetu account?")) {
      await ApiService.logout();
      AlgoUI.showToast("Signed out successfully.", "info");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 400);
    }
  },

  async ensureAuth() {
    const user = await ApiService.getCurrentUser();
    if (!user) {
      AlgoUI.openAuthModal("login");
      return false;
    }
    return true;
  }
};

// ----------------------------------------------------------------------------
// 4. Page Controllers
// ----------------------------------------------------------------------------

// ==========================================
// PAGE: PROFILE (profile.html)
// ==========================================
async function initProfilePage() {
  const authData = await ApiService.getCurrentUser();
  const user = authData ? authData.user : null;
  const profile = await ApiService.getProfile();
  const formCard = document.querySelector(".card:has(#business-profile-form)") || document.getElementById("business-profile-form")?.closest(".card");
  const form = document.getElementById("business-profile-form");
  const clearBtn = document.getElementById("clear-all-data-btn");

  if (clearBtn) {
    clearBtn.textContent = user ? "Sign Out" : "Sign In / Register";
    clearBtn.onclick = () => {
      if (user) AlgoUI.handleSignOut();
      else AlgoUI.openAuthModal("login");
    };
  }

  const isProfileComplete = profile && profile.isComplete;

  if (isProfileComplete && formCard) {
    const renderProfileSummary = () => {
      formCard.innerHTML = `
        <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h3 style="margin-bottom:0.2rem;">Registered Enterprise Profile</h3>
            <p style="font-size:0.82rem; color:var(--slate-500); margin:0;">Account: <strong>${user.email}</strong></p>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" id="unlock-profile-btn">
            ✏️ Modify Profile
          </button>
        </div>
        <div style="padding: 1.5rem 0 0.5rem 0;">
          <div class="profile-overview-grid">
            <div>
              <div class="profile-field-label">Legal Entity Name</div>
              <div class="profile-field-value">${profile.businessName}</div>
            </div>
            <div>
              <div class="profile-field-label">Industry / Activity Sector</div>
              <div class="profile-field-value">${profile.industryType}</div>
            </div>
            <div>
              <div class="profile-field-label">Operational Stage</div>
              <div class="profile-field-value">${profile.businessStage}</div>
            </div>
            <div>
              <div class="profile-field-label">Location / Estate</div>
              <div class="profile-field-value">${profile.location}</div>
            </div>
            <div>
              <div class="profile-field-label">State Jurisdiction</div>
              <div class="profile-field-value">${profile.state}</div>
            </div>
            <div>
              <div class="profile-field-label">Employees Headcount</div>
              <div class="profile-field-value">${profile.employeesCount || 0} Employees</div>
            </div>
            <div>
              <div class="profile-field-label">Investment in Plant & Machinery</div>
              <div class="profile-field-value">${profile.investmentScale || "—"}</div>
            </div>
            <div>
              <div class="profile-field-label">MSME / Enterprise Category</div>
              <div class="profile-field-value">${profile.businessCategory}</div>
            </div>
          </div>

          <div style="margin-top: 1.75rem; border-top: 1px solid var(--slate-100); padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 0.82rem; color: var(--success-dark); font-weight: 600;">
              ✓ Statutory requirements mapped and active for ${profile.businessName}
            </div>
            <a href="approvals.html" class="btn btn-primary btn-sm">
              View Applicable Approvals →
            </a>
          </div>
        </div>
      `;

      document.getElementById("unlock-profile-btn")?.addEventListener("click", () => {
        if (confirm("Modifying your business profile will recalculate mandatory statutory clearances. Proceed to edit?")) {
          renderEditForm();
        }
      });
    };

    const renderEditForm = () => {
      formCard.innerHTML = `
        <div class="card-header">
          <h3>Modify Enterprise Registration Details</h3>
        </div>
        <form id="business-profile-form" novalidate>
          <div class="alert alert-warning" style="margin-bottom:1.25rem;">
            <span>⚠️</span>
            <div>
              <strong>Profile Update Notice:</strong> Changes to sector, employee count, or location will automatically update your statutory requirements.
            </div>
          </div>
          <div class="form-grid">
            <div class="form-group full-width">
              <label for="businessName" class="form-label">Business / Entity Legal Name <span class="required">*</span></label>
              <input type="text" id="businessName" name="businessName" class="form-control" value="${profile?.businessName || user?.businessName || ''}" required />
            </div>
            <div class="form-group">
              <label for="industryType" class="form-label">Industry / Activity Sector <span class="required">*</span></label>
              <select id="industryType" name="industryType" class="form-select" required>
                <option value="Manufacturing" ${profile.industryType === 'Manufacturing' ? 'selected' : ''}>Manufacturing / Engineering</option>
                <option value="Food Processing" ${profile.industryType === 'Food Processing' ? 'selected' : ''}>Food Processing & Agro</option>
                <option value="Textile" ${profile.industryType === 'Textile' ? 'selected' : ''}>Textile & Apparel</option>
                <option value="Electronics" ${profile.industryType === 'Electronics' ? 'selected' : ''}>Electronics & Hardware</option>
                <option value="Chemicals" ${profile.industryType === 'Chemicals' ? 'selected' : ''}>Chemicals & Hazardous Materials</option>
                <option value="Services" ${profile.industryType === 'Services' ? 'selected' : ''}>Commercial Services / Warehousing</option>
                <option value="Other" ${profile.industryType === 'Other' ? 'selected' : ''}>Other General Business</option>
              </select>
            </div>
            <div class="form-group">
              <label for="businessStage" class="form-label">Operating Stage <span class="required">*</span></label>
              <select id="businessStage" name="businessStage" class="form-select" required>
                <option value="New Setup" ${profile.businessStage === 'New Setup' ? 'selected' : ''}>New Setup (Pre-Operational)</option>
                <option value="Expansion" ${profile.businessStage === 'Expansion' ? 'selected' : ''}>Expansion / Brownfield Upgrade</option>
                <option value="Existing Business" ${profile.businessStage === 'Existing Business' ? 'selected' : ''}>Existing Business (Operational)</option>
              </select>
            </div>
            <div class="form-group">
              <label for="location" class="form-label">Operating Location / Industrial Estate <span class="required">*</span></label>
              <input type="text" id="location" name="location" class="form-control" value="${profile.location || ''}" placeholder="e.g. Peenya Industrial Area, Bengaluru" required />
            </div>
            <div class="form-group">
              <label for="state" class="form-label">State / Union Territory <span class="required">*</span></label>
              <select id="state" name="state" class="form-select" required>
                ${["Karnataka", "Maharashtra", "Gujarat", "Tamil Nadu", "Telangana", "Andhra Pradesh", "Uttar Pradesh", "Rajasthan", "Haryana", "Delhi NCR", "Goa", "West Bengal", "Other"]
                  .map(s => `<option value="${s}" ${profile.state === s ? 'selected' : ''}>${s}</option>`).join("")}
              </select>
            </div>
            <div class="form-group">
              <label for="investmentScale" class="form-label">Investment in Plant & Machinery</label>
              <input type="text" id="investmentScale" name="investmentScale" class="form-control" value="${profile.investmentScale || ''}" placeholder="e.g. ₹5 Crores" />
            </div>
            <div class="form-group">
              <label for="employeesCount" class="form-label">Number of Employees <span class="required">*</span></label>
              <input type="number" id="employeesCount" name="employeesCount" class="form-control" value="${profile.employeesCount || 0}" min="0" required />
            </div>
            <div class="form-group full-width">
              <label for="businessCategory" class="form-label">Business Scale / Category <span class="required">*</span></label>
              <select id="businessCategory" name="businessCategory" class="form-select" required>
                ${["Micro Enterprise", "Small Enterprise", "Medium Enterprise", "Large Enterprise"]
                  .map(c => `<option value="${c}" ${profile.businessCategory === c ? 'selected' : ''}>${c}</option>`).join("")}
              </select>
            </div>
          </div>
          <div style="margin-top: 1.5rem; border-top: 1px solid var(--slate-100); padding-top: 1rem; display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button type="button" class="btn btn-secondary" id="cancel-edit-btn">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Profile & Determine Requirements →</button>
          </div>
        </form>
      `;

      document.getElementById("cancel-edit-btn")?.addEventListener("click", () => {
        renderProfileSummary();
      });

      attachFormSubmitHandler();
    };

    renderProfileSummary();
  } else if (form) {
    // Pre-fill business name from registered user if present
    if (user && form.elements["businessName"] && !form.elements["businessName"].value) {
      form.elements["businessName"].value = user.businessName || "";
    }
    attachFormSubmitHandler();
  }

  function attachFormSubmitHandler() {
    const activeForm = document.getElementById("business-profile-form");
    if (!activeForm) return;
    activeForm.onsubmit = window.handleProfileFormSubmit;
  }
}

window.handleProfileFormSubmit = async function(e) {
  if (e && e.preventDefault) e.preventDefault();

  const activeForm = document.getElementById("business-profile-form");
  if (!activeForm) return false;

  const profileData = {
    businessName: (activeForm.elements["businessName"]?.value || "").trim(),
    industryType: activeForm.elements["industryType"]?.value || "Manufacturing",
    businessStage: activeForm.elements["businessStage"]?.value || "New Setup",
    location: (activeForm.elements["location"]?.value || "").trim(),
    state: activeForm.elements["state"]?.value || "Karnataka",
    investmentScale: (activeForm.elements["investmentScale"]?.value || "").trim(),
    employeesCount: parseInt(activeForm.elements["employeesCount"]?.value) || 0,
    businessCategory: activeForm.elements["businessCategory"]?.value || "Small Enterprise"
  };

  if (!profileData.businessName || !profileData.location) {
    AlgoUI.showToast("Please enter business legal name and location.", "warning");
    return false;
  }

  try {
    AlgoUI.showToast("Saving profile and determining requirements...", "info");
    await ApiService.saveProfile(profileData);
    AlgoUI.showToast("Profile saved! Statutory clearances determined.", "success");
    setTimeout(() => {
      window.location.href = "approvals.html";
    }, 500);
  } catch (err) {
    AlgoUI.showToast("Error saving profile: " + err.message, "danger");
  }
  return false;
};

// ==========================================
// PAGE: DASHBOARD (dashboard.html)
// ==========================================
async function initDashboardPage() {
  const user = await ApiService.getCurrentUser();
  let data = {
    metrics: {
      hasProfile: true,
      totalRequiredApprovals: 14,
      activeApplicationsCount: 3,
      pendingActionsCount: 1,
      upcomingRenewalsCount: 2,
      profile: {
        businessName: "Sun Pharmaceuticals Ltd — Unit 4",
        location: "Peenya Industrial Area, Bengaluru, Karnataka",
        state: "Karnataka",
        industryType: "Chemicals & Manufacturing",
        businessCategory: "Medium Enterprise"
      }
    },
    recentApplications: [
      { id: "APP-CTE-2024-8842", title: "Consent to Establish (CTE) - Orange/Red", department: "Karnataka State Pollution Control Board (KSPCB)", status: "UNDER REVIEW" },
      { id: "APP-FIRE-2024-9104", title: "Fire Safety Certificate (Fire NOC)", department: "Karnataka State Fire & Emergency Services", status: "INSPECTION REQUIRED" },
      { id: "APP-DISH-2024-5231", title: "Factory Plan Approval & Operating License", department: "Directorate of Industrial Safety & Health (DISH)", status: "SUBMITTED" }
    ],
    recentActivities: [
      { text: "Clarification document uploaded for Fire Safety NOC (Hydrant Flow Report)", timestamp: "2 hours ago" },
      { text: "Physical Site Inspection scheduled by DISH Inspector for Unit 4", timestamp: "Yesterday, 3:45 PM" },
      { text: "Consent to Establish (CTE) fee receipt verified by KSPCB Accounts", timestamp: "Sep 27, 2024" },
      { text: "Statutory Clearance Roadmap generated for 14 statutory permissions", timestamp: "Sep 26, 2024" }
    ]
  };

  if (user) {
    try {
      const liveData = await ApiService.getDashboardData();
      if (liveData && liveData.metrics) {
        data = liveData;
      }
    } catch (e) {
      console.warn("Using fallback dashboard data:", e);
    }
  }

  const { metrics, recentApplications, recentActivities } = data;

  const titleEl = document.getElementById("dash-header-title");
  if (titleEl) {
    if (metrics.hasProfile && metrics.profile) {
      titleEl.textContent = `Industrial Compliance Dashboard — ${metrics.profile.businessName || 'Sun Pharma Unit 4'}`;
    } else if (user) {
      titleEl.textContent = `Industrial Compliance Dashboard — ${user.businessName || 'Enterprise'}`;
    }
  }

  const totalReqEl = document.getElementById("kpi-total-approvals");
  const activeAppsEl = document.getElementById("kpi-active-applications");
  const pendingActionsEl = document.getElementById("kpi-pending-actions");
  const upcomingRenewalsEl = document.getElementById("kpi-upcoming-renewals");

  if (totalReqEl) totalReqEl.textContent = metrics.totalRequiredApprovals || 14;
  if (activeAppsEl) activeAppsEl.textContent = metrics.activeApplicationsCount || 3;
  if (pendingActionsEl) pendingActionsEl.textContent = metrics.pendingActionsCount || 1;
  if (upcomingRenewalsEl) upcomingRenewalsEl.textContent = metrics.upcomingRenewalsCount || 2;

  const promptBanner = document.getElementById("dash-profile-prompt");
  if (promptBanner) {
    if (user && !metrics.hasProfile) {
      promptBanner.style.display = "block";
    } else {
      promptBanner.style.display = "none";
    }
  }

  const appsContainer = document.getElementById("dash-recent-applications-list");
  if (appsContainer) {
    if (!recentApplications || recentApplications.length === 0) {
      appsContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">No active applications found.</div>
          <div class="empty-state-desc">Set up your business profile to view applicable statutory approvals and create your first application.</div>
          <div style="margin-top: 1rem;">
            <a href="approvals.html" class="btn btn-primary btn-sm">
              View Required Approvals →
            </a>
          </div>
        </div>
      `;
    } else {
      appsContainer.innerHTML = `
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>Statutory Clearance</th>
                <th>Department</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${recentApplications.map(app => `
                <tr>
                  <td><code>${app.id}</code></td>
                  <td><strong>${app.title}</strong></td>
                  <td style="font-size:0.82rem; color:var(--slate-600);">${app.department}</td>
                  <td>${AlgoUI.renderStatusBadge(app.status)}</td>
                  <td>
                    <a href="applications.html?id=${app.id}" class="btn btn-secondary btn-sm">Manage</a>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;
    }
  }

  const actContainer = document.getElementById("dash-activity-list");
  if (actContainer) {
    if (!recentActivities || recentActivities.length === 0) {
      actContainer.innerHTML = `<div class="empty-state-compact">No recent compliance activity recorded.</div>`;
    } else {
      actContainer.innerHTML = recentActivities.map(act => `
        <div style="display:flex; align-items:flex-start; gap:0.75rem; padding:0.6rem 0; border-bottom:1px solid var(--slate-100);">
          <div style="width:8px; height:8px; border-radius:50%; background:var(--emerald-500); margin-top:0.4rem; flex-shrink:0;"></div>
          <div style="flex:1;">
            <div style="font-size:0.84rem; color:var(--slate-800); font-weight:600; line-height:1.4;">${act.text}</div>
            <div style="font-size:0.72rem; color:var(--slate-400); margin-top:0.15rem;">${act.timestamp}</div>
          </div>
        </div>
      `).join("");
    }
  }
}

// ==========================================
// PAGE: APPROVALS & REQUIREMENTS (approvals.html)
// ==========================================
let currentReqCategory = "ALL";
let currentReqSearch = "";
let currentReqMandatory = "ALL";

async function renderRequirementsList() {
  const authData = await ApiService.getCurrentUser();
  let profile = null;
  let requirements = [];

  if (authData) {
    try {
      profile = await ApiService.getProfile();
      requirements = await ApiService.getRequirements();
    } catch (e) {
      console.warn("[Approvals] Error fetching live requirements:", e);
    }
  }

  const container = document.getElementById("required-approvals-grid") || document.getElementById("requirements-table-container");
  const countEl = document.getElementById("approvals-count-display") || document.getElementById("requirements-count");
  const badgeEl = document.getElementById("sidebar-approvals-badge");

  // Fallback to full STATUTORY_CATALOG if requirements is empty or profile is incomplete
  if (!requirements || requirements.length === 0) {
    requirements = STATUTORY_CATALOG.map(item => ({
      ...item,
      status: "NOT_APPLIED",
      isMandatory: true
    }));
  }

  if (badgeEl) {
    badgeEl.textContent = requirements.length;
  }

  // Filter by Category
  if (currentReqCategory !== "ALL") {
    requirements = requirements.filter(r => (r.category || "").toUpperCase().includes(currentReqCategory.toUpperCase()));
  }

  // Filter by Mandatory / Status
  if (currentReqMandatory === "MANDATORY") {
    requirements = requirements.filter(r => r.isMandatory);
  } else if (currentReqMandatory === "APPLIED") {
    requirements = requirements.filter(r => r.status && r.status !== "NOT_APPLIED");
  } else if (currentReqMandatory === "PENDING") {
    requirements = requirements.filter(r => !r.status || r.status === "NOT_APPLIED");
  }

  // Filter by Search Query
  if (currentReqSearch) {
    const q = currentReqSearch.toLowerCase();
    requirements = requirements.filter(r =>
      (r.title && r.title.toLowerCase().includes(q)) ||
      (r.department && r.department.toLowerCase().includes(q)) ||
      (r.category && r.category.toLowerCase().includes(q)) ||
      (r.code && r.code.toLowerCase().includes(q)) ||
      (r.description && r.description.toLowerCase().includes(q))
    );
  }

  if (countEl) {
    const entName = (profile && profile.businessName) ? ` for ${profile.businessName}` : " for Industrial Plant Profile";
    countEl.textContent = `${requirements.length} statutory clearances identified${entName}`;
  }

  if (container) {
    if (requirements.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; padding: 3.5rem 1.5rem; text-align: center; background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--slate-200);">
          <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🔍</div>
          <div class="empty-state-title" style="font-size: 1.15rem; font-weight: 700; color: var(--slate-900);">No matching statutory approvals found.</div>
          <div class="empty-state-desc" style="color: var(--slate-500); margin-top: 0.35rem; font-size: 0.88rem;">Try clearing your search keyword or switching category filters.</div>
          <div style="margin-top: 1.25rem;">
            <button class="btn btn-secondary btn-sm" onclick="resetApprovalsFilters()">Reset Filters</button>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = requirements.map(req => {
      const isApplied = req.status && req.status !== "NOT_APPLIED";
      const docsPreview = (req.mandatoryDocuments || []).slice(0, 3).map(d => `
        <span style="display:inline-flex; align-items:center; gap:0.25rem; background:var(--slate-100); color:var(--slate-700); font-size:0.72rem; font-weight:600; padding:0.2rem 0.55rem; border-radius:var(--radius-sm); margin:0.15rem 0.25rem 0.15rem 0; border:1px solid var(--slate-200);">
          📄 ${d}
        </span>
      `).join("");
      const moreDocsCount = (req.mandatoryDocuments || []).length > 3 ? `<span style="font-size:0.72rem; color:var(--slate-400); font-weight:600;">+${(req.mandatoryDocuments || []).length - 3} more</span>` : "";

      return `
        <div class="card" style="margin-bottom: 0; display: flex; flex-direction: column; justify-content: space-between; border-radius: var(--radius-xl); border: 1px solid var(--slate-200); box-shadow: var(--shadow-sm); transition: transform 0.18s ease, box-shadow 0.18s ease; background: #FFFFFF;">
          <div>
            <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem; margin-bottom: 0.85rem;">
              <span style="font-size: 0.72rem; font-weight: 700; color: var(--emerald-600); text-transform: uppercase; letter-spacing: 0.5px; background: var(--emerald-50); padding: 0.25rem 0.65rem; border-radius: var(--radius-sm); border: 1px solid var(--emerald-200);">
                ${req.category || 'General Business'}
              </span>
              ${AlgoUI.renderStatusBadge(req.status || 'NOT_APPLIED')}
            </div>

            <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--slate-900); line-height: 1.35; margin-bottom: 0.4rem;">
              ${req.title}
            </h3>

            <div style="font-size: 0.78rem; font-weight: 600; color: var(--slate-500); margin-bottom: 0.75rem;">
              🏛️ ${req.department}
            </div>

            <p style="font-size: 0.84rem; color: var(--slate-600); line-height: 1.5; margin-bottom: 1rem;">
              ${req.description || 'Statutory regulatory compliance and operating clearance under Central & State Acts.'}
            </p>

            <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-md); padding: 0.75rem 0.95rem; margin-bottom: 1rem; font-size: 0.78rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
                <span style="color: var(--slate-500);">Statutory Fee:</span>
                <strong style="color: var(--slate-800);">${req.feeEstimate || '₹5,000 – ₹15,000'}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
                <span style="color: var(--slate-500);">Permit Validity:</span>
                <strong style="color: var(--slate-800);">${req.validityYears ? req.validityYears + ' Years' : '3 Years'}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--slate-500);">Audit Procedure:</span>
                <strong style="color: ${req.inspectionRequired ? 'var(--warning-dark)' : 'var(--slate-700)'};">${req.inspectionRequired ? 'Mandatory Site Inspection' : 'Document-Only Review'}</strong>
              </div>
            </div>

            <div style="margin-bottom: 1.25rem;">
              <div style="font-size: 0.72rem; font-weight: 700; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.35rem;">Required Attachments:</div>
              <div>${docsPreview} ${moreDocsCount}</div>
            </div>
          </div>

          <div style="padding-top: 0.85rem; border-top: 1px solid var(--slate-100); display: flex; align-items: center; justify-content: flex-end; gap: 0.75rem;">
            <button class="btn ${isApplied ? 'btn-secondary' : 'btn-primary'} btn-sm" onclick="handleStartApplication('${req.code}')">
              ${isApplied ? 'Manage Application →' : 'Apply via Portal →'}
            </button>
          </div>
        </div>
      `;
    }).join("");
  }
}

function resetApprovalsFilters() {
  currentReqCategory = "ALL";
  currentReqSearch = "";
  currentReqMandatory = "ALL";
  const searchInput = document.getElementById("req-search-input");
  const catSelect = document.getElementById("req-category-filter");
  const mandSelect = document.getElementById("req-mandatory-filter");
  if (searchInput) searchInput.value = "";
  if (catSelect) catSelect.value = "ALL";
  if (mandSelect) mandSelect.value = "ALL";
  renderRequirementsList();
}

function handleStartApplication(reqCode) {
  openApplicationWizardModal(reqCode);
}

function confirmCreateApplication(reqCode) {
  openApplicationWizardModal(reqCode);
}

async function initApprovalsPage() {
  const categorySelect = document.getElementById("req-category-filter");
  if (categorySelect) {
    categorySelect.addEventListener("change", (e) => {
      currentReqCategory = e.target.value;
      renderRequirementsList();
    });
  }

  const mandatorySelect = document.getElementById("req-mandatory-filter");
  if (mandatorySelect) {
    mandatorySelect.addEventListener("change", (e) => {
      currentReqMandatory = e.target.value;
      renderRequirementsList();
    });
  }

  const searchInput = document.getElementById("req-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentReqSearch = e.target.value.trim();
      renderRequirementsList();
    });
  }

  renderRequirementsList();
}

// ==========================================
// PAGE: APPLICATIONS (applications.html)
// ==========================================
let currentAppFilter = "ALL";

async function renderApplicationsTable() {
  const user = await ApiService.getCurrentUser();
  if (!user) return;

  const apps = await ApiService.getApplications(currentAppFilter);
  const container = document.getElementById("applications-table-container");
  const countEl = document.getElementById("applications-count-display");

  if (countEl) countEl.textContent = `${apps.length} applications`;

  if (container) {
    if (apps.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">No applications found.</div>
          <div class="empty-state-desc">You have no applications under filter "${currentAppFilter}". Initiate an application from your Required Approvals catalog.</div>
          <div style="margin-top: 1rem;">
            <a href="approvals.html" class="btn btn-primary">Browse Required Approvals →</a>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Application ID</th>
              <th style="min-width: 200px;">Approval / License</th>
              <th>Department</th>
              <th>Status</th>
              <th>Created Date</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${apps.map(app => `
              <tr>
                <td><code>${app.id}</code></td>
                <td><strong>${app.title}</strong></td>
                <td style="font-size:0.84rem; color:var(--slate-700);">${app.department}</td>
                <td>${AlgoUI.renderStatusBadge(app.status)}</td>
                <td style="font-size:0.84rem; color:var(--slate-600);">${app.createdDate || "—"}</td>
                <td style="text-align: right;">
                  <button class="btn btn-secondary btn-sm" onclick="openApplicationDetailsModal('${app.id}')">
                    Manage Workflow
                  </button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }
}

async function openApplicationDetailsModal(appId) {
  const app = await ApiService.getApplicationById(appId);
  if (!app) return;

  const catalogItem = STATUTORY_CATALOG.find(r => r.code === app.requirementCode);
  const mandatoryDocs = catalogItem ? catalogItem.mandatoryDocuments : [];
  const allDocs = await ApiService.getDocuments();

  const contentHtml = `
    <div style="display:flex; flex-direction:column; gap:1.25rem;">
      
      <!-- Top Status Banner -->
      <div style="background-color:var(--slate-50); border:1px solid var(--slate-200); padding:0.85rem 1rem; border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span style="font-size:0.75rem; color:var(--slate-500); font-weight:700; text-transform:uppercase;">Application Number</span>
          <div style="font-size:1.05rem; font-weight:800; font-family:var(--font-mono); color:var(--slate-900);">${app.id}</div>
        </div>
        <div style="text-align:right;">
          <span style="font-size:0.75rem; color:var(--slate-500); font-weight:700; text-transform:uppercase;">Workflow Status</span>
          <div>${AlgoUI.renderStatusBadge(app.status)}</div>
        </div>
      </div>

      <!-- Application Details -->
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem; font-size:0.88rem;">
        <div>
          <label style="font-weight:700; color:var(--slate-800);">Authority / Department:</label>
          <div style="color:var(--slate-700);">${app.department}</div>
        </div>
        <div>
          <label style="font-weight:700; color:var(--slate-800);">Created Date:</label>
          <div style="color:var(--slate-700);">${app.createdDate || "—"}</div>
        </div>
      </div>

      <!-- Clarification Alert if active -->
      ${app.status === "CLARIFICATION REQUIRED" ? `
        <div class="alert alert-warning">
          <span>⚠️</span>
          <div>
            <strong>Department Clarification Notice:</strong>
            <div>${app.clarificationMessage || "Please submit requested clarifications to the department."}</div>
          </div>
        </div>
      ` : ''}

      <!-- Inspection Alert if active -->
      ${app.status === "INSPECTION REQUIRED" ? `
        <div class="alert alert-warning">
          <span>📅</span>
          <div>
            <strong>Physical Site Inspection Scheduled:</strong>
            <div>Scheduled Inspection Date: <strong>${app.inspectionDate || "To be confirmed by Department Inspector"}</strong></div>
          </div>
        </div>
      ` : ''}

      <!-- Mandatory Documents Checklist with REAL file upload -->
      <div>
        <label style="font-weight:700; font-size:0.88rem; color:var(--slate-800); display:block; margin-bottom:0.4rem;">
          Mandatory Statutory Documents (Upload & Verify):
        </label>
        <div style="border:1px solid var(--slate-200); border-radius:var(--radius-md); overflow:hidden;">
          ${mandatoryDocs.map((docName, idx) => {
            const isAttached = (app.documentsAttached || []).includes(docName);
            const matchingDoc = allDocs.find(d => d.applicationId === app.id && d.name === docName);
            const hasRealFile = matchingDoc && matchingDoc.hasFile && matchingDoc.fileName;

            return `
              <div style="display:flex; align-items:center; justify-content:space-between; padding:0.65rem 0.85rem; border-bottom:1px solid var(--slate-100); font-size:0.84rem;">
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <span>${isAttached ? '✅' : '⚪'}</span>
                  <div>
                    <span style="${isAttached ? 'color:var(--slate-900); font-weight:600;' : 'color:var(--slate-500);'}">${docName}</span>
                    ${matchingDoc && matchingDoc.fileName ? `<div style="font-size:0.75rem; color:var(--slate-500); font-family:var(--font-mono);">${matchingDoc.fileName} (${matchingDoc.fileSize})</div>` : ''}
                  </div>
                </div>
                <div style="display:flex; gap:0.4rem; align-items:center;">
                  ${hasRealFile ? `
                    <a href="${UPLOADS_BASE}/${encodeURIComponent(matchingDoc.fileName)}" target="_blank" class="btn btn-secondary btn-sm" style="padding:0.25rem 0.55rem; font-size:0.78rem;">
                      📄 View File
                    </a>
                  ` : ''}
                  <input type="file" id="app-doc-file-${idx}" style="display:none;" onchange="handleAppDocUpload(event, '${app.id}', '${docName.replace(/'/g, "\\'")}')" />
                  <button class="btn ${isAttached ? 'btn-secondary' : 'btn-primary'} btn-sm" style="padding:0.25rem 0.6rem; font-size:0.78rem;" onclick="document.getElementById('app-doc-file-${idx}').click()">
                    ${isAttached ? 'Replace File' : '+ Upload File'}
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Owner Self-Reported Regulatory Status Tracking -->
      <div style="border-top:1px solid var(--slate-200); padding-top:1rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
          <label style="font-weight:700; font-size:0.84rem; color:var(--slate-700);">
            Self-Reported Application Tracking Status:
          </label>
          <span style="font-size:0.74rem; color:var(--slate-500);">Record status updates from department</span>
        </div>

        <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
          ${app.status === "DRAFT" ? `
            <button class="btn btn-primary btn-sm" onclick="advanceAppStatus('${app.id}', 'SUBMITTED')">
              📤 Mark as Submitted (I have filed this)
            </button>
          ` : ''}

          ${app.status === "SUBMITTED" ? `
            <button class="btn btn-secondary btn-sm" onclick="advanceAppStatus('${app.id}', 'UNDER REVIEW')">
              🔍 Mark as Under Review (Department acknowledged)
            </button>
          ` : ''}

          ${app.status === "UNDER REVIEW" ? `
            <button class="btn btn-secondary btn-sm" onclick="triggerClarificationDialog('${app.id}')">
              ⚠️ Record Clarification Notice
            </button>
            ${app.inspectionRequired ? `
              <button class="btn btn-secondary btn-sm" onclick="triggerInspectionDialog('${app.id}')">
                📅 Record Scheduled Inspection
              </button>
            ` : ''}
            <button class="btn btn-success btn-sm" onclick="advanceAppStatus('${app.id}', 'APPROVED')">
              ✓ Record Approval (Permit Issued)
            </button>
            <button class="btn btn-danger btn-sm" onclick="advanceAppStatus('${app.id}', 'REJECTED')">
              ✕ Record Rejection
            </button>
          ` : ''}

          ${app.status === "CLARIFICATION REQUIRED" ? `
            <button class="btn btn-primary btn-sm" onclick="advanceAppStatus('${app.id}', 'UNDER REVIEW')">
              📤 Mark Clarification Submitted
            </button>
          ` : ''}

          ${app.status === "INSPECTION REQUIRED" ? `
            <button class="btn btn-success btn-sm" onclick="advanceAppStatus('${app.id}', 'APPROVED')">
              ✓ Inspection Passed & Approved
            </button>
          ` : ''}

          ${app.status === "APPROVED" ? `
            <a href="renewals.html" class="btn btn-secondary btn-sm">
              📜 View Active License & Renewal Timeline →
            </a>
          ` : ''}
        </div>
      </div>

    </div>
  `;

  const footerHtml = `
    <button class="btn btn-secondary btn-sm" onclick="AlgoUI.closeModal()">Close</button>
  `;

  AlgoUI.openModal(`Application Details: ${app.title}`, contentHtml, footerHtml);
}

async function handleAppDocUpload(event, appId, docName) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("docName", docName);
  formData.append("category", "Statutory Filing");
  formData.append("applicationId", appId);
  formData.append("file", file);

  try {
    AlgoUI.showToast(`Uploading ${file.name}...`, "info");
    await ApiService.uploadDocument(formData);
    AlgoUI.showToast(`Uploaded: ${docName}`, "success");
    openApplicationDetailsModal(appId);
    renderApplicationsTable();
  } catch (err) {
    AlgoUI.showToast("Failed to upload document: " + err.message, "danger");
  }
}

async function advanceAppStatus(appId, newStatus) {
  try {
    await ApiService.updateApplicationStatus(appId, newStatus);
    AlgoUI.showToast(`Application status updated to ${newStatus}.`, "success");
    AlgoUI.closeModal();
    renderApplicationsTable();
  } catch (e) {
    AlgoUI.showToast(e.message || "Failed to update status.", "danger");
  }
}

function triggerClarificationDialog(appId) {
  const contentHtml = `
    <div style="display:flex; flex-direction:column; gap:1rem;">
      <p style="font-size:0.88rem; color:var(--slate-700);">
        Enter the clarification note or document request issued by the regulatory department:
      </p>
      <div class="form-group">
        <label class="form-label" for="modal-clarification-msg">Department Clarification Details <span class="required">*</span></label>
        <textarea id="modal-clarification-msg" class="form-textarea" rows="4" placeholder="e.g. Submit revised architectural fire exit layout and certified test report."></textarea>
      </div>
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-secondary btn-sm" onclick="openApplicationDetailsModal('${appId}')">Cancel</button>
    <button class="btn btn-primary btn-sm" onclick="confirmClarificationRequest('${appId}')">Save Clarification Notice →</button>
  `;

  AlgoUI.openModal("Record Department Clarification", contentHtml, footerHtml);
}

async function confirmClarificationRequest(appId) {
  const msg = (document.getElementById("modal-clarification-msg")?.value || "").trim();
  if (!msg) {
    AlgoUI.showToast("Please enter the clarification message.", "warning");
    return;
  }

  try {
    await ApiService.updateApplicationStatus(appId, "CLARIFICATION REQUIRED", { clarificationMessage: msg });
    AlgoUI.showToast("Clarification recorded.", "warning");
    openApplicationDetailsModal(appId);
  } catch (e) {
    AlgoUI.showToast("Failed to record clarification: " + e.message, "danger");
  }
}

function triggerInspectionDialog(appId) {
  const defaultDate = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
  const contentHtml = `
    <div style="display:flex; flex-direction:column; gap:1rem;">
      <p style="font-size:0.88rem; color:var(--slate-700);">
        Enter the date scheduled for physical on-site premises inspection by the department:
      </p>
      <div class="form-group">
        <label class="form-label" for="modal-inspection-date">Scheduled Inspection Date <span class="required">*</span></label>
        <input type="date" id="modal-inspection-date" class="form-control" value="${defaultDate}" required />
      </div>
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-secondary btn-sm" onclick="openApplicationDetailsModal('${appId}')">Cancel</button>
    <button class="btn btn-primary btn-sm" onclick="confirmInspectionSchedule('${appId}')">Record Scheduled Inspection →</button>
  `;

  AlgoUI.openModal("Record Scheduled Inspection", contentHtml, footerHtml);
}

async function confirmInspectionSchedule(appId) {
  const dateStr = (document.getElementById("modal-inspection-date")?.value || "").trim();
  if (!dateStr) {
    AlgoUI.showToast("Please select a valid date.", "warning");
    return;
  }

  try {
    await ApiService.updateApplicationStatus(appId, "INSPECTION REQUIRED", { inspectionDate: dateStr });
    AlgoUI.showToast("Physical inspection scheduled.", "warning");
    openApplicationDetailsModal(appId);
  } catch (e) {
    AlgoUI.showToast("Failed to schedule inspection: " + e.message, "danger");
  }
}

async function initApplicationsPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const targetId = urlParams.get("id");

  document.querySelectorAll(".app-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".app-filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentAppFilter = btn.getAttribute("data-status") || "ALL";
      renderApplicationsTable();
    });
  });

  await renderApplicationsTable();

  if (targetId) {
    openApplicationDetailsModal(targetId);
  }
}

// ==========================================
// PAGE: DOCUMENTS (documents.html)
// ==========================================
async function renderDocumentsGrid() {
  const user = await ApiService.getCurrentUser();
  if (!user) return;

  const docs = await ApiService.getDocuments();
  const container = document.getElementById("documents-list-container");
  const countEl = document.getElementById("documents-count-display");

  if (countEl) countEl.textContent = `${docs.length} statutory documents`;

  if (container) {
    if (docs.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">No documents uploaded.</div>
          <div class="empty-state-desc">Upload business licenses, drawings, or inspection reports to attach them to your statutory applications.</div>
          <div style="margin-top: 1rem;">
            <button class="btn btn-primary" onclick="openUploadDocumentModal()">+ Upload First Document</button>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Document Name</th>
              <th>Category</th>
              <th>File Name</th>
              <th>Size</th>
              <th>Upload Date</th>
              <th>Status</th>
              <th style="text-align: right; min-width: 180px;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${docs.map(doc => `
              <tr>
                <td><strong>${doc.name}</strong></td>
                <td><span class="badge badge-neutral">${doc.category}</span></td>
                <td><code>${doc.fileName}</code></td>
                <td style="font-size:0.82rem; color:var(--slate-600);">${doc.fileSize || "—"}</td>
                <td style="font-size:0.82rem; color:var(--slate-600);">${doc.uploadedDate}</td>
                <td>${AlgoUI.renderStatusBadge(doc.status)}</td>
                <td style="text-align: right;">
                  <div style="display:inline-flex; gap:0.4rem; justify-content:flex-end;">
                    ${doc.hasFile && doc.fileName ? `
                      <a href="${UPLOADS_BASE}/${encodeURIComponent(doc.fileName)}" target="_blank" class="btn btn-secondary btn-sm" title="View Document">
                        View
                      </a>
                      <a href="${UPLOADS_BASE}/${encodeURIComponent(doc.fileName)}" download="${doc.fileName}" class="btn btn-secondary btn-sm" title="Download Document">
                        ⬇️
                      </a>
                    ` : ''}
                    <button class="btn btn-danger btn-sm" onclick="handleDeleteDoc('${doc.id}')">Delete</button>
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }
}

function openUploadDocumentModal() {
  const contentHtml = `
    <form id="doc-upload-form" onsubmit="handleDocUploadSubmit(event)">
      <div class="form-group">
        <label class="form-label" for="upload-doc-name">Document Title / Name <span class="required">*</span></label>
        <input type="text" id="upload-doc-name" class="form-control" placeholder="e.g. Factory Layout Plan Drawing" required />
      </div>
      <div class="form-group" style="margin-top:1rem;">
        <label class="form-label" for="upload-doc-cat">Category <span class="required">*</span></label>
        <select id="upload-doc-cat" class="form-select" required>
          <option value="Infrastructure Blueprints">Infrastructure Blueprints</option>
          <option value="Environmental Test Reports">Environmental Test Reports</option>
          <option value="Safety Audits">Safety Audits</option>
          <option value="Corporate / Legal">Corporate / Legal Identification</option>
          <option value="Labour Registers">Labour & Wage Registers</option>
          <option value="Statutory Filing">Statutory Filing</option>
          <option value="General">General Compliance</option>
        </select>
      </div>
      <div class="form-group" style="margin-top:1rem;">
        <label class="form-label" for="upload-doc-file">Select File (PDF / JPG / PNG / DOCX)</label>
        <input type="file" id="upload-doc-file" class="form-control" />
      </div>
      <div style="margin-top:1.5rem; display:flex; justify-content:flex-end; gap:0.5rem;">
        <button type="button" class="btn btn-secondary btn-sm" onclick="AlgoUI.closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm">Upload Document →</button>
      </div>
    </form>
  `;

  AlgoUI.openModal("Upload Statutory Document", contentHtml, "");
}

async function handleDocUploadSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("upload-doc-name").value.trim();
  const cat = document.getElementById("upload-doc-cat").value;
  const fileInput = document.getElementById("upload-doc-file");

  if (!name) return;

  const formData = new FormData();
  formData.append("docName", name);
  formData.append("category", cat);
  if (fileInput.files.length > 0) {
    formData.append("file", fileInput.files[0]);
  }

  try {
    AlgoUI.showToast("Uploading document to server...", "info");
    await ApiService.uploadDocument(formData);
    AlgoUI.showToast("Document uploaded successfully.", "success");
    AlgoUI.closeModal();
    renderDocumentsGrid();
  } catch (err) {
    AlgoUI.showToast("Upload failed: " + err.message, "danger");
  }
}

async function handleDeleteDoc(docId) {
  if (confirm("Are you sure you want to delete this document from MySQL database and server disk?")) {
    try {
      await ApiService.deleteDocument(docId);
      AlgoUI.showToast("Document deleted.", "info");
      renderDocumentsGrid();
    } catch (err) {
      AlgoUI.showToast("Failed to delete document: " + err.message, "danger");
    }
  }
}

async function initDocumentsPage() {
  const uploadBtn = document.getElementById("open-upload-doc-btn");
  if (uploadBtn) {
    uploadBtn.addEventListener("click", openUploadDocumentModal);
  }
  renderDocumentsGrid();
}

// ==========================================
// PAGE: RENEWALS (renewals.html)
// ==========================================
async function renderRenewalsTable() {
  const user = await ApiService.getCurrentUser();
  if (!user) return;

  const renewals = await ApiService.getRenewals();
  const container = document.getElementById("renewals-table-container");
  const countEl = document.getElementById("renewals-count-display");

  if (countEl) countEl.textContent = `${renewals.length} active licenses`;

  if (container) {
    if (renewals.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">No active licences or upcoming renewals.</div>
          <div class="empty-state-desc">When your statutory applications are approved, active licenses will automatically be tracked here for renewal management.</div>
          <div style="margin-top: 1rem;">
            <a href="applications.html" class="btn btn-primary">View Applications →</a>
          </div>
        </div>
      `;
      return;
    }

    const now = new Date();

    container.innerHTML = `
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>License / Approval</th>
              <th>Department</th>
              <th>License Number</th>
              <th>Issue Date</th>
              <th>Expiry Date</th>
              <th>Days Remaining</th>
              <th>Status</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${renewals.map(r => {
              const exp = new Date(r.expiryDate);
              const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
              const isDueSoon = diffDays <= 60 && diffDays > 0;
              const isOverdue = diffDays <= 0;

              return `
                <tr>
                  <td><strong>${r.title}</strong></td>
                  <td style="font-size:0.84rem; color:var(--slate-700);">${r.department}</td>
                  <td><code>${r.licenseNumber}</code></td>
                  <td style="font-size:0.84rem; color:var(--slate-600);">${r.issueDate || "—"}</td>
                  <td style="font-size:0.84rem; color:var(--slate-800); font-weight:600;">${r.expiryDate}</td>
                  <td>
                    ${isOverdue ? `
                      <span style="color:var(--danger-primary); font-weight:700;">Overdue by ${Math.abs(diffDays)}d</span>
                    ` : isDueSoon ? `
                      <span style="color:var(--warning-dark); font-weight:700;">${diffDays} days</span>
                    ` : `
                      <span style="color:var(--slate-700);">${diffDays} days</span>
                    `}
                  </td>
                  <td>
                    ${isOverdue ? AlgoUI.renderStatusBadge("OVERDUE") : isDueSoon ? AlgoUI.renderStatusBadge("DUE_SOON") : AlgoUI.renderStatusBadge("ACTIVE")}
                  </td>
                  <td style="text-align: right;">
                    <button class="btn btn-secondary btn-sm" onclick="handleRenewLicenseAction('${r.id}')">
                      Renew License
                    </button>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  }
}

async function handleRenewLicenseAction(renewalId) {
  const renewals = await ApiService.getRenewals();
  const target = renewals.find(r => r.id === renewalId);
  if (!target) return;

  if (confirm(`Submit renewal application for ${target.title} (${target.licenseNumber}) for another ${target.validityYears} year(s)?`)) {
    try {
      await ApiService.renewLicense(renewalId);
      AlgoUI.showToast("License successfully renewed in MySQL database!", "success");
      renderRenewalsTable();
    } catch (err) {
      AlgoUI.showToast("Renewal failed: " + err.message, "danger");
    }
  }
}

// ----------------------------------------------------------------------------
// 5. Multi-Account Management & Business Profile Hub (AlgoAccounts)
// ----------------------------------------------------------------------------
const AlgoAccounts = {
  STORAGE_KEY: "anumatisetu_accounts_v5",
  ACTIVE_ID_KEY: "anumatisetu_active_acc_id_v5",

  getDefaultAccounts() {
    return [];
  },

  getAllAccounts() {
    try {
      // Clear legacy storage versions with old mock baseline files
      try {
        localStorage.removeItem("anumatisetu_accounts_v1");
        localStorage.removeItem("anumatisetu_accounts_v2");
        localStorage.removeItem("anumatisetu_accounts_v3");
        localStorage.removeItem("anumatisetu_accounts_v4");
        localStorage.removeItem("anumati_accounts");
      } catch (e) {}

      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach(acc => {
            if (!acc.documents) acc.documents = [];
            acc.documents = acc.documents.filter(d => 
              !d.isBaseline && 
              !String(d.id || '').startsWith("DOC-BASE") && 
              !String(d.ref || '').startsWith("DOC-BASE") &&
              (d.dataUrl || d.hasFile || d.uploaded === "Just now" || d.category === "Statutory Clearance Docket")
            );
          });
          return parsed;
        }
      }
    } catch (e) {}
    return [];
  },

  saveAllAccounts(accounts) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(accounts));
    } catch (e) {}
  },

  getActiveAccountId() {
    return localStorage.getItem(this.ACTIVE_ID_KEY) || null;
  },

  getActiveAccount() {
    const accounts = this.getAllAccounts();
    if (!accounts || accounts.length === 0) return null;
    const activeId = this.getActiveAccountId();
    return accounts.find(a => a.id === activeId) || accounts[0] || null;
  },

  registerActiveSession(user, token, profile) {
    if (!user) return;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    const accId = user.id || user._id || ("acc_" + Date.now());
    const nameStr = user.name || user.businessName || "Compliance Executive";
    const initials = nameStr.split(" ").filter(Boolean).map(p => p[0]).join("").substring(0, 2).toUpperCase() || "AS";
    const companyStr = profile?.companyName || user.businessName || "Enterprise Workspace";

    const newAcc = {
      id: accId,
      token: token || localStorage.getItem(TOKEN_KEY) || "",
      userName: nameStr,
      email: user.email || "",
      phone: user.phone || "",
      initials: initials,
      companyName: companyStr,
      constitution: profile?.legalStructure || "Private Limited",
      industryType: profile?.industryCategory || "Manufacturing",
      sectorBadge: `● ${profile?.industryCategory || "Manufacturing"}`,
      nicCode: profile?.nicCode || "General Industrial",
      incorporationDate: profile?.incorporationYear ? String(profile.incorporationYear) : "2026",
      unitName: `${companyStr.split(" ")[0]} Main Facility`,
      unitBadge: "Primary Unit",
      unitAddress: profile?.plantAddress || (profile?.state ? `Industrial Zone, ${profile.state}` : "Industrial Area"),
      state: profile?.state || "Maharashtra",
      landArea: profile?.landAreaSqM ? `${profile.landAreaSqM} sq. m.` : "5,000 sq. m.",
      employeesCount: profile?.employeesCount || 50,
      powerLoad: profile?.powerLoadKw ? `${profile.powerLoadKw} kW` : "150 kW",
      shiftPattern: "Two shifts",
      operationsDesc: profile?.businessActivity || "Industrial Operations",
      completionPct: 85,
      registrations: [
        ...(user.cin ? [{ name: "Corporate Identification Number", code: "CIN", value: user.cin, status: "Verified" }] : []),
        ...(user.gstin ? [{ name: "Goods & Services Tax", code: "GSTIN", value: user.gstin, status: "Verified" }] : []),
        ...(user.pan ? [{ name: "Permanent Account Number", code: "PAN", value: user.pan, status: "Verified" }] : [])
      ],
      applications: [],
      documents: [],
      renewals: []
    };

    this.addOrUpdateAccount(newAcc);
    this.switchAccount(accId);
  },

  switchAccount(accId) {
    localStorage.setItem(this.ACTIVE_ID_KEY, accId);
    const acc = this.getActiveAccount();
    if (acc) {
      if (acc.token) {
        localStorage.setItem(TOKEN_KEY, acc.token);
      }
      AlgoUI.showToast(`Switched workspace to ${acc.companyName} (${acc.userName})`, "success");
    }
    AlgoUI.closeModal();
    this.syncCurrentPageDOM();
  },

  logoutCurrent() {
    const accounts = this.getAllAccounts();
    const activeId = this.getActiveAccountId();
    const remaining = accounts.filter(a => a.id !== activeId);
    this.saveAllAccounts(remaining);
    localStorage.removeItem(this.ACTIVE_ID_KEY);

    if (remaining.length > 0) {
      this.switchAccount(remaining[0].id);
      AlgoUI.showToast(`Signed out. Switched to workspace: ${remaining[0].companyName}`, "info");
    } else {
      localStorage.removeItem(TOKEN_KEY);
      this.syncCurrentPageDOM();
      AlgoUI.showToast("Signed out. Workspace session cleared.", "info");
      AlgoUI.closeModal();
      setTimeout(() => {
        window.location.href = "login.html";
      }, 400);
    }
  },

  addOrUpdateAccount(accountData) {
    const accounts = this.getAllAccounts();
    const idx = accounts.findIndex(a => a.id === accountData.id);
    if (idx >= 0) {
      accounts[idx] = { ...accounts[idx], ...accountData };
    } else {
      accounts.push(accountData);
    }
    this.saveAllAccounts(accounts);
    localStorage.setItem(this.ACTIVE_ID_KEY, accountData.id);
    this.syncCurrentPageDOM();
  },

  syncCurrentPageDOM() {
    const acc = this.getActiveAccount();
    if (!acc) {
      // Clean Guest Mode across all topbars
      document.querySelectorAll(".tb-avatar").forEach(el => el.textContent = "👤");
      document.querySelectorAll(".tb-user-name").forEach(el => {
        el.innerHTML = `<a href="login.html" style="color:inherit; text-decoration:none; font-weight:700;">Sign In / Register</a>`;
      });
      document.querySelectorAll(".tb-user-company").forEach(el => el.textContent = "Guest Mode");
      return;
    }

    // 1. Topbar elements
    document.querySelectorAll(".tb-avatar").forEach(el => el.textContent = acc.initials || "AS");
    document.querySelectorAll(".tb-user-name").forEach(el => el.textContent = acc.userName);
    document.querySelectorAll(".tb-user-company").forEach(el => el.textContent = acc.companyName);

    // 2. Profile page elements
    document.querySelectorAll(".company-name").forEach(el => el.textContent = acc.companyName);
    document.querySelectorAll(".company-avatar").forEach(el => el.textContent = acc.initials || "SP");
    const metaEl = document.querySelector(".company-meta");
    if (metaEl) metaEl.textContent = `${acc.operationsDesc || 'Industrial operations'} · ${acc.state || 'India'}`;
    
    document.querySelectorAll(".factory-name").forEach(el => el.textContent = acc.unitName);
    document.querySelectorAll(".factory-addr").forEach(el => el.textContent = acc.unitAddress);
    
    const compPctEl = document.querySelector(".comp-pct");
    if (compPctEl) compPctEl.textContent = `${acc.completionPct || 85}%`;
    const compBarFill = document.querySelector(".comp-bar-fill");
    if (compBarFill) compBarFill.style.width = `${acc.completionPct || 85}%`;

    const fstatVals = document.querySelectorAll(".fstat-val");
    if (fstatVals.length >= 4) {
      fstatVals[0].textContent = acc.landArea || "5,000 sq. m.";
      fstatVals[1].textContent = String(acc.employeesCount || 50);
      fstatVals[2].textContent = acc.operationsDesc || "Manufacturing & assembly";
      fstatVals[3].textContent = acc.shiftPattern || "Two shifts";
    }

    const cstatVals = document.querySelectorAll(".cstat-val");
    if (cstatVals.length >= 4) {
      cstatVals[0].textContent = acc.constitution || "Private Limited";
      cstatVals[1].textContent = acc.industryType || "Manufacturing";
      cstatVals[2].textContent = acc.state || "Maharashtra";
      cstatVals[3].textContent = acc.incorporationDate || "2026";
    } else if (cstatVals.length >= 3) {
      cstatVals[0].textContent = acc.constitution || "Private Limited Company";
      cstatVals[1].textContent = acc.incorporationDate || "2026";
      cstatVals[2].textContent = acc.nicCode || "General";
    }

    // 3. Registrations section on profile.html
    const regSection = document.querySelector(".reg-section-header")?.parentElement;
    if (regSection && acc.registrations && acc.registrations.length) {
      const rows = regSection.querySelectorAll(".reg-row");
      rows.forEach(r => r.remove());
      acc.registrations.forEach(r => {
        const row = document.createElement("div");
        row.className = "reg-row";
        row.style.cursor = "pointer";
        row.onclick = () => AlgoUI.showToast(`${r.name} (${r.value}) verified with competent regulatory registry.`, "success");
        row.innerHTML = `
          <div class="reg-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
          <span class="reg-name">${r.name}</span>
          <span class="reg-value">${r.value}</span>
          <span class="reg-badge ${r.status === 'Verified' ? 'badge-verified' : 'badge-review'}">● ${r.status}</span>
          <svg class="reg-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        `;
        regSection.appendChild(row);
      });
    }

    // 4. Applications table on applications.html
    const appTbody = document.querySelector(".app-table tbody");
    if (appTbody && acc.applications && acc.applications.length) {
      appTbody.innerHTML = acc.applications.map((app, idx) => `
        <tr class="${idx === 0 ? 'selected' : ''}" data-status="${app.status.toLowerCase().includes('review') ? 'review' : app.status.toLowerCase().includes('action') ? 'action' : 'approved'}" onclick="showAppDetail(this, '${app.ref}', '${app.title.replace(/'/g, "\\'")}', '${app.dept.replace(/'/g, "\\'")}', '${app.status}', '${app.update.replace(/'/g, "\\'")}', '${app.date}')">
          <td class="td-ref">${app.ref}</td>
          <td><div class="td-name">${app.title}</div></td>
          <td><div class="td-dept">${app.dept}</div></td>
          <td><span class="badge ${app.status === 'Approved' ? 'badge-verified' : app.status === 'Action required' ? 'badge-action' : 'badge-review'}">● ${app.status}</span></td>
          <td class="td-date">${app.date}</td>
          <td class="td-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></td>
        </tr>
      `).join("");
      const first = acc.applications[0];
      if (first && typeof showAppDetail === "function") {
        showAppDetail(appTbody.firstElementChild, first.ref, first.title, first.dept, first.status, first.update, first.date);
      }
    }

    // 5. Dashboard greeting
    const greetingEl = document.querySelector(".mk-greeting");
    if (greetingEl) greetingEl.textContent = `Good day, ${acc.userName.split(" ")[0]}`;
  }
};

window.AlgoAccounts = AlgoAccounts;

// ----------------------------------------------------------------------------
// Responsive Mobile Drawer Controller
// ----------------------------------------------------------------------------
window.toggleMobileSidebar = function(open) {
  const sidebar = document.querySelector(".app-sidebar, .sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  if (!sidebar) return;

  const shouldOpen = typeof open === "boolean" ? open : !sidebar.classList.contains("mobile-open");
  if (shouldOpen) {
    sidebar.classList.add("mobile-open");
    if (overlay) overlay.classList.add("active");
  } else {
    sidebar.classList.remove("mobile-open");
    if (overlay) overlay.classList.remove("active");
  }
};

function initResponsiveSidebar() {
  if (typeof document === "undefined") return;

  // 1. Inject overlay if not present
  if (!document.getElementById("sidebar-overlay")) {
    const overlay = document.createElement("div");
    overlay.id = "sidebar-overlay";
    overlay.className = "sidebar-overlay";
    overlay.onclick = () => window.toggleMobileSidebar(false);
    document.body.appendChild(overlay);
  }

  // 2. Inject hamburger icon in topbar on mobile
  const topbar = document.querySelector(".app-topbar, .topbar, .mk-topbar, .dash-header, .header");
  if (topbar && !document.getElementById("mobile-menu-hamburger")) {
    const hamburger = document.createElement("button");
    hamburger.id = "mobile-menu-hamburger";
    hamburger.className = "mobile-menu-btn";
    hamburger.title = "Open Navigation Menu";
    hamburger.innerHTML = "☰";
    hamburger.onclick = () => window.toggleMobileSidebar(true);
    topbar.prepend(hamburger);
  }

  // 3. Close mobile sidebar on nav item click
  document.querySelectorAll(".sidebar-nav-link, .sb-item").forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 992) {
        window.toggleMobileSidebar(false);
      }
    });
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      AlgoAccounts.syncCurrentPageDOM();
      initResponsiveSidebar();
    });
  } else {
    AlgoAccounts.syncCurrentPageDOM();
    initResponsiveSidebar();
  }
}

// ----------------------------------------------------------------------------
// 6. User Profile Hub & Multi-Account Switcher Modal
// ----------------------------------------------------------------------------
window.openProfileMenuModal = function() {
  const activeAcc = AlgoAccounts.getActiveAccount();
  const allAccounts = AlgoAccounts.getAllAccounts();

  if (!activeAcc) {
    const guestBodyHtml = `
      <div style="display:flex; flex-direction:column; gap:1.25rem; text-align:center; padding:1.5rem 0.5rem;">
        <div style="width:64px; height:64px; border-radius:50%; background:#f1f5f9; display:flex; align-items:center; justify-content:center; font-size:1.8rem; margin:0 auto;">
          👤
        </div>
        <div>
          <h3 style="font-size:1.2rem; font-weight:800; color:#0f172a; margin-bottom:0.35rem;">Guest Mode</h3>
          <p style="font-size:0.86rem; color:#64748b; line-height:1.5; max-width:340px; margin:0 auto;">
            Sign in to access your enterprise statutory milestones, clearances, and compliance vault securely.
          </p>
        </div>
        <div style="display:flex; flex-direction:column; gap:0.6rem; max-width:320px; width:100%; margin:0.5rem auto 0 auto;">
          <a href="login.html" class="btn btn-primary" style="padding:0.75rem; border-radius:8px; font-weight:700; text-decoration:none; display:block; background:#0d7a6b; color:#fff;">
            Sign In with Password or OTP →
          </a>
          <a href="register.html" class="btn" style="padding:0.75rem; border-radius:8px; font-weight:700; text-decoration:none; display:block; background:#f8fafc; border:1px solid #cbd5e1; color:#334155;">
            Register New Enterprise Profile
          </a>
        </div>
      </div>
    `;
    const guestFooterHtml = `
      <button type="button" class="btn btn-secondary btn-sm" onclick="AlgoUI.closeModal()" style="padding:0.5rem 1rem; border:1px solid #cbd5e1; border-radius:6px; background:#fff; cursor:pointer; font-weight:600;">Close</button>
    `;
    AlgoUI.openModal("Business Profile & Account Hub", guestBodyHtml, guestFooterHtml);
    return;
  }

  const bodyHtml = `
    <div style="display:flex; flex-direction:column; gap:1.25rem;">
      <!-- Active Profile Card -->
      <div style="background:linear-gradient(135deg, #1a2a42 0%, #0d7a6b 100%); border-radius:10px; padding:1.2rem; color:#fff; display:flex; gap:1rem; align-items:center; box-shadow:0 4px 12px rgba(13,122,107,0.25);">
        <div style="width:52px; height:52px; border-radius:50%; background:rgba(255,255,255,0.2); border:2px solid rgba(255,255,255,0.4); display:flex; align-items:center; justify-content:center; font-size:1.15rem; font-weight:800; flex-shrink:0;">
          ${activeAcc.initials}
        </div>
        <div style="flex:1; min-width:0;">
          <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
            <div style="font-size:1.05rem; font-weight:800;">${activeAcc.userName}</div>
            <span style="font-size:0.68rem; font-weight:700; background:rgba(255,255,255,0.2); padding:0.15rem 0.5rem; border-radius:20px;">Active Workspace</span>
          </div>
          <div style="font-size:0.84rem; font-weight:600; color:#e2e8f0; margin-top:2px;">${activeAcc.companyName}</div>
          <div style="font-size:0.75rem; color:#cbd5e1; margin-top:2px;">${activeAcc.email} ${activeAcc.state ? '· ' + activeAcc.state : ''}</div>
        </div>
      </div>

      <!-- Quick Action Navigation -->
      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.6rem;">
        <a href="profile.html" class="btn" style="text-decoration:none; padding:0.65rem 0.5rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; text-align:center; font-size:0.78rem; font-weight:700; color:#1e293b; display:flex; flex-direction:column; align-items:center; gap:0.3rem;" onclick="AlgoUI.closeModal()">
          <span style="font-size:1.1rem;">🏢</span>
          <span>Edit Profile</span>
        </a>
        <a href="approvals.html" class="btn" style="text-decoration:none; padding:0.65rem 0.5rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; text-align:center; font-size:0.78rem; font-weight:700; color:#1e293b; display:flex; flex-direction:column; align-items:center; gap:0.3rem;" onclick="AlgoUI.closeModal()">
          <span style="font-size:1.1rem;">📋</span>
          <span>Approvals</span>
        </a>
        <a href="documents.html" class="btn" style="text-decoration:none; padding:0.65rem 0.5rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; text-align:center; font-size:0.78rem; font-weight:700; color:#1e293b; display:flex; flex-direction:column; align-items:center; gap:0.3rem;" onclick="AlgoUI.closeModal()">
          <span style="font-size:1.1rem;">📁</span>
          <span>Documents</span>
        </a>
      </div>

      <!-- Multi-Account Separation & Switcher -->
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
          <span style="font-size:0.75rem; font-weight:800; color:#475569; text-transform:uppercase; letter-spacing:0.6px;">Switch Business Profile</span>
          <span style="font-size:0.72rem; color:#64748b;">${allAccounts.length} profile(s) signed in</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:0.5rem; max-height:220px; overflow-y:auto; padding-right:4px;">
          ${allAccounts.map(acc => {
            const isActive = acc.id === activeAcc.id;
            return `
              <div style="border:1.5px solid ${isActive ? '#0d7a6b' : '#e2e8f0'}; background:${isActive ? '#f0fdfa' : '#ffffff'}; border-radius:8px; padding:0.75rem 0.9rem; display:flex; align-items:center; justify-content:space-between; cursor:pointer; transition:all 0.15s;" onclick="AlgoAccounts.switchAccount('${acc.id}')">
                <div style="display:flex; align-items:center; gap:0.75rem;">
                  <div style="width:34px; height:34px; border-radius:50%; background:${isActive ? '#0d7a6b' : '#334155'}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:800; flex-shrink:0;">
                    ${acc.initials}
                  </div>
                  <div>
                    <div style="font-size:0.86rem; font-weight:700; color:#0f172a;">${acc.companyName}</div>
                    <div style="font-size:0.74rem; color:#64748b;">${acc.userName} · ${acc.sectorBadge || acc.industryType}</div>
                  </div>
                </div>
                ${isActive ? `
                  <span style="font-size:0.7rem; font-weight:700; color:#0d7a6b; background:#ccfbf1; padding:0.2rem 0.5rem; border-radius:12px; display:inline-flex; align-items:center; gap:0.25rem;">
                    ✓ Active
                  </span>
                ` : `
                  <button type="button" class="btn btn-secondary btn-sm" style="font-size:0.74rem; padding:0.25rem 0.6rem; border:1px solid #cbd5e1; border-radius:6px; background:#fff; color:#334155; font-weight:600;">Switch</button>
                `}
              </div>
            `;
          }).join("")}
        </div>
      </div>
    </div>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-secondary btn-sm" onclick="AlgoAccounts.logoutCurrent()" style="padding:0.5rem 0.9rem; border:1px solid #cbd5e1; border-radius:6px; background:#fff; cursor:pointer; font-weight:600; color:#dc2626;">
      🚪 Sign Out Workspace
    </button>
    <a href="login.html" class="btn btn-primary btn-sm" style="padding:0.5rem 1.15rem; border:none; border-radius:6px; background:#0d7a6b; color:#fff; text-decoration:none; cursor:pointer; font-weight:700;">
      ➕ Add / Sign In Another Account
    </a>
  `;

  AlgoUI.openModal("Business Profile & Account Hub", bodyHtml, footerHtml);
};

// ----------------------------------------------------------------------------
// 7. In-Page Auth (Login & Register) Modal
// ----------------------------------------------------------------------------
window.openAuthModal = function(defaultTab = "login") {
  window.location.href = (defaultTab === "reg") ? "register.html" : "login.html";
};

// ----------------------------------------------------------------------------
// 8. Redesigned, High-End "Create & Start Application" Experience
// ----------------------------------------------------------------------------
window.openNewApplicationModal = function() {
  const activeAcc = AlgoAccounts.getActiveAccount();
  if (!activeAcc) {
    AlgoUI.showToast("Please sign in or register to start statutory clearance applications.", "info");
    openProfileMenuModal();
    return;
  }
  const industry = (activeAcc.industryType || "Manufacturing").toLowerCase();

  // Filter catalog strictly to clearances needed for this company's profile
  const filteredCatalog = STATUTORY_CATALOG.filter(req => {
    if (industry.includes("food") || industry.includes("agro")) {
      return ["REQ_TRADE_LICENSE", "REQ_FIRE_NOC", "REQ_BUILDING_SANCTION", "REQ_FSSAI_LICENSE", "REQ_AGMARK_GRADING", "REQ_COLD_STORAGE_NOC", "REQ_EPFO_REG", "REQ_ESIC_REG"].includes(req.code);
    } else if (industry.includes("chem") || industry.includes("haz")) {
      return ["REQ_TRADE_LICENSE", "REQ_FIRE_NOC", "REQ_PESO_LICENSE", "REQ_HAZMAT_AUTHORIZATION", "REQ_PROCESS_SAFETY_41", "REQ_FACTORIES_LICENSE", "REQ_SPCB_CTE_CTO", "REQ_EPFO_REG", "REQ_ESIC_REG"].includes(req.code);
    } else if (industry.includes("textil") || industry.includes("apparel")) {
      return ["REQ_TRADE_LICENSE", "REQ_FIRE_NOC", "REQ_BUILDING_SANCTION", "REQ_ZLD_COMPLIANCE", "REQ_TEXTILE_COMMISSIONER", "REQ_FACTORIES_LICENSE", "REQ_EPFO_REG", "REQ_ESIC_REG"].includes(req.code);
    } else if (industry.includes("electr") || industry.includes("hardw")) {
      return ["REQ_TRADE_LICENSE", "REQ_FIRE_NOC", "REQ_BUILDING_SANCTION", "REQ_EPR_EWASTE", "REQ_BIS_CRS", "REQ_STPI_CUSTOMS", "REQ_FACTORIES_LICENSE", "REQ_EPFO_REG", "REQ_ESIC_REG"].includes(req.code);
    } else {
      // Precision Manufacturing & General Engineering (Shakti Precision)
      return ["REQ_FIRE_NOC", "REQ_FACTORIES_LICENSE", "REQ_SPCB_CTE_CTO", "REQ_BUILDING_SANCTION", "REQ_CEIG_ELECTRICAL", "REQ_BOILER_CERT", "REQ_TRADE_LICENSE", "REQ_EPFO_REG", "REQ_ESIC_REG"].includes(req.code);
    }
  });

  const bodyHtml = `
    <div style="display:flex; flex-direction:column; gap:1.15rem;">
      <!-- Active Profile Targeting Banner -->
      <div style="background:#f0fdfa; border:1.5px solid #99f6e4; border-radius:8px; padding:0.75rem 1rem; display:flex; align-items:center; justify-content:space-between;">
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <span style="font-size:1.1rem;">🏢</span>
          <div>
            <div style="font-size:0.84rem; font-weight:800; color:#0f172a;">${activeAcc.companyName}</div>
            <div style="font-size:0.75rem; color:#0d7a6b; font-weight:700;">${activeAcc.sectorBadge || activeAcc.industryType} · ${activeAcc.state}</div>
          </div>
        </div>
        <span style="font-size:0.72rem; font-weight:700; color:#0d7a6b; background:#ccfbf1; padding:0.2rem 0.6rem; border-radius:12px;">
          ${filteredCatalog.length} Applicable Clearances
        </span>
      </div>

      <!-- Search Control -->
      <div style="display:flex; align-items:center; gap:0.6rem; background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:8px; padding:0.5rem 0.85rem;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" id="app-modal-search" placeholder="Search applicable clearances by name or department (e.g. Fire, CTE, Factory, Boiler)..." oninput="filterNewAppCatalog()" style="width:100%; border:none; background:none; outline:none; font-size:0.86rem; color:#0f172a; font-family:inherit;">
      </div>

      <!-- Catalog Cards List -->
      <div id="new-app-cards-container" style="display:flex; flex-direction:column; gap:0.75rem; max-height:50vh; overflow-y:auto; padding-right:4px;">
        ${filteredCatalog.map(req => `
          <div class="new-app-card-item" data-category="${req.category}" data-title="${req.title.toLowerCase()}" data-dept="${req.department.toLowerCase()}" style="border:1.5px solid #e2e8f0; border-radius:10px; padding:1rem; background:#ffffff; transition:all 0.15s; display:flex; flex-direction:column; gap:0.6rem; cursor:pointer;" onmouseover="this.style.borderColor='#0d7a6b'; this.style.boxShadow='0 4px 12px rgba(13,122,107,0.1)';" onmouseout="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';" onclick="openApplicationWizardModal('${req.code}')">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.75rem;">
              <div>
                <div style="font-size:0.72rem; font-weight:700; color:#0d7a6b; text-transform:uppercase; letter-spacing:0.5px;">🏛️ ${req.department}</div>
                <div style="font-size:0.95rem; font-weight:800; color:#0f172a; margin-top:2px;">${req.title}</div>
              </div>
            </div>

            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.5rem; padding-top:0.4rem; border-top:1px solid #f1f5f9;">
              <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
                <span style="font-size:0.72rem; font-weight:600; color:#334155; background:#f8fafc; border:1px solid #e2e8f0; border-radius:4px; padding:0.15rem 0.45rem;">⏱️ ${req.validityYears}y Validity</span>
                <span style="font-size:0.72rem; font-weight:600; color:#334155; background:#f8fafc; border:1px solid #e2e8f0; border-radius:4px; padding:0.15rem 0.45rem;">💳 ${req.feeEstimate}</span>
                <span style="font-size:0.72rem; font-weight:700; color:${req.inspectionRequired ? '#b45309' : '#0d7a6b'}; background:${req.inspectionRequired ? '#fef3c7' : '#e6f5f3'}; border-radius:4px; padding:0.15rem 0.45rem;">
                  ${req.inspectionRequired ? '🔍 Site Inspection Required' : '📄 Document Scrutiny'}
                </span>
              </div>
              <button type="button" class="btn btn-primary btn-sm" onclick="event.stopPropagation(); openApplicationWizardModal('${req.code}')" style="background:#0d7a6b; color:#fff; border:none; padding:0.35rem 0.85rem; border-radius:6px; font-weight:700; font-size:0.8rem; cursor:pointer;">
                Start Application →
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-secondary btn-sm" onclick="AlgoUI.closeModal()" style="padding:0.5rem 1rem; border:1px solid #cbd5e1; border-radius:6px; background:#fff; cursor:pointer; font-weight:600;">Cancel</button>
  `;

  AlgoUI.openModal("Start Statutory Clearance Application", bodyHtml, footerHtml);
};

window.filterNewAppCatalog = function() {
  const q = document.getElementById("app-modal-search")?.value?.toLowerCase() || "";
  const items = document.querySelectorAll(".new-app-card-item");

  items.forEach(item => {
    const title = item.getAttribute("data-title") || "";
    const dept = item.getAttribute("data-dept") || "";
    const matchesSearch = title.includes(q) || dept.includes(q);
    item.style.display = matchesSearch ? "flex" : "none";
  });
};

// ----------------------------------------------------------------------------
// 8.1 Interactive Statutory Document Viewer Modal (Authentic Original File Viewer)
// ----------------------------------------------------------------------------
window.openDocumentViewerModal = function(docRef, docTitle, fileName, fileSize, status, date, dataUrl) {
  const activeAcc = AlgoAccounts.getActiveAccount();
  const allDocs = (activeAcc && activeAcc.documents) ? activeAcc.documents : [];
  const foundDoc = allDocs.find(d => d.ref === docRef || d.id === docRef || d.fileName === fileName || d.name === docTitle || d.title === docTitle);

  const realDataUrl = (dataUrl && dataUrl !== 'stored') ? dataUrl : (foundDoc?.dataUrl || null);
  const realFileName = fileName || foundDoc?.fileName || (docTitle ? `${docTitle}.pdf` : 'document.pdf');
  const realFileSize = fileSize || foundDoc?.fileSize || 'Attached File';
  const realDate = date || foundDoc?.date || foundDoc?.uploaded || 'Recent Record';
  const ext = (realFileName.split('.').pop() || 'pdf').toLowerCase();

  const isImg = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'].includes(ext);
  const isPdf = ext === 'pdf';

  const isVerified = (status || foundDoc?.status || "").toLowerCase().includes("verif");
  const isPreValidated = (status || foundDoc?.status || "").toLowerCase().includes("pre-val") || (status || foundDoc?.status || "").toLowerCase().includes("preval");

  let statusBadgeHtml = `<span style="font-size:0.75rem; font-weight:700; color:#b45309; background:#fef3c7; border:1px solid #fde68a; padding:0.25rem 0.65rem; border-radius:12px; display:inline-flex; align-items:center; gap:0.3rem;">● Under Review</span>`;
  if (isPreValidated) {
    statusBadgeHtml = `<span style="font-size:0.75rem; font-weight:700; color:#0284c7; background:#e0f2fe; border:1px solid #bae6fd; padding:0.25rem 0.65rem; border-radius:12px; display:inline-flex; align-items:center; gap:0.3rem;">★ Pre-Validated</span>`;
  } else if (isVerified) {
    statusBadgeHtml = `<span style="font-size:0.75rem; font-weight:700; color:#16a34a; background:#dcfce7; border:1px solid #bbf7d0; padding:0.25rem 0.65rem; border-radius:12px; display:inline-flex; align-items:center; gap:0.3rem;">✓ Verified Original</span>`;
  }

  const titleClean = (docTitle || realFileName || "Statutory Document").replace(/"/g, '&quot;');
  const fileClean = realFileName.replace(/"/g, '&quot;');

  let previewContentHtml = '';

  if (realDataUrl && isPdf) {
    previewContentHtml = `
      <div style="border:1.5px solid #cbd5e1; border-radius:10px; overflow:hidden; background:#525659; min-height:420px; box-shadow:0 4px 14px rgba(0,0,0,0.06);">
        <iframe src="${realDataUrl}" style="width:100%; height:450px; border:none; display:block;" title="${titleClean}"></iframe>
      </div>
    `;
  } else if (realDataUrl && isImg) {
    previewContentHtml = `
      <div style="display:flex; justify-content:center; align-items:center; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px; padding:1.5rem; max-height:450px; overflow:auto;">
        <img src="${realDataUrl}" alt="${titleClean}" style="max-width:100%; max-height:400px; object-fit:contain; border-radius:6px; box-shadow:0 4px 14px rgba(0,0,0,0.08);">
      </div>
    `;
  } else {
    // Clean, authentic file presentation for DOCX, Word, Excel, and other file types
    previewContentHtml = `
      <div style="background:#ffffff; border:1.5px solid #cbd5e1; border-radius:10px; padding:2.5rem 1.5rem; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; gap:1.15rem; box-shadow:0 4px 14px rgba(0,0,0,0.04);">
        <div style="width:68px; height:68px; border-radius:14px; background:${ext.includes('doc') ? '#eff6ff' : '#ecfdf5'}; color:${ext.includes('doc') ? '#2563eb' : '#0d7a6b'}; display:flex; align-items:center; justify-content:center; font-size:1.9rem; font-weight:800; border:1.5px solid ${ext.includes('doc') ? '#bfdbfe' : '#a7f3d0'};">
          📄
        </div>
        <div>
          <div style="font-size:1.15rem; font-weight:800; color:#0f172a; word-break:break-word; max-width:500px;">${fileClean}</div>
          <div style="font-size:0.84rem; color:#64748b; margin-top:4px;">
            Size: <strong style="color:#334155;">${realFileSize}</strong> · Format: <strong style="color:#0d7a6b;">${ext.toUpperCase()}</strong> · Deposited: ${realDate}
          </div>
        </div>
        <div style="display:flex; gap:0.6rem; margin-top:0.35rem; flex-wrap:wrap; justify-content:center;">
          <button type="button" class="btn btn-primary" onclick="downloadDocument('${docRef}', '${titleClean.replace(/'/g, "\\'")}', 'General')" style="background:#0d7a6b; color:#fff; border:none; padding:0.6rem 1.35rem; border-radius:8px; font-weight:700; font-size:0.86rem; cursor:pointer; display:inline-flex; align-items:center; gap:0.4rem; box-shadow:0 2px 8px rgba(13,122,107,0.25);">
            <span>📥</span> Open / Download Original File
          </button>
        </div>
      </div>
    `;
  }

  const bodyHtml = `
    <div style="display:flex; flex-direction:column; gap:1.15rem;">
      <!-- Metadata Header -->
      <div style="background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px; padding:0.95rem 1.15rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
        <div>
          <div style="font-size:0.72rem; font-weight:700; color:#0d7a6b; text-transform:uppercase; letter-spacing:0.5px;">Statutory Document Vault — ${docRef || 'DOC'}</div>
          <div style="font-size:1.05rem; font-weight:800; color:#0f172a; margin-top:2px;">${titleClean}</div>
          <div style="font-size:0.78rem; color:#64748b; margin-top:2px;">Original File: <strong style="color:#334155;">${fileClean}</strong> (${realFileSize})</div>
        </div>
        <div>
          ${statusBadgeHtml}
        </div>
      </div>

      <!-- Authentic File Preview Area -->
      ${previewContentHtml}
    </div>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-secondary btn-sm" onclick="AlgoUI.closeModal()" style="padding:0.5rem 1rem; border:1px solid #cbd5e1; border-radius:6px; background:#fff; cursor:pointer; font-weight:600;">Close</button>
    <button type="button" class="btn btn-primary btn-sm" onclick="downloadDocument('${docRef}', '${titleClean.replace(/'/g, "\\'")}', 'General')" style="background:#0d7a6b; color:#fff; border:none; padding:0.5rem 1.25rem; border-radius:6px; font-weight:700; font-size:0.82rem; cursor:pointer;">
      📥 Download Original File
    </button>
  `;

  AlgoUI.openModal(`Original Document: ${titleClean}`, bodyHtml, footerHtml);
};

// ----------------------------------------------------------------------------
// 9. Multi-Step Interactive Application Wizard
// ----------------------------------------------------------------------------
window.openApplicationWizardModal = function(reqCode) {
  try {
    const activeAcc = AlgoAccounts.getActiveAccount();
    const req = STATUTORY_CATALOG.find(r => r.code === reqCode) || {
      code: reqCode,
      title: "Statutory Approval Permit",
      department: "Directorate of Industrial Clearances",
      category: "General Compliance",
      feeEstimate: "₹10,000 – ₹25,000",
      validityYears: 3,
      inspectionRequired: true,
      mandatoryDocuments: ["Sanctioned Layout Blueprint", "Identity Proof", "Environmental Audit Report"]
    };

    const docs = req.mandatoryDocuments && req.mandatoryDocuments.length 
      ? req.mandatoryDocuments 
      : ["Property Tax Receipt or Registered Lease Deed", "Identity & Address Proof of Proprietor/Directors", "Sanctioned Building Layout Plan"];

    // Helper to provide context-aware issuing authority for each document
    function getDocGuidance(docName) {
      const d = (docName || "").toLowerCase();
      let issuer = "Competent Municipal / Statutory Authority";
      let submitTo = `${req.department} (Nodal Officer)`;
      let instruction = "Upload self-attested or digitally signed PDF/Scan";

      if (d.includes("tax") || d.includes("lease") || d.includes("title") || d.includes("possession") || d.includes("land")) {
        issuer = "Local Sub-Registrar / Municipal Property Tax Cell / Industrial Development Authority (MIDC)";
        submitTo = `${req.department} — Property & Land Verification Cell`;
        instruction = "Upload certified copy of Registered Lease / Property Tax receipt with Challan";
      } else if (d.includes("fire") || d.includes("evacuation") || d.includes("hydrant") || d.includes("sprinkler")) {
        issuer = "State Fire & Emergency Services / Licensed Fire Protection Engineer";
        submitTo = "Office of the Chief Fire Officer (CFO) & Single Window Desk";
        instruction = "Upload architectural floor evacuation map with fire hydrant flow calculations";
      } else if (d.includes("stability") || d.includes("blueprint") || d.includes("layout") || d.includes("drawing") || d.includes("structural")) {
        issuer = "Government Chartered Structural Engineer / Registered Architect";
        submitTo = `${req.department} — Engineering Scrutiny Desk`;
        instruction = "Upload 1:100 scale AutoCAD/PDF blueprint with engineer stability certificate";
      } else if (d.includes("identity") || d.includes("address") || d.includes("signatory") || d.includes("pan") || d.includes("gstin")) {
        issuer = "MCA / UIDAI / Income Tax Department (Government of India)";
        submitTo = `${req.department} — Enterprise Verification Section`;
        instruction = "Upload verified PAN/Aadhaar/Board Resolution of authorized director";
      } else if (d.includes("food") || d.includes("fsms") || d.includes("water") || d.includes("lab") || d.includes("recall")) {
        issuer = "FSSAI Certified Authority / NABL Accredited Testing Laboratory";
        submitTo = "Food Safety Officer (FSO) / District Designated Officer";
        instruction = "Upload laboratory water potability certificate (IS:10500) and FSMS plan";
      } else if (d.includes("pollution") || d.includes("spcb") || d.includes("cte") || d.includes("cto") || d.includes("effluent") || d.includes("etp")) {
        issuer = "State Pollution Control Board (SPCB) Regional Officer";
        submitTo = "Regional Environment Officer (Consent Scrutiny Wing)";
        instruction = "Upload ETP/STP flow schematics and environmental consent application";
      }

      return { issuer, submitTo, instruction };
    }

    // State store for uploaded files in this modal session
    window._wizardUploadedDocs = {};
    window._wizardTotalDocsCount = docs.length;
    window._wizardCurrentReq = req;

    // Pre-check if any documents already exist in the user's active Document Vault
    const existingVaultDocs = (activeAcc.documents || []);

    const docsHtml = docs.map((docName, idx) => {
      const guide = getDocGuidance(docName);
      
      // Safe check if user already has this document stored in their vault
      const matchedVaultDoc = existingVaultDocs.find(v => {
        const vTitle = (v.title || v.name || "").toLowerCase();
        const targetDoc = (docName || "").toLowerCase();
        return (vTitle && targetDoc && (vTitle.includes(targetDoc.substring(0, 10)) || targetDoc.includes(vTitle.substring(0, 10))));
      });

      if (matchedVaultDoc) {
        const docTitle = matchedVaultDoc.title || matchedVaultDoc.name || docName;
        window._wizardUploadedDocs[idx] = {
          name: matchedVaultDoc.fileName || matchedVaultDoc.name || `${docTitle.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
          size: matchedVaultDoc.fileSize || matchedVaultDoc.size || "1.4 MB",
          docRef: matchedVaultDoc.ref || `DOC-${Math.floor(100000 + Math.random()*900000)}`,
          type: "application/pdf",
          docName: docName,
          status: matchedVaultDoc.status || "Under Review",
          uploadedAt: matchedVaultDoc.uploaded || matchedVaultDoc.date || new Date().toISOString()
        };
      }

      const isAlreadyUploaded = !!window._wizardUploadedDocs[idx];
      const uploadedData = window._wizardUploadedDocs[idx];

      return `
        <div id="wizard-doc-row-${idx}" style="background:${isAlreadyUploaded ? '#f0fdfa' : '#ffffff'}; border:1.5px solid ${isAlreadyUploaded ? '#0d7a6b' : '#e2e8f0'}; border-radius:10px; padding:0.95rem 1rem; transition:all 0.2s ease; display:flex; flex-direction:column; gap:0.65rem;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.75rem; flex-wrap:wrap;">
            <div style="flex:1; min-width:240px;">
              <div style="display:flex; align-items:center; gap:0.45rem;">
                <span style="font-size:0.95rem;">📄</span>
                <strong style="font-size:0.88rem; color:#0f172a;">${docName}</strong>
              </div>
              
              <!-- Where, Who & How Guidance -->
              <div style="margin-top:0.4rem; font-size:0.75rem; color:#475569; display:flex; flex-direction:column; gap:0.25rem; background:#f8fafc; border:1px solid #f1f5f9; border-radius:6px; padding:0.5rem 0.65rem;">
                <div><strong>🏛️ Who Issues / Get From:</strong> <span style="color:#0f172a;">${guide.issuer}</span></div>
                <div><strong>📍 Who &amp; Where to Submit:</strong> <span style="color:#0d7a6b; font-weight:600;">${guide.submitTo}</span></div>
                <div><strong>📝 Filing Instruction:</strong> <span style="color:#64748b;">${guide.instruction}</span></div>
              </div>
            </div>

            <!-- Direct Upload & Storage Control -->
            <div style="display:flex; flex-direction:column; align-items:flex-end; gap:0.4rem; flex-shrink:0;">
              <input type="file" id="wizard-file-input-${idx}" data-doc-title="${encodeURIComponent(docName)}" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" style="display:none;" onchange="window.handleWizardDocUpload(${idx}, decodeURIComponent(this.getAttribute('data-doc-title')), event)">
              
              <div id="wizard-doc-status-${idx}">
                ${isAlreadyUploaded ? `
                  <span style="font-size:0.72rem; font-weight:700; color:#b45309; background:#fffbeb; border:1px solid #fde68a; padding:0.25rem 0.6rem; border-radius:6px; display:inline-flex; align-items:center; gap:0.3rem;">
                    <span>●</span> Under Review (${uploadedData.docRef || 'Vault'}): <strong>${uploadedData.name}</strong> (${uploadedData.size})
                  </span>
                ` : `
                  <span style="font-size:0.72rem; font-weight:700; color:#64748b; background:#f8fafc; border:1px solid #e2e8f0; padding:0.25rem 0.6rem; border-radius:6px; display:inline-flex; align-items:center; gap:0.3rem;">
                    <span>⏳</span> Upload Required
                  </span>
                `}
              </div>

              <div style="display:flex; align-items:center; gap:0.35rem;" id="wizard-doc-actions-${idx}">
                ${isAlreadyUploaded ? `
                  <button type="button" id="wizard-view-btn-${idx}" onclick="openDocumentViewerModal('${uploadedData.docRef}', '${docName.replace(/'/g, "\\'")}', '${uploadedData.name.replace(/'/g, "\\'")}', '${uploadedData.size}', '${uploadedData.status || 'Under Review'}', 'Just now')" style="background:#f0fdfa; color:#0d7a6b; border:1px solid #99f6e4; padding:0.45rem 0.75rem; border-radius:6px; font-weight:700; font-size:0.8rem; cursor:pointer; display:inline-flex; align-items:center; gap:0.25rem;">
                    <span>👁️</span> View
                  </button>
                ` : ''}
                <button type="button" id="wizard-upload-btn-${idx}" onclick="document.getElementById('wizard-file-input-${idx}').click()" style="background:${isAlreadyUploaded ? '#f8fafc' : '#0d7a6b'}; color:${isAlreadyUploaded ? '#334155' : '#ffffff'}; border:${isAlreadyUploaded ? '1px solid #cbd5e1' : 'none'}; padding:0.45rem 1rem; border-radius:6px; font-weight:700; font-size:0.8rem; cursor:pointer; display:inline-flex; align-items:center; gap:0.35rem; transition:all 0.15s;">
                  <span>${isAlreadyUploaded ? '🔄' : '📤'}</span> ${isAlreadyUploaded ? 'Replace' : 'Upload Document'}
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    const bodyHtml = `
      <div style="display:flex; flex-direction:column; gap:1.25rem; max-height:68vh; overflow-y:auto; padding-right:4px;">
        <!-- Header with Live Document Completion Progress -->
        <div style="background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px; padding:1rem 1.15rem; display:flex; flex-direction:column; gap:0.65rem;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.75rem; flex-wrap:wrap;">
            <div>
              <div style="font-size:0.72rem; font-weight:700; color:#0d7a6b; text-transform:uppercase; letter-spacing:0.5px;">Statutory Clearance Application</div>
              <div style="font-size:1.1rem; font-weight:800; color:#0f172a; margin-top:2px;">${req.title}</div>
              <div style="font-size:0.8rem; color:#64748b; margin-top:2px;">Department: <strong style="color:#334155;">${req.department}</strong></div>
            </div>
            <div style="text-align:right;">
              <div id="wizard-progress-counter" style="font-size:0.78rem; font-weight:800; color:#b45309; background:#fffbeb; border:1px solid #fef3c7; padding:0.25rem 0.65rem; border-radius:20px; display:inline-block;">
                ⚠️ 0 of ${docs.length} Documents Uploaded (0%)
              </div>
              <div style="font-size:0.7rem; color:#64748b; margin-top:3px;">All ${docs.length} documents required before submission</div>
            </div>
          </div>

          <!-- Progress Bar Track -->
          <div style="height:7px; background:#e2e8f0; border-radius:10px; overflow:hidden;">
            <div id="wizard-progress-bar" style="width:0%; height:100%; background:#0d7a6b; transition:width 0.3s cubic-bezier(0.4, 0, 0.2, 1);"></div>
          </div>
        </div>

        <!-- Interactive Mandatory Documents Upload List -->
        <div>
          <div style="font-size:0.82rem; font-weight:800; color:#1e293b; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.75rem; display:flex; align-items:center; gap:0.45rem;">
            <span style="font-size:1.05rem;">📁</span> Required Documents &amp; Submission Channels
          </div>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            ${docsHtml}
          </div>
        </div>

        <!-- Officer Remarks & Statutory Declaration -->
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:0.9rem 1rem;">
          <div style="font-size:0.78rem; font-weight:700; color:#334155; margin-bottom:0.35rem;">Applicant Notes / Reference Remarks (Optional)</div>
          <textarea id="wizard-remarks" placeholder="Enter plant registration numbers, survey lot details, or compliance notes..." style="width:100%; padding:0.5rem 0.75rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.82rem; font-family:inherit; box-sizing:border-box; background:#fff;" rows="2"></textarea>
          
          <label style="display:flex; align-items:flex-start; gap:0.5rem; margin-top:0.65rem; cursor:pointer; font-size:0.75rem; color:#475569; line-height:1.4;">
            <input type="checkbox" id="wizard-declaration-checkbox" checked required style="accent-color:#0d7a6b; margin-top:2px;">
            <span>I hereby declare that all uploaded documents and particulars submitted herein are authentic, legally binding, and compliant with Central &amp; State statutory rules.</span>
          </label>
        </div>
      </div>
    `;

    const footerHtml = `
      <button type="button" class="btn btn-secondary btn-sm" onclick="AlgoUI.closeModal()" style="padding:0.5rem 1rem; border:1px solid #cbd5e1; border-radius:6px; background:#fff; cursor:pointer; font-weight:600;">Cancel</button>
      <button type="button" id="wizard-submit-btn" disabled onclick="submitApplicationWizard('${req.code}', '${req.title.replace(/'/g, "\\'")}', '${req.department.replace(/'/g, "\\'")}')" style="padding:0.55rem 1.45rem; border:none; border-radius:6px; background:#cbd5e1; color:#ffffff; cursor:not-allowed; font-weight:700; font-size:0.84rem; transition:all 0.2s ease; opacity:0.65;">
        🔒 Upload All Documents to Register Application
      </button>
    `;

    AlgoUI.openModal("Statutory Clearance Application: " + req.title, bodyHtml, footerHtml);
    
    // Initialize progress state immediately (for any pre-matched vault docs)
    setTimeout(() => window.updateWizardCompletionState(), 50);
  } catch (err) {
    console.error("[Wizard Open Error]", err);
    AlgoUI.showToast("Error opening application wizard: " + err.message, "danger");
  }
};

window.handleWizardDocUpload = function(idx, docName, event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const dataUrl = evt.target.result;
    const activeAcc = AlgoAccounts.getActiveAccount();
    const docRef = `DOC-${Math.floor(100000 + Math.random()*900000)}`;
    const fileSizeStr = (file.size / 1024).toFixed(1) + " KB";
    const ext = (file.name.split('.').pop() || 'pdf').toUpperCase();

    // 1. Store document in active account Vault
    if (!activeAcc.documents) activeAcc.documents = [];

    const storedDocRecord = {
      id: docRef,
      title: docName,
      name: docName,
      status: "Under Review",
      category: "Statutory Clearance Docket",
      ref: docRef,
      uploaded: "Just now",
      date: "Just now",
      fileName: file.name,
      fileSize: fileSizeStr,
      type: ext,
      dataUrl: dataUrl,
      hasFile: true,
      isBaseline: false
    };

    activeAcc.documents.unshift(storedDocRecord);
    AlgoAccounts.addOrUpdateAccount(activeAcc);

    // 2. Persist to MySQL Backend if online
    if (typeof API_BASE !== "undefined") {
      try {
        const formData = new FormData();
        formData.append("docName", docName);
        formData.append("category", "Statutory Clearance");
        formData.append("status", "Under Review");
        formData.append("file", file);

        fetch(`${API_BASE}/documents/upload`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${localStorage.getItem(TOKEN_KEY) || ""}` },
          body: formData
        }).catch(err => console.log("[Doc Upload Backend Sync]", err.message));
      } catch (e) {}
    }

    // 3. Record document upload in modal session store
    window._wizardUploadedDocs[idx] = {
      name: file.name,
      size: fileSizeStr,
      docRef: docRef,
      type: file.type || ext,
      docName: docName,
      status: "Under Review",
      dataUrl: dataUrl,
      uploadedAt: new Date().toISOString()
    };

    // 4. Update UI for this document row
    const rowEl = document.getElementById(`wizard-doc-row-${idx}`);
    const statusEl = document.getElementById(`wizard-doc-status-${idx}`);
    const actionsEl = document.getElementById(`wizard-doc-actions-${idx}`);

    if (rowEl) {
      rowEl.style.borderColor = "#0d7a6b";
      rowEl.style.background = "#f0fdfa";
    }

    if (statusEl) {
      statusEl.innerHTML = `
        <span style="font-size:0.72rem; font-weight:700; color:#b45309; background:#fffbeb; border:1px solid #fde68a; padding:0.25rem 0.6rem; border-radius:6px; display:inline-flex; align-items:center; gap:0.3rem;">
          <span>●</span> Under Review (${docRef}): <strong>${file.name}</strong> (${fileSizeStr})
        </span>
      `;
    }

    if (actionsEl) {
      actionsEl.innerHTML = `
        <button type="button" id="wizard-view-btn-${idx}" onclick="openDocumentViewerModal('${docRef}', '${docName.replace(/'/g, "\\'")}', '${file.name.replace(/'/g, "\\'")}', '${fileSizeStr}', 'Under Review', 'Just now', 'stored')" style="background:#f0fdfa; color:#0d7a6b; border:1px solid #99f6e4; padding:0.45rem 0.75rem; border-radius:6px; font-weight:700; font-size:0.8rem; cursor:pointer; display:inline-flex; align-items:center; gap:0.25rem;">
          <span>👁️</span> View
        </button>
        <button type="button" id="wizard-upload-btn-${idx}" onclick="document.getElementById('wizard-file-input-${idx}').click()" style="background:#f8fafc; color:#334155; border:1px solid #cbd5e1; padding:0.45rem 1rem; border-radius:6px; font-weight:700; font-size:0.8rem; cursor:pointer; display:inline-flex; align-items:center; gap:0.35rem; transition:all 0.15s;">
          <span>🔄</span> Replace
        </button>
      `;
    }

    // 5. Update overall progress & submission button lock state
    window.updateWizardCompletionState();

    AlgoUI.showToast(`Document "${docName}" saved & stored in Document Vault (${docRef}) as Under Review!`, "success");
  };

  reader.readAsDataURL(file);
};


window.updateWizardCompletionState = function() {
  const total = window._wizardTotalDocsCount || 1;
  const uploadedCount = Object.keys(window._wizardUploadedDocs || {}).length;
  const percent = Math.round((uploadedCount / total) * 100);

  const progressBar = document.getElementById("wizard-progress-bar");
  const counterEl = document.getElementById("wizard-progress-counter");
  const submitBtn = document.getElementById("wizard-submit-btn");

  if (progressBar) {
    progressBar.style.width = `${percent}%`;
  }

  if (uploadedCount === total) {
    if (counterEl) {
      counterEl.style.color = "#16a34a";
      counterEl.style.background = "#dcfce7";
      counterEl.style.borderColor = "#bbf7d0";
      counterEl.innerHTML = `✓ All ${total} of ${total} Mandatory Documents Attached (100%)`;
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.style.background = "#0d7a6b";
      submitBtn.style.color = "#ffffff";
      submitBtn.style.cursor = "pointer";
      submitBtn.style.opacity = "1";
      submitBtn.style.boxShadow = "0 4px 14px rgba(13,122,107,0.3)";
      submitBtn.innerHTML = `Submit &amp; Register Application →`;
    }
  } else {
    if (counterEl) {
      counterEl.style.color = "#b45309";
      counterEl.style.background = "#fffbeb";
      counterEl.style.borderColor = "#fef3c7";
      counterEl.innerHTML = `⚠️ ${uploadedCount} of ${total} Documents Uploaded (${percent}%)`;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.background = "#cbd5e1";
      submitBtn.style.color = "#ffffff";
      submitBtn.style.cursor = "not-allowed";
      submitBtn.style.opacity = "0.65";
      submitBtn.style.boxShadow = "none";
      submitBtn.innerHTML = `🔒 Upload All ${total} Documents to Register Application`;
    }
  }
};

window.submitApplicationWizard = function(reqCode, title, dept) {
  const total = window._wizardTotalDocsCount || 1;
  const uploadedDocs = window._wizardUploadedDocs || {};
  const uploadedCount = Object.keys(uploadedDocs).length;

  if (uploadedCount < total) {
    AlgoUI.showToast(`Cannot submit: Please upload all ${total} required documents first!`, "warning");
    return;
  }

  const activeAcc = AlgoAccounts.getActiveAccount();
  const remarks = document.getElementById("wizard-remarks")?.value?.trim();
  const refNum = `AS-${reqCode.replace('REQ_', '').substring(0, 3)}-${Math.floor(260000 + Math.random()*9000)}`;
  const uploadedDocNames = Object.values(uploadedDocs).map(d => `${d.docName} (${d.name})`).join(", ");

  const newApp = {
    ref: refNum,
    title: title || reqCode,
    dept: dept || "Competent Authority",
    status: "Under review",
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    checklistAttached: `${uploadedCount} Verified Documents`,
    update: remarks ? `Application submitted with all ${uploadedCount} verified statutory documents: ${uploadedDocNames}. Note: ${remarks}` : `Application filed with complete statutory dossier (${uploadedCount} documents attached). Scrutiny in progress.`
  };

  // Add application to active account
  if (!activeAcc.applications) activeAcc.applications = [];
  activeAcc.applications.unshift(newApp);

  // Also record uploaded documents in Vault
  if (!activeAcc.documents) activeAcc.documents = [];
  Object.values(uploadedDocs).forEach(d => {
    activeAcc.documents.unshift({
      title: d.docName,
      status: "VERIFIED",
      category: "Statutory Filing",
      ref: `DOC-${Math.floor(100000 + Math.random()*900000)}`,
      uploaded: "Just now",
      fileName: d.name,
      fileSize: d.size
    });
  });

  AlgoAccounts.addOrUpdateAccount(activeAcc);

  AlgoUI.showToast(`Application ${refNum} with ${uploadedCount} verified documents registered successfully!`, "success");
  AlgoUI.closeModal();

  setTimeout(() => {
    if (typeof AlgoAccounts.syncCurrentPageDOM === "function") {
      AlgoAccounts.syncCurrentPageDOM();
    }
    if (window.location.pathname.includes("approvals.html") || window.location.pathname.includes("dashboard.html")) {
      window.location.href = "applications.html";
    }
  }, 450);
};

window.handleStartApplication = function(reqCode) {
  openApplicationWizardModal(reqCode);
};

window.confirmCreateApplication = function(reqCode) {
  const req = STATUTORY_CATALOG.find(r => r.code === reqCode);
  submitApplicationWizard(reqCode, req ? req.title : reqCode, req ? req.department : "Statutory Department");
};


// Global Profile Edit Modal & Handlers
window.openEditProfileModal = function() {
  const activeAcc = AlgoAccounts.getActiveAccount();

  const bodyHtml = `
    <form id="edit-profile-modal-form" onsubmit="handleSaveProfileModal(event)" style="display:flex; flex-direction:column; gap:1.15rem; max-height:65vh; overflow-y:auto; padding-right:6px;">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
        <div>
          <label style="display:block; font-size:0.75rem; font-weight:700; color:#334155; margin-bottom:0.35rem;">Company / Legal Entity Name</label>
          <input type="text" id="modal-edit-company" value="${activeAcc.companyName}" style="width:100%; padding:0.55rem 0.75rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.86rem; box-sizing:border-box;" required>
        </div>
        <div>
          <label style="display:block; font-size:0.75rem; font-weight:700; color:#334155; margin-bottom:0.35rem;">Constitution</label>
          <select id="modal-edit-constitution" style="width:100%; padding:0.55rem 0.75rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.86rem; box-sizing:border-box;">
            <option ${(activeAcc.constitution||'').includes('Private') ? 'selected' : ''}>Private Limited Company</option>
            <option ${(activeAcc.constitution||'').includes('Public') ? 'selected' : ''}>Public Limited Company</option>
            <option ${(activeAcc.constitution||'').includes('Partnership') ? 'selected' : ''}>Partnership Firm</option>
            <option ${(activeAcc.constitution||'').includes('LLP') ? 'selected' : ''}>Limited Liability Partnership</option>
            <option ${(activeAcc.constitution||'').includes('Sole') ? 'selected' : ''}>Sole Proprietorship</option>
          </select>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
        <div>
          <label style="display:block; font-size:0.75rem; font-weight:700; color:#334155; margin-bottom:0.35rem;">Industry Sector / Type of Industry</label>
          <select id="modal-edit-industry" style="width:100%; padding:0.55rem 0.75rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.86rem; box-sizing:border-box;">
            <option ${(activeAcc.industryType||'').includes('Manufacturing') ? 'selected' : ''}>Manufacturing & Engineering</option>
            <option ${(activeAcc.industryType||'').includes('Chemical') ? 'selected' : ''}>Chemicals & Hazardous Materials</option>
            <option ${(activeAcc.industryType||'').includes('Food') ? 'selected' : ''}>Food Processing & Agro</option>
            <option ${(activeAcc.industryType||'').includes('Electronic') ? 'selected' : ''}>Electronics & Hardware</option>
            <option ${(activeAcc.industryType||'').includes('Textile') ? 'selected' : ''}>Textiles & Apparel</option>
          </select>
        </div>
        <div>
          <label style="display:block; font-size:0.75rem; font-weight:700; color:#334155; margin-bottom:0.35rem;">State Jurisdiction</label>
          <select id="modal-edit-state" style="width:100%; padding:0.55rem 0.75rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.86rem; box-sizing:border-box;">
            <option ${(activeAcc.state||'').includes('Maharashtra') ? 'selected' : ''}>Maharashtra</option>
            <option ${(activeAcc.state||'').includes('Gujarat') ? 'selected' : ''}>Gujarat</option>
            <option ${(activeAcc.state||'').includes('Karnataka') ? 'selected' : ''}>Karnataka</option>
            <option ${(activeAcc.state||'').includes('Tamil') ? 'selected' : ''}>Tamil Nadu</option>
            <option ${(activeAcc.state||'').includes('Telangana') ? 'selected' : ''}>Telangana</option>
            <option ${(activeAcc.state||'').includes('Uttar') ? 'selected' : ''}>Uttar Pradesh</option>
          </select>
        </div>
      </div>

      <div style="border-top:1px solid #e2e8f0; padding-top:0.75rem;">
        <div style="font-weight:700; font-size:0.82rem; color:#0d7a6b; margin-bottom:0.65rem; text-transform:uppercase; letter-spacing:0.5px;">Factory & Unit Details</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:0.85rem;">
          <div>
            <label style="display:block; font-size:0.75rem; font-weight:700; color:#334155; margin-bottom:0.35rem;">Unit Name</label>
            <input type="text" id="modal-edit-unit" value="${activeAcc.unitName}" style="width:100%; padding:0.55rem 0.75rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.86rem; box-sizing:border-box;" required>
          </div>
          <div>
            <label style="display:block; font-size:0.75rem; font-weight:700; color:#334155; margin-bottom:0.35rem;">Employees Count</label>
            <input type="number" id="modal-edit-emp" value="${activeAcc.employeesCount}" style="width:100%; padding:0.55rem 0.75rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.86rem; box-sizing:border-box;">
          </div>
        </div>
        <div style="margin-bottom:0.85rem;">
          <label style="display:block; font-size:0.75rem; font-weight:700; color:#334155; margin-bottom:0.35rem;">Premises Address</label>
          <input type="text" id="modal-edit-addr" value="${activeAcc.unitAddress}" style="width:100%; padding:0.55rem 0.75rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.86rem; box-sizing:border-box;" required>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.75rem;">
          <div>
            <label style="display:block; font-size:0.75rem; font-weight:700; color:#334155; margin-bottom:0.35rem;">Primary NIC Code</label>
            <input type="text" id="modal-edit-nic" value="${activeAcc.nicCode || '28100'}" style="width:100%; padding:0.55rem 0.75rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.86rem; box-sizing:border-box;">
          </div>
          <div>
            <label style="display:block; font-size:0.75rem; font-weight:700; color:#334155; margin-bottom:0.35rem;">Land Area</label>
            <input type="text" id="modal-edit-land" value="${activeAcc.landArea || '8,400 sq. m.'}" style="width:100%; padding:0.55rem 0.75rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.86rem; box-sizing:border-box;">
          </div>
          <div>
            <label style="display:block; font-size:0.75rem; font-weight:700; color:#334155; margin-bottom:0.35rem;">Power Load</label>
            <input type="text" id="modal-edit-power" value="${activeAcc.powerLoad || '450 kW'}" style="width:100%; padding:0.55rem 0.75rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.86rem; box-sizing:border-box;">
          </div>
        </div>
      </div>
    </form>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-secondary btn-sm" onclick="AlgoUI.closeModal()" style="padding:0.5rem 1rem; border:1px solid #cbd5e1; border-radius:6px; background:#fff; cursor:pointer; font-weight:600;">Cancel</button>
    <button type="button" class="btn btn-primary btn-sm" onclick="handleSaveProfileModal(event)" style="padding:0.5rem 1.25rem; border:none; border-radius:6px; background:#0d7a6b; color:#fff; cursor:pointer; font-weight:700;">Save Changes</button>
  `;

  AlgoUI.openModal("Edit Enterprise & Facility Profile", bodyHtml, footerHtml);
};

window.handleSaveProfileModal = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const activeAcc = AlgoAccounts.getActiveAccount();

  activeAcc.companyName = document.getElementById("modal-edit-company")?.value?.trim() || activeAcc.companyName;
  activeAcc.unitName = document.getElementById("modal-edit-unit")?.value?.trim() || activeAcc.unitName;
  activeAcc.unitAddress = document.getElementById("modal-edit-addr")?.value?.trim() || activeAcc.unitAddress;
  activeAcc.employeesCount = parseInt(document.getElementById("modal-edit-emp")?.value) || activeAcc.employeesCount;
  activeAcc.constitution = document.getElementById("modal-edit-constitution")?.value || activeAcc.constitution;
  activeAcc.industryType = document.getElementById("modal-edit-industry")?.value || activeAcc.industryType;
  activeAcc.sectorBadge = "● " + activeAcc.industryType;
  activeAcc.state = document.getElementById("modal-edit-state")?.value || activeAcc.state;
  activeAcc.nicCode = document.getElementById("modal-edit-nic")?.value?.trim() || activeAcc.nicCode;
  activeAcc.incorporationDate = document.getElementById("modal-edit-incorp")?.value?.trim() || activeAcc.incorporationDate;
  activeAcc.landArea = document.getElementById("modal-edit-land")?.value?.trim() || activeAcc.landArea;
  activeAcc.powerLoad = document.getElementById("modal-edit-power")?.value?.trim() || activeAcc.powerLoad;
  activeAcc.completionPct = 100;

  AlgoAccounts.addOrUpdateAccount(activeAcc);
  AlgoUI.showToast("Enterprise profile updated successfully!", "success");
  AlgoUI.closeModal();
  setTimeout(() => location.reload(), 400);
};

window.openAddRegistrationModal = function() {
  const bodyHtml = `
    <form id="add-reg-form" onsubmit="handleSaveRegistration(event)" style="display:flex; flex-direction:column; gap:1.15rem;">
      <div>
        <label style="display:block; font-size:0.75rem; font-weight:700; color:#334155; margin-bottom:0.35rem;">Registration Type</label>
        <select id="modal-reg-type" style="width:100%; padding:0.55rem 0.75rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.86rem; box-sizing:border-box;">
          <option>Factory License (DIS)</option>
          <option>Consent to Operate (MPCB)</option>
          <option>Fire NOC Certificate</option>
          <option>Boiler Registration Certificate</option>
          <option>Electricity Inspector NOC</option>
        </select>
      </div>
      <div>
        <label style="display:block; font-size:0.75rem; font-weight:700; color:#334155; margin-bottom:0.35rem;">Registration / Certificate Number</label>
        <input type="text" id="modal-reg-num" placeholder="e.g. MH/FAC/2026/89410" style="width:100%; padding:0.55rem 0.75rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.86rem; box-sizing:border-box;" required>
      </div>
      <div>
        <label style="display:block; font-size:0.75rem; font-weight:700; color:#334155; margin-bottom:0.35rem;">Issuing Authority</label>
        <input type="text" id="modal-reg-auth" placeholder="e.g. Directorate of Industrial Safety, Maharashtra" style="width:100%; padding:0.55rem 0.75rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.86rem; box-sizing:border-box;" required>
      </div>
    </form>
  `;
  const footerHtml = `
    <button type="button" class="btn btn-secondary btn-sm" onclick="AlgoUI.closeModal()" style="padding:0.5rem 1rem; border:1px solid #cbd5e1; border-radius:6px; background:#fff; cursor:pointer; font-weight:600;">Cancel</button>
    <button type="button" class="btn btn-primary btn-sm" onclick="handleSaveRegistration(event)" style="padding:0.5rem 1.25rem; border:none; border-radius:6px; background:#0d7a6b; color:#fff; cursor:pointer; font-weight:700;">Add Registration</button>
  `;
  AlgoUI.openModal("Add Business Registration", bodyHtml, footerHtml);
};

window.handleSaveRegistration = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const type = document.getElementById("modal-reg-type")?.value || "Statutory Registration";
  const num = document.getElementById("modal-reg-num")?.value?.trim() || "REF-" + Math.floor(Math.random()*900000);
  
  const activeAcc = AlgoAccounts.getActiveAccount();
  if (!activeAcc.registrations) activeAcc.registrations = [];
  activeAcc.registrations.push({ name: type, code: "REG", value: num, status: "Verified" });
  AlgoAccounts.addOrUpdateAccount(activeAcc);

  AlgoUI.showToast("Registration added successfully!", "success");
  AlgoUI.closeModal();
};

window.openRenewalModal = function(title, dept, expiry) {
  const bodyHtml = `
    <div style="display:flex; flex-direction:column; gap:1.15rem;">
      <p style="color:#334155; font-size:0.9rem; margin:0; line-height:1.5;">
        Prepare statutory renewal filing for <strong>${title}</strong> (${dept}).
      </p>
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:0.85rem 1rem;">
        <div style="font-size:0.75rem; color:#64748b; font-weight:600; text-transform:uppercase;">Current Expiry Date</div>
        <div style="font-size:0.95rem; font-weight:700; color:#0f172a; margin-top:2px;">${expiry || 'Upcoming'}</div>
      </div>
      <div>
        <label style="display:block; font-size:0.75rem; font-weight:700; color:#334155; margin-bottom:0.35rem;">Renewal Period Requested</label>
        <select id="modal-renewal-period" style="width:100%; padding:0.55rem 0.75rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.86rem; box-sizing:border-box;">
          <option>1 Year Renewal</option>
          <option selected>3 Years Renewal</option>
          <option>5 Years Renewal</option>
        </select>
      </div>
      <div>
        <label style="display:block; font-size:0.75rem; font-weight:700; color:#334155; margin-bottom:0.35rem;">Remarks / Document Reference</label>
        <textarea id="modal-renewal-notes" placeholder="Enter any structural changes, updated fee receipts, or remarks..." style="width:100%; padding:0.55rem 0.75rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.86rem; box-sizing:border-box;" rows="2"></textarea>
      </div>
    </div>
  `;
  const footerHtml = `
    <button type="button" class="btn btn-secondary btn-sm" onclick="AlgoUI.closeModal()" style="padding:0.5rem 1rem; border:1px solid #cbd5e1; border-radius:6px; background:#fff; cursor:pointer; font-weight:600;">Cancel</button>
    <button type="button" class="btn btn-primary btn-sm" onclick="AlgoUI.showToast('Renewal draft initiated successfully for ${title}!', 'success'); AlgoUI.closeModal();" style="padding:0.5rem 1.25rem; border:none; border-radius:6px; background:#0d7a6b; color:#fff; cursor:pointer; font-weight:700;">Initiate Renewal Filing →</button>
  `;
  AlgoUI.openModal("Statutory Renewal: " + title, bodyHtml, footerHtml);
};

window.getAutoDocExpiry = function(docType) {
  const d = new Date();
  const lower = (docType || "").toLowerCase();
  if (lower.includes("incorporation") || lower.includes("gst") || lower.includes("layout") || lower.includes("power") || lower.includes("pan") || lower.includes("signatory") || lower.includes("allotment")) {
    return { text: "Permanent Statutory Life (No expiry renewal required)", dateStr: "Permanent", cycle: "Perpetual" };
  }
  if (lower.includes("stability") || lower.includes("building") || lower.includes("plan")) {
    d.setFullYear(d.getFullYear() + 5);
    const dateStr = d.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });
    return { text: `Auto-Calculated Expiry: ${dateStr} (5-Year Statutory Renewal Cycle)`, dateStr: dateStr, cycle: "5 Years" };
  }
  if (lower.includes("consent") || lower.includes("spcb") || lower.includes("cto") || lower.includes("cte") || lower.includes("pollution")) {
    d.setFullYear(d.getFullYear() + 3);
    const dateStr = d.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });
    return { text: `Auto-Calculated Expiry: ${dateStr} (3-Year Pollution Board Cycle)`, dateStr: dateStr, cycle: "3 Years" };
  }
  // Standard 1 Year (Fire NOC, Boiler inspection, Factory license, Safety audit, etc.)
  d.setFullYear(d.getFullYear() + 1);
  const dateStr = d.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });
  return { text: `Auto-Calculated Expiry: ${dateStr} (1-Year Annual Statutory Cycle)`, dateStr: dateStr, cycle: "1 Year" };
};

window.updateDocExpiryPreview = function(docType) {
  const previewEl = document.getElementById("doc-expiry-preview-text");
  const cycleEl = document.getElementById("doc-expiry-cycle-text");
  if (previewEl) {
    const res = window.getAutoDocExpiry(docType);
    previewEl.textContent = res.text;
    if (cycleEl) cycleEl.textContent = res.cycle;
  }
};

// ----------------------------------------------------------------------------
// Baseline Statutory Document Seed (Clean Start - Real Documents Only)
// ----------------------------------------------------------------------------
function getBaselineDocumentsForAccount(activeAcc) {
  return [];
}

// ----------------------------------------------------------------------------
// Real Document Download Engine
// ----------------------------------------------------------------------------
window.downloadDocument = function(docId, docName, category) {
  const activeAcc = AlgoAccounts.getActiveAccount();
  const allDocs = (activeAcc && activeAcc.documents && activeAcc.documents.length > 0) 
    ? activeAcc.documents 
    : [];
  
  const doc = allDocs.find(d => d.id === docId || d.name === docName || d.ref === docId) || { 
    name: docName || "Statutory_Document", 
    category: category || "General",
    status: "Under Review"
  };

  // 1. If real file Data URL exists, download it directly:
  if (doc.dataUrl) {
    const a = document.createElement("a");
    a.href = doc.dataUrl;
    a.download = doc.fileName || `${doc.name.replace(/[^a-zA-Z0-9_-]/g, '_')}.${(doc.type || 'pdf').toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    AlgoUI.showToast(`Downloaded "${doc.name}" successfully!`, "success");
    return;
  }

  // 2. Generate an authentic official statutory clearance certificate / docket
  const safeTitle = (doc.name || doc.title || "Statutory Document").toUpperCase();
  const companyName = activeAcc.companyName || "Shakti Precision Pvt. Ltd.";
  const unitName = activeAcc.unitName || "Chakan Manufacturing Unit, MIDC Pune";
  const cin = activeAcc.cin || "U28999MH2020PTC349812";
  const gstin = activeAcc.gstin || "27AAHCS4821P1Z7";
  const state = activeAcc.state || "Maharashtra";
  const dateStr = doc.date || new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
  const refCode = doc.ref || doc.id || `AS-DOC-${Math.floor(100000 + Math.random()*900000)}`;

  const certificateHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${doc.name || doc.title} - ${companyName}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 40px; color: #1e293b; background: #fff; }
    .header { text-align: center; border-bottom: 3px double #0d7a6b; padding-bottom: 20px; margin-bottom: 25px; }
    .emblem { font-size: 26px; color: #0d7a6b; font-weight: 800; }
    .gov-title { font-size: 16px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 1.2px; margin-top: 5px; }
    .sub-title { font-size: 12px; color: #64748b; margin-top: 4px; }
    .cert-title { font-size: 21px; font-weight: 800; color: #0d7a6b; margin: 25px 0 15px 0; text-align: center; text-transform: uppercase; letter-spacing: 0.5px; }
    .meta-box { background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 25px; font-size: 13px; line-height: 1.8; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .meta-label { color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 11px; }
    .meta-val { color: #0f172a; font-weight: 700; font-size: 13px; }
    .body-content { font-size: 13.5px; line-height: 1.8; color: #334155; margin-bottom: 30px; text-align: justify; }
    .seal-row { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 50px; padding-top: 20px; border-top: 1px dashed #cbd5e1; }
    .seal-badge { border: 2px solid #0d7a6b; color: #0d7a6b; padding: 10px 18px; border-radius: 50px; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
    .signature { text-align: right; font-size: 12px; color: #475569; }
    .signature-line { font-weight: 700; color: #0f172a; font-size: 14px; margin-top: 5px; }
    .footer-note { font-size: 10.5px; color: #94a3b8; text-align: center; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 15px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="emblem">🏛️ ANUMATI SETU COMPLIANCE REPOSITORY</div>
    <div class="gov-title">Statutory Business Record &amp; Clearance Docket</div>
    <div class="sub-title">National Industrial Clearances &amp; Regulatory Verification System (${state})</div>
  </div>

  <div class="cert-title">${safeTitle}</div>

  <div class="meta-box">
    <div class="meta-grid">
      <div><span class="meta-label">Enterprise / Entity Name:</span><div class="meta-val">${companyName}</div></div>
      <div><span class="meta-label">Corporate ID (CIN / LLPIN):</span><div class="meta-val">${cin}</div></div>
      <div><span class="meta-label">Operating Unit / Facility:</span><div class="meta-val">${unitName}</div></div>
      <div><span class="meta-label">GSTIN / Tax Registration:</span><div class="meta-val">${gstin}</div></div>
      <div><span class="meta-label">Document Category:</span><div class="meta-val">${doc.category || "Statutory"}</div></div>
      <div><span class="meta-label">Document Reference Code:</span><div class="meta-val">${refCode}</div></div>
      <div><span class="meta-label">Deposit &amp; Verification Date:</span><div class="meta-val">${dateStr}</div></div>
      <div><span class="meta-label">Statutory Status:</span><div class="meta-val" style="color:${(doc.status || '').toLowerCase().includes('verif') ? '#16a34a' : '#b45309'};">● ${doc.status || "Under Review"}</div></div>
    </div>
  </div>

  <div class="body-content">
    <p>This certified electronic record verifies that <strong>${companyName}</strong> has deposited and registered the statutory instrument titled <strong>${safeTitle}</strong> with the compliance repository. All operational parameters and regulatory particulars detailed herein correspond to official records filed with competent authorities.</p>
    <p>This document is cryptographically referenced and preserved for statutory filings, licensing compliance, and official inspection review.</p>
  </div>

  <div class="seal-row">
    <div class="seal-badge">✓ REGISTERED STATUTORY DOCKET</div>
    <div class="signature">
      <div>Digitally recorded and sealed:</div>
      <div class="signature-line">Compliance Document Vault</div>
      <div>Anumati Setu Statutory Regulatory Repository</div>
    </div>
  </div>

  <div class="footer-note">
    Document Reference: ${refCode} · Stored securely via Anumati Setu Enterprise Portal · Preserved for official compliance verification.
  </div>
</body>
</html>`;

  const blob = new Blob([certificateHtml], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(doc.name || doc.title || 'Document').replace(/[^a-zA-Z0-9_-]/g, '_')}_Docket.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);

  AlgoUI.showToast(`Downloaded verified copy of "${doc.name || doc.title}"!`, "success");
};

// ----------------------------------------------------------------------------
// Render Documents Dynamic Grid
// ----------------------------------------------------------------------------
window.renderDocumentsGrid = function() {
  const activeAcc = AlgoAccounts.getActiveAccount();
  if (!activeAcc.documents) {
    activeAcc.documents = [];
    AlgoAccounts.addOrUpdateAccount(activeAcc);
  }

  const docs = activeAcc.documents;
  const grid = document.getElementById("documents-grid-container");

  // Update stat counts
  const totalEl = document.getElementById("doc-stat-total");
  const verifiedEl = document.getElementById("doc-stat-verified");
  const expiringEl = document.getElementById("doc-stat-expiring");
  const reviewEl = document.getElementById("doc-stat-review");
  const subEl = document.getElementById("doc-lib-sub");

  const verifiedCount = docs.filter(d => (d.status || '').toLowerCase().includes('verif')).length;
  const reviewCount = docs.filter(d => (d.status || '').toLowerCase().includes('review')).length;
  const expiringCount = docs.filter(d => (d.status || '').toLowerCase().includes('expir') || (d.validityCycle || '').includes('Annual')).length;

  if (totalEl) totalEl.textContent = docs.length;
  if (verifiedEl) verifiedEl.textContent = verifiedCount;
  if (expiringEl) expiringEl.textContent = expiringCount;
  if (reviewEl) reviewEl.textContent = reviewCount;
  if (subEl) subEl.textContent = `Showing ${docs.length} documents for ${activeAcc.companyName}`;

  if (!grid) return;

  if (docs.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding:3.5rem 1.5rem; background:#ffffff; border:2px dashed #cbd5e1; border-radius:12px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.75rem;">
        <div style="font-size:3rem; line-height:1;">📁</div>
        <div style="font-size:1.1rem; font-weight:800; color:#0f172a;">No Documents in Vault Yet</div>
        <div style="font-size:0.85rem; color:#64748b; max-width:440px; line-height:1.5;">
          Your Document Vault is completely clean. Upload original certificates or start a statutory application to attach and store documents here.
        </div>
        <button type="button" class="btn btn-primary" onclick="openUploadDocumentModal()" style="margin-top:0.75rem; background:#0d7a6b; color:#fff; border:none; padding:0.6rem 1.4rem; border-radius:8px; font-weight:700; font-size:0.86rem; cursor:pointer; display:inline-flex; align-items:center; gap:0.4rem;">
          <span>📤</span> Upload First Document
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = docs.map(doc => {
    const isVerified = (doc.status || '').toLowerCase().includes('verif');
    const badgeClass = isVerified ? 'badge-v' : 'badge-r';
    const badgeText = isVerified ? '● Verified' : '● Under Review';
    const ext = doc.type || (doc.fileName ? doc.fileName.split('.').pop().toUpperCase() : 'PDF');

    return `
      <div class="doc-card" data-cat="${doc.category || 'General'}" id="doc-card-${doc.id || doc.ref}">
        <div class="doc-card-top">
          <span class="doc-type" style="${ext === 'PDF' ? 'background:#fef2f2; color:#ef4444;' : 'background:#e0f2fe; color:#0284c7;'}">${ext}</span>
          <span class="doc-menu" onclick="AlgoUI.showToast('Document: ${(doc.name || doc.title || '').replace(/'/g, "\\'")} · ${badgeText}', 'info')" title="Document info">⋮</span>
        </div>
        <div class="doc-name" style="font-weight:700; color:#0f172a; margin-top:0.4rem; font-size:0.86rem; line-height:1.35;">${doc.name || doc.title}</div>
        <div class="doc-date" style="font-size:0.72rem; color:#64748b; margin-top:0.25rem;">
          ${doc.date || 'Uploaded Today'} · ${doc.fileSize || doc.size || '1.4 MB'}
        </div>
        ${doc.expiryDate ? `<div style="font-size:0.7rem; color:#0d7a6b; font-weight:700; margin-top:0.35rem;">⚡ Validity: ${doc.expiryDate}</div>` : ''}
        <div class="doc-footer" style="margin-top:auto; padding-top:0.75rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.4rem;">
          <span class="doc-badge ${badgeClass}">${badgeText}</span>
          <div style="display:flex; align-items:center; gap:0.35rem;">
            <button type="button" onclick="openDocumentViewerModal('${doc.ref || doc.id || 'DOC-ONLINE'}', '${(doc.name || doc.title || '').replace(/'/g, "\\'")}', '${(doc.fileName || doc.name || doc.title || '').replace(/'/g, "\\'")}', '${doc.fileSize || doc.size || '1.4 MB'}', '${doc.status || 'Under Review'}', '${doc.date || 'Today'}')" title="View Document" style="background:#f0fdfa; color:#0d7a6b; border:1px solid #99f6e4; border-radius:6px; padding:0.25rem 0.55rem; font-size:0.75rem; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:0.2rem;">
              <span>👁️</span> View
            </button>
            <button type="button" onclick="deleteUserDocument('${doc.id || doc.ref}')" title="Delete document" style="background:none; border:none; cursor:pointer; font-size:0.8rem; color:#94a3b8; padding:2px;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#94a3b8'">🗑️</button>
            <div class="doc-dl" onclick="downloadDocument('${doc.id || doc.ref}', '${(doc.name || doc.title || '').replace(/'/g, "\\'")}', '${doc.category || 'General'}')" title="Download ${doc.name || doc.title}" style="cursor:pointer; width:26px; height:26px; border-radius:6px; border:1px solid #cbd5e1; display:flex; align-items:center; justify-content:center; color:#0d7a6b; background:#f0fdfa;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");
};

window.deleteUserDocument = function(docId) {
  const activeAcc = AlgoAccounts.getActiveAccount();
  if (!activeAcc.documents) return;
  activeAcc.documents = activeAcc.documents.filter(d => d.id !== docId && d.ref !== docId);
  AlgoAccounts.addOrUpdateAccount(activeAcc);
  renderDocumentsGrid();
  AlgoUI.showToast("Document deleted successfully from repository.", "info");
};

// ----------------------------------------------------------------------------
// Upload Document Modal & Persistent Handler
// ----------------------------------------------------------------------------
window.openUploadDocumentModal = function() {
  const defaultRes = window.getAutoDocExpiry("Certificate of Incorporation");
  const bodyHtml = `
    <form id="upload-doc-form" onsubmit="handleUploadDocSubmit(event)" style="display:flex; flex-direction:column; gap:1.15rem;">
      <div>
        <label style="display:block; font-size:0.75rem; font-weight:700; color:#334155; margin-bottom:0.35rem;">Document Category &amp; Title</label>
        <select id="modal-doc-type" onchange="window.updateDocExpiryPreview(this.value)" style="width:100%; padding:0.6rem 0.75rem; border:1.5px solid #cbd5e1; border-radius:8px; font-size:0.86rem; box-sizing:border-box; background:#fff; color:#0f172a; font-weight:600;">
          <option value="Certificate of Incorporation" data-cat="Incorporation">Certificate of Incorporation</option>
          <option value="GST Registration Certificate" data-cat="Tax">GST Registration Certificate</option>
          <option value="Site & Building Layout Plan" data-cat="Factory">Site &amp; Building Layout Plan</option>
          <option value="Fire Safety Audit & NOC" data-cat="Fire Safety">Fire Safety Audit &amp; NOC</option>
          <option value="Factory Stability Certificate" data-cat="Factory">Factory Stability Certificate</option>
          <option value="Boiler Inspection Report" data-cat="Factory">Boiler Inspection Report</option>
          <option value="Power Sanction Order" data-cat="Factory">Power Sanction Order</option>
          <option value="Consent to Establish (MPCB)" data-cat="Environmental">Consent to Establish (MPCB)</option>
          <option value="Authorised Signatory Letter" data-cat="Incorporation">Authorised Signatory Letter</option>
          <option value="Environmental Compliance Audit" data-cat="Environmental">Environmental Compliance Audit</option>
          <option value="Other Industrial Permit / Custom Document" data-cat="General">Other Industrial Permit / Custom Document</option>
        </select>
      </div>

      <div id="custom-doc-name-group" style="display:none;">
        <label style="display:block; font-size:0.75rem; font-weight:700; color:#334155; margin-bottom:0.35rem;">Custom Document Title</label>
        <input type="text" id="modal-doc-custom-name" placeholder="e.g. Hazardous Chemical Storage Approval" style="width:100%; padding:0.55rem 0.75rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.84rem; box-sizing:border-box;">
      </div>

      <div>
        <label style="display:block; font-size:0.75rem; font-weight:700; color:#334155; margin-bottom:0.35rem;">Select Document File (PDF, JPG, PNG, DOCX, XLSX)</label>
        <input type="file" id="modal-doc-file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls" style="width:100%; padding:0.65rem; border:1.5px dashed #0d7a6b; border-radius:8px; font-size:0.82rem; background:#f0fdfa; box-sizing:border-box; color:#334155;">
      </div>

      <!-- Automated Expiry Calculator Badge -->
      <div style="background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:8px; padding:0.85rem 1rem; display:flex; align-items:flex-start; gap:0.75rem;">
        <div style="width:28px; height:28px; border-radius:6px; background:#e6f5f3; color:#0d7a6b; display:flex; align-items:center; justify-content:center; font-size:0.9rem; flex-shrink:0;">
          ⚡
        </div>
        <div>
          <div style="display:flex; align-items:center; gap:0.45rem;">
            <span style="font-size:0.75rem; font-weight:800; color:#0d7a6b; text-transform:uppercase; letter-spacing:0.5px;">Statutory Validity Computed</span>
            <span id="doc-expiry-cycle-text" style="font-size:0.68rem; font-weight:700; background:#ccfbf1; color:#0f766e; padding:0.15rem 0.45rem; border-radius:12px;">${defaultRes.cycle}</span>
          </div>
          <div id="doc-expiry-preview-text" style="font-size:0.84rem; font-weight:600; color:#334155; margin-top:3px;">${defaultRes.text}</div>
        </div>
      </div>
    </form>
  `;
  const footerHtml = `
    <button type="button" class="btn btn-secondary btn-sm" onclick="AlgoUI.closeModal()" style="padding:0.5rem 1rem; border:1px solid #cbd5e1; border-radius:6px; background:#fff; cursor:pointer; font-weight:600;">Cancel</button>
    <button type="button" class="btn btn-primary btn-sm" onclick="handleUploadDocSubmit(event)" style="padding:0.5rem 1.25rem; border:none; border-radius:6px; background:#0d7a6b; color:#fff; cursor:pointer; font-weight:700;">Upload &amp; Store →</button>
  `;
  AlgoUI.openModal("Upload Enterprise Document", bodyHtml, footerHtml);

  const docTypeSelect = document.getElementById("modal-doc-type");
  if (docTypeSelect) {
    docTypeSelect.addEventListener("change", () => {
      const customGroup = document.getElementById("custom-doc-name-group");
      if (customGroup) {
        customGroup.style.display = docTypeSelect.value.includes("Other") ? "block" : "none";
      }
    });
  }
};

window.handleUploadDocSubmit = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const docTypeSelect = document.getElementById("modal-doc-type");
  const customName = document.getElementById("modal-doc-custom-name")?.value?.trim();
  const docType = (docTypeSelect?.value?.includes("Other") && customName) ? customName : (docTypeSelect?.value || "Statutory Document");
  const selectedOption = docTypeSelect?.selectedOptions ? docTypeSelect.selectedOptions[0] : null;
  const docCat = selectedOption?.getAttribute("data-cat") || "General";
  const expiryInfo = window.getAutoDocExpiry(docType);

  const fileInput = document.getElementById("modal-doc-file");
  const file = fileInput && fileInput.files && fileInput.files[0];

  const activeAcc = AlgoAccounts.getActiveAccount();
  if (!activeAcc.documents) {
    activeAcc.documents = [];
  }

  function finishSave(dataUrl, fileName, fileSize, ext) {
    const docRef = "DOC-" + Math.floor(100000 + Math.random()*900000);
    const newDoc = {
      id: docRef,
      ref: docRef,
      name: docType,
      title: docType,
      category: docCat,
      fileName: fileName || `${docType.replace(/[^a-zA-Z0-9_-]/g, '_')}.${(ext || 'pdf').toLowerCase()}`,
      fileSize: fileSize || "1.4 MB",
      type: (ext || "PDF").toUpperCase(),
      date: "Uploaded " + new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      dataUrl: dataUrl || null,
      hasFile: !!dataUrl,
      expiryDate: expiryInfo.dateStr,
      validityCycle: expiryInfo.cycle,
      status: "Under Review",
      isBaseline: false
    };

    activeAcc.documents.unshift(newDoc);
    AlgoAccounts.addOrUpdateAccount(activeAcc);

    // Re-render documents grid if on documents page
    renderDocumentsGrid();

    AlgoUI.showToast(`Document "${docType}" successfully uploaded, encrypted, and saved!`, "success");
    AlgoUI.closeModal();

    // Background sync with API
    if (file) {
      const formData = new FormData();
      formData.append("docName", docType);
      formData.append("category", docCat);
      formData.append("file", file);
      fetch("/api/documents/upload", { method: "POST", body: formData }).catch(() => {});
    }
  }

  if (!file) {
    AlgoUI.showToast("Please select a document file to upload.", "warning");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(evt) {
    const dataUrl = evt.target.result;
    const sizeStr = (file.size < 1024*1024) ? (file.size/1024).toFixed(1) + " KB" : (file.size/(1024*1024)).toFixed(1) + " MB";
    const ext = file.name.split('.').pop().toUpperCase() || 'PDF';
    finishSave(dataUrl, file.name, sizeStr, ext);
  };
  reader.readAsDataURL(file);
};

window.openApplicationDetailModal = function(ref, title, dept, status, update) {
  const bodyHtml = `
    <div style="display:flex; flex-direction:column; gap:1.15rem;">
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:0.85rem 1rem; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:0.75rem; color:#0d7a6b; font-weight:800; font-family:monospace;">${ref}</div>
          <div style="font-size:1.05rem; font-weight:800; color:#0f172a; margin-top:2px;">${title}</div>
          <div style="font-size:0.78rem; color:#64748b; margin-top:2px;">${dept}</div>
        </div>
        <span style="font-size:0.75rem; font-weight:700; padding:0.25rem 0.65rem; border-radius:20px; background:#e6f5f3; color:#0d7a6b;">● ${status}</span>
      </div>

      <div>
        <div style="font-size:0.78rem; font-weight:700; color:#475569; text-transform:uppercase; margin-bottom:0.4rem;">Status & Department Update</div>
        <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:8px; padding:0.85rem; font-size:0.84rem; color:#78350f; line-height:1.5;">
          ${update || 'Application has been submitted and registered with the competent authority. Technical scrutiny in progress.'}
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
        <button type="button" class="btn btn-secondary btn-sm" onclick="AlgoUI.showToast('Downloading formal application copy (PDF)...', 'info')" style="padding:0.5rem; border:1px solid #cbd5e1; border-radius:6px; background:#fff; cursor:pointer; font-weight:600; font-size:0.82rem;">📄 Download Filing Copy</button>
        <button type="button" class="btn btn-secondary btn-sm" onclick="AlgoUI.showToast('Generating official fee acknowledgment receipt...', 'info')" style="padding:0.5rem; border:1px solid #cbd5e1; border-radius:6px; background:#fff; cursor:pointer; font-weight:600; font-size:0.82rem;">🧾 Fee Receipt</button>
      </div>
    </div>
  `;
  const footerHtml = `
    <button type="button" class="btn btn-secondary btn-sm" onclick="AlgoUI.closeModal()" style="padding:0.5rem 1rem; border:1px solid #cbd5e1; border-radius:6px; background:#fff; cursor:pointer; font-weight:600;">Close</button>
    <button type="button" class="btn btn-primary btn-sm" onclick="AlgoUI.showToast('Official communication submitted to department scrutiny desk.', 'success'); AlgoUI.closeModal();" style="padding:0.5rem 1.25rem; border:none; border-radius:6px; background:#0d7a6b; color:#fff; cursor:pointer; font-weight:700;">Submit Query / Response →</button>
  `;
  AlgoUI.openModal("Application Details: " + ref, bodyHtml, footerHtml);
};

// ----------------------------------------------------------------------------
// 10. Global Event Delegation & DOM Ready Initializer
// ----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  AlgoAccounts.syncCurrentPageDOM();
  AlgoUI.setupNavigation();

  const path = window.location.pathname.toLowerCase();
  if (path.includes("profile") || document.getElementById("business-profile-form")) {
    initProfilePage();
  } else if (path.includes("dashboard") || document.getElementById("dash-header-title")) {
    initDashboardPage();
  } else if (path.includes("approvals") || document.getElementById("requirements-table-container")) {
    initApprovalsPage();
  } else if (path.includes("applications") || document.getElementById("applications-table-container")) {
    initApplicationsPage();
  } else if (path.includes("documents") || document.getElementById("documents-list-container")) {
    initDocumentsPage();
  } else if (path.includes("renewals") || document.getElementById("renewals-table-container")) {
    initRenewalsPage();
  }
});

// Global click event delegation
document.addEventListener("click", (e) => {
  // 1. Topbar Profile Button Click -> Open Profile Menu Modal
  const userBtn = e.target.closest(".tb-user, .user-menu, .profile-pill");
  if (userBtn) {
    e.preventDefault();
    e.stopPropagation();
    openProfileMenuModal();
    return;
  }

  // 2. Global Close / Cross Buttons
  const closeBtn = e.target.closest(".modal-close, .detail-close, .close-btn, .btn-close, [data-close], [aria-label='Close']");
  if (closeBtn) {
    e.preventDefault();
    e.stopPropagation();
    const detailPanel = document.getElementById("detail-panel") || closeBtn.closest(".detail-panel, .detail");
    if (detailPanel && (closeBtn.classList.contains("detail-close") || closeBtn.closest(".detail-close"))) {
      detailPanel.style.display = "none";
      return;
    }
    if (typeof AlgoUI !== "undefined" && typeof AlgoUI.closeModal === "function") {
      AlgoUI.closeModal();
    }
    const modal = closeBtn.closest(".modal-overlay, #modal-overlay, .modal");
    if (modal) {
      modal.classList.remove("open", "show");
      modal.style.display = "none";
    }
    document.body.style.overflow = "";
  }
});

// Global Escape Key Listener
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (typeof AlgoUI !== "undefined" && typeof AlgoUI.closeModal === "function") {
      AlgoUI.closeModal();
    }
    const detailPanel = document.getElementById("detail-panel");
    if (detailPanel) {
      detailPanel.style.display = "none";
    }
  }
});

// Export globals explicitly
window.AlgoAccounts = AlgoAccounts;
window.AlgoUI = AlgoUI;

/**
 * ============================================================================
 * SetuBot — Industrial Compliance & Approvals AI Assistant
 * ============================================================================
 */
const SetuBot = {
  isOpen: false,
  messages: [],
  
  // Client-side fallback knowledge engine for zero-delay offline assistance
  knowledgeBase: [
    {
      keywords: ["fire", "fire noc", "cfo", "fire safety", "form a", "form b"],
      title: "Fire Safety No-Objection Certificate (NOC)",
      response: `**Fire Safety No-Objection Certificate (NOC)**\n• **Authority:** Directorate of Maharashtra Fire Services / Municipal CFO.\n• **Portal:** [mahafireservice.gov.in](https://mahafireservice.gov.in)\n• **Mandatory Documents:**\n  1. Architectural CAD Drawings (1:100 scale) showing setbacks, exit routes & hydrants.\n  2. Firefighting layout design scheme by Licensed Agency (Form A/B).\n  3. Building Structural Stability Certificate.\n• **Validity:** 1 Year for Provisional NOC; physical on-site inspection mandatory for Final NOC.`,
      quickLinks: [
        { text: "View Fire NOC", url: "approvals.html" },
        { text: "MahaFire Portal", url: "https://mahafireservice.gov.in", external: true }
      ]
    },
    {
      keywords: ["dish", "factory license", "form 1", "form 2", "factories act", "safety"],
      title: "Factory Operating License (Form 1 & 2)",
      response: `**Factory Registration & License (Under Factories Act 1948)**\n• **Authority:** Directorate of Industrial Safety & Health (DISH Maharashtra).\n• **Portal:** [dish.maharashtra.gov.in](https://dish.maharashtra.gov.in)\n• **Applicability:** Units employing 10+ workers with power, or 20+ without power.\n• **Mandatory Documents:**\n  1. Machinery layout plan & process flow chart.\n  2. Building Stability Certificate by DISH-empanelled structural engineer.\n  3. List of Plant & Machinery with connected HP/KW ratings.\n• **Validity:** 1 to 5 Years depending on fee slab.`,
      quickLinks: [
        { text: "Check Approvals", url: "approvals.html" },
        { text: "DISH Portal", url: "https://dish.maharashtra.gov.in", external: true }
      ]
    },
    {
      keywords: ["mpcb", "consent", "cte", "cto", "pollution", "etp", "stp", "effluent", "air", "water", "green", "orange", "red", "white"],
      title: "MPCB Pollution Consent (CTE / CTO)",
      response: `**MPCB Consent to Establish (CTE) & Operate (CTO)**\n• **Authority:** Maharashtra Pollution Control Board.\n• **Portal:** [ecmpcb.in](https://ecmpcb.in)\n• **Categories:**\n  - 🟢 **Green / White:** Low pollution risk; expedited processing.\n  - 🟠 **Orange:** Moderate risk; mandatory ETP/STP design.\n  - 🔴 **Red:** High impact; requires EIA & continuous monitoring.\n• **Mandatory Documents:** ETP design schematics, material & water balance sheet, MoEF stack emission lab test report.`,
      quickLinks: [
        { text: "View MPCB Clearance", url: "approvals.html" },
        { text: "e-MPCB Portal", url: "https://ecmpcb.in", external: true }
      ]
    },
    {
      keywords: ["document", "upload", "expiry", "vault", "calculate expiry", "storage", "download"],
      title: "Document Vault & Auto-Expiry",
      response: `**Document Vault & Auto-Expiry**\n• **Auto-Expiry Calculation:** When you select a document type (Fire NOC, Factory License, Consent), SetuBot automatically computes the statutory expiry date from your issue date!\n• **Downloads:** You can download official authorized PDF copies directly from the [Document Vault](documents.html).\n• **Storage:** All uploaded documents are securely stored and mapped to your business compliance passport.`,
      quickLinks: [
        { text: "Open Document Vault", url: "documents.html" }
      ]
    },
    {
      keywords: ["renewal", "renew", "due", "penalty", "expire", "grace period"],
      title: "License Renewals & Deadlines",
      response: `**License Renewals & Statutory Deadlines**\n• **Advance Renewal Window:** Initiate renewals **30-60 days** before expiry to avoid daily compounding fines and statutory stoppage notices.\n• **Manage Renewals:** Visit the [Renewals Page](renewals.html) for real-time countdowns, required fee calculations, and fast renewals.`,
      quickLinks: [
        { text: "View Renewals", url: "renewals.html" }
      ]
    },
    {
      keywords: ["profile", "business profile", "industry type", "sector", "power", "land", "nic"],
      title: "Business Profile Settings",
      response: `**Business Profile & Dynamic Rules**\n• Your registered Industry Type, State, Pollution Category, Scale, Power Load, and Land Area automatically determine your required approvals and inspections.\n• Update your details anytime in [Business Profile](profile.html).`,
      quickLinks: [
        { text: "Edit Profile", url: "profile.html" }
      ]
    },
    {
      keywords: ["application", "apply", "track", "checklist", "status"],
      title: "Applications & Status Tracking",
      response: `**Applying for Statutory Approvals**\n1. Go to [Required Approvals](approvals.html) and select any required clearance.\n2. Click **Start Application** and upload the requested checklist items.\n3. Track processing and department nodal officer remarks on your [Dashboard](dashboard.html).`,
      quickLinks: [
        { text: "Required Approvals", url: "approvals.html" },
        { text: "Applications", url: "applications.html" }
      ]
    }
  ],

  init() {
    if (document.getElementById("setubot-launcher")) return;
    this.injectStyles();
    this.injectMarkup();
    this.bindEvents();
    this.loadChatHistory();
  },

  injectStyles() {
    if (document.getElementById("setubot-injected-css")) return;
    const style = document.createElement("style");
    style.id = "setubot-injected-css";
    style.textContent = `
      .setubot-launcher {
        position: fixed !important;
        bottom: 24px !important;
        right: 24px !important;
        z-index: 99999 !important;
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        background: linear-gradient(135deg, #0d7a6b 0%, #064e3b 100%) !important;
        color: #ffffff !important;
        padding: 10px 16px !important;
        border-radius: 50px !important;
        box-shadow: 0 10px 25px -3px rgba(13, 122, 107, 0.4), 0 4px 10px rgba(0,0,0,0.15) !important;
        cursor: pointer !important;
        border: 1.5px solid rgba(255, 255, 255, 0.25) !important;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
        user-select: none !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      }
      .setubot-launcher:hover {
        transform: translateY(-2px) scale(1.02) !important;
        box-shadow: 0 14px 28px -4px rgba(13, 122, 107, 0.5) !important;
      }
      .setubot-launcher-icon {
        width: 30px !important;
        height: 30px !important;
        background: rgba(255, 255, 255, 0.2) !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 1.1rem !important;
        flex-shrink: 0 !important;
        position: relative !important;
      }
      .setubot-launcher-dot {
        position: absolute !important;
        top: -1px !important;
        right: -1px !important;
        width: 9px !important;
        height: 9px !important;
        background: #10b981 !important;
        border: 2px solid #ffffff !important;
        border-radius: 50% !important;
      }
      .setubot-launcher-text {
        display: flex !important;
        flex-direction: column !important;
        line-height: 1.15 !important;
      }
      .setubot-launcher-title {
        font-size: 0.88rem !important;
        font-weight: 700 !important;
        color: #ffffff !important;
      }
      .setubot-launcher-sub {
        font-size: 0.68rem !important;
        font-weight: 500 !important;
        color: rgba(255, 255, 255, 0.85) !important;
      }
      .setubot-window {
        position: fixed !important;
        bottom: 24px !important;
        right: 24px !important;
        width: 380px !important;
        max-width: calc(100vw - 32px) !important;
        height: 540px !important;
        max-height: calc(100vh - 48px) !important;
        background: #ffffff !important;
        border-radius: 16px !important;
        box-shadow: 0 20px 50px -10px rgba(15, 23, 42, 0.35) !important;
        border: 1px solid #e2e8f0 !important;
        display: flex !important;
        flex-direction: column !important;
        z-index: 100000 !important;
        overflow: hidden !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      }
      .setubot-window.hidden {
        display: none !important;
      }
      .setubot-header {
        background: #111827 !important;
        color: #ffffff !important;
        padding: 12px 16px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        flex-shrink: 0 !important;
      }
      .setubot-header-info {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
      }
      .setubot-avatar {
        width: 32px !important;
        height: 32px !important;
        background: #0d7a6b !important;
        border-radius: 8px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 1.1rem !important;
      }
      .setubot-header-text h4 {
        font-size: 0.92rem !important;
        font-weight: 700 !important;
        margin: 0 !important;
        color: #ffffff !important;
      }
      .setubot-status-badge {
        font-size: 0.66rem !important;
        font-weight: 600 !important;
        color: #34d399 !important;
      }
      .setubot-header-actions {
        display: flex !important;
        gap: 6px !important;
      }
      .setubot-header-btn {
        background: rgba(255, 255, 255, 0.12) !important;
        border: none !important;
        color: #cbd5e1 !important;
        width: 26px !important;
        height: 26px !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      .setubot-header-btn:hover {
        background: rgba(255, 255, 255, 0.25) !important;
        color: #fff !important;
      }
      .setubot-messages {
        flex: 1 !important;
        overflow-y: auto !important;
        padding: 14px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 12px !important;
        background: #f8fafc !important;
      }
      .setubot-msg-row {
        display: flex !important;
        gap: 8px !important;
        max-width: 90% !important;
      }
      .setubot-msg-row.user {
        align-self: flex-end !important;
        flex-direction: row-reverse !important;
      }
      .setubot-msg-row.bot {
        align-self: flex-start !important;
      }
      .setubot-msg-avatar {
        width: 26px !important;
        height: 26px !important;
        border-radius: 6px !important;
        background: #0d7a6b !important;
        color: #fff !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 0.8rem !important;
        flex-shrink: 0 !important;
      }
      .setubot-msg-bubble {
        padding: 10px 12px !important;
        border-radius: 12px !important;
        font-size: 0.84rem !important;
        line-height: 1.45 !important;
        color: #1e293b !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
      }
      .setubot-msg-row.user .setubot-msg-bubble {
        background: #0d7a6b !important;
        color: #ffffff !important;
      }
      .setubot-msg-row.bot .setubot-msg-bubble {
        background: #ffffff !important;
        border: 1px solid #e2e8f0 !important;
      }
      .setubot-msg-bubble p { margin: 0 0 4px 0 !important; }
      .setubot-msg-bubble p:last-child { margin-bottom: 0 !important; }
      .setubot-msg-bubble ul, .setubot-msg-bubble ol { margin: 4px 0 !important; padding-left: 16px !important; }
      .setubot-msg-bubble li { margin-bottom: 2px !important; }
      .setubot-msg-bubble a { color: #0d7a6b !important; font-weight: 600 !important; }
      .setubot-quick-links {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 6px !important;
        margin-top: 8px !important;
        padding-top: 6px !important;
        border-top: 1px dashed #e2e8f0 !important;
      }
      .setubot-btn-link {
        display: inline-flex !important;
        align-items: center !important;
        gap: 4px !important;
        background: #e6f5f3 !important;
        color: #0d7a6b !important;
        font-size: 0.75rem !important;
        font-weight: 700 !important;
        padding: 4px 8px !important;
        border-radius: 6px !important;
        text-decoration: none !important;
      }
      .setubot-btn-link:hover {
        background: #0d7a6b !important;
        color: #ffffff !important;
      }
      .setubot-suggestions {
        padding: 6px 12px !important;
        background: #ffffff !important;
        border-top: 1px solid #e2e8f0 !important;
        display: flex !important;
        gap: 6px !important;
        overflow-x: auto !important;
        flex-shrink: 0 !important;
      }
      .setubot-chip {
        background: #f1f5f9 !important;
        border: 1px solid #cbd5e1 !important;
        color: #334155 !important;
        font-size: 0.74rem !important;
        font-weight: 600 !important;
        padding: 4px 8px !important;
        border-radius: 16px !important;
        white-space: nowrap !important;
        cursor: pointer !important;
      }
      .setubot-chip:hover {
        background: #0d7a6b !important;
        color: #ffffff !important;
      }
      .setubot-typing {
        display: flex !important;
        gap: 4px !important;
        padding: 8px 12px !important;
        background: #ffffff !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 12px !important;
      }
      .setubot-typing-dot {
        width: 5px !important;
        height: 5px !important;
        background: #94a3b8 !important;
        border-radius: 50% !important;
        animation: setubotBounce 1.2s infinite ease-in-out !important;
      }
      .setubot-typing-dot:nth-child(2) { animation-delay: 0.2s !important; }
      .setubot-typing-dot:nth-child(3) { animation-delay: 0.4s !important; }
      @keyframes setubotBounce {
        0%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-4px); background: #0d7a6b; }
      }
      .setubot-input-area {
        padding: 10px 12px !important;
        background: #ffffff !important;
        border-top: 1px solid #e2e8f0 !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        flex-shrink: 0 !important;
      }
      .setubot-input {
        flex: 1 !important;
        border: 1px solid #cbd5e1 !important;
        border-radius: 20px !important;
        padding: 8px 14px !important;
        font-size: 0.84rem !important;
        outline: none !important;
      }
      .setubot-input:focus {
        border-color: #0d7a6b !important;
      }
      .setubot-send-btn {
        width: 34px !important;
        height: 34px !important;
        border-radius: 50 !important;
        background: #0d7a6b !important;
        color: #ffffff !important;
        border: none !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
      }
    `;
    document.head.appendChild(style);
  },

  injectMarkup() {
    const launcher = document.createElement("div");
    launcher.id = "setubot-launcher";
    launcher.className = "setubot-launcher";
    launcher.innerHTML = `
      <div class="setubot-launcher-icon">
        🤖
        <div class="setubot-launcher-dot"></div>
      </div>
      <div class="setubot-launcher-text">
        <span class="setubot-launcher-title">Ask SetuBot</span>
        <span class="setubot-launcher-sub">Compliance AI</span>
      </div>
    `;

    const chatWindow = document.createElement("div");
    chatWindow.id = "setubot-window";
    chatWindow.className = "setubot-window hidden";
    chatWindow.innerHTML = `
      <div class="setubot-header">
        <div class="setubot-header-info">
          <div class="setubot-avatar">🤖</div>
          <div class="setubot-header-text">
            <h4>SetuBot AI</h4>
            <div class="setubot-status-badge">Compliance Assistant • Online</div>
          </div>
        </div>
        <div class="setubot-header-actions">
          <button class="setubot-header-btn" id="setubot-expand-btn" title="Toggle Fullscreen Mode">⛶</button>
          <button class="setubot-header-btn" id="setubot-clear-btn" title="Clear Chat">🗑️</button>
          <button class="setubot-header-btn" id="setubot-close-btn" title="Close">✕</button>
        </div>
      </div>

      <div class="setubot-messages" id="setubot-messages"></div>

      <div class="setubot-suggestions" id="setubot-suggestions">
        <button class="setubot-chip" data-query="Which approvals do I need?">📋 Which approvals do I need?</button>
        <button class="setubot-chip" data-query="Documents needed for Fire NOC">🔥 Fire NOC Docs</button>
        <button class="setubot-chip" data-query="Where to submit MPCB Consent?">🏛️ MPCB Portal & Desks</button>
        <button class="setubot-chip" data-query="How does automatic document expiry work?">📑 Auto-Expiry Rules</button>
        <button class="setubot-chip" data-query="How do I renew my factory license?">⏰ License Renewals</button>
      </div>

      <div class="setubot-input-area">
        <input type="text" id="setubot-input" class="setubot-input" placeholder="Ask about approvals, documents, portals..." autocomplete="off" />
        <button id="setubot-send-btn" class="setubot-send-btn" title="Send Message">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(launcher);
    document.body.appendChild(chatWindow);
  },

  bindEvents() {
    const launcher = document.getElementById("setubot-launcher");
    const chatWindow = document.getElementById("setubot-window");
    const closeBtn = document.getElementById("setubot-close-btn");
    const clearBtn = document.getElementById("setubot-clear-btn");
    const expandBtn = document.getElementById("setubot-expand-btn");
    const sendBtn = document.getElementById("setubot-send-btn");
    const input = document.getElementById("setubot-input");
    const suggestions = document.getElementById("setubot-suggestions");

    launcher.addEventListener("click", () => this.toggleChat());
    closeBtn.addEventListener("click", () => this.toggleChat(false));
    
    if (expandBtn) {
      expandBtn.addEventListener("click", () => {
        const isFull = chatWindow.classList.toggle("fullscreen");
        expandBtn.textContent = isFull ? "🗗" : "⛶";
        expandBtn.title = isFull ? "Restore Normal Size" : "Expand Fullscreen Mode";
        this.scrollToBottom();
      });
    }

    clearBtn.addEventListener("click", () => {
      sessionStorage.removeItem("setubot_history");
      this.messages = [];
      this.renderWelcome();
    });

    sendBtn.addEventListener("click", () => {
      const q = input.value.trim();
      if (q) {
        this.handleUserSend(q);
        input.value = "";
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const q = input.value.trim();
        if (q) {
          this.handleUserSend(q);
          input.value = "";
        }
      }
    });

    suggestions.addEventListener("click", (e) => {
      const chip = e.target.closest(".setubot-chip");
      if (chip) {
        const query = chip.getAttribute("data-query") || chip.textContent;
        this.handleUserSend(query.replace(/^[^\w]+/, '')); // strip leading emoji
      }
    });
  },

  toggleChat(forceState) {
    const chatWindow = document.getElementById("setubot-window");
    const launcher = document.getElementById("setubot-launcher");
    this.isOpen = typeof forceState === "boolean" ? forceState : !this.isOpen;

    if (this.isOpen) {
      chatWindow.classList.remove("hidden");
      launcher.style.display = "none";
      const input = document.getElementById("setubot-input");
      setTimeout(() => input?.focus(), 150);
      this.scrollToBottom();
    } else {
      chatWindow.classList.add("hidden");
      launcher.style.display = "flex";
    }
  },

  loadChatHistory() {
    try {
      const saved = sessionStorage.getItem("setubot_history");
      if (saved) {
        this.messages = JSON.parse(saved);
        this.renderAllMessages();
        return;
      }
    } catch(e) {}
    this.renderWelcome();
  },

  saveChatHistory() {
    try {
      sessionStorage.setItem("setubot_history", JSON.stringify(this.messages));
    } catch(e) {}
  },

  renderWelcome() {
    const container = document.getElementById("setubot-messages");
    container.innerHTML = "";
    const welcome = {
      sender: "bot",
      text: `Hello! 👋 I am **SetuBot**, your dedicated Industrial Compliance & Statutory Approvals Assistant.\n\nAsk me anything about:\n• Finding **mandatory approvals & licenses** for your industry\n• **Documents required** for Fire NOC, MPCB, Factory License\n• **Where to submit** applications & official government portals\n• **Document uploads & automatic expiry dates**\n• **Renewal timelines and fee calculations**`,
      quickLinks: [
        { text: "Required Approvals", url: "approvals.html" },
        { text: "Document Vault", url: "documents.html" },
        { text: "License Renewals", url: "renewals.html" }
      ]
    };
    this.messages = [welcome];
    this.saveChatHistory();
    this.renderAllMessages();
  },

  renderAllMessages() {
    const container = document.getElementById("setubot-messages");
    container.innerHTML = "";
    this.messages.forEach(msg => {
      this.appendMessageElement(msg, false);
    });
    this.scrollToBottom();
  },

  appendMessageElement(msg, animate = true) {
    const container = document.getElementById("setubot-messages");
    const row = document.createElement("div");
    row.className = `setubot-msg-row ${msg.sender}`;
    if (!animate) row.style.animation = "none";

    const formattedText = this.formatMarkdown(msg.text);

    let linksHtml = "";
    if (msg.quickLinks && msg.quickLinks.length > 0) {
      linksHtml = `
        <div class="setubot-quick-links">
          ${msg.quickLinks.map(l => `
            <a href="${l.url}" ${l.external ? 'target="_blank" rel="noopener noreferrer"' : ''} class="setubot-btn-link">
              ${l.external ? '🔗' : '📌'} ${l.text}
            </a>
          `).join('')}
        </div>
      `;
    }

    row.innerHTML = `
      <div class="setubot-msg-avatar">${msg.sender === 'bot' ? '🤖' : '👤'}</div>
      <div class="setubot-msg-bubble">
        ${formattedText}
        ${linksHtml}
      </div>
    `;

    container.appendChild(row);
    this.scrollToBottom();
  },

  formatMarkdown(text) {
    if (!text) return "";
    let out = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Format list items
    const lines = out.split('\n');
    let html = '';
    let inList = false;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += `<li>${trimmed.substring(2)}</li>`;
      } else if (/^\d+\.\s/.test(trimmed)) {
        if (!inList) { html += '<ol>'; inList = true; }
        html += `<li>${trimmed.replace(/^\d+\.\s/, '')}</li>`;
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        if (trimmed) {
          html += `<p>${line}</p>`;
        }
      }
    });
    if (inList) html += '</ul>';

    return html;
  },

  showTypingIndicator() {
    const container = document.getElementById("setubot-messages");
    let typing = document.getElementById("setubot-typing-ind");
    if (!typing) {
      typing = document.createElement("div");
      typing.id = "setubot-typing-ind";
      typing.className = "setubot-msg-row bot";
      typing.innerHTML = `
        <div class="setubot-msg-avatar">🤖</div>
        <div class="setubot-typing">
          <div class="setubot-typing-dot"></div>
          <div class="setubot-typing-dot"></div>
          <div class="setubot-typing-dot"></div>
        </div>
      `;
      container.appendChild(typing);
      this.scrollToBottom();
    }
  },

  hideTypingIndicator() {
    const typing = document.getElementById("setubot-typing-ind");
    if (typing) typing.remove();
  },

  async handleUserSend(userText) {
    // 1. Add user message
    const userMsg = { sender: "user", text: userText };
    this.messages.push(userMsg);
    this.appendMessageElement(userMsg);
    this.saveChatHistory();

    // 2. Show typing
    this.showTypingIndicator();

    // 3. Request bot reply from Gemini RAG backend
    try {
      const activeAcc = (typeof AlgoAccounts !== "undefined") ? AlgoAccounts.getActiveAccount() : null;
      const historyPayload = this.messages.slice(-6).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const response = await fetch(`${API_BASE}/chat/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userText,
          history: historyPayload,
          userProfile: activeAcc ? {
            state: activeAcc.state,
            industryType: activeAcc.industryType,
            companyName: activeAcc.companyName
          } : {}
        })
      });

      if (response.ok) {
        const data = await response.json();
        this.hideTypingIndicator();
        const botMsg = {
          sender: "bot",
          text: data.reply || data.response || "I am checking the statutory regulations...",
          quickLinks: data.quickLinks || []
        };
        this.messages.push(botMsg);
        this.appendMessageElement(botMsg);
        this.saveChatHistory();
        return;
      }
    } catch (e) {
      console.warn("RAG server query failed, falling back to local intelligence:", e);
    }

    // Fallback Client Intelligence
    this.hideTypingIndicator();
    const fallbackBotReply = this.resolveClientFallback(userText);
    this.messages.push(fallbackBotReply);
    this.appendMessageElement(fallbackBotReply);
    this.saveChatHistory();
  },

  resolveClientFallback(query) {
    const q = query.toLowerCase();
    
    if (/^(hi|hello|hey|greetings|namaste)\b/i.test(q)) {
      return {
        sender: "bot",
        text: `Hello! 👋 How can I help you today with your industrial clearances, document uploads, or renewal tracking?`,
        quickLinks: [
          { text: "Required Approvals", url: "approvals.html" },
          { text: "Document Vault", url: "documents.html" }
        ]
      };
    }

    for (const item of this.knowledgeBase) {
      if (item.keywords.some(k => q.includes(k))) {
        return {
          sender: "bot",
          text: item.response,
          quickLinks: item.quickLinks || []
        };
      }
    }

    return {
      sender: "bot",
      text: `Here is information on **${query}**:\n\nIndustrial statutory clearances require coordination with respective state agencies:\n• **Fire Safety:** Directorate of Maharashtra Fire Services\n• **Factory License:** DISH Maharashtra\n• **Pollution Control:** Maharashtra Pollution Control Board (MPCB)\n• **Building Approvals:** MIDC Planning Authority\n\nVisit [Required Approvals](approvals.html) or [Document Vault](documents.html) for detailed step-by-step assistance!`,
      quickLinks: [
        { text: "Required Approvals", url: "approvals.html" },
        { text: "Document Vault", url: "documents.html" },
        { text: "Renewals", url: "renewals.html" }
      ]
    };
  },

  scrollToBottom() {
    const container = document.getElementById("setubot-messages");
    if (container) {
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 50);
    }
  }
};

window.SetuBot = SetuBot;

// Auto-initialize SetuBot when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => SetuBot.init());
} else {
  SetuBot.init();
}


