const mongoose = require("mongoose");

/**
 * UserAIPreference — long-term preference profile for a user.
 *
 * Unlike ConversationContext (which is session-scoped and discarded),
 * this document persists across sessions. It is built gradually by the
 * analyticsLogger as the user interacts with the AI assistant over time.
 *
 * The RAG pipeline injects a summary of this document into the system
 * prompt so the AI can personalise responses from the very first message
 * of a new session ("You previously bought Sony headphones and tend to
 * prefer products under ₹50,000 in electronics.").
 */
const userAIPreferenceSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
      index: true,
    },

    // Categories the user searches / buys most often.
    preferredCategories: [String],

    // Brands the user gravitates towards based on purchase history.
    preferredBrands: [String],

    // Per-category budget ranges inferred from past behaviour.
    // Stored as a flexible map rather than fixed fields so new
    // categories can be added without a schema migration.
    budgetRanges: {
      type: Map,
      of: new mongoose.Schema(
        {
          min: Number,
          max: Number,
        },
        { _id: false }
      ),
      default: {},
    },

    // Controls how the AI formats its replies for this user.
    //   "detailed"  → full specs, long explanations
    //   "concise"   → short bullets, minimal prose
    communicationStyle: {
      type: String,
      enum: ["detailed", "concise"],
      default: "detailed",
    },

    // Lifetime engagement counters — used in admin analytics.
    totalSessions: {
      type: Number,
      default: 0,
    },

    // How many AI recommendations led to an add-to-cart action.
    totalRecommendationsActedOn: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const UserAIPreference = mongoose.model(
  "UserAIPreference",
  userAIPreferenceSchema
);

module.exports = UserAIPreference;
