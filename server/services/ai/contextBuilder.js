/**
 * contextBuilder.js — Formats retrieved data into an LLM-ready context block.
 *
 * RESPONSIBILITY
 * ──────────────
 * Takes the raw product documents returned by productRetriever and formats
 * them into a compact, structured text block that is injected into the
 * OpenAI system prompt. This layer is purely a formatting concern —
 * no business logic, no database access.
 *
 * WHY THIS LAYER EXISTS
 * ─────────────────────
 * The format of the context block directly impacts:
 *   • Token count (cost)
 *   • How reliably the LLM follows the "only recommend from context" rule
 *   • How much useful information fits inside the context window
 *
 * By centralising all formatting here, we can iterate on the format
 * (e.g. switch from prose to JSON, or add/remove fields) without
 * touching any prompt template or controller.
 *
 * OUTPUT FORMAT GOAL (Phase 2)
 * ────────────────────────────
 * [PRODUCT 1]
 * ID: abc123
 * Name: ASUS ROG Strix G15
 * Price: ₹87,999
 * Category: Laptop | Tags: gaming, high-performance
 * Specs: AMD Ryzen 9, 16GB RAM, RTX 3070, 512GB SSD
 * Rating: 4.7/5 (1,243 reviews) | Stock: Available
 * Pros: Excellent thermals, top GPU, long battery
 * Cons: Heavy at 2.4kg, no USB-C charging
 *
 * USER CONTEXT
 * ────────────
 * Recent purchases: Headphones, Mouse
 * Wishlist categories: Laptops, Monitors
 *
 * PHASE 1 STATUS: Placeholder — returns an empty string.
 * PHASE 2 TODO:   Implement the formatProducts and formatUserContext helpers.
 *
 * @param {object[]} products    - Product documents from productRetriever.
 * @param {object}   userContext - { purchaseHistory, wishlistCategories, recentViews }
 * @returns {string} contextBlock - Formatted string ready for prompt injection.
 */
const buildContext = (products = [], userContext = {}) => {
  // TODO (Phase 2): Implement product and user context formatting.
  //
  // const productBlock = products.map(formatProduct).join("\n\n");
  // const userBlock    = formatUserContext(userContext);
  // return [productBlock, userBlock].filter(Boolean).join("\n\n---\n\n");

  return "";
};

module.exports = { buildContext };
