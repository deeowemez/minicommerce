/**
 * src/contexts/LibraryContext.tsx
 */

import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { type CartItem } from './CartContext';
import { useAuth } from './AuthContext';
import api from '../lib/axios';
import { useLocation } from 'react-router-dom';

interface LibraryState {
  items: CartItem[];
}

type LibraryAction =
  | { type: 'ADD'; payload: CartItem }
  | { type: 'REMOVE'; payload: { productId: string } }
  | { type: 'LOAD'; payload: CartItem[] };

interface LibraryContextType {
  items: CartItem[];
  addToLibrary: (item: CartItem) => Promise<void>;
  removeFromLibrary: (productId: string) => Promise<void>;
  ownsProduct: (productId: string) => boolean;
  reloadLibrary: () => Promise<void>;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const useLibrary = (): LibraryContextType => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryContextProvider');
  }
  return context;
};

const reducer = (state: LibraryState, action: LibraryAction): LibraryState => {
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
  const { user } = useAuth();
  const location = useLocation();
  const prevUserId = useRef<string | null>(null);
  const [state, dispatch] = useReducer(reducer, { items: [] });

  const fetchLibrary = async () => {
    if (!user?.uid) {
      dispatch({ type: 'LOAD', payload: [] });
      return;
    }
    try {
      const { data } = await api.get(`/api/library/${user.uid}`);
      dispatch({ type: 'LOAD', payload: data as CartItem[] });
    } catch (error) {
      console.error('Error loading library:', error);
      dispatch({ type: 'LOAD', payload: [] });
    }
  };

  // Fetch when user changes
  useEffect(() => {
    if (prevUserId.current !== user?.uid) {
      fetchLibrary();
      prevUserId.current = user?.uid || null;
    }
  }, [user?.uid]);

  // Fetch when navigating to /library
  useEffect(() => {
    if (location.pathname === '/library') {
      fetchLibrary();
    }
  }, [location.pathname]);

  const addToLibrary = async (item: CartItem) => {
    if (!user?.uid) return;
    dispatch({ type: 'ADD', payload: item });
    try {
      await api.post(`/api/library/${user.uid}`, { items: [...state.items, item] });
    } catch (err) {
      console.error('Error saving library (add):', err);
    }
  };

  const removeFromLibrary = async (productId: string) => {
    if (!user?.uid) return;
    dispatch({ type: 'REMOVE', payload: { productId } });
    try {
      await api.delete(`/api/library/${user.uid}/${productId}`);
    } catch (err) {
      console.error('Error saving library (remove):', err);
    }
  };

  const ownsProduct = (productId: string) =>
    state.items.some(i => i.productId === productId);

  return (
    <LibraryContext.Provider
      value={{
        items: state.items,
        addToLibrary,
        removeFromLibrary,
        ownsProduct,
        reloadLibrary: fetchLibrary,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export default LibraryContext;
