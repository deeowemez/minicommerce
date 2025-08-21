/**
 * src/layout/AdminLayout.tsx
 */

import React from 'react';
import { Link, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import clsx from 'clsx';
import { HomeIcon, Squares2X2Icon, CubeIcon, ArrowUpTrayIcon, ChartBarIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const AdminLayout: React.FC = () => {
  const { isAdmin, logout, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Checking access...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  const navLinkClass = (path: string) =>
    clsx(
      'flex items-center gap-2 px-3 py-2 rounded hover:bg-indigo-700 transition',
      location.pathname === path && 'bg-indigo-900 font-semibold'
    );

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-indigo-800 text-white flex flex-col">
        <div className="px-6 py-4 text-xl font-bold border-b border-indigo-700">
          Admin Panel
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 flex flex-col justify-between">
          <div className="space-y-1">
            <Link to="/admin" className={navLinkClass('/admin')}>
              <Squares2X2Icon className="w-5 h-5" strokeWidth={2} />
              <span>Dashboard</span>
            </Link>
            <Link to="/admin/products" className={navLinkClass('/admin/products')}>
              <CubeIcon className="w-5 h-5" strokeWidth={2} />
              <span>Manage Products</span>
            </Link>
            <Link to="/admin/upload" className={navLinkClass('/admin/upload')}>
              <ArrowUpTrayIcon className="w-5 h-5" strokeWidth={2} />
              <span>CSV Bulk Upload</span>
            </Link>
            <Link to="/admin/reports" className={navLinkClass('/admin/reports')}>
              <ChartBarIcon className="w-5 h-5" strokeWidth={2} />
              <span>Reports</span>
            </Link>
            <Link to="/admin/pipeline" className={navLinkClass('/admin/pipeline')}>
              <AdjustmentsHorizontalIcon className="w-5 h-5" strokeWidth={2} />
              <span>Pipeline Status</span>
            </Link>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 border border-indigo-400 rounded-lg bg-indigo-50 text-indigo-900 hover:bg-indigo-100 hover:border-indigo-600 transition shadow-sm"
          >
            <HomeIcon className="w-4 h-4" strokeWidth={2} />
            <span>User Home Page</span>
          </Link>
        </nav>
        <button onClick={logout} className="cursor-pointer px-6 py-4 border-t border-indigo-700 hover:bg-indigo-700 text-left" >
          Logout
        </button>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
