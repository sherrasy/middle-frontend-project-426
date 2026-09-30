import { ReactNode, useEffect, useState } from 'react';
import { getInitialCart } from '../lib/getInitialCart';
import { Cart, CartContext } from '../model/useCart';

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<Cart>(getInitialCart);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (productId: string | number, quantity: number = 1) => {
    const qty = Number(quantity);
    if (qty <= 0) return;

    const id = String(productId);
    setCart((prevCart) => ({
      ...prevCart,
      [id]: (prevCart[id] || 0) + qty,
    }));
  };

  const removeFromCart = (productId: string | number) => {
    const id = String(productId);
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      delete newCart[id];
      return newCart;
    });
  };

  const updateQuantity = (productId: string | number, quantity: number) => {
    const id = String(productId);
    const qty = Number(quantity);
    if (qty <= 0) {
      removeFromCart(id);
    } else {
      setCart((prevCart) => ({
        ...prevCart,
        [id]: qty,
      }));
    }
  };

  const clearCart = () => {
    setCart({});
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce(
      (sum, quantity) => sum + Number(quantity),
      0,
    );
  };

  const getItemQuantity = (productId: string | number) => {
    return cart[String(productId)] || 0;
  };

  const isEmpty = () => {
    return Object.keys(cart).length === 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getItemQuantity,
        isEmpty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
