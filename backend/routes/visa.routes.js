const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/auth.middleware");
const { getMyVisa } = require("../controllers/visa.controller");

router.get("/my", authMiddleware, getMyVisa);

module.exports = router;