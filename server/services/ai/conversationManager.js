/**
 * conversationManager.js — Session lifecycle and message persistence.
 *
 * RESPONSIBILITY
 * ──────────────
 * Owns everything related to ChatSession and ChatMessage documents:
 *
 *   • Creating a new session when a user starts chatting.
 *   • Loading an existing session and its message history.
 *   • Saving user and assistant messages after each turn.
 *   • Updating session counters (messageCount, totalTokensUsed).
 *   • Ending a session (status → "ended", endedAt → now).
 *   • Upserting the ConversationContext document on every turn.
 *
 * Controllers call these functions directly — they never import Mongoose
 * models for AI purposes. All DB access for conversations is routed here.
 *
 * PHASE 1 STATUS: Placeholder — all functions are stubs that log a message
 *                 and return sensible empty values so the pipeline can
 *                 run end-to-end without a real session in the database.
 * PHASE 2 TODO:   Implement each function body with real DB operations.
 */

const ChatSession = require("../../models/ai/ChatSession");
const ChatMessage = require("../../models/ai/ChatMessage");
const ConversationContext = require("../../models/ai/ConversationContext");
const { v4: uuidv4 } = require("uuid");

/**
 * Get an existing session or create a new one.
 *
 * @param {string} userId
 * @param {string|null} sessionId - Pass null to create a fresh session.
 * @returns {object} session document
 */
const getOrCreateSession = async (userId, sessionId = null) => {
  // TODO (Phase 2):
  // if (sessionId) {
  //   const existing = await ChatSession.findOne({ sessionId, userId });
  //   if (existing && existing.status === "active") return existing;
  // }
  // return await ChatSession.create({ userId, sessionId: uuidv4() });

  console.log("[conversationManager] getOrCreateSession STUB");
  return { sessionId: sessionId || uuidv4(), userId, status: "active", messageCount: 0 };
};

/**
 * Load the last N messages for a session (for history injection).
 *
 * @param {string} sessionId
 * @param {number} limit - Defaults to 10.
 * @returns {object[]} messages
 */
const getHistory = async (sessionId, limit = 10) => {
  // TODO (Phase 2):
  // return await ChatMessage
  //   .find({ sessionId })
  //   .sort({ createdAt: -1 })
  //   .limit(limit)
  //   .lean();

  console.log("[conversationManager] getHistory STUB");
  return [];
};

/**
 * Persist a single message (user or assistant) and update session counters.
 *
 * @param {object} messageData - Fields matching ChatMessage schema.
 * @returns {object} saved message document
 */
const saveMessage = async (messageData) => {
  // TODO (Phase 2):
  // const message = await ChatMessage.create(messageData);
  // await ChatSession.findOneAndUpdate(
  //   { sessionId: messageData.sessionId },
  //   {
  //     $inc: { messageCount: 1, totalTokensUsed: messageData.tokensUsed || 0 },
  //     $set: { lastActivityAt: new Date() },
  //   }
  // );
  // return message;

  console.log("[conversationManager] saveMessage STUB");
  return { ...messageData, _id: "stub_id", createdAt: new Date() };
};

/**
 * Upsert the ConversationContext for a session.
 *
 * @param {string} sessionId
 * @param {string} userId
 * @param {object} updates - Partial context fields to merge in.
 * @returns {object} updated context document
 */
const updateContext = async (sessionId, userId, updates) => {
  // TODO (Phase 2):
  // return await ConversationContext.findOneAndUpdate(
  //   { sessionId },
  //   { $set: { ...updates, userId } },
  //   { upsert: true, new: true }
  // );

  console.log("[conversationManager] updateContext STUB");
  return { sessionId, userId, ...updates };
};

/**
 * Load the current ConversationContext for a session.
 *
 * @param {string} sessionId
 * @returns {object|null}
 */
const getContext = async (sessionId) => {
  // TODO (Phase 2):
  // return await ConversationContext.findOne({ sessionId }).lean();

  console.log("[conversationManager] getContext STUB");
  return null;
};

/**
 * Mark a session as ended.
 *
 * @param {string} sessionId
 */
const endSession = async (sessionId) => {
  // TODO (Phase 2):
  // await ChatSession.findOneAndUpdate(
  //   { sessionId },
  //   { $set: { status: "ended", endedAt: new Date() } }
  // );

  console.log("[conversationManager] endSession STUB");
};

module.exports = {
  getOrCreateSession,
  getHistory,
  saveMessage,
  updateContext,
  getContext,
  endSession,
};
