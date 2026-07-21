/**
 * @desc    Get personalised product recommendations without a chat turn.
 *          Designed for pre-populated recommendation widgets (homepage,
 *          product pages, email campaigns) that need fast targeted results
 *          without the full conversational flow.
 * @route   POST /api/ai/recommend
 * @access  Private
 *
 * TODO (Phase 2): Implement the recommend service and wire it here.
 *                 The service should:
 *                   1. Combine explicit request params (useCase, budget,
 *                      category) with the user's stored AIPreference profile.
 *                   2. Run productRetriever with the merged intent.
 *                   3. Call OpenAI to generate reasons and pros/cons for
 *                      each recommended product.
 *                   4. Return up to `count` recommendations with full context.
 */
const getRecommendations = async (req, res, next) => {
  try {
    const {
      useCase = "",
      budget = null,
      category = "",
      brands = [],
      excludeProductIds = [],
      count = 5,
    } = req.body;

    // TODO (Phase 2): Replace stub with recommendService.run(...)
    res.status(200).json({
      message: "Personalised recommendations endpoint — coming in Phase 2",
      filters: { useCase, budget, category, brands, count },
      recommendations: [],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendations };
