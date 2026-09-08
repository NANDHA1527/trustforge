const mockStore = require('../services/mockStore');

const getDashboardStats = async (req, res) => {
  try {
    const totalToday = 1284;
    const genuine = 1102;
    const reviewRequired = 126;
    const suspicious = 56;
    const avgProcessingTimeSec = 1.8;

    // Hourly trend data for Recharts
    const trendData = [
      { hour: '06:00', total: 42, genuine: 38, review: 3, suspicious: 1 },
      { hour: '08:00', total: 110, genuine: 98, review: 8, suspicious: 4 },
      { hour: '10:00', total: 185, genuine: 162, review: 16, suspicious: 7 },
      { hour: '12:00', total: 240, genuine: 212, review: 20, suspicious: 8 },
      { hour: '14:00', total: 215, genuine: 188, review: 19, suspicious: 8 },
      { hour: '16:00', total: 195, genuine: 170, review: 18, suspicious: 7 },
      { hour: '18:00', total: 162, genuine: 139, review: 16, suspicious: 7 },
      { hour: '20:00', total: 135, genuine: 95, review: 26, suspicious: 14 }
    ];

    // Risk distribution
    const riskDistribution = [
      { category: 'Low Risk (0-30)', count: 1102, percentage: 85.8, color: '#10B981' },
      { category: 'Medium Risk (31-60)', count: 126, percentage: 9.8, color: '#F59E0B' },
      { category: 'High Risk (61-100)', count: 56, percentage: 4.4, color: '#EF4444' }
    ];

    // Document types
    const documentTypeDistribution = [
      { name: 'Passport', value: 796, percentage: 62 },
      { name: 'Visa', value: 334, percentage: 26 },
      { name: 'Identity Card', value: 154, percentage: 12 }
    ];

    // Checkpoint posts
    const checkpointActivity = [
      { name: 'Raxaul Gate 1 (Pedestrian)', activeOfficers: 4, screeningsToday: 380, alertRate: '3.2%' },
      { name: 'Raxaul Gate 2 (Cargo/Transit)', activeOfficers: 3, screeningsToday: 290, alertRate: '5.1%' },
      { name: 'Raxaul Gate 3 (Main Checkpoint)', activeOfficers: 6, screeningsToday: 490, alertRate: '4.8%' },
      { name: 'Panitanki Integrated Post', activeOfficers: 3, screeningsToday: 124, alertRate: '2.4%' }
    ];

    // Recent verifications (top 6)
    const recentVerifications = mockStore.verifications.slice(0, 8);

    return res.status(200).json({
      success: true,
      stats: {
        totalScreeningsToday: totalToday + (mockStore.verifications.length - 4),
        genuineCount: genuine,
        reviewCount: reviewRequired,
        suspiciousCount: suspicious,
        avgProcessingTimeSec
      },
      trendData,
      riskDistribution,
      documentTypeDistribution,
      checkpointActivity,
      recentVerifications
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate operational metrics.' });
  }
};

const getSuspiciousCases = async (req, res) => {
  try {
    const cases = mockStore.suspiciousCases;
    const criticalCount = cases.filter(c => c.severity === 'Critical').length;
    const highCount = cases.filter(c => c.severity === 'High').length;
    const mediumCount = cases.filter(c => c.severity === 'Medium').length;

    return res.status(200).json({
      success: true,
      counts: {
        total: cases.length,
        critical: criticalCount,
        high: highCount,
        medium: mediumCount
      },
      cases
    });
  } catch (error) {
    console.error('Get suspicious cases error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve suspicious case queue.' });
  }
};

const addCaseNote = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { note } = req.body;
    const officerId = req.user ? req.user.officerId : 'TF-1024';

    const caseItem = mockStore.suspiciousCases.find(c => c.caseId === caseId || c._id === caseId);
    if (!caseItem) {
      return res.status(404).json({ success: false, message: 'Case not found.' });
    }

    const newNote = {
      officer: officerId,
      note,
      date: new Date()
    };
    caseItem.officerNotes.push(newNote);

    return res.status(200).json({
      success: true,
      message: 'Investigation note appended.',
      note: newNote,
      caseItem
    });
  } catch (error) {
    console.error('Add case note error:', error);
    return res.status(500).json({ success: false, message: 'Failed to record case note.' });
  }
};

module.exports = {
  getDashboardStats,
  getSuspiciousCases,
  addCaseNote
};
