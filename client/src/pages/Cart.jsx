import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';
import ThemeToggle from '../components/ThemeToggle';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-border border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  const isCartEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <div className="min-h-screen pb-16">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/products" className="text-white/60 hover:text-white transition-colors p-1" aria-label="Back to catalog">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-tight text-white">SmartCart</span>
              <span className="text-white/30 text-xs">/</span>
              <span className="text-xs font-medium text-white/60">Shopping Cart</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/products" className="text-xs text-white/60 hover:text-white transition-colors">
              Continue shopping
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Your Cart
          </h1>
          {!isCartEmpty && (
            <button 
              onClick={clearCart} 
              className="text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>

        {isCartEmpty ? (
          <div className="glass-panel p-12 text-center rounded-2xl max-w-lg mx-auto space-y-4">
            <ShoppingBag className="w-10 h-10 text-white/20 mx-auto" />
            <div>
              <h2 className="text-base font-semibold text-white">Your cart is currently empty</h2>
              <p className="text-xs text-white/50 mt-1">
                Explore our catalog and find items you love.
              </p>
            </div>
            <Link to="/products" className="btn-primary !w-auto inline-flex items-center gap-1.5 px-4 py-2 text-xs">
              <span>Start Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* ── Cart Items List ── */}
            <div className="lg:col-span-2 space-y-3">
              {(cart.items || []).map((item, idx) => {
                const product = item?.product || {};
                const productId = product._id || item?._id || idx;
                const name = product.name || 'Product';
                const category = product.category || 'General';
                const price = product.price || 0;
                const image = product.image;
                const stock = product.stock ?? 99;

                return (
                  <div 
                    key={productId} 
                    className="glass-panel p-4 rounded-xl flex items-center gap-4"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-border flex-shrink-0 flex items-center justify-center">
                      {image ? (
                        <img 
                          src={image} 
                          alt={name} 
                          referrerPolicy="no-referrer" 
                          className="w-full h-full object-contain p-2" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/400x400/f8fafc/64748b?text=Product";
                          }}
                        />
                      ) : (
                        <ShoppingBag className="w-6 h-6 text-white/20" />
                      )}
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <h3 className="text-sm font-medium text-white truncate">
                        {name}
                      </h3>
                      <p className="text-xs text-white/50 mb-2">{category}</p>
                      <p className="text-sm font-semibold text-white tabular-nums">
                        {formatCurrency(price)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center rounded-lg border border-border bg-surface">
                        <button 
                          onClick={() => updateQuantity(productId, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
                          disabled={loading}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-medium tabular-nums">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(productId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
                          disabled={loading || item.quantity >= stock}
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(productId)}
                        className="p-1.5 text-white/40 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Order Summary ── */}
            <div className="lg:col-span-1">
              <div className="glass-panel p-5 rounded-xl space-y-4">
                <h2 className="text-sm font-semibold tracking-tight text-white border-b border-border pb-3">
                  Order Summary
                </h2>
                
                <div className="space-y-2 text-xs text-white/70">
                  <div className="flex justify-between">
                    <span>Items ({cartCount})</span>
                    <span className="font-medium text-white tabular-nums">{formatCurrency(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium text-emerald-500">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax</span>
                    <span className="tabular-nums">{formatCurrency(0)}</span>
                  </div>
                </div>
                
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-medium text-white">Total</span>
                    <span className="text-lg font-bold text-white tabular-nums">
                      {formatCurrency(cartTotal)}
                    </span>
                  </div>
                </div>
                
                <Link to="/checkout" className="btn-primary flex justify-center items-center gap-2">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
