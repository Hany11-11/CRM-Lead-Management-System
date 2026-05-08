const Lead = require("../models/Lead.model");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess, sendError } = require("../utils/apiResponse");

/**
 * Retrieve all leads with optional filtering, searching, and pagination
 * Supports filters by: status, source, salesperson
 * Supports search across: name, company, email
 * Supports sorting by: name, company, status, estimatedValue, createdAt
 * @route GET /api/leads
 * @access Private (Requires authentication)
 * @query {string} search - Search term for name/company/email
 * @query {string} status - Filter by lead status
 * @query {string} source - Filter by lead source
 * @query {string} salesperson - Filter by assigned salesperson
 * @query {string} sortBy - Sort field (default: createdAt)
 * @query {string} order - Sort order: asc|desc (default: desc)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Results per page (default: 50)
 * @returns {Object} Leads array with pagination metadata
 */
const getLeads = asyncHandler(async (req, res) => {
  const {
    search,
    status,
    source,
    salesperson,
    sortBy = "createdAt",
    order = "desc",
    page = 1,
    limit = 50,
  } = req.query;

  const query = {};

  // Text search across name, company, email
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (status) query.status = status;
  if (source) query.source = source;
  if (salesperson) query.salesperson = salesperson;

  const sortOrder = order === "asc" ? 1 : -1;
  const allowedSortFields = [
    "name",
    "company",
    "status",
    "estimatedValue",
    "createdAt",
  ];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

  const skip = (Number(page) - 1) * Number(limit);

  const [leads, total] = await Promise.all([
    Lead.find(query)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(Number(limit)),
    Lead.countDocuments(query),
  ]);

  return sendSuccess(res, 200, "Leads retrieved", {
    leads,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
});

/**
 * Retrieve a single lead by ID
 * @route GET /api/leads/:id
 * @access Private (Requires authentication)
 * @param {string} id - Lead MongoDB ID
 * @returns {Object} Lead document with all details and notes
 * @throws {404} If lead not found
 */
const getLeadById = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) return sendError(res, 404, "Lead not found");
  return sendSuccess(res, 200, "Lead retrieved", lead);
});

/**
 * Create a new lead
 * @route POST /api/leads
 * @access Private (Requires authentication)
 * @param {Object} req.body - Lead data
 * @param {string} req.body.name - Lead contact name
 * @param {string} req.body.company - Company name
 * @param {string} req.body.email - Email address
 * @param {string} req.body.phone - Phone number
 * @param {string} req.body.source - Lead source
 * @param {string} req.body.salesperson - Assigned salesperson
 * @param {string} req.body.status - Lead status
 * @param {number} req.body.estimatedValue - Estimated deal value
 * @returns {Object} Created lead document
 */
const createLead = asyncHandler(async (req, res) => {
  const {
    name,
    company,
    email,
    phone,
    source,
    salesperson,
    status,
    estimatedValue,
  } = req.body;

  const lead = await Lead.create({
    name,
    company,
    email,
    phone,
    source,
    salesperson,
    status,
    estimatedValue,
  });

  return sendSuccess(res, 201, "Lead created", lead);
});

/**
 * Update an existing lead (partial updates supported)
 * @route PUT /api/leads/:id
 * @access Private (Requires authentication)
 * @param {string} id - Lead MongoDB ID
 * @param {Object} req.body - Fields to update
 * @returns {Object} Updated lead document
 * @throws {404} If lead not found
 */
const updateLead = asyncHandler(async (req, res) => {
  const allowedUpdates = [
    "name",
    "company",
    "email",
    "phone",
    "source",
    "salesperson",
    "status",
    "estimatedValue",
  ];
  const updates = {};
  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true },
  );

  if (!lead) return sendError(res, 404, "Lead not found");
  return sendSuccess(res, 200, "Lead updated", lead);
});

/**
 * Delete a lead and all associated data
 * @route DELETE /api/leads/:id
 * @access Private (Requires authentication)
 * @param {string} id - Lead MongoDB ID
 * @returns {Object} Success message
 * @throws {404} If lead not found
 */
