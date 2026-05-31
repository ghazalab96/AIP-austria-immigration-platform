const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/auth.middleware");

const {
  getMyProfile,
  saveMyProfile
} = require("../controllers/profile.controller");

router.get("/", authMiddleware, getMyProfile);

router.put("/", authMiddleware, saveMyProfile);

module.exports = router;