import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { productService } from "@/services/productService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { PageLoader } from "@/components/common/Loader";
import { ErrorState } from "@/components/common/ErrorState";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Shield, Clock, Package, Star, CheckCircle2 } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRentClick = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/products/${id}` } } });
      return;
    }
    
    // Add to cart in localStorage
    try {
      const currentCart = JSON.parse(localStorage.getItem("rentflow_cart") || "[]");
      const existingItemIndex = currentCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        currentCart[existingItemIndex].cartQuantity = (currentCart[existingItemIndex].cartQuantity || 1) + 1;
      } else {
        currentCart.push({ ...product, cartQuantity: 1 });
      }
      
      localStorage.setItem("rentflow_cart", JSON.stringify(currentCart));
      window.dispatchEvent(new Event("cart-updated"));
    } catch (e) {
      console.error("Failed to add to cart", e);
    }
    
    // Navigate to the improved checkout funnel
    navigate("/cart");
  };

  if (loading) return <PageLoader />;
  if (error) return <ErrorState title="Product not found" description={error} onRetry={fetchProduct} />;
  if (!product) return null;

  const isAvailable = product.availableQuantity > 0;

  return (
    <div className="py-8">
      <div className="container-app">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: product.name },
          ]}
          className="mb-6"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={product.images?.[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx
                        ? "border-primary-500"
                        : "border-transparent hover:border-slate-300"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                <Badge variant={isAvailable ? "success" : "danger"}>
                  {isAvailable ? "Available" : "Out of Stock"}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
              <p className="text-slate-500 mt-3 leading-relaxed">{product.description}</p>
            </div>

            <Separator />

            {/* Pricing */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-primary-50 text-center">
                <div className="text-2xl font-bold text-primary-700">
                  {formatCurrency(product.dailyRate)}
                </div>
                <div className="text-xs text-primary-600 mt-1">Per Day</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 text-center">
                <div className="text-2xl font-bold text-slate-700">
                  {formatCurrency(product.weeklyRate)}
                </div>
                <div className="text-xs text-slate-500 mt-1">Per Week</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 text-center">
                <div className="text-2xl font-bold text-slate-700">
                  {formatCurrency(product.monthlyRate)}
                </div>
                <div className="text-xs text-slate-500 mt-1">Per Month</div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, label: "Security Deposit", value: formatCurrency(product.securityDeposit) },
                { icon: Package, label: "Available Qty", value: `${product.availableQuantity} / ${product.totalQuantity}` },
                { icon: Star, label: "Condition", value: product.condition },
                { icon: Clock, label: "Brand", value: product.brand },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                  <item.icon className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-slate-400">{item.label}</div>
                    <div className="text-sm font-medium text-slate-700">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Includes */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">What&apos;s Included</h3>
              <div className="grid grid-cols-2 gap-2">
                {["Free Delivery", "Free Setup", "24/7 Support", "Insurance Coverage"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-success-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Button
              size="xl"
              className="w-full"
              disabled={!isAvailable}
              onClick={handleRentClick}
            >
              <ShoppingCart className="h-5 w-5" />
              {isAvailable ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
