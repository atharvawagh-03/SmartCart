import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, ShoppingCart, Shield, ClipboardList, Smartphone, Shirt, Zap, Sparkles, Heart, Monitor, Headphones, Watch, Footprints, Handbag, Tv, Baby, Droplet, Gamepad2, Puzzle, Dices, Bike, Dumbbell, Tent } from 'lucide-react';
import RecommendedProducts from '../components/RecommendedProducts';
import UserMenu from '../components/UserMenu';

const Home = () => {
  const { user } = useAuth();
  const { cartCount } = useCart();

  const categories = [
    { name: 'For You', icon: Sparkles, color: 'text-yellow-400' },
    { name: 'Electronics', icon: Zap, color: 'text-purple-400' },
    { name: 'Smartphones', icon: Smartphone, color: 'text-blue-400' },
    { name: 'Laptops', icon: Monitor, color: 'text-cyan-400' },
    { name: 'Audio', icon: Headphones, color: 'text-pink-400' },
    { name: 'Wearables', icon: Watch, color: 'text-emerald-400' },
    { name: 'Clothing', icon: Shirt, color: 'text-indigo-400' },
    { name: 'Footwear', icon: Footprints, color: 'text-orange-400' },
    { name: 'Accessories', icon: Handbag, color: 'text-amber-400' },
    { name: 'Computers', icon: Monitor, color: 'text-slate-400' },
    { name: 'Televisions', icon: Tv, color: 'text-red-400' },
    { name: 'Appliances', icon: Zap, color: 'text-yellow-400' },
    { name: 'Personal Care', icon: Baby, color: 'text-teal-400' },
    { name: 'Bags', icon: Handbag, color: 'text-violet-400' },
    { name: 'Skincare', icon: Droplet, color: 'text-rose-400' },
    { name: "Women's Clothing", icon: Shirt, color: 'text-fuchsia-400' },
    { name: "Women's Footwear", icon: Footprints, color: 'text-pink-400' },
    { name: "Women's Accessories", icon: Handbag, color: 'text-purple-400' },
    { name: 'Beauty & Makeup', icon: Heart, color: 'text-red-400' },
    { name: 'Toys', icon: Gamepad2, color: 'text-lime-400' },
    { name: 'Board Games', icon: Dices, color: 'text-amber-400' },
    { name: 'Puzzles', icon: Puzzle, color: 'text-teal-400' },
    { name: 'Building Blocks', icon: Gamepad2, color: 'text-orange-400' },
    { name: 'Video Games', icon: Gamepad2, color: 'text-purple-400' },
    { name: 'Dolls', icon: Baby, color: 'text-pink-400' },
    { name: 'Action Figures', icon: Gamepad2, color: 'text-red-400' },
    { name: 'Outdoor Toys', icon: Tent, color: 'text-green-400' },
    { name: 'Sports Equipment', icon: Dumbbell, color: 'text-blue-400' },
    { name: 'Football', icon: Gamepad2, color: 'text-emerald-400' },
    { name: 'Basketball', icon: Gamepad2, color: 'text-orange-400' },
    { name: 'Cricket', icon: Gamepad2, color: 'text-yellow-400' },
    { name: 'Tennis', icon: Gamepad2, color: 'text-lime-400' },
    { name: 'Badminton', icon: Gamepad2, color: 'text-cyan-400' },
    { name: 'Cycling', icon: Bike, color: 'text-indigo-400' },
    { name: 'Skateboarding', icon: Gamepad2, color: 'text-rose-400' },
    { name: 'Fitness', icon: Dumbbell, color: 'text-violet-400' },
    { name: 'Swimming', icon: Droplet, color: 'text-blue-400' },
    { name: 'Camping', icon: Tent, color: 'text-emerald-400' },
    { name: 'Kids Clothing', icon: Shirt, color: 'text-pink-400' },
    { name: 'Kids Footwear', icon: Footprints, color: 'text-amber-400' },
    { name: 'School Supplies', icon: Gamepad2, color: 'text-purple-400' },
  ];

  return (
    <div className="min-h-screen p-6 md:p-12">
      <nav className="relative z-50 flex justify-between items-center mb-8 glass-panel rounded-2xl p-4 px-6 max-w-6xl mx-auto">
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
            to="/orders"
            className="hidden md:flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ClipboardList className="w-4 h-4" />
            <span>My Orders</span>
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
          <UserMenu />
        </div>
      </nav>

      {/* Category Navigation */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="glass-panel rounded-2xl p-4">
          <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  to="/products"
                  state={{ category: category.name }}
                  className="flex flex-col items-center gap-2 px-3 py-3 rounded-xl hover:bg-white/10 transition-all group min-w-[90px] w-[90px] cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <Icon className={`w-6 h-6 ${category.color}`} />
                  </div>
                  <span className="text-xs text-white/70 group-hover:text-white transition-colors text-center leading-tight w-full break-words">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto">
        <div className="glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{user?.name}</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mb-8">
            You have successfully authenticated into your dashboard. Your JWT token is securely stored and managed via context.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              to="/orders"
              className="bg-black/20 border border-white/10 rounded-2xl p-6 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all group"
            >
              <ClipboardList className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-medium mb-2 text-purple-400">My Orders</h3>
              <p className="text-sm text-white/60">Track active orders and view your purchase history</p>
            </Link>
            <div className="bg-black/20 border border-white/10 rounded-2xl p-6 md:col-span-2">
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
