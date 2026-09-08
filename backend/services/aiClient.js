const crypto = require('crypto');

class AIClient {
  constructor() {
    this.fastApiUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
  }

  async checkHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000);
      const res = await fetch(`${this.fastApiUrl}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Process document through multi-stage AI verification pipeline
   * Supports both real FastAPI microservice and deterministic synthetic engine.
   */
  async processPipeline({ documentType, scenarioType, fileBuffer, fileName, subjectId }) {
    const isAiServiceOnline = await this.checkHealth();

    if (isAiServiceOnline) {
      try {
        const res = await fetch(`${this.fastApiUrl}/api/verify-pipeline`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentType, scenarioType, fileName, subjectId })
        });
        if (res.ok) {
          const data = await res.json();
          return { ...data, isSimulated: false };
        }
      } catch (err) {
        console.warn('FastAPI error, switching to internal deterministic engine:', err.message);
      }
    }

    // Deterministic Synthetic Inference Layer
    return this.getDeterministicResult(scenarioType, documentType, fileName);
  }

  getDeterministicResult(scenarioType = 'GENUINE', documentType = 'Passport', fileName = 'document.jpg') {
    switch (scenarioType) {
      case 'TAMPERED':
        return {
          ocr: {
            name: 'VIKTOR ALEXANDER PETROV',
            dateOfBirth: '14/06/1984',
            documentNumber: 'P8921004',
            nationality: 'CAN',
            issueDate: '01/02/2019',
            expiryDate: '01/02/2029', // Altered
            confidence: 95.4,
            status: 'FLAGGED',
            mrzRaw: 'P<CANPETROV<<VIKTOR<ALEXANDER<<<<<<<<<<<<<<\nP8921004<1CAN8406143M2902011<<<<<<<<<<<<<<02',
            isSimulated: true
          },
          face: {
            similarityScore: 94.2,
            confidence: 96.5,
            status: 'MATCHED',
            documentPhotoUrl: '/assets/demo/face_doc_tampered.jpg',
            liveCaptureUrl: '/assets/demo/face_live_tampered.jpg',
            isSimulated: true
          },
          tampering: {
            tamperingScore: 91.4,
            manipulationProbability: 92.8,
            status: 'SUSPICIOUS_MODIFICATION_DETECTED',
            confidence: 96.0,
            elaScore: 88.5,
            detectedRegions: [
              {
                region: 'Expiry Date Field (Altered 2024 -> 2029)',
                severity: 'HIGH',
                box: { x: 52, y: 58, width: 32, height: 12 },
                description: 'Severe high-frequency noise mismatch in font boundary pixels. Digital typeface replacement detected.'
              },
              {
                region: 'National Security Holographic Seal',
                severity: 'HIGH',
                box: { x: 68, y: 22, width: 24, height: 26 },
                description: 'Overlay artifact detected via Error Level Analysis. Missing micro-emboss diffraction lines.'
              }
            ],
            isSimulated: true
          },
          integrity: {
            hashMatched: false,
            status: 'MISMATCH',
            message: 'Generated SHA-256 fingerprint differs from official embassy issuance registry root.'
          },
          suggestedRisk: 82,
          isSimulated: true
        };

      case 'FACE_MISMATCH':
        return {
          ocr: {
            name: 'ALEXANDER JAMES WRIGHT',
            dateOfBirth: '28/03/1991',
            documentNumber: 'G5582910',
            nationality: 'GBR',
            issueDate: '10/05/2020',
            expiryDate: '09/05/2030',
            confidence: 98.6,
            status: 'PASS',
            mrzRaw: 'P<GBRWRIGHT<<ALEXANDER<JAMES<<<<<<<<<<<<<<<\nG5582910<4GBR9103287M3005094<<<<<<<<<<<<<<04',
            isSimulated: true
          },
          face: {
            similarityScore: 41.2,
            confidence: 97.2,
            status: 'MISMATCH',
            documentPhotoUrl: '/assets/demo/face_doc_mismatch.jpg',
            liveCaptureUrl: '/assets/demo/face_live_mismatch.jpg',
            isSimulated: true
          },
          tampering: {
            tamperingScore: 5.1,
            manipulationProbability: 4.2,
            status: 'GENUINE',
            confidence: 97.0,
            elaScore: 3.2,
            detectedRegions: [],
            isSimulated: true
          },
          integrity: {
            hashMatched: true,
            status: 'MATCH',
            message: 'Document physical substrate authentic. No cryptographic tampering detected.'
          },
          suggestedRisk: 68,
          isSimulated: true
        };

      case 'REVIEW_REQUIRED':
        return {
          ocr: {
            name: 'MEI-LING CHEN',
            dateOfBirth: '17/10/1989',
            documentNumber: 'C7741029',
            nationality: 'SGP',
            issueDate: '14/11/2021',
            expiryDate: '13/11/2031',
            confidence: 71.3,
            status: 'FLAGGED',
            mrzRaw: 'P<SGPCHEN<<MEI<LING<<<<<<<<<<<<<<<<<<<<<<<\nC7741029<9SGP8910174F3111138<<<<<<<<<<<<<<08',
            isSimulated: true
          },
          face: {
            similarityScore: 86.1,
            confidence: 89.4,
            status: 'MATCHED',
            documentPhotoUrl: '/assets/demo/face_doc_review.jpg',
            liveCaptureUrl: '/assets/demo/face_live_review.jpg',
            isSimulated: true
          },
          tampering: {
            tamperingScore: 42.0,
            manipulationProbability: 41.5,
            status: 'REVIEW_REQUIRED',
            confidence: 88.0,
            elaScore: 39.4,
            detectedRegions: [
              {
                region: 'Document Surface Glare & Scratches',
                severity: 'MEDIUM',
                box: { x: 15, y: 20, width: 70, height: 60 },
                description: 'Low-contrast illumination and micro-abrasions causing ambiguous edge gradients.'
              }
            ],
            isSimulated: true
          },
          integrity: {
            hashMatched: true,
            status: 'MATCH',
            message: 'Cryptographic hash registered in border ledger.'
          },
          suggestedRisk: 48,
          isSimulated: true
        };

      case 'GENUINE':
      default:
        return {
          ocr: {
            name: 'AARAV DEV SHARMA',
            dateOfBirth: '14/08/1992',
            documentNumber: 'Z8942104',
            nationality: 'IND',
            issueDate: '10/01/2021',
            expiryDate: '09/01/2031',
            confidence: 99.2,
            status: 'PASS',
            mrzRaw: 'P<INDAAARAV<DEV<SHARMA<<<<<<<<<<<<<<<<<<<<<\nZ8942104<4IND9208148M3101095<<<<<<<<<<<<<<06',
            isSimulated: true
          },
          face: {
            similarityScore: 97.8,
            confidence: 99.4,
            status: 'MATCHED',
            documentPhotoUrl: '/assets/demo/face_doc_genuine.jpg',
            liveCaptureUrl: '/assets/demo/face_live_genuine.jpg',
            isSimulated: true
          },
          tampering: {
            tamperingScore: 3.2,
            manipulationProbability: 2.8,
            status: 'GENUINE',
            confidence: 98.5,
            elaScore: 2.9,
            detectedRegions: [],
            isSimulated: true
          },
          integrity: {
            hashMatched: true,
            status: 'MATCH',
            message: 'SHA-256 fingerprint matches issuance ledger with 100% cryptographic parity.'
          },
          suggestedRisk: 18,
          isSimulated: true
        };
    }
  }
}

module.exports = new AIClient();
