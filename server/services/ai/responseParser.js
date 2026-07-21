/**
 * responseParser.js — Parses and validates the raw LLM response.
 *
 * RESPONSIBILITY
 * ──────────────
 * OpenAI returns a JSON string (enforced via response_format: json_object).
 * This module:
 *
 *   1. Parses the JSON string safely (handles malformed output gracefully).
 *   2. Validates the response shape against the expected schema.
 *   3. Cross-checks every product ID in the response against the set of
 *      IDs that were actually retrieved — HALLUCINATION GUARD. Any product
 *      ID not in the retrieval set is silently removed before the response
 *      reaches the controller.
 *   4. Returns a guaranteed-safe object the controller can send to the client.
 *
 * WHY THE HALLUCINATION GUARD IS CRITICAL
 * ────────────────────────────────────────
 * Even with a strict system prompt, LLMs occasionally invent product names
 * or IDs. Without this guard, the client could receive product references
 * that don't exist in the database, causing broken UI cards or 404 errors
 * when the frontend tries to fetch product details.
 *
 * PHASE 1 STATUS: Placeholder — returns the stub payload from openaiClient
 *                 unchanged (no real validation needed yet).
 * PHASE 2 TODO:   Implement JSON parsing, schema validation, and the
 *                 hallucination guard cross-check.
 *
 * @param {string}   rawContent      - The raw string from openaiClient.chat().
 * @param {string[]} retrievedIds    - Product IDs that were passed to the prompt.
 * @returns {object} parsed          - Safe, validated response object.
 */
const parseResponse = (rawContent, retrievedIds = []) => {
  // TODO (Phase 2): Implement real parsing and validation.
  //
  // try {
  //   const parsed = JSON.parse(rawContent);
  //
  //   // Hallucination guard — strip any product ID not in retrievedIds
  //   if (Array.isArray(parsed.products)) {
  //     parsed.products = parsed.products.filter(p =>
  //       retrievedIds.includes(p.id)
  //     );
  //   }
  //
  //   validateSchema(parsed); // throw if required fields are missing
  //   return parsed;
  // } catch (err) {
  //   console.error("[responseParser] Parse failed:", err.message);
  //   return buildFallbackResponse();
  // }

  // Phase 1: parse the stub JSON from openaiClient directly.
  try {
    return JSON.parse(rawContent);
  } catch {
    return {
      responseType: "text",
      message: "Sorry, I encountered an issue processing your request. Please try again.",
      products: [],
      followUpSuggestions: [],
      clarificationQuestion: null,
      comparisonTable: null,
      budgetPlan: null,
    };
  }
};

module.exports = { parseResponse };
