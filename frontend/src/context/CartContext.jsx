import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

// Unique key per product+variant combination
const itemKey = (product) => `${product._id}_${product.variantVolume || product.volume || 'default'}`;

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    const key = itemKey(product);
    setCart(prev => {
      const existing = prev.find(i => itemKey(i) === key);
      if (existing) {
        return prev.map(i => itemKey(i) === key ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { ...product, cartKey: key, quantity }];
    });
    // Send a lightweight abandoned-cart snapshot (throttled to once per hour)
    try {
      const last = Number(localStorage.getItem('lastAbandonedSent') || 0);
      const now = Date.now();
      if (now - last > 1000 * 60 * 60) {
        localStorage.setItem('lastAbandonedSent', String(now));
        const snapshot = { cart: JSON.parse(localStorage.getItem('cart') || '[]') };
        fetch('/api/marketing/abandoned', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(snapshot),
        }).catch(() => {});
      }
    } catch (e) {}
  };

  const removeFromCart = (key) => setCart(prev => prev.filter(i => (i.cartKey || itemKey(i)) !== key));

  const updateQuantity = (key, quantity) => {
    if (quantity < 1) return removeFromCart(key);
    setCart(prev => prev.map(i => (i.cartKey || itemKey(i)) === key ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
