/**
 * src/pages/admin/AdminProductList.tsx
 */

// src/pages/admin/AdminProductList.tsx
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import { useMutation } from '@tanstack/react-query';
import { TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AdminProductList: React.FC = () => {
  const { products, isLoading, error, deleteById } = useProducts();
  const [search, setSearch] = useState('');
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteById(id);
    },
    onSuccess: () => {
      toast.success('Product deleted successfully!');
      setConfirmId(null);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to delete product.');
    }
  });

  const filteredProducts = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return products?.filter(p => p.name.toLowerCase().includes(lowerSearch)) ?? [];
  }, [products, search]);

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 px-3 py-2 border rounded w-full max-w-md"
      />

      {isLoading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : error ? (
        <p className="text-red-500">Could not load products. Please try again.</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Edit</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="p-2 border">{product.name}</td>
                <td className="p-2 border">{product.description}</td>
                <td className="p-2 border">₱{product.price.toFixed(2)}</td>
                <td className="p-2 border">
                  <Link
                    to={`/admin/products/${product.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
                <td className="p-2 border text-center">
                  <button onClick={() => setConfirmId(product.id)} title="Delete product">
                    <TrashIcon className="cursor-pointer w-4 h-4 text-red-500 hover:text-red-700 transition-colors" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {confirmId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Delete Product</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmId(null)}
                className="cursor-pointer px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(confirmId)}
                disabled={deleteMutation.isPending}
                className="cursor-pointer px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductList;
