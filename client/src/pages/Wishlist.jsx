import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Trash2, ShoppingCart, Package } from 'lucide-react';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([
    { id: 1, name: 'Wireless Headphones', price: 2999, image: '🎧', inStock: true },
    { id: 2, name: 'Smart Watch', price: 1599, image: '⌚', inStock: true },
    { id: 3, name: 'Laptop Stand', price: 1999, image: '💻', inStock: false },
    { id: 4, name: 'Mechanical Keyboard', price: 4999, image: '⌨️', inStock: true },
  ]);

  const removeFromWishlist = (id) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
  };

  const moveToCart = (id) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
    // In a real app, this would add to cart context
  };

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
                    key={item.id}
                    className="bg-black/20 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{item.image}</div>
                      <button 
                        onClick={() => removeFromWishlist(item.id)}
                        className="p-2 rounded-lg hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4 text-white/60 hover:text-red-400" />
                      </button>
                    </div>
                    
                    <h3 className="text-white font-medium mb-2">{item.name}</h3>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-purple-400">₹{item.price.toLocaleString()}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${item.inStock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    <button
                      onClick={() => moveToCart(item.id)}
                      disabled={!item.inStock}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                        item.inStock 
                          ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                          : 'bg-white/5 text-white/40 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span className="font-medium">Move to Cart</span>
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

export default Wishlist;
