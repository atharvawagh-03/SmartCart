const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  trackProductView,
} = require("../controllers/productController");

const router = express.Router();

router.route("/")
  .get(getProducts)
  .post(protect, admin, createProduct);

router.route("/:id")
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route("/:id/view").post(trackProductView);

module.exports = router;
