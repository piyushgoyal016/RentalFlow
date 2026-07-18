import { Toaster as SonnerToaster } from "sonner";

function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          fontFamily: "'Inter', sans-serif",
        },
        classNames: {
          toast:
            "group border border-slate-200 bg-white shadow-lg rounded-xl",
          title: "text-slate-900 font-semibold text-sm",
          description: "text-slate-500 text-sm",
          actionButton:
            "bg-primary-600 text-white rounded-lg px-3 py-1.5 text-sm font-medium",
          cancelButton:
            "bg-slate-100 text-slate-700 rounded-lg px-3 py-1.5 text-sm font-medium",
          success: "border-success-200",
          error: "border-danger-200",
          warning: "border-warning-200",
        },
      }}
      richColors
      closeButton
    />
  );
}

export { Toaster };
