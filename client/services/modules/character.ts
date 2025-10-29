import { ICharacter, IPersonality } from "@/types/common/common";
import { api } from "../api";

export class CharacterAPI {

    admin_add_character = async (payload: {name: string, details: string, personality: string, image: File}) => {
        try {
            const formData = new FormData();
            formData.append('name', payload.name);
            formData.append('details', payload.details);
            formData.append('personality', payload.personality);
            formData.append('image', payload.image);
            
            const response = await api.post("/api/character", formData, {
                requiresAuth: true, 
                validateStatus: s => s < 500,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error) {
            console.error("Error adding character:", error);
            return error;
        }
    }

    get_character = async (id: string) => {
        try {
            const response = await api.get(`/api/character`, {requiresAuth: true, validateStatus: s => s < 500, params: {id: id}} )
            return response;
        } catch (error) {
            console.error("Error getting character:", error);
            return error;
        }
    }

    get_characters = async () => {
        try {
            const response = await api.get("/api/characters", {requiresAuth: true, validateStatus: s => s < 500} )
            return response;
        } catch (error) {
            console.error("Error getting characters:", error);
            return error;
        }
    }
}