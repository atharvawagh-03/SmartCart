const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { aiAuth } = require("../middleware/ai/aiAuth");
const { aiRateLimit } = require("../middleware/ai/aiRateLimit");
const { sendMessage } = require("../controllers/ai/chatController");
const { compareProducts } = require("../controllers/ai/compareController");
const { getRecommendations } = require("../controllers/ai/recommendController");
const { planBudget } = require("../controllers/ai/budgetController");
const { getHistory } = require("../controllers/ai/historyController");

const router = express.Router();

/**
 * Shared middleware stack applied to every AI route:
 *
 *   protect     — validates JWT, attaches req.user (from authMiddleware)
 *   aiAuth      — checks AI_ENABLED flag + per-user access control
 *   aiRateLimit — enforces 10 req/min per user (configurable via env)
 *
 * Applied at router level so it cannot be accidentally omitted on a
 * single route. Every controller below is guaranteed to have:
 *   • req.user populated
 *   • AI feature confirmed enabled
 *   • Request within rate limit
 */
router.use(protect, aiAuth, aiRateLimit);

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/ai/chat
// Send a message to the AI shopping assistant.
// Runs the full RAG pipeline: intent → retrieval → context → prompt → OpenAI.
// Body: { message: string, sessionId?: string, context?: object }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/chat", sendMessage);

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/ai/compare
// Generate a structured side-by-side comparison of 2–4 products.
// Body: { productIds: string[], sessionId?: string, userRequirement?: string }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/compare", compareProducts);

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/ai/recommend
// Get personalised product recommendations without a full chat turn.
// Body: { useCase?, budget?, category?, brands?, excludeProductIds?, count? }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/recommend", getRecommendations);

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/ai/budget-planner
// Optimise a full shopping list within a total budget.
// Body: { totalBudget: number, items: string[], priorities?, preferences? }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/budget-planner", planBudget);

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/ai/history
// Fetch past sessions (list) or messages for a specific session.
// Query: { sessionId?: string, page?: number, limit?: number }
// ─────────────────────────────────────────────────────────────────────────────
router.get("/history", getHistory);

module.exports = router;
