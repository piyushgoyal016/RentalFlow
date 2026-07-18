import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function Loader({ className, size = "default", text }) {
  const sizes = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 className={cn("animate-spin text-primary-600", sizes[size])} />
      {text && <p className="text-sm text-slate-500">{text}</p>}
    </div>
  );
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader size="lg" text="Loading..." />
    </div>
  );
}

export { Loader, PageLoader };
