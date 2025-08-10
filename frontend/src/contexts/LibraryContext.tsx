/**
 * src/contexts/LibraryContext.tsx
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { type CartItem } from './CartContext';

interface LibraryState {
  items: CartItem[];
}

type LibraryAction =
  | { type: 'ADD'; payload: CartItem }
  | { type: 'REMOVE'; payload: { productId: string } }
  | { type: 'LOAD'; payload: CartItem[] };

interface LibraryContextType {
  items: CartItem[];
  addToLibrary: (item: CartItem) => void;
  removeFromLibrary: (productId: string) => void;
  ownsProduct: (productId: string) => boolean;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const useLibrary = (): LibraryContextType => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryContextProvider');
  }
  return context;
};

const libraryReducer = (state: LibraryState, action: LibraryAction): LibraryState => {
  switch (action.type) {
    case 'ADD':
      if (state.items.some(i => i.productId === action.payload.productId)) return state;
      return { items: [...state.items, action.payload] };
    case 'REMOVE':
      return { items: state.items.filter(i => i.productId !== action.payload.productId) };
    case 'LOAD':
      return { items: action.payload };
    default:
      return state;
  }
};

export const LibraryContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(libraryReducer, { items: [] });

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('library');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CartItem[];
        dispatch({ type: 'LOAD', payload: parsed });
      } catch {
        console.warn('Failed to parse library from localStorage');
      }
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem('library', JSON.stringify(state.items));
  }, [state.items]);

  const addToLibrary = (item: CartItem) => dispatch({ type: 'ADD', payload: item });
  const removeFromLibrary = (productId: string) => dispatch({ type: 'REMOVE', payload: { productId } });
  const ownsProduct = (productId: string) => state.items.some(i => i.productId === productId);

  return (
    <LibraryContext.Provider value={{ items: state.items, addToLibrary, removeFromLibrary, ownsProduct }}>
      {children}
    </LibraryContext.Provider>
  );
};

export default LibraryContext;
