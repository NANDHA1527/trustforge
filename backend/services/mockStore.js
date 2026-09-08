const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Helper to compute sha256
const computeHash = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

class MockStore {
  constructor() {
    this.users = [];
    this.verifications = [];
    this.documents = [];
    this.ocrResults = [];
    this.faceVerifications = [];
    this.tamperingAnalyses = [];
    this.integrityRecords = [];
    this.riskAssessments = [];
    this.officerDecisions = [];
    this.auditLogs = [];
    this.suspiciousCases = [];
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;

    // 1. Seed Users
    const salt = await bcrypt.genSalt(10);
    const demoPasswordHash = await bcrypt.hash('demo123', salt);

    this.users = [
      {
        _id: 'user-1',
        officerId: 'TF-1024',
        name: 'Insp. Rajesh Sharma',
        password: demoPasswordHash,
        role: 'Officer',
        checkpoint: 'Raxaul Border Post - Gate 3',
        department: 'Sashastra Seema Bal (SSB), Police-II Division',
        status: 'Active',
        lastLogin: new Date(Date.now() - 1000 * 60 * 12)
      },
      {
        _id: 'user-2',
        officerId: 'TF-1001',
        name: 'Commandant Vikram Singh',
        password: demoPasswordHash,
        role: 'Supervisor',
        checkpoint: 'Indo-Nepal Border Headquarters',
        department: 'SSB Vigilance & Border Command',
        status: 'Active',
        lastLogin: new Date(Date.now() - 1000 * 60 * 120)
      },
      {
        _id: 'user-3',
        officerId: 'TF-ADMIN',
        name: 'Priya Menon',
        password: demoPasswordHash,
        role: 'Administrator',
        checkpoint: 'MHA Security Operations Hub',
        department: 'Ministry of Home Affairs - Cyber Cell',
        status: 'Active',
        lastLogin: new Date(Date.now() - 1000 * 60 * 360)
      }
    ];

    // 2. Genesis Block + Initial Blockchain Ledger
    let prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
    const genesisTime = new Date('2026-09-08T06:00:00Z');
    const genesisBlockHash = computeHash(`0${prevHash}${genesisTime.toISOString()}GENESIS-BLOCKSYSTEM`);

    this.integrityRecords.push({
      _id: 'block-0',
      blockNumber: 0,
      verificationId: 'GENESIS-BLOCK',
      documentHash: '0000genesis_document_integrity_root_anchor0000',
      previousHash: prevHash,
      blockHash: genesisBlockHash,
      officerId: 'SYSTEM',
      status: 'CONFIRMED',
      timestamp: genesisTime,
      nonce: 1024
    });
    prevHash = genesisBlockHash;

    // Seed 4 initial realistic verification records with linked integrity blocks
    const initialRecords = [
      {
        vId: 'TF-2026-0891',
        docType: 'Passport',
        subjectName: 'Aarav Dev Sharma',
        subjectId: 'SUB-IND-9021',
        status: 'GENUINE',
        riskScore: 16,
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        officer: 'TF-1024',
        timeOffsetMin: 45,
        ocr: {
          name: 'AARAV DEV SHARMA',
          dob: '14/08/1992',
          docNumber: 'Z8942104',
          nationality: 'IND',
          issueDate: '10/01/2021',
          expiryDate: '09/01/2031',
          confidence: 99.1,
          status: 'PASS'
        },
        face: { similarity: 98.2, confidence: 99.0, status: 'MATCHED' },
        tampering: { score: 2.1, status: 'GENUINE', manipulationProb: 1.5, detectedRegions: [] },
        riskFactors: [
          { points: 5, category: 'AUTHENTICITY', description: 'Standard synthetic security watermark detected' },
          { points: 5, category: 'BIOMETRIC', description: 'Natural micro-expression variance in live capture' },
          { points: 6, category: 'TAMPERING', description: 'Normal digital artifacting on high-res scan' }
        ],
        decision: { decision: 'APPROVE', reason: 'All cryptographic and biometric criteria passed without deviation' }
      },
      {
        vId: 'TF-2026-0892',
        docType: 'Visa',
        subjectName: 'Marcus Ronald Hayes',
        subjectId: 'SUB-GBR-4412',
        status: 'SUSPICIOUS',
        riskScore: 84,
        hash: '7d5a99f603f231d539eeecd85ff504c10547a01fe9679b492a006c2e004f84cd',
        officer: 'TF-1024',
        timeOffsetMin: 32,
        ocr: {
          name: 'MARCUS RONALD HAYES',
          dob: '22/11/1985',
          docNumber: 'V-9938102',
          nationality: 'GBR',
          issueDate: '15/03/2024',
          expiryDate: '14/03/2029',
          confidence: 94.2,
          status: 'FLAGGED'
        },
        face: { similarity: 94.8, confidence: 96.0, status: 'MATCHED' },
        tampering: {
          score: 89.4,
          status: 'SUSPICIOUS_MODIFICATION_DETECTED',
          manipulationProb: 91.8,
          detectedRegions: [
            { region: 'Expiry Date Field', severity: 'HIGH', box: { x: 55, y: 62, width: 28, height: 10 }, description: 'Inconsistent font glyph pixel density and anti-aliasing anomaly' },
            { region: 'Issuing Authority Seal', severity: 'HIGH', box: { x: 70, y: 25, width: 22, height: 25 }, description: 'Digital layer overlay artifact detected via Error Level Analysis (ELA)' }
          ]
        },
        riskFactors: [
          { points: 40, category: 'TAMPERING', description: 'Critical font alteration detected on Expiry Date' },
          { points: 25, category: 'INTEGRITY', description: 'Digital seal compression mismatch against baseline' },
          { points: 19, category: 'AUTHENTICITY', description: 'Security thread fluorescent band missing' }
        ],
        decision: { decision: 'SUSPICIOUS', reason: 'Confirmed date tampering and forged digital visa stamp overlay' }
      },
      {
        vId: 'TF-2026-0893',
        docType: 'Passport',
        subjectName: 'Kavita Sundaram',
        subjectId: 'SUB-MYS-7781',
        status: 'SUSPICIOUS',
        riskScore: 71,
        hash: '3f79bb7b435b05321651daefd374cd681b61935c13e0e262300a77f01734bc79',
        officer: 'TF-1024',
        timeOffsetMin: 20,
        ocr: {
          name: 'KAVITA SUNDARAM',
          dob: '05/03/1996',
          docNumber: 'A5510298',
          nationality: 'MYS',
          issueDate: '01/06/2022',
          expiryDate: '31/05/2032',
          confidence: 98.4,
          status: 'PASS'
        },
        face: { similarity: 41.5, confidence: 95.0, status: 'MISMATCH' },
        tampering: { score: 6.2, status: 'GENUINE', manipulationProb: 4.8, detectedRegions: [] },
        riskFactors: [
          { points: 45, category: 'BIOMETRIC', description: 'Facial euclidean distance exceeded mismatch threshold (41.5% similarity)' },
          { points: 15, category: 'BIOMETRIC', description: 'Significant jawline and eye inter-canthal distance disparity' },
          { points: 11, category: 'AUTHENTICITY', description: 'Subject impersonation or borrowed passport alert' }
        ],
        decision: { decision: 'SUSPICIOUS', reason: 'Critical facial biometric mismatch. Bearer does not match passport photo.' }
      },
      {
        vId: 'TF-2026-0894',
        docType: 'Identity Card',
        subjectName: 'Tenzin Gyatso Norbu',
        subjectId: 'SUB-BTN-1204',
        status: 'REVIEW REQUIRED',
        riskScore: 48,
        hash: 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
        officer: 'TF-1024',
        timeOffsetMin: 8,
        ocr: {
          name: 'TENZIN GYATSO NORBU',
          dob: '19/09/1988',
          docNumber: 'ID-883190',
          nationality: 'BTN',
          issueDate: '12/04/2019',
          expiryDate: '11/04/2029',
          confidence: 72.8,
          status: 'FLAGGED'
        },
        face: { similarity: 86.4, confidence: 88.0, status: 'MATCHED' },
        tampering: {
          score: 38.5,
          status: 'REVIEW_REQUIRED',
          manipulationProb: 35.0,
          detectedRegions: [
            { region: 'Document Laminate Edge', severity: 'MEDIUM', box: { x: 10, y: 15, width: 80, height: 70 }, description: 'Minor physical wear and micro-reflection along card border' }
          ]
        },
        riskFactors: [
          { points: 20, category: 'OCR', description: 'Low contrast on microtext causing sub-80% OCR confidence' },
          { points: 15, category: 'TAMPERING', description: 'Laminate scratch pattern resembles adhesive edge' },
          { points: 13, category: 'BIOMETRIC', description: 'Slight lighting disparity on live webcam capture' }
        ],
        decision: { decision: 'REVIEW', reason: 'Physical card has excessive surface scuffs; supervisor secondary visual inspection required' }
      }
    ];

    let blockIdx = 1;
    for (const item of initialRecords) {
      const recordTime = new Date(Date.now() - item.timeOffsetMin * 60 * 1000);
      const curBlockHash = computeHash(`${blockIdx}${prevHash}${recordTime.toISOString()}${item.vId}${item.hash}${item.officer}`);

      // 1. Verification
      const vObj = {
        _id: `v-${item.vId}`,
        verificationId: item.vId,
        documentType: item.docType,
        subjectId: item.subjectId,
        subjectName: item.subjectName,
        officerId: item.officer,
        checkpoint: 'Raxaul Border Post - Gate 3',
        documentHash: item.hash,
        status: item.status,
        riskScore: item.riskScore,
        stage: 9,
        stagesCompleted: [
          { stageNumber: 1, name: 'Document Ingestion', status: 'COMPLETED', durationMs: 120, confidence: 100, explanation: 'Document securely uploaded and converted to normalized RGB tensor' },
          { stageNumber: 2, name: 'Image Preprocessing', status: 'COMPLETED', durationMs: 180, confidence: 99, explanation: 'Perspective correction, adaptive de-skew, and illumination normalization applied' },
          { stageNumber: 3, name: 'OCR & Data Extraction', status: 'COMPLETED', durationMs: 420, confidence: item.ocr.confidence, explanation: `Extracted 8 visual and machine-readable zone (MRZ) data fields` },
          { stageNumber: 4, name: 'Face Biometric Match', status: 'COMPLETED', durationMs: 510, confidence: item.face.confidence, explanation: `Facial similarity computed: ${item.face.similarity}% (${item.face.status})` },
          { stageNumber: 5, name: 'Forensic Tampering Scan', status: 'COMPLETED', durationMs: 640, confidence: 96, explanation: `Error Level Analysis & glyph variance score: ${item.tampering.score}%` },
          { stageNumber: 6, name: 'SHA-256 Hash Generation', status: 'COMPLETED', durationMs: 45, confidence: 100, explanation: `Cryptographic fingerprint calculated: ${item.hash.substring(0, 16)}...` },
          { stageNumber: 7, name: 'Blockchain Verification', status: 'COMPLETED', durationMs: 230, confidence: 100, explanation: `Anchored to Block #${blockIdx}. Cryptographic integrity verified.` },
          { stageNumber: 8, name: 'Risk Scoring Engine', status: 'COMPLETED', durationMs: 90, confidence: 100, explanation: `Multi-vector risk aggregation evaluated total score at ${item.riskScore}/100` },
          { stageNumber: 9, name: 'Decision & Audit Logging', status: 'COMPLETED', durationMs: 80, confidence: 100, explanation: `Recorded officer decision: ${item.decision.decision}` }
        ],
        scenarioType: item.status === 'GENUINE' ? 'GENUINE' : (item.face.status === 'MISMATCH' ? 'FACE_MISMATCH' : 'TAMPERED'),
        timestamp: recordTime
      };
      this.verifications.push(vObj);

      // 2. OCR Result
      this.ocrResults.push({
        _id: `ocr-${item.vId}`,
        verificationId: item.vId,
        documentType: item.docType,
        ...item.ocr,
        gender: 'M',
        mrzRaw: `P<IND${item.subjectName.replace(/\s+/g, '<')}<<<<<<<<<<<<<<<<<<<\n${item.ocr.docNumber}<4IND9208148M3101095<<<<<<<<<<<<<<06`,
        isSimulated: true
      });

      // 3. Face Verification
      this.faceVerifications.push({
        _id: `face-${item.vId}`,
        verificationId: item.vId,
        similarityScore: item.face.similarity,
        confidence: item.face.confidence,
        status: item.face.status,
        documentPhotoUrl: `/assets/demo/doc_${item.vId.toLowerCase()}.jpg`,
        liveCaptureUrl: `/assets/demo/live_${item.vId.toLowerCase()}.jpg`,
        isSimulated: true
      });

      // 4. Tampering Analysis
      this.tamperingAnalyses.push({
        _id: `tamper-${item.vId}`,
        verificationId: item.vId,
        tamperingScore: item.tampering.score,
        manipulationProbability: item.tampering.manipulationProb,
        status: item.tampering.status,
        confidence: 96,
        detectedRegions: item.tampering.detectedRegions,
        elaScore: item.tampering.score > 50 ? 82.4 : 4.1,
        isSimulated: true
      });

      // 5. Blockchain Record
      this.integrityRecords.push({
        _id: `block-${blockIdx}`,
        blockNumber: blockIdx,
        verificationId: item.vId,
        documentHash: item.hash,
        previousHash: prevHash,
        blockHash: curBlockHash,
        officerId: item.officer,
        status: 'CONFIRMED',
        timestamp: recordTime,
        nonce: Math.floor(Math.random() * 8999) + 1000
      });
      prevHash = curBlockHash;
      blockIdx++;

      // 6. Risk Assessment
      this.riskAssessments.push({
        _id: `risk-${item.vId}`,
        verificationId: item.vId,
        totalScore: item.riskScore,
        classification: item.status,
        breakdown: {
          authenticityPoints: Math.round(item.riskScore * 0.25),
          facePoints: item.face.status === 'MISMATCH' ? 45 : 5,
          tamperingPoints: item.tampering.score > 50 ? 40 : 5,
          integrityPoints: item.status === 'SUSPICIOUS' ? 20 : 0
        },
        riskFactors: item.riskFactors
      });

      // 7. Officer Decision
      this.officerDecisions.push({
        _id: `decision-${item.vId}`,
        verificationId: item.vId,
        officerId: item.officer,
        decision: item.decision.decision,
        reason: item.decision.reason,
        timestamp: recordTime
      });

      // 8. Audit Log
      this.auditLogs.push(
        {
          _id: `audit-${item.vId}-1`,
          verificationId: item.vId,
          officerId: item.officer,
          action: 'DOCUMENT_UPLOADED',
          details: { fileName: `${item.docType}_${item.vId}.jpg`, hash: item.hash },
          timestamp: new Date(recordTime.getTime() - 4000)
        },
        {
          _id: `audit-${item.vId}-2`,
          verificationId: item.vId,
          officerId: item.officer,
          action: 'PIPELINE_EXECUTED',
          details: { riskScore: item.riskScore, status: item.status },
          timestamp: new Date(recordTime.getTime() - 1000)
        },
        {
          _id: `audit-${item.vId}-3`,
          verificationId: item.vId,
          officerId: item.officer,
          action: 'OFFICER_DECISION_RECORDED',
          details: { decision: item.decision.decision, reason: item.decision.reason },
          timestamp: recordTime
        }
      );
    }

    // 9. Suspicious Cases Queue
    this.suspiciousCases = [
      {
        _id: 'case-1',
        caseId: 'SC-2026-104',
        verificationId: 'TF-2026-0892',
        riskScore: 84,
        severity: 'Critical',
        reason: 'Altered Visa Expiry Date & Digital Overlay Stamp',
        documentType: 'Visa',
        detectedIssue: 'Glyph distortion on expiry date + ELA overlay disparity',
        assignedOfficer: 'TF-1024',
        status: 'Under Investigation',
        subjectName: 'Marcus Ronald Hayes',
        timestamp: new Date(Date.now() - 32 * 60 * 1000),
        officerNotes: [
          { officer: 'TF-1024', note: 'Subject detained at Gate 3 immigration booth. Forensic scan shows date was modified from 2024 to 2029.', date: new Date(Date.now() - 25 * 60 * 1000) }
        ]
      },
      {
        _id: 'case-2',
        caseId: 'SC-2026-105',
        verificationId: 'TF-2026-0893',
        riskScore: 71,
        severity: 'High',
        reason: 'Biometric Impersonation / Severe Facial Distance Disparity',
        documentType: 'Passport',
        detectedIssue: 'Live facial capture similarity dropped to 41.5%',
        assignedOfficer: 'TF-1024',
        status: 'Open',
        subjectName: 'Kavita Sundaram',
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        officerNotes: [
          { officer: 'TF-1024', note: 'Bearer claimed recent surgery; supervisor visual check ordered.', date: new Date(Date.now() - 15 * 60 * 1000) }
        ]
      },
      {
        _id: 'case-3',
        caseId: 'SC-2026-102',
        verificationId: 'TF-2026-0870',
        riskScore: 92,
        severity: 'Critical',
        reason: 'Duplicate Document Hash Collision & Blacklisted Identity Token',
        documentType: 'Passport',
        detectedIssue: 'SHA-256 fingerprint collided with revoked passport alert database',
        assignedOfficer: 'TF-1001',
        status: 'Escalated',
        subjectName: 'Synthetic Blacklist Subject #09',
        timestamp: new Date(Date.now() - 3 * 3600 * 1000),
        officerNotes: [
          { officer: 'TF-1001', note: 'Case transferred to central immigration vigilance branch.', date: new Date(Date.now() - 2 * 3600 * 1000) }
        ]
      }
    ];

    this.isInitialized = true;
    console.log('⚡ TrustForge MockStore: Initialized with rich synthetic SIH26188 border screening datasets.');
  }

  // Generic methods
  getNextBlockNumber() {
    return this.integrityRecords.length;
  }

  getLatestBlockHash() {
    if (this.integrityRecords.length === 0) return '0000000000000000000000000000000000000000000000000000000000000000';
    return this.integrityRecords[this.integrityRecords.length - 1].blockHash;
  }

  appendBlock({ verificationId, documentHash, officerId }) {
    const blockNumber = this.getNextBlockNumber();
    const previousHash = this.getLatestBlockHash();
    const timestamp = new Date();
    const blockHash = computeHash(`${blockNumber}${previousHash}${timestamp.toISOString()}${verificationId}${documentHash}${officerId}`);

    const newBlock = {
      _id: `block-${blockNumber}`,
      blockNumber,
      verificationId,
      documentHash,
      previousHash,
      blockHash,
      officerId,
      status: 'CONFIRMED',
      timestamp,
      nonce: Math.floor(Math.random() * 8999) + 1000
    };

    this.integrityRecords.push(newBlock);
    return newBlock;
  }
}

const mockStoreInstance = new MockStore();
module.exports = mockStoreInstance;
