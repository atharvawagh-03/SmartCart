import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, AlertCircle, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading, setError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      await login(email, password);
    } catch (err) {
      console.error("Login failed:", err);
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
            <h1 className="text-xl font-semibold tracking-tight text-white">Sign In to SmartCart</h1>
            <p className="text-xs text-white/50">Enter your credentials to access your account</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-white/70">Password</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  className="glass-input !pl-9"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary flex items-center justify-center gap-2 mt-2"
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-white/50 pt-2 border-t border-border">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
