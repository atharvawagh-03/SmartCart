const ragPipeline = require("../../services/ai/ragPipeline");

/**
 * @desc    Send a message to the AI shopping assistant.
 *          Runs the full RAG pipeline: intent analysis → product retrieval
 *          → context building → prompt → OpenAI → parse → persist.
 * @route   POST /api/ai/chat
 * @access  Private (requires valid JWT via protect middleware)
 */
const sendMessage = async (req, res, next) => {
  try {
    const { message, sessionId = null, context: clientContext = {} } = req.body;

    if (!message || !message.trim()) {
      res.status(400);
      throw new Error("Message is required");
    }

    const result = await ragPipeline.run({
      userMessage: message.trim(),
      userId: req.user._id.toString(),
      sessionId,
      clientContext,
    });

    res.status(200).json({
      sessionId: result.sessionId,
      response: result.response,
      tokensUsed: result.tokensUsed,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage };
