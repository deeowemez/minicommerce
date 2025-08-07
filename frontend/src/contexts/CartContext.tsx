/**
 * src/contexts/ProductContext.tsx
 */

// src/contexts/CartContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  ownsProduct: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => { },
  removeItem: () => { },
  clearCart: () => { },
  ownsProduct: () => false,
});

export const useCart = () => useContext(CartContext);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const alreadyOwned = state.items.some(i => i.productId === action.payload.productId);
      if (alreadyOwned) return state;
      return { items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return {
        items: state.items.filter(i => i.productId !== action.payload.productId),
      };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
};

export const CartContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    const stored = localStorage.getItem('library');
    if (stored) {
      dispatch({ type: 'CLEAR_CART' });
      JSON.parse(stored).forEach((item: CartItem) => {
        dispatch({ type: 'ADD_ITEM', payload: item });
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('library', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (productId: string) => dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const ownsProduct = (productId: string) =>
    state.items.some(item => item.productId === productId);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        clearCart,
        ownsProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
