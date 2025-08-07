/**
 * src/contexts/ProductContext.tsx
 */

import React, { createContext, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isFeatured?: boolean;
}

interface ProductContextType {
  products: Product[] | null;
  featuredProducts: Product[] | null;
  fetchById: (id: string) => Promise<Product>;
  isLoading: boolean;
  error: Error | null;
}

const ProductContext = createContext<ProductContextType>({
  products: null,
  featuredProducts: null,
  fetchById: async () => {
    throw new Error('fetchById not implemented');
  },
  isLoading: false,
  error: null,
});

export const useProducts = () => useContext(ProductContext);

export const ProductContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await axios.get('/api/products');
      return response.data;
    },
  });

  const featuredProducts = products?.filter((p) => p.isFeatured) ?? null;

  const fetchById = async (id: string): Promise<Product> => {
    const cached = queryClient.getQueryData<Product[]>(['products']);
    const found = cached?.find((p) => p.id === id);
    if (found) return found;

    const response = await axios.get(`/api/products/${id}`);
    return response.data;
  };

  return (
    <ProductContext.Provider
      value={{
        products: products ?? null,
        featuredProducts,
        fetchById,
        isLoading,
        error: error ?? null,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
