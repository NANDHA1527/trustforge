const crypto = require('crypto');
const fs = require('fs');
const mockStore = require('../services/mockStore');
const blockchainLedger = require('../services/blockchainLedger');
const riskEngine = require('../services/riskEngine');
const aiClient = require('../services/aiClient');

const createVerification = async (req, res) => {
  try {
    const { documentType = 'Passport', scenarioType = 'CUSTOM', subjectName, subjectId } = req.body;
    const officerId = req.user ? req.user.officerId : 'TF-1024';

    let sha256Hash = '';
    let fileName = 'simulated_document.jpg';
    let filePath = '';
    let fileSize = 1024 * 350;
    let mimeType = 'image/jpeg';

    if (req.file) {
      fileName = req.file.originalname;
      filePath = req.file.path;
      fileSize = req.file.size;
      mimeType = req.file.mimetype;
      const fileBuffer = fs.readFileSync(req.file.path);
      sha256Hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    } else {
      // Synthetic scenario hash
      const randomSeed = scenarioType + Date.now() + Math.random();
      sha256Hash = crypto.createHash('sha256').update(randomSeed).digest('hex');
      fileName = `${scenarioType.toLowerCase()}_${documentType.toLowerCase()}.jpg`;
    }

    const verificationSeq = 1000 + mockStore.verifications.length + 1;
    const verificationId = `TF-2026-${verificationSeq}`;

    const newVerification = {
      _id: `v-${verificationId}`,
      verificationId,
      documentType,
      subjectId: subjectId || `SUB-${Math.floor(Math.random() * 89999 + 10000)}`,
      subjectName: subjectName || (scenarioType === 'GENUINE' ? 'Aarav Dev Sharma' : scenarioType === 'TAMPERED' ? 'Viktor Alexander Petrov' : scenarioType === 'FACE_MISMATCH' ? 'Alexander James Wright' : 'Mei-Ling Chen'),
      officerId,
      checkpoint: req.user?.checkpoint || 'Raxaul Border Post - Gate 3',
      documentHash: sha256Hash,
      status: 'IN_PROGRESS',
      riskScore: 0,
      stage: 1,
      stagesCompleted: [
        {
          stageNumber: 1,
          name: 'Document Uploaded',
          status: 'COMPLETED',
          durationMs: 85,
          confidence: 100,
          explanation: `Document accepted. Cryptographic SHA-256 fingerprint generated.`
        }
      ],
      scenarioType,
      fileName,
      filePath,
      fileSize,
      mimeType,
      timestamp: new Date()
    };

    mockStore.verifications.unshift(newVerification);

    // Audit log
    mockStore.auditLogs.unshift({
      _id: `audit-${Date.now()}`,
      verificationId,
      officerId,
      action: 'DOCUMENT_UPLOADED',
      details: { documentType, fileName, sha256Hash, scenarioType },
      timestamp: new Date()
    });

    return res.status(201).json({
      success: true,
      message: 'Document registered successfully. Ready for screening pipeline.',
      verification: newVerification
    });
  } catch (error) {
    console.error('Create verification error:', error);
    return res.status(500).json({ success: false, message: 'Failed to initialize verification.' });
  }
};

const processVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const officerId = req.user ? req.user.officerId : 'TF-1024';

    const verification = mockStore.verifications.find(v => v.verificationId === id || v._id === id);
    if (!verification) {
      return res.status(404).json({ success: false, message: 'Verification record not found.' });
    }

    // Process through AI inference layer
    const aiResult = await aiClient.processPipeline({
      documentType: verification.documentType,
      scenarioType: verification.scenarioType,
      fileName: verification.fileName,
      subjectId: verification.subjectId
    });

    // Run risk engine
    const riskAssessment = riskEngine.evaluate({
      ocrResult: aiResult.ocr,
      faceResult: aiResult.face,
      tamperingResult: aiResult.tampering,
      integrityResult: aiResult.integrity
    });

    // Record on Blockchain Integrity Ledger
    const blockRecord = await blockchainLedger.recordVerification({
      verificationId: verification.verificationId,
      documentHash: verification.documentHash,
      officerId
    });

    // Save OCR
    const ocrObj = {
      _id: `ocr-${verification.verificationId}`,
      verificationId: verification.verificationId,
      documentType: verification.documentType,
      ...aiResult.ocr
    };
    mockStore.ocrResults.push(ocrObj);

    // Save Face
    const faceObj = {
      _id: `face-${verification.verificationId}`,
      verificationId: verification.verificationId,
      ...aiResult.face
    };
    mockStore.faceVerifications.push(faceObj);

    // Save Tampering
    const tamperObj = {
      _id: `tamper-${verification.verificationId}`,
      verificationId: verification.verificationId,
      ...aiResult.tampering
    };
    mockStore.tamperingAnalyses.push(tamperObj);

    // Save Risk
    const riskObj = {
      _id: `risk-${verification.verificationId}`,
      verificationId: verification.verificationId,
      ...riskAssessment
    };
    mockStore.riskAssessments.push(riskObj);

    // Update Verification object with all 9 stages completed
    verification.status = riskAssessment.classification;
    verification.riskScore = riskAssessment.totalScore;
    verification.stage = 9;
    verification.subjectName = aiResult.ocr.name;

    verification.stagesCompleted = [
      { stageNumber: 1, name: 'Document Uploaded', status: 'COMPLETED', durationMs: 85, confidence: 100, explanation: 'File validated and loaded into secure volatile screening cache' },
      { stageNumber: 2, name: 'Image Preprocessing', status: 'COMPLETED', durationMs: 140, confidence: 99, explanation: 'Bilinear interpolation, perspective alignment, and contrast equalization complete' },
      { stageNumber: 3, name: 'OCR / Data Extraction', status: 'COMPLETED', durationMs: 380, confidence: aiResult.ocr.confidence, explanation: `Extracted Machine-Readable Zone (MRZ) & visual fields with ${aiResult.ocr.confidence}% confidence` },
      { stageNumber: 4, name: 'Face Verification', status: 'COMPLETED', durationMs: 460, confidence: aiResult.face.confidence, explanation: `Biometric distance evaluated. Similarity: ${aiResult.face.similarityScore}% (${aiResult.face.status})` },
      { stageNumber: 5, name: 'Document Tampering Detection', status: 'COMPLETED', durationMs: 580, confidence: aiResult.tampering.confidence, explanation: `Forensic Error Level Analysis: Tampering score is ${aiResult.tampering.tamperingScore}%` },
      { stageNumber: 6, name: 'SHA-256 Hash Generation', status: 'COMPLETED', durationMs: 35, confidence: 100, explanation: `Generated 256-bit cryptographic fingerprint: ${verification.documentHash.substring(0, 16)}...` },
      { stageNumber: 7, name: 'Blockchain Verification', status: 'COMPLETED', durationMs: 210, confidence: 100, explanation: `Anchored to Block #${blockRecord.blockNumber}. Cryptographic hash chain confirmed.` },
      { stageNumber: 8, name: 'Risk Assessment', status: 'COMPLETED', durationMs: 65, confidence: 100, explanation: `Multi-factor risk index computed: ${riskAssessment.totalScore}/100 (${riskAssessment.classification})` },
      { stageNumber: 9, name: 'Final Screening Result', status: 'COMPLETED', durationMs: 40, confidence: 100, explanation: `Clearance verdict: ${riskAssessment.classification}. Awaiting officer sign-off.` }
    ];

    // If suspicious, create Suspicious Case entry
    if (riskAssessment.classification === 'SUSPICIOUS') {
      const caseSeq = 100 + mockStore.suspiciousCases.length + 1;
      const caseObj = {
        _id: `case-${Date.now()}`,
        caseId: `SC-2026-${caseSeq}`,
        verificationId: verification.verificationId,
        riskScore: riskAssessment.totalScore,
        severity: riskAssessment.totalScore >= 80 ? 'Critical' : 'High',
        reason: riskAssessment.riskFactors.map(f => f.description).join('; ') || 'Screening risk exceeded critical threshold',
        documentType: verification.documentType,
        detectedIssue: aiResult.tampering.status === 'SUSPICIOUS_MODIFICATION_DETECTED'
          ? 'Forensic document manipulation detected on substrate'
          : (aiResult.face.status === 'MISMATCH' ? 'Biometric facial mismatch detected' : 'Cryptographic or credential anomaly'),
        assignedOfficer: officerId,
        status: 'Open',
        subjectName: verification.subjectName,
        timestamp: new Date(),
        officerNotes: [
          { officer: 'SYSTEM_ROBOT', note: `Automated high-risk alert generated by TrustForge Engine (Score: ${riskAssessment.totalScore}).`, date: new Date() }
        ]
      };
      mockStore.suspiciousCases.unshift(caseObj);
    }

    // Audit log
    mockStore.auditLogs.unshift({
      _id: `audit-${Date.now()}`,
      verificationId: verification.verificationId,
      officerId,
      action: 'PIPELINE_EXECUTED',
      details: {
        riskScore: riskAssessment.totalScore,
        classification: riskAssessment.classification,
        blockNumber: blockRecord.blockNumber
      },
      timestamp: new Date()
    });

    return res.status(200).json({
      success: true,
      message: 'Verification pipeline executed successfully.',
      verification,
      ocrResult: ocrObj,
      faceVerification: faceObj,
      tamperingAnalysis: tamperObj,
      riskAssessment: riskObj,
      blockchainRecord: blockRecord
    });
  } catch (error) {
    console.error('Process verification error:', error);
    return res.status(500).json({ success: false, message: 'Screening pipeline encountered an internal error.' });
  }
};

const getVerificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const verification = mockStore.verifications.find(v => v.verificationId === id || v._id === id);

    if (!verification) {
      return res.status(404).json({ success: false, message: 'Verification record not found.' });
    }

    const ocrResult = mockStore.ocrResults.find(o => o.verificationId === verification.verificationId);
    const faceVerification = mockStore.faceVerifications.find(f => f.verificationId === verification.verificationId);
    const tamperingAnalysis = mockStore.tamperingAnalyses.find(t => t.verificationId === verification.verificationId);
    const riskAssessment = mockStore.riskAssessments.find(r => r.verificationId === verification.verificationId);
    const integrityRecord = mockStore.integrityRecords.find(i => i.verificationId === verification.verificationId);
    const officerDecision = mockStore.officerDecisions.find(d => d.verificationId === verification.verificationId);

    return res.status(200).json({
      success: true,
      verification,
      ocrResult,
      faceVerification,
      tamperingAnalysis,
      riskAssessment,
      integrityRecord,
      officerDecision
    });
  } catch (error) {
    console.error('Get verification error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve verification details.' });
  }
};

const getAllVerifications = async (req, res) => {
  try {
    const { search, status, documentType, limit = 50, page = 1 } = req.query;

    let results = [...mockStore.verifications];

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(v =>
        v.verificationId.toLowerCase().includes(q) ||
        (v.subjectName && v.subjectName.toLowerCase().includes(q)) ||
        (v.subjectId && v.subjectId.toLowerCase().includes(q)) ||
        (v.documentHash && v.documentHash.toLowerCase().includes(q))
      );
    }

    if (status && status !== 'ALL') {
      results = results.filter(v => v.status.toUpperCase() === status.toUpperCase());
    }

    if (documentType && documentType !== 'ALL') {
      results = results.filter(v => v.documentType.toUpperCase() === documentType.toUpperCase());
    }

    return res.status(200).json({
      success: true,
      count: results.length,
      verifications: results
    });
  } catch (error) {
    console.error('Get all verifications error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve verifications.' });
  }
};

const submitOfficerDecision = async (req, res) => {
  try {
    const { verificationId, decision, reason, notes } = req.body;
    const officerId = req.user ? req.user.officerId : 'TF-1024';

    if (!verificationId || !decision) {
      return res.status(400).json({ success: false, message: 'Verification ID and decision verdict are required.' });
    }

    const verification = mockStore.verifications.find(v => v.verificationId === verificationId);
    if (!verification) {
      return res.status(404).json({ success: false, message: 'Verification record not found.' });
    }

    const decisionRecord = {
      _id: `decision-${Date.now()}`,
      verificationId,
      officerId,
      decision, // 'APPROVE', 'REVIEW', 'SUSPICIOUS'
      reason: reason || 'Screening criteria evaluated by clearance officer',
      notes: notes || '',
      timestamp: new Date()
    };

    mockStore.officerDecisions.push(decisionRecord);

    // Update status based on decision if needed
    if (decision === 'APPROVE') {
      verification.status = 'GENUINE';
    } else if (decision === 'REVIEW') {
      verification.status = 'REVIEW REQUIRED';
    } else if (decision === 'SUSPICIOUS') {
      verification.status = 'SUSPICIOUS';
    }

    // Audit log
    mockStore.auditLogs.unshift({
      _id: `audit-${Date.now()}`,
      verificationId,
      officerId,
      action: 'OFFICER_DECISION_RECORDED',
      details: { decision, reason, notes },
      timestamp: new Date()
    });

    return res.status(200).json({
      success: true,
      message: `Decision successfully committed: ${decision}`,
      decision: decisionRecord,
      updatedStatus: verification.status
    });
  } catch (error) {
    console.error('Submit decision error:', error);
    return res.status(500).json({ success: false, message: 'Failed to record officer decision.' });
  }
};

module.exports = {
  createVerification,
  processVerification,
  getVerificationById,
  getAllVerifications,
  submitOfficerDecision
};
