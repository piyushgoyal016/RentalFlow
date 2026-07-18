import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Eye } from "lucide-react";

function ProductCard({ product, viewMode = "grid" }) {
  const statusVariant =
    product.availableQuantity > 0 ? "success" : "danger";
  const statusText =
    product.availableQuantity > 0 ? "Available" : "Out of Stock";

  if (viewMode === "list") {
    return (
      <Link
        to={`/products/${product.id}`}
        className="group flex gap-6 rounded-xl border border-slate-100 bg-white p-4 hover:shadow-lg hover:border-slate-200 transition-all duration-300"
      >
        <div className="w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
              <Badge variant={statusVariant} className="text-xs">
                {statusText}
              </Badge>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">
              {product.description}
            </p>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-lg font-bold text-primary-600">
                {formatCurrency(product.dailyRate)}
              </span>
              <span className="text-sm text-slate-400">/day</span>
            </div>
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4" />
              View Details
            </Button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/products/${product.id}`}
      className="group rounded-xl border border-slate-100 bg-white overflow-hidden hover:shadow-lg hover:border-slate-200 transition-all duration-300 hover-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={statusVariant}>{statusText}</Badge>
        </div>
      </div>
      <div className="p-5">
        <Badge variant="secondary" className="text-xs mb-2">
          {product.category}
        </Badge>
        <h3 className="text-base font-semibold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <div>
            <span className="text-lg font-bold text-primary-600">
              {formatCurrency(product.dailyRate)}
            </span>
            <span className="text-sm text-slate-400">/day</span>
          </div>
          <span className="text-xs text-slate-400">
            {product.availableQuantity} left
          </span>
        </div>
      </div>
    </Link>
  );
}

export { ProductCard };
