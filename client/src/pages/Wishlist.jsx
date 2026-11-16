import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Trash2, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { DEFAULT_PRODUCT_IMAGE, handleImageError } from '../utils/imageFallback';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';

const Wishlist = () => {
  const { wishlist, loading: wishlistLoading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [movingItems, setMovingItems] = useState({});

  const moveToCart = async (productId) => {
    setMovingItems(prev => ({ ...prev, [productId]: true }));
    const success = await addToCart(productId, 1);
    if (success) {
      await removeFromWishlist(productId);
    }
    setMovingItems(prev => ({ ...prev, [productId]: false }));
  };

  const wishlistItems = wishlist?.products || [];

  if (wishlistLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-border border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-white/60 hover:text-white transition-colors p-1" aria-label="Back to home">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-tight text-white">SmartCart</span>
              <span className="text-white/30 text-xs">/</span>
              <span className="text-xs font-medium text-white/60">Wishlist</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/50">{wishlistItems.length} saved</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Saved Items
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Products saved for future purchases.
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl max-w-lg mx-auto space-y-4">
            <Heart className="w-10 h-10 text-white/20 mx-auto" />
            <div>
              <h2 className="text-base font-semibold text-white">Your wishlist is empty</h2>
              <p className="text-xs text-white/50 mt-1">
                Save items from the catalog to keep track of them.
              </p>
            </div>
            <Link 
              to="/products"
              className="btn-primary !w-auto inline-flex items-center gap-1.5 px-4 py-2 text-xs"
            >
              <span>Explore Catalog</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlistItems.map((item) => (
              <div 
                key={item._id}
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-colors"
              >
                <div>
                  <div className="aspect-[4/3] bg-slate-50 dark:bg-zinc-950 border-b border-slate-100 dark:border-zinc-800/80 relative flex items-center justify-center">
                    <img 
                      src={item.image || DEFAULT_PRODUCT_IMAGE} 
                      alt={item.name} 
                      className="w-full h-full object-contain p-4"
                      onError={handleImageError}
                    />
                    <button 
                      onClick={() => removeFromWishlist(item._id)}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-white/95 dark:bg-black/75 text-slate-500 dark:text-white/70 hover:text-rose-500 border border-slate-200 dark:border-white/10 shadow-xs backdrop-blur-xs transition-colors cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="p-4 space-y-1">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">{item.name}</h3>
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                        {formatCurrency(item.price)}
                      </span>
                      <span className={`text-[11px] font-medium ${item.stock > 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-rose-500 dark:text-rose-400'}`}>
                        {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 pt-0">
                  <button
                    onClick={() => moveToCart(item._id)}
                    disabled={item.stock < 1 || movingItems[item._id]}
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-zinc-700/80 bg-slate-50 hover:bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-750 dark:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {movingItems[item._id] ? (
                      <div className="w-3.5 h-3.5 border-2 border-slate-400 dark:border-white/30 border-t-slate-800 dark:border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                        <span>Move to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
