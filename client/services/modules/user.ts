import { api } from "../api";

export class UserAPI {
    
    login = async (email:string, password: string) => {
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
}