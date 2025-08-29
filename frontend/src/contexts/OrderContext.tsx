/**
 * src/contexts/OrderContext.tsx
 */

import React, { createContext, useContext, useState } from 'react';
import { useLibrary } from './LibraryContext';
import { type CartItem } from '../types';
import { useAuth } from './AuthContext';
import api from '../lib/axios';

type OrderStatus = 'idle' | 'submitting' | 'success' | 'error';

interface OrderContextType {
  status: OrderStatus;
  submitOrder: (items: CartItem[]) => Promise<void>;
  resetStatus: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { reloadLibrary } = useLibrary();
  const [status, setStatus] = useState<OrderStatus>('idle');

  const submitOrder = async (items: CartItem[]) => {
    setStatus('submitting');
    try {
      const order_res = await api.post(`/api/orders/${user?.uid}`, { items });
      if (order_res.status !== 200) { return; }
      const lib_res = await api.post(`/api/library/${user?.uid}`, order_res.data);
      if (lib_res.status !== 200) { return; }
      await reloadLibrary();
      console.log('Order submitted successfully:', order_res.data);
      setStatus('success');
    } catch (err) {
      console.error('Order submission failed:', err);
      setStatus('error');
    }
  };

  const resetStatus = () => setStatus('idle');

  return (
    <OrderContext.Provider value={{ status, submitOrder, resetStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrder must be used within an OrderContextProvider');
  return context;
};
