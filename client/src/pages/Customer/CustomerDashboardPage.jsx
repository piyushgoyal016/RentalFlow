import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package, Calendar, CreditCard, Shield, Clock,
  ArrowRight, ShoppingBag, User, Bell, ChevronRight
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { rentalService } from "@/services/rentalService";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await rentalService.getMyRentals();
        setRentals(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeRentals = rentals.filter(r => r.status === "active" || r.status === "confirmed");
  const overdueRentals = rentals.filter(r => r.status === "overdue");
  const completedRentals = rentals.filter(r => r.status === "completed");

  const totalSpent = rentals
    .filter(r => r.status === "completed" || r.status === "active" || r.status === "confirmed")
    .reduce((sum, r) => sum + r.totalAmount, 0);

  const securityDepositHeld = activeRentals.reduce((sum, r) => sum + r.securityDeposit, 0);

  return (
    <div className="py-8 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-64px)]">
      <div className="container-app max-w-6xl space-y-8">
        
        {/* ── Welcome Banner ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden gradient-primary text-white p-8 md:p-10 shadow-md"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-12 -translate-y-12" />
          <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-10" />

          <div className="relative max-w-xl space-y-3">
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold tracking-wide uppercase">
              Customer Hub
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Hello, {user?.firstName || "Member"}!
            </h1>
            <p className="text-white/80 text-sm md:text-base leading-relaxed">
              Welcome to your personal dashboard. Here you can track your active rentals, manage security deposits, and view recent transaction invoices.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-white text-primary-600 hover:bg-slate-50 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" />
                Browse Rentals
              </Link>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 bg-white/10 text-white hover:bg-white/20 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border border-white/10"
              >
                <User className="w-4 h-4" />
                Manage Profile
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── Quick Stats Grid ─────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {[
            {
              label: "Active Rentals",
              value: activeRentals.length,
              icon: Package,
              color: "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/30",
            },
            {
              label: "Overdue Items",
              value: overdueRentals.length,
              icon: Clock,
              color: overdueRentals.length > 0
                ? "text-danger-600 dark:text-red-400 bg-danger-50 dark:bg-red-950/30 animate-pulse"
                : "text-slate-500 bg-slate-100 dark:bg-slate-800/60",
            },
            {
              label: "Security Deposits Held",
              value: formatCurrency(securityDepositHeld),
              icon: Shield,
              color: "text-warning-600 dark:text-warning-400 bg-warning-50 dark:bg-yellow-950/30",
            },
            {
              label: "Total Spend",
              value: formatCurrency(totalSpent),
              icon: CreditCard,
              color: "text-success-600 dark:text-success-400 bg-success-50 dark:bg-green-950/30",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[120px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-4.5 h-4.5 w-4 h-4" />
                </div>
              </div>
              <p className="text-xl md:text-2xl font-bold text-slate-950 dark:text-white mt-4">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Main Content Grid ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Active Items & Timeline (Left 2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Current Rental Status</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Items currently checked out or ready for pickup</p>
                </div>
                <Link to="/my-rentals" className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                  View All History
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="skeleton w-12 h-12 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="skeleton h-4 w-32" />
                        <div className="skeleton h-3 w-48" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : activeRentals.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">No active rental orders found</p>
                  <Link to="/products" className="text-xs text-primary-600 font-semibold mt-2 inline-block">Rent your first item now</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeRentals.map(rental => {
                    const daysLeft = Math.max(0, Math.ceil((new Date(rental.endDate) - new Date()) / (1000 * 60 * 60 * 24)));
                    return (
                      <div
                        key={rental.id}
                        onClick={() => navigate(`/my-rentals/${rental.id}`)}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/50"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={rental.product?.image || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80"}
                            alt={rental.product?.name}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white text-sm">{rental.product?.name}</p>
                            <p className="text-xs text-slate-400 mt-0.5">Due date: {formatDate(rental.endDate)}</p>
                          </div>
                        </div>

                        {/* Progress slider bar representation */}
                        <div className="mt-3 md:mt-0 flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xs font-semibold text-slate-500">{daysLeft} days remaining</p>
                            <div className="w-24 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 mt-1 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary-600"
                                style={{ width: `${Math.min(100, Math.max(10, (daysLeft / rental.duration) * 100))}%` }}
                              />
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 hidden md:block" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Menu (Right 1 column) */}
          <div className="space-y-6">
            
            {/* Quick Links Menu */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { label: "My Rentals", desc: "View transaction receipts & dates", to: "/my-rentals", icon: Package },
                  { label: "Settings", desc: "Edit contact info", to: "/profile", icon: User },
                  { label: "Notifications", desc: "View recent updates", to: "/notifications", icon: Bell },
                ].map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 flex-shrink-0">
                      <link.icon className="w-4.5 h-4.5 w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-none">{link.label}</p>
                      <p className="text-[10px] text-slate-400 mt-1 truncate">{link.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Support Box */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <Shield className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Need Help?</p>
                <p className="text-xs text-slate-400 mt-1">If you have issues with physical damage disputes or returns, contact support.</p>
              </div>
              <button className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Contact Customer Support
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
