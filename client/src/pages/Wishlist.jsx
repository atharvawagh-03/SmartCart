import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Trash2, ShoppingCart, Package } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

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
        <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
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
              <h1 className="text-3xl font-bold">My Wishlist</h1>
              <span className="text-white/60">{wishlistItems.length} items</span>
            </div>

            {wishlistItems.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Your wishlist is empty</h3>
                <p className="text-white/60 mb-6">Save items you love to your wishlist</p>
                <Link 
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 transition-colors text-white font-medium"
                >
                  <Package className="w-4 h-4" />
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item) => (
                  <div 
                    key={item._id}
                    className="bg-black/20 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-16 h-16 bg-white/5 rounded-xl overflow-hidden flex items-center justify-center border border-white/5">
                          <img 
                            src={item.image || "https://placehold.co/600x400/1a1a2e/ffffff?text=No+Image"} 
                            alt={item.name} 
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://placehold.co/600x400/1a1a2e/ffffff?text=Image+Not+Found";
                            }}
                          />
                        </div>
                        <button 
                          onClick={() => removeFromWishlist(item._id)}
                          className="p-2 rounded-lg hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 text-white/60 hover:text-red-400" />
                        </button>
                      </div>
                      
                      <h3 className="text-white font-medium mb-2 line-clamp-2">{item.name}</h3>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-4 mt-2">
                        <span className="text-xl font-bold text-purple-400">{formatCurrency(item.price)}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${item.stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>

                      <button
                        onClick={() => moveToCart(item._id)}
                        disabled={item.stock < 1 || movingItems[item._id]}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                          item.stock > 0 && !movingItems[item._id]
                            ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                            : 'bg-white/5 text-white/40 cursor-not-allowed'
                        }`}
                      >
                        {movingItems[item._id] ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <ShoppingCart className="w-4 h-4" />
                        )}
                        <span className="font-medium">Move to Cart</span>
                      </button>
                    </div>
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

export default Wishlist;
