export interface Officer {
  officerId: string;
  name: string;
  role: 'Officer' | 'Supervisor' | 'Administrator';
  checkpoint: string;
  department: string;
  lastLogin?: string;
}

export interface VerificationStage {
  stageNumber: number;
  name: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FLAGGED';
  durationMs: number;
  confidence: number;
  explanation: string;
}

export interface OCRData {
  documentType?: string;
  name?: string;
  dateOfBirth?: string;
  documentNumber?: string;
  nationality?: string;
  issueDate?: string;
  expiryDate?: string;
  gender?: string;
  confidence: number;
  mrzRaw?: string;
  status: 'PASS' | 'FLAGGED' | 'FAILED';
  isSimulated?: boolean;
}

export interface FaceVerificationData {
  similarityScore: number;
  confidence: number;
  status: 'MATCHED' | 'MISMATCH' | 'INCONCLUSIVE';
  documentPhotoUrl?: string;
  liveCaptureUrl?: string;
  isSimulated?: boolean;
}

export interface DetectedRegion {
  region: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  description: string;
}

export interface TamperingData {
  tamperingScore: number;
  manipulationProbability: number;
  status: 'GENUINE' | 'SUSPICIOUS_MODIFICATION_DETECTED' | 'REVIEW_REQUIRED';
  confidence: number;
  elaScore: number;
  detectedRegions: DetectedRegion[];
  isSimulated?: boolean;
}

export interface BlockchainBlock {
  _id?: string;
  blockNumber: number;
  verificationId: string;
  documentHash: string;
  previousHash: string;
  blockHash: string;
  officerId: string;
  status: string;
  timestamp: string;
  nonce: number;
}

export interface RiskFactor {
  points: number;
  category: string;
  description: string;
}

export interface RiskAssessmentData {
  totalScore: number;
  classification: 'GENUINE' | 'REVIEW REQUIRED' | 'SUSPICIOUS';
  breakdown: {
    authenticityPoints: number;
    facePoints: number;
    tamperingPoints: number;
    integrityPoints: number;
  };
  riskFactors: RiskFactor[];
}

export interface OfficerDecisionData {
  decision: 'APPROVE' | 'REVIEW' | 'SUSPICIOUS';
  reason?: string;
  notes?: string;
  timestamp: string;
}

export interface VerificationRecord {
  _id: string;
  verificationId: string;
  documentType: 'Passport' | 'Visa' | 'Identity Card';
  subjectId: string;
  subjectName: string;
  officerId: string;
  checkpoint: string;
  documentHash: string;
  status: 'IN_PROGRESS' | 'GENUINE' | 'REVIEW REQUIRED' | 'SUSPICIOUS';
  riskScore: number;
  stage: number;
  stagesCompleted: VerificationStage[];
  scenarioType?: string;
  fileName?: string;
  timestamp: string;
  ocrResult?: OCRData;
  faceVerification?: FaceVerificationData;
  tamperingAnalysis?: TamperingData;
  integrityRecord?: BlockchainBlock;
  riskAssessment?: RiskAssessmentData;
  officerDecision?: OfficerDecisionData;
}

export interface SuspiciousCase {
  _id: string;
  caseId: string;
  verificationId: string;
  riskScore: number;
  severity: 'Medium' | 'High' | 'Critical';
  reason: string;
  documentType: string;
  detectedIssue: string;
  assignedOfficer: string;
  status: 'Open' | 'Under Investigation' | 'Resolved' | 'Escalated';
  subjectName: string;
  timestamp: string;
  officerNotes: {
    officer: string;
    note: string;
    date: string;
  }[];
}

export interface AuditLog {
  _id: string;
  verificationId: string;
  officerId: string;
  action: string;
  details: any;
  timestamp: string;
}
