/**
 * aiRateLimit.js — Per-user rate limiting for AI endpoints.
 *
 * RESPONSIBILITY
 * ──────────────
 * AI endpoints are significantly more expensive than regular API calls —
 * each request can cost several cents in OpenAI tokens. Without rate
 * limiting, a single misbehaving client or a runaway frontend loop can
 * exhaust the monthly OpenAI budget in minutes.
 *
 * This middleware enforces a sliding-window limit per authenticated user.
 * It is applied at the router level in aiRoutes.js so ALL /api/ai/*
 * endpoints are protected with a single middleware registration.
 *
 * LIMITS (configurable via environment variables)
 * ────────────────────────────────────────────────
 *   AI_RATE_LIMIT_WINDOW_MS   default: 60_000  (1 minute window)
 *   AI_RATE_LIMIT_MAX         default: 10      (10 requests per window)
 *
 * These are intentionally conservative. Adjust upward in production once
 * real usage patterns are known.
 *
 * RESPONSE when limit is exceeded:
 *   HTTP 429 Too Many Requests
 *   { message: "Too many requests...", retryAfter: <seconds> }
 *
 * PHASE 1 STATUS: Fully implemented using an in-process Map store.
 *                 Works correctly for single-instance deployments.
 * PHASE 2 TODO:   Replace the in-process store with a Redis-backed store
 *                 (e.g. express-rate-limit + rate-limit-redis) so limits
 *                 are enforced correctly across multiple server instances.
 */

const WINDOW_MS = parseInt(process.env.AI_RATE_LIMIT_WINDOW_MS, 10) || 60_000;
const MAX_REQUESTS = parseInt(process.env.AI_RATE_LIMIT_MAX, 10) || 10;

// In-process store: userId → { count, windowStart }
// PHASE 2: replace with Redis store for multi-instance support.
const requestStore = new Map();

/**
 * Clean up expired window entries to prevent unbounded Map growth.
 * Runs every 5 minutes.
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of requestStore.entries()) {
    if (now - record.windowStart >= WINDOW_MS) {
      requestStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Express middleware — enforces per-user AI request rate limit.
 * Must be used AFTER the `protect` auth middleware so req.user is available.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const aiRateLimit = (req, res, next) => {
  // req.user is guaranteed by the protect middleware that runs before this
  const userId = req.user._id.toString();
  const now = Date.now();

  const record = requestStore.get(userId);

  // No record yet, or the window has expired — start a fresh window
  if (!record || now - record.windowStart >= WINDOW_MS) {
    requestStore.set(userId, { count: 1, windowStart: now });
    return next();
  }

  // Within the window — check the count
  if (record.count >= MAX_REQUESTS) {
    const windowExpiresIn = Math.ceil((WINDOW_MS - (now - record.windowStart)) / 1000);

    return res.status(429).json({
      message: `Too many requests to the AI assistant. Please wait ${windowExpiresIn} seconds before trying again.`,
      retryAfter: windowExpiresIn,
    });
  }

  // Increment and proceed
  record.count += 1;
  next();
};

module.exports = { aiRateLimit };
