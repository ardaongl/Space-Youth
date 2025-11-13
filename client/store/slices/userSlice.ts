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

// ✅ localStorage'dan varsa token'ı ve user'ı yükle
const savedToken = localStorage.getItem("token") || "";
const savedUser = localStorage.getItem("user");

const initialState: UserState = {
  token: savedToken,
  user: savedUser ? JSON.parse(savedUser) : null,
  isLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearUser: (state) => {
      state.token = "";
      state.user = null;
      state.isLoading = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setUserToken, setUser, setLoading, clearUser } =
  userSlice.actions;
export default userSlice.reducer;
