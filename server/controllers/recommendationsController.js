const Product = require("../models/Product");
const Order = require("../models/Order");

// @desc    Get product recommendations
// @route   GET /api/recommendations
// @access  Private
const getRecommendations = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;

    let purchasedCategories = [];
    if (userId) {
      // 1. Get user's purchase history to find favorite categories
      const orders = await Order.find({ user: userId }).populate("orderItems.product");
      
      if (orders && orders.length > 0) {
       orders.forEach(order => {
          order.orderItems.forEach(item => {
             // Depending on how populate works, item.product could be an object or null if deleted
             if (item.product && item.product.category) {
                 purchasedCategories.push(item.product.category);
             }
          });
       });
      }
    }

    // Determine the most frequently purchased category
    let favoriteCategory = null;
    if (purchasedCategories.length > 0) {
       const categoryCounts = purchasedCategories.reduce((acc, cat) => {
           acc[cat] = (acc[cat] || 0) + 1;
           return acc;
       }, {});
       favoriteCategory = Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b);
    }

    // 2. Fetch products
    let recommendedProducts = [];

    if (favoriteCategory) {
        // Find products in similar category
        recommendedProducts = await Product.find({ category: favoriteCategory })
            .sort({ views: -1, _id: -1 })
            .limit(4);
    }

    // 3. Fallback / Fill up with most viewed products
    if (recommendedProducts.length < 4) {
        const excludeIds = recommendedProducts.map(p => p._id);
        const additionalProducts = await Product.find({ _id: { $nin: excludeIds } })
            .sort({ views: -1, _id: -1 })
            .limit(4 - recommendedProducts.length);
        
        recommendedProducts = [...recommendedProducts, ...additionalProducts];
    }

    res.json(recommendedProducts);
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendations };
