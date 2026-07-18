import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Tag, Package, ClipboardList,
  MapPin, CreditCard, User, Bell, LogOut,
  ChevronLeft, ChevronRight, ShoppingBag
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const CUSTOMER_NAV = [
  {
    label: "Portal",
    items: [
      { to: "/dashboard",        icon: LayoutDashboard, label: "Dashboard",   exact: true },
      { to: "/products",         icon: ShoppingBag,     label: "Rent Store"    },
      { to: "/my-rentals",       icon: ClipboardList,   label: "My Rentals"    },
    ],
  },
  {
    label: "Billing & Shipping",
    items: [
      { to: "/payments",         icon: CreditCard,      label: "Payments"      },
      { to: "/addresses",        icon: MapPin,          label: "My Addresses"  },
    ],
  },
  {
    label: "Settings",
    items: [
      { to: "/profile",          icon: User,            label: "Profile"       },
      { to: "/notifications",    icon: Bell,            label: "Notifications" },
    ],
  },
];

const sidebarVariants = {
  expanded: { width: 240 },
  collapsed: { width: 68 },
};

export default function CustomerSidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <motion.aside
      className="admin-sidebar select-none bg-slate-900 text-slate-300 dark:bg-slate-950 border-r border-slate-800"
      variants={sidebarVariants}
      animate={collapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Brand logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-800 min-h-[64px]">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2.5 overflow-hidden"
            >
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-white leading-none">RentFlow</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Customer Portal</p>
              </div>
            </motion.div>
          )}
          {collapsed && (
            <motion.div
              key="icon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center mx-auto"
            >
              <Package className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all flex-shrink-0"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto overflow-x-hidden">
        {CUSTOMER_NAV.map((group) => (
          <div key={group.label}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 px-3 mb-2"
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary-600 text-white shadow-md shadow-primary-900/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    } ${collapsed ? "justify-center px-2" : ""}`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="w-4.5 h-4.5 w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Profile / Logout */}
      <div className="px-3 py-4 border-t border-slate-800 space-y-1">
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-800/40 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.firstName?.[0] || ""}{user?.lastName?.[0] || ""}
            </div>
            <div className="overflow-hidden">
              <p className="text-[13px] font-semibold text-white truncate leading-none">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate capitalize">Customer</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors ${collapsed ? "justify-center px-2" : ""}`}
          title="Logout"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
