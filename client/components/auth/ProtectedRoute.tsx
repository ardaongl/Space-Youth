import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute - Sadece giriş yapmış kullanıcıların erişebileceği route'lar için
 * Token ve user bilgisi kontrolü yapar
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token, user } = useAppSelector((state) => state.user);
  const location = useLocation();

  // Eğer token yoksa veya user yoksa login sayfasına yönlendir
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

