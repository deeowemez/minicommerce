/**
 * src/contexts/OrderContext.tsx
 */

import React, { createContext, useContext, useState } from 'react';
import { type CartItem } from './CartContext';
import { useAuth } from './AuthContext';
import api from '../lib/axios';

type OrderStatus = 'idle' | 'submitting' | 'success' | 'error';

interface OrderContextType {
  status: OrderStatus;
  submitOrder: (items: CartItem[]) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [status, setStatus] = useState<OrderStatus>('idle');

  const submitOrder = async (items: CartItem[]) => {
    setStatus('submitting');
    try {
      const order_res = await api.post(`/api/orders/${user?.uid}`, { items });

      if (order_res) {
        const lib_res = await api.post(`/api/library/${user?.uid}`, { items });
        if (lib_res) {
          console.log('Order and library updated successfully:', lib_res);
        }
      }
      console.log('Order submitted successfully:', order_res);
      setStatus('success');
    } catch (err) {
      console.error('Order submission failed:', err);
      setStatus('error');
    }
  };

  return (
    <OrderContext.Provider value={{ status, submitOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrder must be used within an OrderContextProvider');
  return context;
};
