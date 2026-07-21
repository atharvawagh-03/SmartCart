/**
 * productRetriever.js — Smart product fetching layer for the RAG pipeline.
 *
 * RESPONSIBILITY
 * ──────────────
 * Translates a structured intent object (from queryAnalyzer) into a
 * MongoDB query, executes it against the Product collection, and returns
 * a ranked list of candidates to pass into the context builder.
 *
 * This is the ONLY layer allowed to query the Product collection for AI
 * purposes. Keeping retrieval here means the ranking logic (weights,
 * filters, limits) lives in one place and can be tuned without touching
 * any controller or prompt code.
 *
 * RETRIEVAL STRATEGY (to be implemented in Phase 2)
 * ──────────────────────────────────────────────────
 * Hard filters  (must match — applied in MongoDB $match):
 *   • category or tags match the intent
 *   • price within budgetMin / budgetMax
 *   • stock > 0
 *
 * Soft scoring  (applied in memory after fetch):
 *   • rating          → 30 %
 *   • salesCount      → 25 %
 *   • popularityScore → 20 %
 *   • tag overlap     → 15 %
 *   • wishlist hit    → 10 %
 *
 * Result cap: maximum 10 products are forwarded to the context builder to
 * avoid inflating the OpenAI prompt with irrelevant tokens.
 *
 * PHASE 1 STATUS: Placeholder — returns an empty array.
 * PHASE 2 TODO:   Build the dynamic aggregation pipeline described above.
 *
 * @param {object} intent         - Structured intent from queryAnalyzer.
 * @param {object} userContext    - { purchaseHistory, wishlist, recentViews }
 * @param {object[]} excludeIds   - Product IDs already shown this session.
 * @returns {object[]} products   - Array of Mongoose Product documents (≤ 10).
 */
const retrieveProducts = async (intent, userContext = {}, excludeIds = []) => {
  // TODO (Phase 2): Implement dynamic MongoDB aggregation + in-memory scoring.
  //
  // Rough implementation outline:
  //
  // const Product = require("../../models/Product");
  //
  // const matchStage = buildMatchStage(intent);        // hard filters
  // const rawProducts = await Product.aggregate([
  //   { $match: matchStage },
  //   { $limit: 30 },                                  // fetch more, rank fewer
  // ]);
  //
  // const scored = scoreProducts(rawProducts, intent, userContext);
  // const filtered = scored.filter(p => !excludeIds.includes(p._id.toString()));
  // return filtered.slice(0, 10);

  return [];
};

module.exports = { retrieveProducts };
