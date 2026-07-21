/**
 * @desc    Generate a structured side-by-side comparison of 2–4 products.
 *          Fetches product data from the DB, builds a comparison table, and
 *          sends it to OpenAI to produce a summary and winner declaration.
 * @route   POST /api/ai/compare
 * @access  Private
 *
 * TODO (Phase 2): Implement the compare service and wire it here.
 *                 The service should:
 *                   1. Validate all productIds exist in the DB.
 *                   2. Fetch full product documents.
 *                   3. Build a feature matrix from product specs.
 *                   4. Call OpenAI to score each product per feature
 *                      in the context of userRequirement.
 *                   5. Return a comparisonTable + summary + winner object.
 */
const compareProducts = async (req, res, next) => {
  try {
    const { productIds, sessionId = null, userRequirement = "" } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length < 2) {
      res.status(400);
      throw new Error("Provide at least 2 productIds to compare");
    }

    if (productIds.length > 4) {
      res.status(400);
      throw new Error("Cannot compare more than 4 products at once");
    }

    // TODO (Phase 2): Replace stub with compareService.run(...)
    res.status(200).json({
      message: "Product comparison endpoint — coming in Phase 2",
      productIds,
      userRequirement,
      comparisonTable: null,
      summary: null,
      recommendation: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { compareProducts };
