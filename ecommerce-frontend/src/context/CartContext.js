import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CartContext = createContext();
const API = `${process.env.REACT_APP_API_URL}/api`;
const getSessionKey = () => localStorage.getItem('cart_session') || '';

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total: 0, item_count: 0 });
  const [loading, setLoading] = useState(false);

  const headers = () => {
    const sk = getSessionKey();
    return sk ? { 'X-Cart-Session': sk } : {};
  };

  const saveSession = (data) => {
    if (data.session_key) localStorage.setItem('cart_session', data.session_key);
    setCart({ items: data.items || [], total: data.total || 0, item_count: data.item_count || 0 });
  };

  const fetchCart = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/cart/`, { headers: headers() });
      saveSession(data);
    } catch {}
  }, []);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/cart/add/`, { product_id: productId, quantity }, { headers: headers() });
      saveSession(data);
      toast.success('Added to cart!', { icon: '🛒' });
    } catch {
      toast.error('Failed to add to cart');
    } finally { setLoading(false); }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      const { data } = await axios.put(`${API}/cart/item/${itemId}/`, { quantity }, { headers: headers() });
      setCart({ items: data.items || [], total: data.total || 0, item_count: data.item_count || 0 });
    } catch { toast.error('Update failed'); }
  };

  const removeItem = async (itemId) => {
    try {
      const { data } = await axios.delete(`${API}/cart/item/${itemId}/remove/`, { headers: headers() });
      setCart({ items: data.items || [], total: data.total || 0, item_count: data.item_count || 0 });
      toast.success('Item removed');
    } catch { toast.error('Remove failed'); }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateItem, removeItem, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
