import { mockUser } from "@/data/mockData";

const MOCK_DELAY = 300;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let currentUser = { ...mockUser };

export const profileService = {
  async getProfile() {
    await delay(MOCK_DELAY);
    return { ...currentUser };
  },

  async updateProfile(data) {
    await delay(MOCK_DELAY);
    currentUser = { ...currentUser, ...data };
    return { ...currentUser };
  },
};
