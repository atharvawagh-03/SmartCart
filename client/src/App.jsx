import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import RecentSearches from './pages/RecentSearches';
import Wishlist from './pages/Wishlist';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import { AIProvider } from './context/AIContext';
import NotificationToast from './components/NotificationToast';
import AIAssistant from './components/ai/AIAssistant';

// Redirect authenticated users away from login/register
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return user ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <CartProvider>
              <WishlistProvider>
                <AIProvider>
                  {/* Global overlays — rendered outside Routes so they appear on every page */}
                  <NotificationToast />
                  <AIAssistant />

                  <Routes>
                    {/* Public */}
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

                    {/* Protected */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/orders" element={<MyOrders />} />
                      <Route path="/recent-searches" element={<RecentSearches />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/settings" element={<Settings />} />
                    </Route>

                    {/* Admin */}
                    <Route element={<AdminRoute />}>
                      <Route path="/admin" element={<AdminDashboard />} />
                    </Route>

                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </AIProvider>
              </WishlistProvider>
            </CartProvider>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
