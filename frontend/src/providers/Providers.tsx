/**
 * src/providers/Providers.tsx
 */

import React from 'react';
import { AuthContextProvider } from '../contexts/AuthContext';
import { CartContextProvider } from '../contexts/CartContext';
import { ProductContextProvider } from '../contexts/ProductContext';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <AuthContextProvider>
      <CartContextProvider>
        <ProductContextProvider>
          {children}
        </ProductContextProvider>
      </CartContextProvider>
    </AuthContextProvider>
  );
};

export default Providers;
