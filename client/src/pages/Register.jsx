import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, AlertCircle, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const { register, error, loading, setError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      await register(name, email, password, isAdmin ? 'admin' : 'user');
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="glass-panel rounded-xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold mb-2 shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-white">Create Account</h1>
            <p className="text-xs text-white/50">Register to access curated products and orders</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/70">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  className="glass-input !pl-9"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/70">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  className="glass-input !pl-9"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/70">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  className="glass-input !pl-9"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border bg-black/10 dark:bg-black/20 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="w-4 h-4 rounded border-border text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-medium text-white/80">Register as Administrator</span>
            </label>

            <button 
              type="submit" 
              className="btn-primary flex items-center justify-center gap-2 mt-2"
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-white/50 pt-2 border-t border-border">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
