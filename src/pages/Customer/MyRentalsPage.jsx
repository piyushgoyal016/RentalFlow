import { useState, useEffect } from "react";
import { rentalService } from "@/services/rentalService";
import { RentalCard } from "@/components/customer/RentalCard";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageLoader } from "@/components/common/Loader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ClipboardList, Plus } from "lucide-react";

const statusTabs = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Overdue", value: "overdue" },
];

export default function MyRentalsPage() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchRentals();
  }, [activeTab]);

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const data = await rentalService.getMyRentals({ status: activeTab });
      setRentals(data);
    } catch {
      setRentals([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="container-app">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "My Rentals" },
          ]}
          className="mb-6"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Rentals</h1>
            <p className="text-slate-500 mt-1">
              Track and manage your rental orders
            </p>
          </div>
          <Link to="/products">
            <Button>
              <Plus className="h-4 w-4" />
              New Rental
            </Button>
          </Link>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1 mb-8 overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.value
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <PageLoader />
        ) : rentals.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No rentals found"
            description={
              activeTab === "all"
                ? "You haven't rented anything yet. Browse our products to get started!"
                : `No ${activeTab} rentals found.`
            }
            actionLabel="Browse Products"
            onAction={() => (window.location.href = "/products")}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rentals.map((rental) => (
              <RentalCard key={rental.id} rental={rental} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
