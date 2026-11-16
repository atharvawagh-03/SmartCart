import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  MapPin,
} from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';
import { formatAddressLines } from '../utils/address';
import ThemeToggle from '../components/ThemeToggle';

const TRACKING_STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const getStatusConfig = (status) => {
  switch (status) {
    case 'Delivered':
      return { icon: CheckCircle2, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20' };
    case 'Shipped':
      return { icon: Truck, color: 'text-blue-500', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' };
    case 'Processing':
      return { icon: Clock, color: 'text-amber-500', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/20' };
    case 'Pending':
    default:
      return { icon: Package, color: 'text-zinc-400', bgColor: 'bg-zinc-800/40', borderColor: 'border-zinc-700' };
  }
};

const OrderTracker = ({ status }) => {
  const currentIndex = TRACKING_STEPS.indexOf(status);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="mt-5 pt-5 border-t border-border">
      <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-4">Tracking Progress</p>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
        {TRACKING_STEPS.map((step, index) => {
          const isComplete = index <= activeIndex;
          const isCurrent = index === activeIndex;
          return (
            <div key={step} className="flex sm:flex-1 sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
              <div className="flex sm:flex-col items-center gap-3 sm:gap-2 sm:w-full">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border text-xs font-medium transition-colors ${
                    isComplete
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-surface border-border text-white/40'
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {index < TRACKING_STEPS.length - 1 && (
                  <div
                    className={`hidden sm:block flex-1 h-0.5 mx-2 ${
                      index < activeIndex ? 'bg-blue-600' : 'bg-border'
                    }`}
                  />
                )}
                <div className="sm:w-full">
                  <p className={`text-xs font-medium ${isCurrent ? 'text-blue-500' : isComplete ? 'text-white' : 'text-white/40'}`}>
                    {step}
                  </p>
                  {isCurrent && (
                    <p className="text-[10px] text-white/40 mt-0.5">Current Status</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const { user } = useAuth();
  const { socket } = useSocket();

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem('token') || user?.token;
      if (!token) {
        setLoading(false);
        return;
      }
      const { data } = await axios.get('/api/orders/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError(err.response?.data?.message || 'Failed to load your orders');
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (!socket) return;
    const onStatusUpdate = () => fetchOrders();
    socket.on('orderStatusUpdated', onStatusUpdate);
    return () => socket.off('orderStatusUpdated', onStatusUpdate);
  }, [socket, fetchOrders]);

  const formatOrderId = (id) => (id ? `#${String(id).slice(-8).toUpperCase()}` : '#--------');

  const safeOrders = Array.isArray(orders) ? orders : [];
  const activeOrders = safeOrders.filter((o) => o?.status !== 'Delivered');
  const pastOrders = safeOrders.filter((o) => o?.status === 'Delivered');

  const renderOrderCard = (order) => {
    if (!order) return null;
    const statusConfig = getStatusConfig(order.status);
    const StatusIcon = statusConfig.icon;
    const isExpanded = expandedId === order._id;
    const orderDate = order.createdAt
      ? new Date(order.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : 'Recent';
    const addressLines = formatAddressLines(order.shippingAddress) || [];

    return (
      <div
        key={order._id}
        className="glass-panel p-5 rounded-xl transition-colors hover:border-zinc-400 dark:hover:border-zinc-700"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${statusConfig.bgColor}`}>
              <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Order {formatOrderId(order._id)}</p>
              <p className="text-xs text-white/50">{orderDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor} border`}
            >
              {order.status || 'Pending'}
            </span>
            <span className="text-sm font-semibold text-white tabular-nums">{formatCurrency(order.totalPrice || 0)}</span>
          </div>
        </div>

        <div className="border-t border-border pt-3">
          <div className="space-y-1.5">
            {(order.orderItems || []).map((item, index) => {
              const itemName = item?.name || 'Product';
              const itemQty = item?.quantity || 1;
              const itemPrice = item?.price || 0;
              return (
                <div key={index} className="flex items-center justify-between text-xs gap-4">
                  <span className="text-white/80 line-clamp-1">
                    {itemName} × {itemQty}
                  </span>
                  <span className="text-white/60 tabular-nums shrink-0">
                    {formatCurrency(itemPrice * itemQty)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {isExpanded && (
          <>
            {addressLines.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Delivery address
                </p>
                <div className="text-xs text-white/70 space-y-0.5">
                  {addressLines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            )}
            <OrderTracker status={order.status || 'Pending'} />
          </>
        )}

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setExpandedId(isExpanded ? null : order._id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-hover transition-colors text-white text-xs font-medium cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isExpanded ? 'Hide Details' : 'Track Order'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-16">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-white/60 hover:text-white transition-colors p-1" aria-label="Back to home">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-tight text-white">SmartCart</span>
              <span className="text-white/30 text-xs">/</span>
              <span className="text-xs font-medium text-white/60">My Orders</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                fetchOrders();
              }}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-hover text-xs font-medium text-white/80 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Order History
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Real-time status updates and order receipts.
          </p>
        </div>

        {loading && orders.length === 0 ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-border border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="glass-panel p-8 text-center rounded-xl space-y-3">
            <p className="text-sm text-rose-400">{error}</p>
            <button
              type="button"
              onClick={fetchOrders}
              className="btn-primary !w-auto inline-flex px-4 py-2 text-xs"
            >
              Try again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl max-w-lg mx-auto space-y-4">
            <Package className="w-10 h-10 text-white/20 mx-auto" />
            <div>
              <h2 className="text-base font-semibold text-white">No orders found</h2>
              <p className="text-xs text-white/50 mt-1">
                You haven't placed any orders yet.
              </p>
            </div>
            <Link
              to="/products"
              className="btn-primary !w-auto inline-flex items-center gap-1.5 px-4 py-2 text-xs"
            >
              <span>Explore Catalog</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {activeOrders.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-500" />
                  <span>Active Shipments ({activeOrders.length})</span>
                </h2>
                <div className="space-y-3">{activeOrders.map(renderOrderCard)}</div>
              </section>
            )}

            {pastOrders.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Delivered Orders ({pastOrders.length})</span>
                </h2>
                <div className="space-y-3">{pastOrders.map(renderOrderCard)}</div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyOrders;
