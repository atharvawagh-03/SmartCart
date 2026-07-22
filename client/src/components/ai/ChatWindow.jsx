import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Trash2, Sparkles, Bot } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

/* Suggested opening prompts shown on an empty chat */
const STARTER_PROMPTS = [
  'I need a gaming laptop under ₹80,000',
  'Suggest the best wireless headphones',
  'I have ₹60,000 — build a full work-from-home setup',
  'Compare the top 2 smartphones in my budget',
];

const ChatWindow = () => {
  const { messages, isLoading, sendMessage, clearChat, closeChat, messagesEndRef } = useAI();
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  /* Focus the input whenever the window becomes visible */
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(timer);
  }, []);

  /* Auto-scroll on new messages */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, messagesEndRef]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');
    sendMessage(text);
  }, [input, isLoading, sendMessage]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStarterPrompt = (prompt) => {
    sendMessage(prompt);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600
                          flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-none">AI Shopping Assistant</p>
            <p className="text-[10px] text-purple-400 leading-none mt-0.5">
              {isLoading ? 'Thinking…' : 'Online · Ready to help'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              title="Clear conversation"
              className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={closeChat}
            title="Close"
            className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Messages area ──────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">

        {/* Empty state — welcome card + starter prompts */}
        {isEmpty && (
          <div className="px-4 space-y-4">
            {/* Welcome card */}
            <div className="rounded-2xl bg-gradient-to-br from-purple-500/15 to-blue-500/10
                            border border-purple-500/20 p-4 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600
                              flex items-center justify-center mx-auto shadow-lg shadow-purple-500/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-semibold text-white">
                Hi! I'm your AI Shopping Assistant
              </p>
              <p className="text-xs text-white/60 leading-relaxed">
                Tell me what you're looking for and I'll find the best products, compare options,
                and help you stay within budget.
              </p>
            </div>

            {/* Starter prompt chips */}
            <div className="space-y-1.5">
              <p className="text-[10px] text-white/40 uppercase tracking-widest px-1">
                Try asking
              </p>
              {STARTER_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleStarterPrompt(prompt)}
                  className="w-full text-left text-xs px-3 py-2.5 rounded-xl border border-white/10
                             bg-white/5 hover:bg-white/10 hover:border-purple-500/40
                             text-white/70 hover:text-white transition-all duration-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Rendered messages */}
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onFollowUp={sendMessage}
          />
        ))}

        {/* Typing indicator */}
        {isLoading && <TypingIndicator />}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input bar ──────────────────────────────────────────────────── */}
      <div className="px-3 py-3 border-t border-white/10 shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about products, compare, or plan a budget…"
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none bg-white/8 border border-white/15 rounded-xl
                       px-3.5 py-2.5 text-sm text-white placeholder-white/35
                       focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                       disabled:opacity-50 transition-all duration-200 leading-snug max-h-28 overflow-y-auto"
            style={{ fieldSizing: 'content' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700
                       flex items-center justify-center shrink-0
                       hover:from-purple-500 hover:to-purple-600 transition-all duration-200
                       disabled:opacity-40 disabled:cursor-not-allowed
                       shadow-md shadow-purple-500/30"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-[10px] text-white/25 text-center mt-2">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;
