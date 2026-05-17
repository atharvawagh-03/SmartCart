const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const User = require("../models/User");
const { validateAddress } = require("../models/addressSchema");

const normalizeAddress = (body) => ({
  fullName: body.fullName?.trim(),
  phone: body.phone?.trim(),
  addressLine1: body.addressLine1?.trim(),
  addressLine2: (body.addressLine2 || "").trim(),
  city: body.city?.trim(),
  state: body.state?.trim(),
  pincode: body.pincode?.trim(),
  country: (body.country || "India").trim(),
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { orderItems, totalPrice, shippingAddress, saveAddress } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    const addressError = validateAddress(shippingAddress);
    if (addressError) {
      res.status(400);
      throw new Error(addressError);
    }

    const normalizedAddress = normalizeAddress(shippingAddress);

    const order = new Order({
      user: req.user._id,
      orderItems,
      totalPrice,
      shippingAddress: normalizedAddress,
    });

    const createdOrder = await order.save();

    if (saveAddress) {
      await User.findByIdAndUpdate(req.user._id, {
        shippingAddress: normalizedAddress,
      });
    }

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock = product.stock - item.quantity;
        await product.save();
      }
    }

    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    const io = req.app.get("io");
    io.to("adminRoom").emit("newOrder", {
      orderId: createdOrder._id,
      user: req.user.name,
      totalPrice: createdOrder.totalPrice,
      message: `New order received from ${req.user.name}`,
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/user
// @access  Private
const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
};
