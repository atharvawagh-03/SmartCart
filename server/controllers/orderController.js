const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { orderItems, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    } else {
      // Create the order
      const order = new Order({
        user: req.user._id,
        orderItems,
        totalPrice,
      });

      const createdOrder = await order.save();

      // Update product stock
      for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock = product.stock - item.quantity;
          await product.save();
        }
      }

      // Clear the user's cart
      await Cart.findOneAndUpdate(
        { user: req.user._id },
        { items: [] }
      );

      // Notify admins via Socket.io
      const io = req.app.get("io");
      io.to("adminRoom").emit("newOrder", {
        orderId: createdOrder._id,
        user: req.user.name,
        totalPrice: createdOrder.totalPrice,
        message: `New order received from ${req.user.name}`
      });

      res.status(201).json(createdOrder);
    }
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
