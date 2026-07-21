/**
 * analyticsLogger.js — Fire-and-forget event logging for AI interactions.
 *
 * RESPONSIBILITY
 * ──────────────
 * Records every significant AI event into two places:
 *
 *   1. PromptLog    — full audit trail of every OpenAI call.
 *   2. AIAnalytics  — daily aggregated counters for the admin dashboard.
 *
 * All functions in this module are designed to be called WITHOUT awaiting
 * the result. Logging must NEVER block or crash the main response path.
 * Errors here are caught internally and written to console only.
 *
 * EVENTS LOGGED
 * ─────────────
 *   logAICall     — after every OpenAI API call (tokens, latency, success)
 *   logConversion — when a recommended product is added to cart
 *   logSession    — when a session starts or ends
 *
 * PHASE 1 STATUS: Placeholder — all functions are no-ops with a console log.
 * PHASE 2 TODO:   Implement PromptLog.create() and AIAnalytics upsert with
 *                 $inc operators for all counter fields.
 */

const PromptLog = require("../../models/ai/PromptLog");
const AIAnalytics = require("../../models/ai/AIAnalytics");

/**
 * Log a completed OpenAI API call.
 *
 * @param {object} data
 * @param {string} data.sessionId
 * @param {string} data.userId
 * @param {string} data.userMessage
 * @param {string} data.systemPrompt
 * @param {string} data.contextInjected
 * @param {string} data.fullPrompt
 * @param {string} data.rawResponse
 * @param {object} data.parsedResponse
 * @param {string} data.model
 * @param {number} data.promptTokens
 * @param {number} data.completionTokens
 * @param {number} data.totalTokens
 * @param {number} data.costEstimateUsd
 * @param {number} data.latencyMs
 * @param {boolean} data.success
 * @param {string}  data.errorMessage
 */
const logAICall = (data) => {
  // TODO (Phase 2):
  // PromptLog.create(data).catch(err =>
  //   console.error("[analyticsLogger] Failed to write PromptLog:", err.message)
  // );
  // incrementDailyCounters(data);

  console.log(
    `[analyticsLogger] logAICall STUB | tokens=${data.totalTokens} | success=${data.success}`
  );
};

/**
 * Increment daily analytics counters for one AI call.
 * Uses $inc so multiple concurrent requests don't conflict.
 *
 * @param {object} data - Same shape as logAICall data.
 */
const incrementDailyCounters = (data) => {
  // TODO (Phase 2):
  // const today = new Date();
  // today.setUTCHours(0, 0, 0, 0);
  //
  // const intentField = `intentBreakdown.${data.intent}`;
  // AIAnalytics.findOneAndUpdate(
  //   { date: today },
  //   {
  //     $inc: {
  //       totalMessages     : 1,
  //       totalTokensUsed   : data.totalTokens,
  //       totalCostUsd      : data.costEstimateUsd,
  //       [intentField]     : 1,
  //     },
  //     $set: { date: today },
  //   },
  //   { upsert: true }
  // ).catch(err =>
  //   console.error("[analyticsLogger] Failed to update AIAnalytics:", err.message)
  // );
};

/**
 * Record that a recommended product was added to the cart.
 * Increments the conversion counter in today's AIAnalytics document.
 *
 * @param {string} userId
 * @param {string} productId
 * @param {string} sessionId
 */
const logConversion = (userId, productId, sessionId) => {
  // TODO (Phase 2): increment conversionCount in today's AIAnalytics doc.
  console.log(`[analyticsLogger] logConversion STUB | product=${productId}`);
};

/**
 * Log the start or end of a chat session.
 *
 * @param {string}  sessionId
 * @param {string}  userId
 * @param {"start"|"end"} event
 */
const logSession = (sessionId, userId, event) => {
  // TODO (Phase 2): update totalSessions or avgSessionDuration.
  console.log(`[analyticsLogger] logSession STUB | event=${event}`);
};

module.exports = {
  logAICall,
  logConversion,
  logSession,
};
