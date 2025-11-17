import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserRole } from "@/utils/roles";

export interface UserLabel {
  id: number;
  name: string;
}

export interface TeacherInfo {
  id: string;
  school?: string | null;
  branch?: string | null;
  zoom_connected?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  points?: number;
  labels?: UserLabel[];
  age?: number | null;
  gender?: "male" | "female";
  language?: "TR" | "EN";
  teacher?: TeacherInfo;
}

interface UserState {
  token: string;
  user: User | null;
  isLoading: boolean;
}

// ✅ sessionStorage'dan varsa token'ı ve user'ı yükle
//    window kontrolü ile SSR / build ortamlarında hata alınmasını engeller
let savedToken = "";
let savedUser: User | null = null;

if (typeof window !== "undefined") {
  try {
    // Eski localStorage verilerini temizle (migrasyon için)
    try {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("user");
    } catch {
      // localStorage erişimi başarısız olabilir, yok say
    }

    const rawToken = window.sessionStorage.getItem("token");
    const rawUser = window.sessionStorage.getItem("user");

    savedToken = rawToken || "";
    savedUser = rawUser ? (JSON.parse(rawUser) as User) : null;
  } catch (e) {
    // localStorage erişimi başarısız olursa, güvenli varsayılan değerlere dön
    savedToken = "";
    savedUser = null;
  }
}

const initialState: UserState = {
  token: savedToken,
  user: savedUser,
  isLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      if (typeof window !== "undefined") {
        try {
          window.sessionStorage.setItem("token", action.payload);
        } catch {
          // sessionStorage kullanılmasa bile Redux state çalışmaya devam eder
        }
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      if (typeof window !== "undefined") {
        try {
          window.sessionStorage.setItem("user", JSON.stringify(action.payload));
        } catch {
          // sessionStorage erişim hatası durumunda sessizce devam et
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearUser: (state) => {
      state.token = "";
      state.user = null;
      state.isLoading = false;

      if (typeof window !== "undefined") {
        try {
          window.sessionStorage.removeItem("token");
          window.sessionStorage.removeItem("user");
        } catch {
          // sessionStorage erişimi başarısız olabilir, yok say
        }

        // Eski localStorage anahtarlarını da temizlemeye devam et
        try {
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("user");
        } catch {
          // localStorage erişimi başarısız olabilir, yok say
        }
      }
    },
  },
});

export const { setUserToken, setUser, setLoading, clearUser } =
  userSlice.actions;
export default userSlice.reducer;
