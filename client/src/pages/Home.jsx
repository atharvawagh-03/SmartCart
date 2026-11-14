import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Package, 
  ShoppingCart, 
  Shield, 
  ClipboardList, 
  Smartphone, 
  Shirt, 
  Zap, 
  Heart, 
  Monitor, 
  Headphones, 
  Watch, 
  Footprints, 
  Handbag, 
  Tv, 
  Baby, 
  Droplet, 
  Gamepad2, 
  Puzzle, 
  Dices, 
  Bike, 
  Dumbbell, 
  Tent,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import RecommendedProducts from '../components/RecommendedProducts';
import UserMenu from '../components/UserMenu';

const Home = () => {
  const { user } = useAuth();
  const { cartCount } = useCart();

  const categories = [
    { name: 'Electronics', icon: Zap },
    { name: 'Smartphones', icon: Smartphone },
    { name: 'Laptops', icon: Monitor },
    { name: 'Audio', icon: Headphones },
    { name: 'Wearables', icon: Watch },
    { name: 'Clothing', icon: Shirt },
    { name: 'Footwear', icon: Footprints },
    { name: 'Accessories', icon: Handbag },
    { name: 'Computers', icon: Monitor },
    { name: 'Televisions', icon: Tv },
    { name: 'Appliances', icon: Zap },
    { name: 'Personal Care', icon: Baby },
    { name: 'Bags', icon: Handbag },
    { name: 'Skincare', icon: Droplet },
    { name: "Women's Clothing", icon: Shirt },
    { name: "Women's Footwear", icon: Footprints },
    { name: "Women's Accessories", icon: Handbag },
    { name: 'Beauty & Makeup', icon: Heart },
    { name: 'Toys', icon: Gamepad2 },
    { name: 'Board Games', icon: Dices },
    { name: 'Puzzles', icon: Puzzle },
    { name: 'Video Games', icon: Gamepad2 },
    { name: 'Sports Equipment', icon: Dumbbell },
    { name: 'Cycling', icon: Bike },
    { name: 'Fitness', icon: Dumbbell },
    { name: 'Camping', icon: Tent },
    { name: 'Kids Clothing', icon: Shirt },
  ];

  return (
    <div className="min-h-screen pb-16">
      {/* ── Navigation Header ── */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-base font-semibold tracking-tight text-white">
              SmartCart
            </span>
          </div>
          
          <nav className="flex items-center gap-5">
            {user?.role === 'admin' && (
              <Link 
                to="/admin"
                className="hidden md:flex items-center gap-1.5 text-xs font-medium text-white/70 hover:text-white transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}
            <Link 
              to="/products"
              className="hidden md:flex items-center gap-1.5 text-xs font-medium text-white/70 hover:text-white transition-colors"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </Link>
            <Link 
              to="/orders"
              className="hidden md:flex items-center gap-1.5 text-xs font-medium text-white/70 hover:text-white transition-colors"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Orders</span>
            </Link>
            <Link 
              to="/cart"
              className="relative p-2 text-white/70 hover:text-white transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 bg-blue-600 text-white text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </Link>
            <UserMenu />
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* ── Category Scroller ── */}
        <section aria-label="Product Categories">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  to="/products"
                  state={{ category: category.name }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-hover hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors shrink-0 text-xs text-white/80 hover:text-white"
                >
                  <Icon className="w-3.5 h-3.5 text-white/60" />
                  <span>{category.name}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Customer Hub / Welcome Section ── */}
        <section className="glass-panel rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Account</span>
              </div>
              
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-2">
                  Welcome back, {user?.name || 'Customer'}
                </h1>
                <p className="text-sm text-white/60 max-w-xl leading-relaxed">
                  Browse curated collections, manage your active deliveries, or pick up where you left off.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/products"
                  className="btn-primary !w-auto inline-flex items-center gap-2 px-4 py-2 text-xs"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/orders"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-surface hover:bg-surface-hover text-xs font-medium text-white transition-colors"
                >
                  <ClipboardList className="w-3.5 h-3.5 text-white/60" />
                  <span>Track Recent Orders</span>
                </Link>
              </div>
            </div>

            {/* Account Quick Glance */}
            <div className="rounded-xl border border-border bg-black/10 dark:bg-black/30 p-4 space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider text-white/40">Account Overview</p>
              <div className="space-y-1.5 text-xs text-white/70">
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-white/50">Name</span>
                  <span className="font-medium text-white">{user?.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-white/50">Email</span>
                  <span className="font-medium text-white">{user?.email}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-white/50">Membership</span>
                  <span className="font-medium text-blue-500 capitalize">{user?.role || 'Standard'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Recommendations ── */}
        <RecommendedProducts />
      </div>
    </div>
  );
};

export default Home;
