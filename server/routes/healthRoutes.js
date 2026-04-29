const express = require("express");
const { getHealthStatus } = require("../controllers/healthController");

const router = express.Router();

router.route("/").get(getHealthStatus);

module.exports = router;
