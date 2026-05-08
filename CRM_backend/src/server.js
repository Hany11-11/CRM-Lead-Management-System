require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const seedDatabase = require('./services/seed.service');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // 1. Connect to MongoDB
  await connectDB();

  // 2. Seed initial data (test user + sample leads) if DB is empty
  await seedDatabase();

  // 3. Start Express server
  app.listen(PORT, () => {
    console.log(`🚀 CRM Server running on http://localhost:${PORT}`);
    console.log(`📋 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔑 Test credentials: admin@example.com / password123`);
  });
};

startServer();
