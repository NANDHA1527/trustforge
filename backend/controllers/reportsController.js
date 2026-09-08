const mockStore = require('../services/mockStore');

const generateReport = async (req, res) => {
  try {
    const { verificationId } = req.body;
    const vId = verificationId || (mockStore.verifications[0]?.verificationId);

    const verification = mockStore.verifications.find(v => v.verificationId === vId);
    if (!verification) {
      return res.status(404).json({ success: false, message: 'Verification record not found for reporting.' });
    }

    const ocrResult = mockStore.ocrResults.find(o => o.verificationId === vId);
    const faceVerification = mockStore.faceVerifications.find(f => f.verificationId === vId);
    const tamperingAnalysis = mockStore.tamperingAnalyses.find(t => t.verificationId === vId);
    const riskAssessment = mockStore.riskAssessments.find(r => r.verificationId === vId);
    const integrityRecord = mockStore.integrityRecords.find(i => i.verificationId === vId);
    const officerDecision = mockStore.officerDecisions.find(d => d.verificationId === vId);

    const reportData = {
      reportId: `REP-${vId}-${Date.now().toString().slice(-4)}`,
      generatedAt: new Date(),
      system: 'TRUSTFORGE - Intelligent Identity & Document Verification Platform',
      problemStatement: 'SIH26188: AI-Based Fake Identity & Document Screening System',
      authority: 'Ministry of Home Affairs / SSB Police-II Division (Simulated Demonstration)',
      verification,
      ocrResult,
      faceVerification,
      tamperingAnalysis,
      riskAssessment,
      integrityRecord,
      officerDecision,
      disclaimer: 'PROTOTYPE DEMONSTRATION RECORD. Not connected to live government registries (UIDAI/CCTNS/Passport Seva). For Smart India Hackathon evaluation purposes only.'
    };

    return res.status(200).json({
      success: true,
      report: reportData
    });
  } catch (error) {
    console.error('Generate report error:', error);
    return res.status(500).json({ success: false, message: 'Failed to compile verification dossier report.' });
  }
};

module.exports = {
  generateReport
};
