import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { rentalService } from "@/services/rentalService";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/common/Loader";
import { ErrorState } from "@/components/common/ErrorState";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Calendar,
  Package,
  Shield,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Truck,
} from "lucide-react";

const statusConfig = {
  confirmed: { variant: "default", label: "Confirmed", color: "text-primary-600" },
  active: { variant: "success", label: "Active", color: "text-success-600" },
  completed: { variant: "secondary", label: "Completed", color: "text-slate-600" },
  overdue: { variant: "danger", label: "Overdue", color: "text-danger-600" },
};

const timelineSteps = {
  confirmed: ["confirmed"],
  active: ["confirmed", "active"],
  completed: ["confirmed", "active", "returned"],
  overdue: ["confirmed", "active", "overdue"],
};

export default function RentalDetailPage() {
  const { id } = useParams();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRental();
  }, [id]);

  const fetchRental = async () => {
    setLoading(true);
    try {
      const data = await rentalService.getRentalById(id);
      setRental(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;
  if (error) return <ErrorState title="Rental not found" description={error} />;
  if (!rental) return null;

  const status = statusConfig[rental.status] || statusConfig.active;
  const steps = timelineSteps[rental.status] || [];

  return (
    <div className="py-8">
      <div className="container-app max-w-4xl">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "My Rentals", href: "/my-rentals" },
            { label: rental.id },
          ]}
          className="mb-6"
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Rental Details</h1>
            <p className="text-slate-500 mt-1">Order #{rental.id}</p>
          </div>
          <Badge variant={status.variant} className="text-sm px-4 py-1.5 self-start">
            {status.label}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Info */}
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Product</h3>
              <Link to={`/products/${rental.product?.id}`} className="flex gap-4 group">
                <img
                  src={rental.product?.image}
                  alt={rental.product?.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                    {rental.product?.name}
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">
                    {rental.product?.category}
                  </p>
                  <p className="text-sm font-medium text-primary-600 mt-2">
                    {formatCurrency(rental.dailyRate)}/day
                  </p>
                </div>
              </Link>
            </div>

            {/* Timeline */}
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Status Timeline</h3>
              <div className="space-y-4">
                {[
                  { key: "confirmed", icon: CheckCircle2, label: "Confirmed", desc: "Rental order confirmed" },
                  { key: "active", icon: Truck, label: "Active", desc: "Product picked up" },
                  { key: "returned", icon: Package, label: "Returned", desc: "Product returned" },
                  { key: "overdue", icon: AlertTriangle, label: "Overdue", desc: "Return overdue" },
                ]
                  .filter((s) => rental.status !== "overdue" ? s.key !== "overdue" : s.key !== "returned")
                  .map((s, idx) => {
                    const isActive = steps.includes(s.key);
                    return (
                      <div key={s.key} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              isActive
                                ? s.key === "overdue"
                                  ? "bg-danger-100 text-danger-600"
                                  : "bg-success-50 text-success-600"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            <s.icon className="h-4 w-4" />
                          </div>
                          {idx < 2 && (
                            <div
                              className={`w-0.5 h-8 ${
                                isActive ? "bg-success-300" : "bg-slate-200"
                              }`}
                            />
                          )}
                        </div>
                        <div className="pb-4">
                          <p className={`text-sm font-medium ${isActive ? "text-slate-900" : "text-slate-400"}`}>
                            {s.label}
                          </p>
                          <p className="text-xs text-slate-400">{s.desc}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rental Details */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
              <h3 className="font-semibold text-slate-900">Rental Summary</h3>
              {[
                { icon: Calendar, label: "Start Date", value: formatDate(rental.startDate) },
                { icon: Calendar, label: "End Date", value: formatDate(rental.endDate) },
                { icon: Clock, label: "Duration", value: `${rental.duration} days` },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 text-slate-400" />
                  <div className="flex-1">
                    <span className="text-xs text-slate-400">{item.label}</span>
                    <p className="text-sm font-medium text-slate-700">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
              <h3 className="font-semibold text-slate-900">Payment</h3>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Rental Amount</span>
                <span className="text-slate-900">{formatCurrency(rental.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Security Deposit</span>
                <span className="text-slate-900">{formatCurrency(rental.securityDeposit)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="font-bold text-primary-600">
                  {formatCurrency(rental.totalAmount + rental.securityDeposit)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-success-600 bg-success-50 p-2 rounded-lg mt-2">
                <CreditCard className="h-3 w-3" />
                Payment: {rental.paymentStatus}
              </div>
              {rental.depositRefunded && (
                <div className="flex items-center gap-2 text-xs text-primary-600 bg-primary-50 p-2 rounded-lg">
                  <Shield className="h-3 w-3" />
                  Deposit refunded
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
