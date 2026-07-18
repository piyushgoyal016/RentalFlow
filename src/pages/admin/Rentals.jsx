import { useState } from 'react';
import { Search, Filter, Plus, FileText, Calendar as CalendarIcon, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { rentals } from '../../data/mockData';
import { formatCurrency } from '../../lib/utils';
import StatusBadge from '../../components/ui/StatusBadge';

export default function Rentals() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRentals = rentals.filter(rental => {
    const matchesSearch = rental.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          rental.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rental.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 light:text-slate-800">Rental Orders</h2>
          <p className="text-slate-500 text-sm mt-1">Manage all active, pending, and completed rentals.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25">
          <Plus className="w-4 h-4" />
          Create Rental
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 light:bg-white p-4 rounded-2xl border border-slate-800 light:border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Orders</p>
            <p className="text-xl font-bold text-slate-200 light:text-slate-800">{rentals.length}</p>
          </div>
        </div>
        <div className="bg-slate-900/50 light:bg-white p-4 rounded-2xl border border-slate-800 light:border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Active</p>
            <p className="text-xl font-bold text-slate-200 light:text-slate-800">{rentals.filter(r => r.status === 'active').length}</p>
          </div>
        </div>
        <div className="bg-slate-900/50 light:bg-white p-4 rounded-2xl border border-slate-800 light:border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending</p>
            <p className="text-xl font-bold text-slate-200 light:text-slate-800">{rentals.filter(r => r.status === 'pending').length}</p>
          </div>
        </div>
        <div className="bg-slate-900/50 light:bg-white p-4 rounded-2xl border border-slate-800 light:border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Overdue</p>
            <p className="text-xl font-bold text-slate-200 light:text-slate-800">{rentals.filter(r => r.status === 'overdue').length}</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-900/50 light:bg-white p-4 rounded-2xl border border-slate-800 light:border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by order ID or customer name..." 
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
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rentals Table */}
      <div className="bg-slate-900/50 light:bg-white border border-slate-800 light:border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300 light:text-slate-600">
            <thead className="bg-slate-800/50 light:bg-slate-50 text-xs uppercase font-medium text-slate-400 light:text-slate-500">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4 hidden md:table-cell">Duration</th>
                <th className="px-6 py-4 hidden lg:table-cell">Items</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 light:divide-slate-200">
              {filteredRentals.length > 0 ? (
                filteredRentals.map((rental) => (
                  <tr key={rental.id} className="hover:bg-slate-800/30 light:hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-200 light:text-slate-800">
                      {rental.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-300 light:text-slate-700">
                      {rental.customerName}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <CalendarIcon className="w-3.5 h-3.5 shrink-0" /> 
                        <span>{rental.startDate} <span className="mx-1">to</span> {rental.endDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="max-w-[200px] truncate text-slate-400 text-xs">
                        {rental.products.map(p => `${p.qty}x ${p.name}`).join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-200 light:text-slate-800">
                      {formatCurrency(rental.totalAmount)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={rental.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition-colors">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <FileText className="w-12 h-12 mb-3 text-slate-600" />
                      <p className="text-base font-medium text-slate-300 light:text-slate-700">No rentals found</p>
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
