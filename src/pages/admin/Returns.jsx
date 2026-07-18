import { useState } from 'react';
import { Search, Filter, ScanLine, RotateCcw, CheckCircle, AlertTriangle, Box } from 'lucide-react';
import { returns } from '../../data/mockData';
import { formatCurrency } from '../../lib/utils';
import StatusBadge from '../../components/ui/StatusBadge';

export default function Returns() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredReturns = returns.filter(ret => {
    const matchesSearch = ret.rentalId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ret.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ret.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 light:text-slate-800">Returns Management</h2>
          <p className="text-slate-500 text-sm mt-1">Process returns, assess damages, and manage deposits.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25">
          <ScanLine className="w-4 h-4" />
          Process Return
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 light:bg-white p-4 rounded-2xl border border-slate-800 light:border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Returns</p>
            <p className="text-xl font-bold text-slate-200 light:text-slate-800">{returns.length}</p>
          </div>
        </div>
        <div className="bg-slate-900/50 light:bg-white p-4 rounded-2xl border border-slate-800 light:border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Completed</p>
            <p className="text-xl font-bold text-slate-200 light:text-slate-800">{returns.filter(r => r.status === 'completed').length}</p>
          </div>
        </div>
        <div className="bg-slate-900/50 light:bg-white p-4 rounded-2xl border border-slate-800 light:border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Inspection</p>
            <p className="text-xl font-bold text-slate-200 light:text-slate-800">{returns.filter(r => r.status === 'pending').length}</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-900/50 light:bg-white p-4 rounded-2xl border border-slate-800 light:border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by rental ID or customer name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 light:bg-slate-100 border border-slate-700 light:border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 light:text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-slate-800 light:bg-slate-100 border border-slate-700 light:border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-200 light:text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Returns Table */}
      <div className="bg-slate-900/50 light:bg-white border border-slate-800 light:border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300 light:text-slate-600">
            <thead className="bg-slate-800/50 light:bg-slate-50 text-xs uppercase font-medium text-slate-400 light:text-slate-500">
              <tr>
                <th className="px-6 py-4">Return ID</th>
                <th className="px-6 py-4">Rental ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4 hidden md:table-cell">Items</th>
                <th className="px-6 py-4 text-center hidden lg:table-cell">Condition</th>
                <th className="px-6 py-4 text-right">Penalty</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 light:divide-slate-200">
              {filteredReturns.length > 0 ? (
                filteredReturns.map((ret) => (
                  <tr key={ret.id} className="hover:bg-slate-800/30 light:hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-200 light:text-slate-800">
                      {ret.id}
                    </td>
                    <td className="px-6 py-4 text-indigo-400 font-medium hover:underline cursor-pointer">
                      {ret.rentalId}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-300 light:text-slate-700">
                      {ret.customerName}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="max-w-[180px] truncate text-slate-400 text-xs">
                        {ret.products}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center hidden lg:table-cell">
                      {ret.condition ? (
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                          ret.condition === 'good' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                          ret.condition === 'minor_damage' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                          'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {ret.condition.replace('_', ' ').toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {ret.penalty !== null ? (
                        <span className={ret.penalty > 0 ? "text-rose-400 font-medium" : "text-slate-400"}>
                          {formatCurrency(ret.penalty)}
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={ret.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition-colors">
                        {ret.status === 'pending' ? 'Inspect' : 'View Details'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <Box className="w-12 h-12 mb-3 text-slate-600" />
                      <p className="text-base font-medium text-slate-300 light:text-slate-700">No returns found</p>
                      <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
