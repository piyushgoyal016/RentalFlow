import { mockUser } from "@/data/mockData";

// Mock auth service — replace with real API calls when backend is ready.

const MOCK_DELAY = 500;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const authService = {
  async login(email, password) {
    await delay(MOCK_DELAY);

    // Mock validation
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    if (password.length < 6) {
      throw new Error("Invalid credentials");
    }

    // Simulate successful login
    const token = "mock-jwt-token-" + Date.now();
    const user = { ...mockUser, email };

    return { token, user };
  },

  async register(data) {
    await delay(MOCK_DELAY);

    const { name, email, password, phone } = data;

    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    const token = "mock-jwt-token-" + Date.now();
    const user = {
      ...mockUser,
      id: "user-" + Date.now(),
      name,
      email,
      phone: phone || "",
      joinedAt: new Date().toISOString(),
    };

    return { token, user };
  },

  async logout() {
    await delay(200);
    return { message: "Logged out successfully" };
  },

  async forgotPassword(email) {
    await delay(MOCK_DELAY);

    if (!email) {
      throw new Error("Email is required");
    }

    return { message: "Password reset link sent to your email" };
  },
};
