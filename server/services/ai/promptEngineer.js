/**
 * promptEngineer.js — Assembles the final prompt sent to OpenAI.
 *
 * RESPONSIBILITY
 * ──────────────
 * Combines four ingredients into the message array that is forwarded
 * to the OpenAI Chat Completions API:
 *
 *   1. System prompt  — defines the AI persona, strict rules, and
 *                        response schema (JSON mode).
 *   2. Context block  — product data from contextBuilder.
 *   3. Chat history   — last N messages so the model remembers context.
 *   4. User message   — the current turn's raw input.
 *
 * PROMPT DESIGN PRINCIPLES
 * ────────────────────────
 * • The system prompt must hard-enforce the "only recommend from context"
 *   rule to prevent hallucinated products.
 * • Response format is locked to JSON mode (OpenAI `response_format`) so
 *   responseParser can reliably extract structured data.
 * • Chat history is capped at the last 10 messages to control token cost
 *   while still preserving enough context for follow-up queries.
 *
 * PHASE 1 STATUS: Placeholder — returns a minimal stub message array.
 * PHASE 2 TODO:   Build the full system prompt template with persona rules,
 *                 inject contextBlock and history, enable JSON mode.
 *
 * @param {string}   userMessage   - Current user message.
 * @param {string}   contextBlock  - Formatted product context string.
 * @param {object[]} history       - Recent ChatMessage documents.
 * @param {object}   userPrefs     - UserAIPreference document (may be null).
 * @returns {object[]} messages    - Array in OpenAI { role, content } format.
 */
const buildPrompt = (userMessage, contextBlock = "", history = [], userPrefs = null) => {
  // TODO (Phase 2): Build the full production prompt.
  //
  // const systemPrompt = renderSystemPrompt(contextBlock, userPrefs);
  // const historyMessages = history
  //   .slice(-10)
  //   .map(m => ({ role: m.role, content: m.content }));
  //
  // return [
  //   { role: "system",  content: systemPrompt },
  //   ...historyMessages,
  //   { role: "user",    content: userMessage },
  // ];

  // Phase 1 stub — enough to call openaiClient without crashing.
  return [
    {
      role: "system",
      content:
        "You are SmartCart AI, an expert shopping assistant. " +
        "Only recommend products from the provided product context. " +
        "Respond in JSON format.",
    },
    {
      role: "user",
      content: userMessage,
    },
  ];
};

module.exports = { buildPrompt };
