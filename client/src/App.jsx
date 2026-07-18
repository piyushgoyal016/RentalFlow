import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";

// Pages
import LandingPage from "@/pages/Landing/LandingPage";
import LoginPage from "@/pages/Auth/LoginPage";
import RegisterPage from "@/pages/Auth/RegisterPage";
import ForgotPasswordPage from "@/pages/Auth/ForgotPasswordPage";
import ProductsPage from "@/pages/Customer/ProductsPage";
import ProductDetailPage from "@/pages/Customer/ProductDetailPage";
import CategoryPage from "@/pages/Customer/CategoryPage";
import MyRentalsPage from "@/pages/Customer/MyRentalsPage";
import RentalDetailPage from "@/pages/Customer/RentalDetailPage";
import ProfilePage from "@/pages/Customer/ProfilePage";
import NotificationsPage from "@/pages/Customer/NotificationsPage";
import NotFoundPage from "@/pages/NotFoundPage";

// Layout with Navbar + Footer
function MainLayout() {
  const location = useLocation();
  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(
    location.pathname
  );

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

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/categories/:slug" element={<CategoryPage />} />

        {/* Protected Routes */}
        <Route
          path="/my-rentals"
          element={
            <ProtectedRoute>
              <MyRentalsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-rentals/:id"
          element={
            <ProtectedRoute>
              <RentalDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
