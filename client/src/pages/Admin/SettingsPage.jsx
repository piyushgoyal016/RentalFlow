import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Percent, FileText, Bell, Palette,
  Users, Shield, Save, Check, ChevronRight
} from "lucide-react";
import PageHeader from "@/components/admin/shared/PageHeader";

const SETTING_TABS = [
  { id: "company",    label: "Company",         icon: Building2  },
  { id: "tax",        label: "Tax & Fees",       icon: Percent    },
  { id: "policies",   label: "Rental Policies",  icon: FileText   },
  { id: "notifs",     label: "Notifications",    icon: Bell       },
  { id: "theme",      label: "Theme",            icon: Palette    },
  { id: "users",      label: "Users & Roles",    icon: Users      },
];

function SaveButton({ saving, saved, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-medium transition-all"
    >
      {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> :
       saved   ? <Check className="w-4 h-4" /> :
                 <Save className="w-4 h-4" />}
      {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
    </button>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
        {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
      </div>
      <div className="md:col-span-2">{children}</div>
    </div>
  );
}

function InputField({ ...props }) {
  return (
    <input
      {...props}
      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
    />
  );
}

function Toggle({ checked, onChange }) {
  return (
    <div onClick={onChange} className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${checked ? "bg-primary-600" : "bg-slate-200 dark:bg-slate-700"}`}>
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
    </div>
  );
}

function CompanySettings({ onSave }) {
  const [form, setForm] = useState({ name: "RentFlow Pvt Ltd", email: "admin@rentflow.in", phone: "+91 98765 43210", address: "123 MG Road, Mumbai 400001", gst: "27AAACR5055K1Z5", currency: "INR" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="space-y-0">
        <Field label="Company Name" hint="Legal registered name">
          <InputField value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </Field>
        <Field label="Support Email" hint="Visible on invoices and emails">
          <InputField type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </Field>
        <Field label="Phone" hint="Customer support number">
          <InputField value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        </Field>
        <Field label="Address" hint="Registered business address">
          <textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} rows={2}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
          />
        </Field>
        <Field label="GST Number" hint="For invoice generation">
          <InputField value={form.gst} onChange={e => setForm(f => ({ ...f, gst: e.target.value }))} />
        </Field>
        <Field label="Currency" hint="Used across the platform">
          <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="INR">INR – Indian Rupee (₹)</option>
            <option value="USD">USD – US Dollar ($)</option>
            <option value="EUR">EUR – Euro (€)</option>
          </select>
        </Field>
      </div>
      <div className="flex justify-end mt-6">
        <SaveButton saving={saving} saved={saved} onClick={handleSave} />
      </div>
    </div>
  );
}

function TaxSettings() {
  const [gstRate, setGstRate] = useState(18);
  const [lateFeePerDay, setLateFeePerDay] = useState(500);
  const [minDeposit, setMinDeposit] = useState(2000);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="space-y-0">
        <Field label="GST Rate (%)" hint="Applied to all rental invoices">
          <div className="flex items-center gap-2">
            <InputField type="number" value={gstRate} onChange={e => setGstRate(e.target.value)} className="w-32" />
            <span className="text-sm text-slate-400">%</span>
          </div>
        </Field>
        <Field label="Late Fee per Day" hint="Charged for overdue rentals">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">₹</span>
            <InputField type="number" value={lateFeePerDay} onChange={e => setLateFeePerDay(e.target.value)} className="w-40" />
          </div>
        </Field>
        <Field label="Minimum Deposit" hint="Minimum deposit required per rental">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">₹</span>
            <InputField type="number" value={minDeposit} onChange={e => setMinDeposit(e.target.value)} className="w-40" />
          </div>
        </Field>
      </div>
      <div className="flex justify-end mt-6">
        <SaveButton saving={saving} saved={saved} onClick={handleSave} />
      </div>
    </div>
  );
}

function NotificationSettings() {
  const [settings, setSettings] = useState({
    rentalCreated:   true,
    paymentReceived: true,
    returnDue:       true,
    overdueAlert:    true,
    depositRefund:   false,
    newCustomer:     false,
  });

  const labels = {
    rentalCreated:   { label: "Rental Created",   desc: "When a new rental is placed" },
    paymentReceived: { label: "Payment Received",  desc: "When payment is confirmed" },
    returnDue:       { label: "Return Due (24h)",  desc: "Reminder 24h before return" },
    overdueAlert:    { label: "Overdue Alert",     desc: "When rental becomes overdue" },
    depositRefund:   { label: "Deposit Refunded",  desc: "When a deposit is processed" },
    newCustomer:     { label: "New Customer",      desc: "When a new user registers" },
  };

  return (
    <div className="space-y-0">
      {Object.entries(labels).map(([key, val]) => (
        <div key={key} className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{val.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{val.desc}</p>
          </div>
          <Toggle
            checked={settings[key]}
            onChange={() => setSettings(s => ({ ...s, [key]: !s[key] }))}
          />
        </div>
      ))}
    </div>
  );
}

function UsersSettings() {
  const USERS = [
    { name: "Rahul Admin",  email: "rahul@rentflow.in", role: "ADMIN",  status: true  },
    { name: "Priya Staff",  email: "priya@rentflow.in", role: "STAFF",  status: true  },
    { name: "Amit Manager", email: "amit@rentflow.in",  role: "MANAGER",status: false },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-slate-500 dark:text-slate-400">{USERS.length} team members</p>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-all">
          <Users className="w-4 h-4" /> Invite Member
        </button>
      </div>
      <div className="space-y-3">
        {USERS.map(u => (
          <div key={u.email} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {u.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 dark:text-white text-sm">{u.name}</p>
              <p className="text-xs text-slate-400">{u.email}</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">{u.role}</span>
            <div className={`w-2 h-2 rounded-full ${u.status ? "bg-success-500" : "bg-slate-300"}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState("company");

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Configure your rental management system"
        breadcrumbs={["Admin", "Settings"]}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab sidebar */}
        <div className="lg:w-56 flex-shrink-0">
          <nav className="space-y-1">
            {SETTING_TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  tab === t.id
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <t.icon className="w-4 h-4 flex-shrink-0" />
                {t.label}
                {tab === t.id && <ChevronRight className="w-3.5 h-3.5 ml-auto text-primary-500" />}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6"
          >
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-6">
              {SETTING_TABS.find(t => t.id === tab)?.label}
            </h3>

            {tab === "company"  && <CompanySettings />}
            {tab === "tax"      && <TaxSettings />}
            {tab === "notifs"   && <NotificationSettings />}
            {tab === "users"    && <UsersSettings />}
            {["policies","theme"].includes(tab) && (
              <div className="text-center py-12">
                <Shield className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">Coming soon</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
