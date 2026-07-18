import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { rentalService } from "@/services/rentalService";
import {
  ShoppingBag, ClipboardList, AlertTriangle, Clock,
  ArrowRight, Package, Calendar, ChevronRight
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const StatCard = ({ title, icon: Icon, value, subtitle, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{value}</p>
        {subtitle && (
          <p className="text-xs font-medium text-slate-400 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  </motion.div>
);

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await rentalService.getMyRentals({ status: "all" });
        setRentals(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const activeRentals = rentals.filter(r => 
    ["active", "confirmed", "picked_up", "reserved", "booked"].includes(r.status)
  );
  
  const overdueRentals = rentals.filter(r => r.status === "overdue");
  
  const totalSpent = rentals.reduce((acc, r) => acc + (r.totalAmount || 0), 0);

  // Get up to 4 most recent rentals for the list
  const recentRentals = rentals.slice(0, 4);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="py-6 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-64px)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 p-8 text-white shadow-lg"
        >
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 50%)" }} />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-primary-100 text-sm font-medium mb-1">{greeting} 👋</p>
              <h1 className="text-3xl font-bold">{user?.firstName || "Customer"}, welcome to your dashboard!</h1>
              <p className="text-primary-200 mt-2 max-w-lg leading-relaxed">
                Track your active rentals, manage returns, and discover new products to rent—all in one place.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/products" className="px-5 py-2.5 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors shadow-sm whitespace-nowrap">
                Browse Store
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard
            title="Active Rentals"
            value={loading ? "..." : activeRentals.length}
            subtitle="Currently rented items"
            icon={Package}
            color="bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
            delay={0.1}
          />
          <StatCard
            title="Overdue Items"
            value={loading ? "..." : overdueRentals.length}
            subtitle="Requires immediate return"
            icon={AlertTriangle}
            color={overdueRentals.length > 0 ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"}
            delay={0.2}
          />
          <StatCard
            title="Total Spent"
            value={loading ? "..." : formatCurrency(totalSpent)}
            subtitle="Across all orders"
            icon={ShoppingBag}
            color="bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
            delay={0.3}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Orders Table */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Rentals</h2>
                <p className="text-sm text-slate-500">Your most recent rental activities</p>
              </div>
              <Link to="/my-rentals" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="pb-3 px-2">Item</th>
                    <th className="pb-3 px-2">Date</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-slate-400">Loading rentals...</td>
                    </tr>
                  ) : recentRentals.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <ClipboardList className="w-10 h-10 text-slate-300 mb-2" />
                          <p className="text-slate-500 text-sm">No recent rentals found.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    recentRentals.map((rental) => (
                      <tr key={rental.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                            <img src={rental.product?.image} alt={rental.product?.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100 flex-shrink-0" />
                            <span className="font-medium text-sm text-slate-900 dark:text-white">{rental.product?.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-900 dark:text-slate-200">{new Date(rental.startDate).toLocaleDateString()}</span>
                            <span className="text-[10px] text-slate-400">to {new Date(rental.endDate).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            rental.status === "active" ? "bg-primary-50 text-primary-600" :
                            rental.status === "completed" ? "bg-green-50 text-green-600" :
                            rental.status === "overdue" ? "bg-red-50 text-red-600" :
                            "bg-slate-100 text-slate-600"
                          }`}>
                            {rental.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right font-medium text-sm text-slate-900 dark:text-white">
                          {formatCurrency(rental.totalAmount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side action card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">Upcoming Returns</h3>
              </div>
              <p className="text-sm text-slate-500 mb-4">
                {activeRentals.length > 0 
                  ? `You have ${activeRentals.length} item(s) due soon. Make sure to return them on time to avoid late fees.`
                  : "You have no upcoming returns at this time."}
              </p>
              {activeRentals.length > 0 && (
                <div className="space-y-3 mb-4">
                  {activeRentals.slice(0, 2).map(r => (
                    <div key={r.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{r.product?.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Due: {new Date(r.endDate).toLocaleDateString()}</p>
                      </div>
                      <Clock className="w-4 h-4 text-orange-500 flex-shrink-0 ml-2" />
                    </div>
                  ))}
                </div>
              )}
              <Link to="/my-rentals" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Manage Returns
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
