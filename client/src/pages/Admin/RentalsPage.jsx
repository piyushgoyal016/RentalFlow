import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Eye, X, ChevronLeft, ChevronRight,
  Check, User, Package, Calendar, CreditCard,
  ChevronRight as Arrow, FileText, ArrowRight
} from "lucide-react";
import PageHeader from "@/components/admin/shared/PageHeader";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import { getRentals, updateRentalStatus } from "@/services/adminService";
import { toast } from "sonner";

const MOCK_RENTALS = [
  { id: "R-2051", customer: "Rahul Sharma",  products: ["Canon EOS R5"],        status: "ACTIVE",    pickupDate: "Jul 15, 2025", returnDate: "Jul 22, 2025", totalCost: 10500, deposit: 25000 },
  { id: "R-2050", customer: "Priya Patel",   products: ["DJI Mavic Pro 3"],     status: "PENDING",   pickupDate: "Jul 18, 2025", returnDate: "Jul 21, 2025", totalCost: 7500,  deposit: 40000 },
  { id: "R-2049", customer: "Amit Verma",    products: ["Sony A7 IV", "Tent"],  status: "COMPLETED", pickupDate: "Jul 10, 2025", returnDate: "Jul 14, 2025", totalCost: 6600,  deposit: 23000 },
  { id: "R-2048", customer: "Sunita Joshi",  products: ["Power Washer Pro"],    status: "OVERDUE",   pickupDate: "Jul 05, 2025", returnDate: "Jul 10, 2025", totalCost: 4000,  deposit: 5000  },
  { id: "R-2047", customer: "Karan Malhotra",products: ["Camping Tent 2P"],     status: "COMPLETED", pickupDate: "Jul 01, 2025", returnDate: "Jul 05, 2025", totalCost: 1200,  deposit: 3000  },
  { id: "R-2046", customer: "Anita Singh",   products: ["Honda Activa 6G"],     status: "CANCELLED", pickupDate: "Jun 28, 2025", returnDate: "Jun 30, 2025", totalCost: 800,   deposit: 15000 },
];

// Multi-step Create Rental Wizard
const WIZARD_STEPS = ["Customer", "Products", "Duration", "Review", "Confirm"];

const MOCK_CUSTOMERS_SEARCH = [
  { id: "1", name: "Rahul Sharma",  email: "rahul@email.com",  phone: "+91 98765 43210" },
  { id: "2", name: "Priya Patel",   email: "priya@email.com",  phone: "+91 87654 32109" },
  { id: "3", name: "Amit Verma",    email: "amit@email.com",   phone: "+91 76543 21098" },
];

const MOCK_PRODUCTS_SEARCH = [
  { id: "1", name: "Canon EOS R5",    pricePerDay: 1500, deposit: 25000, available: true  },
  { id: "2", name: "DJI Mavic Pro 3", pricePerDay: 2500, deposit: 40000, available: true  },
  { id: "3", name: "Sony A7 IV",      pricePerDay: 1200, deposit: 20000, available: true  },
  { id: "4", name: "Power Washer Pro",pricePerDay: 800,  deposit: 5000,  available: false },
];

