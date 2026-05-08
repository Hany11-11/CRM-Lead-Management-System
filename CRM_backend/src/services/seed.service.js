const User = require("../models/User.model");
const Lead = require("../models/Lead.model");

/**
 * Hardcoded list of salespeople for the CRM system
 * Used when creating or filtering leads
 */
const SALESPEOPLE = [
  { id: 1, name: "Alex Johnson" },
  { id: 2, name: "Emily Davis" },
  { id: 3, name: "Ryan Martinez" },
  { id: 4, name: "Sarah Thompson" },
  { id: 5, name: "Michael Chen" },
];

/**
 * Seeds the database with initial test user
 * Only runs if no users exist in the database (prevents duplicate seeding)
 * Creates:
 *   - 1 admin user: admin@example.com / password123
 * @async
 * @returns {Promise<void>}
 * @throws {Error} Logs error if seeding fails but doesn't throw
 * @example
 * // Called automatically on server startup
 * await seedDatabase();
 */
const seedDatabase = async () => {
  try {
    // 1. Seed admin user if doesn't exist
    const existingUser = await User.findOne({ email: "admin@example.com" });
    if (!existingUser) {
      console.log("🌱 Seeding admin user...");
      await User.create({
        name: "Admin User",
        email: "admin@example.com",
        password: "password123",
        role: "Administrator",
      });
      console.log("✅ Admin user created");
    }

    console.log("✅ Database ready for use");
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    console.error("Stack:", error.stack);
  }
};

module.exports = seedDatabase;
module.exports.SALESPEOPLE = SALESPEOPLE;
