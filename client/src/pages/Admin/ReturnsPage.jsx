import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckSquare, X, AlertTriangle, Camera, RotateCcw, Clock, DollarSign } from "lucide-react";
import PageHeader from "@/components/admin/shared/PageHeader";
import StatusBadge from "@/components/admin/shared/StatusBadge";



function ReturnChecklist({ rental, onClose }) {
  const [checklist, setChecklist] = useState({
    itemsReturned: false, noPhysicalDamage: false, accessoriesPresent: false, cleanCondition: false,
  });
  const [isDamaged, setIsDamaged] = useState(false);
  const [damageReport, setDamageReport] = useState("");
  const [missingItems, setMissingItems] = useState("");
  const [daysLate] = useState(rental.status === "OVERDUE" ? 4 : 0);
  const [lateFeePerDay] = useState(500);
  const [refundDeposit, setRefundDeposit] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const allChecked = Object.values(checklist).every(Boolean);
  const calculatedFee = daysLate * lateFeePerDay;

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
    setDone(true);
  };

  if (done) return (
    <div>
      <div className="drawer-overlay" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="drawer-panel w-full max-w-md flex items-center justify-center"
      >
        <div className="text-center p-8">
          <div className="w-16 h-16 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-4">
            <CheckSquare className="w-8 h-8 text-success-600" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Return Processed!</h3>
          <p className="text-sm text-slate-400 mb-6">The return has been recorded and the deposit has been processed.</p>
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors">Close</button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div>
      <div className="drawer-overlay" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="drawer-panel w-full max-w-md"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Process Return</h3>
            <p className="text-xs text-slate-400 mt-0.5">{rental.id} · {rental.product}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Late fee alert */}
          {daysLate > 0 && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-danger-50 dark:bg-red-900/20 border border-danger-100 dark:border-red-800">
              <AlertTriangle className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-danger-700 dark:text-red-400">{daysLate} Days Late</p>
                <p className="text-xs text-danger-600 dark:text-red-400 mt-0.5">Late fee: ₹{calculatedFee.toLocaleString()} (₹{lateFeePerDay}/day × {daysLate} days)</p>
              </div>
            </div>
          )}

          {/* Checklist */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Inspection Checklist</h4>
            <div className="space-y-2">
              {[
                { key: "itemsReturned",      label: "All items returned" },
                { key: "noPhysicalDamage",   label: "No physical damage" },
                { key: "accessoriesPresent", label: "All accessories present" },
                { key: "cleanCondition",     label: "Clean condition" },
              ].map(item => (
                <label key={item.key} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer">
                  <div
                    onClick={() => setChecklist(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
                      checklist[item.key] ? "bg-success-500 border-success-500" : "border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {checklist[item.key] && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Damage Report */}
          <div>
            <label className="flex items-center gap-3 mb-3 cursor-pointer">
              <div
                onClick={() => setIsDamaged(d => !d)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${isDamaged ? "bg-danger-500 border-danger-500" : "border-slate-300 dark:border-slate-600"}`}
              >
                {isDamaged && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Item is Damaged</span>
            </label>
            {isDamaged && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3">
                <textarea
                  value={damageReport}
                  onChange={e => setDamageReport(e.target.value)}
                  placeholder="Describe the damage…"
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
                <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <Camera className="w-4 h-4" /> Upload Photos
                </button>
              </motion.div>
            )}
          </div>

          {/* Missing accessories */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Missing Accessories (optional)</label>
            <input
              value={missingItems}
              onChange={e => setMissingItems(e.target.value)}
              placeholder="e.g. battery, charger…"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Deposit Refund */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Deposit Refund</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs text-slate-400">{refundDeposit ? "Full Refund" : "No Refund"}</span>
                <div
                  onClick={() => setRefundDeposit(r => !r)}
                  className={`relative w-10 h-5.5 h-[22px] rounded-full transition-colors cursor-pointer ${refundDeposit ? "bg-success-500" : "bg-slate-200 dark:bg-slate-700"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${refundDeposit ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
              </label>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Security Deposit</span>
                <span className="font-medium text-slate-900 dark:text-white">₹25,000</span>
              </div>
              {calculatedFee > 0 && (
                <div className="flex justify-between text-danger-600">
                  <span>Late Fee</span>
                  <span>-₹{calculatedFee.toLocaleString()}</span>
                </div>
              )}
              {isDamaged && (
                <div className="flex justify-between text-danger-600">
                  <span>Damage Deduction</span>
                  <span>-₹5,000</span>
                </div>
              )}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-1.5 flex justify-between font-bold">
                <span className="text-slate-900 dark:text-white">Refund Amount</span>
                <span className="text-success-600">₹{Math.max(0, 25000 - calculatedFee - (isDamaged ? 5000 : 0)).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            {submitting ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <RotateCcw className="w-5 h-5" />}
            {submitting ? "Processing…" : "Complete Return"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function ReturnsPage() {
  const [returns, setReturns] = useState([]);
  const [activeRentals, setActiveRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]     = useState("");
  const [checklist, setChecklist] = useState(null);

  useEffect(() => { setTimeout(() => setLoading(false), 800); }, []);

  const filtered = returns.filter(r =>
    r.customer.toLowerCase().includes(search.toLowerCase()) || r.rentalId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Returns"
        subtitle="Manage product returns and inspections"
        breadcrumbs={["Admin", "Returns"]}
      />

      {/* Active Rentals needing return */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Pending Returns</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeRentals.map(r => (
            <div key={r.id} className={`p-4 rounded-xl border-2 ${r.status === "OVERDUE" ? "border-danger-200 dark:border-red-800 bg-danger-50/50 dark:bg-red-900/10" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"}`}>
              <div className="flex items-start justify-between mb-2">
                <code className="text-xs font-mono text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded">{r.id}</code>
                <StatusBadge status={r.status} />
              </div>
              <p className="font-medium text-slate-900 dark:text-white text-sm">{r.customer}</p>
              <p className="text-xs text-slate-400 mt-0.5">{r.product}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                <Clock className="w-3 h-3" /> {r.returnDate}
              </div>
              <button
                onClick={() => setChecklist(r)}
                className="mt-3 w-full py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium transition-colors"
              >
                Process Return
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Return History */}
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Return History</h3>
      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search returns…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Return ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Returned At</th>
              <th>Damage</th>
              <th>Late Fee</th>
              <th>Deposit</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(4)].map((_, i) => <tr key={i}>{[...Array(7)].map((_, j) => <td key={j}><div className="skeleton h-4 w-20" /></td>)}</tr>)
            ) : filtered.map((r, i) => (
              <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                <td><code className="text-xs font-mono text-slate-500">{r.id}</code></td>
                <td className="font-medium text-sm text-slate-900 dark:text-white">{r.customer}</td>
                <td className="text-sm text-slate-600 dark:text-slate-300">{r.product}</td>
                <td className="text-sm text-slate-500">{r.returnedAt}</td>
                <td>
                  {r.isDamaged
                    ? <span className="badge badge-overdue">Damaged</span>
                    : <span className="badge badge-active">No Damage</span>}
                </td>
                <td>
                  {r.lateFee > 0
                    ? <span className="text-danger-600 font-medium">₹{r.lateFee.toLocaleString()}</span>
                    : <span className="text-slate-400">—</span>}
                </td>
                <td>
                  {r.depositRefunded
                    ? <span className="badge badge-active">Refunded</span>
                    : <span className="badge badge-pending">Pending</span>}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {checklist && <ReturnChecklist rental={checklist} onClose={() => setChecklist(null)} />}
      </AnimatePresence>
    </div>
  );
}
