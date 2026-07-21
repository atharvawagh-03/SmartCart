const conversationManager = require("../../services/ai/conversationManager");

/**
 * @desc    Fetch the authenticated user's chat sessions and messages.
 *          Without a sessionId: returns a paginated list of past sessions
 *          (shown in the chat history sidebar).
 *          With a sessionId: returns the full message thread for that session.
 * @route   GET /api/ai/history
 * @access  Private
 *
 * Query params:
 *   sessionId  {string}  — Optional. Fetch messages for a specific session.
 *   page       {number}  — Page number for session list pagination (default 1).
 *   limit      {number}  — Items per page (default 20, max 50).
 *
 * TODO (Phase 2): Implement the full paginated DB queries in conversationManager
 *                 and replace the stub responses below.
 */
const getHistory = async (req, res, next) => {
  try {
    const { sessionId = null, page = 1, limit = 20 } = req.query;
    const userId = req.user._id.toString();

    const parsedPage  = Math.max(1, parseInt(page, 10)  || 1);
    const parsedLimit = Math.min(50, parseInt(limit, 10) || 20);

    if (sessionId) {
      // Return messages for a specific session
      // TODO (Phase 2): replace stub with real DB query
      const messages = await conversationManager.getHistory(sessionId, parsedLimit);

      return res.status(200).json({
        sessionId,
        messages,
        pagination: {
          page: parsedPage,
          limit: parsedLimit,
          total: messages.length,
        },
      });
    }

    // Return paginated list of sessions for this user
    // TODO (Phase 2): implement ChatSession.find({ userId }) with pagination
    res.status(200).json({
      sessions: [],
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHistory };
