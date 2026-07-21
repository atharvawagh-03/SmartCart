/**
 * @desc    Optimise a full shopping list within a given budget.
 *          The user provides a total budget and a list of item categories
 *          they need. The AI allocates budget proportionally, finds the
 *          best product for each slot, and returns a complete shopping plan.
 *
 *          Example: ₹80,000 budget for [laptop, mouse, keyboard, headphones]
 *            → Laptop  ₹65,000 + Mouse ₹2,500 + Keyboard ₹5,000 + HP ₹6,000
 *
 * @route   POST /api/ai/budget-planner
 * @access  Private
 *
 * TODO (Phase 2): Implement the budget planner service and wire it here.
 *                 The service should:
 *                   1. Allocate budget across items using a priority-weighted
 *                      split (priority items get the largest slice).
 *                   2. Call productRetriever once per item with its budget slice.
 *                   3. Call OpenAI to confirm the plan and generate savings tips.
 *                   4. Return a BudgetPlan object with per-item breakdowns.
 */
const planBudget = async (req, res, next) => {
  try {
    const {
      totalBudget,
      items = [],
      priorities = [],
      preferences = {},
      sessionId = null,
    } = req.body;

    if (!totalBudget || typeof totalBudget !== "number" || totalBudget <= 0) {
      res.status(400);
      throw new Error("A valid totalBudget (positive number) is required");
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400);
      throw new Error("Provide at least one item in the items array");
    }

    // TODO (Phase 2): Replace stub with budgetPlannerService.run(...)
    res.status(200).json({
      message: "Budget planner endpoint — coming in Phase 2",
      totalBudget,
      items,
      priorities,
      plan: null,
      summary: null,
      savingsTips: [],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { planBudget };
