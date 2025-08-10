/**
 * src/pages/LibraryPage.tsx
 */

import React from 'react';
import { useLibrary } from '../contexts/LibraryContext';
import { Link } from 'react-router-dom';

const LibraryPage: React.FC = () => {
  const { items, removeFromLibrary } = useLibrary();

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        You don’t own any products yet. <Link to="/products" className="text-indigo-600 underline">Browse products</Link>
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Library</h1>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <li key={item.productId} className="bg-white rounded shadow p-4 flex flex-col">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-48 object-cover rounded"
            />
            <h2 className="mt-2 text-lg font-semibold text-gray-800">{item.name}</h2>
            <p className="text-indigo-600 font-bold">₱{item.price.toFixed(2)}</p>
            <button
              onClick={() => removeFromLibrary(item.productId)}
              className="mt-auto text-sm text-red-500 hover:underline"
            >
              Remove from Library
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LibraryPage;
