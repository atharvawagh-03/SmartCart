/**
 * tokenCounter.js — Estimate and track OpenAI token usage.
 *
 * RESPONSIBILITY
 * ──────────────
 * Provides two capabilities:
 *
 *   1. Pre-call estimation — estimate how many tokens a prompt will use
 *      BEFORE sending it to OpenAI. This lets the pipeline truncate the
 *      context block or history if the prompt would exceed the model's
 *      context window (128k for gpt-4o).
 *
 *   2. Cost calculation — convert OpenAI's reported token counts into
 *      a USD cost estimate using current per-model pricing. This feeds
 *      directly into PromptLog.costEstimateUsd and the AIAnalytics
 *      totalCostUsd counter.
 *
 * WHY ESTIMATE BEFORE CALLING?
 * ─────────────────────────────
 * OpenAI charges for tokens whether the call succeeds or fails. If a
 * prompt exceeds the model's context limit the API returns an error and
 * we still pay for the input tokens. Pre-estimation lets us gracefully
 * trim the context before we ever make the call.
 *
 * PHASE 1 STATUS: Placeholder — estimateTokens returns a rough character-
 *                 based approximation (1 token ≈ 4 chars). This is
 *                 inaccurate but safe for Phase 1 since OpenAI is not
 *                 yet connected.
 * PHASE 2 TODO:   npm install tiktoken, replace the approximation with
 *                 the real BPE tokenizer for the target model.
 *
 * Pricing reference (update when OpenAI changes rates):
 *   gpt-4o        input  $2.50 / 1M tokens
 *   gpt-4o        output $10.00 / 1M tokens
 *   gpt-4o-mini   input  $0.15 / 1M tokens
 *   gpt-4o-mini   output $0.60 / 1M tokens
 */

// Approximate token cost per model (USD per 1 token).
const PRICING = {
  "gpt-4o": {
    input:  2.50  / 1_000_000,
    output: 10.00 / 1_000_000,
  },
  "gpt-4o-mini": {
    input:  0.15 / 1_000_000,
    output: 0.60 / 1_000_000,
  },
};

const DEFAULT_MODEL = "gpt-4o";

/**
 * Estimate the token count of a string.
 * Uses the "1 token ≈ 4 characters" heuristic — accurate within ~10%
 * for English text. Replace with tiktoken in Phase 2.
 *
 * @param {string} text
 * @returns {number} estimated token count
 */
const estimateTokens = (text = "") => {
  // TODO (Phase 2): Use tiktoken for exact BPE token count.
  // const { encoding_for_model } = require("tiktoken");
  // const enc = encoding_for_model(model);
  // return enc.encode(text).length;

  return Math.ceil(text.length / 4);
};

/**
 * Estimate the token count of an array of OpenAI chat messages.
 * Accounts for the per-message overhead OpenAI adds (~4 tokens/message).
 *
 * @param {object[]} messages - Array of { role, content } objects.
 * @returns {number} estimated total tokens
 */
const estimateMessagesTokens = (messages = []) => {
  const MESSAGE_OVERHEAD = 4; // OpenAI adds ~4 tokens per message for role + framing
  return messages.reduce((total, msg) => {
    return total + estimateTokens(msg.content || "") + MESSAGE_OVERHEAD;
  }, 0);
};

/**
 * Calculate the estimated USD cost for an API call.
 *
 * @param {number} promptTokens
 * @param {number} completionTokens
 * @param {string} model - Defaults to gpt-4o.
 * @returns {number} estimated cost in USD (rounded to 8 decimal places)
 */
const calculateCost = (promptTokens, completionTokens, model = DEFAULT_MODEL) => {
  const pricing = PRICING[model] || PRICING[DEFAULT_MODEL];
  const cost = (promptTokens * pricing.input) + (completionTokens * pricing.output);
  return Math.round(cost * 1e8) / 1e8; // round to 8 decimal places
};

/**
 * Check whether a prompt exceeds the safe token limit for a model.
 * Leaves a buffer for the completion so the response is never cut off.
 *
 * @param {number} estimatedPromptTokens
 * @param {string} model
 * @returns {boolean} true if the prompt is within safe limits
 */
const isWithinLimit = (estimatedPromptTokens, model = DEFAULT_MODEL) => {
  const CONTEXT_LIMITS = {
    "gpt-4o":      128_000,
    "gpt-4o-mini": 128_000,
  };
  const COMPLETION_BUFFER = 2_000; // reserve tokens for the model's reply
  const limit = CONTEXT_LIMITS[model] || 128_000;
  return estimatedPromptTokens <= limit - COMPLETION_BUFFER;
};

module.exports = {
  estimateTokens,
  estimateMessagesTokens,
  calculateCost,
  isWithinLimit,
};
