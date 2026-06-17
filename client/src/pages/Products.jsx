import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Search, Tag, DollarSign, Package, ShoppingCart, Check, Shield, Plus, ClipboardList, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency } from '../utils/currency';

const Products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart, cartCount } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleToggleWishlist = async (productId) => {
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
      }, 2000);
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
    <div className="min-h-screen p-6 md:p-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <main className="max-w-7xl mx-auto z-10 relative">
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            SmartCart
          </Link>
          <div className="flex items-center gap-4">
            {user?.role === 'admin' && (
              <Link 
                to="/admin"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </Link>
            )}
            <Link
              to="/orders"
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-sm transition-colors"
            >
              <ClipboardList className="w-4 h-4" />
              <span>My Orders</span>
            </Link>
            <Link to="/cart" className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
              <ShoppingCart className="w-6 h-6 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Products</span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              Discover our latest collection of premium items. From electronics to fashion, find exactly what you need.
            </p>
          </div>
          
          <div className="relative w-full md:w-72 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-purple-400 transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input pl-11 py-3 bg-white/5 border-white/10 rounded-2xl w-full"
              placeholder="Search products..."
            />
          </div>
        </div>

        {/* Category Filter */}
        {!loading && !error && products.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-4 mb-6 custom-scrollbar">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-300 font-medium text-sm border ${
                  selectedCategory === category
                    ? 'bg-purple-500 text-white border-purple-500 shadow-lg shadow-purple-500/20'
                    : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="glass-panel p-6 text-center text-red-400 border-red-500/20 rounded-2xl">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="glass-panel p-16 text-center rounded-3xl flex flex-col items-center justify-center border-white/10">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 text-white/40" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No products found</h3>
            <p className="text-white/50">Admin needs to add products to the inventory.</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="glass-panel p-16 text-center rounded-3xl flex flex-col items-center justify-center border-white/10">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-white/40" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No results match your search</h3>
            <p className="text-white/50">Try selecting a different category or adjusting your search term.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product._id} 
                className="glass-panel rounded-3xl overflow-hidden group hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(170,59,255,0.1)] flex flex-col h-full"
              >
                <div className="aspect-[4/3] overflow-hidden relative bg-white/5">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Fallback icon if image fails or doesn't exist */}
                    <ShoppingBag className="w-12 h-12 text-white/10 absolute" />
                  </div>
                  <img 
                    src={product.image || "https://placehold.co/600x400/1a1a2e/ffffff?text=No+Image"} 
                    alt={product.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/600x400/1a1a2e/ffffff?text=Image+Not+Found";
                    }}
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-medium border border-white/10 flex items-center gap-1.5 shadow-xl">
                      <Tag className="w-3 h-3 text-purple-400" />
                      {product.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 z-20">
                    <button
                      onClick={() => handleToggleWishlist(product._id)}
                      className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:text-purple-400 hover:border-purple-500/30 transition-all duration-300 shadow-xl cursor-pointer"
                    >
                      <Heart 
                        className={`w-4 h-4 transition-colors duration-300 ${
                          isInWishlist(product._id) 
                            ? 'fill-purple-500 text-purple-500' 
                            : 'text-white/80'
                        }`} 
                      />
                    </button>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-white/60 text-sm mb-6 mt-auto">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="font-medium text-white">{formatCurrency(product.price)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-blue-400" />
                      <span>{product.stock} in stock</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleAddToCart(product._id)}
                    disabled={addingToCart[product._id] === 'adding' || product.stock < 1}
                    className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 border border-white/10 hover:border-transparent transition-all duration-300 font-medium flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingToCart[product._id] === 'adding' ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : addingToCart[product._id] === 'success' ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 group-hover/btn:animate-bounce" />
                        <span>{product.stock < 1 ? 'Out of Stock' : 'Add to Cart'}</span>
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

export default Products;
