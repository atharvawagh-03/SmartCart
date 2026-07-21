/**
 * queryAnalyzer.js — Intent & entity extraction from raw user messages.
 *
 * RESPONSIBILITY
 * ──────────────
 * Takes the user's raw message plus the current ConversationContext and
 * produces a structured intent object. This runs BEFORE any database
 * query or OpenAI call, keeping those layers clean and focused.
 *
 * The analyzer answers three questions:
 *   1. What does the user want to DO?  (primaryIntent)
 *   2. What product are they looking for? (category, useCase, features)
 *   3. What information is still missing? (missingInfo)
 *
 * When missingInfo is non-empty, the pipeline will return a clarification
 * question to the user instead of triggering a product search — so we
 * never waste OpenAI tokens on an under-specified query.
 *
 * PHASE 1 STATUS: Placeholder — returns a hardcoded stub object.
 * PHASE 2 TODO:   Replace stub with a lightweight NLP call or a dedicated
 *                 OpenAI function-calling step to extract entities reliably.
 *
 * @param {string} userMessage   - Raw text from the user.
 * @param {object} currentContext - The existing ConversationContext document
 *                                  (or null for the first turn).
 * @returns {object} intent — structured intent object (see schema below).
 */
const analyzeQuery = async (userMessage, currentContext = null) => {
  // TODO (Phase 2): Implement real NLP / function-calling intent extraction.
  //
  // Expected output shape:
  // {
  //   primaryIntent : "search" | "compare" | "recommend" | "budget" | "question"
  //   category      : string | null        e.g. "laptop"
  //   subCategory   : string | null        e.g. "gaming laptop"
  //   budgetMin     : number | null
  //   budgetMax     : number | null
  //   brands        : string[]
  //   features      : string[]             e.g. ["good camera", "long battery"]
  //   useCase       : string | null        e.g. "gaming", "video editing"
  //   recipientType : string | null        e.g. "self", "gift"
  //   urgency       : string | null
  //   missingInfo   : string[]             fields still needed before retrieval
  // }

  const stubIntent = {
    primaryIntent: "search",
    category: null,
    subCategory: null,
    budgetMin: null,
    budgetMax: null,
    brands: [],
    features: [],
    useCase: null,
    recipientType: "self",
    urgency: null,
    missingInfo: [],
  };

  return stubIntent;
};

module.exports = { analyzeQuery };
