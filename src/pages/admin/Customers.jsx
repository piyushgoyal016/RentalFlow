import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, User, MapPin, Phone, Mail } from 'lucide-react';
import { customers } from '../../data/mockData';
import { formatCurrency } from '../../lib/utils';
import StatusBadge from '../../components/ui/StatusBadge';

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 light:text-slate-800">Customers</h2>
          <p className="text-slate-500 text-sm mt-1">Manage your customer base and view their rental history.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25">
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-900/50 light:bg-white p-4 rounded-2xl border border-slate-800 light:border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search customers by name or email..." 
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
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-slate-900/50 light:bg-white border border-slate-800 light:border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300 light:text-slate-600">
            <thead className="bg-slate-800/50 light:bg-slate-50 text-xs uppercase font-medium text-slate-400 light:text-slate-500">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4 hidden md:table-cell">Contact</th>
                <th className="px-6 py-4 hidden lg:table-cell">Location</th>
                <th className="px-6 py-4 text-center">Rentals</th>
                <th className="px-6 py-4 text-right">Spent</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 light:divide-slate-200">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-800/30 light:hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 light:bg-slate-200 flex items-center justify-center text-indigo-400 font-bold border border-slate-700 light:border-slate-300 shrink-0">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-200 light:text-slate-800">{customer.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">Joined {customer.joinDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-xs">
                          <Mail className="w-3 h-3 text-slate-500" /> {customer.email}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs">
                          <Phone className="w-3 h-3 text-slate-500" /> {customer.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="flex items-center gap-1.5 text-xs text-slate-400">
                        <MapPin className="w-3.5 h-3.5 shrink-0" /> <span className="truncate max-w-[150px]">{customer.address}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 light:bg-slate-100 text-slate-200 light:text-slate-700 font-medium text-xs border border-slate-700 light:border-slate-200">
                        {customer.totalRentals}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-200 light:text-slate-800">
                      {formatCurrency(customer.totalSpent)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={customer.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/admin/customers/${customer.id}`}
                          className="text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          View Profile
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <User className="w-12 h-12 mb-3 text-slate-600" />
                      <p className="text-base font-medium text-slate-300 light:text-slate-700">No customers found</p>
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
