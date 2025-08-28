/**
 * src/pages/CheckoutPage.tsx
 */

import React, { useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useOrder } from '../contexts/OrderContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const CheckoutPage: React.FC = () => {
  const { items, clearCart } = useCart();
  const { submitOrder, status, resetStatus } = useOrder();
  const navigate = useNavigate();

  const total = items.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    if (status === 'success') {
      toast.success('Checkout complete! Items added to your library');
      clearCart();
      navigate('/library');
      resetStatus();
    } else if (status === 'error') {
      toast.error('Something went wrong during checkout');
      resetStatus();
    }
  }, [status, clearCart, navigate, resetStatus]);

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast('Your cart is empty');
      return;
    }
    await submitOrder(items);
  };

  return (
    <section className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {items.length === 0 ? (
        <div className="text-center text-gray-500">
          No items to checkout. <span className="underline text-indigo-600 cursor-pointer" onClick={() => navigate('/products')}>Browse products</span>
        </div>
      ) : (
        <>
          <ul className="space-y-4 mb-6">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between items-center bg-white p-4 rounded shadow">
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-indigo-600 font-bold">₱{item.price.toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mb-6">
            <p className="text-lg font-semibold">Total: ₱{total.toFixed(2)}</p>
          </div>
          <button onClick={handleSubmit} disabled={status === 'submitting'}
            className={`cursor-pointer w-full px-4 py-2 rounded text-white transition ${status === 'submitting' ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {status === 'submitting' ? 'Processing...' : 'Confirm and Checkout'}
          </button>
        </>
      )}
    </section>
  );
};

export default CheckoutPage;
