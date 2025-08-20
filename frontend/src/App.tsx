/**
 * src/App.tsx
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Providers from './providers/Providers';
import BaseLayout from './layouts/BaseLayout';
import { Toaster } from 'react-hot-toast';

import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LibraryPage from './pages/LibraryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductList from './pages/admin/AdminProductList';
import AdminFileUpload from './pages/admin/AdminFileUpload';
import AdminReportViewer from './pages/admin/AdminReportViewer';
import AdminPipelineStatus from './pages/admin/AdminPipelineStatus';
import AdminProductEditPage from './pages/admin/AdminProductEditPage';

const App: React.FC = () => {
  return (
    <Router>
      <Providers>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductList />} />
            <Route path="products/:productId" element={<AdminProductEditPage />} />
            <Route path="upload" element={<AdminFileUpload />} />
            <Route path="reports" element={<AdminReportViewer />} />
            <Route path="pipeline" element={<AdminPipelineStatus />} />
          </Route>
          <Route element={<BaseLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Routes>
      </Providers>
    </Router >
  );
};

export default App;
