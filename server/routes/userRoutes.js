const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getUserProfile, updateUserAddress } = require("../controllers/userController");

const router = express.Router();

router.route("/profile").get(protect, getUserProfile);
router.route("/address").put(protect, updateUserAddress);

module.exports = router;
