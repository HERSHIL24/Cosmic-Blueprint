const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Report = require('../models/Report');
const { analyzeKundliImage } = require('../engines/kundliOCREngine');

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '../uploads/kundli');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only JPG, PNG, and PDF files are allowed'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

// POST /api/kundli/analyze
router.post('/analyze', upload.single('kundliFile'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a Kundli image or PDF.' });

    const userId = req.body.userId || req.headers['x-user-id'];
    const filePath = req.file.path;

    console.log(`[Kundli] Analyzing uploaded file: ${req.file.filename}`);
    const analysis = await analyzeKundliImage(filePath);

    // Clean up the temp file after processing
    try { fs.unlinkSync(filePath); } catch (_) {}

    const result = {
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      analysis,
      disclaimer: 'This Kundli analysis is generated using OCR text extraction and traditional Vedic interpretation frameworks for educational and reflective purposes. It does not constitute professional astrological advice.'
    };

    if (userId) {
      await Report.create({ userId, reportType: 'kundli', inputData: { fileName: req.file.originalname }, result });
    }

    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

// GET /api/kundli/history/:userId
router.get('/history/:userId', async (req, res, next) => {
  try {
    const reports = await Report.find({ userId: req.params.userId, reportType: 'kundli' })
      .sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, data: reports });
  } catch (err) { next(err); }
});

module.exports = router;
