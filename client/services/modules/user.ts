import { api } from "../api";

export class UserAPI {

    register = async (firstname:string, lastname:string , role:string ,email:string, password: string) => {
        return {
            status: 200,
            data: {
                message: "Kullanıcı başarıyla kaydedildi",
                user_id: Date.now()
            }
        };
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