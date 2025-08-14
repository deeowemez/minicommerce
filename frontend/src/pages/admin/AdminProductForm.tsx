/**
 * src/pages/admin/AdminProductForm.tsx
 */

import React, { useState } from 'react';

interface ProductForm {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isFeatured: boolean;
}

const AdminDigitalProductForm: React.FC = () => {
  const [form, setForm] = useState<ProductForm>({
    id: '',
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    isFeatured: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send to DynamoDB via API / Lambda
    console.log('Submitting product:', form);
  };

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">Add Digital Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow max-w-lg">
        <input name="id" placeholder="ID" value={form.id} onChange={handleChange} className="input" required />
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="input" required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="input" />
        <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} className="input" required />
        <input name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} className="input" required />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
          Featured Product
        </label>
        <button type="submit" className="btn btn-primary">Save Product</button>
      </form>
    </section>
  );
};

export default AdminDigitalProductForm;
