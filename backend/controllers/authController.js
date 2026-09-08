const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const mockStore = require('../services/mockStore');
const { isFallback } = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

const login = async (req, res) => {
  try {
    const { officerId, password } = req.body;

    if (!officerId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Officer ID and Password are required.'
      });
    }

    let user = null;

    if (isFallback()) {
      user = mockStore.users.find(u => u.officerId.toUpperCase() === officerId.trim().toUpperCase());
    } else {
      user = await User.findOne({ officerId: officerId.trim().toUpperCase() });
      if (!user) {
        user = mockStore.users.find(u => u.officerId.toUpperCase() === officerId.trim().toUpperCase());
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Officer ID or clearance credentials.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Officer ID or clearance credentials.'
      });
    }

    // Update last login
    user.lastLogin = new Date();

    // Sign JWT
    const token = jwt.sign(
      {
        id: user._id,
        officerId: user.officerId,
        name: user.name,
        role: user.role,
        checkpoint: user.checkpoint,
        department: user.department
      },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    // Record audit event
    mockStore.auditLogs.unshift({
      _id: `audit-login-${Date.now()}`,
      verificationId: 'SYSTEM',
      officerId: user.officerId,
      action: 'OFFICER_LOGIN_AUTHENTICATED',
      details: { role: user.role, checkpoint: user.checkpoint },
      timestamp: new Date()
    });

    return res.status(200).json({
      success: true,
      message: 'Authentication successful. Clearance granted.',
      token,
      officer: {
        officerId: user.officerId,
        name: user.name,
        role: user.role,
        checkpoint: user.checkpoint,
        department: user.department,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during authentication.' });
  }
};

const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    officer: req.user
  });
};

module.exports = {
  login,
  getMe
};
