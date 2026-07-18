import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Download, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";
import PageHeader from "@/components/admin/shared/PageHeader";
import StatusBadge from "@/components/admin/shared/StatusBadge";

const MOCK_PAYMENTS = [
  { id: "PAY-5021", rentalId: "R-2051", customer: "Rahul Sharma",  amount: 10500, status: "COMPLETED", method: "UPI",         date: "Jul 15, 2025", invoice: "#INV-5021" },
  { id: "PAY-5020", rentalId: "R-2050", customer: "Priya Patel",   amount: 7500,  status: "PENDING",   method: "—",           date: "Jul 14, 2025", invoice: "#INV-5020" },
  { id: "PAY-5019", rentalId: "R-2049", customer: "Amit Verma",    amount: 6600,  status: "COMPLETED", method: "Credit Card", date: "Jul 12, 2025", invoice: "#INV-5019" },
  { id: "PAY-5018", rentalId: "R-2048", customer: "Sunita Joshi",  amount: 4000,  status: "FAILED",    method: "UPI",         date: "Jul 10, 2025", invoice: "#INV-5018" },
  { id: "PAY-5017", rentalId: "R-2047", customer: "Karan Malhotra",amount: 1200,  status: "REFUNDED",  method: "Credit Card", date: "Jul 08, 2025", invoice: "#INV-5017" },
  { id: "PAY-5016", rentalId: "R-2046", customer: "Anita Singh",   amount: 800,   status: "COMPLETED", method: "Net Banking", date: "Jul 05, 2025", invoice: "#INV-5016" },
];

const STATUS_ICONS = {
  COMPLETED: <CheckCircle className="w-4 h-4 text-success-500" />,
  PENDING:   <Clock className="w-4 h-4 text-warning-500" />,
  FAILED:    <XCircle className="w-4 h-4 text-danger-500" />,
  REFUNDED:  <RefreshCw className="w-4 h-4 text-primary-500" />,
};

export default function PaymentsPage() {
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => { setTimeout(() => setLoading(false), 700); }, []);

  const filtered = MOCK_PAYMENTS.filter(p => {
    const match = p.customer.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search);
    const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
    return match && matchStatus;
  });

  const totalRevenue    = MOCK_PAYMENTS.filter(p => p.status === "COMPLETED").reduce((s, p) => s + p.amount, 0);
  const pendingAmount   = MOCK_PAYMENTS.filter(p => p.status === "PENDING").reduce((s, p) => s + p.amount, 0);
  const refundedAmount  = MOCK_PAYMENTS.filter(p => p.status === "REFUNDED").reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle="Track all payment transactions and invoices"
        breadcrumbs={["Admin", "Payments"]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: "Total Collected",  value: `₹${totalRevenue.toLocaleString()}`,   color: "text-success-600",  bg: "bg-success-50 dark:bg-green-900/20"  },
          { label: "Pending Payment",  value: `₹${pendingAmount.toLocaleString()}`,   color: "text-warning-600",  bg: "bg-warning-50 dark:bg-yellow-900/20" },
          { label: "Total Refunded",   value: `₹${refundedAmount.toLocaleString()}`,  color: "text-primary-600",  bg: "bg-primary-50 dark:bg-primary-900/20" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`rounded-2xl p-5 ${s.bg} border border-transparent`}
          >
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by customer or payment ID…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["ALL","COMPLETED","PENDING","FAILED","REFUNDED"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all ${
                statusFilter === s
                  ? "bg-primary-600 text-white"
                  : "border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Rental ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
                <th>Status</th>
                <th>Invoice</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => <tr key={i}>{[...Array(9)].map((_, j) => <td key={j}><div className="skeleton h-4 w-20" /></td>)}</tr>)
              ) : filtered.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                  <td><code className="text-xs font-mono text-slate-500">{p.id}</code></td>
                  <td><code className="text-xs font-mono text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-1.5 py-0.5 rounded">{p.rentalId}</code></td>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {p.customer.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{p.customer}</span>
                    </div>
                  </td>
                  <td className="font-bold text-slate-900 dark:text-white">₹{p.amount.toLocaleString()}</td>
                  <td className="text-sm text-slate-500 dark:text-slate-400">{p.method || "—"}</td>
                  <td className="text-sm text-slate-500 dark:text-slate-400">{p.date}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      {STATUS_ICONS[p.status]}
                      <StatusBadge status={p.status} />
                    </div>
                  </td>
                  <td>
                    <span className="text-xs text-slate-400 font-mono">{p.invoice}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button title="Download Invoice" className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      {p.status === "COMPLETED" && (
                        <button title="Refund" className="p-1.5 rounded-lg text-slate-400 hover:text-warning-600 hover:bg-warning-50 dark:hover:bg-yellow-900/20 transition-colors">
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
