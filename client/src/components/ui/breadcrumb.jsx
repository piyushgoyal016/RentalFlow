import * as React from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

function Breadcrumb({ items, className }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center", className)}>
      <ol className="flex items-center gap-1.5 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            {index > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
            )}
            {item.href && index < items.length - 1 ? (
              <Link
                to={item.href}
                className="text-slate-500 hover:text-primary-600 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  index === items.length - 1
                    ? "text-slate-900 font-medium"
                    : "text-slate-500"
                )}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export { Breadcrumb };
