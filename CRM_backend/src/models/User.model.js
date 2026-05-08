const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * User Schema for CRM system
 * @typedef {Object} User
 * @property {string} name - User's full name
 * @property {string} email - Unique email address (lowercase)
 * @property {string} password - Hashed password (never returned in queries by default)
 * @property {string} role - User role: 'Administrator' or 'Sales'
 * @property {Date} createdAt - Timestamp when user was created
 * @property {Date} updatedAt - Timestamp when user was last updated
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // never return password in queries by default
    },
    role: {
      type: String,
      enum: ["Administrator", "Sales"],
      default: "Sales",
    },
  },
  { timestamps: true },
);

/**
 * Pre-save hook: Hash password before storing if modified
 * @listens save
 */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

/**
 * Instance method to compare plaintext password with hashed password
 * @async
 * @param {string} candidatePassword - Plaintext password to verify
 * @returns {Promise<boolean>} - True if password matches, false otherwise
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
