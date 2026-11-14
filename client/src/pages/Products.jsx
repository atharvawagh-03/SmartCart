import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Search, ShoppingCart, Check, Plus, ClipboardList, Heart, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency } from '../utils/currency';
import ThemeToggle from '../components/ThemeToggle';

const Products = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart, cartCount } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
    }
  }, [location.state]);

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
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-16">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-white/60 hover:text-white transition-colors p-1" aria-label="Back to home">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-tight text-white">SmartCart</span>
              <span className="text-white/30 text-xs">/</span>
              <span className="text-xs font-medium text-white/60">Catalog</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user?.role === 'admin' && (
              <Link 
                to="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-hover text-xs font-medium text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </Link>
            )}
            <Link
              to="/orders"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-white/70 hover:text-white transition-colors"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Orders</span>
            </Link>
            <Link 
              to="/cart" 
              className="relative p-2 text-white/70 hover:text-white transition-colors"
              aria-label="View cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-blue-600 text-white text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* ── Page Intro & Search ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Product Catalog
            </h1>
            <p className="text-sm text-white/60 mt-1">
              Browse our inventory with real-time stock levels.
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input !pl-9"
              placeholder="Search products or categories..."
            />
          </div>
        </div>

        {/* ── Category Filter ── */}
        {!loading && !error && products.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap border ${
                  selectedCategory === category
                    ? 'bg-zinc-900 text-white border-zinc-700 dark:bg-white dark:text-zinc-950 dark:border-white'
                    : 'bg-surface text-white/70 border-border hover:bg-surface-hover hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* ── Product Grid ── */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-6 h-6 border-2 border-border border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="glass-panel p-6 text-center text-sm text-rose-400 rounded-xl">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl space-y-3">
            <ShoppingBag className="w-10 h-10 text-white/20 mx-auto" />
            <h3 className="text-base font-semibold text-white">No products in inventory</h3>
            <p className="text-xs text-white/50">Products added via admin panel will appear here.</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl space-y-3">
            <Search className="w-8 h-8 text-white/20 mx-auto" />
            <h3 className="text-base font-semibold text-white">No products found</h3>
            <p className="text-xs text-white/50">Try checking for typos or clear your current filters.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="btn-primary !w-auto inline-flex px-4 py-1.5 text-xs mt-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const isWishlisted = isInWishlist(product._id);
              const isAdding = addingToCart[product._id] === 'adding';
              const isSuccess = addingToCart[product._id] === 'success';

              return (
                <div 
                  key={product._id} 
                  className="glass-panel rounded-xl overflow-hidden flex flex-col h-full hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors"
                >
                  <div className="aspect-[4/3] overflow-hidden relative bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border-b border-border">
                    <img 
                      src={product.image || "https://placehold.co/600x400/18181b/ffffff?text=Product"} 
                      alt={product.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain p-4 transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x400/18181b/ffffff?text=Image+Unavailable";
                      }}
                    />
                    
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-black/70 text-white/90 backdrop-blur-sm border border-white/10">
                        {product.category}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleWishlist(product._id)}
                      className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-md bg-black/60 text-white/80 hover:text-white border border-white/10 backdrop-blur-sm transition-colors"
                      aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
                    >
                      <Heart 
                        className={`w-3.5 h-3.5 transition-colors ${
                          isWishlisted 
                            ? 'fill-rose-500 text-rose-500' 
                            : 'text-white/70 hover:text-white'
                        }`} 
                      />
                    </button>
                  </div>
                  
                  <div className="p-4 flex flex-col flex-grow justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-white line-clamp-1 leading-snug">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-semibold text-white tabular-nums">
                          {formatCurrency(product.price)}
                        </span>
                        <span className="text-white/50 text-[11px] tabular-nums">
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleAddToCart(product._id)}
                      disabled={isAdding || product.stock < 1}
                      className="w-full py-2 px-3 rounded-lg border border-border bg-surface hover:bg-surface-hover text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isAdding ? (
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : isSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Added to cart</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 text-white/70" />
                          <span>{product.stock < 1 ? 'Out of Stock' : 'Add to Cart'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
