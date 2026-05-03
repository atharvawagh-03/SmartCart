import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, ShoppingBag, DollarSign, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#16171d] border border-white/10 p-4 rounded-xl shadow-xl">
        <p className="text-white/60 mb-2">{label}</p>
        <p className="font-semibold text-purple-400">
          Revenue: ${payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    chartData: []
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [analyticsRes, ordersRes] = await Promise.all([
        axios.get('/api/admin/analytics', config),
        axios.get('/api/admin/orders', config)
      ]);
      
      setAnalytics(analyticsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.put(`/api/admin/orders/${orderId}/status`, { status: newStatus }, config);
      
      // Update local state
      setOrders(orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-12 flex items-center justify-center text-red-400">
        <div className="glass-panel p-8 rounded-3xl text-center">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-[-5%] left-[-5%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <main className="max-w-7xl mx-auto z-10 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                SmartCart
              </Link>
              <span className="text-white/40">/</span>
              <span className="text-white/80 font-medium tracking-wider text-sm uppercase">Admin Panel</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Overview</span>
            </h1>
          </div>
          
          <button 
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300 font-medium text-sm"
          >
            Refresh Data
          </button>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px]" />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="p-3 bg-white/5 rounded-2xl">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <span className="flex items-center text-xs text-green-400 font-medium bg-green-400/10 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                12%
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-white/60 mb-1 font-medium text-sm">Total Users</p>
              <h3 className="text-4xl font-bold">{analytics.totalUsers}</h3>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px]" />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="p-3 bg-white/5 rounded-2xl">
                <ShoppingBag className="w-6 h-6 text-blue-400" />
              </div>
              <span className="flex items-center text-xs text-green-400 font-medium bg-green-400/10 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                24%
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-white/60 mb-1 font-medium text-sm">Total Orders</p>
              <h3 className="text-4xl font-bold">{analytics.totalOrders}</h3>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group hover:border-green-500/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[40px]" />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="p-3 bg-white/5 rounded-2xl">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <span className="flex items-center text-xs text-green-400 font-medium bg-green-400/10 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                8%
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-white/60 mb-1 font-medium text-sm">Total Revenue</p>
              <h3 className="text-4xl font-bold">${analytics.totalRevenue.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="glass-panel p-8 rounded-3xl">
            <h3 className="text-xl font-semibold mb-8">Revenue Overview</h3>
            <div className="h-80 w-full">
              {analytics.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.4)" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="revenue" stroke="#aa3bff" strokeWidth={4} dot={{ r: 4, fill: '#aa3bff', strokeWidth: 0 }} activeDot={{ r: 8, fill: '#aa3bff', strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-white/40">
                  No data available for the last 7 days
                </div>
              )}
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl">
            <h3 className="text-xl font-semibold mb-8">Orders Volume</h3>
            <div className="h-80 w-full">
              {analytics.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.4)" axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ backgroundColor: '#16171d', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#3b82f6' }}
                    />
                    <Bar dataKey="orders" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-white/40">
                  No data available for the last 7 days
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="glass-panel rounded-3xl overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xl font-semibold">Recent Orders</h3>
            <span className="text-xs font-medium text-white/40 bg-white/5 px-3 py-1 rounded-full">
              Real-time updates active
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-white/40 text-xs uppercase tracking-wider">
                  <th className="px-8 py-6 font-medium">Order ID</th>
                  <th className="px-8 py-6 font-medium">Customer</th>
                  <th className="px-8 py-6 font-medium">Amount</th>
                  <th className="px-8 py-6 font-medium">Status</th>
                  <th className="px-8 py-6 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => (
                  <tr key={order._id} className="group hover:bg-white/5 transition-colors">
                    <td className="px-8 py-6 text-sm font-medium text-white/80">
                      #{order._id.substring(0, 8)}...
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{order.user?.name}</span>
                        <span className="text-xs text-white/40">{order.user?.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-semibold text-white">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' :
                        order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-500' :
                        order.status === 'Processing' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-zinc-500/10 text-zinc-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="bg-[#1a1b23] border border-white/10 rounded-lg text-xs p-2 text-white/80 focus:outline-none focus:border-purple-500/50"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div className="p-12 text-center text-white/40">
                No orders found
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
