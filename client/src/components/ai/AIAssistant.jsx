import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MessageSquare, X } from 'lucide-react';
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
          className="fixed inset-0 z-[299] bg-black/50 backdrop-blur-xs sm:hidden"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      {/* ── Chat panel ───────────────────────────────────────────────── */}
      <div
        ref={panelRef}
        className={[
          'fixed z-[300]',
          'bottom-20 right-4',
          'sm:bottom-20 sm:right-6',
          'w-[calc(100vw-2rem)] max-w-sm',
          'h-[70vh] max-h-[580px] min-h-[400px]',
          'bg-zinc-950 border border-zinc-800',
          'rounded-xl shadow-2xl',
          'overflow-hidden',
          'transition-all duration-200 ease-out origin-bottom-right',
          isOpen
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none',
        ].join(' ')}
        role="dialog"
        aria-label="Shopping Concierge"
        aria-modal="true"
      >
        <ChatWindow />
      </div>

      {/* ── Floating trigger button ───────────────────────────────────── */}
      <button
        onClick={toggleChat}
        aria-label={isOpen ? 'Close Shopping Concierge' : 'Open Shopping Concierge'}
        className={[
          'fixed z-[301]',
          'bottom-4 right-4 sm:bottom-6 sm:right-6',
          'w-11 h-11',
          'rounded-full',
          'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950',
          'border border-zinc-700/50 dark:border-zinc-300',
          'flex items-center justify-center',
          'shadow-lg shadow-black/20',
          'hover:opacity-90 active:scale-95',
          'transition-all duration-150',
        ].join(' ')}
      >
        {isOpen ? (
          <X className="w-4 h-4" />
        ) : (
          <MessageSquare className="w-4 h-4" />
        )}

        {/* Unread badge */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600
                           text-white text-[9px] font-bold flex items-center justify-center
                           ring-2 ring-zinc-950">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </>,
    document.body
  );
};

export default AIAssistant;
