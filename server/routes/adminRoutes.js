const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const { getDashboardAnalytics } = require("../controllers/adminController");

const router = express.Router();

router.route("/analytics").get(protect, admin, getDashboardAnalytics);

module.exports = router;
