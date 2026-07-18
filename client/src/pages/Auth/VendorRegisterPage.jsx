import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Mail, Lock, Eye, EyeOff, User, Building, FileText, Tag, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const vendorSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    companyName: z.string().min(2, "Company Name is required"),
    productCategory: z.string().min(1, "Product Category is required"),
    gstNo: z.string().min(5, "GST Number is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function VendorRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(vendorSchema),
  });

  const onSubmit = async (data) => {
    try {
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        companyName: data.companyName,
        gstNo: data.gstNo,
        productCategory: data.productCategory,
        roleName: "VENDOR", // Ensures they are registered as a vendor
      });
      toast.success("Vendor account created!", { description: "Welcome to RentFlow Vendor Portal." });
      navigate("/admin", { replace: true });
    } catch (error) {
      toast.error("Registration failed", { description: error.message });
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl space-y-8 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-600 shadow-md">
                <Package className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                Rent<span className="text-fuchsia-600">Flow</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Vendor Sign-up Page</h1>
            <p className="text-sm text-slate-500">
              Partner with us to list your products for rent.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Left Column */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input id="firstName" placeholder="First Name" className="pl-10" {...register("firstName")} />
                  </div>
                  {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="companyName">Company Name</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input id="companyName" placeholder="Company Name" className="pl-10" {...register("companyName")} />
                  </div>
                  {errors.companyName && <p className="text-xs text-red-500">{errors.companyName.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="productCategory">Product Category</Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <select
                      id="productCategory"
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm"
                      {...register("productCategory")}
                    >
                      <option value="">Select Category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Vehicles">Vehicles</option>
                      <option value="Heavy Equipment">Heavy Equipment</option>
                      <option value="Event Supplies">Event Supplies</option>
                    </select>
                  </div>
                  <p className="text-[10px] text-slate-400">Necessary during creation of sale order and invoices</p>
                  {errors.productCategory && <p className="text-xs text-red-500">{errors.productCategory.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="gstNo">GST no</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input id="gstNo" placeholder="GST Number" className="pl-10" {...register("gstNo")} />
                  </div>
                  {errors.gstNo && <p className="text-xs text-red-500">{errors.gstNo.message}</p>}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input id="lastName" placeholder="Last Name" className="pl-10" {...register("lastName")} />
                  </div>
                  {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email ID</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input id="email" type="email" placeholder="Email ID" className="pl-10" {...register("email")} />
                  </div>
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="pl-10 pr-10"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="pl-10"
                      {...register("confirmPassword")}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                </div>
              </div>

            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full bg-fuchsia-500 hover:bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/30" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-slate-500">
            Already have a vendor account?{" "}
            <Link to="/login" className="font-semibold text-fuchsia-600 hover:text-fuchsia-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
