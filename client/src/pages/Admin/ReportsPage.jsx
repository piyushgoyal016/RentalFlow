import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, FileText, BarChart2, Users, Package, AlertTriangle } from "lucide-react";
import PageHeader from "@/components/admin/shared/PageHeader";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import { getRevenue, getRentalReport, getCustomerReport, getInventoryReport, getLateFees } from "@/services/adminService";
import { toast } from "sonner";

const TABS = [
  { id: "revenue",     label: "Revenue",     icon: BarChart2    },
  { id: "rentals",     label: "Rentals",     icon: FileText     },
  { id: "customers",   label: "Customers",   icon: Users        },
  { id: "inventory",   label: "Inventory",   icon: Package      },
  { id: "late",        label: "Late Fees",   icon: AlertTriangle },
];

export default function ReportsPage() {
  const [tab, setTab] = useState("revenue");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const loadReport = async (tabId) => {
    setLoading(true);
    try {
      if (tabId === "revenue") {
        const res = await getRevenue();
        if (res.data?.success) {
          // Group payments by month name
          const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          const monthlyMap = {};
          res.data.data.forEach(p => {
            const date = new Date(p.createdAt);
            const mName = months[date.getMonth()];
            if (!monthlyMap[mName]) {
              monthlyMap[mName] = { rentals: 0, revenue: 0 };
            }
            monthlyMap[mName].revenue += p.amount;
            monthlyMap[mName].rentals += 1;
          });
          const reportRows = Object.entries(monthlyMap).map(([month, val]) => ({
            month,
            rentals: val.rentals,
            revenue: val.revenue,
            avgRental: Math.round(val.revenue / val.rentals) || 0,
          }));
          setData(reportRows);
        }
      } else if (tabId === "rentals") {
        const res = await getRentalReport();
        if (res.data?.success) {
          setData(res.data.data);
        }
      } else if (tabId === "customers") {
        const res = await getCustomerReport();
        if (res.data?.success) {
          setData(res.data.data);
        }
      } else if (tabId === "inventory") {
        const res = await getInventoryReport();
        if (res.data?.success) {
          setData(res.data.data);
        }
      } else if (tabId === "late") {
        const res = await getLateFees();
        if (res.data?.success) {
          setData(res.data.data);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load report from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport(tab);
  }, [tab]);

  // Export functions
  const handleExportCSV = () => {
    if (data.length === 0) return toast.warning("No data to export");
    const headers = Object.keys(data[0] || {}).join(",");
    const rows = data.map(row => 
      Object.values(row).map(val => typeof val === "object" ? JSON.stringify(val).replace(/,/g, ";") : val).join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${tab}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV file exported successfully");
  };

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Generate and export detailed business reports"
        breadcrumbs={["Admin", "Reports"]}
        action={
          <div className="flex gap-2">
            <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        }
      />

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
        {loading ? (
          <div className="py-12 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-primary-600/30 border-t-primary-600 rounded-full animate-spin" />
            <span className="ml-3 text-sm text-slate-500">Loading report data...</span>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium capitalize">No report records found</p>
          </div>
        ) : (
          <div>
            {tab === "revenue" && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "YTD Revenue",    value: `₹${data.reduce((s, r) => s + r.revenue, 0).toLocaleString()}` },
                    { label: "Total Rentals",  value: data.reduce((s, r) => s + r.rentals, 0) },
                    { label: "Avg per Rental", value: `₹${Math.round(data.reduce((s, r) => s + r.revenue, 0) / (data.reduce((s, r) => s + r.rentals, 0) || 1)).toLocaleString()}` },
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
                      </tr>
                    </thead>
                    <tbody>
                      {data.map(r => (
                        <tr key={r.month}>
                          <td className="font-medium text-slate-900 dark:text-white">{r.month}</td>
                          <td>{r.rentals}</td>
                          <td className="font-semibold text-primary-600">₹{r.revenue.toLocaleString()}</td>
                          <td>₹{r.avgRental.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === "rentals" && (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Rental ID</th>
                      <th>Customer</th>
                      <th>Items Count</th>
                      <th>Pickup Date</th>
                      <th>Return Date</th>
                      <th>Total Cost</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map(r => (
                      <tr key={r.id}>
                        <td><code className="text-xs font-mono text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-1.5 py-0.5 rounded">{r.id.substring(0, 8)}</code></td>
                        <td>{r.user ? `${r.user.firstName} ${r.user.lastName}` : "Customer"}</td>
                        <td>{r.items?.length || 0} items</td>
                        <td>{new Date(r.pickupDate).toLocaleDateString()}</td>
                        <td>{new Date(r.returnDate).toLocaleDateString()}</td>
                        <td className="font-bold text-slate-900 dark:text-white">₹{r.totalCost.toLocaleString()}</td>
                        <td><StatusBadge status={r.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "customers" && (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Rentals Ordered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map(c => (
                      <tr key={c.id}>
                        <td className="font-semibold">{c.firstName} {c.lastName}</td>
                        <td>{c.email}</td>
                        <td>{c.phone || "—"}</td>
                        <td><span className="px-2.5 py-1 text-xs rounded-full bg-primary-50 text-primary-700 font-medium">{c.rentalOrders?.length || 0} rentals</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "inventory" && (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Available Stock</th>
                      <th>Base Day Rate</th>
                      <th>Deposit Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map(p => (
                      <tr key={p.id}>
                        <td className="font-semibold">{p.name}</td>
                        <td><span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{p.category?.name || "Uncategorized"}</span></td>
                        <td><span className="font-bold">{p.stockQuantity}</span></td>
                        <td>₹{p.rentalPricePerDay.toLocaleString()}</td>
                        <td>₹{p.depositAmount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "late" && (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Inspection ID</th>
                      <th>Days Overdue</th>
                      <th>Penalty Charged</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map(f => (
                      <tr key={f.id}>
                        <td><code className="text-xs font-mono text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-1.5 py-0.5 rounded">{f.id.substring(0, 8)}</code></td>
                        <td><span className="font-bold text-danger-600">{f.daysLate}</span></td>
                        <td className="font-semibold text-danger-600">₹{f.penaltyAmount.toLocaleString()}</td>
                        <td>
                          <span className={`px-2 py-1 text-xs rounded-full font-semibold ${f.isPaid ? "bg-success-100 text-success-800" : "bg-warning-100 text-warning-800"}`}>
                            {f.isPaid ? "Paid" : "Unpaid"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
