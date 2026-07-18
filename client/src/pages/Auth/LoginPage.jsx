import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Package, Mail, Lock, Eye, EyeOff, ArrowRight,
  User, Building2, ShoppingBag, BarChart2, Shield,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

const loginSchema = z.object({
  email:    z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ─── Tab config ────────────────────────────────────────────────────────────────
const TABS = [
  {
    id: "customer",
    label: "Customer",
    icon: User,
    color: "from-violet-600 to-primary-600",
    accent: "primary",
    title: "Welcome back!",
    subtitle: "Sign in to browse and rent products",
    redirect: "/",
    features: [
      { icon: ShoppingBag, text: "Browse thousands of rental products" },
      { icon: CheckCircle, text: "Track your active rentals"            },
      { icon: Package,     text: "Manage returns & deposits"            },
    ],
    illustration: {
      heading: "Rent Anything, Anytime",
      body: "Discover a wide range of products available for rent. From electronics to event supplies — all at your fingertips.",
      gradient: "from-violet-700 via-primary-700 to-primary-900",
    },
    demoHint: "Use any email + password (6+ chars)",
  },
  {
    id: "vendor",
    label: "Vendor / Admin",
    icon: Building2,
    color: "from-slate-700 to-slate-900",
    accent: "slate",
    title: "Admin Portal",
    subtitle: "Sign in to manage your rental business",
    redirect: "/admin",
    features: [
      { icon: BarChart2,  text: "Full business analytics & reports"   },
      { icon: Shield,     text: "Manage roles, permissions & settings" },
      { icon: Package,    text: "Control inventory & rental orders"    },
    ],
    illustration: {
      heading: "Run Your Business Smarter",
      body: "Manage customers, inventory, payments, deposits and reports — all from one powerful admin dashboard.",
      gradient: "from-slate-800 via-slate-700 to-primary-900",
    },
    demoHint: "Use any email + password (6+ chars)",
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [activeTab, setActiveTab]     = useState("customer");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const tab = TABS.find((t) => t.id === activeTab);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: zodResolver(loginSchema) });

  const switchTab = (id) => {
    setActiveTab(id);
    reset();
    setShowPassword(false);
  };

  const onSubmit = async (data) => {
    try {
      const result = await login(data.email, data.password);
      const role = (result?.user?.role || "").toUpperCase();

      if (role === "ADMIN" || role === "VENDOR") {
        toast.success(`Welcome back, ${result.user.firstName || "Admin"}!`, {
          description: "Redirecting to your Admin Dashboard...",
        });
        navigate("/admin", { replace: true });
      } else {
        toast.success("Welcome back!", {
          description: "Redirecting to your Dashboard...",
        });
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      toast.error("Sign-in failed", {
        description: error?.message || "Please check your credentials.",
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* ── Left Panel — Form ──────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 xl:px-16">
        <div className="w-full max-w-md space-y-8">

          {/* Logo */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-glow">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                Rent<span className="text-primary-600">Flow</span>
              </span>
            </Link>
          </div>

          {/* ── Tab Switcher ─────────────────────────────────── */}
          <div className="relative flex bg-slate-100 dark:bg-slate-800/70 p-1.5 rounded-2xl">
            {/* Sliding background */}
            <motion.div
              layout
              className={`absolute inset-y-1.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm`}
              style={{ width: "calc(50% - 3px)" }}
              animate={{ x: activeTab === "vendor" ? "calc(100% + 6px)" : "0%" }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
            />

            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
                className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 z-10 ${
                  activeTab === t.id
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Form Card ────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{    opacity: 0, y: -8,  scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              {/* Accent top bar */}
              <div className={`h-1 rounded-t-2xl bg-gradient-to-r ${tab.color} mb-0`} />

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-b-2xl rounded-tr-2xl p-8 shadow-card space-y-6">
                {/* Title */}
                <div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                    activeTab === "vendor"
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      : "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                  }`}>
                    <tab.icon className="w-3 h-3" />
                    {activeTab === "vendor" ? "Admin / Vendor" : "Customer"}
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{tab.title}</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{tab.subtitle}</p>
                </div>

                {/* Demo hint */}
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                  <span className="text-amber-500 text-base">💡</span>
                  <p className="text-xs text-amber-700 dark:text-amber-400">{tab.demoHint}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label htmlFor={`email-${activeTab}`} className="text-slate-700 dark:text-slate-300">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id={`email-${activeTab}`}
                        type="email"
                        placeholder={activeTab === "vendor" ? "admin@company.com" : "you@example.com"}
                        className="pl-10 h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                        {...register("email")}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-danger-600 dark:text-red-400">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`password-${activeTab}`} className="text-slate-700 dark:text-slate-300">
                        Password
                      </Label>
                      <Link
                        to="/forgot-password"
                        className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id={`password-${activeTab}`}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                        {...register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-danger-600 dark:text-red-400">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full h-11 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-60 bg-gradient-to-r ${tab.color}`}
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {activeTab === "vendor" ? "Enter Admin Portal" : "Sign In"}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer link — only for customers */}
                {activeTab === "customer" && (
                  <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                    Don&apos;t have an account?{" "}
                    <Link
                      to="/register"
                      className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                    >
                      Create account
                    </Link>
                  </p>
                )}

                {activeTab === "vendor" && (
                  <p className="text-center text-xs text-slate-400 dark:text-slate-500">
                    Admin access is restricted to authorized personnel only.
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Right Panel — Decorative ───────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + "-panel"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className={`hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br ${tab.illustration.gradient} p-12 relative overflow-hidden`}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, white 0%, transparent 50%), radial-gradient(circle at 80% 80%, white 0%, transparent 40%)" }} />
          <div className="absolute top-16 right-16 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute bottom-20 left-12 w-20 h-20 rounded-full bg-white/5" />

          <div className="relative max-w-md text-center text-white space-y-8">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="flex h-20 w-20 mx-auto items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10"
            >
              {activeTab === "vendor"
                ? <Building2 className="h-10 w-10 text-white" />
                : <Package className="h-10 w-10 text-white" />
              }
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <h2 className="text-3xl font-bold leading-tight">{tab.illustration.heading}</h2>
              <p className="mt-3 text-white/70 leading-relaxed">{tab.illustration.body}</p>
            </motion.div>

            {/* Features list */}
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="space-y-3 text-left"
            >
              {tab.features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/8 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-white/90 font-medium">{f.text}</span>
                </div>
              ))}
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="flex gap-6 justify-center pt-2"
            >
              {activeTab === "customer" ? (
                <>
                  <div className="text-center">
                    <div className="text-2xl font-bold">10K+</div>
                    <div className="text-xs text-white/60 mt-0.5">Products</div>
                  </div>
                  <div className="w-px bg-white/20" />
                  <div className="text-center">
                    <div className="text-2xl font-bold">5K+</div>
                    <div className="text-xs text-white/60 mt-0.5">Customers</div>
                  </div>
                  <div className="w-px bg-white/20" />
                  <div className="text-center">
                    <div className="text-2xl font-bold">99%</div>
                    <div className="text-xs text-white/60 mt-0.5">Uptime</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-xs text-white/60 mt-0.5">Screens</div>
                  </div>
                  <div className="w-px bg-white/20" />
                  <div className="text-center">
                    <div className="text-2xl font-bold">Real-time</div>
                    <div className="text-xs text-white/60 mt-0.5">Analytics</div>
                  </div>
                  <div className="w-px bg-white/20" />
                  <div className="text-center">
                    <div className="text-2xl font-bold">RBAC</div>
                    <div className="text-xs text-white/60 mt-0.5">Security</div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
