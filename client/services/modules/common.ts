import { api } from "../api"

export class CommonAPI {
    about = async () => {
        try {
            const response = await api.get("/api/about", {requiresAuth:false, validateStatus: s => s < 500})
            return response.data;
        } catch (error) {
            
        }
    }
}