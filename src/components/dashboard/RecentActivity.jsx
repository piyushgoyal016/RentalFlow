import { Package, Undo, CreditCard, UserPlus, AlertTriangle, Wrench, CheckCircle } from 'lucide-react';
import { recentActivity } from '../../data/mockData';

const iconMap = {
  package: Package,
  undo: Undo,
  'credit-card': CreditCard,
  'user-plus': UserPlus,
  'alert-triangle': AlertTriangle,
  tool: Wrench,
  'check-circle': CheckCircle,
};

export default function RecentActivity() {
  return (
    <div className="glass-card p-6 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-slate-200 light:text-slate-800 mb-4">Recent Activity</h3>
      <div className="flex-1 overflow-y-auto space-y-4 max-h-[360px] pr-2">
        {recentActivity.map((activity) => {
          const Icon = iconMap[activity.icon] || Package;
          return (
            <div key={activity.id} className="flex gap-4 items-start">
              <div className={`p-2 rounded-xl flex-shrink-0 ${
                activity.type === 'alert' ? 'bg-rose-500/10 text-rose-400' :
                activity.type === 'payment' ? 'bg-emerald-500/10 text-emerald-400' :
                activity.type === 'return' ? 'bg-amber-500/10 text-amber-400' :
                'bg-indigo-500/10 text-indigo-400'
              }`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-300 light:text-slate-700">{activity.message}</p>
                <span className="text-xs text-slate-500 mt-1 block">{activity.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
