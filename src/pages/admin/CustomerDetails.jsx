import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, User, Mail, Phone, MapPin, Calendar, Clock, CheckCircle, AlertTriangle, CreditCard, ShoppingBag } from 'lucide-react';
import { customers, rentals } from '../../data/mockData';
import { formatCurrency } from '../../lib/utils';
import StatusBadge from '../../components/ui/StatusBadge';

export default function CustomerDetails() {
  const { id } = useParams();
  const customer = customers.find(c => c.id === parseInt(id));
  
  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <User className="w-16 h-16 text-slate-600 mb-4" />
        <h2 className="text-xl font-bold text-slate-200">Customer not found</h2>
        <p className="text-slate-500 mt-2 mb-6">The customer you're looking for doesn't exist or has been removed.</p>
        <Link to="/admin/customers" className="text-indigo-400 hover:text-indigo-300 font-medium bg-indigo-500/10 px-4 py-2 rounded-lg">
          Back to Customers
        </Link>
      </div>
    );
  }

  const customerRentals = rentals.filter(r => r.customerId === customer.id);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/customers" className="p-2 hover:bg-slate-800 light:hover:bg-slate-200 rounded-full transition-colors text-slate-400 light:text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-100 light:text-slate-800">Customer Profile</h2>
            <p className="text-slate-500 text-sm mt-1">View detailed information and rental history.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-slate-800 light:bg-white hover:bg-slate-700 light:hover:bg-slate-50 text-slate-200 light:text-slate-800 border border-slate-700 light:border-slate-200 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm">
          <Edit className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Main Card */}
          <div className="bg-slate-900/50 light:bg-white p-6 rounded-2xl border border-slate-800 light:border-slate-200 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-3xl font-bold border-2 border-indigo-500/30 mb-4">
              {customer.name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-slate-100 light:text-slate-800">{customer.name}</h3>
            <div className="mt-2 mb-4">
              <StatusBadge status={customer.status} />
            </div>
            <p className="text-sm text-slate-500 w-full border-t border-slate-800 light:border-slate-200 pt-4 mt-2">
              Customer ID: <span className="font-medium text-slate-300 light:text-slate-700">CUST-{customer.id.toString().padStart(4, '0')}</span>
            </p>
          </div>

          {/* Contact Details */}
          <div className="bg-slate-900/50 light:bg-white p-6 rounded-2xl border border-slate-800 light:border-slate-200">
            <h4 className="font-semibold text-slate-200 light:text-slate-800 mb-4 border-b border-slate-800 light:border-slate-200 pb-2">Contact Information</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-slate-500 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">Email Address</p>
                  <p className="text-sm font-medium text-slate-300 light:text-slate-700">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-slate-500 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">Phone Number</p>
                  <p className="text-sm font-medium text-slate-300 light:text-slate-700">{customer.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-500 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">Address</p>
                  <p className="text-sm font-medium text-slate-300 light:text-slate-700 leading-relaxed">{customer.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-slate-500 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">Member Since</p>
                  <p className="text-sm font-medium text-slate-300 light:text-slate-700">{customer.joinDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Stats & History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 light:bg-white p-5 rounded-2xl border border-slate-800 light:border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h5 className="text-sm font-medium text-slate-400">Total Rentals</h5>
              </div>
              <p className="text-2xl font-bold text-slate-100 light:text-slate-800">{customer.totalRentals}</p>
            </div>
            <div className="bg-slate-900/50 light:bg-white p-5 rounded-2xl border border-slate-800 light:border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h5 className="text-sm font-medium text-slate-400">Total Spent</h5>
              </div>
              <p className="text-2xl font-bold text-slate-100 light:text-slate-800">{formatCurrency(customer.totalSpent)}</p>
            </div>
            <div className="bg-slate-900/50 light:bg-white p-5 rounded-2xl border border-slate-800 light:border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
                <h5 className="text-sm font-medium text-slate-400">Last Active</h5>
              </div>
              <p className="text-xl font-bold text-slate-100 light:text-slate-800 truncate">{customer.lastRental}</p>
            </div>
          </div>

          {/* Rental History */}
          <div className="bg-slate-900/50 light:bg-white rounded-2xl border border-slate-800 light:border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-800 light:border-slate-200">
              <h4 className="font-semibold text-slate-200 light:text-slate-800">Recent Rental History</h4>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300 light:text-slate-600">
                <thead className="bg-slate-800/30 light:bg-slate-50 text-xs uppercase font-medium text-slate-400">
                  <tr>
                    <th className="px-5 py-3">Order ID</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3 hidden sm:table-cell">Items</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 light:divide-slate-200">
                  {customerRentals.length > 0 ? (
                    customerRentals.map(rental => (
                      <tr key={rental.id} className="hover:bg-slate-800/30 light:hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3 font-medium text-slate-200 light:text-slate-800">{rental.id}</td>
                        <td className="px-5 py-3 text-xs">
                          {rental.startDate} <span className="text-slate-500 block">to {rental.endDate}</span>
                        </td>
                        <td className="px-5 py-3 hidden sm:table-cell">
                          <div className="max-w-[200px] truncate">
                            {rental.products.map(p => p.name).join(', ')}
                          </div>
                        </td>
                        <td className="px-5 py-3 font-medium">{formatCurrency(rental.totalAmount)}</td>
                        <td className="px-5 py-3 text-right">
                          <StatusBadge status={rental.status} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-5 py-8 text-center text-slate-500">
                        No rental history found for this customer.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
