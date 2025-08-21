/**
 * src/pages/admin/AdminProductEditPage.tsx
 */

import React from 'react';
import AdminProductForm from '../../components/AdminProductForm';

const AdminProductEditPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <AdminProductForm />
    </div>
  );
};

export default AdminProductEditPage;
