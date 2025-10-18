import { axiosInstance } from "../api";

export class UserAPI {

    login = async (email:string, password: string) => {
        try {
            const response = await axiosInstance.post(
                '/user/login',
                {email: email, password: password},
                {validateStatus: s => s < 500},
            );
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    get_user = async ()  => {
        try {
            const response = await api.get(
                '/api/user',
                {
                    requiresAuth: true,
                    validateStatus: s => s < 500
                },
            );
            console.log(response);
            
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    get_user_admin = async (id:number)  => {
        
    }
}