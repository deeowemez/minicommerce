/**
 * src/contexts/CartContext.tsx
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../lib/axios';

export interface Product {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface CartState {
  items: Product[];
}

type CartAction =
  | { type: 'LOAD'; payload: Product[] }
  | { type: 'ADD'; payload: Product }
  | { type: 'REMOVE'; payload: string }
  | { type: 'CLEAR' };

interface CartContextType {
  items: Product[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'LOAD':
      return { items: action.payload };
    case 'ADD':
      const exists = state.items.some(item => item.productId === action.payload.productId);
      if (exists) { return state };
      return { items: [...state.items, action.payload] };
    case 'REMOVE':
      return { items: state.items.filter((item) => item.productId !== action.payload) };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
};

export const CartContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/api/cart/${user.uid}`);
      dispatch({ type: 'LOAD', payload: res.data.items || [] });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const addToCart = async (product: Product) => {
    if (!user) return;
    try {
      await api.post(`/api/cart/${user.uid}`, { product });
      dispatch({ type: 'ADD', payload: product });
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;
    try {
      await api.delete(`/api/cart/${user.uid}/${productId}`);
      dispatch({ type: 'REMOVE', payload: productId });
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await api.delete(`/api/cart/${user.uid}`);
      dispatch({ type: 'CLEAR' });
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{ items: state.items, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
