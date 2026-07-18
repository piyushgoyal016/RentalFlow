import {
  TrendingUp,
  ShoppingBag,
  Users,
  Calendar,
  Layers,
  RotateCcw,
  AlertTriangle,
  CreditCard,
  DollarSign
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { dashboardStats, revenueData, rentalTrendData, topProductsData, categoryDistribution } from '../../data/mockData';
import StatCard from '../../components/dashboard/StatCard';
import RecentActivity from '../../components/dashboard/RecentActivity';
import { formatCurrency } from '../../lib/utils';

export default function Dashboard() {
  const stats = [
    { title: 'Total Revenue', value: dashboardStats.totalRevenue, change: dashboardStats.revenueChange, isCurrency: true, icon: DollarSign },
    { title: 'Total Orders', value: dashboardStats.totalOrders, change: dashboardStats.ordersChange, isCurrency: false, icon: ShoppingBag },
    { title: 'Total Customers', value: dashboardStats.totalCustomers, change: dashboardStats.customersChange, isCurrency: false, icon: Users },
    { title: 'Active Rentals', value: dashboardStats.activeRentals, change: dashboardStats.activeRentalsChange, isCurrency: false, icon: Calendar },
    { title: 'Available Inventory', value: dashboardStats.availableInventory, change: dashboardStats.inventoryChange, isCurrency: false, icon: Layers },
    { title: 'Total Returns', value: dashboardStats.totalReturns, change: dashboardStats.returnsChange, isCurrency: false, icon: RotateCcw },
    { title: 'Late Returns', value: dashboardStats.lateReturns, change: dashboardStats.lateReturnsChange, isCurrency: false, icon: AlertTriangle },
    { title: 'Pending Payments', value: dashboardStats.pendingPayments, change: dashboardStats.pendingPaymentsChange, isCurrency: false, icon: CreditCard },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 light:text-slate-800">Overview Dashboard</h2>
        <p className="text-slate-500 text-sm mt-1">Real-time metrics, analytics, and business activity overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`animate-fade-in-up stagger-${i + 1}`}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Main Charts & Feed Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 chart-container flex flex-col justify-between min-h-[350px]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-md font-semibold text-slate-200 light:text-slate-800">Revenue & Profit Overview</h4>
              <p className="text-xs text-slate-500">Monthly tracking of net inflows and operations expenses.</p>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> Revenue
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Profit
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.2)" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(51, 65, 85, 0.5)', borderRadius: '12px', color: '#e2e8f0' }}
                  formatter={(value) => [formatCurrency(value), '']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" name="Profit" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>

      {/* Secondary Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rental Trends (Weekly) */}
        <div className="chart-container flex flex-col justify-between min-h-[300px]">
          <div>
            <h4 className="text-md font-semibold text-slate-200 light:text-slate-800 mb-1">Rental Activity Trends</h4>
            <p className="text-xs text-slate-500 mb-4 font-normal">Weekly analysis of items rented vs items returned.</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rentalTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.2)" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(51, 65, 85, 0.5)', borderRadius: '12px' }} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="rentals" stroke="#6366f1" strokeWidth={2.5} name="Rentals" activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="returns" stroke="#8b5cf6" strokeWidth={2} name="Returns" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performing Products (Bar) */}
        <div className="chart-container flex flex-col justify-between min-h-[300px]">
          <div>
            <h4 className="text-md font-semibold text-slate-200 light:text-slate-800 mb-1">Top Performing Products</h4>
            <p className="text-xs text-slate-500 mb-4 font-normal">Most rented items based on rental frequencies.</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProductsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.2)" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} tickLine={false} width={100} />
                <Tooltip contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(51, 65, 85, 0.5)', borderRadius: '12px' }} />
                <Bar dataKey="rentals" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Rental Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share (Donut) */}
        <div className="chart-container flex flex-col justify-between min-h-[300px]">
          <div>
            <h4 className="text-md font-semibold text-slate-200 light:text-slate-800 mb-1">Category Distribution</h4>
            <p className="text-xs text-slate-500 mb-4 font-normal">Share of transactions divided by item category.</p>
          </div>
          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(51, 65, 85, 0.5)', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-200">100%</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Share</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
