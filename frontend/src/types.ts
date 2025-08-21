/**
 * src/types.ts
 */

import { type ReactNode } from 'react';

export interface BaseLayoutProps {
  children?: ReactNode;
  disablePadding?: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isFeatured?: boolean;
}

export interface ProductCardProps {
  product: Product;
}

export interface ProvidersProps {
  children: React.ReactNode;
}

