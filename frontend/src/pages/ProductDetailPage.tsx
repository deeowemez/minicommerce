/**
 * src/pages/ProductDetailPage.tsx
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useLibrary } from '../contexts/LibraryContext';
import { type Product } from '../types';
import toast from 'react-hot-toast';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchById } = useProducts();
  const { addToCart } = useCart();
  const { ownsProduct } = useLibrary();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetchById(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Product not found');
        setLoading(false);
      });
  }, [id, fetchById]);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading product...</div>;
  }

  if (error || !product) {
    return <div className="text-center py-12 text-red-500">{error ?? 'Product not found'}</div>;
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 bg-white rounded shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover rounded"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-indigo-600 text-xl font-semibold mt-2">₱{product.price.toFixed(2)}</p>
          {product.isFeatured && (
            <span className="inline-block mt-3 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
              Featured
            </span>
          )}
          <p className="mt-4 text-gray-700">{product.description}</p>

          {!ownsProduct(product.id) ? (
            <button
              onClick={handleAddToCart}
              className="cursor-pointer mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Add to Cart
            </button>
          ) : (
            <p className="mt-6 text-sm text-green-600">You already own this product.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;
