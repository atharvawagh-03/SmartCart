/**
 * cacheManager.js — Redis-backed cache helpers for the AI pipeline.
 *
 * RESPONSIBILITY
 * ──────────────
 * Two things are expensive in the AI pipeline: OpenAI API calls and
 * large MongoDB aggregations. This module provides a simple get/set/del
 * interface so any service can cache its output without importing a Redis
 * client directly.
 *
 * CACHE STRATEGY
 * ──────────────
 * AI responses are cached by a key built from:
 *   hash(userId + normalised message + sessionContext snapshot)
 *
 * This means two users asking the exact same question get independent
 * cache entries (personalisation must not bleed across users), but the
 * same user asking the same question twice in quick succession gets an
 * instant cached reply.
 *
 * Default TTL: 5 minutes. Short enough that product availability and
 * prices stay fresh; long enough to absorb rapid follow-up taps.
 *
 * PHASE 1 STATUS: Placeholder — Redis is NOT connected. All functions use
 *                 a plain in-process Map as a development stand-in.
 *                 The interface is identical to the Redis version so no
 *                 call sites need to change when Redis is wired up.
 * PHASE 2 TODO:   npm install ioredis, replace the Map with a real Redis
 *                 client, add cluster support for production.
 */

const crypto = require("crypto");

// In-process fallback store (development only — not shared across processes).
const memoryStore = new Map();

const DEFAULT_TTL_SECONDS = 300; // 5 minutes

/**
 * Build a deterministic cache key from the relevant request parameters.
 *
 * @param {string} userId
 * @param {string} message    - Normalised user message (trimmed, lowercased).
 * @param {object} context    - Relevant context snapshot (intent, budget, etc.)
 * @returns {string} cache key
 */
const buildKey = (userId, message, context = {}) => {
  const raw = `${userId}:${message.trim().toLowerCase()}:${JSON.stringify(context)}`;
  return "ai:cache:" + crypto.createHash("sha256").update(raw).digest("hex");
};

/**
 * Retrieve a cached value. Returns null on miss or expiry.
 *
 * @param {string} key
 * @returns {object|null} parsed cached value or null
 */
const get = async (key) => {
  // TODO (Phase 2): return JSON.parse(await redisClient.get(key));

  const entry = memoryStore.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    memoryStore.delete(key);
    return null;
  }

  return entry.value;
};

/**
 * Store a value in the cache.
 *
 * @param {string} key
 * @param {object} value       - Any JSON-serialisable object.
 * @param {number} ttlSeconds  - Time-to-live in seconds. Defaults to 5 min.
 */
const set = async (key, value, ttlSeconds = DEFAULT_TTL_SECONDS) => {
  // TODO (Phase 2): await redisClient.setex(key, ttlSeconds, JSON.stringify(value));

  memoryStore.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
};

/**
 * Remove a specific cache entry.
 *
 * @param {string} key
 */
const del = async (key) => {
  // TODO (Phase 2): await redisClient.del(key);

  memoryStore.delete(key);
};

/**
 * Remove all AI cache entries for a user.
 * Called when the user's context changes significantly (e.g. new order placed).
 *
 * @param {string} userId
 */
const clearUserCache = async (userId) => {
  // TODO (Phase 2): Use SCAN + DEL with pattern "ai:cache:*userId*" on Redis.

  for (const key of memoryStore.keys()) {
    if (key.includes(userId)) {
      memoryStore.delete(key);
    }
  }
};

module.exports = {
  buildKey,
  get,
  set,
  del,
  clearUserCache,
};
