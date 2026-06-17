import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get('/api/wishlist', getHeaders());
      setWishlist(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist(null);
      setLoading(false);
    }
  }, [user]);

  const addToWishlist = async (productId) => {
    try {
      const { data } = await axios.post('/api/wishlist', { productId }, getHeaders());
      setWishlist(data);
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const { data } = await axios.delete(`/api/wishlist/${productId}`, getHeaders());
      setWishlist(data);
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
  };

  const isInWishlist = (productId) => {
    if (!wishlist || !wishlist.products) return false;
    return wishlist.products.some(p => {
      const id = p._id || p;
      return id.toString() === productId.toString();
    });
  };

  const wishlistCount = wishlist?.products?.length || 0;

  return (
    <WishlistContext.Provider value={{ wishlist, loading, addToWishlist, removeFromWishlist, isInWishlist, wishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
};
