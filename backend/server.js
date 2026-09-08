require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');
const mockStore = require('./services/mockStore');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Cross-Origin Configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static file hosting for uploaded files & mock assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// API Gateway Routes
app.use('/api', apiRoutes);

// Root informative endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'TRUSTFORGE Security Screening API',
    problemStatement: 'SIH26188: AI-Based Fake Identity & Document Screening System',
    authority: 'Ministry of Home Affairs / SSB Police-II Division',
    status: 'ACTIVE',
    mode: 'PROTOTYPE_DEMONSTRATION'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal screening server error.'
  });
});

// Server Initialization
const startServer = async () => {
  await connectDB();
  await mockStore.init();

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🛡️  TRUSTFORGE Enterprise Security Core Running`);
    console.log(`📡 REST API Endpoint : http://localhost:${PORT}/api`);
    console.log(`🎯 Problem Statement : SIH26188 (MHA / SSB Police-II)`);
    console.log(`⚡ Demonstration Mode: ACTIVE (Deterministic Synthetic Data)`);
    console.log(`=======================================================`);
  });
};

startServer();
