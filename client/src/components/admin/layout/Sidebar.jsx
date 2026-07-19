import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Tag, Package, ShoppingBag,
  FileText, RotateCcw, CreditCard, Vault, BarChart2,
  TrendingUp, Bell, Settings, LogOut, ChevronLeft,
  ChevronRight, Building2, Menu, List, ClipboardList
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV_GROUPS = [
  {
    label: "Main",
    items: [
      { to: "/admin",            icon: LayoutDashboard, label: "Dashboard",   exact: true },
      { to: "/admin/customers",  icon: Users,           label: "Customers"   },
      { to: "/admin/categories", icon: Tag,             label: "Categories"  },
      { to: "/admin/inventory",  icon: Package,         label: "Inventory"   },
      { to: "/admin/products",   icon: ShoppingBag,     label: "Products"    },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/admin/rentals",            icon: FileText,      label: "Rentals"               },
      { to: "/admin/returns",            icon: RotateCcw,     label: "Returns"               },
      { to: "/admin/payments",           icon: CreditCard,    label: "Payments"              },
      { to: "/admin/deposits",           icon: Vault,         label: "Deposits"              },
      { to: "/admin/pricelists",         icon: List,          label: "Pricelists"            },
      { to: "/admin/quotation-templates",icon: ClipboardList, label: "Quotation Templates"   },
    ],
  },
  {
    label: "Insights",
    items: [
      { to: "/admin/reports",    icon: BarChart2,       label: "Reports"     },
      { to: "/admin/analytics",  icon: TrendingUp,      label: "Analytics"   },
    ],
  },
  {
    label: "Account",
    items: [
      { to: "/admin/notifications", icon: Bell,         label: "Notifications" },
      { to: "/admin/settings",      icon: Settings,     label: "Settings"    },
    ],
  },
];

const sidebarVariants = {
  expanded: { width: 240 },
  collapsed: { width: 68 },
};

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isVendor = user?.role?.toUpperCase() === "VENDOR";

  const filteredNavGroups = NAV_GROUPS.map((group) => {
    if (!isVendor) return group;

    const restrictedForVendor = [
      "/admin/customers",
      "/admin/categories",
      "/admin/payments",
      "/admin/deposits",
      "/admin/reports",
      "/admin/analytics",
      "/admin/settings"
    ];

    const filteredItems = group.items.filter(
      (item) => !restrictedForVendor.includes(item.to)
    );

    return { ...group, items: filteredItems };
  }).filter((group) => group.items.length > 0);

  return (
    <motion.aside
      className="admin-sidebar select-none"
      variants={sidebarVariants}
      animate={collapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Logo + Collapse toggle */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-100 dark:border-slate-800 min-h-[64px]">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2.5 overflow-hidden"
            >
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[15px] font-bold text-slate-900 dark:text-white leading-none">RentFlow</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{isVendor ? "Vendor Portal" : "Admin Portal"}</p>
              </div>
            </motion.div>
          )}
          {collapsed && (
            <motion.div
              key="icon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center mx-auto"
            >
              <Building2 className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-all flex-shrink-0"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto overflow-x-hidden">
        {filteredNavGroups.map((group) => (
          <div key={group.label}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600 px-3 mb-2"
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <SidebarItem key={item.to} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 mb-2"
          >
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.firstName?.[0] || ""}{user?.lastName?.[0] || ""}
            </div>
            <div className="overflow-hidden">
              <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 truncate leading-none">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate capitalize">{user?.role?.toLowerCase() || "Admin"}</p>
            </div>
          </motion.div>
        )}
        <button
          onClick={handleLogout}
          className={`nav-item w-full text-left text-danger-600 hover:bg-danger-50 dark:hover:bg-red-950/30 dark:text-red-400 ${collapsed ? "justify-center px-2" : ""}`}
          title="Logout"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}


function SidebarItem({ item, collapsed }) {
  return (
    <NavLink
      to={item.to}
      end={item.exact}
      className={({ isActive }) =>
        `nav-item ${isActive ? "active" : ""} ${collapsed ? "justify-center px-2" : ""}`
      }
      title={collapsed ? item.label : undefined}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="sidebar-active-pill"
              className="nav-active-indicator"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>
        </>
      )}
    </NavLink>
  );
}
