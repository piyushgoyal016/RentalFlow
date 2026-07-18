import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SearchX, Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex h-24 w-24 mx-auto items-center justify-center rounded-3xl bg-primary-50">
          <SearchX className="h-12 w-12 text-primary-500" />
        </div>
        <div>
          <h1 className="text-7xl font-black gradient-text mb-2">404</h1>
          <h2 className="text-2xl font-bold text-slate-900">Page not found</h2>
          <p className="mt-2 text-slate-500">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link to="/">
            <Button>
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
