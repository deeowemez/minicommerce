/**
 * src/providers/Providers.tsx
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContextProvider } from '../contexts/AuthContext';
import { CartContextProvider } from '../contexts/CartContext';
import { LibraryContextProvider } from '../contexts/LibraryContext';
import { OrderContextProvider } from '../contexts/OrderContext';
import { ProductContextProvider } from '../contexts/ProductContext';
import { type ProvidersProps } from '../types';

const queryClient = new QueryClient();

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <LibraryContextProvider>
          <CartContextProvider>
            <ProductContextProvider>
              <OrderContextProvider>
                {children}
              </OrderContextProvider>
            </ProductContextProvider>
          </CartContextProvider>
        </LibraryContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
};

export default Providers;
