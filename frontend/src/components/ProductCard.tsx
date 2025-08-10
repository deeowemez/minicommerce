/**
 * src/components/ProductCard.tsx
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { type Product } from '../contexts/ProductContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden">
      <Link to={`/products/${product.id}`} className="block">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
          <p className="text-indigo-600 font-bold mt-1">₱{product.price.toFixed(2)}</p>
          {product.description && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{product.description}</p>
          )}
          {product.isFeatured && (
            <span className="inline-block mt-3 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
              Featured
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
