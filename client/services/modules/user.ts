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

    login = async (email:string, password: string) => {
        try {
            const response = await api.post(
                "/user/login", 
                {
                    email, password
                },
                { requiresAuth: false, validateStatus: s => s < 500}
            )
    
            return response;
        } catch (error) {
            return error;
        }
    }

    get_user = async () => {
        try {
            const response = await api.get("/api/user", {requiresAuth: true, validateStatus: s => s < 500})
            return response;
        } catch (error) {
            return error;
        }
    }
}