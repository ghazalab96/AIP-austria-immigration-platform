const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/auth.middleware");

const {
  getMySessionRequests,
  createSessionRequest,
  deleteSessionRequest
} = require("../controllers/session.controller");

router.get("/", authMiddleware, getMySessionRequests);

router.post("/", authMiddleware, createSessionRequest);

router.delete("/:id", authMiddleware, deleteSessionRequest);

module.exports = router;