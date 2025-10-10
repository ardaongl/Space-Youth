export type UserRole = "student" | "teacher" | "admin";

export const canSeeAddCourse = (role?: UserRole | null): boolean => {
  return role === "teacher" || role === "admin";
};

export const isAdmin = (role?: UserRole | null): boolean => {
  return role === "admin";
};

export const isTeacher = (role?: UserRole | null): boolean => {
  return role === "teacher";
};

export const isStudent = (role?: UserRole | null): boolean => {
  return role === "student";
};
