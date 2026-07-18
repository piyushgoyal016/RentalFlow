import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar, Legend } from 'recharts';
import { Calendar, Download, RefreshCw } from 'lucide-react';
import { dailyRevenueData, rentalTrendData, inventoryStatusData } from '../../data/mockData';
import { formatCurrency } from '../../lib/utils';

export default function Analytics() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 light:text-slate-800">Analytics & Insights</h2>
          <p className="text-slate-500 text-sm mt-1">Deep dive into data trends, user behaviors, and inventory performance.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-slate-800 light:bg-white hover:bg-slate-700 light:hover:bg-slate-50 text-slate-200 light:text-slate-800 border border-slate-700 light:border-slate-200 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25">
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue Area Chart */}
        <div className="bg-slate-900/50 light:bg-white p-5 rounded-2xl border border-slate-800 light:border-slate-200 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-semibold text-slate-200 light:text-slate-800">Daily Revenue Trends</h3>
              <p className="text-xs text-slate-500 mt-1">Revenue generation over the last 30 days.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Revenue (₹)
              </span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyRevenueData}>
                <defs>
                  <linearGradient id="colorDailyRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.2)" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} minTickGap={30} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip
                  contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(51, 65, 85, 0.5)', borderRadius: '12px' }}
                  formatter={(value) => [formatCurrency(value), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorDailyRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rental vs Return (Weekly) */}
        <div className="bg-slate-900/50 light:bg-white p-5 rounded-2xl border border-slate-800 light:border-slate-200">
          <div className="mb-6">
            <h3 className="font-semibold text-slate-200 light:text-slate-800">Rentals vs Returns</h3>
            <p className="text-xs text-slate-500 mt-1">Comparison of outgoing vs incoming items.</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rentalTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.2)" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(51, 65, 85, 0.5)', borderRadius: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="rentals" name="Items Rented" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="returns" name="Items Returned" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Status by Category */}
        <div className="bg-slate-900/50 light:bg-white p-5 rounded-2xl border border-slate-800 light:border-slate-200">
          <div className="mb-6">
            <h3 className="font-semibold text-slate-200 light:text-slate-800">Inventory Health Matrix</h3>
            <p className="text-xs text-slate-500 mt-1">Status of items grouped by product categories.</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryStatusData} layout="vertical" stackOffset="expand">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.2)" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(tick) => `${Math.round(tick * 100)}%`} />
                <YAxis dataKey="category" type="category" stroke="#64748b" fontSize={11} tickLine={false} width={80} />
                <Tooltip 
                  contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(51, 65, 85, 0.5)', borderRadius: '12px' }} 
                  formatter={(value, name) => [value, name.charAt(0).toUpperCase() + name.slice(1)]}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="available" name="Available" stackId="a" fill="#10b981" />
                <Bar dataKey="reserved" name="Rented/Reserved" stackId="a" fill="#3b82f6" />
                <Bar dataKey="damaged" name="Maintenance" stackId="a" fill="#f43f5e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
