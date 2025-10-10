import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import { UserRole } from "@/utils/roles";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

interface userState {
    token: string;
    user: User | null;
    isLoading: boolean;
}

const initialState: userState = {
    token: "",
    user: null,
    isLoading: false,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers : {
        setUserToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        clearUser: (state) => {
            state.token = "";
            state.user = null;
            state.isLoading = false;
        }
    }
})

export const {setUserToken, setUser, setLoading, clearUser} = userSlice.actions;
export default userSlice.reducer;