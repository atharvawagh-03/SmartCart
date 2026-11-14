import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, ArrowLeft, Package, CreditCard, MapPin } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-panel p-8 sm:p-10 rounded-2xl text-center max-w-md w-full space-y-4">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Order Confirmed</h2>
            <p className="text-xs text-white/60 mt-1">
              Your order has been placed and is being prepared for shipment.
            </p>
            <p className="text-xs text-white/40 mt-1">
              Delivering to {address.city}, {address.pincode}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link to="/orders" className="btn-primary !w-full text-xs" onClick={() => clearCart()}>
              View Orders
            </Link>
            <Link
              to="/products"
              className="w-full inline-flex items-center justify-center py-2 px-4 rounded-lg border border-border bg-surface hover:bg-surface-hover text-xs font-medium text-white transition-colors"
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
    <div className="min-h-screen pb-16">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/cart" className="text-white/60 hover:text-white transition-colors p-1" aria-label="Back to cart">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-tight text-white">SmartCart</span>
              <span className="text-white/30 text-xs">/</span>
              <span className="text-xs font-medium text-white/60">Checkout</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Complete Your Order
        </h1>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* ── Delivery Details ── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-5 sm:p-6 rounded-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <MapPin className="w-4 h-4 text-white/60" />
                <h2 className="text-sm font-semibold tracking-tight text-white">
                  Shipping Address
                </h2>
              </div>

              {loadingAddress ? (
                <div className="flex justify-center py-8">
                  <div className="w-5 h-5 border-2 border-border border-t-blue-600 rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  <AddressForm address={address} onChange={setAddress} disabled={loading} />
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-white/70 hover:text-white">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="w-4 h-4 rounded border-border text-blue-600 focus:ring-blue-500"
                    />
                    <span>Save this address for future orders</span>
                  </label>
                </div>
              )}
            </div>

            {/* Items in order */}
            <div className="glass-panel p-5 rounded-xl space-y-3">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Package className="w-4 h-4 text-white/60" />
                <h2 className="text-sm font-semibold tracking-tight text-white">
                  Items to Ship ({cart?.items?.length || 0})
                </h2>
              </div>
              <div className="divide-y divide-border max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {cart?.items?.map((item) => (
                  <div key={item.product._id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <p className="font-medium text-white truncate">{item.product.name}</p>
                      <p className="text-white/50">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-white tabular-nums shrink-0">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Summary & Payment ── */}
          <div className="lg:col-span-1">
            <div className="glass-panel p-5 rounded-xl space-y-4 sticky top-20">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <CreditCard className="w-4 h-4 text-white/60" />
                <h2 className="text-sm font-semibold tracking-tight text-white">
                  Payment Summary
                </h2>
              </div>

              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400">
                Test checkout: No payment information required. Inventory is reserved immediately.
              </div>

              <div className="space-y-2 text-xs text-white/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-white tabular-nums">{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-emerald-500">Free</span>
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

              <button
                type="button"
                onClick={placeOrder}
                disabled={loading || loadingAddress}
                className="btn-primary w-full flex justify-center items-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
