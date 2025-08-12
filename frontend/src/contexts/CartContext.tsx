/**
 * src/contexts/CartContext.tsx
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
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

interface CartContextType {
  items: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  checkout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

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

  const [items, setItems] = useState<Product[]>(loadCart);

  useEffect(() => {
    setItems(loadCart());
  }, [user]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  const addToCart = (product: Product) => {
    setItems((prev) => {
      const exists = prev.some((p) => p.productId === product.productId);
      return exists ? prev : [...prev, product];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const checkout = () => {
    items.forEach((item) => {
      addToLibrary(item);
    });
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, checkout }}>
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
