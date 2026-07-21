const mongoose = require("mongoose");

/**
 * ConversationContext — the AI's "working memory" for one session.
 *
 * This document is UPSERTED on every turn so the RAG pipeline always has
 * an up-to-date picture of what the user wants without replaying the full
 * message history. It captures structured intent extracted from the
 * conversation so follow-up messages can refine rather than restart.
 *
 * Example flow:
 *   Turn 1: "Show gaming laptops"
 *     → extractedIntent.category = "laptop", useCase = "gaming"
 *   Turn 2: "Only under ₹90,000"
 *     → extractedIntent.budgetMax = 90000 (category/useCase preserved)
 */
const conversationContextSchema = mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },

    // Structured intent extracted from the latest query.
    // Updated incrementally — a null field means "not yet known".
    extractedIntent: {
      // Top-level intent classification
      primaryIntent: {
        type: String,
        enum: ["search", "compare", "recommend", "budget", "question", null],
        default: null,
      },

      category: { type: String, default: null },    // e.g. "laptop"
      subCategory: { type: String, default: null }, // e.g. "gaming laptop"
      budgetMin: { type: Number, default: null },
      budgetMax: { type: Number, default: null },
      brands: [String],                             // preferred brands
      features: [String],                           // ["good camera", "long battery"]
      useCase: { type: String, default: null },     // "gaming", "video editing"
      recipientType: { type: String, default: null }, // "self", "gift", "office"
      urgency: { type: String, default: null },     // "urgent", "browsing"

      // Fields the AI still needs before it can retrieve products.
      // When this array is non-empty, the pipeline returns a clarification
      // question instead of triggering a product search.
      missingInfo: [String],
    },

    // Accumulated user preferences within this session.
    // More specific than extractedIntent — built up over multiple turns.
    preferences: {
      preferredBrands: [String],
      avoidedBrands: [String],
      priceRange: {
        min: { type: Number, default: null },
        max: { type: Number, default: null },
      },
      mustHaveFeatures: [String],
      dealbreakers: [String],
    },

    // Product IDs currently being compared (set when intent = "compare").
    currentComparison: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    // All product IDs shown to the user this session (de-duplicated).
    // Used to avoid repeatedly suggesting the same products.
    productsShown: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ConversationContext = mongoose.model(
  "ConversationContext",
  conversationContextSchema
);

module.exports = ConversationContext;
