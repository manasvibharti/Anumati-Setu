/**
 * ============================================================================
 * AnumatiSetu — Documents Routes (Mongoose / User Scoped)
 * ============================================================================
 */

const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const Document = require("../models/Document");
const Approval = require("../models/Approval");
const { logActivity, generateId, todayStr } = require("../helpers");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const docId = generateId("DOC");
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${docId}_${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(pdf|jpg|jpeg|png|doc|docx|xlsx|xls|txt)$/i;
    if (allowed.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error("File type not allowed. Use PDF, JPG, PNG, DOC, DOCX, XLSX, or TXT."));
    }
  },
});

function formatSize(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function parseDoc(doc) {
  if (!doc) return null;
  return {
    id:            doc.id,
    name:          doc.name,
    category:      doc.category,
    fileName:      doc.fileName,
    filePath:      doc.filePath,
    fileSize:      doc.fileSize,
    uploadedDate:  doc.uploadedDate,
    expiryDate:    doc.expiryDate,
    status:        doc.status,
    applicationId: doc.applicationId,
    hasFile:       !!doc.hasFile,
    createdAt:     doc.createdAt,
  };
}

// Handler for uploading documents
async function handleUpload(req, res) {
  const docName = (req.body.docName || req.body.name || "").trim();
  const category = req.body.category || "General";
  const applicationId = req.body.applicationId || null;
  const expiryDate = req.body.expiryDate || null;

  if (!docName) return res.status(400).json({ error: "Document name is required" });

  try {
    let docId, fileName, filePath, fileSize, hasFile;

    if (req.file) {
      docId = req.file.filename.split("_")[0];
      fileName = req.file.filename;
      filePath = req.file.path;
      fileSize = formatSize(req.file.size);
      hasFile = true;
    } else {
      docId = generateId("DOC");
      fileName = `${docName.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.pdf`;
      filePath = null;
      fileSize = "—";
      hasFile = false;
    }

    const today = todayStr();

    const newDoc = await Document.create({
      id: docId,
      userId: req.user.id,
      name: docName,
      category,
      fileName,
      filePath,
      fileSize,
      uploadedDate: today,
      expiryDate,
      status: "UPLOADED",
      applicationId,
      hasFile
    });

    // If linked to application, attach to documentsAttached list
    if (applicationId) {
      const app = await Approval.findOne({ userId: req.user.id, id: applicationId });
      if (app) {
        if (!app.documentsAttached.includes(docName)) {
          app.documentsAttached.push(docName);
          await app.save();
        }
      }
    }

    await logActivity(req.user.id, `Document uploaded: ${docName}`, "Documents");

    res.status(201).json(parseDoc(newDoc));
  } catch (err) {
    console.error("[Documents POST]", err);
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    res.status(500).json({ error: err.message });
  }
}

// GET /api/documents
router.get("/", async (req, res) => {
  try {
    const docs = await Document.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    res.json(docs.map(parseDoc));
  } catch (err) {
    console.error("[Documents GET]", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/documents AND POST /api/documents/upload
router.post("/", upload.single("file"), handleUpload);
router.post("/upload", upload.single("file"), handleUpload);

// DELETE /api/documents/:id
router.delete("/:id", async (req, res) => {
  try {
    const doc = await Document.findOne({ userId: req.user.id, id: req.params.id });
    if (!doc) return res.status(404).json({ error: "Document not found" });

    if (doc.filePath && fs.existsSync(doc.filePath)) {
      try { fs.unlinkSync(doc.filePath); } catch (e) {}
    }

    await Document.deleteOne({ _id: doc._id });
    await logActivity(req.user.id, `Deleted document: ${doc.name}`, "Documents");

    res.json({ success: true });
  } catch (err) {
    console.error("[Documents DELETE]", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
