/**
 * aiAuth.js — AI-specific authentication and access control middleware.
 *
 * RESPONSIBILITY
 * ──────────────
 * Sits between the base `protect` middleware (which validates the JWT and
 * attaches req.user) and the AI controllers. It adds two additional checks
 * that are specific to the AI endpoints:
 *
 *   1. Feature flag guard — AI features can be toggled off globally via the
 *      AI_ENABLED environment variable (e.g. during maintenance or when the
 *      OpenAI budget is exhausted). Returns 503 when disabled.
 *
 *   2. User-level AI access — a per-user `aiEnabled` flag can block a
 *      specific user from the AI feature (e.g. after abuse detection).
 *      Currently stubbed — all users are allowed in Phase 1.
 *
 * MIDDLEWARE ORDER in aiRoutes.js:
 *   protect → aiAuth → aiRateLimit → controller
 *   (protect must run first so req.user exists when aiAuth reads it)
 *
 * PHASE 1 STATUS: Feature flag check is live. User-level check is a stub.
 * PHASE 2 TODO:   Implement the per-user block check against a Redis set
 *                 or a blockedAI field on the User model.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const aiAuth = (req, res, next) => {
  // ── Check 1: Global feature flag ──────────────────────────────────────────
  // Set AI_ENABLED=false in .env to disable AI for all users instantly.
  const aiEnabled = process.env.AI_ENABLED !== "false";

  if (!aiEnabled) {
    return res.status(503).json({
      message:
        "The AI Shopping Assistant is temporarily unavailable. Please try again later.",
    });
  }

  // ── Check 2: Per-user AI access ───────────────────────────────────────────
  // TODO (Phase 2): Check if this user is blocked from AI features.
  //
  // const isBlocked = await redisClient.sismember("ai:blocked_users", req.user._id.toString());
  // if (isBlocked) {
  //   return res.status(403).json({
  //     message: "Your access to the AI assistant has been restricted. Please contact support.",
  //   });
  // }

  // All checks passed — proceed to the rate limiter
  next();
};

module.exports = { aiAuth };
