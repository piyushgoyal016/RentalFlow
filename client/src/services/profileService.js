import api from "./api";

export const profileService = {
  async getProfile() {
    try {
      const response = await api.get("/auth/me");
      const apiResponse = response.data;
      if (!apiResponse?.success) {
        throw new Error(apiResponse?.message || "Failed to fetch profile");
      }
      const user = apiResponse.data.user;
      return {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role?.name || "CUSTOMER",
        phone: user.phone || "",
        joinedAt: user.createdAt,
      };
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Failed to fetch profile";
      throw new Error(msg);
    }
  },

  async updateProfile(data) {
    const nameParts = (data.name || "").trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const payload = {
      firstName,
      lastName,
      phone: data.phone || "",
    };

    try {
      const response = await api.put("/auth/me", payload);
      const apiResponse = response.data;
      if (!apiResponse?.success) {
        throw new Error(apiResponse?.message || "Failed to update profile");
      }
      const updatedUser = apiResponse.data.user;
      return {
        id: updatedUser.id,
        name: `${updatedUser.firstName} ${updatedUser.lastName}`,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role?.name || "CUSTOMER",
        phone: updatedUser.phone || "",
        joinedAt: updatedUser.createdAt,
      };
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Failed to update profile";
      throw new Error(msg);
    }
  },
};
