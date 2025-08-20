/**
 * src/pages/admin/AdminProductEditPage.tsx
 */

import { useParams } from 'react-router-dom';
import { useProductById } from '../../hooks/useProductById';
import AdminProductForm from '../../components/AdminProductForm';

const AdminProductEditPage: React.FC = () => {
  const { productId } = useParams();
  const { data: product, isLoading, error } = useProductById(productId);

  if (isLoading) return <p>Loading...</p>;
  if (error || !product) return <p>Error loading product.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <AdminProductForm initialValues={product} />
    </div>
  );
};

export default AdminProductEditPage;
