import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store";
import { UserRole } from "@/utils/roles";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

/**
 * RoleProtectedRoute - Belirli roller için erişim kontrolü yapar
 * Örnek: allowedRoles={["admin"]} - sadece admin erişebilir
 * Örnek: allowedRoles={["admin", "teacher"]} - admin ve teacher erişebilir
 */
export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = "/",
}) => {
  const { token, user } = useAppSelector((state) => state.user);
  const location = useLocation();

  // Önce authentication kontrolü
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Sonra role kontrolü
  if (!allowedRoles.includes(user.role as UserRole)) {
    // Yetkisiz erişim - ana sayfaya yönlendir
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

