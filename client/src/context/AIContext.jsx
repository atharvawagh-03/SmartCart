import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { sendChatMessage } from '../services/aiService';

const AIContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAI = () => useContext(AIContext);

export const AIProvider = ({ children }) => {
  // Chat panel open/closed state
  const [isOpen, setIsOpen] = useState(false);

  // All messages in the current session: { id, role, content, contentType, structuredData, timestamp }
  const [messages, setMessages] = useState([]);

  // Whether the AI is processing a request
  const [isLoading, setIsLoading] = useState(false);

  // Current session ID (null = no session started yet)
  const [sessionId, setSessionId] = useState(null);

  // Error string shown inside the chat window
  const [error, setError] = useState(null);

  // Track how many unread AI replies there are (shown on the floating button badge)
  const [unreadCount, setUnreadCount] = useState(0);

  // Ref used by ChatWindow to auto-scroll to latest message
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
    setUnreadCount(0);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) setUnreadCount(0); // clear badge on open
      return !prev;
    });
  }, []);

  /**
   * Send a message through the AI pipeline.
   * Adds the user message immediately for instant UI feedback,
   * then awaits the server response before adding the assistant reply.
   */
  const sendMessage = useCallback(async (text, clientContext = {}) => {
    if (!text?.trim() || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      contentType: 'text',
      structuredData: null,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    scrollToBottom();

    try {
      const result = await sendChatMessage(text.trim(), sessionId, clientContext);

      // Persist session ID from first response
      if (result.sessionId && !sessionId) {
        setSessionId(result.sessionId);
      }

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: result.response.message,
        contentType: result.response.responseType || 'text',
        structuredData: {
          products: result.response.products || [],
          followUpSuggestions: result.response.followUpSuggestions || [],
          comparisonTable: result.response.comparisonTable || null,
          budgetPlan: result.response.budgetPlan || null,
          clarificationQuestion: result.response.clarificationQuestion || null,
        },
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Increment unread badge if chat panel is closed
      setIsOpen((currentlyOpen) => {
        if (!currentlyOpen) setUnreadCount((c) => c + 1);
        return currentlyOpen;
      });

      scrollToBottom();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        'Something went wrong. Please try again.';
      setError(errorMsg);

      // Add a visible error bubble in the chat so the user knows
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: errorMsg,
          contentType: 'error',
          structuredData: null,
          timestamp: new Date().toISOString(),
        },
      ]);
      scrollToBottom();
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, sessionId, scrollToBottom]);

  /**
   * Start a completely fresh conversation.
   */
  const clearChat = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    setError(null);
    setUnreadCount(0);
  }, []);

  const value = {
    isOpen,
    messages,
    isLoading,
    sessionId,
    error,
    unreadCount,
    messagesEndRef,
    openChat,
    closeChat,
    toggleChat,
    sendMessage,
    clearChat,
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};
