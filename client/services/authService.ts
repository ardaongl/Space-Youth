import { api } from "./index";
import { User } from "@/store/slices/userSlice";

// Mock users data
const MOCK_USERS = {
    "student@test.com": {
        id: "student-1",
        name: "Ahmet Öğrenci",
        email: "student@test.com",
        role: "student" as const,
    },
    "teacher@test.com": {
        id: "teacher-1", 
        name: "Ayşe Öğretmen",
        email: "teacher@test.com",
        role: "teacher" as const,
    },
    "admin@test.com": {
        id: "admin-1",
        name: "Admin User", 
        email: "admin@test.com",
        role: "admin" as const,
    }
};

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
    // Mock user data - extract from stored token
    const token = localStorage.getItem("token");
    
    if (!token) {
      throw new Error("No token found");
    }

    // Extract user ID from mock token
    const userIdMatch = token.match(/mock-token-(\d+)-/);
    if (!userIdMatch) {
      throw new Error("Invalid token format");
    }

    const userId = parseInt(userIdMatch[1]);
    
    // Map user ID to mock user
    const userMap: { [key: number]: User } = {
      1: MOCK_USERS["student@test.com"],
      2: MOCK_USERS["teacher@test.com"], 
      3: MOCK_USERS["admin@test.com"]
    };

    const user = userMap[userId];
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
};
