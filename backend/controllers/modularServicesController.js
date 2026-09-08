const crypto = require('crypto');
const fs = require('fs');
const aiClient = require('../services/aiClient');
const riskEngine = require('../services/riskEngine');
const blockchainLedger = require('../services/blockchainLedger');

const processOCR = async (req, res) => {
  try {
    const { documentType = 'Passport', scenarioType = 'GENUINE' } = req.body;
    const aiResult = await aiClient.processPipeline({ documentType, scenarioType });
    return res.status(200).json({
      success: true,
      data: aiResult.ocr
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'OCR analysis failed.' });
  }
};

const processFaceVerification = async (req, res) => {
  try {
    const { scenarioType = 'GENUINE' } = req.body;
    const aiResult = await aiClient.processPipeline({ scenarioType });
    return res.status(200).json({
      success: true,
      data: aiResult.face
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Face biometric verification failed.' });
  }
};

const processTamperingAnalysis = async (req, res) => {
  try {
    const { scenarioType = 'GENUINE' } = req.body;
    const aiResult = await aiClient.processPipeline({ scenarioType });
    return res.status(200).json({
      success: true,
      data: aiResult.tampering
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Forensic tampering analysis failed.' });
  }
};

const generateDocumentHash = async (req, res) => {
  try {
    let sha256Hash = '';
    if (req.file) {
      const buffer = fs.readFileSync(req.file.path);
      sha256Hash = crypto.createHash('sha256').update(buffer).digest('hex');
    } else if (req.body.payload) {
      sha256Hash = crypto.createHash('sha256').update(req.body.payload).digest('hex');
    } else {
      sha256Hash = crypto.createHash('sha256').update(`SIMULATED_DOC_${Date.now()}`).digest('hex');
    }

    return res.status(200).json({
      success: true,
      hashAlgorithm: 'SHA-256',
      hashLength: '256-bit',
      hash: sha256Hash,
      timestamp: new Date()
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Hash generation failed.' });
  }
};

const evaluateRiskScore = async (req, res) => {
  try {
    const { ocrResult, faceResult, tamperingResult, integrityResult } = req.body;
    const assessment = riskEngine.evaluate({ ocrResult, faceResult, tamperingResult, integrityResult });
    return res.status(200).json({
      success: true,
      data: assessment
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Risk scoring calculation failed.' });
  }
};

module.exports = {
  processOCR,
  processFaceVerification,
  processTamperingAnalysis,
  generateDocumentHash,
  evaluateRiskScore
};
