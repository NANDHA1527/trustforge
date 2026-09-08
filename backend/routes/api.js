const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const verificationController = require('../controllers/verificationController');
const analyticsController = require('../controllers/analyticsController');
const ledgerController = require('../controllers/ledgerController');
const auditController = require('../controllers/auditController');
const reportsController = require('../controllers/reportsController');
const modularServicesController = require('../controllers/modularServicesController');

const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public / Auth
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticate, authController.getMe);

// Verification Workflow
router.post('/verifications', upload.single('document'), verificationController.createVerification);
router.post('/verifications/:id/process', verificationController.processVerification);
router.get('/verifications/:id', verificationController.getVerificationById);
router.get('/verifications', verificationController.getAllVerifications);
router.post('/officer-decision', verificationController.submitOfficerDecision);

// Modular Pipeline Endpoints
router.post('/ocr', modularServicesController.processOCR);
router.post('/face-verification', modularServicesController.processFaceVerification);
router.post('/tampering-analysis', modularServicesController.processTamperingAnalysis);
router.post('/hash', upload.single('document'), modularServicesController.generateDocumentHash);
router.post('/risk-score', modularServicesController.evaluateRiskScore);

// Blockchain & Integrity Ledger
router.get('/ledger', ledgerController.getLedger);
router.get('/integrity/verify', ledgerController.verifyLedgerIntegrity);
router.post('/integrity/verify', ledgerController.verifyLedgerIntegrity);

// Operational Dashboard & Analytics
router.get('/dashboard/stats', analyticsController.getDashboardStats);
router.get('/suspicious-cases', analyticsController.getSuspiciousCases);
router.post('/suspicious-cases/:caseId/note', analyticsController.addCaseNote);

// Audit Trail & Reports
router.get('/audit', auditController.getAuditLogs);
router.post('/reports', reportsController.generateReport);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'TrustForge Core Security Gateway',
    version: '1.0.0-SIH26188',
    timestamp: new Date()
  });
});

module.exports = router;
