import api from "./api";

export const rentalService = {
  async getMyRentals(filters = {}) {
    try {
      const response = await api.get("/rentals/my");
      if (response.data?.success) {
        const rawList = Array.isArray(response.data.data) ? response.data.data : (response.data.data.data || []);
        if (rawList.length > 0) {
          // Map database response to view model format
          let list = rawList.map(r => ({
          id: r.id,
          product: {
            id: r.items?.[0]?.product?.id,
            name: r.items?.[0]?.product?.name || "Product",
            image: r.items?.[0]?.product?.variants?.[0]?.imageUrl || r.items?.[0]?.product?.images?.[0]?.url || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80",
            dailyRate: r.items?.[0]?.pricePerDay || r.totalCost,
            securityDeposit: r.depositAmount || 0,
          },
          startDate: r.pickupDate,
          endDate: r.returnDate,
          duration: Math.ceil((new Date(r.returnDate) - new Date(r.pickupDate)) / (1000 * 60 * 60 * 24)) || 1,
          totalAmount: r.totalCost,
          securityDeposit: r.depositAmount || 0,
          status: r.status.toLowerCase(),
          paymentStatus: r.payment?.status?.toLowerCase() || "pending",
          createdAt: r.createdAt,
        }));

        // Apply status filter on the loaded database list
        if (filters.status && filters.status !== "all") {
          const fs = filters.status.toLowerCase();
          if (fs === "active" || fs === "confirmed") {
            // Group all active/ongoing states
            list = list.filter(r => 
              r.status === "active" || 
              r.status === "confirmed" || 
              r.status === "reserved" || 
              r.status === "booked" || 
              r.status === "picked_up"
            );
          } else {
            list = list.filter(r => r.status === fs);
          }
        }
        return list;
        }
      }
      return [];
    } catch (err) {
      console.error("Backend getMyRentals failed:", err);
      return [];
    }
  },

  async getRentalById(id) {
    try {
      const response = await api.get(`/rentals/${id}`);
      if (response.data?.success) {
        const r = response.data.data;
        return {
          id: r.id,
          product: {
            id: r.items?.[0]?.product?.id,
            name: r.items?.[0]?.product?.name || "Product",
            image: r.items?.[0]?.product?.variants?.[0]?.imageUrl || r.items?.[0]?.product?.images?.[0]?.url || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80",
            dailyRate: r.items?.[0]?.pricePerDay || r.totalCost,
            securityDeposit: r.depositAmount || 0,
          },
          startDate: r.pickupDate,
          endDate: r.returnDate,
          duration: Math.ceil((new Date(r.returnDate) - new Date(r.pickupDate)) / (1000 * 60 * 60 * 24)) || 1,
          totalAmount: r.totalCost,
          securityDeposit: r.depositAmount || 0,
          status: r.status.toLowerCase(),
          paymentStatus: r.payment?.status?.toLowerCase() || "pending",
          createdAt: r.createdAt,
        };
      }
    } catch (err) {
      console.error("Backend getRentalById failed:", err);
      throw new Error(err.response?.data?.message || "Rental not found");
    }
  },

  async createRental(data) {
    try {
      const response = await api.post("/rentals", data);
      if (response.data?.success) {
        const r = response.data.data;
        return {
          id: r.id,
          status: r.status.toLowerCase(),
          createdAt: r.createdAt,
        };
      }
    } catch (err) {
      console.error("Backend createRental failed:", err);
      throw new Error(err.response?.data?.message || "Failed to create rental");
    }
  },
};
export default rentalService;
