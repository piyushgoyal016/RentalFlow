import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Download, ExternalLink, ShieldCheck, DollarSign, Check, X } from "lucide-react";
import PageHeader from "@/components/admin/shared/PageHeader";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/services/api";
import { rentalService } from "@/services/rentalService";

function PaymentModal({ invoice, onClose, onConfirm }) {
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cardName || !cardNumber || !expiry || !cvv) {
      toast.error("Please fill in card details");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      onConfirm(invoice.id);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 16 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-float overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-white">Pay Invoice</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 mb-2">
            <p className="text-xs text-slate-400 mb-1">Total Payable</p>
            <p className="text-2xl font-bold text-primary-600">₹{(invoice.amount + invoice.deposit).toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 mt-1">Includes ₹{invoice.amount.toLocaleString()} daily rate + ₹{invoice.deposit.toLocaleString()} refundable deposit</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Cardholder Name *</label>
            <input value={cardName} onChange={e => setCardName(e.target.value)} required placeholder="John Doe"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Card Number *</label>
            <input value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\s?/g, "").replace(/(\d{4})/g, "$1 ").trim())} maxLength="19" required placeholder="4111 2222 3333 4444"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Expiry Date *</label>
              <input value={expiry} onChange={e => setExpiry(e.target.value)} required placeholder="MM/YY" maxLength="5"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">CVV *</label>
              <input value={cvv} type="password" onChange={e => setCvv(e.target.value)} required placeholder="•••" maxLength="3"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm font-semibold hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 text-sm flex items-center justify-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
              Pay Now
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function CustomerPaymentsPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | invoiceObj
  const [activeTab, setActiveTab] = useState("all");

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const rentals = await rentalService.getMyRentals();
      const mapped = rentals.map(r => ({
        id: `INV-${r.id.substring(0, 8).toUpperCase()}`,
        rentalOrderId: r.id,
        product: r.product?.name || "Rental Item",
        date: r.createdAt,
        amount: (r.product?.dailyRate || 0) * (r.duration || 1),
        deposit: r.product?.securityDeposit || 0,
        status: r.paymentStatus.toUpperCase(),
      }));
      setInvoices(mapped);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleConfirmPayment = async (id) => {
    const invoice = invoices.find(inv => inv.id === id);
    if (!invoice) return;

    try {
      await api.post("/payments", {
        rentalOrderId: invoice.rentalOrderId,
        amount: invoice.amount + invoice.deposit
      });
      toast.success("Payment completed successfully!");
      setModal(null);
      fetchInvoices();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to process payment");
    }
  };

  const handleDownloadInvoice = (invoice) => {
    // Generate simulated print / PDF trigger
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${invoice.id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
            .meta { margin-bottom: 40px; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .table th, .table td { padding: 12px; border-bottom: 1px solid #eee; text-align: left; }
            .total { text-align: right; font-size: 1.2em; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h2>RentFlow Invoice</h2>
              <p>Invoice #: ${invoice.id}</p>
              <p>Date: ${formatDate(invoice.date)}</p>
            </div>
            <div>
              <h3>RentFlow Corp.</h3>
              <p>support@rentflow.com</p>
            </div>
          </div>
          <div class="meta">
            <h4>Billed To:</h4>
            <p>Jury Customer</p>
            <p>customer@hackathon.com</p>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Daily Rate</th>
                <th>Deposit Amount</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${invoice.product} (Rental item)</td>
                <td>₹${invoice.amount.toLocaleString()}</td>
                <td>₹${invoice.deposit.toLocaleString()}</td>
                <td>₹${(invoice.amount + invoice.deposit).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          <p class="total">Total Paid: ₹${(invoice.amount + invoice.deposit).toLocaleString()}</p>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
    toast.success("Generating invoice preview for print...");
  };

  const outstanding = invoices.filter(inv => inv.status === "PENDING").reduce((sum, inv) => sum + inv.amount + inv.deposit, 0);
  const totalPaid = invoices.filter(inv => inv.status === "COMPLETED").reduce((sum, inv) => sum + inv.amount, 0);
  const depositEscrow = invoices.filter(inv => inv.status === "COMPLETED").reduce((sum, inv) => sum + inv.deposit, 0);

  const filtered = invoices.filter(inv => {
    if (activeTab === "pending") return inv.status === "PENDING";
    if (activeTab === "completed") return inv.status === "COMPLETED";
    return true;
  });

  if (loading) {
    return (
      <div className="p-6 space-y-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <PageHeader
        title="Payments & Invoices"
        subtitle="Manage billing transactions and deposit records"
        breadcrumbs={["Customer", "Payments"]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: "Outstanding Balance", value: outstanding, color: "text-danger-600", bg: "bg-danger-50 dark:bg-red-950/20" },
          { label: "Deposit in Escrow", value: depositEscrow, color: "text-warning-600", bg: "bg-warning-50 dark:bg-yellow-950/20" },
          { label: "Total Paid", value: totalPaid, color: "text-success-600", bg: "bg-success-50 dark:bg-green-950/20" }
        ].map((k, i) => (
          <div key={i} className={`p-5 rounded-2xl ${k.bg} flex flex-col justify-between`}>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{k.label}</p>
            <p className={`text-2xl font-bold mt-4 ${k.color}`}>{formatCurrency(k.value)}</p>
          </div>
        ))}
      </div>

      {/* Main invoices panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex gap-2">
            {["all", "pending", "completed"].map(tab => (
              <button
                key={tab} onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-colors ${activeTab === tab ? "bg-slate-100 dark:bg-slate-850 text-slate-950 dark:text-white" : "text-slate-500 hover:text-slate-700"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Product</th>
                <th>Due Date</th>
                <th>Rental Fee</th>
                <th>Deposit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id}>
                  <td className="font-bold text-slate-900 dark:text-white">{inv.id}</td>
                  <td><span className="font-medium">{inv.product}</span></td>
                  <td><span className="text-slate-500">{formatDate(inv.date)}</span></td>
                  <td><span className="font-bold">₹{inv.amount.toLocaleString()}</span></td>
                  <td><span className="text-slate-500">₹{inv.deposit.toLocaleString()}</span></td>
                  <td><StatusBadge status={inv.status} /></td>
                  <td>
                    <div className="flex items-center gap-2">
                      {inv.status === "PENDING" ? (
                        <button
                          onClick={() => setModal(inv)}
                          className="px-3.5 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold"
                        >
                          Pay Now
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDownloadInvoice(inv)}
                          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <PaymentModal
            invoice={modal}
            onClose={() => setModal(null)}
            onConfirm={handleConfirmPayment}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
