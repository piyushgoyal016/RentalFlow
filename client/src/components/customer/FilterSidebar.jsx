import { useState, useEffect } from "react";
import { productService } from "@/services/productService";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function FilterSidebar({ filters, onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    productService.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (key, value) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const handleReset = () => {
    const reset = { category: "all", sort: "name", available: false };
    setLocalFilters(reset);
    onFilterChange(reset);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Filters</h3>
        <button
          onClick={handleReset}
          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
        >
          Reset all
        </button>
      </div>

      <Separator />

      {/* Category */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Category</Label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={localFilters.category === "all"}
              onChange={() => handleChange("category", "all")}
              className="text-primary-600 focus:ring-primary-500"
            />
            All Categories
          </label>
          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer"
            >
              <input
                type="radio"
                name="category"
                checked={localFilters.category === cat.id}
                onChange={() => handleChange("category", cat.id)}
                className="text-primary-600 focus:ring-primary-500"
              />
              {cat.name}
              <span className="text-xs text-slate-400 ml-auto">
                ({cat.productCount})
              </span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Sort */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Sort By</Label>
        <select
          value={localFilters.sort}
          onChange={(e) => handleChange("sort", e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="name">Name (A-Z)</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      <Separator />

      {/* Availability */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Availability</Label>
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={localFilters.available}
            onChange={(e) => handleChange("available", e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />
          Show available only
        </label>
      </div>
    </div>
  );
}

export { FilterSidebar };
