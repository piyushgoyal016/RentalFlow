import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw, CheckCircle, Clock } from "lucide-react";
import PageHeader from "@/components/admin/shared/PageHeader";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import { getDeposits, refundDeposit } from "@/services/adminService";
import { toast } from "sonner";

const MOCK_DEPOSITS = [
  { id: "DEP-3021", rentalId: "R-2051", customer: "Rahul Sharma",   amount: 25000, isRefunded: false, refundAmount: null,  heldSince: "Jul 15, 2025" },
  { id: "DEP-3020", rentalId: "R-2050", customer: "Priya Patel",    amount: 40000, isRefunded: false, refundAmount: null,  heldSince: "Jul 14, 2025" },
];

export default function DepositsPage() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("all");

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const response = await getDeposits();
      if (response.data?.success) {
        const dbDeposits = response.data.data.map(d => ({
          id: d.id,
          rentalId: d.rentalOrderId,
          customer: d.rentalOrder?.user ? `${d.rentalOrder.user.firstName} ${d.rentalOrder.user.lastName}` : "Customer",
          amount: d.amount,
          isRefunded: d.isRefunded,
          refundAmount: d.refundAmount,
          heldSince: new Date(d.createdAt).toLocaleDateString(),
        }));
        setDeposits(dbDeposits);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load deposits from server, using fallback");
      setDeposits(MOCK_DEPOSITS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleRefund = async (id, maxAmount) => {
    const amountStr = window.prompt(`Enter amount to refund (Max: ₹${maxAmount.toLocaleString()}):`, maxAmount);
    if (amountStr === null) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0 || amount > maxAmount) {
      toast.error("Invalid refund amount entered");
      return;
    }
    try {
      const response = await refundDeposit(id, { refundAmount: amount });
      if (response.data?.success) {
        toast.success("Security deposit refunded successfully");
        fetchDeposits();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to refund deposit");
    }
  };

  const filtered = deposits.filter(d => {
    const match = d.customer.toLowerCase().includes(search.toLowerCase()) || d.rentalId.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "held" ? !d.isRefunded : d.isRefunded);
    return match && matchFilter;
  });

  const totalHeld     = deposits.filter(d => !d.isRefunded).reduce((s, d) => s + d.amount, 0);
  const totalRefunded = deposits.filter(d => d.isRefunded).reduce((s, d) => s + (d.refundAmount || 0), 0);

  return (
    <div>
      <PageHeader
        title="Deposits"
        subtitle="Track security deposits held and refunded"
        breadcrumbs={["Admin", "Deposits"]}
      />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: "Deposits Held",     value: `₹${totalHeld.toLocaleString()}`,     color: "text-warning-600",  bg: "bg-warning-50 dark:bg-yellow-900/20", count: deposits.filter(d => !d.isRefunded).length },
          { label: "Total Refunded",    value: `₹${totalRefunded.toLocaleString()}`,  color: "text-success-600",  bg: "bg-success-50 dark:bg-green-900/20",  count: deposits.filter(d => d.isRefunded).length  },
          { label: "All Deposits",      value: `₹${deposits.reduce((s,d)=>s+d.amount,0).toLocaleString()}`, color: "text-primary-600", bg: "bg-primary-50 dark:bg-primary-900/20", count: deposits.length },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className={`rounded-2xl p-5 ${s.bg}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{s.label}</p>
                <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              </div>
              <span className="text-2xl font-bold text-slate-200 dark:text-slate-700">{s.count}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search deposits…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all","held","refunded"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                filter === f ? "bg-primary-600 text-white" : "border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}>{f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Deposit ID</th>
              <th>Rental ID</th>
              <th>Customer</th>
              <th>Deposit Amount</th>
              <th>Held Since</th>
              <th>Refund Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => <tr key={i}>{[...Array(8)].map((_, j) => <td key={j}><div className="skeleton h-4 w-20" /></td>)}</tr>)
            ) : filtered.map((d, i) => (
              <motion.tr key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                <td><code className="text-xs font-mono text-slate-500">{d.id.substring(0, 8)}</code></td>
                <td><code className="text-xs font-mono text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-1.5 py-0.5 rounded">{d.rentalId.substring(0, 8)}</code></td>
                <td>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {d.customer.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{d.customer}</span>
                  </div>
                </td>
                <td className="font-bold text-warning-600">₹{d.amount.toLocaleString()}</td>
                <td className="text-sm text-slate-500">{d.heldSince}</td>
                <td>
                  {d.refundAmount != null
                    ? <span className="font-medium text-success-600">₹{d.refundAmount.toLocaleString()}</span>
                    : <span className="text-slate-300 dark:text-slate-600">—</span>}
                </td>
                <td>
                  <div className="flex items-center gap-1.5">
                    {d.isRefunded
                      ? <><CheckCircle className="w-4 h-4 text-success-500" /><span className="badge badge-active">Refunded</span></>
                      : <><Clock className="w-4 h-4 text-warning-500" /><span className="badge badge-pending">Held</span></>}
                  </div>
                </td>
                <td>
                  {!d.isRefunded && (
                    <button onClick={() => handleRefund(d.id, d.amount)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary-600 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">
                      <RefreshCw className="w-3 h-3" /> Refund
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
