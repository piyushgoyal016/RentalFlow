import api from "./api";

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const getDashboardStats = () => api.get("/dashboard");

// ─── Customers (Users) ────────────────────────────────────────────────────────
export const getCustomers = (params) => api.get("/users", { params });
export const getCustomer  = (id)     => api.get(`/users/${id}`);
export const updateCustomer = (id, data) => api.put(`/users/${id}`, data);
export const deleteCustomer = (id)   => api.delete(`/users/${id}`);

// ─── Categories ───────────────────────────────────────────────────────────────
export const getCategories    = (params) => api.get("/categories", { params });
export const getCategory      = (id)     => api.get(`/categories/${id}`);
export const createCategory   = (data)   => api.post("/categories", data);
export const updateCategory   = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory   = (id)     => api.delete(`/categories/${id}`);

// ─── Products ─────────────────────────────────────────────────────────────────
export const getProducts    = (params) => api.get("/products", { params });
export const getProduct     = (id)     => api.get(`/products/${id}`);
export const createProduct  = (data)   => api.post("/products", data);
export const updateProduct  = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct  = (id)     => api.delete(`/products/${id}`);

// ─── Rentals ──────────────────────────────────────────────────────────────────
export const getRentals       = (params) => api.get("/rentals", { params });
export const getRental        = (id)     => api.get(`/rentals/${id}`);
export const createRental     = (data)   => api.post("/rentals", data);
export const updateRentalStatus = (id, status) => api.patch(`/rentals/${id}/status`, { status });
export const cancelRental     = (id)     => api.patch(`/rentals/${id}/cancel`);

// ─── Returns ──────────────────────────────────────────────────────────────────
export const getReturns    = (params) => api.get("/returns", { params });
export const getReturn     = (id)     => api.get(`/returns/${id}`);
export const processReturn = (id, data) => api.post(`/returns/${id}`, data);

// ─── Payments ─────────────────────────────────────────────────────────────────
export const getPayments   = (params) => api.get("/payments", { params });
export const getPayment    = (id)     => api.get(`/payments/${id}`);
export const updatePayment = (id, data) => api.put(`/payments/${id}`, data);
export const refundPayment = (id)    => api.post(`/payments/${id}/refund`);

// ─── Deposits ─────────────────────────────────────────────────────────────────
export const getDeposits   = (params) => api.get("/deposits", { params });
export const getDeposit    = (id)     => api.get(`/deposits/${id}`);
export const refundDeposit = (id, data) => api.post(`/deposits/${id}/refund`, data);

// ─── Late Fees ────────────────────────────────────────────────────────────────
export const getLateFees  = (params) => api.get("/late-fees", { params });
export const markLateFee  = (id)     => api.patch(`/late-fees/${id}/paid`);

// ─── Reports ──────────────────────────────────────────────────────────────────
export const getRevenue        = (params) => api.get("/reports/revenue",   { params });
export const getInventoryReport = (params) => api.get("/reports/inventory", { params });
export const getCustomerReport  = (params) => api.get("/reports/customers", { params });
export const getRentalReport    = (params) => api.get("/reports/rentals",   { params });
export const getLateReturns     = (params) => api.get("/reports/late-returns", { params });

// ─── Notifications ────────────────────────────────────────────────────────────
export const getNotifications = (params) => api.get("/notifications", { params });
export const markNotificationRead = (id)  => api.patch(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.patch("/notifications/read-all");

// ─── Mock Data Helpers (for charts / hackathon demo) ─────────────────────────
export const getMockRevenueData = () => [
  { month: "Jan", revenue: 42000, rentals: 38 },
  { month: "Feb", revenue: 38000, rentals: 34 },
  { month: "Mar", revenue: 51000, rentals: 47 },
  { month: "Apr", revenue: 47000, rentals: 43 },
  { month: "May", revenue: 63000, rentals: 58 },
  { month: "Jun", revenue: 58000, rentals: 53 },
  { month: "Jul", revenue: 72000, rentals: 67 },
  { month: "Aug", revenue: 69000, rentals: 62 },
  { month: "Sep", revenue: 78000, rentals: 71 },
  { month: "Oct", revenue: 84000, rentals: 76 },
  { month: "Nov", revenue: 91000, rentals: 83 },
  { month: "Dec", revenue: 96000, rentals: 89 },
];

export const getMockCategoryData = () => [
  { name: "Electronics",    value: 35, color: "#2563eb" },
  { name: "Furniture",      value: 25, color: "#7c3aed" },
  { name: "Vehicles",       value: 20, color: "#0891b2" },
  { name: "Tools",          value: 12, color: "#059669" },
  { name: "Party Supplies", value: 8,  color: "#d97706" },
];

export const getMockTopProducts = () => [
  { name: "Canon EOS R5",       rentals: 47, revenue: 14100, rating: 4.9 },
  { name: "DJI Mavic Pro 3",    rentals: 38, revenue: 9500,  rating: 4.8 },
  { name: "Sony A7 IV",         rentals: 35, revenue: 8750,  rating: 4.7 },
  { name: "Tent 6-Person",      rentals: 31, revenue: 4650,  rating: 4.6 },
  { name: "Power Washer Pro",   rentals: 28, revenue: 5600,  rating: 4.5 },
];

export const getMockActivityTimeline = () => [
  { id: 1, type: "rental",  message: "New rental created for John Smith",   time: "2 min ago",  color: "blue"  },
  { id: 2, type: "payment", message: "Payment received – ₹4,500",           time: "18 min ago", color: "green" },
  { id: 3, type: "return",  message: "Canon EOS R5 returned – no damage",   time: "1 hr ago",   color: "green" },
  { id: 4, type: "overdue", message: "Rental #R-2041 is 2 days overdue",    time: "3 hrs ago",  color: "red"   },
  { id: 5, type: "deposit", message: "Deposit refunded to Alice Johnson",    time: "5 hrs ago",  color: "green" },
  { id: 6, type: "rental",  message: "Rental #R-2048 starts tomorrow",      time: "6 hrs ago",  color: "blue"  },
];
