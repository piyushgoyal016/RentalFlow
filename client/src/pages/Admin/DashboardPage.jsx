import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DollarSign, ShoppingBag, RotateCcw, AlertTriangle,
  CreditCard, Vault, Users, Package, Star, ArrowRight,
  Calendar, Clock
} from "lucide-react";
import StatCard from "@/components/admin/dashboard/StatCard";
import RevenueChart from "@/components/admin/dashboard/RevenueChart";
import CategoryPieChart from "@/components/admin/dashboard/CategoryPieChart";
import ActivityTimeline from "@/components/admin/dashboard/ActivityTimeline";
import PageHeader from "@/components/admin/shared/PageHeader";
import { getMockRevenueData, getMockCategoryData, getMockTopProducts, getMockActivityTimeline } from "@/services/adminService";
import { useAuth } from "@/context/AuthContext";

const STATS = [
  { title: "Total Revenue",      icon: DollarSign,  value: "₹8,64,200",   trend: "up",   trendValue: "+12.4%", trendLabel: "vs last month", color: "blue"   },
  { title: "Rentals Today",      icon: ShoppingBag, value: "24",           trend: "up",   trendValue: "+3",     trendLabel: "vs yesterday",  color: "purple" },
  { title: "Returns Today",      icon: RotateCcw,   value: "18",           trend: "down", trendValue: "-2",     trendLabel: "vs yesterday",  color: "teal"   },
  { title: "Late Returns",       icon: AlertTriangle,value: "7",           trend: "up",   trendValue: "+2",     trendLabel: "needs attention",color: "red"   },
  { title: "Pending Payments",   icon: CreditCard,  value: "₹42,800",     trend: "down", trendValue: "-8.1%",  trendLabel: "vs last week",  color: "yellow" },
  { title: "Deposits Held",      icon: Vault,       value: "₹1,24,500",   trend: "up",   trendValue: "+5.2%",  trendLabel: "vs last month", color: "purple" },
  { title: "Active Customers",   icon: Users,       value: "1,284",        trend: "up",   trendValue: "+48",    trendLabel: "this month",    color: "green"  },
  { title: "Inventory Items",    icon: Package,     value: "342",          trend: "down", trendValue: "-6",     trendLabel: "checked out",   color: "blue"   },
];

const UPCOMING = [
  { id: "R-2051", customer: "Rahul Sharma",   product: "Canon EOS R5",   date: "Today, 3:00 PM",    type: "pickup" },
  { id: "R-2048", customer: "Priya Patel",    product: "DJI Mavic Pro 3",date: "Today, 5:00 PM",    type: "return" },
  { id: "R-2053", customer: "Amit Verma",     product: "Sony A7 IV",     date: "Tomorrow, 10:00 AM",type: "pickup" },
  { id: "R-2044", customer: "Sunita Joshi",   product: "Tent 6-Person",  date: "Tomorrow, 2:00 PM", type: "return" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const revenueData  = getMockRevenueData();
  const categoryData = getMockCategoryData();
  const topProducts  = getMockTopProducts();
  const timeline     = getMockActivityTimeline();

  const hour = new Date().getHours();
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
              <p className="text-2xl font-bold">24</p>
              <p className="text-primary-200 text-xs mt-0.5">Rentals Active</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold">7</p>
              <p className="text-primary-200 text-xs mt-0.5">Due Today</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold">₹8.6L</p>
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
            {topProducts.map((p, i) => (
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
                    <span className="text-xs text-success-600 font-medium">₹{p.revenue.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 text-xs font-medium text-warning-500">
                  <Star className="w-3 h-3 fill-warning-400 text-warning-400" />
                  {p.rating}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Upcoming Pickups / Returns */}
        <div className="xl:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Upcoming Schedule</h3>
              <p className="text-sm text-slate-400 mt-0.5">Pickups & returns</p>
            </div>
            <Calendar className="w-4 h-4 text-primary-500" />
          </div>
          <div className="space-y-3">
            {UPCOMING.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.type === "pickup" ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30" : "bg-success-50 text-success-600 dark:bg-green-900/30"}`}>
                  {item.type === "pickup" ? <ShoppingBag className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{item.customer}</p>
                  <p className="text-xs text-slate-400 truncate">{item.product}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-slate-300" />
                    <span className="text-xs text-slate-400">{item.date}</span>
                  </div>
                </div>
                <span className={`badge flex-shrink-0 ${item.type === "pickup" ? "badge-pending" : "badge-active"}`}>
                  {item.type}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
