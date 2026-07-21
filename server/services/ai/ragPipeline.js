/**
 * ragPipeline.js — The core RAG (Retrieval-Augmented Generation) orchestrator.
 *
 * RESPONSIBILITY
 * ──────────────
 * This is the central coordinator of the AI pipeline. It owns the complete
 * request lifecycle for every AI chat turn:
 *
 *   Step 1 — ANALYZE   : Extract structured intent from the user message.
 *   Step 2 — GUARD     : If intent is incomplete, return a clarification
 *                         question immediately (no LLM call needed).
 *   Step 3 — RETRIEVE  : Fetch matching products from the database.
 *   Step 4 — BUILD     : Format products + user context into a context block.
 *   Step 5 — PROMPT    : Assemble the full message array for OpenAI.
 *   Step 6 — CALL      : Send the prompt to OpenAI and get a response.
 *   Step 7 — PARSE     : Validate and sanitise the LLM response.
 *   Step 8 — PERSIST   : Save messages and update context in the database.
 *   Step 9 — LOG       : Fire-and-forget analytics logging.
 *
 * No controller imports the individual pipeline services directly —
 * they all call ragPipeline.run() and receive a clean response object.
 * This means controllers stay thin and the pipeline logic is fully testable
 * in isolation.
 *
 * PHASE 1 STATUS: Wired together with stubs from each service module.
 *                 The pipeline runs end-to-end and returns a placeholder
 *                 response. No OpenAI key is required.
 * PHASE 2 TODO:   Each called service will be fleshed out — no changes
 *                 needed in this orchestrator file itself.
 */

const { analyzeQuery }        = require("./queryAnalyzer");
const { retrieveProducts }    = require("./productRetriever");
const { buildContext }        = require("./contextBuilder");
const { buildPrompt }         = require("./promptEngineer");
const { chat }                = require("./openaiClient");
const { parseResponse }       = require("./responseParser");
const { logAICall }           = require("./analyticsLogger");
const conversationManager     = require("./conversationManager");

/**
 * Run the full RAG pipeline for a single chat turn.
 *
 * @param {object} options
 * @param {string} options.userMessage    - Raw text from the user.
 * @param {string} options.userId         - Authenticated user's ID.
 * @param {string|null} options.sessionId - Existing session ID, or null.
 * @param {object} options.clientContext  - Hints from the frontend
 *                                          (currentPage, viewedProductId, etc.)
 * @returns {object} result
 * @returns {string} result.sessionId     - Session ID (new or existing).
 * @returns {object} result.response      - Parsed assistant response object.
 * @returns {number} result.tokensUsed    - Total tokens consumed this turn.
 */
const run = async ({ userMessage, userId, sessionId = null, clientContext = {} }) => {
  const startTime = Date.now();

  // ── Step 1: Session & history ──────────────────────────────────────────────
  const session = await conversationManager.getOrCreateSession(userId, sessionId);
  const history = await conversationManager.getHistory(session.sessionId);
  const existingContext = await conversationManager.getContext(session.sessionId);

  // ── Step 2: Intent analysis ────────────────────────────────────────────────
  const intent = await analyzeQuery(userMessage, existingContext);

  // ── Step 3: Clarification guard ────────────────────────────────────────────
  // If the analyzer identified missing required fields, short-circuit here
  // and return a clarification question without calling OpenAI.
  if (intent.missingInfo && intent.missingInfo.length > 0) {
    // TODO (Phase 2): Generate a natural clarification question from missingInfo.
    const clarification = {
      responseType: "clarification",
      message: `To help you better, could you tell me: ${intent.missingInfo.join(", ")}?`,
      products: [],
      followUpSuggestions: [],
      clarificationQuestion: `Could you provide: ${intent.missingInfo.join(", ")}?`,
      comparisonTable: null,
      budgetPlan: null,
    };

    await conversationManager.saveMessage({
      sessionId: session.sessionId, userId,
      role: "user", content: userMessage, contentType: "text",
    });
    await conversationManager.saveMessage({
      sessionId: session.sessionId, userId,
      role: "assistant", content: clarification.message,
      contentType: "clarification",
      structuredData: { followUpSuggestions: clarification.followUpSuggestions },
    });

    return { sessionId: session.sessionId, response: clarification, tokensUsed: 0 };
  }

  // ── Step 4: Product retrieval ──────────────────────────────────────────────
  const productsShown = existingContext?.productsShown || [];
  const products = await retrieveProducts(intent, { userId }, productsShown);
  const retrievedIds = products.map((p) => p._id?.toString());

  // ── Step 5: Context building ───────────────────────────────────────────────
  const contextBlock = buildContext(products, { userId });

  // ── Step 6: Prompt assembly ────────────────────────────────────────────────
  const messages = buildPrompt(userMessage, contextBlock, history);

  // ── Step 7: OpenAI call ────────────────────────────────────────────────────
  const { content: rawContent, usage } = await chat(messages);

  // ── Step 8: Response parsing + hallucination guard ────────────────────────
  const parsed = parseResponse(rawContent, retrievedIds);

  const latencyMs = Date.now() - startTime;

  // ── Step 9: Persist messages ───────────────────────────────────────────────
  await conversationManager.saveMessage({
    sessionId: session.sessionId, userId,
    role: "user", content: userMessage, contentType: "text",
  });
  await conversationManager.saveMessage({
    sessionId: session.sessionId, userId,
    role: "assistant",
    content: parsed.message,
    contentType: parsed.responseType || "text",
    structuredData: {
      products: retrievedIds,
      followUpSuggestions: parsed.followUpSuggestions || [],
      comparisonTable: parsed.comparisonTable || null,
      budgetPlan: parsed.budgetPlan || null,
    },
    tokensUsed: usage.totalTokens,
    responseTimeMs: latencyMs,
  });

  // Update context with newly shown products
  await conversationManager.updateContext(session.sessionId, userId, {
    extractedIntent: intent,
    productsShown: [...new Set([...productsShown, ...retrievedIds])],
  });

  // ── Step 10: Analytics (fire-and-forget) ───────────────────────────────────
  logAICall({
    sessionId: session.sessionId,
    userId,
    userMessage,
    systemPrompt: messages[0]?.content || "",
    contextInjected: contextBlock,
    fullPrompt: JSON.stringify(messages),
    rawResponse: rawContent,
    parsedResponse: parsed,
    model: process.env.OPENAI_MODEL || "gpt-4o",
    promptTokens: usage.promptTokens,
    completionTokens: usage.completionTokens,
    totalTokens: usage.totalTokens,
    costEstimateUsd: 0, // TODO (Phase 2): calculate from token counts
    latencyMs,
    success: true,
    errorMessage: null,
  });

  return {
    sessionId: session.sessionId,
    response: parsed,
    tokensUsed: usage.totalTokens,
  };
};

module.exports = { run };
