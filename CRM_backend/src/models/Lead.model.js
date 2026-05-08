const mongoose = require("mongoose");

/**
 * Note Schema - Embedded in Lead documents
 * @typedef {Object} Note
 * @property {string} content - Note content/text
 * @property {string} author - Name of user who created the note
 * @property {Date} createdAt - Timestamp when note was created
 * @property {Date} updatedAt - Timestamp when note was last updated
 */

const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Note content is required"],
      trim: true,
    },
    author: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

/**
 * Lead Schema for CRM lead management
 * @typedef {Object} Lead
 * @property {string} name - Lead contact name
 * @property {string} company - Company name
 * @property {string} email - Lead email address
 * @property {string} phone - Lead phone number
 * @property {string} source - How the lead was acquired (Website, LinkedIn, etc.)
 * @property {string} salesperson - Assigned salesperson name
 * @property {string} status - Lead status (New, Contacted, Qualified, etc.)
 * @property {number} estimatedValue - Estimated deal value
 * @property {Note[]} notes - Array of embedded notes
 * @property {Date} createdAt - Timestamp when lead was created
 * @property {Date} updatedAt - Timestamp when lead was last updated
 */

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    source: {
      type: String,
      enum: [
        "Website",
        "LinkedIn",
        "Cold Email",
        "Referral",
        "Conference",
        "Other",
      ],
      required: [true, "Source is required"],
    },
    salesperson: {
      type: String,
      required: [true, "Salesperson is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"],
      default: "New",
    },
    estimatedValue: {
      type: Number,
      required: [true, "Estimated value is required"],
      min: [0, "Value must be non-negative"],
      default: 0,
    },
    notes: [noteSchema],
  },
  { timestamps: true },
);

/**
 * Database indexes for optimized query performance
 * Text indexes for full-text search, field indexes for common filters
 */
leadSchema.index({ name: "text", company: "text", email: "text" });
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ salesperson: 1 });

module.exports = mongoose.model("Lead", leadSchema);
