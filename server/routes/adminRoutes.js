const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const { getDashboardAnalytics, updateOrderStatus, getOrders } = require("../controllers/adminController");

const router = express.Router();

router.route("/analytics").get(protect, admin, getDashboardAnalytics);
router.route("/orders").get(protect, admin, getOrders);
router.route("/orders/:id/status").put(protect, admin, updateOrderStatus);

module.exports = router;
