/**
 * src/layout/AdminLayout.tsx
 */

import React from 'react';
import { Link, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import clsx from 'clsx';

const AdminLayout: React.FC = () => {
  const { isAdmin, logout, loading } = useAuth();
  const location = useLocation();

  // Wait for auth state to resolve before redirecting
  if (loading) {
    return <div className="p-6 text-center text-gray-600">Checking access...</div>;
  }

  // Redirect non-admins to home (or login)
  if (!isAdmin) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  const navLinkClass = (path: string) =>
    clsx(
      'block px-3 py-2 rounded hover:bg-indigo-700 transition',
      location.pathname === path && 'bg-indigo-900 font-semibold'
    );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-800 text-white flex flex-col">
        <div className="px-6 py-4 text-xl font-bold border-b border-indigo-700">
          Admin Panel
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link to="/admin" className={navLinkClass('/admin')}>
            Dashboard
          </Link>
          <Link to="/admin/products" className={navLinkClass('/admin/products')}>
            Manage Products
          </Link>
          <Link to="/admin/upload" className={navLinkClass('/admin/upload')}>
            CSV Bulk Upload
          </Link>
          <Link to="/admin/reports" className={navLinkClass('/admin/reports')}>
            Reports
          </Link>
          <Link to="/admin/pipeline" className={navLinkClass('/admin/pipeline')}>
            Pipeline Status
          </Link>
          <Link to="/" className={navLinkClass('/')}>
            User Home Page
          </Link>
        </nav>



        <button
          onClick={logout}
          className="px-6 py-4 border-t border-indigo-700 hover:bg-indigo-700 text-left"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet /> {/* Nested admin pages render here */}
      </main>
    </div>
  );
};

export default AdminLayout;
