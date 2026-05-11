const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/auth.middleware");

const {
  createApplication,
  getMyApplications,
  updateApplication,
  deleteApplication
} = require("../controllers/application.controller");

// user creates application
router.post("/", authMiddleware, createApplication);

// user sees own applications
router.get("/my", authMiddleware, getMyApplications);

// update
router.put("/:id", authMiddleware, updateApplication);

// delete
router.delete("/:id", authMiddleware, deleteApplication);

module.exports = router;