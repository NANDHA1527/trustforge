const blockchainLedger = require('../services/blockchainLedger');

const getLedger = async (req, res) => {
  try {
    const blocks = await blockchainLedger.getAllBlocks();
    const verification = await blockchainLedger.verifyChainIntegrity();

    return res.status(200).json({
      success: true,
      integrityStatus: verification.isValid ? 'INTEGRITY_CONFIRMED' : 'INTEGRITY_COMPROMISED',
      verificationDetails: verification,
      totalBlocks: blocks.length,
      blocks
    });
  } catch (error) {
    console.error('Get ledger error:', error);
    return res.status(500).json({ success: false, message: 'Failed to query integrity ledger.' });
  }
};

const verifyLedgerIntegrity = async (req, res) => {
  try {
    const result = await blockchainLedger.verifyChainIntegrity();
    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Verify integrity error:', error);
    return res.status(500).json({ success: false, message: 'Failed to verify ledger integrity.' });
  }
};

module.exports = {
  getLedger,
  verifyLedgerIntegrity
};
