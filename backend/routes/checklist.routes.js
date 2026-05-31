const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/auth.middleware");

const {
  getMyChecklist,
  saveMyChecklist
} = require("../controllers/checklist.controller");

router.get("/", authMiddleware, getMyChecklist);

router.put("/", authMiddleware, saveMyChecklist);

module.exports = router;