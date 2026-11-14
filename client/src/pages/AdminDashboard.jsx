import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, ShoppingBag, IndianRupee, ArrowUpRight, Package, Plus, Search, ExternalLink, Trash2, Edit2, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatCurrencyCompact } from '../utils/currency';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-700 p-2.5 rounded-lg shadow-lg text-xs">
        <p className="text-zinc-400 mb-1">{label}</p>
        <p className="font-semibold text-white">
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
          { name: "Echo Dot (4th Gen)", price: 4149, category: "Electronics", stock: 100, image: "https://m.media-amazon.com/images/I/714B9B6y76L._AC_SL1500_.jpg" },
          { name: "Kindle Paperwhite", price: 11619, category: "Electronics", stock: 50, image: "https://m.media-amazon.com/images/I/61NbaFp4p+L._AC_SL1500_.jpg" }
        ],
        flipkart: [
          { name: "Realme 9 Pro", price: 17999, category: "Mobile", stock: 30, image: "https://rukminim1.flixcart.com/image/416/416/l0r070w0/mobile/m/j/b/-original-imagcg22fz7yhw6v.jpeg" }
        ],
        myntra: [
          { name: "Levis Slim Fit Jeans", price: 2999, category: "Clothing", stock: 45, image: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/1364776/2016/8/22/11471847120760-Levis-Men-Blue-511-Slim-Fit-Jeans-6521471847120537-1.jpg" }
        ],
        ajio: [
          { name: "Classic Cotton Shirt", price: 1499, category: "Clothing", stock: 60, image: "https://assets.ajio.com/medias/sys_master/root/20230624/k65m/649646b9a9b42d15c9f5627f/-473Wx593H-465363404-white-MODEL.jpg" }
        ]
      };

      const items = mockDatasets[source];
      if (items) {
        for (const item of items) {
          await axios.post('/api/products', item, config);
        }
      }
      
      await fetchDashboardData();
    } catch (err) {
      console.error('Import failed:', err);
      alert('Failed to import dataset');
      setLoading(false);
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
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, formData, config);
      } else {
        await axios.post('/api/products', formData, config);
      }
      
      setIsModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.delete(`/api/products/${id}`, config);
      fetchDashboardData();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete product');
    }
  };

  const filteredProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-border border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="glass-panel p-6 rounded-xl text-center text-rose-400 text-sm max-w-sm">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-white/60 hover:text-white transition-colors p-1" aria-label="Back to storefront">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-tight text-white">SmartCart</span>
              <span className="text-white/30 text-xs">/</span>
              <span className="text-xs font-medium text-white/60">Admin Operations</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-0.5 rounded-lg border border-border bg-black/20">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeTab === 'overview' 
                    ? 'bg-zinc-800 text-white shadow-xs' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('products')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeTab === 'products' 
                    ? 'bg-zinc-800 text-white shadow-xs' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Inventory ({allProducts.length})
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              {activeTab === 'overview' ? 'Operational Overview' : 'Inventory Management'}
            </h1>
            <p className="text-xs text-white/50 mt-1">
              {activeTab === 'overview' 
                ? 'Sales velocity, customer activity, and order fulfillment' 
                : 'Stock adjustments, bulk dataset cataloging, and item entries'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleOpenModal()}
              className="btn-primary !w-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Product</span>
            </button>
          </div>
        </div>

        {activeTab === 'overview' ? (
          <>
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-panel p-5 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white/50">Total Registered Users</span>
                  <Users className="w-4 h-4 text-white/40" />
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-2xl font-bold text-white tabular-nums">{analytics.totalUsers}</span>
                  <span className="text-[11px] font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    +12% mo.
                  </span>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white/50">Fulfilled Orders</span>
                  <ShoppingBag className="w-4 h-4 text-white/40" />
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-2xl font-bold text-white tabular-nums">{analytics.totalOrders}</span>
                  <span className="text-[11px] font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    +24% mo.
                  </span>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white/50">Gross Revenue</span>
                  <IndianRupee className="w-4 h-4 text-white/40" />
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-2xl font-bold text-white tabular-nums">{formatCurrency(analytics.totalRevenue)}</span>
                  <span className="text-[11px] font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    +8% mo.
                  </span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="glass-panel p-5 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60">Revenue Trend (Last 7 Days)</h3>
                </div>
                <div className="h-64 w-full">
                  {analytics.chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" axisLine={false} tickLine={false} fontSize={11} />
                        <YAxis stroke="rgba(255,255,255,0.3)" axisLine={false} tickLine={false} fontSize={11} tickFormatter={(value) => formatCurrencyCompact(value)} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} dot={{ r: 3, fill: '#2563eb' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-white/40">
                      No chart data available
                    </div>
                  )}
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60">Order Volume (Daily)</h3>
                </div>
                <div className="h-64 w-full">
                  {analytics.chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" axisLine={false} tickLine={false} fontSize={11} />
                        <YAxis stroke="rgba(255,255,255,0.3)" axisLine={false} tickLine={false} fontSize={11} allowDecimals={false} />
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                          contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', fontSize: '11px' }}
                        />
                        <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-white/40">
                      No chart data available
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="glass-panel rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border flex justify-between items-center">
                <h3 className="text-sm font-semibold text-white">Recent Customer Orders</h3>
                <span className="text-[11px] font-medium text-emerald-500">Live sync</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-white/40 border-b border-border bg-black/10 dark:bg-black/20">
                      <th className="px-4 py-3 font-medium">Order</th>
                      <th className="px-4 py-3 font-medium">Customer</th>
                      <th className="px-4 py-3 font-medium">Destination</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-surface-hover transition-colors">
                        <td className="px-4 py-3 font-medium text-white/80">
                          #{order._id.substring(0, 8).toUpperCase()}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-white">{order.user?.name || 'Customer'}</p>
                            <p className="text-[10px] text-white/40">{order.user?.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-white/70">
                          {order.shippingAddress ? (
                            <span>{order.shippingAddress.city}, {order.shippingAddress.pincode}</span>
                          ) : '—'}
                        </td>
                        <td className="px-4 py-3 font-semibold text-white tabular-nums">
                          {formatCurrency(order.totalPrice)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                            order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                            order.status === 'Processing' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                            'bg-zinc-800 text-zinc-400 border border-zinc-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            className="bg-black/20 border border-border rounded px-2 py-1 text-xs text-white/80 focus:outline-none focus:border-blue-500"
                          >
                            <option value="Pending" className="bg-zinc-900">Pending</option>
                            <option value="Processing" className="bg-zinc-900">Processing</option>
                            <option value="Shipped" className="bg-zinc-900">Shipped</option>
                            <option value="Delivered" className="bg-zinc-900">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && (
                  <div className="p-8 text-center text-xs text-white/40">
                    No orders have been recorded yet.
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {/* Quick Bulk Datasets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'Amazon Dataset', source: 'amazon', sub: 'Echo, Kindle devices' },
                { name: 'Flipkart Dataset', source: 'flipkart', sub: 'Smartphones & electronics' },
                { name: 'Myntra Dataset', source: 'myntra', sub: 'Apparel & footwear' },
                { name: 'Ajio Dataset', source: 'ajio', sub: 'Fashion & trends' },
              ].map((ds) => (
                <div key={ds.source} className="glass-panel p-3.5 rounded-xl space-y-2">
                  <div>
                    <h4 className="text-xs font-semibold text-white">{ds.name}</h4>
                    <p className="text-[10px] text-white/50">{ds.sub}</p>
                  </div>
                  <button
                    onClick={() => handleBulkImport(ds.source)}
                    className="w-full py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-hover text-xs font-medium text-white transition-colors"
                  >
                    Import Samples
                  </button>
                </div>
              ))}
            </div>

            {/* Inventory Table */}
            <div className="glass-panel rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-white">Catalog Inventory</h3>
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input 
                    type="text" 
                    placeholder="Search by name or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="glass-input !py-1.5 !pl-8 text-xs"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-white/40 border-b border-border bg-black/10 dark:bg-black/20">
                      <th className="px-4 py-3 font-medium">Product</th>
                      <th className="px-4 py-3 font-medium">Category</th>
                      <th className="px-4 py-3 font-medium">Price</th>
                      <th className="px-4 py-3 font-medium">Stock</th>
                      <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-surface-hover transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              referrerPolicy="no-referrer" 
                              className="w-8 h-8 rounded object-contain bg-zinc-800 p-1 shrink-0" 
                            />
                            <span className="font-medium text-white truncate max-w-xs">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded bg-black/20 text-white/70 border border-border text-[11px]">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-white tabular-nums">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-4 py-3 tabular-nums">
                          <span className={`font-medium ${product.stock > 10 ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {product.stock} units
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button 
                              onClick={() => handleOpenModal(product)}
                              className="p-1 text-white/50 hover:text-white transition-colors"
                              title="Edit item"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product._id)}
                              className="p-1 text-white/50 hover:text-rose-400 transition-colors"
                              title="Delete item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="glass-panel w-full max-w-md rounded-xl p-6 relative z-10 space-y-4">
            <h3 className="text-base font-semibold text-white">
              {editingProduct ? 'Edit Inventory Item' : 'New Product Entry'}
            </h3>
            
            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-white/60">Product Name</label>
                <input 
                  type="text" 
                  required
                  className="glass-input !pl-3" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-white/60">Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    step="0.01"
                    className="glass-input !pl-3" 
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/60">Stock Level</label>
                  <input 
                    type="number" 
                    required
                    className="glass-input !pl-3" 
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs text-white/60">Category</label>
                <input 
                  type="text" 
                  required
                  className="glass-input !pl-3" 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs text-white/60">Image URL</label>
                <input 
                  type="text" 
                  required
                  className="glass-input !pl-3" 
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded-lg border border-border bg-surface hover:bg-surface-hover text-xs font-medium text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary flex-1 py-2 text-xs"
                >
                  {editingProduct ? 'Update Item' : 'Create Item'}
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
