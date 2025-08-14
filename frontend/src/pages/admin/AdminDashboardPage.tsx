/**
 * src/pages/admin/AdminDashboardPage.tsx
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboardPage: React.FC = () => {
  const { role } = useAuth();

  if (role !== 'admin') {
    return <div>Access denied</div>;
  }

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/products" className="p-6 bg-white rounded shadow hover:shadow-md transition">
          <h2 className="text-lg font-semibold mb-2">Manage Products</h2>
          <p>Create, edit, and remove products from the catalog</p>
        </Link>
        <Link to="/admin/upload" className="p-6 bg-white rounded shadow hover:shadow-md transition">
          <h2 className="text-lg font-semibold mb-2">Bulk Upload (CSV)</h2>
          <p>Upload multiple products at once via CSV file</p>
        </Link>
        <Link to="/admin/reports" className="p-6 bg-white rounded shadow hover:shadow-md transition">
          <h2 className="text-lg font-semibold mb-2">Reports</h2>
          <p>View and download scheduled system reports</p>
        </Link>
        <Link to="/admin/pipeline" className="p-6 bg-white rounded shadow hover:shadow-md transition">
          <h2 className="text-lg font-semibold mb-2">Pipeline Status</h2>
          <p>Check AWS Step Functions, errors, and logs</p>
        </Link>
      </div>
    </section>
  );
};

export default AdminDashboardPage;
