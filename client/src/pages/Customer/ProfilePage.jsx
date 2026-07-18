import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { profileService } from "@/services/profileService";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInitials, formatDate, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { User, Mail, Phone, MapPin, Calendar, Save, Shield, Key } from "lucide-react";
import { rentals } from "@/data/mockData";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  companyLogo: z.string().optional(),
  gstNo: z.string().optional(),
});

const passwordSchema = z.object({
  oldPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      companyName: user?.companyName || "",
      companyLogo: user?.companyLogo || "",
      gstNo: user?.gstNo || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await updateProfile(data);
      toast.success("Profile updated!", { description: "Your changes have been saved." });
    } catch (error) {
      toast.error("Update failed", { description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const onSubmitPassword = async (data) => {
    setPasswordSaving(true);
    try {
      await profileService.changePassword(data.oldPassword, data.newPassword);
      toast.success("Password updated!", { description: "Your password has been changed." });
      resetPassword();
    } catch (error) {
      toast.error("Change failed", { description: error.message });
    } finally {
      setPasswordSaving(false);
    }
  };

  const deposits = rentals.filter((r) => r.securityDeposit > 0);

  return (
    <div className="py-8">
      <div className="container-app max-w-4xl">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Profile" },
          ]}
          className="mb-6"
        />

        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="h-20 w-20 text-2xl">
            <AvatarFallback className="text-xl bg-primary-100 text-primary-700">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
            <p className="text-slate-500">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="default">{user?.role}</Badge>
              <span className="text-xs text-slate-400">
                Joined {formatDate(user?.joinedAt)}
              </span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="profile">Edit Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="history">Rental History</TabsTrigger>
            <TabsTrigger value="deposits">Security Deposits</TabsTrigger>
          </TabsList>

          {/* Edit Profile */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input id="name" className="pl-10" {...register("name")} />
                      </div>
                      {errors.name && <p className="text-sm text-danger-600">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input id="email" type="email" className="pl-10" {...register("email")} disabled />
                      </div>
                      {errors.email && <p className="text-sm text-danger-600">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input id="phone" className="pl-10" {...register("phone")} />
                      </div>
                    </div>
                  </div>

                  {(user?.role === "VENDOR" || user?.role === "ADMIN") && (
                    <>
                      <Separator />
                      <CardTitle className="text-lg mt-4">Company Details (Vendor)</CardTitle>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Company Name</Label>
                          <Input id="companyName" {...register("companyName")} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="companyLogo">Company Logo URL</Label>
                          <Input id="companyLogo" {...register("companyLogo")} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gstNo">GSTIN / Tax No</Label>
                          <Input id="gstNo" {...register("gstNo")} />
                        </div>
                      </div>
                    </>
                  )}

                  <Separator />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={!isDirty || saving}>
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword">Current Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input id="oldPassword" type="password" className="pl-10" {...registerPassword("oldPassword")} />
                    </div>
                    {passwordErrors.oldPassword && <p className="text-sm text-danger-600">{passwordErrors.oldPassword.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input id="newPassword" type="password" className="pl-10" {...registerPassword("newPassword")} />
                    </div>
                    {passwordErrors.newPassword && <p className="text-sm text-danger-600">{passwordErrors.newPassword.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input id="confirmPassword" type="password" className="pl-10" {...registerPassword("confirmPassword")} />
                    </div>
                    {passwordErrors.confirmPassword && <p className="text-sm text-danger-600">{passwordErrors.confirmPassword.message}</p>}
                  </div>
                  <Separator />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={passwordSaving}>
                      <Shield className="h-4 w-4 mr-2" />
                      {passwordSaving ? "Changing..." : "Change Password"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rental History */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Rental History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rentals.map((rental) => (
                    <div
                      key={rental.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-slate-50"
                    >
                      <img
                        src={rental.product?.image}
                        alt={rental.product?.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {rental.product?.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Calendar className="h-3 w-3" />
                          {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-primary-600">
                          {formatCurrency(rental.totalAmount)}
                        </p>
                        <Badge
                          variant={
                            rental.status === "completed" ? "secondary" :
                            rental.status === "overdue" ? "danger" : "success"
                          }
                          className="text-xs mt-1"
                        >
                          {rental.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Deposits */}
          <TabsContent value="deposits">
            <Card>
              <CardHeader>
                <CardTitle>Security Deposits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deposits.map((rental) => (
                    <div
                      key={rental.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-slate-50"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                        <Shield className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">
                          {rental.product?.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          Rental #{rental.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">
                          {formatCurrency(rental.securityDeposit)}
                        </p>
                        <Badge
                          variant={rental.depositRefunded ? "success" : "warning"}
                          className="text-xs mt-1"
                        >
                          {rental.depositRefunded ? "Refunded" : "Held"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
