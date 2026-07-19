import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function PageHeader({ title, subtitle, breadcrumbs = [], action }) {
  const { user } = useAuth();
  const roleName = user?.role?.toUpperCase() === "VENDOR" ? "Vendor" : "Admin";
  
  const displayBreadcrumbs = breadcrumbs.map(crumb => 
    crumb === "Admin" ? roleName : crumb
  );
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-8"
    >
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500 mb-3">
          {displayBreadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
              <span className={i === displayBreadcrumbs.length - 1 ? "text-slate-700 dark:text-slate-300 font-medium" : "hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer transition-colors"}>
                {crumb}
              </span>
            </span>
          ))}
        </nav>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </motion.div>
  );
}
