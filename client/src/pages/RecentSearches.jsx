import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Search, X, Trash2 } from 'lucide-react';

const RecentSearches = () => {
  const [searches, setSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [
      { id: 1, query: 'wireless headphones', timestamp: Date.now() - 3600000 },
      { id: 2, query: 'smart watch', timestamp: Date.now() - 7200000 },
      { id: 3, query: 'laptop stand', timestamp: Date.now() - 86400000 },
      { id: 4, query: 'mechanical keyboard', timestamp: Date.now() - 172800000 },
      { id: 5, query: 'USB-C hub', timestamp: Date.now() - 259200000 },
    ];
  });

  const clearAllSearches = () => {
    setSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const removeSearch = (id) => {
    const updated = searches.filter(search => search.id !== id);
    setSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const formatTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="min-h-screen pb-16">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-white/60 hover:text-white transition-colors p-1" aria-label="Back to home">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-tight text-white">SmartCart</span>
              <span className="text-white/30 text-xs">/</span>
              <span className="text-xs font-medium text-white/60">Recent Searches</span>
            </div>
          </div>
          {searches.length > 0 && (
            <button 
              onClick={clearAllSearches}
              className="text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Search History
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Quickly jump back into prior searches.
          </p>
        </div>

        {searches.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl max-w-lg mx-auto space-y-4">
            <Clock className="w-10 h-10 text-white/20 mx-auto" />
            <div>
              <h2 className="text-base font-semibold text-white">No search history</h2>
              <p className="text-xs text-white/50 mt-1">
                Your recent searches will appear here.
              </p>
            </div>
            <Link 
              to="/products"
              className="btn-primary !w-auto inline-flex items-center gap-1.5 px-4 py-2 text-xs"
            >
              <span>Browse Catalog</span>
            </Link>
          </div>
        ) : (
          <div className="glass-panel rounded-xl divide-y divide-border overflow-hidden">
            {searches.map((search) => (
              <div 
                key={search.id}
                className="flex items-center justify-between p-3.5 hover:bg-surface-hover transition-colors group"
              >
                <Link 
                  to="/products"
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <Search className="w-3.5 h-3.5 text-white/40 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                      {search.query}
                    </p>
                    <p className="text-[10px] text-white/40">{formatTime(search.timestamp)}</p>
                  </div>
                </Link>
                <button 
                  onClick={() => removeSearch(search.id)}
                  className="p-1 text-white/30 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Remove search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RecentSearches;
