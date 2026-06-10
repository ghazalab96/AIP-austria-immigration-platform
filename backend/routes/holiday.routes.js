const express = require("express");
const router = express.Router();

const {
  checkAustrianHoliday
} = require("../controllers/holiday.controller");

router.get("/check", checkAustrianHoliday);

module.exports = router;