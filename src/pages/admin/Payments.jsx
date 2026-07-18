import { useState } from 'react';
import { Search, Filter, CreditCard, DollarSign, ArrowUpRight, ArrowDownRight, Clock, FileText } from 'lucide-react';
import { payments } from '../../data/mockData';
import { formatCurrency } from '../../lib/utils';
import StatusBadge from '../../components/ui/StatusBadge';

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          payment.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || payment.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalRevenue = payments.filter(p => p.type === 'rental' && p.status === 'completed').reduce((acc, curr) => acc + curr.amount, 0);
  const totalRefunds = payments.filter(p => p.type === 'deposit_refund').reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
  const pendingPayments = payments.filter(p => p.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 light:text-slate-800">Payments & Transactions</h2>
          <p className="text-slate-500 text-sm mt-1">Monitor revenue, refunds, and pending transactions.</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 light:bg-white p-5 rounded-2xl border border-slate-800 light:border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold text-slate-100 light:text-slate-800">{formatCurrency(totalRevenue)}</h3>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900/50 light:bg-white p-5 rounded-2xl border border-slate-800 light:border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Refunds</p>
              <h3 className="text-2xl font-bold text-slate-100 light:text-slate-800">{formatCurrency(totalRefunds)}</h3>
            </div>
            <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900/50 light:bg-white p-5 rounded-2xl border border-slate-800 light:border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Pending Collections</p>
              <h3 className="text-2xl font-bold text-slate-100 light:text-slate-800">{formatCurrency(pendingPayments)}</h3>
            </div>
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-900/50 light:bg-white p-4 rounded-2xl border border-slate-800 light:border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by reference ID or customer name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 light:bg-slate-100 border border-slate-700 light:border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 light:text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none bg-slate-800 light:bg-slate-100 border border-slate-700 light:border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-200 light:text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="rental">Rental Income</option>
              <option value="deposit_refund">Deposit Refund</option>
              <option value="penalty">Penalty Fee</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-slate-900/50 light:bg-white border border-slate-800 light:border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300 light:text-slate-600">
            <thead className="bg-slate-800/50 light:bg-slate-50 text-xs uppercase font-medium text-slate-400 light:text-slate-500">
              <tr>
                <th className="px-6 py-4">Transaction Ref</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4 text-center">Type</th>
                <th className="px-6 py-4 text-center">Method</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 light:divide-slate-200">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-800/30 light:hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-200 light:text-slate-800">
                      {payment.reference}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {payment.date}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-300 light:text-slate-700">
                      {payment.customerName}
                      <span className="block text-xs text-slate-500 font-normal">For: {payment.rentalId}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        payment.type === 'rental' ? 'bg-indigo-500/10 text-indigo-400' :
                        payment.type === 'deposit_refund' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-rose-500/10 text-rose-400'
                      }`}>
                        {payment.type.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-400">
                      <span className="uppercase text-xs font-medium tracking-wider">{payment.method}</span>
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${payment.amount < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {payment.amount > 0 ? '+' : ''}{formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={payment.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded transition-colors" title="Download Receipt">
                        <FileText className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <CreditCard className="w-12 h-12 mb-3 text-slate-600" />
                      <p className="text-base font-medium text-slate-300 light:text-slate-700">No transactions found</p>
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
