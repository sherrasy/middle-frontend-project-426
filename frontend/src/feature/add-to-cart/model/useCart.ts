import { createContext, useContext } from 'react';

export type Cart = Record<string, number>;

export interface CartContextType {
  cart: Cart;
  addToCart: (productId: string | number, quantity?: number) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getItemQuantity: (productId: string | number) => number;
  isEmpty: () => boolean;
}

export const CartContext = createContext<CartContextType | null>(null);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
