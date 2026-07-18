import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Package, AlertTriangle, TrendingDown } from "lucide-react";
import PageHeader from "@/components/admin/shared/PageHeader";

const MOCK_INVENTORY = [
  { id: "1", name: "Canon EOS R5",       category: "Electronics",    stock: 3,  minStock: 2, available: 2, rented: 1, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80" },
  { id: "2", name: "DJI Mavic Pro 3",    category: "Electronics",    stock: 2,  minStock: 1, available: 2, rented: 0, image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=300&q=80" },
  { id: "3", name: "Party Tent 6-Person",category: "Party Supplies", stock: 8,  minStock: 3, available: 5, rented: 3, image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=300&q=80" },
  { id: "4", name: "Honda Activa 6G",    category: "Vehicles",       stock: 5,  minStock: 2, available: 0, rented: 5, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80" },
  { id: "5", name: "Power Washer Pro",   category: "Tools",          stock: 1,  minStock: 2, available: 1, rented: 0, image: "https://images.unsplash.com/photo-1558618047-3e69aa98e677?w=300&q=80" },
  { id: "6", name: "Sony A7 IV",         category: "Electronics",    stock: 3,  minStock: 1, available: 1, rented: 2, image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&q=80" },
];

export default function InventoryPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  useEffect(() => { setTimeout(() => setLoading(false), 700); }, []);

  const filtered = MOCK_INVENTORY.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems     = MOCK_INVENTORY.reduce((s, p) => s + p.stock, 0);
  const totalRented    = MOCK_INVENTORY.reduce((s, p) => s + p.rented, 0);
  const lowStock       = MOCK_INVENTORY.filter(p => p.stock <= p.minStock).length;
  const occupancyRate  = Math.round((totalRented / totalItems) * 100);

  return (
    <div>
      <PageHeader
        title="Inventory"
        subtitle="Track stock levels and availability"
        breadcrumbs={["Admin", "Inventory"]}
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Items",     value: totalItems,    color: "text-primary-600",  bg: "bg-primary-50 dark:bg-primary-900/20"  },
          { label: "Currently Rented",value: totalRented,   color: "text-warning-600",  bg: "bg-warning-50 dark:bg-yellow-900/20"   },
          { label: "Low Stock Alert", value: lowStock,      color: "text-danger-600",   bg: "bg-danger-50 dark:bg-red-900/20"       },
          { label: "Occupancy Rate",  value: `${occupancyRate}%`, color: "text-success-600", bg: "bg-success-50 dark:bg-green-900/20" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className={`rounded-2xl p-5 ${s.bg}`}
          >
            <p className="text-2xl font-bold mt-1 ${s.color}"><span className={s.color}>{s.value}</span></p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {lowStock > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-warning-50 dark:bg-yellow-900/20 border border-warning-100 dark:border-yellow-800 mb-6">
          <AlertTriangle className="w-5 h-5 text-warning-600 flex-shrink-0" />
          <p className="text-sm text-warning-700 dark:text-yellow-400 font-medium">{lowStock} product{lowStock !== 1 ? "s" : ""} are at or below minimum stock level</p>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search inventory…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Total Stock</th>
              <th>Available</th>
              <th>Rented Out</th>
              <th>Occupancy</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(6)].map((_, i) => <tr key={i}>{[...Array(7)].map((_, j) => <td key={j}><div className="skeleton h-4 w-20" /></td>)}</tr>)
            ) : filtered.map((p, i) => {
              const occupancy = Math.round((p.rented / p.stock) * 100);
              const isLow = p.stock <= p.minStock;
              return (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover bg-slate-100 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white text-sm">{p.name}</p>
                        {isLow && <p className="text-xs text-warning-600 flex items-center gap-1"><TrendingDown className="w-3 h-3" /> Low stock</p>}
                      </div>
                    </div>
                  </td>
                  <td><span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{p.category}</span></td>
                  <td className="font-bold text-slate-900 dark:text-white">{p.stock}</td>
                  <td className="font-medium text-success-600">{p.available}</td>
                  <td className="font-medium text-warning-600">{p.rented}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden max-w-[80px]">
                        <div
                          className={`h-full rounded-full transition-all ${occupancy >= 80 ? "bg-danger-500" : occupancy >= 50 ? "bg-warning-500" : "bg-success-500"}`}
                          style={{ width: `${occupancy}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{occupancy}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${p.available > 0 ? "badge-active" : "badge-overdue"}`}>
                      {p.available > 0 ? "Available" : "Out of Stock"}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
