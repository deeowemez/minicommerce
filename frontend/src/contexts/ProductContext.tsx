/**
 * src/contexts/ProductContext.tsx
 */

import React, { createContext, useContext } from 'react';
import { useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import api from '../lib/axios';
import type { Product } from '../types';

interface ProductContextType {
  products: Product[] | null;
  featuredProducts: Product[] | null;
  fetchById: (id: string) => Promise<Product>;
  deleteById: (id: string) => Promise<void>;
  useProductById: (id: string | undefined) => UseQueryResult<Product, Error>;
  isLoading: boolean;
  error: Error | null;
}

const ProductContext = createContext<ProductContextType>({
  products: null,
  featuredProducts: null,
  fetchById: async () => {
    throw new Error('fetchById not implemented');
  },
  deleteById: async () => {
    throw new Error('deleteById not implemented');
  },
  useProductById: () => {
    throw new Error('useProductById not implemented');
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
      const response = await api.get('/api/products');
      return response.data;
    },
  });

  const featuredProducts = products?.filter((p) => p.isFeatured) ?? null;

  const fetchById = async (id: string): Promise<Product> => {
    const cached = queryClient.getQueryData<Product>(['product', id]);
    if (cached) return cached;
    const response = await api.get(`/api/products/${id}`);
    const fetchedProduct = response.data;
    queryClient.setQueryData(['product', id], fetchedProduct);
    return fetchedProduct;
  };

  // ✅ central deletion method
  const deleteById = async (id: string) => {
    await api.delete(`/api/products/${id}`);
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.removeQueries({ queryKey: ['product', id] });
  };

  const useProductById = (id: string | undefined) =>
    useQuery<Product, Error>({
      queryKey: ['product', id],
      queryFn: () => {
        if (!id) throw new Error('Product ID is required');
        return fetchById(id);
      },
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
    });

  return (
    <ProductContext.Provider
      value={{
        products: products ?? null,
        featuredProducts,
        fetchById,
        deleteById,
        useProductById,
        isLoading,
        error: error ?? null,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
