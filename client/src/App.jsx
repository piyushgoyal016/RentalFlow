import { Routes, Route, Outlet, useLocation, Navigate } from "react-router-dom";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

// ─── Layouts ──────────────────────────────────────────────────────────────────
import AdminLayout from "@/components/admin/layout/AdminLayout";
import CustomerLayout from "@/components/customer/layout/CustomerLayout";

// ─── Customer Pages ────────────────────────────────────────────────────────────
import LandingPage       from "@/pages/Landing/LandingPage";
import LoginPage         from "@/pages/Auth/LoginPage";
import RegisterPage      from "@/pages/Auth/RegisterPage";
import ForgotPasswordPage from "@/pages/Auth/ForgotPasswordPage";
import ProductsPage      from "@/pages/Customer/ProductsPage";
import ProductDetailPage from "@/pages/Customer/ProductDetailPage";
import CategoryPage      from "@/pages/Customer/CategoryPage";
import MyRentalsPage     from "@/pages/Customer/MyRentalsPage";
import RentalDetailPage  from "@/pages/Customer/RentalDetailPage";
import ProfilePage       from "@/pages/Customer/ProfilePage";
import NotificationsPage from "@/pages/Customer/NotificationsPage";
import CustomerDashboardPage from "@/pages/Customer/CustomerDashboardPage";
import AddressesPage     from "@/pages/Customer/AddressesPage";
import CustomerPaymentsPage from "@/pages/Customer/PaymentsPage";
import NotFoundPage      from "@/pages/NotFoundPage";

// ─── Admin Pages ───────────────────────────────────────────────────────────────
import DashboardPage      from "@/pages/Admin/DashboardPage";
import CustomersPage      from "@/pages/Admin/CustomersPage";
import CategoriesPage     from "@/pages/Admin/CategoriesPage";
import InventoryPage      from "@/pages/Admin/InventoryPage";
import AdminProductsPage  from "@/pages/Admin/ProductsPage";
import RentalsPage        from "@/pages/Admin/RentalsPage";
import ReturnsPage        from "@/pages/Admin/ReturnsPage";
import PaymentsPage       from "@/pages/Admin/PaymentsPage";
import DepositsPage       from "@/pages/Admin/DepositsPage";
import ReportsPage        from "@/pages/Admin/ReportsPage";
import AnalyticsPage      from "@/pages/Admin/AnalyticsPage";
import AdminNotificationsPage from "@/pages/Admin/NotificationsPage";
import SettingsPage       from "@/pages/Admin/SettingsPage";

// ─── Admin Route Guard ─────────────────────────────────────────────────────────
function AdminRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" style={{ borderWidth: "3px" }} />
          <p className="text-sm text-slate-400">Loading…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const role = (user?.role || "").toUpperCase();

  // Block CUSTOMER role from accessing admin routes entirely
  if (role !== "ADMIN" && role !== "VENDOR") {
    return <Navigate to="/" replace />;
  }

  // Restrict VENDOR role to only certain features
  const restrictedForVendor = [
    "/admin/customers",
    "/admin/categories",
    "/admin/payments",
    "/admin/deposits",
    "/admin/reports",
    "/admin/analytics",
    "/admin/settings",
  ];

  const currentPath = location.pathname.toLowerCase();
  const isRestricted = restrictedForVendor.some(path => currentPath.startsWith(path.toLowerCase()));

  if (role === "VENDOR" && isRestricted) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

// ─── Customer Layout ───────────────────────────────────────────────────────────
function MainLayout() {
  const location = useLocation();
  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────
function App() {
  return (
    <Routes>
      {/* ── Admin Routes ─────────────────────────────────── */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index            element={<DashboardPage />}          />
        <Route path="customers" element={<CustomersPage />}          />
        <Route path="categories"element={<CategoriesPage />}         />
        <Route path="inventory" element={<InventoryPage />}          />
        <Route path="products"  element={<AdminProductsPage />}      />
        <Route path="rentals"   element={<RentalsPage />}            />
        <Route path="returns"   element={<ReturnsPage />}            />
        <Route path="payments"  element={<PaymentsPage />}           />
        <Route path="deposits"  element={<DepositsPage />}           />
        <Route path="reports"   element={<ReportsPage />}            />
        <Route path="analytics" element={<AnalyticsPage />}          />
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="settings"  element={<SettingsPage />}           />
      </Route>

      {/* ── Customer Portal Routes (With Sidebar Layout) ──── */}
      <Route
        element={
          <ProtectedRoute>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard"         element={<CustomerDashboardPage />} />
        <Route path="/my-rentals"        element={<MyRentalsPage />}         />
        <Route path="/my-rentals/:id"    element={<RentalDetailPage />}      />
        <Route path="/payments"          element={<CustomerPaymentsPage />}  />
        <Route path="/addresses"         element={<AddressesPage />}         />
        <Route path="/profile"           element={<ProfilePage />}           />
        <Route path="/notifications"     element={<NotificationsPage />}     />
      </Route>

      {/* ── Public Customer Routes ────────────────────────── */}
      <Route element={<MainLayout />}>
        {/* Public */}
        <Route path="/"                  element={<LandingPage />}       />
        <Route path="/login"             element={<LoginPage />}         />
        <Route path="/register"          element={<RegisterPage />}      />
        <Route path="/forgot-password"   element={<ForgotPasswordPage />}/>
        <Route path="/products"          element={<ProductsPage />}      />
        <Route path="/products/:id"      element={<ProductDetailPage />} />
        <Route path="/categories/:slug"  element={<CategoryPage />}      />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
