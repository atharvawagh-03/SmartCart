import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, AlertCircle, ArrowLeft, Package, CreditCard, MapPin } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import AddressForm from '../components/AddressForm';
import { emptyAddress, addressFromProfile, validateAddressForm } from '../utils/address';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [address, setAddress] = useState({ ...emptyAddress, fullName: user?.name || '' });
  const [saveAddress, setSaveAddress] = useState(true);
  const navigate = useNavigate();

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const fetchSavedAddress = async () => {
      try {
        const { data } = await axios.get('/api/users/profile', getAuthConfig());
        if (data.shippingAddress?.addressLine1) {
          setAddress(addressFromProfile(data.shippingAddress));
        } else if (user?.name) {
          setAddress((prev) => ({ ...prev, fullName: user.name }));
        }
      } catch (err) {
        console.error('Failed to load saved address:', err);
      } finally {
        setLoadingAddress(false);
      }
    };

    fetchSavedAddress();
  }, [user?.name]);

  useEffect(() => {
    if (!success && (!cart || !cart.items || cart.items.length === 0)) {
      navigate('/cart');
    }
  }, [cart, navigate, success]);

  const placeOrder = async () => {
    const addressError = validateAddressForm(address);
    if (addressError) {
      setError(addressError);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const orderItems = cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.image,
      }));

      await axios.post(
        '/api/orders',
        {
          orderItems,
          totalPrice: cartTotal,
          shippingAddress: address,
          saveAddress,
        },
        getAuthConfig()
      );

      setSuccess(true);
    } catch (err) {
      console.error('Order failed:', err);
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
          <p className="text-white/60 mb-2">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
          <p className="text-white/50 text-sm mb-8">
            Delivering to {address.city}, {address.pincode}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/orders" className="btn-primary" onClick={() => clearCart()}>
              View My Orders
            </Link>
            <Link
              to="/products"
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors font-medium"
              onClick={() => clearCart()}
            >
              Continue Shopping
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

      <main className="max-w-5xl mx-auto z-10 relative">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/cart" className="text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">
            Secure <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Checkout</span>
          </h1>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-400" />
                Delivery Address
              </h3>
              <p className="text-white/50 text-sm mb-6">
                Enter where you want your order delivered. Saved address loads automatically next time.
              </p>

              {loadingAddress ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <AddressForm address={address} onChange={setAddress} disabled={loading} />
                  <label className="mt-5 flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-black/20 text-purple-500 focus:ring-purple-500/50"
                    />
                    <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                      Save this address for future orders
                    </span>
                  </label>
                </>
              )}
            </div>

            <div className="glass-panel p-6 rounded-3xl">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-400" />
                Order Summary
              </h3>
              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
                {cart?.items?.map((item) => (
                  <div key={item.product._id} className="flex gap-4 items-center bg-white/5 p-3 rounded-2xl">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-white/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1">{item.product.name}</h4>
                      <p className="text-white/50 text-xs mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-medium shrink-0">
                      {formatCurrency(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="glass-panel p-6 md:p-8 rounded-3xl lg:sticky lg:top-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                Payment Details
              </h3>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-6 text-sm text-blue-200">
                Demo checkout — no real payment. Stock is reduced when you place the order.
              </div>

              <div className="space-y-4 mb-6 text-white/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatCurrency(cartTotal)}</span>
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
                    {formatCurrency(cartTotal)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={placeOrder}
                disabled={loading || loadingAddress}
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
