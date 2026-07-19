import { useState, useEffect } from "react";
import { notificationService } from "@/services/notificationService";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDate } from "@/lib/utils";
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CreditCard,
  FileText,
  CheckCheck,
} from "lucide-react";

const iconMap = {
  rental_confirmation: { icon: CheckCircle2, color: "text-success-600 bg-success-50" },
  return_reminder: { icon: Clock, color: "text-warning-600 bg-warning-50" },
  late_return: { icon: AlertTriangle, color: "text-danger-600 bg-danger-50" },
  deposit_refund: { icon: CreditCard, color: "text-primary-600 bg-primary-50" },
  invoice: { icon: FileText, color: "text-accent-600 bg-accent-50" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getMyNotifications();
        setNotifications(data || []);
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: !n.read } : n
      )
    );
  };

  return (
    <div className="py-8">
      <div className="container-app max-w-3xl">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Notifications" },
          ]}
          className="mb-6"
        />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
            <p className="text-slate-500 mt-1">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            description="You're all caught up! Check back later for updates."
          />
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => {
              const config = iconMap[notif.type] || iconMap.rental_confirmation;
              const Icon = config.icon;

              return (
                <button
                  key={notif.id}
                  onClick={() => toggleRead(notif.id)}
                  className={`w-full flex gap-4 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    notif.read
                      ? "border-slate-100 bg-white hover:bg-slate-50"
                      : "border-primary-100 bg-primary-50/30 hover:bg-primary-50/50"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0 ${config.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-sm font-semibold ${
                          notif.read ? "text-slate-700" : "text-slate-900"
                        }`}
                      >
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <div className="h-2 w-2 rounded-full bg-primary-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">
                      {notif.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatDate(notif.createdAt)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
