const mongoose = require("mongoose");

/**
 * ChatSession — one conversation thread per user.
 *
 * A session groups all messages exchanged during a single shopping
 * conversation. It tracks aggregate stats (message count, tokens used)
 * so the admin dashboard can report on usage without scanning every
 * message document.
 *
 * Lifecycle:
 *   status: "active"  → user is currently chatting
 *   status: "ended"   → user closed the chat or session timed out
 */
const chatSessionSchema = mongoose.Schema(
  {
    // The authenticated user who owns this session
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },

    // UUID generated on the client or server when a new chat opens.
    // Used as the join key between messages, context, and prompt logs
    // so we never have to chain multiple ObjectId lookups.
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Auto-generated from the user's first message (e.g. "Gaming laptop...")
    // Shown in the chat history sidebar so the user can resume a thread.
    title: {
      type: String,
      default: "New Conversation",
      trim: true,
      maxlength: 120,
    },

    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
    },

    // Running counters — incremented on every new message saved.
    // Avoids expensive COUNT queries on the messages collection.
    messageCount: {
      type: Number,
      default: 0,
    },

    // Cumulative OpenAI tokens consumed across all turns in this session.
    // Used for per-user cost attribution and rate-limit enforcement.
    totalTokensUsed: {
      type: Number,
      default: 0,
    },

    lastActivityAt: {
      type: Date,
      default: Date.now,
    },

    endedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt (= startedAt) and updatedAt
  }
);

const ChatSession = mongoose.model("ChatSession", chatSessionSchema);

module.exports = ChatSession;
