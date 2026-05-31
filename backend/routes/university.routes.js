const express = require("express");
const router = express.Router();

const {
  searchUniversities
} = require("../controllers/university.controller");

router.get("/", searchUniversities);

module.exports = router;