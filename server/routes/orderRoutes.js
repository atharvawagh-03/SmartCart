const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { createOrder, getUserOrders } = require("../controllers/orderController");

const router = express.Router();

router.route("/").post(protect, createOrder);
router.route("/user").get(protect, getUserOrders);

module.exports = router;
