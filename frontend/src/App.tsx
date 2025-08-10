/**
 * src/App.tsx
 */


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Providers from './providers/Providers';
import BaseLayout from './layouts/BaseLayout';

import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LibraryPage from './pages/LibraryPage';
import LoginPage from './pages/LoginPage';
// import AdminDashboardPage from './pages/AdminDashboardPage';

const App: React.FC = () => {
  return (
    <Providers>
      <Router>
        <BaseLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path='/login' element={<LoginPage />} />
            {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
            {/* <Route path="/admin" element={<AdminDashboardPage />} /> */}
          </Routes>
        </BaseLayout>
      </Router>
    </Providers>
  );
};

export default App;
