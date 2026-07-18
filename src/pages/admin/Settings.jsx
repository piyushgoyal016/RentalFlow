import { useState } from 'react';
import { Save, User, Building, Bell, Shield, CreditCard, Mail } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 light:text-slate-800">Settings</h2>
        <p className="text-slate-500 text-sm mt-1">Manage your account settings, business preferences, and platform configurations.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-slate-900/50 light:bg-white border border-slate-800 light:border-slate-200 rounded-2xl overflow-hidden p-2 flex flex-col gap-1">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 light:hover:bg-slate-50 light:hover:text-slate-600'}`}
            >
              <User className="w-4 h-4" />
              Personal Profile
            </button>
            <button 
              onClick={() => setActiveTab('business')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'business' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 light:hover:bg-slate-50 light:hover:text-slate-600'}`}
            >
              <Building className="w-4 h-4" />
              Business Details
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 light:hover:bg-slate-50 light:hover:text-slate-600'}`}
            >
              <Bell className="w-4 h-4" />
              Notifications
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 light:hover:bg-slate-50 light:hover:text-slate-600'}`}
            >
              <Shield className="w-4 h-4" />
              Security & Access
            </button>
            <button 
              onClick={() => setActiveTab('billing')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'billing' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 light:hover:bg-slate-50 light:hover:text-slate-600'}`}
            >
              <CreditCard className="w-4 h-4" />
              Billing & Tax
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-slate-900/50 light:bg-white border border-slate-800 light:border-slate-200 rounded-2xl p-6">
            
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="border-b border-slate-800 light:border-slate-200 pb-4">
                  <h3 className="text-lg font-bold text-slate-100 light:text-slate-800">Personal Profile</h3>
                  <p className="text-sm text-slate-500 mt-1">Update your photo and personal details here.</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-indigo-500/20 border-2 border-indigo-500 flex items-center justify-center text-indigo-400 text-2xl font-bold">
                    AD
                  </div>
                  <div className="space-y-2">
                    <button className="bg-slate-800 light:bg-slate-100 text-slate-200 light:text-slate-700 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                      Change Avatar
                    </button>
                    <p className="text-xs text-slate-500">JPG, GIF or PNG. 1MB max.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300 light:text-slate-700">First Name</label>
                    <input type="text" defaultValue="Admin" className="w-full bg-slate-800 light:bg-slate-100 border border-slate-700 light:border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-200 light:text-slate-800 focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300 light:text-slate-700">Last Name</label>
                    <input type="text" defaultValue="User" className="w-full bg-slate-800 light:bg-slate-100 border border-slate-700 light:border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-200 light:text-slate-800 focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300 light:text-slate-700">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="email" defaultValue="admin@rentflow.com" className="w-full bg-slate-800 light:bg-slate-100 border border-slate-700 light:border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 light:text-slate-800 focus:outline-none focus:border-indigo-500" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300 light:text-slate-700">Role</label>
                    <input type="text" defaultValue="Super Administrator" disabled className="w-full bg-slate-800/50 light:bg-slate-100/50 border border-slate-800 light:border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'business' && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="border-b border-slate-800 light:border-slate-200 pb-4">
                  <h3 className="text-lg font-bold text-slate-100 light:text-slate-800">Business Details</h3>
                  <p className="text-sm text-slate-500 mt-1">Information displayed on invoices and receipts.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300 light:text-slate-700">Business Name</label>
                    <input type="text" defaultValue="RentFlow Enterprise" className="w-full bg-slate-800 light:bg-slate-100 border border-slate-700 light:border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-200 light:text-slate-800 focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300 light:text-slate-700">Business Address</label>
                    <textarea rows="3" defaultValue="123 Rental Street, Tech Park&#10;Mumbai, Maharashtra 400001" className="w-full bg-slate-800 light:bg-slate-100 border border-slate-700 light:border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-200 light:text-slate-800 focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300 light:text-slate-700">Support Email</label>
                      <input type="email" defaultValue="support@rentflow.com" className="w-full bg-slate-800 light:bg-slate-100 border border-slate-700 light:border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-200 light:text-slate-800 focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300 light:text-slate-700">Contact Number</label>
                      <input type="text" defaultValue="+91 1800-RENT-NOW" className="w-full bg-slate-800 light:bg-slate-100 border border-slate-700 light:border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-200 light:text-slate-800 focus:outline-none focus:border-indigo-500" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs can be empty placeholders for now */}
            {(activeTab === 'notifications' || activeTab === 'security' || activeTab === 'billing') && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="border-b border-slate-800 light:border-slate-200 pb-4">
                  <h3 className="text-lg font-bold text-slate-100 light:text-slate-800 capitalize">{activeTab} Settings</h3>
                  <p className="text-sm text-slate-500 mt-1">Configure your {activeTab} preferences here.</p>
                </div>
                <div className="py-8 text-center text-slate-500">
                  <p>Configuration options for {activeTab} will appear here.</p>
                </div>
              </div>
            )}

            {/* Save Actions */}
            <div className="mt-8 pt-6 border-t border-slate-800 light:border-slate-200 flex justify-end gap-3">
              <button className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors">
                Cancel
              </button>
              <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
