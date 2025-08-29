/**
 * src/pages/admin/AdminProductList.tsx
 */

import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import { useMutation } from '@tanstack/react-query';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import type { Product } from '../../types';

const AdminProductList: React.FC = () => {
  const { products, isLoading, error, deleteById } = useProducts();
  const [search, setSearch] = useState('');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

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

  // Filter by search
  const filteredProducts = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return (
      products?.filter((p: Product) =>
        p.name.toLowerCase().includes(lowerSearch)
      ) ?? []
    );
  }, [products, search]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <section className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Product List</h1>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium shadow-sm hover:bg-green-700 transition"
        >
          <PlusIcon className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="mb-6 px-4 py-2 border border-gray-300 rounded-lg w-full max-w-md shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
      />

      {/* Table & States */}
      {isLoading ? (
        <div className="text-gray-500">Loading products…</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded shadow-sm">
          Could not load products. Please try again.
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-gray-500">No products found.</div>
      ) : (
        <div className="overflow-y-auto rounded-xl border border-gray-200 shadow-lg bg-white">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-100 sticky top-0 shadow-sm">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">ID</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Name</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Description</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Price</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Edit</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedProducts.map((product: Product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 text-gray-600">{product.id}</td>
                  <td className="px-4 py-2 text-gray-600">{product.name}</td>
                  <td className="px-4 py-2 text-gray-600">{product.description}</td>
                  <td className="px-4 py-2 text-gray-600">₱{product.price.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/admin/products/${product.id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => setConfirmId(product.id)}
                      title="Delete product"
                    >
                      <TrashIcon className="cursor-pointer w-4 h-4 text-red-500 hover:text-red-700 transition-colors" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {filteredProducts.length > 0 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="cursor-pointer px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100"
          >
            Prev
          </button>
          <span className="px-3 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="cursor-pointer px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
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
                {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminProductList;
