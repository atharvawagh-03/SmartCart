import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { CheckCircle, AlertCircle, ArrowLeft, Package, CreditCard } from 'lucide-react';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if cart is empty and not on success page
    if (!success && (!cart || !cart.items || cart.items.length === 0)) {
      navigate('/cart');
    }
  }, [cart, navigate, success]);

  const placeOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const orderItems = cart.items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.image
      }));

      await axios.post(
        '/api/orders',
        {
          orderItems,
          totalPrice: cartTotal,
        },
        config
      );

      setSuccess(true);
      // Manually reset local cart state to avoid an unnecessary DELETE request
      // since the backend already cleared the cart on order creation.
      // But using clearCart is fine too. We'll let the user see the success page.
      
    } catch (err) {
      console.error("Order failed:", err);
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-[10%] right-[-5%] w-96 h-96 bg-green-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="glass-panel p-10 md:p-16 rounded-3xl text-center max-w-lg z-10">
          <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Order Confirmed!</h2>
          <p className="text-white/60 mb-8">
            Thank you for your purchase. Your order has been placed successfully and is now being processed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="btn-primary" onClick={() => clearCart()}>
              Continue Shopping
            </Link>
            <Link to="/" className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors font-medium" onClick={() => clearCart()}>
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-[10%] right-[-5%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <main className="max-w-4xl mx-auto z-10 relative">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/cart" className="text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">
            Secure <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Checkout</span>
          </h1>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-400" />
                Order Summary
              </h3>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cart?.items?.map((item) => (
                  <div key={item.product._id} className="flex gap-4 items-center bg-white/5 p-3 rounded-2xl">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                      {item.product.image ? (
                        <img src={item.product.image} alt={item.product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-white/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium text-sm line-clamp-1">{item.product.name}</h4>
                      <p className="text-white/50 text-xs mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="glass-panel p-6 md:p-8 rounded-3xl sticky top-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                Payment Details
              </h3>
              
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-6 text-sm text-blue-200">
                This is a demo application. No real payment is required. Placing an order will create it in the database and reduce stock.
              </div>
              
              <div className="space-y-4 mb-6 text-white/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-4 mb-8">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 text-3xl">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={placeOrder}
                disabled={loading}
                className="btn-primary w-full flex justify-center items-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Place Order</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
