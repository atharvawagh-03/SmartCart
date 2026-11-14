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
  CheckCircle2,
  Truck,
  Sparkles,
  ShieldCheck,
  Search
} from 'lucide-react';
import RecommendedProducts from '../components/RecommendedProducts';
import UserMenu from '../components/UserMenu';
import Hero3DVisual from '../components/Hero3DVisual';

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

  const scrollToPicks = () => {
    const el = document.getElementById('curated-picks');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-20">
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
            {user && (
              <Link 
                to="/orders"
                className="hidden md:flex items-center gap-1.5 text-xs font-medium text-white/70 hover:text-white transition-colors"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>Orders</span>
              </Link>
            )}
            <Link 
              to="/cart"
              className="relative p-2 text-white/70 hover:text-white transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-blue-600 text-white text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <UserMenu />
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  to="/login"
                  className="text-xs font-medium text-white/80 hover:text-white transition-colors px-2.5 py-1"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register"
                  className="btn-primary !w-auto text-xs px-3.5 py-1.5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-12">
        {/* ── 3D Interactive Hero Section ── */}
        <section className="glass-panel rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="font-mono text-[11px] tracking-wide uppercase">Engineered Retail Platform</span>
              </div>
              
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-[1.12]">
                  Curated electronics, essentials, and everyday design.
                </h1>
                <p className="text-sm sm:text-base text-white/60 max-w-lg leading-relaxed">
                  Experience a precision marketplace with verified suppliers, live inventory tracking, and zero friction checkout.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/products"
                  className="btn-primary !w-auto inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={scrollToPicks}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-surface hover:bg-surface-hover text-sm font-medium text-white transition-colors cursor-pointer"
                >
                  <span>Curated Picks</span>
                </button>
              </div>

              {/* High-craft stats strip */}
              <div className="pt-6 border-t border-border grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-white font-mono">40+</p>
                  <p className="text-[11px] text-white/50 uppercase tracking-wider mt-0.5">Categories</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-white font-mono">&lt; 24h</p>
                  <p className="text-[11px] text-white/50 uppercase tracking-wider mt-0.5">Dispatch</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-white font-mono">100%</p>
                  <p className="text-[11px] text-white/50 uppercase tracking-wider mt-0.5">Verified Stock</p>
                </div>
              </div>
            </div>

            {/* Right 3D Visual Column */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="w-full rounded-2xl border border-border/80 bg-zinc-950/60 shadow-inner overflow-hidden relative">
                {/* Visual coordinate markings */}
                <div className="absolute top-3 left-3 text-[10px] font-mono text-white/30 z-10 pointer-events-none">
                  SC-3D // INTERACTIVE
                </div>
                
                {/* 3D Canvas Scene */}
                <Hero3DVisual />
              </div>
            </div>

          </div>
        </section>

        {/* ── Category Scroller ── */}
        <section aria-label="Product Categories" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Browse by Department
            </h2>
            <Link to="/products" className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors">
              All categories &rarr;
            </Link>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  to="/products"
                  state={{ category: category.name }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface hover:bg-surface-hover hover:border-zinc-500 dark:hover:border-zinc-700 transition-colors shrink-0 text-xs text-white/80 hover:text-white"
                >
                  <Icon className="w-3.5 h-3.5 text-white/60" />
                  <span>{category.name}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Value Pillars ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel p-5 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">Direct Authentic Sourcing</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Every item in our inventory passes strict supplier validation and serial inspection.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">Live Logistics Sync</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Track your package from fulfillment center to your doorstep with real-time updates.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">Personal Concierge</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Compare specs, ask for budget setups, and receive intelligent advice on demand.
            </p>
          </div>
        </section>

        {/* ── Customer Account Overview or Guest CTA ── */}
        <section className="glass-panel rounded-2xl p-6 sm:p-8">
          {user ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Account Active</p>
                <h2 className="text-xl font-semibold text-white mt-1">
                  Signed in as {user?.name || 'Customer'}
                </h2>
                <p className="text-xs text-white/60 mt-0.5">
                  {user?.email} · {user?.role === 'admin' ? 'Administrator' : 'Standard Member'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/orders"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-surface hover:bg-surface-hover text-xs font-medium text-white transition-colors"
                >
                  <ClipboardList className="w-3.5 h-3.5 text-white/60" />
                  <span>My Orders</span>
                </Link>
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-surface hover:bg-surface-hover text-xs font-medium text-white transition-colors"
                >
                  <span>Edit Profile</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Member Access</p>
                <h2 className="text-xl font-semibold text-white mt-1">
                  Sign in to track orders and save preferences
                </h2>
                <p className="text-xs text-white/60 mt-0.5">
                  Save items to your wishlist, manage delivery addresses, and receive real-time dispatch alerts.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-surface hover:bg-surface-hover text-xs font-medium text-white transition-colors"
                >
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="btn-primary !w-auto text-xs px-4 py-2 inline-flex items-center gap-1.5"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* ── Curated Recommendations Rail ── */}
        <div id="curated-picks">
          <RecommendedProducts />
        </div>
      </div>
    </div>
  );
};

export default Home;
