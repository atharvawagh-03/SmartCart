import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Check, Heart, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency } from '../utils/currency';
import { Link, useNavigate } from 'react-router-dom';

const RecommendedProducts = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleToggleWishlist = async (productId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const config = user?.token ? {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        } : {};
        
        const response = await axios.get('/api/recommendations', config);
        setRecommendations(response.data);
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  const handleAddToCart = async (productId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await axios.post(`/api/products/${productId}/view`);
    } catch (e) {
      console.error(e);
    }

    setAddingToCart(prev => ({ ...prev, [productId]: 'adding' }));
    const success = await addToCart(productId, 1);
    
    if (success) {
      setAddingToCart(prev => ({ ...prev, [productId]: 'success' }));
      setTimeout(() => {
        setAddingToCart(prev => ({ ...prev, [productId]: null }));
      }, 1800);
    } else {
      setAddingToCart(prev => ({ ...prev, [productId]: null }));
    }
  };

  const handleTrackView = async (productId) => {
    try {
      await axios.post(`/api/products/${productId}/view`);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-5 h-5 border-2 border-border border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">Curated For You</h2>
          <p className="text-xs text-slate-500 dark:text-white/50">Recommendations aligned with your browsing</p>
        </div>
        <Link 
          to="/products"
          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 transition-colors"
        >
          <span>View all products</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.map((product) => {
          const isWishlisted = isInWishlist(product._id);
          const isAdding = addingToCart[product._id] === 'adding';
          const isSuccess = addingToCart[product._id] === 'success';

          return (
            <div 
              key={product._id} 
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col h-full shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-colors"
              onClick={() => handleTrackView(product._id)}
            >
              {/* Product Image Stage */}
              <div className="aspect-[4/3] overflow-hidden relative bg-slate-50 dark:bg-zinc-950 flex items-center justify-center border-b border-slate-100 dark:border-zinc-800/80">
                <img 
                  src={product.image || "https://placehold.co/600x400/f8fafc/64748b?text=Product"} 
                  alt={product.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain p-4 transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/600x400/f8fafc/64748b?text=Image+Unavailable";
                  }}
                />
                
                {/* Category tag */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/95 dark:bg-black/75 text-slate-700 dark:text-white/90 border border-slate-200 dark:border-white/10 shadow-xs backdrop-blur-xs">
                    {product.category}
                  </span>
                </div>

                {/* Wishlist toggle */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleToggleWishlist(product._id); }}
                  className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-md bg-white/95 dark:bg-black/75 text-slate-600 dark:text-white/80 hover:text-rose-500 dark:hover:text-rose-400 border border-slate-200 dark:border-white/10 shadow-xs backdrop-blur-xs transition-colors cursor-pointer"
                  aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
                >
                  <Heart 
                    className={`w-3.5 h-3.5 transition-colors ${
                      isWishlisted 
                        ? 'fill-rose-500 text-rose-500' 
                        : 'text-slate-500 dark:text-white/70 hover:text-rose-500'
                    }`} 
                  />
                </button>
              </div>
              
              {/* Content info */}
              <div className="p-4 flex flex-col flex-grow justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1 leading-snug">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-slate-500 dark:text-zinc-400 text-[11px] tabular-nums">
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); handleAddToCart(product._id); }}
                  disabled={isAdding || product.stock < 1}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-zinc-700/80 bg-slate-50 hover:bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-750 dark:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isAdding ? (
                    <div className="w-3.5 h-3.5 border-2 border-slate-400 dark:border-white/30 border-t-slate-800 dark:border-t-white rounded-full animate-spin" />
                  ) : isSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
                      <span>Added to cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                      <span>{product.stock < 1 ? 'Out of Stock' : 'Add to Cart'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RecommendedProducts;
