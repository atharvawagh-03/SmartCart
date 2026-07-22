import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Bot, X } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { useAuth } from '../../context/AuthContext';
import ChatWindow from './ChatWindow';

const AIAssistant = () => {
  const { user } = useAuth();
  const { isOpen, toggleChat, unreadCount } = useAI();
  const panelRef = useRef(null);

  /* Close panel on Escape key */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isOpen) toggleChat();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, toggleChat]);

  /* Close panel when clicking the backdrop on mobile */
  const handleBackdropClick = (e) => {
    if (panelRef.current && !panelRef.current.contains(e.target)) {
      toggleChat();
    }
  };

  /* Only render for authenticated users */
  if (!user) return null;

  return createPortal(
    <>
      {/* ── Mobile backdrop ──────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[299] bg-black/40 backdrop-blur-sm sm:hidden"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      {/* ── Chat panel ───────────────────────────────────────────────── */}
      <div
        ref={panelRef}
        className={[
          /* positioning */
          'fixed z-[300]',
          'bottom-20 right-4',
          'sm:bottom-20 sm:right-6',
          /* sizing */
          'w-[calc(100vw-2rem)] max-w-sm',
          'h-[70vh] max-h-[600px] min-h-[400px]',
          /* glass panel — matches the rest of the app */
          'bg-gray-900/95 backdrop-blur-2xl',
          'border border-white/10',
          'rounded-2xl shadow-2xl shadow-black/50',
          'overflow-hidden',
          /* open/close transition */
          'transition-all duration-300 ease-out origin-bottom-right',
          isOpen
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none',
        ].join(' ')}
        role="dialog"
        aria-label="AI Shopping Assistant"
        aria-modal="true"
      >
        <ChatWindow />
      </div>

      {/* ── Floating trigger button ───────────────────────────────────── */}
      <button
        onClick={toggleChat}
        aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
        className={[
          'fixed z-[301]',
          'bottom-4 right-4 sm:bottom-6 sm:right-6',
          'w-13 h-13',
          'rounded-full',
          'bg-gradient-to-br from-purple-600 to-blue-600',
          'flex items-center justify-center',
          'shadow-xl shadow-purple-500/40',
          'hover:shadow-2xl hover:shadow-purple-500/60',
          'hover:scale-110 active:scale-95',
          'transition-all duration-200',
        ].join(' ')}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}

        {/* Unread badge */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500
                           text-white text-[10px] font-bold flex items-center justify-center
                           ring-2 ring-gray-900 animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}

        {/* Pulse ring — shown only when closed and no unread */}
        {!isOpen && unreadCount === 0 && (
          <span className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping" />
        )}
      </button>
    </>,
    document.body
  );
};

export default AIAssistant;
