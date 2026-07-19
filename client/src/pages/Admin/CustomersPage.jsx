import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Filter, ChevronLeft, ChevronRight,
  Eye, X, User, Mail, Phone, MapPin, Calendar,
  CreditCard, Package, Clock, MoreHorizontal
} from "lucide-react";
import PageHeader from "@/components/admin/shared/PageHeader";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import { getCustomers, createCustomer } from "@/services/adminService";
import { toast } from "sonner";

function AddCustomerDrawer({ onClose, onSave }) {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({ ...formData, role: "CUSTOMER" });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="drawer-overlay" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="drawer-panel w-full max-w-md p-6 flex flex-col"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add Customer</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name *</label>
              <input required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name *</label>
              <input required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email *</label>
            <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password *</label>
            <input type="password" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
            <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          
          <div className="mt-auto pt-6">
            <button disabled={loading} className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors">
              {loading ? "Saving..." : "Create Customer"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
function CustomerDrawer({ customer, onClose }) {
  const [tab, setTab] = useState("rentals");

  return (
    <div>
      <div className="drawer-overlay" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="drawer-panel w-full max-w-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white">Customer Profile</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Profile Card */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {customer.firstName[0]}{customer.lastName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-lg text-slate-900 dark:text-white">{customer.firstName} {customer.lastName}</h4>
                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Mail className="w-3.5 h-3.5" /> {customer.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Phone className="w-3.5 h-3.5" /> {customer.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3.5 h-3.5" /> {customer.city || "N/A"}
                  </div>
                </div>
              </div>
              <StatusBadge status={customer.isActive ? "ACTIVE" : "CANCELLED"} />
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-5">
              {[
                { label: "Total Rentals", value: customer.totalRentals || 0, icon: Package },
                { label: "Total Spend",   value: `₹${(customer.totalSpend || 0).toLocaleString()}`, icon: CreditCard },
                { label: "Member Since",  value: customer.joinedAt || new Date(customer.createdAt).toLocaleDateString() || "N/A", icon: Calendar },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                  <p className="text-xs text-slate-400 mb-1">{s.label}</p>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-100 dark:border-slate-800">
            {["rentals", "payments", "deposits"].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                  tab === t
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-4 space-y-3">
            {tab === "rentals" && (customer.rentals || []).map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">{r.id}</span>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1 truncate">{r.product || r.items?.[0]?.product?.name || "Multiple Items"}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{r.startDate || new Date(r.pickupDate).toLocaleDateString()} → {r.endDate || new Date(r.returnDate).toLocaleDateString()}</p>
                </div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">₹{(r.amount || r.totalCost || 0).toLocaleString()}</p>
              </div>
            ))}
            {tab === "payments" && (
              <p className="text-sm text-slate-400 text-center py-8">Payment history loaded from API</p>
            )}
            {tab === "deposits" && (
              <p className="text-sm text-slate-400 text-center py-8">Deposit records loaded from API</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("all");
  const [drawer, setDrawer]       = useState(null);
  const [page, setPage]           = useState(1);
  const PER_PAGE = 6;

  const [showAdd, setShowAdd]     = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await getCustomers({ role: "CUSTOMER" });
      if (response.data?.data) {
        setCustomers(response.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddCustomer = async (data) => {
    try {
      const response = await createCustomer(data);
      if (response.data?.success) {
        toast.success("Customer created successfully");
        setShowAdd(false);
        fetchCustomers();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create customer");
    }
  };

  const filtered = customers.filter(c => {
    const name = `${c.firstName} ${c.lastName}`.toLowerCase();
    const matchSearch = name.includes(search.toLowerCase()) || c.email.includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "active" ? c.isActive : !c.isActive);
    return matchSearch && matchFilter;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Manage and view all registered customers"
        breadcrumbs={["Admin", "Customers"]}
        action={
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium shadow-sm transition-all">
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          {["all", "active", "inactive"].map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                filter === f
                  ? "bg-primary-600 text-white shadow-sm"
                  : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total",    value: customers.length,                                           color: "bg-primary-50 dark:bg-primary-900/20 text-primary-600" },
          { label: "Active",   value: customers.filter(c => c.isActive).length,                  color: "bg-success-50 dark:bg-green-900/20 text-success-600"   },
          { label: "Inactive", value: customers.filter(c => !c.isActive).length,                 color: "bg-slate-100 dark:bg-slate-800 text-slate-500"          },
          { label: "New (30d)",value: 12,                                                         color: "bg-warning-50 dark:bg-yellow-900/20 text-warning-600"   },
        ].map(s => (
          <div key={s.label} className={`rounded-xl px-4 py-3 ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs opacity-70 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>City</th>
                <th>Rentals</th>
                <th>Total Spend</th>
                <th>Last Rental</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(8)].map((_, j) => (
                      <td key={j}><div className="skeleton h-4 w-20" /></td>
                    ))}
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16">
                    <User className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-400">No customers found</p>
                  </td>
                </tr>
              ) : paginated.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="cursor-pointer"
                  onClick={() => setDrawer(c)}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {c.firstName[0]}{c.lastName[0]}
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white text-sm">{c.firstName} {c.lastName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      <p>{c.email}</p>
                      <p className="text-xs mt-0.5">{c.phone}</p>
                    </div>
                  </td>
                  <td className="text-sm text-slate-600 dark:text-slate-300">{c.city || "N/A"}</td>
                  <td className="font-medium text-slate-900 dark:text-white">{c.totalRentals || 0}</td>
                  <td className="font-medium text-success-600">₹{(c.totalSpend || 0).toLocaleString()}</td>
                  <td className="text-sm text-slate-500 dark:text-slate-400">{c.lastRental || "Never"}</td>
                  <td><StatusBadge status={c.isActive ? "ACTIVE" : "CANCELLED"} /></td>
                  <td onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setDrawer(c)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing {((page - 1) * PER_PAGE) + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                    page === i + 1
                      ? "bg-primary-600 text-white"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {drawer && <CustomerDrawer customer={drawer} onClose={() => setDrawer(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showAdd && (
          <AddCustomerDrawer
            onClose={() => setShowAdd(false)}
            onSave={handleAddCustomer}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
