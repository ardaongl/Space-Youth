import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserRole } from "@/utils/roles";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
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
      // ✅ persist et
      localStorage.setItem("token", action.payload);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      // ✅ persist et
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearUser: (state) => {
      state.token = "";
      state.user = null;
      state.isLoading = false;
      // ✅ temizle
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setUserToken, setUser, setLoading, clearUser } =
  userSlice.actions;
export default userSlice.reducer;
