import { useState } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { categories } from '../../data/mockData';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatDate } from '../../lib/utils';

export default function Categories() {
  const [categoryList, setCategoryList] = useState(categories);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteId, setShowDeleteId] = useState(null);

  const filteredCategories = categoryList.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    setCategoryList(prev => prev.filter(c => c.id !== id));
    setShowDeleteId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 light:text-slate-800">Categories</h2>
          <p className="text-slate-500 text-sm mt-1">Organize your inventory into logical groupings.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 py-2 text-sm"
          />
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map(category => (
          <div key={category.id} className="glass-card p-5 flex flex-col hover:border-indigo-500/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center text-2xl border border-slate-700/50 shadow-inner group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <StatusBadge status={category.status} />
            </div>
            <h3 className="text-lg font-bold text-slate-200">{category.name}</h3>
            <p className="text-sm text-slate-500 mt-1 mb-4 flex-1">{category.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
              <div className="text-xs text-slate-400">
                <span className="font-semibold text-slate-300">{category.productCount}</span> Products
              </div>
              <div className="flex gap-2">
                <button className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => setShowDeleteId(category.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Dialog */}
      {showDeleteId && (
        <div className="modal-overlay">
          <div className="glass-card p-6 max-w-sm w-full mx-4 shadow-2xl animate-fade-in-up">
            <h3 className="text-lg font-bold text-slate-100">Delete Category?</h3>
            <p className="text-slate-400 text-sm mt-2">
              Are you sure you want to delete this category? Associated products will be uncategorized.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowDeleteId(null)} className="btn btn-secondary py-1.5 px-4">Cancel</button>
              <button onClick={() => handleDelete(showDeleteId)} className="btn btn-danger py-1.5 px-4">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal (Mock implementation) */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="glass-card p-6 max-w-md w-full mx-4 shadow-2xl animate-fade-in-up">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Add New Category</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Category Name</label>
                <input type="text" className="input-field" placeholder="e.g. Generators" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Icon (Emoji/SVG URL)</label>
                <input type="text" className="input-field" placeholder="⚡" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Description</label>
                <textarea rows="3" className="input-field py-2" placeholder="Brief description..."></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="btn btn-secondary py-1.5 px-4">Cancel</button>
              <button onClick={() => setShowAddModal(false)} className="btn btn-primary py-1.5 px-4">Save Category</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
