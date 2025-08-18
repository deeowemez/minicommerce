/**
 * src/pages/HomePage.tsx
 */

import { useProducts } from '../contexts/ProductContext';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

const HomePage: React.FC = () => {
  const { featuredProducts, isLoading, error } = useProducts();

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to AlmostSteam 🎮</h1>
        <p className="mt-2 text-lg text-gray-600">Buy, download, play. Like Steam, but… almost.</p>
        <Link
          to="/products"
          className="inline-flex items-center mt-4 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Browse Games <ArrowRightIcon className="w-5 h-5 ml-2" />
        </Link>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Featured Products</h2>
        {isLoading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">Something went wrong: {error.message}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredProducts?.map((product) => {
            return (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className={clsx(
                  'border rounded-lg p-4 hover:shadow-lg transition bg-white flex flex-col cursor-pointer'
                )}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded"
                />
                <h3 className="mt-2 text-lg font-medium text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
                <p className="mt-1 font-semibold text-indigo-600">₱{product.price}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
