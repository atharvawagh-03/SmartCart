import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const isCartEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <div className="min-h-screen p-6 md:p-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[10%] right-[-5%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <main className="max-w-5xl mx-auto z-10 relative">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/products" className="text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Cart</span>
          </h1>
        </div>

        {isCartEmpty ? (
          <div className="glass-panel p-16 text-center rounded-3xl flex flex-col items-center justify-center border-white/10 mt-10">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-white/40" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Your cart is empty</h3>
            <p className="text-white/50 mb-8 max-w-md">Looks like you haven't added any products to your cart yet. Discover our latest items!</p>
            <Link to="/products" className="btn-primary inline-flex items-center gap-2 max-w-xs justify-center">
              <span>Start Shopping</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-2 px-2">
                <span className="text-white/60 font-medium">{cartCount} items</span>
                <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-300 transition-colors">
                  Clear Cart
                </button>
              </div>
              
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item._id || item.product._id} className="glass-panel p-4 md:p-6 rounded-3xl flex flex-col sm:flex-row items-center gap-6 group hover:border-purple-500/30 transition-all duration-300">
                    <div className="w-full sm:w-28 h-28 rounded-2xl overflow-hidden bg-white/5 flex-shrink-0 relative">
                      {item.product.image ? (
                        <img src={item.product.image} alt={item.product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-white/20" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-grow flex flex-col sm:flex-row justify-between w-full gap-4 sm:gap-0">
                      <div>
                        <h3 className="text-lg font-semibold mb-1 group-hover:text-purple-400 transition-colors">
                          {item.product.name}
                        </h3>
                        <p className="text-white/50 text-sm mb-3">{item.product.category}</p>
                        <p className="font-medium text-lg text-white">
                          {formatCurrency(item.product.price)}
                        </p>
                      </div>
                      
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4">
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-1">
                          <button 
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-white/70 transition-colors disabled:opacity-50"
                            disabled={loading}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-6 text-center font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-white/70 transition-colors disabled:opacity-50"
                            disabled={loading || item.quantity >= item.product.stock}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.product._id)}
                          className="text-red-400/80 hover:text-red-400 bg-red-400/10 hover:bg-red-400/20 p-2 rounded-xl transition-colors"
                          title="Remove Item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="glass-panel p-6 md:p-8 rounded-3xl sticky top-6">
                <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6 text-white/80">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatCurrency(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatCurrency(0)}</span>
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-4 mb-8">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 text-2xl">
                      {formatCurrency(cartTotal)}
                    </span>
                  </div>
                </div>
                
                <Link to="/checkout" className="btn-primary flex justify-center items-center gap-2">
                  <span>Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                
                <div className="mt-4 text-center">
                  <Link to="/products" className="text-sm text-white/50 hover:text-white transition-colors">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
