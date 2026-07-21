/**
 * openaiClient.js — Thin, centralised wrapper around the OpenAI API.
 *
 * RESPONSIBILITY
 * ──────────────
 * Every call to OpenAI in this codebase goes through this module. No
 * controller or service imports the OpenAI SDK directly. This gives us:
 *
 *   • One place to swap models (gpt-4o → gpt-4o-mini for cost savings).
 *   • Centralised error handling and retry logic.
 *   • Easy token counting before/after each call.
 *   • A single mock point for unit tests.
 *
 * CONFIGURATION (Phase 2)
 * ───────────────────────
 * Reads OPENAI_API_KEY and OPENAI_MODEL from process.env.
 * If OPENAI_API_KEY is not set, all calls return a stub response so the
 * rest of the pipeline can be developed and tested without a live key.
 *
 * PHASE 1 STATUS: Placeholder — OpenAI SDK is NOT installed or imported.
 *                 Returns a hardcoded stub response so the full pipeline
 *                 can be wired end-to-end without a real API key.
 * PHASE 2 TODO:   npm install openai, uncomment the real implementation,
 *                 add retry logic with exponential backoff.
 *
 * @param {object[]} messages   - Prompt in OpenAI { role, content } format.
 * @param {object}   options    - Optional overrides: { model, temperature, maxTokens }
 * @returns {object} result     - { content: string, usage: { promptTokens, completionTokens, totalTokens } }
 */
const chat = async (messages, options = {}) => {
  // TODO (Phase 2): Uncomment and implement real OpenAI integration.
  //
  // const OpenAI = require("openai");
  // const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  //
  // const response = await client.chat.completions.create({
  //   model       : options.model       || process.env.OPENAI_MODEL || "gpt-4o",
  //   messages,
  //   temperature : options.temperature || 0.3,
  //   max_tokens  : options.maxTokens   || 1000,
  //   response_format: { type: "json_object" },
  // });
  //
  // const choice = response.choices[0];
  // return {
  //   content : choice.message.content,
  //   usage   : {
  //     promptTokens     : response.usage.prompt_tokens,
  //     completionTokens : response.usage.completion_tokens,
  //     totalTokens      : response.usage.total_tokens,
  //   },
  // };

  // Phase 1 stub — returns a safe, parseable placeholder response.
  console.log("[openaiClient] STUB — OpenAI not yet configured.");

  return {
    content: JSON.stringify({
      responseType: "text",
      message:
        "AI Shopping Assistant is coming soon! This is a placeholder response from Phase 1.",
      products: [],
      followUpSuggestions: [],
      clarificationQuestion: null,
      comparisonTable: null,
      budgetPlan: null,
    }),
    usage: {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
    },
  };
};

module.exports = { chat };
