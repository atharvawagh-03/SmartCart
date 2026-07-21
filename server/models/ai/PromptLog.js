const mongoose = require("mongoose");

/**
 * PromptLog — immutable audit record of every OpenAI API call.
 *
 * Stores the full prompt that was sent and the raw response that came
 * back. This serves three purposes:
 *
 *   1. Debugging — reproduce exactly what the LLM received when a bad
 *      response is reported.
 *   2. Cost tracking — sum promptTokens + completionTokens across any
 *      date range to calculate exact OpenAI spend.
 *   3. Fine-tuning data — high-quality (success = true) logs can later
 *      be exported as training examples.
 *
 * This collection is append-only. Documents are never updated.
 */
const promptLogSchema = mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },

    // The raw text the user typed (before any sanitisation).
    userMessage: {
      type: String,
      required: true,
    },

    // The system prompt template that was rendered for this call.
    systemPrompt: {
      type: String,
      required: true,
    },

    // The product context block injected into the prompt.
    // Stored separately so it can be excluded from fine-tuning exports.
    contextInjected: {
      type: String,
      default: "",
    },

    // The complete prompt sent to OpenAI (system + context + history + user).
    fullPrompt: {
      type: String,
      required: true,
    },

    // The raw string returned by OpenAI before parsing.
    rawResponse: {
      type: String,
      default: "",
    },

    // The parsed JSON object extracted from rawResponse.
    // Null if parsing failed.
    parsedResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // Which OpenAI model was used (e.g. "gpt-4o", "gpt-4o-mini").
    model: {
      type: String,
      required: true,
    },

    // Token usage reported by the OpenAI API response.
    promptTokens: {
      type: Number,
      default: 0,
    },
    completionTokens: {
      type: Number,
      default: 0,
    },
    totalTokens: {
      type: Number,
      default: 0,
    },

    // Estimated USD cost for this call, calculated from token counts.
    costEstimateUsd: {
      type: Number,
      default: 0,
    },

    // Wall-clock time from request start to parsed response (ms).
    latencyMs: {
      type: Number,
      default: 0,
    },

    // Whether the pipeline completed without an error.
    success: {
      type: Boolean,
      required: true,
    },

    // Populated only when success = false.
    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index: auto-delete raw prompt logs after 90 days to manage storage.
// Increase or remove this index in production if you need longer retention.
promptLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 90 }
);

const PromptLog = mongoose.model("PromptLog", promptLogSchema);

module.exports = PromptLog;
