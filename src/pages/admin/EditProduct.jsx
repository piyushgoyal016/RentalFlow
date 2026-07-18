import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { ArrowLeft, Save, UploadCloud } from 'lucide-react';
import { categories, products } from '../../data/mockData';
import { useEffect, useState } from 'react';

const productSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters' }),
  sku: z.string().min(3, { message: 'SKU code is required' }),
  category: z.string().nonempty({ message: 'Please select a category' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number' }),
  deposit: z.coerce.number().positive({ message: 'Security deposit must be positive' }),
  totalQty: z.coerce.number().int().positive({ message: 'Stock must be at least 1' }),
  description: z.string().min(10, { message: 'Provide a description of at least 10 characters' }),
  image: z.string().url({ message: 'Please provide a valid image URL' }).or(z.string().length(0)),
});

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(productSchema)
  });

  useEffect(() => {
    // Simulate API fetch
    const product = products.find(p => p.id === parseInt(id));
    if (product) {
      reset({
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price,
        deposit: product.deposit,
        totalQty: product.totalQty,
        description: product.description,
        image: product.image
      });
    }
    setLoading(false);
  }, [id, reset]);

  const onSubmit = (data) => {
    // In a real app we would call API/dispatch to store
    console.log('Updating Product Data:', data);
    navigate('/admin/products');
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading product data...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/admin/products" className="p-2 rounded-xl hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 light:text-slate-800">Edit Product</h2>
          <p className="text-slate-500 text-sm mt-1">Update inventory item details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details Form */}
        <div className="md:col-span-2 glass-card p-6 space-y-4">
          <h3 className="text-md font-semibold text-slate-200 light:text-slate-800 mb-2">Product Specifications</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Product Name</label>
              <input type="text" {...register('name')} className="input-field" placeholder="e.g. MacBook Pro 16" />
              {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">SKU Code</label>
              <input type="text" {...register('sku')} className="input-field" placeholder="e.g. ELEC-001" />
              {errors.sku && <p className="text-rose-500 text-xs mt-1">{errors.sku.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Category</label>
              <select {...register('category')} className="input-field">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
              {errors.category && <p className="text-rose-500 text-xs mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Total Quantity</label>
              <input type="number" {...register('totalQty')} className="input-field" placeholder="10" />
              {errors.totalQty && <p className="text-rose-500 text-xs mt-1">{errors.totalQty.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Rental Price / Day (₹)</label>
              <input type="number" {...register('price')} className="input-field" placeholder="150" />
              {errors.price && <p className="text-rose-500 text-xs mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Security Deposit (₹)</label>
              <input type="number" {...register('deposit')} className="input-field" placeholder="500" />
              {errors.deposit && <p className="text-rose-500 text-xs mt-1">{errors.deposit.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Description</label>
            <textarea {...register('description')} rows="4" className="input-field py-3 resize-none" placeholder="Provide product features, guidelines, and instructions..."></textarea>
            {errors.description && <p className="text-rose-500 text-xs mt-1">{errors.description.message}</p>}
          </div>
        </div>

        {/* Sidebar Image Upload */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card p-6 flex flex-col items-center justify-center">
            <h3 className="text-sm font-semibold text-slate-200 light:text-slate-800 mb-4 w-full text-left">Product Image</h3>
            <div className="border border-dashed border-slate-700/50 rounded-2xl w-full aspect-square flex flex-col items-center justify-center p-4 cursor-pointer hover:border-indigo-500/50 transition-colors">
              <UploadCloud size={32} className="text-slate-500 mb-2" />
              <span className="text-xs text-slate-400 font-medium">Browse Files or Drag & Drop</span>
              <span className="text-[10px] text-slate-600 mt-1">PNG, JPG, WebP up to 5MB</span>
            </div>
            <div className="w-full mt-4">
              <label className="text-xs font-semibold text-slate-400 block mb-1">Or Image URL</label>
              <input type="text" {...register('image')} className="input-field text-xs" />
              {errors.image && <p className="text-rose-500 text-xs mt-1">{errors.image.message}</p>}
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Link to="/admin/products" className="btn btn-secondary flex-1 justify-center py-2.5">Cancel</Link>
            <button type="submit" className="btn btn-primary flex-1 justify-center py-2.5">
              <Save size={16} /> Update Item
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
