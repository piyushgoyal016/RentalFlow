import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, Star, FileText, X, Save, Loader2, Check
} from "lucide-react";
import PageHeader from "@/components/admin/shared/PageHeader";
import api from "@/services/api";
import { toast } from "sonner";

// ─── Modal ─────────────────────────────────────────────────────────────────────
function TemplateModal({ isOpen, onClose, editing, onSaved }) {
  const isEdit = !!editing;
  const [form, setForm] = useState({ name: "", headerText: "", footerText: "", noteText: "", isDefault: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editing) {
        setForm({
          name:       editing.name       || "",
          headerText: editing.headerText || "",
          footerText: editing.footerText || "",
          noteText:   editing.noteText   || "",
          isDefault:  editing.isDefault  || false,
        });
      } else {
        setForm({ name: "", headerText: "", footerText: "", noteText: "", isDefault: false });
      }
    }
  }, [isOpen, editing]);

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Template name is required"); return; }
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/quotation-templates/${editing.id}`, form);
        toast.success("Template updated!");
      } else {
        await api.post("/quotation-templates", form);
        toast.success("Template created!");
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

  const TA = ({ label, hint, field, rows = 4 }) => (
    <div>
      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
      {hint && <p className="text-xs text-slate-400 mb-2">{hint}</p>}
      <textarea
        rows={rows}
        value={form[field]}
        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none font-mono"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {isEdit ? "Edit Template" : "New Quotation Template"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Template Name *</label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Standard Rental Quotation"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Set as default */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => setForm(f => ({ ...f, isDefault: !f.isDefault }))}
              className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${form.isDefault ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.isDefault ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-300">Set as default template</span>
          </div>

          <TA label="Header Text" hint="Company intro, logo placement instructions, address shown at the top of the quotation." field="headerText" rows={3} />
          <TA label="Footer Text" hint="Bank details, payment terms, T&Cs, signature lines." field="footerText" rows={4} />
          <TA label="Default Notes" hint="Notes that auto-populate on every new quotation using this template." field="noteText" rows={3} />
        </div>

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

// ─── Template Card ─────────────────────────────────────────────────────────────
function TemplateCard({ template, onEdit, onDelete }) {
  return (
    <motion.div
      layout
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-slate-900 dark:text-white">{template.name}</p>
              {template.isDefault && (
                <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                  <Star className="w-3 h-3" /> Default
                </span>
              )}
            </div>
            {template.headerText && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{template.headerText}</p>
            )}
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
              {template.footerText && <span>✓ Footer</span>}
              {template.noteText  && <span>✓ Notes</span>}
              <span>Created {new Date(template.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button onClick={() => onEdit(template)}
            className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-500 transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(template.id)}
            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function QuotationTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing,   setEditing]   = useState(null);

  const load = async () => {
    try {
      const res = await api.get("/quotation-templates");
      if (res.data?.success) setTemplates(res.data.data || []);
    } catch { toast.error("Failed to load templates"); }
    finally   { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleEdit   = (t) => { setEditing(t); setModalOpen(true); };
  const handleNew    = ()  => { setEditing(null); setModalOpen(true); };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this template?")) return;
    try {
      await api.delete(`/quotation-templates/${id}`);
      toast.success("Template deleted");
      load();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <div>
      <PageHeader
        title="Quotation Templates"
        subtitle="Define headers, footers and notes for rental quotations"
        breadcrumbs={["Admin", "Quotation Templates"]}
        actions={
          <button onClick={handleNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> New Template
          </button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : templates.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No templates yet</h3>
          <p className="text-sm text-slate-400 mt-1 mb-6">Create a quotation template to reuse consistent headers and footers.</p>
          <button onClick={handleNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium">
            <Plus className="w-4 h-4" /> Create First Template
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map(t => (
            <TemplateCard key={t.id} template={t} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <TemplateModal isOpen={modalOpen} onClose={() => setModalOpen(false)} editing={editing} onSaved={load} />
    </div>
  );
}
