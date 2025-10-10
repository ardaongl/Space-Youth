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
}

interface AuthContextType {
  auth: AuthState;
  refetchUser: () => Promise<void>;
  logout: () => void;
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
      // Development mode: Set default student role for testing
      if (import.meta.env.DEV && !user) {
        dispatch(setUser({
          id: "student-1",
          name: "Ahmet Öğrenci",
          email: "ogrenci@test.com",
          role: "student",
        }));
        dispatch(setUserToken("dev-token"));
      } else {
        dispatch(clearUser());
      }
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
      // Development mode: Use mock data on API error
      if (import.meta.env.DEV) {
        console.warn("⚠️ API hatası, mock data kullanılıyor");
        dispatch(setUser({
          id: "student-1",
          name: "Ahmet Öğrenci",
          email: "ogrenci@test.com",
          role: "student",
        }));
        dispatch(setUserToken("dev-token"));
      } else {
        dispatch(clearUser());
        authService.removeToken();
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = () => {
    dispatch(clearUser());
    authService.removeToken();
  };

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAuthStatus = (): "loading" | "authenticated" | "unauthenticated" => {
    if (isLoading) return "loading";
    if (user && token) return "authenticated";
    return "unauthenticated";
  };

  const auth: AuthState = {
    status: getAuthStatus(),
    user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={{ auth, refetchUser: fetchUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
