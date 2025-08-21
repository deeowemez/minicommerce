/**
 * src/pages/admin/AdminProductForm.tsx
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { type Product } from '../types';
import toast from 'react-hot-toast';
import api from '../lib/axios';

interface FormValues {
  name: string;
  description: string;
  price: number;
  isFeatured: boolean;
  imageUrl: string;
}

const AdminProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch product in edit mode
  const {
    data: productData,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await api.get(`/api/products/${id}`);
      return res.data as Product;
    },
    enabled: isEditMode,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      isFeatured: false,
      imageUrl: ''
    }
  });

  // Populate form when productData is loaded in edit mode
  useEffect(() => {
    if (isEditMode && productData) {
      reset({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        isFeatured: productData.isFeatured,
        imageUrl: productData.imageUrl || ''
      });
    }
  }, [isEditMode, productData, reset]);

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (isEditMode && id) {
        const res = await api.put(`/api/products/${id}`, data);
        return res.data;
      } else {
        const res = await api.post(`/api/products`, data);
        return res.data;
      }
    },
    onSuccess: (product: Product) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (product.id) {
        queryClient.invalidateQueries({ queryKey: ['product', product.id] });
      }
      toast.success(
        `Product "${product.name}" ${isEditMode ? 'updated' : 'created'} successfully!`
      );
      navigate('/admin/products');
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'An error occurred.');
    }
  });

  const onSubmit = (values: FormValues) => {
    console.log("Submitting values:", values);
    mutation.mutate(values);
  };

  // Show loading state in edit mode until data arrives
  if (isEditMode) {
    if (isProductLoading) {
      return <div className="text-center py-12 text-gray-500">Loading product data...</div>;
    }
    if (isProductError || !productData) {
      return <div className="text-center py-12 text-red-500">Product not found.</div>;
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <h1 className="text-xl font-bold mb-4">
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </h1>

      {/* Name */}
      <div>
        <label className="block font-semibold">Name</label>
        <input
          type="text"
          {...register('name', { required: 'Name is required' })}
          className="border p-2 rounded w-full"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block font-semibold">Description</label>
        <textarea
          {...register('description')}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Price */}
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

      {/* Image URL */}
      <div>
        <label className="block font-semibold">Image URL</label>
        <input
          type="url"
          {...register('imageUrl')}
          className="border p-2 rounded w-full"
        />
        {errors.imageUrl && <p className="text-red-500">{errors.imageUrl.message}</p>}
      </div>

      {/* Featured */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          {...register('isFeatured')}
          className="h-4 w-4"
        />
        <span>Featured product</span>
      </div>

      {/* Actions */}
      <button
        type="submit"
        disabled={isSubmitting || mutation.isPending}
        className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
      >
        {mutation.isPending
          ? isEditMode
            ? 'Updating...'
            : 'Saving...'
          : isEditMode
            ? 'Update Product'
            : 'Save Product'}
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
