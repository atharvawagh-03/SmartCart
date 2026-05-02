import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { LogOut, User, ShoppingBag, Package, ShoppingCart, Shield } from 'lucide-react';
import RecommendedProducts from '../components/RecommendedProducts';

const Home = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <div className="min-h-screen p-6 md:p-12">
      <nav className="flex justify-between items-center mb-12 glass-panel rounded-2xl p-4 px-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <ShoppingBag className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            SmartCart
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          {user?.role === 'admin' && (
            <Link 
              to="/admin"
              className="hidden md:flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          )}
          <Link 
            to="/products"
            className="hidden md:flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>Products</span>
          </Link>
          <Link 
            to="/cart"
            className="hidden md:flex items-center gap-2 text-white/80 hover:text-white transition-colors relative"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-purple-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <div className="hidden md:flex items-center gap-2 text-white/80">
            <User className="w-4 h-4" />
            <span>{user?.name}</span>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-red-400 hover:text-red-300"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto">
        <div className="glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{user?.name}</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mb-8">
            You have successfully authenticated into your dashboard. Your JWT token is securely stored and managed via context.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/20 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-medium mb-2 text-purple-400">Your Profile</h3>
              <div className="space-y-2 text-sm text-white/70">
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.role || 'User'}</p>
              </div>
            </div>
          </div>
          
          <RecommendedProducts />
        </div>
      </main>
    </div>
  );
};

export default Home;