function RentalWizard({ onClose }) {
  const [step, setStep]       = useState(0);
  const [customer, setCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [pickupDate, setPickup] = useState("");
  const [returnDate, setReturn] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]           = useState(false);

  const days = pickupDate && returnDate
    ? Math.max(1, Math.ceil((new Date(returnDate) - new Date(pickupDate)) / 86400000))
    : 0;
  const subtotal = products.reduce((s, p) => s + p.pricePerDay * days, 0);
  const totalDeposit = products.reduce((s, p) => s + p.deposit, 0);

  const toggleProduct = (p) => {
    setProducts(prev =>
      prev.find(x => x.id === p.id) ? prev.filter(x => x.id !== p.id) : [...prev, p]
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    setDone(true);
  };

  if (done) return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center max-w-sm w-full shadow-float"
      >
        <div className="w-16 h-16 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-success-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Rental Created!</h3>
        <p className="text-sm text-slate-400 mb-6">The rental has been successfully created and the customer has been notified.</p>
        <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors">Done</button>
      </motion.div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 16 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl shadow-float border border-slate-200 dark:border-slate-700 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Create New Rental</h3>
            <p className="text-xs text-slate-400 mt-0.5">Step {step + 1} of {WIZARD_STEPS.length}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-6 pt-5 pb-0 flex-shrink-0">
          <div className="step-indicator">
            {WIZARD_STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className={`step-dot text-xs font-semibold flex-shrink-0 ${
                  i < step  ? "bg-primary-600 text-white" :
                  i === step ? "bg-primary-600 text-white ring-4 ring-primary-100 dark:ring-primary-900/40" :
                               "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                }`}>
                  {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                {i < WIZARD_STEPS.length - 1 && (
                  <div className={`step-line mx-1.5 ${i < step ? "active" : ""}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 mb-4">
            {WIZARD_STEPS.map((s, i) => (
              <span key={s} className={`text-xs font-medium ${i === step ? "text-primary-600" : "text-slate-400"}`} style={{ width: `${100/WIZARD_STEPS.length}%`, textAlign: i === 0 ? "left" : i === WIZARD_STEPS.length-1 ? "right" : "center" }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Step 0: Select Customer */}
              {step === 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Select a customer</p>
                  {MOCK_CUSTOMERS_SEARCH.map(c => (
                    <div
                      key={c.id}
                      onClick={() => setCustomer(c)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        customer?.id === c.id
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                          : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {c.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-white">{c.name}</p>
                        <p className="text-xs text-slate-400">{c.email} · {c.phone}</p>
                      </div>
                      {customer?.id === c.id && <Check className="w-5 h-5 text-primary-600" />}
                    </div>
                  ))}
                </div>
              )}

              {/* Step 1: Select Products */}
              {step === 1 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Select products to rent</p>
                  {MOCK_PRODUCTS_SEARCH.map(p => (
                    <div
                      key={p.id}
                      onClick={() => p.available && toggleProduct(p)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        !p.available ? "opacity-50 cursor-not-allowed border-slate-100 dark:border-slate-800" :
                        products.find(x => x.id === p.id)
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 cursor-pointer"
                          : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 ${products.find(x => x.id === p.id) ? "bg-primary-600 border-primary-600" : "border-slate-300 dark:border-slate-600"}`}>
                        {products.find(x => x.id === p.id) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-white">{p.name}</p>
                        <p className="text-xs text-slate-400">₹{p.pricePerDay}/day · Deposit ₹{p.deposit.toLocaleString()}</p>
                      </div>
                      {!p.available && <span className="badge badge-overdue">Unavailable</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* Step 2: Duration */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Pickup Date</label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={e => setPickup(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Return Date</label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={e => setReturn(e.target.value)}
                      min={pickupDate || new Date().toISOString().split("T")[0]}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  {days > 0 && (
                    <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-center">
                      <p className="text-primary-700 dark:text-primary-300 font-semibold text-lg">{days} day{days !== 1 ? "s" : ""}</p>
                      <p className="text-primary-500 text-sm">rental duration</p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-3">
                    <h4 className="font-medium text-slate-900 dark:text-white text-sm">Rental Summary</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Customer</span>
                      <span className="font-medium text-slate-900 dark:text-white">{customer?.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Duration</span>
                      <span className="font-medium text-slate-900 dark:text-white">{days} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Pickup</span>
                      <span className="font-medium text-slate-900 dark:text-white">{pickupDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Return</span>
                      <span className="font-medium text-slate-900 dark:text-white">{returnDate}</span>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-2">
                      {products.map(p => (
                        <div key={p.id} className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-300">{p.name} × {days}d</span>
                          <span className="font-medium text-slate-900 dark:text-white">₹{(p.pricePerDay * days).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-1.5">
                      <div className="flex justify-between text-sm font-semibold">
                        <span className="text-slate-900 dark:text-white">Rental Total</span>
                        <span className="text-slate-900 dark:text-white">₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Security Deposit</span>
                        <span className="text-warning-600 font-medium">₹{totalDeposit.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Confirm */}
              {step === 4 && (
                <div className="text-center py-4 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-lg">Ready to create rental?</h4>
                    <p className="text-sm text-slate-400 mt-1">This will create the rental and send confirmation to the customer.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-left space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Amount Due</span>
                      <span className="font-bold text-primary-600 text-base">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Deposit Held</span>
                      <span className="font-medium text-warning-600">₹{totalDeposit.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    {submitting ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Check className="w-5 h-5" />}
                    {submitting ? "Creating…" : "Confirm Rental"}
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer nav */}
        {step < 4 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex gap-3 flex-shrink-0">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={
                (step === 0 && !customer) ||
                (step === 1 && products.length === 0) ||
                (step === 2 && (!pickupDate || !returnDate))
              }
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              {step === 3 ? "Confirm Details" : "Continue"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function RentalsPage() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showWizard, setShowWizard]     = useState(false);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const response = await getRentals();
      if (response.data?.success) {
        const dbRentals = response.data.data.map(r => ({
          id: r.id,
          customer: r.user ? `${r.user.firstName} ${r.user.lastName}` : "Customer",
          products: r.items?.map(item => item.product?.name || "Product") || [],
          pickupDate: new Date(r.pickupDate).toLocaleDateString(),
          returnDate: new Date(r.returnDate).toLocaleDateString(),
          totalCost: r.totalCost,
          deposit: r.depositAmount || 0,
          status: r.status,
        }));
        setRentals(dbRentals);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch rentals from server, using fallback");
      setRentals(MOCK_RENTALS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await updateRentalStatus(id, newStatus);
      if (response.data?.success) {
        toast.success(`Status updated to ${newStatus}`);
        fetchRentals();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const handlePrintInvoice = (id) => {
    const baseURL = "http://localhost:5000/api/v1";
    window.open(`${baseURL}/payments/${id}/print`, "_blank");
  };

  const filtered = rentals.filter(r => {
    const match = r.customer.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || r.status.toUpperCase() === statusFilter.toUpperCase();
    return match && matchStatus;
  });

  return (
    <div>
      <PageHeader
        title="Rentals"
        subtitle="Manage all rental orders"
        breadcrumbs={["Admin", "Rentals"]}
        action={
          <button
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium shadow-sm transition-all hover:shadow-glow"
          >
            <Plus className="w-4 h-4" /> New Rental
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by customer or rental ID…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["ALL","ACTIVE","PENDING","OVERDUE","COMPLETED","CANCELLED"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all ${
                statusFilter === s
                  ? "bg-primary-600 text-white shadow-sm"
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
                <th>Rental ID</th>
                <th>Customer</th>
                <th>Products</th>
                <th>Pickup Date</th>
                <th>Return Date</th>
                <th>Total</th>
                <th>Deposit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>{[...Array(9)].map((_, j) => <td key={j}><div className="skeleton h-4 w-20" /></td>)}</tr>
                ))
              ) : filtered.map((r, i) => (
                <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                  <td><code className="text-xs font-mono text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded">{r.id}</code></td>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {r.customer.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{r.customer}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {r.products.map(p => (
                        <span key={p} className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{p}</span>
                      ))}
                    </div>
                  </td>
                  <td className="text-sm text-slate-600 dark:text-slate-300">{r.pickupDate}</td>
                  <td className="text-sm text-slate-600 dark:text-slate-300">{r.returnDate}</td>
                  <td className="font-semibold text-slate-900 dark:text-white">₹{r.totalCost.toLocaleString()}</td>
                  <td className="text-sm text-warning-600">₹{r.deposit.toLocaleString()}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <select
                        value={r.status}
                        onChange={(e) => handleStatusChange(r.id, e.target.value)}
                        className="text-xs px-2 py-1.5 rounded-lg border border-slate-200 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="RESERVED">Reserved</option>
                        <option value="BOOKED">Booked</option>
                        <option value="PICKED_UP">Picked Up</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="OVERDUE">Overdue</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                      <button
                        onClick={() => handlePrintInvoice(r.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors flex items-center justify-center"
                        title="Print Invoice"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Wizard */}
      <AnimatePresence>
        {showWizard && <RentalWizard onClose={() => setShowWizard(false)} />}
      </AnimatePresence>
    </div>
  );
}
