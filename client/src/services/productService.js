import api from "./api";

export const productService = {
  async getProducts(filters = {}) {
    try {
      const response = await api.get("/products");
      let list = [];
      const rawList = response.data.data?.data || (Array.isArray(response.data.data) ? response.data.data : []);

      if (response.data?.success && rawList.length > 0) {
        list = rawList
          .filter(p => p.category?.name !== "Services" && p.name !== "Late Fees" && p.name !== "Security Deposit")
          .map(p => ({
            id: p.id,
            name: p.name,
            category: p.category?.name || "Uncategorized",
            categoryId: p.categoryId,
            description: p.description || "",
            dailyRate: p.rentalPricePerDay,
            securityDeposit: p.depositAmount,
            availableQuantity: p.stockQuantity,
            image: p.variants?.[0]?.imageUrl || p.images?.[0]?.url || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80",
            rating: 4.8,
            brand: p.brand || (p.vendor ? p.vendor.companyName : "RentFlow"),
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
      console.error("Backend products fetch failed:", err);
      return { products: [], total: 0, page: 1, totalPages: 1 };
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
          image: p.variants?.[0]?.imageUrl || p.images?.[0]?.url || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80",
          rating: 4.8,
        };
      }
      throw new Error("Product not found");
    } catch (err) {
      console.error("Backend getProductById failed:", err);
      throw err;
    }
  },

  async getCategories() {
    try {
      const response = await api.get("/categories");
      if (response.data?.success && response.data.data.length > 0) {
        return response.data.data;
      }
    } catch (err) {
      console.error("Backend categories fetch failed:", err);
      return [];
    }
  },

  async getProductsByCategory(slug) {
    try {
      const response = await api.get(`/categories`);
      if (response.data?.success) {
        const cat = response.data.data.find(c => c.name.toLowerCase() === slug.toLowerCase() || c.id === slug);
        if (cat) {
          const resProd = await api.get("/products");
          const rawList = resProd.data.data?.data || (Array.isArray(resProd.data.data) ? resProd.data.data : []);
          const catProducts = rawList.filter(p => p.categoryId === cat.id);
          return { category: cat, products: catProducts };
        }
      }
      throw new Error("Category not found");
    } catch (err) {
      console.error("Backend getProductsByCategory failed:", err);
      throw err;
    }
  },
};
