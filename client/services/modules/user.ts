import { api } from "../api";

export class UserAPI {

    register = async (firstname:string, lastname:string , role:string ,email:string, password: string) => {
        try {
            const response = await api.post(
                '/user/register',
                {first_name: firstname,last_name: lastname, language: "tr", role: role ,email: email, password: password},
                {validateStatus: s => s < 500},
            );
            return response;
        } catch (error) {
            console.log(error);
        }
    }

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

    get_user = async ()  => {
        try {
            const response = await api.get(
                '/api/user',
                {
                    requiresAuth: true,
                    validateStatus: s => s < 500
                },
            );
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    get_user_admin = async (id:number)  => {
        
    }
}