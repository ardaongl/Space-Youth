import { Student } from "@/types/user/user";
import {createSlice, PayloadAction} from "@reduxjs/toolkit"


interface studentState {
    student: Student;
    isLoading: boolean;
}

const initialState: studentState = {
    student: null,
    isLoading: false,
}

const studentSlice = createSlice({
    name: "student",
    initialState,
    reducers : {
        setStudent: (state, action: PayloadAction<Student>) => {
            state.student = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        clearStudent: (state) => {
            state.student = null;
            state.isLoading = false;
        }
    }
})

export const {setStudent, setLoading, clearStudent} = studentSlice.actions;
export default studentSlice.reducer;