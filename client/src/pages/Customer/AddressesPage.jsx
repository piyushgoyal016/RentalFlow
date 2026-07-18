import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MapPin, Trash2, Edit2, Check, X, Building, Home } from "lucide-react";
import PageHeader from "@/components/admin/shared/PageHeader";
import { toast } from "sonner";

const INITIAL_ADDRESSES = [
  { id: "addr-1", type: "Home", street: "102, Sunrise Apts, Linking Road", city: "Mumbai", state: "Maharashtra", zipCode: "400054", country: "India", isDefault: true },
  { id: "addr-2", type: "Office", street: "4th Floor, Tech Hub, Hitech City", city: "Hyderabad", state: "Telangana", zipCode: "500081", country: "India", isDefault: false }
];

function AddressModal({ address, onClose, onSave }) {
  const [type, setType] = useState(address?.type || "Home");
  const [street, setStreet] = useState(address?.street || "");
  const [city, setCity] = useState(address?.city || "");
  const [state, setState] = useState(address?.state || "");
  const [zipCode, setZipCode] = useState(address?.zipCode || "");
  const [country, setCountry] = useState(address?.country || "India");
  const [isDefault, setIsDefault] = useState(address?.isDefault || false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!street || !city || !state || !zipCode) {
      toast.error("Please fill in all required fields");
      return;
    }
    onSave({
      type, street, city, state, zipCode, country, isDefault
    });
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
          <h3 className="font-semibold text-slate-900 dark:text-white">{address ? "Edit Address" : "New Address"}</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><X className="w-4.5 h-4.5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Address Type</label>
            <div className="flex gap-2">
              {["Home", "Office", "Other"].map(t => (
                <button
                  type="button" key={t} onClick={() => setType(t)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${type === t ? "border-primary-600 bg-primary-50 text-primary-600" : "border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Street Address *</label>
            <input value={street} onChange={e => setStreet(e.target.value)} required placeholder="102, Sunrise Apt"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">City *</label>
              <input value={city} onChange={e => setCity(e.target.value)} required placeholder="Mumbai"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">State *</label>
              <input value={state} onChange={e => setState(e.target.value)} required placeholder="Maharashtra"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Zip Code *</label>
              <input value={zipCode} onChange={e => setZipCode(e.target.value)} required placeholder="400054"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Country</label>
              <input value={country} onChange={e => setCountry(e.target.value)} required placeholder="India"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="default-check" checked={isDefault} onChange={e => setIsDefault(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="default-check" className="text-xs font-medium text-slate-600 dark:text-slate-400">Set as default address</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm font-semibold hover:bg-slate-50">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 text-sm flex items-center justify-center gap-2">
              <Check className="w-4 h-4" /> Save
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [modal, setModal] = useState(null); // null | "create" | addressObj

  const handleSave = (data) => {
    if (modal && modal.id) {
      setAddresses(prev => prev.map(a => {
        if (a.id === modal.id) return { ...a, ...data };
        if (data.isDefault) return { ...a, isDefault: false };
        return a;
      }));
      toast.success("Address updated");
    } else {
      const newAddr = { id: `addr-${Date.now()}`, ...data };
      setAddresses(prev => {
        const list = data.isDefault ? prev.map(a => ({ ...a, isDefault: false })) : prev;
        return [...list, newAddr];
      });
      toast.success("Address added");
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure?")) return;
    setAddresses(prev => prev.filter(a => a.id !== id));
    toast.success("Address deleted");
  };

  const handleSetDefault = (id) => {
    setAddresses(prev => prev.map(a => ({
      ...a, isDefault: a.id === id
    })));
    toast.success("Default address updated");
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Addresses"
        subtitle="Manage your shipping and billing locations"
        breadcrumbs={["Customer", "Addresses"]}
        action={
          <button onClick={() => setModal("create")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700">
            <Plus className="w-4 h-4" /> Add Address
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <AnimatePresence>
          {addresses.map(addr => (
            <motion.div
              key={addr.id} layout
              className={`p-6 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm relative ${addr.isDefault ? "border-primary-600 dark:border-primary-500" : "border-slate-200 dark:border-slate-800"}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${addr.isDefault ? "bg-primary-50 text-primary-600" : "bg-slate-100 text-slate-500"}`}>
                    {addr.type === "Home" ? <Home className="w-4 h-4" /> : <Building className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{addr.type}</span>
                    {addr.isDefault && <span className="ml-2 text-[10px] font-semibold bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">Default</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setModal(addr)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(addr.id)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-danger-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-sm space-y-1">
                <p>{addr.street}</p>
                <p>{addr.city}, {addr.state} - {addr.zipCode}</p>
                <p>{addr.country}</p>
              </div>
              {!addr.isDefault && (
                <button onClick={() => handleSetDefault(addr.id)} className="mt-4 text-xs font-semibold text-primary-600 hover:underline">
                  Set as default
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {modal && (
          <AddressModal
            address={modal === "create" ? null : modal}
            onClose={() => setModal(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
