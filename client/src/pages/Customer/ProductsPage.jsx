import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productService } from "@/services/productService";
import { SearchBar } from "@/components/common/SearchBar";
import { FilterSidebar } from "@/components/customer/FilterSidebar";
import { ProductCard } from "@/components/customer/ProductCard";
import { Pagination } from "@/components/ui/pagination";
import { PageLoader } from "@/components/common/Loader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { LayoutGrid, List, SlidersHorizontal, X, Package } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    sort: "name",
    available: false,
  });

  useEffect(() => {
    fetchProducts();
  }, [currentPage, search, filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const result = await productService.getProducts({
        page: currentPage,
        limit: 9,
        search,
        ...filters,
      });
      setProducts(result.products);
      setTotalPages(result.totalPages);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const activeFilterCount = [
    filters.category !== "all",
    filters.available,
  ].filter(Boolean).length;

  return (
    <div className="py-8">
      <div className="container-app">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Products" },
          ]}
          className="mb-6"
        />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Products</h1>
            <p className="text-slate-500 mt-1">
              Browse our collection of rental products
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SearchBar
              value={search}
              onChange={setSearch}
              onSearch={handleSearch}
              className="w-64"
            />
            <Button
              variant="outline"
              className="lg:hidden relative"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="default" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            <div className="hidden sm:flex items-center border border-slate-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary-100 text-primary-700"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-primary-100 text-primary-700"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside
            className={`${
              showFilters ? "fixed inset-0 z-50 bg-black/50 lg:relative lg:bg-transparent" : "hidden"
            } lg:block lg:w-64 flex-shrink-0`}
          >
            <div
              className={`${
                showFilters
                  ? "absolute right-0 top-0 h-full w-80 bg-white p-6 shadow-xl lg:relative lg:w-auto lg:shadow-none lg:p-0"
                  : ""
              }`}
            >
              {showFilters && (
                <div className="flex justify-between items-center mb-6 lg:hidden">
                  <h3 className="font-semibold text-slate-900">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="h-5 w-5 text-slate-400" />
                  </button>
                </div>
              )}
              <FilterSidebar
                filters={filters}
                onFilterChange={(f) => {
                  handleFilterChange(f);
                  setShowFilters(false);
                }}
              />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <PageLoader />
            ) : products.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No products found"
                description="Try adjusting your search or filters to find what you're looking for."
                actionLabel="Clear Filters"
                onAction={() => {
                  setSearch("");
                  setFilters({ category: "all", sort: "name", available: false });
                }}
              />
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "flex flex-col gap-4"
                  }
                >
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  className="mt-8"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
