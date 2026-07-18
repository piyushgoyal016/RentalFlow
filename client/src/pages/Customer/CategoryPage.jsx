import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { productService } from "@/services/productService";
import { ProductCard } from "@/components/customer/ProductCard";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageLoader } from "@/components/common/Loader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Package } from "lucide-react";

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoryProducts();
  }, [slug]);

  const fetchCategoryProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProductsByCategory(slug);
      setCategory(data.category);
      setProducts(data.products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;
  if (error) return <ErrorState title="Category not found" description={error} />;

  return (
    <div className="py-8">
      <div className="container-app">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: category?.name || slug },
          ]}
          className="mb-6"
        />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">{category?.name}</h1>
          <p className="text-slate-500 mt-1">{category?.description}</p>
        </div>

        {products.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No products in this category"
            description="Check back later for new additions."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
