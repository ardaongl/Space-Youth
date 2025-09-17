import { useDispatch } from "react-redux";
import { api } from "./api"
import { setUserToken } from "@/store/slices/userSlice";

export const login = async (email:string, password: string) => {
    try {
        const response = await api.post(
            '/user/login',
            {email: email, password: password},
            {validateStatus: s => s < 500},
        );
        return response;
    } catch (error) {
        console.log(error);
    }
}