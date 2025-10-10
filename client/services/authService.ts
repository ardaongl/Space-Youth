import { api } from "./api";
import { User } from "@/store/slices/userSlice";

export const authService = {
  getToken: (): string | null => {
    return localStorage.getItem("token");
  },

  setToken: (token: string): void => {
    localStorage.setItem("token", token);
  },

  removeToken: (): void => {
    localStorage.removeItem("token");
  },

  fetchMe: async (): Promise<User> => {
    const response = await api.get("/api/user", {
      requiresAuth: true,
      validateStatus: (s) => s < 500,
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch user data");
    }

    return response.data;
  },
};
