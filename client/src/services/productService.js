import { products, categories } from "@/data/mockData";

const MOCK_DELAY = 300;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const productService = {
  async getProducts(filters = {}) {
    await delay(MOCK_DELAY);

    let filtered = [...products];

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search)
      );
    }

    // Category filter
    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === filters.category.toLowerCase() ||
               p.categoryId === filters.category
      );
    }

    // Availability filter
    if (filters.available) {
      filtered = filtered.filter((p) => p.availableQuantity > 0);
    }

    // Sort
    if (filters.sort === "price-low") {
      filtered.sort((a, b) => a.dailyRate - b.dailyRate);
    } else if (filters.sort === "price-high") {
      filtered.sort((a, b) => b.dailyRate - a.dailyRate);
    } else if (filters.sort === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 9;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedProducts = filtered.slice(start, start + limit);

    return {
      products: paginatedProducts,
      total,
      page,
      totalPages,
    };
  },

  async getProductById(id) {
    await delay(MOCK_DELAY);

    const product = products.find((p) => p.id === id);
    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  },

  async getCategories() {
    await delay(200);
    return categories;
  },

  async getProductsByCategory(slug) {
    await delay(MOCK_DELAY);

    const category = categories.find((c) => c.slug === slug);
    if (!category) {
      throw new Error("Category not found");
    }

    const categoryProducts = products.filter((p) => p.categoryId === category.id);
    return { category, products: categoryProducts };
  },
};
