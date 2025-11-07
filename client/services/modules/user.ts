import { api } from "../api";

export class UserAPI {

    register = async (firstname:string, lastname:string , role:string ,email:string, password: string) => {
        const response = await api.post("/user/register",
            {
                first_name: firstname,
                last_name: lastname,
                email: email,
                password: password,
                language: "tr",
                role: role
            }
        )
        return response;
    }

    login = async (email:string, password: string, verification_code?: string) => {
        try {
            const payload: Record<string, string> = {
                email,
                password,
            };

            if (verification_code) {
                payload.verification_code = verification_code;
            }

            const response = await api.post(
                "/user/login", 
                payload,
                { requiresAuth: false, validateStatus: s => s < 500}
            )
    
            return response;
        } catch (error) {
            return error;
        }
    }

    login_with_code = async (email:string, password: string, verification_code: string) => {
        return this.login(email, password, verification_code);
    }

    get_user = async () => {
        try {
            const response = await api.get("/api/user", {requiresAuth: true, validateStatus: s => s < 500})
            return response;
        } catch (error) {
            return error;
        }
    }

    change_password = async (old_password: string, new_password: string) => {
        try {
            const response = await api.post("/api/renew_password", {old_password, new_password}, {requiresAuth: true, validateStatus: s => s < 500})
            return response;
        } catch (error) {
            return error;
        }
    }
}