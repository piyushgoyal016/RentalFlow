import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, ChevronDown, ChevronUp,
  List, X, Check, Save, Loader2
} from "lucide-react";
import PageHeader from "@/components/admin/shared/PageHeader";
import api from "@/services/api";
import { toast } from "sonner";

const PERIODICITIES = ["HOURLY", "DAILY", "WEEKLY", "MONTHLY", "NIGHTLY"];
const PRICE_TYPES   = ["FIXED", "RANGE"];

// ─── Inline helpers ────────────────────────────────────────────────────────────
function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>}
      <input
        {...props}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
      />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>}
      <select
        {...props}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
      >
        {children}
      </select>
    </div>
  );
}

// ─── Rule Form ─────────────────────────────────────────────────────────────────
function RuleForm({ rule, onChange, onRemove }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 relative"
    >
      <button onClick={onRemove} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors">
        <X className="w-4 h-4" />
      </button>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Select label="Periodicity" value={rule.periodicity} onChange={e => onChange("periodicity", e.target.value)}>
          {PERIODICITIES.map(p => <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>)}
        </Select>
        <Select label="Price Type" value={rule.priceType} onChange={e => onChange("priceType", e.target.value)}>
          {PRICE_TYPES.map(t => <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>)}
        </Select>
        <Input label="Min Qty" type="number" min="1" value={rule.minQty} onChange={e => onChange("minQty", parseInt(e.target.value) || 1)} />
        {rule.priceType === "FIXED" && (
          <Input label="Fixed Price (₹)" type="number" step="0.01" value={rule.fixedPrice || ""} onChange={e => onChange("fixedPrice", parseFloat(e.target.value))} />
        )}
        {rule.priceType === "RANGE" && (
          <>
            <Input label="Min Price (₹)" type="number" step="0.01" value={rule.minPrice || ""} onChange={e => onChange("minPrice", parseFloat(e.target.value))} />
            <Input label="Max Price (₹)" type="number" step="0.01" value={rule.maxPrice || ""} onChange={e => onChange("maxPrice", parseFloat(e.target.value))} />
          </>
        )}
      </div>
    </motion.div>
  );
}

// ─── Pricelist Card ────────────────────────────────────────────────────────────
function PricelistCard({ pricelist, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between p-5 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${pricelist.isActive ? "bg-emerald-400" : "bg-slate-300"}`} />
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{pricelist.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{pricelist.rules?.length || 0} rule{(pricelist.rules?.length || 0) !== 1 ? "s" : ""} · {pricelist.isActive ? "Active" : "Inactive"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={e => { e.stopPropagation(); onEdit(pricelist); }}
            className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(pricelist.id); }}
            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      <AnimatePresence>
        {expanded && pricelist.rules?.length > 0 && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden border-t border-slate-100 dark:border-slate-800"
          >
            <div className="p-5 space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Pricing Rules</p>
              {pricelist.rules.map(rule => (
                <div key={rule.id}
                  className="flex flex-wrap items-center gap-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium">
                    {rule.periodicity}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-medium">
                    {rule.priceType}
                  </span>
                  <span className="text-slate-600 dark:text-slate-300">
                    Min qty: {rule.minQty}
                    {rule.priceType === "FIXED" && rule.fixedPrice != null && ` · ₹${rule.fixedPrice}`}
                    {rule.priceType === "RANGE" && rule.minPrice != null && ` · ₹${rule.minPrice}–₹${rule.maxPrice}`}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ isOpen, onClose, editing, onSaved }) {
  const isEdit = !!editing;
  const emptyRule = () => ({ periodicity: "DAILY", priceType: "FIXED", minQty: 1, fixedPrice: null, minPrice: null, maxPrice: null });

  const [form, setForm] = useState({ name: "", description: "", isActive: true, rules: [emptyRule()] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editing) {
        setForm({
          name:        editing.name,
          description: editing.description || "",
          isActive:    editing.isActive,
          rules:       editing.rules?.length ? editing.rules.map(r => ({
            periodicity: r.periodicity,
            priceType:   r.priceType,
            minQty:      r.minQty,
            fixedPrice:  r.fixedPrice,
            minPrice:    r.minPrice,
            maxPrice:    r.maxPrice,
          })) : [emptyRule()],
        });
      } else {
        setForm({ name: "", description: "", isActive: true, rules: [emptyRule()] });
      }
    }
  }, [isOpen, editing]);

  const updateRule = (idx, field, value) => {
    setForm(f => {
      const rules = [...f.rules];
      rules[idx] = { ...rules[idx], [field]: value };
      return { ...f, rules };
    });
  };

  const removeRule = (idx) => setForm(f => ({ ...f, rules: f.rules.filter((_, i) => i !== idx) }));
  const addRule = () => setForm(f => ({ ...f, rules: [...f.rules, emptyRule()] }));

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const payload = { ...form };
      if (isEdit) {
        await api.put(`/pricelists/${editing.id}`, payload);
        toast.success("Pricelist updated!");
      } else {
        await api.post("/pricelists", payload);
        toast.success("Pricelist created!");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {isEdit ? "Edit Pricelist" : "Create New Pricelist"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Pricelist Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Festival Special" />
            <Input label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional description" />
          </div>

          <div className="flex items-center gap-3">
            <div
              onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
              className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${form.isActive ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.isActive ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400">Active</span>
          </div>

          {/* Rules */}
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Pricing Rules</p>
            <div className="space-y-3">
              <AnimatePresence>
                {form.rules.map((rule, idx) => (
                  <RuleForm key={idx} rule={rule} onChange={(field, val) => updateRule(idx, field, val)} onRemove={() => removeRule(idx)} />
                ))}
              </AnimatePresence>
            </div>
            <button onClick={addRule}
              className="mt-3 flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium transition-colors">
              <Plus className="w-4 h-4" /> Add Rule
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : isEdit ? "Update" : "Create"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function PricelistPage() {
  const [pricelists, setPricelists] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editing,    setEditing]    = useState(null);

  const load = async () => {
    try {
      const res = await api.get("/pricelists");
      if (res.data?.success) setPricelists(res.data.data || []);
    } catch { toast.error("Failed to load pricelists"); }
    finally   { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleEdit = (pl) => { setEditing(pl); setModalOpen(true); };
  const handleNew  = ()   => { setEditing(null); setModalOpen(true); };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this pricelist?")) return;
    try {
      await api.delete(`/pricelists/${id}`);
      toast.success("Deleted!");
      load();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <div>
      <PageHeader
        title="Pricelists"
        subtitle="Configure rental rate rules, periodicities and price ranges"
        breadcrumbs={["Admin", "Pricelists"]}
        actions={
          <button onClick={handleNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> New Pricelist
          </button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : pricelists.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-4">
            <List className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No pricelists yet</h3>
          <p className="text-sm text-slate-400 mt-1 mb-6">Create a pricelist to define custom rental rates.</p>
          <button onClick={handleNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium">
            <Plus className="w-4 h-4" /> Create First Pricelist
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {pricelists.map(pl => (
            <PricelistCard key={pl.id} pricelist={pl} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        onSaved={load}
      />
    </div>
  );
}
