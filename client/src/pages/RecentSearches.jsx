import { useState, useEffect } from 'react';
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
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Home</span>
        </Link>

        <div className="glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Recent Searches</h1>
              {searches.length > 0 && (
                <button 
                  onClick={clearAllSearches}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 transition-colors text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Clear All</span>
                </button>
              )}
            </div>

            {searches.length === 0 ? (
              <div className="text-center py-16">
                <Clock className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No recent searches</h3>
                <p className="text-white/60 mb-6">Your search history will appear here</p>
                <Link 
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 transition-colors text-white font-medium"
                >
                  <Search className="w-4 h-4" />
                  Start Searching
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {searches.map((search) => (
                  <div 
                    key={search.id}
                    className="flex items-center justify-between p-4 bg-black/20 border border-white/10 rounded-xl hover:border-white/20 transition-colors group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <Clock className="w-5 h-5 text-white/40" />
                      <div className="flex-1">
                        <Link 
                          to="/products"
                          className="text-white font-medium hover:text-purple-400 transition-colors"
                        >
                          {search.query}
                        </Link>
                        <p className="text-white/50 text-sm">{formatTime(search.timestamp)}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeSearch(search.id)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4 text-white/60 hover:text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentSearches;
