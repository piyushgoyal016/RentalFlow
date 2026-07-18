import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function StatCard({ title, value, icon: Icon, trend, trendValue, trendLabel, color = "blue", loading = false, delay = 0 }) {
  const colorMap = {
    blue:   { icon: "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400",   ring: "ring-primary-100 dark:ring-primary-900/40"   },
    green:  { icon: "bg-success-50 text-success-600 dark:bg-green-900/30 dark:text-green-400",        ring: "ring-green-100 dark:ring-green-900/40"         },
    yellow: { icon: "bg-warning-50 text-warning-600 dark:bg-yellow-900/30 dark:text-yellow-400",     ring: "ring-yellow-100 dark:ring-yellow-900/40"       },
    red:    { icon: "bg-danger-50 text-danger-600 dark:bg-red-900/30 dark:text-red-400",             ring: "ring-red-100 dark:ring-red-900/40"             },
    purple: { icon: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",       ring: "ring-purple-100 dark:ring-purple-900/40"       },
    teal:   { icon: "bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",               ring: "ring-teal-100 dark:ring-teal-900/40"           },
  };

  const c = colorMap[color] || colorMap.blue;

  if (loading) {
    return (
      <div className="stat-card">
        <div className="skeleton h-4 w-24 mb-4" />
        <div className="skeleton h-8 w-32 mb-3" />
        <div className="skeleton h-3 w-20" />
      </div>
    );
  }

  const isPositive = trend === "up";
  const isNegative = trend === "down";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="stat-card group"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ring-4 ${c.icon} ${c.ring} flex-shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <motion.p
        className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay + 0.1 }}
      >
        {value}
      </motion.p>

      {trendValue !== undefined && (
        <div className="flex items-center gap-1.5 mt-3">
          <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
            isPositive ? "text-success-600 bg-success-50 dark:bg-green-900/30 dark:text-green-400" :
            isNegative ? "text-danger-600 bg-danger-50 dark:bg-red-900/30 dark:text-red-400" :
            "text-slate-500 bg-slate-100 dark:bg-slate-800"
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : isNegative ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            {trendValue}
          </span>
          {trendLabel && <span className="text-xs text-slate-400">{trendLabel}</span>}
        </div>
      )}
    </motion.div>
  );
}