const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) return sendError(res, 404, "Lead not found");
  return sendSuccess(res, 200, "Lead deleted");
});

/**
 * Add a note to a lead
 * @route POST /api/leads/:id/notes
 * @access Private (Requires authentication)
 * @param {string} id - Lead MongoDB ID
 * @param {string} req.body.content - Note content (required, non-empty)
 * @returns {Object} Updated lead document with new note
 * @throws {400} If note content is empty
 * @throws {404} If lead not found
 */
const addNote = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content || !content.trim()) {
    return sendError(res, 400, "Note content is required");
  }

  const lead = await Lead.findById(req.params.id);
  if (!lead) return sendError(res, 404, "Lead not found");

  lead.notes.push({ content: content.trim(), author: req.user.name });
  await lead.save();

  return sendSuccess(res, 201, "Note added", lead);
});

/**
 * Delete a note from a lead
 * @route DELETE /api/leads/:id/notes/:noteId
 * @access Private (Requires authentication)
 * @param {string} id - Lead MongoDB ID
 * @param {string} noteId - Note MongoDB ID
 * @returns {Object} Updated lead document with note removed
 * @throws {404} If lead or note not found
 */
const deleteNote = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) return sendError(res, 404, "Lead not found");

  const noteIndex = lead.notes.findIndex(
    (n) => n._id.toString() === req.params.noteId,
  );
  if (noteIndex === -1) return sendError(res, 404, "Note not found");

  lead.notes.splice(noteIndex, 1);
  await lead.save();

  return sendSuccess(res, 200, "Note deleted", lead);
});

/**
 * Get dashboard statistics and KPIs
 * Aggregates lead data to calculate:
 *   - Total leads count
 *   - Won deals count and value
 *   - Total pipeline value
 *   - Conversion rate (won/total)
 *   - Breakdown by status
 *   - Top performing salespeople
 * @route GET /api/leads/stats
 * @access Private (Requires authentication)
 * @returns {Object} Dashboard statistics object
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await Lead.aggregate([
    {
      $facet: {
        totalLeads: [{ $count: "count" }],
        byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
        wonDeals: [
          { $match: { status: "Won" } },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              totalValue: { $sum: "$estimatedValue" },
            },
          },
        ],
        pipelineValue: [
          { $group: { _id: null, total: { $sum: "$estimatedValue" } } },
        ],
        bySalesperson: [
          {
            $group: {
              _id: "$salesperson",
              count: { $sum: 1 },
              totalValue: { $sum: "$estimatedValue" },
            },
          },
          { $sort: { totalValue: -1 } },
        ],
      },
    },
  ]);

  const result = stats[0];
  const totalLeads = result.totalLeads[0]?.count || 0;
  const wonDeals = result.wonDeals[0]?.count || 0;
  const wonValue = result.wonDeals[0]?.totalValue || 0;
  const pipelineValue = result.pipelineValue[0]?.total || 0;
  const conversionRate =
    totalLeads > 0 ? Math.round((wonDeals / totalLeads) * 100) : 0;

  const statusMap = {};
  result.byStatus.forEach(({ _id, count }) => {
    statusMap[_id] = count;
  });

  return sendSuccess(res, 200, "Stats retrieved", {
    totalLeads,
    wonDeals,
    wonValue,
    pipelineValue,
    conversionRate,
    byStatus: statusMap,
    topSalespeople: result.bySalesperson,
  });
});

/**
 * Get list of all available salespeople
 * Returns hardcoded list of salespeople for dropdown/filter selections
 * @route GET /api/leads/salespeople
 * @access Private (Requires authentication)
 * @returns {Array} Array of salespeople objects with id and name
 */
const getSalespeople = asyncHandler(async (req, res) => {
  const { SALESPEOPLE } = require("../services/seed.service");
  return sendSuccess(res, 200, "Salespeople retrieved", SALESPEOPLE);
});

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  addNote,
  deleteNote,
  getDashboardStats,
  getSalespeople,
};
