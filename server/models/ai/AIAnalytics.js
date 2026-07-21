const mongoose = require("mongoose");

/**
 * AIAnalytics — daily aggregated metrics for the admin dashboard.
 *
 * Rather than running expensive real-time aggregations over PromptLog
 * and ChatMessage on every dashboard load, the analyticsLogger service
 * upserts one document per calendar day (keyed on `date`).
 *
 * The admin dashboard reads from this collection directly — it is
 * always fast regardless of how many total messages exist.
 *
 * Populated by: server/services/ai/analyticsLogger.js
 * Read by:      server/controllers/adminController.js (future phase)
 */
const aiAnalyticsSchema = mongoose.Schema(
  {
    // Truncated to midnight UTC so one doc = one day.
    date: {
      type: Date,
      required: true,
      unique: true,
      index: true,
    },

    // Volume counters
    totalSessions: { type: Number, default: 0 },
    totalMessages: { type: Number, default: 0 },
    totalTokensUsed: { type: Number, default: 0 },
    totalCostUsd: { type: Number, default: 0 },

    // Performance
    avgResponseTimeMs: { type: Number, default: 0 },
    avgMessagesPerSession: { type: Number, default: 0 },
    avgSessionDurationMs: { type: Number, default: 0 },

    // Intent distribution — how often each feature was used.
    intentBreakdown: {
      search: { type: Number, default: 0 },
      compare: { type: Number, default: 0 },
      recommend: { type: Number, default: 0 },
      budget: { type: Number, default: 0 },
      question: { type: Number, default: 0 },
    },

    // Top categories and products requested — stored as sorted arrays.
    // Each entry is upserted in-place by the $inc / $push aggregation.
    topQueriedCategories: [
      {
        category: String,
        count: { type: Number, default: 0 },
      },
    ],

    topRecommendedProducts: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        count: { type: Number, default: 0 },
      },
    ],

    // Conversion: how many AI-recommended products were added to cart.
    conversionCount: { type: Number, default: 0 },

    // conversionCount / totalMessages (rounded to 4 decimal places).
    conversionRate: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const AIAnalytics = mongoose.model("AIAnalytics", aiAnalyticsSchema);

module.exports = AIAnalytics;
