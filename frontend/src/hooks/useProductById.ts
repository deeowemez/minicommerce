/**
 * src/hooks/useProductById.ts
 */


import { useQuery } from '@tanstack/react-query';
import { useProducts } from '../contexts/ProductContext';
import { type Product } from '../types';

export const useProductById = (id: string | undefined) => {
  const { fetchById } = useProducts();

  return useQuery<Product, Error>({
    queryKey: ['product', id],
    queryFn: () => {
      if (!id) throw new Error('Product ID is required');
      return fetchById(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};
