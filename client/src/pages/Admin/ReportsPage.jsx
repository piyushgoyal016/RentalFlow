import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, BarChart2, Users, Package, AlertTriangle } from "lucide-react";
import PageHeader from "@/components/admin/shared/PageHeader";
import StatusBadge from "@/components/admin/shared/StatusBadge";

const TABS = [
  { id: "revenue",     label: "Revenue",     icon: BarChart2    },
  { id: "rentals",     label: "Rentals",     icon: FileText     },
  { id: "customers",   label: "Customers",   icon: Users        },
  { id: "inventory",   label: "Inventory",   icon: Package      },
  { id: "late",        label: "Late Returns",icon: AlertTriangle },
];

const REVENUE_DATA = [
  { month: "January",  rentals: 38, revenue: 42000, avgRental: 1105 },
  { month: "February", rentals: 34, revenue: 38000, avgRental: 1118 },
  { month: "March",    rentals: 47, revenue: 51000, avgRental: 1085 },
  { month: "April",    rentals: 43, revenue: 47000, avgRental: 1093 },
  { month: "May",      rentals: 58, revenue: 63000, avgRental: 1086 },
  { month: "June",     rentals: 53, revenue: 58000, avgRental: 1094 },
  { month: "July",     rentals: 67, revenue: 72000, avgRental: 1075 },
];

const LATE_RETURNS = [
  { rentalId: "R-2048", customer: "Sunita Joshi",   product: "Camping Tent",   daysLate: 4, fee: 2000, status: "OVERDUE" },
  { rentalId: "R-2041", customer: "Vikas Kumar",    product: "Canon EOS R5",   daysLate: 2, fee: 3000, status: "OVERDUE" },
  { rentalId: "R-2038", customer: "Meera Nair",     product: "Power Washer",   daysLate: 7, fee: 5600, status: "OVERDUE" },
];

function RevenueReport() {
  const total = REVENUE_DATA.reduce((s, r) => s + r.revenue, 0);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "YTD Revenue",    value: `₹${total.toLocaleString()}`                },
          { label: "Total Rentals",  value: REVENUE_DATA.reduce((s, r) => s + r.rentals, 0) },
          { label: "Avg per Rental", value: `₹${Math.round(total / REVENUE_DATA.reduce((s, r) => s + r.rentals, 0)).toLocaleString()}` },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-center">
            <p className="text-xl font-bold text-primary-700 dark:text-primary-300">{s.value}</p>
            <p className="text-xs text-primary-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Rentals</th>
              <th>Revenue</th>
              <th>Avg / Rental</th>
              <th>% Change</th>
            </tr>
          </thead>
          <tbody>
            {REVENUE_DATA.map((r, i) => {
              const prev = REVENUE_DATA[i - 1];
              const change = prev ? ((r.revenue - prev.revenue) / prev.revenue * 100).toFixed(1) : null;
              return (
                <tr key={r.month}>
                  <td className="font-medium text-slate-900 dark:text-white">{r.month}</td>
                  <td>{r.rentals}</td>
                  <td className="font-semibold text-primary-600">₹{r.revenue.toLocaleString()}</td>
                  <td>₹{r.avgRental.toLocaleString()}</td>
                  <td>
                    {change !== null && (
                      <span className={`text-sm font-medium ${parseFloat(change) >= 0 ? "text-success-600" : "text-danger-600"}`}>
                        {parseFloat(change) >= 0 ? "+" : ""}{change}%
                      </span>
                    )}
                    {change === null && <span className="text-slate-400">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LateReturnsReport() {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-danger-50 dark:bg-red-900/20 border border-danger-100 dark:border-red-800 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-danger-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-danger-700 dark:text-red-400">{LATE_RETURNS.length} overdue rentals</p>
          <p className="text-xs text-danger-600 dark:text-red-400">Total late fees: ₹{LATE_RETURNS.reduce((s, r) => s + r.fee, 0).toLocaleString()}</p>
        </div>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Rental ID</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Days Late</th>
            <th>Late Fee</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {LATE_RETURNS.map(r => (
            <tr key={r.rentalId}>
              <td><code className="text-xs font-mono text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-1.5 py-0.5 rounded">{r.rentalId}</code></td>
              <td className="font-medium text-slate-900 dark:text-white">{r.customer}</td>
              <td>{r.product}</td>
              <td><span className="font-bold text-danger-600">{r.daysLate}</span></td>
              <td className="font-semibold text-danger-600">₹{r.fee.toLocaleString()}</td>
              <td><StatusBadge status={r.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ReportsPage() {
  const [tab, setTab] = useState("revenue");

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Generate and export detailed business reports"
        breadcrumbs={["Admin", "Reports"]}
        action={
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Download className="w-4 h-4" /> CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-all">
              <Download className="w-4 h-4" /> PDF
            </button>
          </div>
        }
      />

      {/* Date range filter */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <select className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option>This Year (2025)</option>
          <option>This Month</option>
          <option>Last 30 Days</option>
          <option>Custom Range</option>
        </select>
        <input type="date" className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
        <span className="text-slate-400 text-sm">to</span>
        <input type="date" className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-2xl w-fit flex-wrap">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t.id
                ? "bg-white dark:bg-slate-900 text-primary-600 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6"
      >
        {tab === "revenue" && <RevenueReport />}
        {tab === "late"    && <LateReturnsReport />}
        {["rentals","customers","inventory"].includes(tab) && (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium capitalize">{tab} report</p>
            <p className="text-sm text-slate-400 mt-1">Data loads from the API when connected.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
