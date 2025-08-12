/**
 * src/contexts/CartContext.tsx
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLibrary } from './LibraryContext';
import { useAuth } from './AuthContext';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
}

export interface Product {
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
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  checkout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'LOAD':
      return { items: action.payload };
    case 'ADD': {
      const exists = state.items.some((item) => item.productId === action.payload.productId);
      if (exists) return state;
      return { items: [...state.items, action.payload] };
    }
    case 'REMOVE':
      return { items: state.items.filter((item) => item.productId !== action.payload) };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
};

export const CartContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToLibrary } = useLibrary();
  const { user } = useAuth();

  const storageKey = user ? `cart_${user.uid}` : 'cart_guest';

  const loadCart = (): Product[] => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const [state, dispatch] = useReducer(cartReducer, { items: loadCart() });

  useEffect(() => {
    dispatch({ type: 'LOAD', payload: loadCart() });
  }, [user]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state.items));
  }, [state.items, storageKey]);

  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD', payload: product });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE', payload: productId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR' });
  };

  const checkout = () => {
    state.items.forEach((item) => {
      addToLibrary(item);
    });
    dispatch({ type: 'CLEAR' });
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addToCart,
        removeFromCart,
        clearCart,
        checkout,
      }}
    >
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
