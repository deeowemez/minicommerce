/**
 * src/contexts/CartContext.tsx
 */

import React, { createContext, useContext, useState } from 'react';
import { useLibrary } from './LibraryContext';

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
  const [items, setItems] = useState<Product[]>([]);
  const { addToLibrary } = useLibrary();

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
