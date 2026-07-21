/**
 * sanitizer.js — Input sanitisation for all AI endpoints.
 *
 * RESPONSIBILITY
 * ──────────────
 * Validates and cleans user-supplied text before it enters the pipeline.
 * This module is the first line of defence against:
 *
 *   1. Prompt injection — attempts to override the system prompt by
 *      embedding instructions like "Ignore previous instructions and..."
 *      inside a normal-looking shopping query.
 *
 *   2. Junk input — empty strings, excessively long messages (token
 *      bomb attacks), or messages containing only whitespace/symbols.
 *
 *   3. XSS / code injection — HTML tags or script content that could
 *      be stored in ChatMessage.content and later rendered in the UI.
 *
 * SANITISATION STEPS (in order)
 * ──────────────────────────────
 *   1. Type check — must be a non-empty string.
 *   2. Trim whitespace.
 *   3. Length check — reject messages > MAX_LENGTH characters.
 *   4. Strip HTML tags.
 *   5. Soft prompt-injection scan — flag suspicious patterns.
 *      (We warn rather than hard-block to avoid false positives on
 *       legitimate queries like "ignore the price and show best quality".)
 *
 * PHASE 1 STATUS: Fully implemented — no external dependencies needed.
 *                 These pure string operations are production-ready as-is.
 * PHASE 2 TODO:   Add a more sophisticated injection classifier if needed.
 */

const MAX_MESSAGE_LENGTH = 1000; // characters — ~250 tokens, enough for any shopping query

// Patterns that commonly appear in prompt injection attempts.
// Checked case-insensitively against the full message.
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|above|prior)\s+instructions/i,
  /you\s+are\s+now\s+a/i,
  /forget\s+(everything|all|your)\s+(you|instructions|rules)/i,
  /act\s+as\s+(if\s+you\s+are|a)\s+/i,
  /do\s+not\s+follow\s+(your|the)\s+(rules|instructions|guidelines)/i,
  /system\s*:\s*you\s+are/i,
  /<\s*script/i,
];

/**
 * Sanitise a raw user message for safe use in the AI pipeline.
 *
 * @param {string} message - Raw input from req.body.message.
 * @returns {{ safe: boolean, sanitized: string, warning: string|null }}
 *
 *   safe       — false if the message should be rejected outright.
 *   sanitized  — the cleaned string to use downstream.
 *   warning    — non-null if a soft injection pattern was detected
 *                (log it but still process the request).
 */
const sanitizeMessage = (message) => {
  // Step 1: Type check
  if (typeof message !== "string" || message.trim().length === 0) {
    return {
      safe: false,
      sanitized: "",
      warning: null,
      error: "Message must be a non-empty string",
    };
  }

  // Step 2: Trim
  let sanitized = message.trim();

  // Step 3: Length check
  if (sanitized.length > MAX_MESSAGE_LENGTH) {
    return {
      safe: false,
      sanitized: "",
      warning: null,
      error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`,
    };
  }

  // Step 4: Strip HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, "");

  // Step 5: Soft injection scan
  let warning = null;
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(sanitized)) {
      warning = `Possible prompt injection detected: "${sanitized.substring(0, 80)}..."`;
      // Do not hard-block — log the warning and let the hardened system
      // prompt handle the attempt gracefully.
      break;
    }
  }

  return { safe: true, sanitized, warning, error: null };
};

/**
 * Sanitise a numeric budget value from request body.
 * Coerces strings like "₹50,000" to the number 50000.
 *
 * @param {any} value - Raw budget input.
 * @returns {{ valid: boolean, value: number|null }}
 */
const sanitizeBudget = (value) => {
  if (value === null || value === undefined) {
    return { valid: true, value: null }; // budget is optional
  }

  // Strip currency symbols and commas before parsing
  const cleaned = String(value).replace(/[₹$€£,\s]/g, "");
  const parsed = parseFloat(cleaned);

  if (isNaN(parsed) || parsed < 0) {
    return { valid: false, value: null };
  }

  return { valid: true, value: Math.round(parsed) };
};

/**
 * Sanitise an array of product IDs from request body.
 * Filters out anything that is not a valid 24-character hex string
 * (MongoDB ObjectId format).
 *
 * @param {any[]} ids - Raw array from req.body.
 * @returns {string[]} array of valid ObjectId strings
 */
const sanitizeProductIds = (ids) => {
  if (!Array.isArray(ids)) return [];
  const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;
  return ids.filter((id) => typeof id === "string" && OBJECT_ID_REGEX.test(id));
};

module.exports = {
  sanitizeMessage,
  sanitizeBudget,
  sanitizeProductIds,
  MAX_MESSAGE_LENGTH,
};
