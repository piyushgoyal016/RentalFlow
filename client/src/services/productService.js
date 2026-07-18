import api from "./api";
import { products as mockProducts, categories as mockCategories } from "@/data/mockData";

export const productService = {
  async getProducts(filters = {}) {
    try {
      const response = await api.get("/products");
      let list = [];

      if (response.data?.success && response.data.data.length > 0) {
        list = response.data.data.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category?.name || "Uncategorized",
          categoryId: p.categoryId,
          description: p.description || "",
          dailyRate: p.rentalPricePerDay,
          securityDeposit: p.depositAmount,
          availableQuantity: p.stockQuantity,
          image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80",
          rating: 4.8,
        }));
      } else {
        // Fallback to mock products if database is empty (so the UI looks premium)
        list = mockProducts.map(p => ({
          ...p,
          dailyRate: p.dailyRate || p.rentalPricePerDay,
          securityDeposit: p.securityDeposit || p.depositAmount,
          availableQuantity: p.availableQuantity || p.stockQuantity,
        }));
      }

      // Apply search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(search) ||
            p.description.toLowerCase().includes(search) ||
            p.category.toLowerCase().includes(search)
        );
      }

      // Category filter
      if (filters.category && filters.category !== "all") {
        list = list.filter(
          (p) => p.category.toLowerCase() === filters.category.toLowerCase() ||
                 p.categoryId === filters.category
        );
      }

      // Sort
      if (filters.sort === "price-low") {
        list.sort((a, b) => a.dailyRate - b.dailyRate);
      } else if (filters.sort === "price-high") {
        list.sort((a, b) => b.dailyRate - a.dailyRate);
      } else if (filters.sort === "name") {
        list.sort((a, b) => a.name.localeCompare(b.name));
      }

      // Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 9;
      const total = list.length;
      const totalPages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const paginatedProducts = list.slice(start, start + limit);

      return {
        products: paginatedProducts,
        total,
        page,
        totalPages,
      };
    } catch (err) {
      console.warn("Backend products fetch failed, using fallback:", err);
      // Fallback
      return {
        products: mockProducts.slice(0, 9),
        total: mockProducts.length,
        page: 1,
        totalPages: Math.ceil(mockProducts.length / 9),
      };
    }
  },

  async getProductById(id) {
    try {
      const response = await api.get(`/products/${id}`);
      if (response.data?.success) {
        const p = response.data.data;
        return {
          id: p.id,
          name: p.name,
          category: p.category?.name || "Uncategorized",
          categoryId: p.categoryId,
          description: p.description || "",
          dailyRate: p.rentalPricePerDay,
          securityDeposit: p.depositAmount,
          availableQuantity: p.stockQuantity,
          image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80",
          rating: 4.8,
        };
      }
    } catch (err) {
      console.warn("Backend getProductById failed, using mock:", err);
    }
    const product = mockProducts.find((p) => p.id === id);
    if (!product) throw new Error("Product not found");
    return product;
  },

  async getCategories() {
    try {
      const response = await api.get("/categories");
      if (response.data?.success && response.data.data.length > 0) {
        return response.data.data;
      }
    } catch (err) {
      console.warn("Backend categories fetch failed:", err);
    }
    return mockCategories;
  },

  async getProductsByCategory(slug) {
    try {
      const response = await api.get(`/categories`);
      if (response.data?.success) {
        const cat = response.data.data.find(c => c.name.toLowerCase() === slug.toLowerCase() || c.id === slug);
        if (cat) {
          const resProd = await api.get("/products");
          const catProducts = resProd.data.data.filter(p => p.categoryId === cat.id);
          return { category: cat, products: catProducts };
        }
      }
    } catch (err) {
      console.warn("Backend getProductsByCategory failed:", err);
    }
    // Fallback
    const category = mockCategories.find((c) => c.slug === slug);
    if (!category) throw new Error("Category not found");
    const categoryProducts = mockProducts.filter((p) => p.categoryId === category.id);
    return { category, products: categoryProducts };
  },
};
