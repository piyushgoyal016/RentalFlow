import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DollarSign, ShoppingBag, RotateCcw, AlertTriangle,
  CreditCard, Vault, Users, Package, Star,
  Calendar, Clock, ArrowUpRight
} from "lucide-react";
import StatCard from "@/components/admin/dashboard/StatCard";
import RevenueChart from "@/components/admin/dashboard/RevenueChart";
import CategoryPieChart from "@/components/admin/dashboard/CategoryPieChart";
import ActivityTimeline from "@/components/admin/dashboard/ActivityTimeline";
import PageHeader from "@/components/admin/shared/PageHeader";
import { getDashboardStats } from "@/services/adminService";
import { useAuth } from "@/context/AuthContext";

// Colours for each category slice
const CAT_COLORS = ["#2563eb","#7c3aed","#0891b2","#059669","#d97706","#dc2626","#db2777","#65a30d"];

// Format relative time
function relativeTime(date) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [statsData,    setStatsData]    = useState(null);
  const [revenueData,  setRevenueData]  = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topProducts,  setTopProducts]  = useState([]);
  const [timeline,     setTimeline]     = useState([]);
  const [schedule,     setSchedule]     = useState([]);

  useEffect(() => {
    getDashboardStats()
      .then((res) => {
        const d = res.data?.data;
        if (!d) return;

        setStatsData(d);

        // ── Revenue chart ──────────────────────────────────────────────────
        setRevenueData(d.revenueChart || []);

        // ── Category pie (convert raw counts → % + assign colours) ────────
        const rawCats = d.categoryChart || [];
        const total   = rawCats.reduce((s, c) => s + c.value, 0) || 1;
        setCategoryData(
          rawCats.map((c, i) => ({
            name:  c.name,
            value: parseFloat(((c.value / total) * 100).toFixed(1)),
            color: CAT_COLORS[i % CAT_COLORS.length],
          }))
        );

        // ── Top products ───────────────────────────────────────────────────
        setTopProducts(d.topProducts || []);

        // ── Activity timeline (normalise title/subtitle → message) ─────────
        const items = (d.timeline || []).map((t) => ({
          id:      t.id,
          type:    t.type === "audit" ? "default" : (t.color === "red" ? "overdue" : "rental"),
          message: t.title,
          time:    relativeTime(t.time),
        }));
        setTimeline(items);

        // ── Schedule ───────────────────────────────────────────────────────
        setSchedule(d.schedule || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const STATS = [
    { title: "Total Revenue",    icon: DollarSign,     value: `₹${(statsData?.revenue || 0).toLocaleString()}`,        trend: "up",   trendValue: "+12%", trendLabel: "vs last month",  color: "blue"   },
    { title: "Rentals Active",   icon: ShoppingBag,    value: statsData?.activeRentals  || 0,                           trend: "up",   trendValue: "+2",   trendLabel: "vs yesterday",   color: "purple" },
    { title: "Returns Today",    icon: RotateCcw,      value: statsData?.upcomingReturns || 0,                          trend: "down", trendValue: "0",    trendLabel: "vs yesterday",   color: "teal"   },
    { title: "Late Fees",        icon: AlertTriangle,  value: `₹${(statsData?.lateFeesPending || 0).toLocaleString()}`, trend: "up",   trendValue: "+1",   trendLabel: "needs attention",color: "red"    },
    { title: "Pending Payments", icon: CreditCard,     value: `₹0`,                                                     trend: "down", trendValue: "0%",   trendLabel: "vs last week",   color: "yellow" },
    { title: "Deposits Held",    icon: Vault,          value: `₹${(statsData?.depositsHeld || 0).toLocaleString()}`,   trend: "up",   trendValue: "+0%",  trendLabel: "vs last month",  color: "purple" },
    { title: "Active Customers", icon: Users,          value: statsData?.customerCount  || 0,                           trend: "up",   trendValue: "+3",   trendLabel: "this month",     color: "green"  },
    { title: "Inventory Items",  icon: Package,        value: statsData?.productCount   || 0,                           trend: "down", trendValue: "0",    trendLabel: "checked out",    color: "blue"   },
  ];

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl gradient-primary p-6 text-white"
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #fff 0%, transparent 60%)" }} />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-primary-100 text-sm font-medium mb-1">{greeting} 👋</p>
            <h2 className="text-2xl font-bold">{user?.firstName || "Admin"}, welcome back!</h2>
            <p className="text-primary-200 text-sm mt-1">Here's what's happening with RentFlow today.</p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold">{statsData?.activeRentals || 0}</p>
              <p className="text-primary-200 text-xs mt-0.5">Rentals Active</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold">{statsData?.dueToday || 0}</p>
              <p className="text-primary-200 text-xs mt-0.5">Due Today</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold">₹{Math.round((statsData?.revenue || 0) / 1000)}k</p>
              <p className="text-primary-200 text-xs mt-0.5">Revenue YTD</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STATS.map((stat, i) => (
          <StatCard key={stat.title} {...stat} loading={loading} delay={i * 0.05} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RevenueChart data={revenueData} />
        </div>
        <CategoryPieChart data={categoryData} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Activity Timeline */}
        <div className="xl:col-span-1">
          <ActivityTimeline items={timeline} />
        </div>

        {/* Top Products */}
        <div className="xl:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Top Products</h3>
              <p className="text-sm text-slate-400 mt-0.5">Most rented this month</p>
            </div>
            <Star className="w-4 h-4 text-warning-500" />
          </div>
          <div className="space-y-4">
            {loading ? (
              [1,2,3].map(i => <div key={i} className="h-10 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />)
            ) : topProducts.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">No data yet.</p>
            ) : (
              topProducts.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-sm font-bold text-slate-300 dark:text-slate-600 w-5 text-center">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{p.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-slate-400">{p.rentals} rentals</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-success-600 font-medium">₹{Number(p.revenue || 0).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-xs font-medium text-warning-500">
                    <Star className="w-3 h-3 fill-warning-400 text-warning-400" />
                    {p.rating}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="xl:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Upcoming Schedule</h3>
              <p className="text-sm text-slate-400 mt-0.5">Pickups &amp; returns</p>
            </div>
            <Calendar className="w-4 h-4 text-primary-500" />
          </div>
          <div className="space-y-3">
            {loading ? (
              [1,2,3].map(i => <div key={i} className="h-14 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />)
            ) : schedule.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">No upcoming schedule.</p>
            ) : (
              schedule.map((s, i) => (
                <motion.div
                  key={s.id || i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${s.type === "return" ? "bg-teal-100 dark:bg-teal-900/30" : "bg-primary-100 dark:bg-primary-900/30"}`}>
                    {s.type === "return"
                      ? <RotateCcw className="w-4 h-4 text-teal-600" />
                      : <ArrowUpRight className="w-4 h-4 text-primary-600" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{s.customer}</p>
                    <p className="text-xs text-slate-400 truncate">{s.product}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.type === "return" ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400" : "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400"}`}>
                      {s.type === "return" ? "Return" : "Pickup"}
                    </span>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3" />
                      {new Date(s.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
