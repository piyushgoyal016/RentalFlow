import { rentals } from "@/data/mockData";
import { generateId } from "@/lib/utils";

const MOCK_DELAY = 400;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Keep a mutable copy for mock create
let mockRentals = [...rentals];

export const rentalService = {
  async getMyRentals(filters = {}) {
    await delay(MOCK_DELAY);

    let filtered = [...mockRentals];

    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter((r) => r.status === filters.status);
    }

    // Sort by created date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return filtered;
  },

  async getRentalById(id) {
    await delay(MOCK_DELAY);

    const rental = mockRentals.find((r) => r.id === id);
    if (!rental) {
      throw new Error("Rental not found");
    }

    return rental;
  },

  async createRental(data) {
    await delay(600);

    const rental = {
      id: "rental-" + generateId(),
      userId: "user-1",
      product: data.product,
      startDate: data.startDate,
      endDate: data.endDate,
      duration: data.duration,
      dailyRate: data.product.dailyRate,
      totalAmount: data.product.dailyRate * data.duration,
      securityDeposit: data.product.securityDeposit,
      status: "confirmed",
      paymentStatus: "paid",
      createdAt: new Date().toISOString(),
    };

    mockRentals.unshift(rental);

    return rental;
  },
};
