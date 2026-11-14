import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Trash2, MessageSquare } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

const STARTER_PROMPTS = [
  'I need a gaming laptop under ₹80,000',
  'Suggest the best noise-cancelling headphones',
  'Build a work-from-home desk setup for ₹60,000',
  'Compare high-rated smartphones in my budget',
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
    <div className="flex flex-col h-full bg-zinc-950 text-white">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-zinc-800 text-white flex items-center justify-center border border-zinc-700">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white leading-none">Shopping Concierge</p>
            <p className="text-[10px] text-zinc-400 leading-none mt-0.5">
              {isLoading ? 'Searching inventory…' : 'Product advisory'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              title="Clear conversation"
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-850 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={closeChat}
            title="Close"
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-850 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Messages area ──────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3 custom-scrollbar">

        {/* Empty state — welcome note + starter prompts */}
        {isEmpty && (
          <div className="px-3.5 space-y-3">
            <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-3 space-y-1.5 text-center">
              <p className="text-xs font-medium text-white">
                How can I assist your shopping today?
              </p>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Ask about specific models, budget allocations, specs comparisons, or current inventory availability.
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider px-0.5">
                Quick Inquiries
              </p>
              {STARTER_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleStarterPrompt(prompt)}
                  className="w-full text-left text-xs px-3 py-2 rounded-lg border border-zinc-800
                             bg-zinc-900 hover:bg-zinc-850 hover:border-zinc-700
                             text-zinc-300 hover:text-white transition-colors"
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
      <div className="px-3 py-2.5 border-t border-zinc-800 shrink-0 bg-zinc-900/50">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about products or budget…"
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none bg-zinc-900 border border-zinc-800 rounded-lg
                       px-3 py-2 text-xs text-white placeholder-zinc-500
                       focus:outline-none focus:border-blue-500
                       disabled:opacity-50 transition-colors leading-snug max-h-24 overflow-y-auto"
            style={{ fieldSizing: 'content' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500
                       flex items-center justify-center shrink-0
                       transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
