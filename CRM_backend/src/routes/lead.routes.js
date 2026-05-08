const express = require("express");
const router = express.Router();
const {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  addNote,
  deleteNote,
  getDashboardStats,
  getSalespeople,
} = require("../controllers/lead.controller");
const { protect } = require("../middleware/auth.middleware");

// All lead routes require authentication
router.use(protect);

// GET /api/leads/stats  ← must be before /:id to avoid conflict
router.get("/stats", getDashboardStats);

// GET /api/leads/salespeople  ← must be before /:id to avoid conflict
router.get("/salespeople", getSalespeople);

// GET    /api/leads
// POST   /api/leads
router.route("/").get(getLeads).post(createLead);

// GET    /api/leads/:id
// PUT    /api/leads/:id
// DELETE /api/leads/:id
router.route("/:id").get(getLeadById).put(updateLead).delete(deleteLead);

// POST   /api/leads/:id/notes
router.post("/:id/notes", addNote);

// DELETE /api/leads/:id/notes/:noteId
router.delete("/:id/notes/:noteId", deleteNote);

module.exports = router;
