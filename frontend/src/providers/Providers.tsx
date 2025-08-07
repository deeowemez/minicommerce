/**
 * src/providers/Providers.tsx
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContextProvider } from '../contexts/AuthContext';
import { CartContextProvider } from '../contexts/CartContext';
import { ProductContextProvider } from '../contexts/ProductContext';

const queryClient = new QueryClient();

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <CartContextProvider>
          <ProductContextProvider>
            {children}
          </ProductContextProvider>
        </CartContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
};

export default Providers;
