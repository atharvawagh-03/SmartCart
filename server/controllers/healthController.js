/**
 * @desc    Get server health status
 * @route   GET /api/health
 * @access  Public
 */
const getHealthStatus = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is up and running"
  });
};

module.exports = {
  getHealthStatus
};
