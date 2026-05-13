import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';

const MyOrders = () => {
  // Mock orders data - in a real app, this would come from an API
  const orders = [
    {
      id: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 2999,
      items: [
        { name: 'Wireless Headphones', quantity: 1, price: 2999 }
      ]
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-20',
      status: 'shipped',
      total: 1599,
      items: [
        { name: 'Smart Watch', quantity: 1, price: 1599 }
      ]
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-25',
      status: 'processing',
      total: 4999,
      items: [
        { name: 'Laptop Stand', quantity: 1, price: 1999 },
        { name: 'Wireless Mouse', quantity: 1, price: 999 },
        { name: 'Keyboard', quantity: 1, price: 2001 }
      ]
    },
    {
      id: 'ORD-2024-004',
      date: '2024-01-28',
      status: 'cancelled',
      total: 899,
      items: [
        { name: 'USB-C Hub', quantity: 1, price: 899 }
      ]
    }
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'delivered':
        return {
          icon: CheckCircle,
          color: 'text-green-400',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30'
        };
      case 'shipped':
        return {
          icon: Truck,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500/30'
        };
      case 'processing':
        return {
          icon: Clock,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/30'
        };
      case 'cancelled':
        return {
          icon: XCircle,
          color: 'text-red-400',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/30'
        };
      default:
        return {
          icon: Package,
          color: 'text-gray-400',
          bgColor: 'bg-gray-500/20',
          borderColor: 'border-gray-500/30'
        };
    }
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
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>

            {orders.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No orders yet</h3>
                <p className="text-white/60 mb-6">Start shopping to see your orders here</p>
                <Link 
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 transition-colors text-white font-medium"
                >
                  <Package className="w-4 h-4" />
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const StatusConfig = getStatusConfig(order.status);
                  const StatusIcon = StatusConfig.icon;

                  return (
                    <div 
                      key={order.id}
                      className="bg-black/20 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${StatusConfig.bgColor}`}>
                            <StatusIcon className={`w-5 h-5 ${StatusConfig.color}`} />
                          </div>
                          <div>
                            <p className="text-white font-medium">{order.id}</p>
                            <p className="text-white/60 text-sm">{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${StatusConfig.bgColor} ${StatusConfig.color} ${StatusConfig.borderColor} border`}>
                            {order.status}
                          </span>
                          <span className="text-white font-medium">₹{order.total.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="border-t border-white/10 pt-4">
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="text-white/80">
                                {item.name} × {item.quantity}
                              </span>
                              <span className="text-white/60">₹{item.price.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white text-sm">
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        {order.status === 'delivered' && (
                          <button className="px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 transition-colors text-purple-400 text-sm font-medium">
                            Buy Again
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
