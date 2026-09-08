const mockStore = require('../services/mockStore');

const getAuditLogs = async (req, res) => {
  try {
    const { search, action, officerId } = req.query;

    let logs = [...mockStore.auditLogs];

    if (search) {
      const q = search.toLowerCase();
      logs = logs.filter(l =>
        (l.verificationId && l.verificationId.toLowerCase().includes(q)) ||
        (l.action && l.action.toLowerCase().includes(q)) ||
        (l.officerId && l.officerId.toLowerCase().includes(q))
      );
    }

    if (action && action !== 'ALL') {
      logs = logs.filter(l => l.action.toUpperCase() === action.toUpperCase());
    }

    if (officerId) {
      logs = logs.filter(l => l.officerId.toUpperCase() === officerId.toUpperCase());
    }

    return res.status(200).json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve audit trail.' });
  }
};

module.exports = {
  getAuditLogs
};
