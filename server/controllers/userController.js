const User = require("../models/User");
const { validateAddress } = require("../models/addressSchema");

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Save / update shipping address on user profile
// @route   PUT /api/users/address
// @access  Private
const updateUserAddress = async (req, res, next) => {
  try {
    const error = validateAddress(req.body);
    if (error) {
      res.status(400);
      throw new Error(error);
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.shippingAddress = {
      fullName: req.body.fullName.trim(),
      phone: req.body.phone.trim(),
      addressLine1: req.body.addressLine1.trim(),
      addressLine2: (req.body.addressLine2 || "").trim(),
      city: req.body.city.trim(),
      state: req.body.state.trim(),
      pincode: req.body.pincode.trim(),
      country: (req.body.country || "India").trim(),
    };

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      shippingAddress: user.shippingAddress,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserAddress,
};
