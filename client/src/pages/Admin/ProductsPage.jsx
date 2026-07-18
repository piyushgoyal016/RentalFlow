import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Edit2, Trash2, Grid3X3, List,
  Star, Package, X, Check, QrCode, Hash, Tag
} from "lucide-react";
import PageHeader from "@/components/admin/shared/PageHeader";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from "@/services/adminService";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

// ─── Product Details Drawer ───────────────────────────────────────────────────
function ProductDrawer({ product, onClose, onEdit, onDelete }) {
  return (
    <div>
      <div className="drawer-overlay" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="drawer-panel w-full max-w-md"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white">Product Details</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-6 space-y-5">
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">{product.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">{product.category}</span>
                <StatusBadge status={product.isAvailable ? "ACTIVE" : "CANCELLED"} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <p className="text-xs text-slate-400 mb-1">Rental / Day</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">₹{product.rentalPricePerDay.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <p className="text-xs text-slate-400 mb-1">Deposit</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">₹{product.depositAmount.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600 dark:text-slate-300">Stock Quantity</span>
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">{product.stockQuantity}</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Hash className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-500 dark:text-slate-400 w-20">Barcode</span>
                <code className="font-mono text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{product.barcode || "—"}</code>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <QrCode className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-500 dark:text-slate-400 w-20">QR Code</span>
                <code className="font-mono text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{product.qrCode || "—"}</code>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => onEdit(product)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-danger-200 dark:border-red-800 text-sm font-medium text-danger-600 dark:text-red-400 hover:bg-danger-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Product Edit / Create Modal ───────────────────────────────────────────────
function ProductModal({ product, categories, onClose, onSave, user }) {
  const [name, setName] = useState(product?.name || "");
  const [categoryId, setCategoryId] = useState(product?.categoryId || "");
  const [desc, setDesc] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.rentalPricePerDay || "");
  const [deposit, setDeposit] = useState(product?.depositAmount || "");
  const [stock, setStock] = useState(product?.stockQuantity || "1");
  const [barcode, setBarcode] = useState(product?.barcode || "");
  const [isPublished, setIsPublished] = useState(product?.isPublished || false);
  const [lateFeeEnabled, setLateFeeEnabled] = useState(product?.lateFeeEnabled !== undefined ? product.lateFeeEnabled : true);
  const [lateFeeRate, setLateFeeRate] = useState(product?.lateFeeRate || "");
  const [paddingTime, setPaddingTime] = useState(product?.paddingTime || "0");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !categoryId || !price || !deposit) {
      toast.toast ? toast.toast("Please fill in all required fields") : toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      await onSave({
        name,
        categoryId,
        description: desc,
        rentalPricePerDay: parseFloat(price),
        depositAmount: parseFloat(deposit),
        stockQuantity: parseInt(stock),
        barcode: barcode || null,
        qrCode: barcode ? `QR-${barcode}` : null,
        isPublished,
        lateFeeEnabled,
        lateFeeRate: lateFeeRate ? parseFloat(lateFeeRate) : null,
        paddingTime: parseInt(paddingTime) || 0,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 16 }}
        className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-float border border-slate-200 dark:border-slate-700 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            {product ? "Edit Product" : "New Product"}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Product Name *</label>
              <input value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Sony A7 IV"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category *</label>
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Stock Quantity</label>
              <input type="number" min="1" value={stock} onChange={e => setStock(e.target.value)} required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Daily Rate (₹) *</label>
              <input type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} required placeholder="1200"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Deposit (₹) *</label>
              <input type="number" min="0" value={deposit} onChange={e => setDeposit(e.target.value)} required placeholder="15000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Padding Buffer (Minutes)</label>
              <input type="number" min="0" value={paddingTime} onChange={e => setPaddingTime(e.target.value)} placeholder="120"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center gap-4 mt-6">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} disabled={user?.role !== "ADMIN"}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                Published (Admin only)
              </label>
            </div>
            <div className="col-span-2 border-t pt-4">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                <input type="checkbox" checked={lateFeeEnabled} onChange={e => setLateFeeEnabled(e.target.checked)}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                Apply Late Overdue Penalty
              </label>
              {lateFeeEnabled && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Product Custom Late Fee Rate (₹/Hour)</label>
                  <input type="number" min="0" value={lateFeeRate} onChange={e => setLateFeeRate(e.target.value)} placeholder="Falls back to global rate (₹150/hr)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              )}
            </div>
            <div className="col-span-2 border-t pt-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Barcode / Serial Number</label>
              <input value={barcode} onChange={e => setBarcode(e.target.value)} placeholder="e.g. SN-A74-009"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Add product description..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
              {product ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Products Page ─────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [viewMode, setViewMode]   = useState("grid"); // "grid" | "table"
  const [drawer, setDrawer]       = useState(null);
  const [modal, setModal]         = useState(null); // null | "create" | productObj

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const resProducts = await getProducts();
      const resCats = await getCategories();

      if (resProducts.data?.success) {
        const rawList = resProducts.data.data?.data || (Array.isArray(resProducts.data.data) ? resProducts.data.data : []);
        const dbProducts = rawList
          .filter(p => p.category?.name !== "Services" && p.name !== "Late Fees" && p.name !== "Security Deposit")
          .map(p => ({
            id: p.id,
            name: p.name,
            category: p.category?.name || "Uncategorized",
            categoryId: p.categoryId,
            description: p.description || "",
            rentalPricePerDay: p.rentalPricePerDay,
            depositAmount: p.depositAmount,
            stockQuantity: p.stockQuantity,
            isAvailable: p.isAvailable,
            barcode: p.barcode || "",
            qrCode: p.qrCode || "",
            rating: 4.8,
            image: p.variants?.[0]?.imageUrl || p.images?.[0]?.url || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80",
          }));
        setProducts(dbProducts);
      }

      if (resCats.data?.success) {
        setCategories(resCats.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products from database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (data) => {
    try {
      if (modal && modal.id) {
        const response = await updateProduct(modal.id, data);
        if (response.data?.success) {
          toast.success("Product updated successfully in PostgreSQL");
        }
      } else {
        const response = await createProduct(data);
        if (response.data?.success) {
          toast.success("Product added successfully to PostgreSQL database");
        }
      }
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save product details");
    }
    setModal(null);
    setDrawer(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await deleteProduct(id);
      if (response.data?.success) {
        toast.success("Product deleted from PostgreSQL database");
        setDrawer(null);
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = catFilter === "All" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Manage your rental product catalog"
        breadcrumbs={["Admin", "Products"]}
        action={
          <button
            onClick={() => setModal("create")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium shadow-sm transition-all hover:shadow-glow"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>
        <select
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
        >
          <option value="All">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-2.5 transition-colors ${viewMode === "grid" ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600" : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`px-3 py-2.5 transition-colors ${viewMode === "table" ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600" : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {viewMode === "grid" ? (
        loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900">
                <div className="skeleton h-44" />
                <div className="p-4 space-y-2">
                  <div className="skeleton h-4 w-32" />
                  <div className="skeleton h-3 w-20" />
                  <div className="skeleton h-5 w-24 mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <Package className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">No products found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or create a new product.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.04 }}
                  className="group rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900 hover:shadow-card-hover transition-all cursor-pointer"
                  onClick={() => setDrawer(p)}
                >
                  <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-2.5 right-2.5">
                      <span className={`badge ${p.isAvailable ? "badge-active" : "badge-overdue"}`}>
                        {p.isAvailable ? "Available" : "Rented Out"}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-slate-400 mb-1">{p.category}</p>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm truncate">{p.name}</h4>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <p className="text-xs text-slate-400">Per day</p>
                        <p className="font-bold text-slate-900 dark:text-white">₹{p.rentalPricePerDay.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Package className="w-3.5 h-3.5" />
                        <span>{p.stockQuantity} in stock</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2.5">
                      <Star className="w-3.5 h-3.5 text-warning-500 fill-warning-400" />
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{p.rating}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price/Day</th>
                  <th>Deposit</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Rating</th>
                  <th>Actions</th>
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
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16">
                      <Package className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
                      <p className="text-slate-400">No products in inventory</p>
                    </td>
                  </tr>
                ) : filtered.map(p => (
                  <tr key={p.id} className="cursor-pointer" onClick={() => setDrawer(p)}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover bg-slate-100 flex-shrink-0" />
                        <span className="font-medium text-slate-900 dark:text-white text-sm">{p.name}</span>
                      </div>
                    </td>
                    <td><span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{p.category}</span></td>
                    <td className="font-medium text-slate-900 dark:text-white">₹{p.rentalPricePerDay.toLocaleString()}</td>
                    <td className="text-slate-500 dark:text-slate-400">₹{p.depositAmount.toLocaleString()}</td>
                    <td className="font-medium">{p.stockQuantity}</td>
                    <td><StatusBadge status={p.isAvailable ? "ACTIVE" : "CANCELLED"} /></td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-warning-500 fill-warning-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">{p.rating}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setModal(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Drawer */}
      <AnimatePresence>
        {drawer && (
          <ProductDrawer
            product={drawer}
            onClose={() => setDrawer(null)}
            onEdit={(p) => setModal(p)}
            onDelete={(id) => handleDelete(id)}
          />
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <ProductModal
            product={modal === "create" ? null : modal}
            categories={categories}
            onClose={() => setModal(null)}
            onSave={handleSave}
            user={user}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
