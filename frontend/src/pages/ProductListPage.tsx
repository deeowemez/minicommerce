/**
 * src/pages/ProductListPage.tsx
 */

import React from 'react';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ProductCard';

const ProductListPage: React.FC = () => {
  const { products, isLoading, error } = useProducts();

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error.message}</div>;
  }

  if (!products || products.length === 0) {
    return <div className="text-center py-12 text-gray-400">No products available.</div>;
  }

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">Available Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductListPage;
