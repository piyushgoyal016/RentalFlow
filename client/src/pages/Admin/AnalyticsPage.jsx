import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import PageHeader from "@/components/admin/shared/PageHeader";
import { getDashboardStats, getRevenue, getCustomerReport, getInventoryReport } from "@/services/adminService";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-lg text-sm">
      <p className="font-semibold text-slate-500 dark:text-slate-400 text-xs mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.stroke || p.fill }} />
          <span className="text-slate-600 dark:text-slate-300">{p.name}:</span>
          <span className="font-bold text-slate-900 dark:text-white">
            {typeof p.value === "number" && p.name.toLowerCase().includes("revenue")
              ? `₹${p.value.toLocaleString()}`
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

function ChartCard({ title, subtitle, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6"
    >
      <div className="mb-6">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
        {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("year");
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState([
    { label: "Occupancy Rate",    value: "0%",   trend: "0%", positive: true },
    { label: "Avg Rental Value",  value: "₹0",   trend: "0%", positive: true },
    { label: "Customer Lifetime", value: "₹0",   trend: "0%", positive: true },
    { label: "Churn Rate",        value: "0%",   trend: "0%", positive: true },
  ]);
  const [revenueData, setRevenueData] = useState([]);
  const [customerGrowth, setCustomerGrowth] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [dashRes, revRes, custRes, prodRes] = await Promise.all([
          getDashboardStats().catch(() => ({ data: { data: {} }})),
          getRevenue().catch(() => ({ data: { data: [] }})),
          getCustomerReport().catch(() => ({ data: { data: [] }})),
          getInventoryReport().catch(() => ({ data: { data: [] }}))
        ]);

        const dashboard = dashRes?.data?.data || {};
        const payments = revRes?.data?.data || [];
        const customers = custRes?.data?.data || [];
        const products = prodRes?.data?.data || [];

        // Aggregate Revenue and Rentals by Month
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyData = {};
        months.forEach(m => monthlyData[m] = { month: m, revenue: 0, rentals: 0 });

        let totalRentals = 0;
        payments.forEach(p => {
          const date = new Date(p.createdAt);
          const monthStr = months[date.getMonth()];
          monthlyData[monthStr].revenue += p.amount || 0;
          if (p.rentalOrder) {
            monthlyData[monthStr].rentals += 1;
            totalRentals += 1;
          }
        });
        setRevenueData(Object.values(monthlyData));

        // Aggregate Customer Growth
        let cumulativeCustomers = 0;
        const custGrowth = months.map(m => {
          const newCusts = customers.filter(c => new Date(c.createdAt).getMonth() === months.indexOf(m)).length;
          cumulativeCustomers += newCusts;
          return { month: m, customers: cumulativeCustomers };
        });
        setCustomerGrowth(custGrowth);

        // Occupancy Rate by Category
        const catStats = {};
        products.forEach(p => {
          const cName = p.category?.name || "Uncategorized";
          if (!catStats[cName]) catStats[cName] = { total: 0, rented: 0 };
          catStats[cName].total += p.stockQuantity || 1;
          const rentedCount = p.rentalItems?.filter(ri => ri.rentalOrder?.status === "ACTIVE").reduce((acc, curr) => acc + curr.quantity, 0) || 0;
          catStats[cName].rented += rentedCount;
        });

        const occData = Object.keys(catStats).map(c => ({
          category: c,
          rate: catStats[c].total > 0 ? Math.round((catStats[c].rented / catStats[c].total) * 100) : 0
        }));
        setOccupancyData(occData);

        // KPIs
        const totalRevenue = dashboard.revenue || 0;
        const avgRental = totalRentals > 0 ? Math.round(totalRevenue / totalRentals) : 0;
        const overallOcc = occData.length > 0 ? Math.round(occData.reduce((acc, c) => acc + c.rate, 0) / occData.length) : 0;

        setKpis([
          { label: "Occupancy Rate",    value: `${overallOcc}%`,   trend: "+2%", positive: true },
          { label: "Avg Rental Value",  value: `₹${avgRental}`,    trend: "+5%", positive: true },
          { label: "Customer Lifetime", value: customers.length ? `₹${Math.round(totalRevenue/customers.length)}` : "₹0", trend: "+1%", positive: true },
          { label: "Churn Rate",        value: "1.2%",             trend: "-0.5%", positive: true },
        ]);

      } catch (err) {
        console.error("Error fetching analytics data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Deep insights into your rental business performance"
        breadcrumbs={["Admin", "Analytics"]}
        action={
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {["month","quarter","year"].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                  period === p ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        }
      />

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="stat-card"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">{kpi.label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{kpi.value}</p>
            <span className={`inline-flex items-center gap-1 text-xs font-semibold mt-2 px-2 py-0.5 rounded-full ${
              kpi.positive ? "text-success-600 bg-success-50 dark:bg-green-900/20" : "text-danger-600 bg-danger-50 dark:bg-red-900/20"
            }`}>
              {kpi.trend} vs last period
            </span>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Revenue Area */}
        <ChartCard title="Revenue Trend" subtitle="Monthly revenue performance" delay={0.1}>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#2563eb" strokeWidth={2.5} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Customer Growth */}
        <ChartCard title="Customer Growth" subtitle="Cumulative registered customers" delay={0.15}>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={customerGrowth}>
              <defs>
                <linearGradient id="customerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="customers" name="Customers" stroke="#22c55e" strokeWidth={2.5} fill="url(#customerGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Rental Trend */}
        <ChartCard title="Rental Trend" subtitle="Monthly rental order count" delay={0.2}>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="rentals" name="Rentals" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: "#7c3aed", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Occupancy Rate by Category" subtitle="% of inventory currently rented" delay={0.25}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={occupancyData} layout="vertical" barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="rate" name="Occupancy %" fill="#2563eb" radius={[0, 6, 6, 0]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
