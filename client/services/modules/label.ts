import { api } from "../api";

export class LabelAPI {
    
    get_labels = async () => {
        try {
            const response = await api.get("/api/labels", {requiresAuth: true, validateStatus: s => s < 500})
            return response;
        } catch (error) {
            return error;
        }
    }

    get_label = async (id: number) => {
        try {
            const response = await api.get("/api/label", {
                requiresAuth: true, 
                validateStatus: s => s < 500,
                params: { id }
            })
            return response;
        } catch (error) {
            return error;
        }
    }

    add_label = async (payload: { name: string }) => {
        try {
            const response = await api.post("/api/label", 
                {
                    name: payload.name
                }, 
                {requiresAuth: true, validateStatus: s => s < 500})
            return response;
        } catch (error) {
            return error;
        }
    }

    update_label = async (id: number, payload: { name: string }) => {
        try {
            const response = await api.put("/api/label", 
                {
                    name: payload.name
                }, 
                {
                    requiresAuth: true, 
                    validateStatus: s => s < 500,
                    params: { id }
                })
            return response;
        } catch (error) {
            return error;
        }
    }

    delete_label = async (id: number) => {
        try {
            const response = await api.delete("/api/label", {
                requiresAuth: true, 
                validateStatus: s => s < 500,
                params: { id }
            })
            return response;
        } catch (error) {
            return error;
        }
    }
}

