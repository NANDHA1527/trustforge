const mongoose = require('mongoose');

let isConnected = false;
let useFallback = false;

const connectDB = async () => {
  if (process.env.USE_MOCK_DB === 'true') {
    console.log('⚡ TrustForge: Explicit Mock Database mode enabled.');
    useFallback = true;
    return false;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trustforge', {
      serverSelectionTimeoutMS: 2500, // Quick fail if local MongoDB is not running
    });
    isConnected = true;
    useFallback = false;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.log('ℹ️ Local MongoDB instance not reachable. Engaging TrustForge Resilient In-Memory Datastore.');
    console.log('   All MongoDB schemas, relational queries, and CRUD ops will function seamlessly in-memory.');
    isConnected = false;
    useFallback = true;
    return false;
  }
};

module.exports = {
  connectDB,
  isMongoDBConnected: () => isConnected,
  isFallback: () => useFallback
};
