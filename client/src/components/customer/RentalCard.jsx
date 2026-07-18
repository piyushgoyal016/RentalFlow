import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Calendar, ArrowRight } from "lucide-react";

const statusConfig = {
  active: { variant: "success", label: "Active" },
  confirmed: { variant: "default", label: "Confirmed" },
  completed: { variant: "secondary", label: "Completed" },
  overdue: { variant: "danger", label: "Overdue" },
};

function RentalCard({ rental }) {
  const status = statusConfig[rental.status] || statusConfig.active;

  return (
    <Link
      to={`/my-rentals/${rental.id}`}
      className="group flex gap-4 p-5 rounded-xl border border-slate-100 bg-white hover:shadow-lg hover:border-slate-200 transition-all duration-300"
    >
      <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
        <img
          src={rental.product?.image}
          alt={rental.product?.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-slate-900 truncate group-hover:text-primary-600 transition-colors">
            {rental.product?.name}
          </h3>
          <Badge variant={status.variant} className="flex-shrink-0 ml-2">
            {status.label}
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-400 mb-2">
          <Calendar className="h-3 w-3" />
          {formatDate(rental.startDate)} → {formatDate(rental.endDate)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-primary-600">
            {formatCurrency(rental.totalAmount)}
          </span>
          <span className="text-xs text-slate-400">
            {rental.duration} days
          </span>
        </div>
      </div>
      <ArrowRight className="h-5 w-5 text-slate-300 self-center group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
    </Link>
  );
}

export { RentalCard };
