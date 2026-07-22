import axios from 'axios';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

/**
 * POST /api/ai/chat
 * Send a message and get an AI response.
 */
export const sendChatMessage = async (message, sessionId = null, context = {}) => {
  const { data } = await axios.post(
    '/api/ai/chat',
    { message, sessionId, context },
    getHeaders()
  );
  return data;
};

/**
 * POST /api/ai/compare
 * Compare 2–4 products side by side.
 */
export const compareProducts = async (productIds, sessionId = null, userRequirement = '') => {
  const { data } = await axios.post(
    '/api/ai/compare',
    { productIds, sessionId, userRequirement },
    getHeaders()
  );
  return data;
};

/**
 * POST /api/ai/recommend
 * Get personalised product recommendations.
 */
export const getRecommendations = async (params) => {
  const { data } = await axios.post('/api/ai/recommend', params, getHeaders());
  return data;
};

/**
 * POST /api/ai/budget-planner
 * Optimise a shopping list within a budget.
 */
export const planBudget = async (totalBudget, items, priorities = [], preferences = {}) => {
  const { data } = await axios.post(
    '/api/ai/budget-planner',
    { totalBudget, items, priorities, preferences },
    getHeaders()
  );
  return data;
};

/**
 * GET /api/ai/history
 * Fetch past sessions or messages for a specific session.
 */
export const getChatHistory = async (sessionId = null, page = 1, limit = 20) => {
  const params = { page, limit, ...(sessionId && { sessionId }) };
  const { data } = await axios.get('/api/ai/history', { ...getHeaders(), params });
  return data;
};
