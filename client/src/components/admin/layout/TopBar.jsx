import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, Sun, Moon, Globe, ChevronDown,
  User, Settings, LogOut, Plus, LayoutDashboard,
  Users, ShoppingBag, FileText, Command
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const QUICK_CREATE = [
  { label: "New Rental",    icon: FileText,   to: "/admin/rentals?new=1"   },
  { label: "New Customer",  icon: Users,      to: "/admin/customers?new=1" },
  { label: "New Product",   icon: ShoppingBag,to: "/admin/products?new=1"  },
];

export default function TopBar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [quickOpen, setQuickOpen]   = useState(false);
  const [notifOpen, setNotifOpen]   = useState(false);
  const [cmdOpen, setCmdOpen]       = useState(false);
  const profileRef = useRef(null);
  const quickRef   = useRef(null);
  const notifRef   = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (quickRef.current   && !quickRef.current.contains(e.target))   setQuickOpen(false);
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen(true);
      }
      if (e.key === "Escape") setCmdOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`;

  return (
    <>
      <header className="admin-topbar">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Search Bar */}
        <button
          onClick={() => setCmdOpen(true)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-sm flex-1 max-w-xs"
        >
          <Search className="w-4 h-4" />
          <span className="text-slate-400 text-sm">Search anything…</span>
          <span className="ml-auto flex items-center gap-0.5 text-xs text-slate-300 dark:text-slate-600 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono">
            <Command className="w-3 h-3" />K
          </span>
        </button>

        <div className="flex-1" />

        {/* Right actions */}
        <div className="flex items-center gap-1">

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-all"
            title={isDark ? "Light mode" : "Dark mode"}
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon className="w-[18px] h-[18px]" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(o => !o)}
              className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-all"
            >
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-float z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</span>
                    <span className="text-xs text-primary-600 cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  {[
                    { msg: "Rental #R-2048 is due tomorrow", time: "5 min ago", unread: true },
                    { msg: "Payment received – ₹4,500",      time: "1 hr ago",  unread: true },
                    { msg: "New customer registered",         time: "3 hrs ago", unread: false },
                  ].map((n, i) => (
                    <div key={i} className={`px-4 py-3 flex gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer ${n.unread ? "bg-primary-50/50 dark:bg-primary-900/10" : ""}`}>
                      {n.unread && <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" />}
                      {!n.unread && <span className="w-2 h-2 rounded-full bg-transparent flex-shrink-0 mt-1.5" />}
                      <div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{n.msg}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                  <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 text-center">
                    <button onClick={() => { navigate("/admin/notifications"); setNotifOpen(false); }} className="text-xs text-primary-600 hover:underline font-medium">
                      View all notifications →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Create */}
          <div className="relative" ref={quickRef}>
            <button
              onClick={() => setQuickOpen(o => !o)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-all shadow-sm hover:shadow-glow"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:block">Create</span>
              <ChevronDown className="w-3.5 h-3.5 hidden sm:block" />
            </button>
            <AnimatePresence>
              {quickOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-float z-50 p-1.5"
                >
                  {QUICK_CREATE.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => { navigate(item.to); setQuickOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <item.icon className="w-4 h-4 text-primary-500" />
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(o => !o)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-[11px] font-bold">
                {initials}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden md:block">
                {user?.firstName}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-float z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
                  </div>
                  <div className="p-1.5">
                    {[
                      { icon: User,    label: "My Profile", to: "/admin/settings" },
                      { icon: Settings,label: "Settings",   to: "/admin/settings" },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => { navigate(item.to); setProfileOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <item.icon className="w-4 h-4 text-slate-400" />
                        {item.label}
                      </button>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-danger-600 dark:text-red-400 hover:bg-danger-50 dark:hover:bg-red-950/30 transition-colors mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Command Palette */}
      <AnimatePresence>
        {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

const CMD_ITEMS = [
  { icon: LayoutDashboard, label: "Go to Dashboard",    to: "/admin"               },
  { icon: Users,           label: "Go to Customers",    to: "/admin/customers"     },
  { icon: ShoppingBag,     label: "Go to Products",     to: "/admin/products"      },
  { icon: FileText,        label: "Go to Rentals",      to: "/admin/rentals"       },
  { icon: Settings,        label: "Go to Settings",     to: "/admin/settings"      },
  { icon: FileText,        label: "Create New Rental",  to: "/admin/rentals?new=1" },
  { icon: Users,           label: "Add New Customer",   to: "/admin/customers?new=1" },
];

function CommandPalette({ onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtered = CMD_ITEMS.filter(i => i.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <motion.div
      className="command-palette-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="command-palette-box"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-700">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search pages, actions…"
            className="flex-1 text-sm text-slate-900 dark:text-white bg-transparent outline-none placeholder:text-slate-400"
          />
          <kbd className="text-[11px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">ESC</kbd>
        </div>
        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <p className="text-center text-sm text-slate-400 py-8">No results found</p>
          )}
          {filtered.map((item, i) => (
            <button
              key={i}
              onClick={() => { navigate(item.to); onClose(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
            >
              <item.icon className="w-4 h-4 text-slate-400" />
              {item.label}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
