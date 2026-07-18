import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Filter } from 'lucide-react';
import { products, categories } from '../../data/mockData';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatCurrency } from '../../lib/utils';

export default function Products() {
  const [productList, setProductList] = useState(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showDeleteId, setShowDeleteId] = useState(null);

  const handleDelete = (id) => {
    setProductList(prev => prev.filter(p => p.id !== id));
    setShowDeleteId(null);
  };

  const filteredProducts = productList.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 light:text-slate-800">Products</h2>
          <p className="text-slate-500 text-sm mt-1">Manage and track your entire inventory catalog.</p>
        </div>
        <Link to="/admin/products/add" className="btn btn-primary">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 py-2 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field py-1.5 px-3 text-xs w-36"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input-field py-1.5 px-3 text-xs w-36"
          >
            <option value="All">All Statuses</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Rate / Day</th>
                <th>Deposit</th>
                <th>Stock (Avail/Total)</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="font-medium text-slate-200">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-slate-800" />
                      <div>
                        <div className="text-slate-100 font-medium">{product.name}</div>
                        <div className="text-xs text-slate-500">Rentals: {product.totalRentals}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-slate-400 font-mono text-xs">{product.sku}</td>
                  <td className="text-slate-400">{product.category}</td>
                  <td className="text-slate-300 font-semibold">{formatCurrency(product.price)}</td>
                  <td className="text-slate-400">{formatCurrency(product.deposit)}</td>
                  <td className="text-slate-400">
                    <span className="text-emerald-400 font-semibold">{product.availableQty}</span>
                    <span className="text-slate-600">/{product.totalQty}</span>
                  </td>
                  <td>
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/products/edit/${product.id}`} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors">
                        <Edit2 size={15} />
                      </Link>
                      <button
                        onClick={() => setShowDeleteId(product.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-slate-500 font-medium">
                    No products found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Dialog */}
      {showDeleteId && (
        <div className="modal-overlay">
          <div className="glass-card p-6 max-w-sm w-full mx-4 shadow-2xl animate-fade-in-up">
            <h3 className="text-lg font-bold text-slate-100">Delete Product?</h3>
            <p className="text-slate-400 text-sm mt-2">
              Are you sure you want to delete this product? This action is permanent and cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowDeleteId(null)} className="btn btn-secondary py-1.5 px-4">Cancel</button>
              <button onClick={() => handleDelete(showDeleteId)} className="btn btn-danger py-1.5 px-4">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
