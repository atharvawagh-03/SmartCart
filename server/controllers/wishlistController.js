const Wishlist = require("../models/Wishlist");

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.json(wishlist);
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      res.status(400);
      throw new Error("Product ID is required");
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    // Check if product is already in wishlist
    const exists = wishlist.products.some(
      (product) => product.toString() === productId
    );

    if (!exists) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    // Populate and return
    const updatedWishlist = await Wishlist.findById(wishlist._id).populate("products");
    res.status(201).json(updatedWishlist);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res, next) => {
  try {
    const productId = req.params.productId;

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      res.status(404);
      throw new Error("Wishlist not found");
    }

    wishlist.products = wishlist.products.filter(
      (product) => product.toString() !== productId
    );

    await wishlist.save();

    const updatedWishlist = await Wishlist.findById(wishlist._id).populate("products");
    res.json(updatedWishlist);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
