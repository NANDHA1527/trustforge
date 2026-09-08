const mongoose = require('mongoose');

// 1. User Model
const UserSchema = new mongoose.Schema({
  officerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Officer', 'Supervisor', 'Administrator'], default: 'Officer' },
  checkpoint: { type: String, default: 'Raxaul Border Post - Gate 3' },
  department: { type: String, default: 'SSB Police-II Division' },
  status: { type: String, default: 'Active' },
  lastLogin: { type: Date, default: Date.now }
}, { timestamps: true });

// 2. Document Model
const DocumentSchema = new mongoose.Schema({
  verificationId: { type: String, required: true },
  documentType: { type: String, enum: ['Passport', 'Visa', 'Identity Card'], required: true },
  fileName: { type: String, required: true },
  filePath: { type: String },
  fileSize: { type: Number },
  mimeType: { type: String },
  sha256Hash: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// 3. OCR Result Model
const OCRResultSchema = new mongoose.Schema({
  verificationId: { type: String, required: true },
  documentType: { type: String },
  name: { type: String },
  dateOfBirth: { type: String },
  documentNumber: { type: String },
  nationality: { type: String },
  issueDate: { type: String },
  expiryDate: { type: String },
  gender: { type: String },
  confidence: { type: Number, default: 0 },
  mrzRaw: { type: String },
  status: { type: String, enum: ['PASS', 'FLAGGED', 'FAILED'], default: 'PASS' },
  isSimulated: { type: Boolean, default: true }
}, { timestamps: true });

// 4. Face Verification Model
const FaceVerificationSchema = new mongoose.Schema({
  verificationId: { type: String, required: true },
  similarityScore: { type: Number, required: true },
  confidence: { type: Number, required: true },
  status: { type: String, enum: ['MATCHED', 'MISMATCH', 'INCONCLUSIVE'], required: true },
  documentPhotoUrl: { type: String },
  liveCaptureUrl: { type: String },
  isSimulated: { type: Boolean, default: true }
}, { timestamps: true });

// 5. Tampering Analysis Model
const TamperingAnalysisSchema = new mongoose.Schema({
  verificationId: { type: String, required: true },
  tamperingScore: { type: Number, required: true },
  manipulationProbability: { type: Number, required: true },
  status: { type: String, enum: ['GENUINE', 'SUSPICIOUS_MODIFICATION_DETECTED', 'REVIEW_REQUIRED'], required: true },
  confidence: { type: Number, default: 95 },
  detectedRegions: [{
    region: { type: String },
    severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'] },
    box: {
      x: Number,
      y: Number,
      width: Number,
      height: Number
    },
    description: String
  }],
  elaScore: { type: Number, default: 0 },
  isSimulated: { type: Boolean, default: true }
}, { timestamps: true });

// 6. Integrity Record Model (Blockchain Block)
const IntegrityRecordSchema = new mongoose.Schema({
  blockNumber: { type: Number, required: true, unique: true },
  verificationId: { type: String, required: true },
  documentHash: { type: String, required: true },
  previousHash: { type: String, required: true },
  blockHash: { type: String, required: true },
  officerId: { type: String, required: true },
  status: { type: String, default: 'CONFIRMED' },
  timestamp: { type: Date, default: Date.now },
  nonce: { type: Number, default: 0 }
}, { timestamps: true });

// 7. Risk Assessment Model
const RiskAssessmentSchema = new mongoose.Schema({
  verificationId: { type: String, required: true },
  totalScore: { type: Number, required: true },
  classification: { type: String, enum: ['GENUINE', 'REVIEW REQUIRED', 'SUSPICIOUS'], required: true },
  breakdown: {
    authenticityPoints: { type: Number, default: 0 },
    facePoints: { type: Number, default: 0 },
    tamperingPoints: { type: Number, default: 0 },
    integrityPoints: { type: Number, default: 0 }
  },
  riskFactors: [{
    points: Number,
    category: String,
    description: String
  }]
}, { timestamps: true });

// 8. Officer Decision Model
const OfficerDecisionSchema = new mongoose.Schema({
  verificationId: { type: String, required: true },
  officerId: { type: String, required: true },
  decision: { type: String, enum: ['APPROVE', 'REVIEW', 'SUSPICIOUS'], required: true },
  reason: { type: String },
  notes: { type: String },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

// 9. Audit Log Model
const AuditLogSchema = new mongoose.Schema({
  verificationId: { type: String },
  officerId: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String, default: '127.0.0.1' },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

// 10. Suspicious Case Model
const SuspiciousCaseSchema = new mongoose.Schema({
  caseId: { type: String, required: true, unique: true },
  verificationId: { type: String, required: true },
  riskScore: { type: Number, required: true },
  severity: { type: String, enum: ['Medium', 'High', 'Critical'], required: true },
  reason: { type: String, required: true },
  documentType: { type: String, required: true },
  detectedIssue: { type: String, required: true },
  assignedOfficer: { type: String, default: 'TF-1024' },
  status: { type: String, enum: ['Open', 'Under Investigation', 'Resolved', 'Escalated'], default: 'Open' },
  subjectName: { type: String },
  timestamp: { type: Date, default: Date.now },
  officerNotes: [{
    officer: String,
    note: String,
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// 11. Root Verification Model
const VerificationSchema = new mongoose.Schema({
  verificationId: { type: String, required: true, unique: true },
  documentType: { type: String, enum: ['Passport', 'Visa', 'Identity Card'], required: true },
  subjectId: { type: String },
  subjectName: { type: String },
  officerId: { type: String, required: true },
  checkpoint: { type: String, default: 'Raxaul Border Post - Gate 3' },
  documentHash: { type: String, required: true },
  status: { type: String, enum: ['IN_PROGRESS', 'GENUINE', 'REVIEW REQUIRED', 'SUSPICIOUS'], default: 'IN_PROGRESS' },
  riskScore: { type: Number, default: 0 },
  stage: { type: Number, default: 1 }, // 1 to 9
  stagesCompleted: [{
    stageNumber: Number,
    name: String,
    status: String,
    durationMs: Number,
    confidence: Number,
    explanation: String
  }],
  document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  ocrResult: { type: mongoose.Schema.Types.ObjectId, ref: 'OCRResult' },
  faceVerification: { type: mongoose.Schema.Types.ObjectId, ref: 'FaceVerification' },
  tamperingAnalysis: { type: mongoose.Schema.Types.ObjectId, ref: 'TamperingAnalysis' },
  integrityRecord: { type: mongoose.Schema.Types.ObjectId, ref: 'IntegrityRecord' },
  riskAssessment: { type: mongoose.Schema.Types.ObjectId, ref: 'RiskAssessment' },
  officerDecision: { type: mongoose.Schema.Types.ObjectId, ref: 'OfficerDecision' },
  scenarioType: { type: String, default: 'CUSTOM' }, // GENUINE, TAMPERED, FACE_MISMATCH, REVIEW_REQUIRED
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = {
  User: mongoose.models.User || mongoose.model('User', UserSchema),
  Document: mongoose.models.Document || mongoose.model('Document', DocumentSchema),
  OCRResult: mongoose.models.OCRResult || mongoose.model('OCRResult', OCRResultSchema),
  FaceVerification: mongoose.models.FaceVerification || mongoose.model('FaceVerification', FaceVerificationSchema),
  TamperingAnalysis: mongoose.models.TamperingAnalysis || mongoose.model('TamperingAnalysis', TamperingAnalysisSchema),
  IntegrityRecord: mongoose.models.IntegrityRecord || mongoose.model('IntegrityRecord', IntegrityRecordSchema),
  RiskAssessment: mongoose.models.RiskAssessment || mongoose.model('RiskAssessment', RiskAssessmentSchema),
  OfficerDecision: mongoose.models.OfficerDecision || mongoose.model('OfficerDecision', OfficerDecisionSchema),
  AuditLog: mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema),
  SuspiciousCase: mongoose.models.SuspiciousCase || mongoose.model('SuspiciousCase', SuspiciousCaseSchema),
  Verification: mongoose.models.Verification || mongoose.model('Verification', VerificationSchema),
};
