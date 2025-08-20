/**
 * src/pages/admin/AdminProductForm.tsx
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import api from '../lib/axios';
import toast from 'react-hot-toast';

interface AdminProductFormProps {
  initialValues?: Partial<Product>;
  onSuccess?: (product: Product) => void;
}

interface FormValues {
  name: string;
  description: string;
  price: number;
  isFeatured: boolean;
}

const AdminProductForm: React.FC<AdminProductFormProps> = ({ initialValues, onSuccess }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    defaultValues: {
      name: initialValues?.name || '',
      description: initialValues?.description || '',
      price: initialValues?.price || 0,
      isFeatured: initialValues?.isFeatured || false
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (initialValues?.id) {
        // Edit existing
        const res = await api.put(`/api/products/${initialValues.id}`, data);
        return res.data;
      } else {
        // Create new
        const res = await api.post(`/api/products`, data);
        return res.data;
      }
    },
    onSuccess: (product: Product) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (product.id) {
        queryClient.invalidateQueries({ queryKey: ['product', product.id] });
      }
      toast.success(`Product "${product.name}" saved successfully!`);
      if (onSuccess) onSuccess(product);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'An error occurred.');
    }
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div>
        <label className="block font-semibold">Name</label>
        <input
          type="text"
          {...register('name', { required: 'Name is required' })}
          className="border p-2 rounded w-full"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block font-semibold">Description</label>
        <textarea
          {...register('description')}
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label className="block font-semibold">Price</label>
        <input
          type="number"
          step="0.01"
          {...register('price', {
            required: 'Price is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Price must be non-negative' }
          })}
          className="border p-2 rounded w-full"
        />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          {...register('isFeatured')}
          className="h-4 w-4"
        />
        <span>Featured product</span>
      </div>
      <button
        type="submit"
        disabled={isSubmitting || mutation.isPending}
        className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
      >
        {mutation.isPending ? 'Saving...' : 'Save Product'}
      </button>
      <button
        type="button"
        onClick={() => navigate('/admin/products')}
        className="cursor-pointer mb-4 inline-flex items-center px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded ml-2"
      >
        ← Back to Product List
      </button>
    </form>
  );
};

export default AdminProductForm;
