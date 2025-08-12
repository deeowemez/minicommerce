/**
 * src/contexts/LibraryContext.tsx
 */

import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { type CartItem } from './CartContext';
import { useAuth } from './AuthContext';

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
  const { user } = useAuth();
  const prevStorageKey = useRef<string | null>(null);

  // Decide which key to use
  const storageKey = user ? `library_${user.uid}` : 'library_guest';
  const [state, dispatch] = useReducer(libraryReducer, { items: [] });

  useEffect(() => {
    // Avoid reloading on every render — only when storage key changes
    if (prevStorageKey.current !== storageKey) {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as CartItem[];
          dispatch({ type: 'LOAD', payload: parsed });
        } catch {
          console.warn(`Failed to parse ${storageKey} from localStorage`);
          dispatch({ type: 'LOAD', payload: [] });
        }
      } else {
        dispatch({ type: 'LOAD', payload: [] });
      }
      prevStorageKey.current = storageKey;
    }
  }, [storageKey]);

  useEffect(() => {
    // Persist current items to the correct key
    localStorage.setItem(storageKey, JSON.stringify(state.items));
  }, [state.items, storageKey]);

  const addToLibrary = (item: CartItem) => dispatch({ type: 'ADD', payload: item });
  const removeFromLibrary = (productId: string) =>
    dispatch({ type: 'REMOVE', payload: { productId } });
  const ownsProduct = (productId: string) =>
    state.items.some(i => i.productId === productId);

  return (
    <LibraryContext.Provider value={{ items: state.items, addToLibrary, removeFromLibrary, ownsProduct }}>
      {children}
    </LibraryContext.Provider>
  );
};

export default LibraryContext;
