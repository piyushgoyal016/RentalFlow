import {
  Package,
  Clock,
  Shield,
  BarChart3,
  QrCode,
  Bell,
} from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Inventory Tracking",
    description: "Real-time tracking of all your rental assets with availability status, quantities, and condition monitoring.",
    color: "bg-primary-100 text-primary-600",
  },
  {
    icon: Clock,
    title: "Quick Rentals",
    description: "Streamlined rental workflow — from product selection to checkout in minutes, not hours.",
    color: "bg-accent-100 text-accent-600",
  },
  {
    icon: Shield,
    title: "Secure Deposits",
    description: "Automated security deposit management with transparent calculations and hassle-free refunds.",
    color: "bg-success-50 text-success-600",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Comprehensive dashboard with revenue trends, top products, customer insights, and business KPIs.",
    color: "bg-warning-50 text-warning-600",
  },
  {
    icon: QrCode,
    title: "QR-Based Tracking",
    description: "Scan QR codes for instant asset identification, quick returns, and damage inspection logging.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Automated alerts for rental confirmations, return reminders, late notices, and deposit refunds.",
    color: "bg-danger-50 text-danger-600",
  },
];

function FeaturesSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-app">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">
            Features
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-slate-900">
            Everything you need to manage rentals
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Powerful tools designed for rental businesses of all sizes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative p-8 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:border-slate-200 transition-all duration-300 hover-lift"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color} mb-5`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { FeaturesSection };
