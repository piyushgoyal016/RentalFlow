import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Check, Trash2, Package, CreditCard, RotateCcw, AlertTriangle, Users } from "lucide-react";
import PageHeader from "@/components/admin/shared/PageHeader";


const TYPE_CONFIG = {
  rental:   { icon: Package,       bg: "bg-primary-50 dark:bg-primary-900/20",    text: "text-primary-600 dark:text-primary-400"  },
  payment:  { icon: CreditCard,    bg: "bg-success-50 dark:bg-green-900/20",      text: "text-success-600 dark:text-green-400"    },
  return:   { icon: RotateCcw,     bg: "bg-teal-50 dark:bg-teal-900/20",          text: "text-teal-600 dark:text-teal-400"        },
  overdue:  { icon: AlertTriangle, bg: "bg-danger-50 dark:bg-red-900/20",         text: "text-danger-600 dark:text-red-400"       },
  customer: { icon: Users,         bg: "bg-purple-50 dark:bg-purple-900/20",      text: "text-purple-600 dark:text-purple-400"    },
};



export default function NotificationsPage() {
  const [notifs, setNotifs] = useState([]);
  const [filter, setFilter] = useState("all");

  const filtered = notifs.filter(n => {
    if (filter === "unread") return !n.isRead;
    return true;
  });

  const unreadCount = notifs.filter(n => !n.isRead).length;

  const markRead = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
  const deleteNotif = (id) => setNotifs(prev => prev.filter(n => n.id !== id));

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={`${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}
        breadcrumbs={["Admin", "Notifications"]}
        action={
          unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Check className="w-4 h-4" /> Mark all read
            </button>
          )
        }
      />

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {["all","unread"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
              filter === f ? "bg-primary-600 text-white" : "border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {f} {f === "unread" && unreadCount > 0 && `(${unreadCount})`}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <Bell className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">No notifications</p>
          </div>
        ) : filtered.map((n, i) => {
          const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.rental;
          const Icon = cfg.icon;
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                !n.isRead
                  ? "border-primary-100 dark:border-primary-900/40 bg-primary-50/30 dark:bg-primary-900/10"
                  : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                <Icon className={`w-5 h-5 ${cfg.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <p className={`text-sm font-semibold ${!n.isRead ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                    {n.title}
                  </p>
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" />}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                <p className="text-xs text-slate-400 mt-1">{n.time}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!n.isRead && (
                  <button onClick={() => markRead(n.id)} title="Mark read"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-success-600 hover:bg-success-50 dark:hover:bg-green-900/20 transition-colors">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
                <button onClick={() => deleteNotif(n.id)} title="Delete"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-red-900/20 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
