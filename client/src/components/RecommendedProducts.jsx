import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Tag, DollarSign, Package, Check, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const RecommendedProducts = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const { addToCart } = useCart();
  const { user } = useAuth();

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
    // Also track view when added to cart
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

  const handleTrackView = async (productId) => {
    try {
      await axios.post(`/api/products/${productId}/view`);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-yellow-400" />
        <h2 className="text-2xl font-bold">Recommended for you</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product) => (
          <div 
            key={product._id} 
            className="glass-panel rounded-3xl overflow-hidden group hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(170,59,255,0.1)] flex flex-col h-full"
            onClick={() => handleTrackView(product._id)}
          >
            <div className="aspect-[4/3] overflow-hidden relative bg-white/5 cursor-pointer">
              <div className="absolute inset-0 flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-white/10 absolute" />
              </div>
              <img 
                src={product.image || "https://placehold.co/600x400/1a1a2e/ffffff?text=No+Image"} 
                alt={product.name} 
                className="w-full h-full object-cover relative z-10 transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/600x400/1a1a2e/ffffff?text=Image+Not+Found";
                }}
              />
              <div className="absolute top-3 left-3 z-20">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-medium border border-white/10 flex items-center gap-1 shadow-xl">
                  <Tag className="w-3 h-3 text-purple-400" />
                  {product.category}
                </span>
              </div>
            </div>
            
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
                {product.name}
              </h3>
              
              <div className="flex items-center gap-4 text-white/60 text-xs mb-4 mt-auto">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-green-400" />
                  <span className="font-medium text-white">${product.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="w-3 h-3 text-blue-400" />
                  <span>{product.stock} left</span>
                </div>
              </div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); handleAddToCart(product._id); }}
                disabled={addingToCart[product._id] === 'adding' || product.stock < 1}
                className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 border border-white/10 hover:border-transparent transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
};

export default RecommendedProducts;
