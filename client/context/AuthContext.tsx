import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setUser, setLoading, clearUser, setUserToken } from "@/store/slices/userSlice";
import { authService } from "@/services/authService";
import { UserRole } from "@/utils/roles";

export interface AuthState {
  status: "loading" | "authenticated" | "unauthenticated";
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  } | null;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
}

interface AuthContextType {
  auth: AuthState;
  refetchUser: () => Promise<void>;
  logout: () => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { token, user, isLoading } = useAppSelector((state) => state.user);

  const fetchUserData = async () => {
    const storedToken = authService.getToken();
    
    if (!storedToken) {
      // No token, clear user data
      dispatch(clearUser());
      return;
    }

    // Set token in Redux if not already set
    if (token !== storedToken) {
      dispatch(setUserToken(storedToken));
    }

    try {
      dispatch(setLoading(true));
      const userData = await authService.fetchMe();
      dispatch(setUser(userData));
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      // Clear user data on error
      dispatch(clearUser());
      authService.removeToken();
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = () => {
    dispatch(clearUser());
    authService.removeToken();
    
    // Clear onboarding data on logout
    try {
      localStorage.removeItem("onboarding.completed");
      localStorage.removeItem("onboarding.data");
    } catch {
      console.warn("Could not clear onboarding data");
    }
  };

  const refreshAuth = () => {
    // Force re-evaluation of auth state
    fetchUserData();
  };

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for token changes
  useEffect(() => {
    const handleStorageChange = () => {
      fetchUserData();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getAuthStatus = (): "loading" | "authenticated" | "unauthenticated" => {
    if (isLoading) return "loading";
    if (user && token) return "authenticated";
    return "unauthenticated";
  };

  const hasCompletedOnboarding = React.useMemo(() => {
    if (typeof window === "undefined") return false;
    // Only check onboarding if user is logged in
    if (!user) return false;
    try {
      return localStorage.getItem("onboarding.completed") === "true";
    } catch {
      return false;
    }
  }, [user]);

  const auth: AuthState = {
    status: getAuthStatus(),
    user,
    isLoading,
    hasCompletedOnboarding,
  };

  return (
    <AuthContext.Provider value={{ auth, refetchUser: fetchUserData, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
