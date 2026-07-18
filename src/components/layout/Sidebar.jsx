import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Package, Grid3X3, Users, FileText,
  RotateCcw, CreditCard, BarChart3, Settings, ChevronLeft,
  ChevronRight, TrendingUp, Boxes
} from 'lucide-react';

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { path: '/admin/products', icon: Package, label: 'Products' },
  { path: '/admin/categories', icon: Grid3X3, label: 'Categories' },
  { path: '/admin/customers', icon: Users, label: 'Customers' },
  { path: '/admin/rentals', icon: Boxes, label: 'Rentals' },
  { path: '/admin/returns', icon: RotateCcw, label: 'Returns' },
  { path: '/admin/payments', icon: CreditCard, label: 'Payments' },
  { path: '/admin/reports', icon: FileText, label: 'Reports' },
  { path: '/admin/analytics', icon: TrendingUp, label: 'Analytics' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 ease-in-out flex flex-col ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
      style={{
        background: 'linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(2,6,23,0.98) 100%)',
        borderRight: '1px solid rgba(51,65,85,0.4)',
      }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-slate-800/50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
            <Boxes size={20} className="text-white" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in-up">
              <h1 className="text-lg font-bold gradient-text tracking-tight">RentFlow</h1>
              <p className="text-[10px] text-slate-500 -mt-0.5 tracking-wider uppercase">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-indigo-500 rounded-r-full" />
                  )}
                  <item.icon size={20} className={`flex-shrink-0 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  {!collapsed && (
                    <span className="text-sm font-medium truncate">{item.label}</span>
                  )}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-slate-200 text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-slate-700">
                      {item.label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Collapse Button */}
      <div className="p-3 border-t border-slate-800/50">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-all"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
