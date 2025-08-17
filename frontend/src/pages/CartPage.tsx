/**
 * src/pages/CartPage.tsx
 */

import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const CartPage: React.FC = () => {
  const { items, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = items.reduce((sum, item) => sum + item.price, 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Your cart is empty. <Link to="/products" className="text-indigo-600 underline">Browse products</Link>
      </div>
    );
  }

  const handleRemove = (productId: string, name: string) => {
    removeFromCart(productId);
    toast.success(`${name} removed from cart`);
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center justify-between bg-white p-4 rounded shadow">
            <div className="flex items-center gap-4">
              <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-indigo-600 font-bold">₱{item.price.toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={() => handleRemove(item.productId, item.name)}
              className="cursor-pointer text-sm text-red-500 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-lg font-semibold">Total: ₱{total.toFixed(2)}</p>
        <div className="flex gap-4">
          <button
            onClick={clearCart}
            className="cursor-pointer px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
          >
            Clear Cart
          </button>
          <button
            onClick={handleProceedToCheckout}
            className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
