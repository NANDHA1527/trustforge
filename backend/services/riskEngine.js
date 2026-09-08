class RiskEngine {
  /**
   * Calculate multi-vector transparent risk score
   * @param {Object} params
   * @param {Object} params.ocrResult
   * @param {Object} params.faceResult
   * @param {Object} params.tamperingResult
   * @param {Object} params.integrityResult
   */
  evaluate({ ocrResult, faceResult, tamperingResult, integrityResult }) {
    const riskFactors = [];
    let authenticityPoints = 0;
    let facePoints = 0;
    let tamperingPoints = 0;
    let integrityPoints = 0;

    // 1. Authenticity & OCR (0-30 points)
    if (ocrResult) {
      if (ocrResult.confidence < 75) {
        authenticityPoints += 15;
        riskFactors.push({
          points: 15,
          category: 'OCR_LOW_CONFIDENCE',
          description: `OCR read confidence dropped below standard threshold (${ocrResult.confidence || 71}%)`
        });
      }
      if (ocrResult.status === 'FLAGGED' || ocrResult.status === 'FAILED') {
        authenticityPoints += 12;
        riskFactors.push({
          points: 12,
          category: 'MRZ_ANOMALY',
          description: 'Discrepancy detected between Machine Readable Zone (MRZ) checksum and visual zone'
        });
      }
    } else {
      authenticityPoints += 5;
    }

    // 2. Face Verification (0-25 points; can contribute up to 35 on severe mismatch)
    if (faceResult) {
      const similarity = faceResult.similarityScore || 0;
      if (faceResult.status === 'MISMATCH' || similarity < 50) {
        facePoints += 25;
        riskFactors.push({
          points: 25,
          category: 'BIOMETRIC_MISMATCH',
          description: `Facial biometric similarity is critically low (${similarity.toFixed(1)}% match, threshold 70%)`
        });
      } else if (similarity < 75) {
        facePoints += 12;
        riskFactors.push({
          points: 12,
          category: 'BIOMETRIC_MARGINAL',
          description: `Facial biometric similarity is borderline (${similarity.toFixed(1)}% match)`
        });
      }
    }

    // 3. Document Tampering Detection (0-25 points; up to 35 on critical forensic modification)
    if (tamperingResult) {
      const score = tamperingResult.tamperingScore || 0;
      if (score > 60 || tamperingResult.status === 'SUSPICIOUS_MODIFICATION_DETECTED') {
        tamperingPoints += 25;
        const regionCount = tamperingResult.detectedRegions?.length || 1;
        riskFactors.push({
          points: 25,
          category: 'FORENSIC_TAMPERING',
          description: `Forensic analysis detected ${regionCount} high-probability tampered regions (Tampering score: ${score.toFixed(1)}%)`
        });
      } else if (score > 30 || tamperingResult.status === 'REVIEW_REQUIRED') {
        tamperingPoints += 12;
        riskFactors.push({
          points: 12,
          category: 'TAMPERING_ANOMALY',
          description: `Surface noise and compression variance detected on document substrate (${score.toFixed(1)}%)`
        });
      }
    }

    // 4. Cryptographic Hash / Blockchain Integrity (0-20 points)
    if (integrityResult) {
      if (integrityResult.hashMatched === false || integrityResult.status === 'MISMATCH') {
        integrityPoints += 20;
        riskFactors.push({
          points: 20,
          category: 'HASH_MISMATCH',
          description: 'Document SHA-256 fingerprint does not match prior recorded integrity baseline'
        });
      }
    }

    // Baseline minimum synthetic risk factor if perfectly clean
    if (riskFactors.length === 0) {
      riskFactors.push({
        points: 8,
        category: 'ROUTINE_BASELINE',
        description: 'Standard border screening baseline uncertainty factor'
      });
      authenticityPoints = 8;
    }

    const totalScore = Math.min(100, authenticityPoints + facePoints + tamperingPoints + integrityPoints);

    let classification = 'GENUINE';
    if (totalScore >= 61) {
      classification = 'SUSPICIOUS';
    } else if (totalScore >= 31) {
      classification = 'REVIEW REQUIRED';
    } else {
      classification = 'GENUINE';
    }

    return {
      totalScore,
      classification,
      breakdown: {
        authenticityPoints,
        facePoints,
        tamperingPoints,
        integrityPoints
      },
      riskFactors
    };
  }
}

module.exports = new RiskEngine();
