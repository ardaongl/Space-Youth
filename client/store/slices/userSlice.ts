import {createSlice, PayloadAction} from "@reduxjs/toolkit"

interface userState {
    token: string;
}

const initialState: userState = {
    token: "",
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers : {
        setUserToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        }
    }
})

export const {setUserToken} = userSlice.actions;
export default userSlice.reducer; 