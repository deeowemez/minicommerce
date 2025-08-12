/**
 * src/contexts/ProductContext.tsx
 */

import React, { createContext, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

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
      const response = await api.get('/api/products');
      return response.data;
    },
  });

  const featuredProducts = products?.filter((p) => p.isFeatured) ?? null;

  const fetchById = async (id: string): Promise<Product> => {
    // Try cached product list first
    const cachedList = queryClient.getQueryData<Product[]>(['products']);
    const foundFromList = cachedList?.find((p) => String(p.id) === String(id));
    if (foundFromList) return foundFromList;

    // Try cached individual product query
    const cachedProduct = queryClient.getQueryData<Product>(['product', id]);
    if (cachedProduct) return cachedProduct;

    // Fetch from API
    const response = await api.get(`/api/products/${id}`);
    const fetchedProduct = response.data;

    // Store in React Query cache (list + individual key)
    queryClient.setQueryData(['product', id], fetchedProduct);
    queryClient.setQueryData(['products'], (old?: Product[]) =>
      old ? [...old, fetchedProduct] : [fetchedProduct]
    );

    return fetchedProduct;
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
