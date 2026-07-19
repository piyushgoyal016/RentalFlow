import api from "./api";

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const getDashboardStats = () => api.get("/dashboard");

// ─── Customers (Users) ────────────────────────────────────────────────────────
export const getCustomers = (params) => api.get("/users", { params });
export const getCustomer  = (id)     => api.get(`/users/${id}`);
export const createCustomer = (data) => api.post("/users", data);
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
export const getInventoryReport = (params) => api.get("/reports/products", { params });
export const getCustomerReport  = (params) => api.get("/reports/customers", { params });
export const getRentalReport    = (params) => api.get("/reports/rentals",   { params });
export const getLateReturns     = (params) => api.get("/reports/late-returns", { params });

// ─── Notifications ────────────────────────────────────────────────────────────
export const getNotifications = (params) => api.get("/notifications", { params });
export const markNotificationRead = (id)  => api.patch(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.patch("/notifications/read-all");

// ─── Mock Data Helpers Removed ─────────────────────────
