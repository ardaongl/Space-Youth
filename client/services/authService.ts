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
    // Mock user data - since we don't have real backend
    const token = localStorage.getItem("token");
    
    if (!token) {
      throw new Error("No token found");
    }

    // Extract role from token (dev-token-student, dev-token-teacher, etc.)
    const role = token.replace("dev-token-", "") as "student" | "teacher" | "admin";
    
    const mockUsers = {
      student: {
        id: "student-1",
        name: "Ahmet Öğrenci",
        email: "student@test.com",
        role: "student" as const,
      },
      teacher: {
        id: "teacher-1", 
        name: "Ayşe Öğretmen",
        email: "teacher@test.com",
        role: "teacher" as const,
      },
      admin: {
        id: "admin-1",
        name: "Admin User", 
        email: "admin@test.com",
        role: "admin" as const,
      }
    };

    return mockUsers[role] || mockUsers.student;
  },
};
