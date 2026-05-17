import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, ShoppingBag, DollarSign, ArrowUpRight, Package, Plus, Search, ExternalLink, Trash2, Edit2, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatCurrencyCompact } from '../utils/currency';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#16171d] border border-white/10 p-4 rounded-xl shadow-xl">
        <p className="text-white/60 mb-2">{label}</p>
        <p className="font-semibold text-purple-400">
          Revenue: {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'products'
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    chartData: []
  });
  const [orders, setOrders] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    image: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [analyticsRes, ordersRes, productsRes] = await Promise.all([
        axios.get('/api/admin/analytics', config),
        axios.get('/api/admin/orders', config),
        axios.get('/api/products')
      ]);
      
      setAnalytics(analyticsRes.data);
      setOrders(ordersRes.data);
      setAllProducts(productsRes.data);
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

  const handleBulkImport = async (source) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const mockDatasets = {
        amazon: [
          { name: "Echo Dot (4th Gen)", price: 49.99, category: "Electronics", stock: 100, image: "https://m.media-amazon.com/images/I/714B9B6y76L._AC_SL1500_.jpg" },
          { name: "Kindle Paperwhite", price: 139.99, category: "Electronics", stock: 50, image: "https://m.media-amazon.com/images/I/61NbaFp4p+L._AC_SL1500_.jpg" }
        ],
        flipkart: [
          { name: "Realme 9 Pro", price: 17999, category: "Mobile", stock: 30, image: "https://rukminim1.flixcart.com/image/416/416/l0r070w0/mobile/m/j/b/-original-imagcg22fz7yhw6v.jpeg" }
        ],
        myntra: [
          { name: "Levis Men Jeans", price: 2999, category: "Fashion", stock: 120, image: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/15478224/2021/9/14/66848c0a-0158-47a3-8323-93881452654c1631626046045-Levis-Men-Jeans-1631626046045-1.jpg" }
        ]
      };

      const productsToImport = mockDatasets[source];
      await axios.post('/api/products/bulk', { products: productsToImport }, config);
      
      alert(`Successfully imported ${productsToImport.length} products from ${source}!`);
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to import products:', err);
      alert('Failed to import products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/products/${id}`, config);
      setAllProducts(allProducts.filter(p => p._id !== id));
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        stock: product.stock,
        image: product.image
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        category: '',
        stock: '',
        image: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, formData, config);
        alert("Product updated successfully!");
      } else {
        await axios.post('/api/products', formData, config);
        alert("Product created successfully!");
      }

      setIsModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-2xl transition-all duration-300 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'overview' 
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' 
                  : 'bg-white/5 hover:bg-white/10 text-white/60 border border-white/10'
              }`}
            >
              <Users className="w-4 h-4" />
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`px-6 py-3 rounded-2xl transition-all duration-300 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'products' 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                  : 'bg-white/5 hover:bg-white/10 text-white/60 border border-white/10'
              }`}
            >
              <Package className="w-4 h-4" />
              Products
            </button>
            <button 
              onClick={fetchDashboardData}
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300"
            >
              <ArrowUpRight className="w-4 h-4 rotate-45" />
            </button>
          </div>
        </div>

        {activeTab === 'overview' ? (
          <>
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <button 
                onClick={() => handleOpenModal()}
                className="glass-panel p-6 rounded-3xl group flex items-center gap-4 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="p-3 bg-blue-500/10 rounded-2xl group-hover:bg-blue-500/20 transition-colors">
                  <Plus className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-white">Add Product</h4>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Manual entry</p>
                </div>
              </button>
              
              <button 
                onClick={() => setActiveTab('products')}
                className="glass-panel p-6 rounded-3xl group flex items-center gap-4 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="p-3 bg-purple-500/10 rounded-2xl group-hover:bg-purple-500/20 transition-colors">
                  <Download className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-white">Import Data</h4>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">From external datasets</p>
                </div>
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
              <h3 className="text-4xl font-bold">{formatCurrency(analytics.totalRevenue)}</h3>
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
                    <YAxis stroke="rgba(255,255,255,0.4)" axisLine={false} tickLine={false} tickFormatter={(value) => formatCurrencyCompact(value)} />
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
                  <th className="px-8 py-6 font-medium">Ship to</th>
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
                    <td className="px-8 py-6 text-sm text-white/70 max-w-[200px]">
                      {order.shippingAddress ? (
                        <div className="line-clamp-2">
                          <span className="text-white/90">{order.shippingAddress.city}</span>
                          <span className="text-white/40"> · {order.shippingAddress.pincode}</span>
                          <p className="text-xs text-white/40 mt-0.5 truncate">{order.shippingAddress.addressLine1}</p>
                        </div>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-sm font-semibold text-white">
                      {formatCurrency(order.totalPrice)}
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
      </>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Import Datasets Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel p-6 rounded-3xl group hover:border-orange-500/30 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-orange-500/10 rounded-2xl">
                    <Download className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Amazon Dataset</h4>
                    <p className="text-xs text-white/40">Import Echo, Kindle, FireTV</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleBulkImport('amazon')}
                  className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-orange-500/20"
                >
                  Import Now
                </button>
              </div>

              <div className="glass-panel p-6 rounded-3xl group hover:border-blue-500/30 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-2xl">
                    <Download className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Flipkart Dataset</h4>
                    <p className="text-xs text-white/40">Import Realme, Poco devices</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleBulkImport('flipkart')}
                  className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20"
                >
                  Import Now
                </button>
              </div>

              <div className="glass-panel p-6 rounded-3xl group hover:border-pink-500/30 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-pink-500/10 rounded-2xl">
                    <Download className="w-6 h-6 text-pink-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Myntra Dataset</h4>
                    <p className="text-xs text-white/40">Import Levis, Adidas fashion</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleBulkImport('myntra')}
                  className="w-full py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-pink-500/20"
                >
                  Import Now
                </button>
              </div>

              {/* Manual Add Card */}
              <div className="glass-panel p-6 rounded-3xl group border-dashed border-2 border-white/10 hover:border-blue-500/50 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer" onClick={() => handleOpenModal()}>
                <div className="p-4 bg-blue-500/10 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Plus className="w-8 h-8 text-blue-400" />
                </div>
                <h4 className="font-semibold text-white">Add New Product</h4>
                <p className="text-xs text-white/40 mt-1">Create a custom product manually</p>
              </div>
            </div>

            {/* Products Table */}
            <div className="glass-panel rounded-3xl overflow-hidden">
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-xl font-semibold">Inventory Management</h3>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input 
                      type="text" 
                      placeholder="Search inventory..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  <button 
                    onClick={() => handleOpenModal()}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 p-2 rounded-xl transition-all"
                  >
                    <Plus className="w-5 h-5 text-blue-400" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-white/40 text-xs uppercase tracking-wider">
                      <th className="px-8 py-6 font-medium">Product</th>
                      <th className="px-8 py-6 font-medium">Category</th>
                      <th className="px-8 py-6 font-medium">Price</th>
                      <th className="px-8 py-6 font-medium">Stock</th>
                      <th className="px-8 py-6 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredProducts.map((product) => (
                      <tr key={product._id} className="group hover:bg-white/5 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <img src={product.image} alt={product.name} referrerPolicy="no-referrer" className="w-10 h-10 rounded-lg object-contain bg-white/5" />
                            <span className="text-sm font-medium text-white">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-xs text-white/60 bg-white/5 px-2 py-1 rounded-md">{product.category}</span>
                        </td>
                        <td className="px-8 py-6 text-sm font-semibold text-white">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-orange-500'}`} />
                            <span className="text-sm text-white/80 font-medium">{product.stock} units</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleOpenModal(product)}
                              className="p-2 hover:bg-blue-500/10 text-white/40 hover:text-blue-400 transition-all rounded-lg"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product._id)}
                              className="p-2 hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-white/10 text-white/40 hover:text-white transition-all rounded-lg">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="glass-panel w-full max-w-lg rounded-3xl p-8 relative z-10 animate-in zoom-in duration-300">
            <h3 className="text-2xl font-bold mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-2 block">Product Name</label>
                <input 
                  type="text" 
                  required
                  className="glass-input" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/60 mb-2 block">Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    step="0.01"
                    className="glass-input" 
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-2 block">Stock</label>
                  <input 
                    type="number" 
                    required
                    className="glass-input" 
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm text-white/60 mb-2 block">Category</label>
                <input 
                  type="text" 
                  required
                  className="glass-input" 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-sm text-white/60 mb-2 block">Image URL</label>
                <input 
                  type="text" 
                  required
                  className="glass-input" 
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
