import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { formatCurrency } from '../utils/currency';

const TRACKING_STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const getStatusConfig = (status) => {
  switch (status) {
    case 'Delivered':
      return { icon: CheckCircle, color: 'text-green-400', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/30' };
    case 'Shipped':
      return { icon: Truck, color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/30' };
    case 'Processing':
      return { icon: Clock, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/30' };
    case 'Pending':
    default:
      return { icon: Package, color: 'text-purple-400', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-500/30' };
  }
};

const OrderTracker = ({ status }) => {
  const currentIndex = TRACKING_STEPS.indexOf(status);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="mt-6 pt-6 border-t border-white/10">
      <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-4">Order tracking</p>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0">
        {TRACKING_STEPS.map((step, index) => {
          const isComplete = index <= activeIndex;
          const isCurrent = index === activeIndex;
          return (
            <div key={step} className="flex sm:flex-1 sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
              <div className="flex sm:flex-col items-center gap-3 sm:gap-2 sm:w-full">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                    isComplete
                      ? 'bg-purple-500/30 border-purple-500 text-purple-300'
                      : 'bg-white/5 border-white/20 text-white/40'
                  } ${isCurrent ? 'ring-2 ring-purple-500/50 ring-offset-2 ring-offset-[#0f0c20]' : ''}`}
                >
                  {isComplete ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>
                {index < TRACKING_STEPS.length - 1 && (
                  <div
                    className={`hidden sm:block flex-1 h-0.5 mx-2 ${
                      index < activeIndex ? 'bg-purple-500' : 'bg-white/10'
                    }`}
                  />
                )}
                <div className="sm:w-full">
                  <p className={`text-sm font-medium ${isCurrent ? 'text-purple-400' : isComplete ? 'text-white' : 'text-white/40'}`}>
                    {step}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-white/50 mt-0.5">Current status</p>
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
  const { socket } = useSocket();

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/orders/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError(err.response?.data?.message || 'Failed to load your orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (!socket) return;
    const onStatusUpdate = () => fetchOrders();
    socket.on('orderStatusUpdated', onStatusUpdate);
    return () => socket.off('orderStatusUpdated', onStatusUpdate);
  }, [socket, fetchOrders]);

  const formatOrderId = (id) => `#${String(id).slice(-8).toUpperCase()}`;

  const activeOrders = orders.filter((o) => o.status !== 'Delivered');
  const pastOrders = orders.filter((o) => o.status === 'Delivered');

  const renderOrderCard = (order) => {
    const statusConfig = getStatusConfig(order.status);
    const StatusIcon = statusConfig.icon;
    const isExpanded = expandedId === order._id;

    return (
      <div
        key={order._id}
        className="bg-black/20 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg ${statusConfig.bgColor}`}>
              <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
            </div>
            <div>
              <p className="text-white font-medium">Order {formatOrderId(order._id)}</p>
              <p className="text-white/60 text-sm">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor} border`}
            >
              {order.status}
            </span>
            <span className="text-white font-medium">{formatCurrency(order.totalPrice)}</span>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <div className="space-y-2">
            {order.orderItems?.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm gap-4">
                <span className="text-white/80 line-clamp-1">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-white/60 shrink-0">
                  {formatCurrency((item.price || 0) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {isExpanded && <OrderTracker status={order.status} />}

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setExpandedId(isExpanded ? null : order._id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white text-sm"
          >
            <Eye className="w-4 h-4" />
            {isExpanded ? 'Hide tracking' : 'Track order'}
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
    );
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-1">My Orders</h1>
                <p className="text-white/60">View and track your order history</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  fetchOrders();
                }}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white/80 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {loading && orders.length === 0 ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  type="button"
                  onClick={fetchOrders}
                  className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 transition-colors text-white font-medium"
                >
                  Try again
                </button>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No orders yet</h3>
                <p className="text-white/60 mb-6">Place an order from your cart to see it here</p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 transition-colors text-white font-medium"
                >
                  <Package className="w-4 h-4" />
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-10">
                {activeOrders.length > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Active orders ({activeOrders.length})
                    </h2>
                    <div className="space-y-4">{activeOrders.map(renderOrderCard)}</div>
                  </section>
                )}

                {pastOrders.length > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold text-white/80 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      Delivered ({pastOrders.length})
                    </h2>
                    <div className="space-y-4">{pastOrders.map(renderOrderCard)}</div>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
