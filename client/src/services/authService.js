import api from "./api";

export const authService = {
  async login(email, password) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    try {
      const response = await api.post("/auth/login", { email, password });
      
      // The backend returns an ApiResponse wrapper: { success: true, data: { user, accessToken, refreshToken } }
      const apiResponse = response.data;
      if (!apiResponse?.success) {
        throw new Error(apiResponse?.message || "Invalid credentials");
      }

      const { user, accessToken, refreshToken } = apiResponse.data;
      
      // Store refreshToken for session / logout
      if (refreshToken) {
        localStorage.setItem("rentflow_refresh_token", refreshToken);
      }

      return {
        token: accessToken,
        user: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role?.name || "CUSTOMER",
          phone: user.phone || "",
          joinedAt: user.createdAt,
        }
      };
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Login failed";
      throw new Error(msg);
    }
  },

  async register(data) {
    const { name, email, password, phone, roleName = "CUSTOMER", companyName, gstNo, productCategory } = data;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Split name into first and last name
    const nameParts = (name || "").trim().split(" ");
    const firstName = data.firstName || nameParts[0] || "User";
    const lastName = data.lastName || nameParts.slice(1).join(" ") || "Member";

    try {
      const response = await api.post("/auth/register", {
        firstName,
        lastName,
        email,
        password,
        phone: phone || "",
        companyName,
        gstNo,
        productCategory,
        roleName: roleName.toUpperCase(),
      });

      const apiResponse = response.data;
      if (!apiResponse?.success) {
        throw new Error(apiResponse?.message || "Registration failed");
      }

      const { user, accessToken, refreshToken } = apiResponse.data;
      
      if (refreshToken) {
        localStorage.setItem("rentflow_refresh_token", refreshToken);
      }

      return {
        token: accessToken,
        user: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role?.name || "CUSTOMER",
          phone: user.phone || "",
          joinedAt: user.createdAt,
        }
      };
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Registration failed";
      throw new Error(msg);
    }
  },

  async logout() {
    try {
      const refreshToken = localStorage.getItem("rentflow_refresh_token");
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (error) {
      console.warn("API logout failed:", error);
    } finally {
      localStorage.removeItem("rentflow_refresh_token");
    }
    return { message: "Logged out successfully" };
  },

  async forgotPassword(email) {
    if (!email) {
      throw new Error("Email is required");
    }
    // Simulate forgot password call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { message: "Password reset link sent to your email" };
  },
};
