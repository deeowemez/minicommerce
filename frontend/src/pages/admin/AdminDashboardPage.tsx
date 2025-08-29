/**
 * src/pages/admin/AdminDashboardPage.tsx
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboardPage: React.FC = () => {
  const { role } = useAuth();

  if (role !== 'admin') {
    return (
      <section className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded shadow-sm">
          Access denied
        </div>
      </section>
    );
  }

  return (
    <section className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-3 text-gray-800">
        Admin Dashboard
      </h1>
      <p className="mb-6 text-gray-500">
        Manage your store's products, reports, and operational tools from one central hub:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Manage Products */}
        <Link
          to="/admin/products"
          className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-300 transition flex flex-col justify-between"
        >
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              Manage Products
            </h2>
            <p className="text-gray-600">
              Create, edit, and remove products from the catalog.
            </p>
          </div>
        </Link>

        {/* Bulk Upload */}
        <Link
          to="/admin/upload"
          className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-300 transition flex flex-col justify-between"
        >
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              Bulk Upload (CSV)
            </h2>
            <p className="text-gray-600">
              Upload multiple products at once via CSV file.
            </p>
          </div>
        </Link>

        {/* Reports */}
        <Link
          to="/admin/reports"
          className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-300 transition flex flex-col justify-between"
        >
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              Reports
            </h2>
            <p className="text-gray-600">
              View and download scheduled system reports.
            </p>
          </div>
        </Link>

        {/* Pipeline Status */}
        <Link
          to="/admin/pipeline"
          className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-300 transition flex flex-col justify-between"
        >
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              Pipeline Status
            </h2>
            <p className="text-gray-600">
              Check AWS Step Functions, errors, and logs.
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default AdminDashboardPage;
