/**
 * src/types.ts
 */

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
