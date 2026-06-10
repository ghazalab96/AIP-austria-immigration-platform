const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/auth.middleware");
const { adminMiddleware } = require("../middleware/admin.middleware");

const {
  getMySessionRequests,
  createSessionRequest,
  deleteSessionRequest,
  getAllSessionRequestsForAdmin,
  updateSessionRequestStatus,
  deleteSessionRequestForAdmin
} = require("../controllers/session.controller");

// Student routes
router.get("/", authMiddleware, getMySessionRequests);
router.post("/", authMiddleware, createSessionRequest);
router.delete("/:id", authMiddleware, deleteSessionRequest);

// Admin routes
router.get("/admin/all", adminMiddleware, getAllSessionRequestsForAdmin);
router.patch("/admin/:id/status", adminMiddleware, updateSessionRequestStatus);
router.delete("/admin/:id", adminMiddleware, deleteSessionRequestForAdmin);

module.exports = router;