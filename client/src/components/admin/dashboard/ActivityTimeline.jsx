import { motion } from "framer-motion";
import { FileText, CreditCard, RotateCcw, AlertTriangle, Vault, TrendingUp } from "lucide-react";

const TYPE_CONFIG = {
  rental:  { icon: FileText,      color: "text-primary-500",  bg: "bg-primary-50 dark:bg-primary-900/20"  },
  payment: { icon: CreditCard,    color: "text-success-600",  bg: "bg-success-50 dark:bg-green-900/20"    },
  return:  { icon: RotateCcw,     color: "text-teal-500",     bg: "bg-teal-50 dark:bg-teal-900/20"        },
  overdue: { icon: AlertTriangle, color: "text-danger-600",   bg: "bg-danger-50 dark:bg-red-900/20"       },
  deposit: { icon: Vault,         color: "text-purple-500",   bg: "bg-purple-50 dark:bg-purple-900/20"    },
  default: { icon: TrendingUp,    color: "text-slate-500",    bg: "bg-slate-100 dark:bg-slate-800"         },
};

export default function ActivityTimeline({ items = [] }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
        <p className="text-sm text-slate-400 mt-0.5">Latest events across the system</p>
      </div>
      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-slate-100 dark:bg-slate-800" />
        <div className="space-y-4">
          {items.map((item, i) => {
            const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.default;
            const Icon = cfg.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="flex items-start gap-3 relative"
              >
                <div className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center flex-shrink-0 z-10 ${cfg.bg}`}>
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">{item.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
