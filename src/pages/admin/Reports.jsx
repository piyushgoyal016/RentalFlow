import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText, Calendar, Filter } from 'lucide-react';
import { revenueData, topProductsData, categoryDistribution, dashboardStats } from '../../data/mockData';
import { formatCurrency } from '../../lib/utils';

export default function Reports() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 light:text-slate-800">Business Reports</h2>
          <p className="text-slate-500 text-sm mt-1">Generate and view detailed reports on various business metrics.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-slate-800 light:bg-white hover:bg-slate-700 light:hover:bg-slate-50 text-slate-200 light:text-slate-800 border border-slate-700 light:border-slate-200 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Summary Cards */}
        <div className="bg-slate-900/50 light:bg-white p-5 rounded-2xl border border-slate-800 light:border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">YTD Revenue</p>
          <h3 className="text-2xl font-bold text-slate-100 light:text-slate-800">{formatCurrency(dashboardStats.totalRevenue)}</h3>
          <p className="text-xs text-emerald-400 mt-2">+{dashboardStats.revenueChange}% from last year</p>
        </div>
        <div className="bg-slate-900/50 light:bg-white p-5 rounded-2xl border border-slate-800 light:border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Rentals</p>
          <h3 className="text-2xl font-bold text-slate-100 light:text-slate-800">{dashboardStats.totalOrders}</h3>
          <p className="text-xs text-emerald-400 mt-2">+{dashboardStats.ordersChange}% from last year</p>
        </div>
        <div className="bg-slate-900/50 light:bg-white p-5 rounded-2xl border border-slate-800 light:border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">New Customers</p>
          <h3 className="text-2xl font-bold text-slate-100 light:text-slate-800">{dashboardStats.totalCustomers}</h3>
          <p className="text-xs text-emerald-400 mt-2">+{dashboardStats.customersChange}% from last year</p>
        </div>
        <div className="bg-slate-900/50 light:bg-white p-5 rounded-2xl border border-slate-800 light:border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">Return Rate</p>
          <h3 className="text-2xl font-bold text-slate-100 light:text-slate-800">92%</h3>
          <p className="text-xs text-emerald-400 mt-2">+2.4% improved</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Report Chart */}
        <div className="bg-slate-900/50 light:bg-white p-5 rounded-2xl border border-slate-800 light:border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-200 light:text-slate-800">Revenue Breakdown (Monthly)</h3>
            <span className="text-xs text-slate-500 bg-slate-800 light:bg-slate-100 px-2 py-1 rounded">2026</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.2)" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(51, 65, 85, 0.5)', borderRadius: '12px' }}
                  cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                />
                <Bar dataKey="revenue" name="Income" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="bg-slate-900/50 light:bg-white p-5 rounded-2xl border border-slate-800 light:border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-200 light:text-slate-800">Top Performing Products</h3>
            <button className="text-xs text-indigo-400 hover:text-indigo-300">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300 light:text-slate-600">
              <thead className="bg-slate-800/30 light:bg-slate-50 text-xs uppercase font-medium text-slate-400">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Product Name</th>
                  <th className="px-4 py-3 text-center">Rentals</th>
                  <th className="px-4 py-3 text-right rounded-r-lg">Revenue Generated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 light:divide-slate-200">
                {topProductsData.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-800/20 light:hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-200 light:text-slate-800">{item.name}</td>
                    <td className="px-4 py-3 text-center text-slate-400">{item.rentals}</td>
                    <td className="px-4 py-3 text-right font-medium text-emerald-400">{formatCurrency(item.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
