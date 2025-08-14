/**
 * src/pages/admin/AdminProductList.tsx
 */

import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import clsx from 'clsx';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: string; // ISO date string
}

const AdminProductList: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = await user?.getIdToken?.();
        const res = await fetch('/api/admin/products', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch products (${res.status})`);
        }

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError('Could not load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  const filteredProducts = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(lowerSearch)
    );
  }, [products, search]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 px-3 py-2 border rounded w-full max-w-md"
      />

      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Created</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="p-2 border">{product.name}</td>
                <td className="p-2 border">₱{product.price.toFixed(2)}</td>
                <td className={clsx('p-2 border', product.stock === 0 && 'text-red-500')}>
                  {product.stock}
                </td>
                <td className="p-2 border">
                  {format(new Date(product.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="p-2 border">
                  <Link
                    to={`/admin/products/${product.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminProductList;
