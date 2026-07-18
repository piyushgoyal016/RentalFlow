import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default function StatCard({ title, value, change, isCurrency, icon: Icon }) {
  const isPositive = change >= 0;

  return (
    <div className="glass-card p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 light:text-slate-600">{title}</p>
          <h3 className="text-2xl font-bold mt-2 text-slate-100 light:text-slate-800">
            {isCurrency ? formatCurrency(value) : value.toLocaleString()}
          </h3>
        </div>
        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
          <Icon size={20} />
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-4 text-xs">
        <span className={`flex items-center gap-0.5 font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(change)}%
        </span>
        <span className="text-slate-500">vs last month</span>
      </div>
    </div>
  );
}
