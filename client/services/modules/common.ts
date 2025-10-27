import { ICharacter, IPersonality } from "@/types/common/common";
import { api } from "../api";

export class CommonAPI {
    about = async () => {
        try {
            // Mock about data - since we don't have real backend
            const mockAboutData = {
                title: "Space Youth Hakkında",
                description: "Gençlerin yeteneklerini keşfetmesi ve geliştirmesi için tasarlanmış kapsamlı bir platform.",
                stats: {
                    students: 10000,
                    courses: 500,
                    instructors: 100,
                    projects: 5000
                }
            };
            
            return mockAboutData;
        } catch (error) {
            console.error("Error loading about data:", error);
            return null;
        }
    }

    admin_add_personality = async (payload: IPersonality) => {
        try {            
            const response = await api.post("/api/personality", 
                {
                    name: payload.name, 
                    type: payload.type,
                    short_description: payload.short_description,
                    long_description: payload.long_description,
                } ,
                {requiresAuth: true, validateStatus: s => s < 500}
            )
            return response;
        } catch (error) {
            console.error("Error loading about data:", error);
            return error;
        }
    }

    get_personalities = async () => {
        try {
            const response = await api.get("/api/personalities", {requiresAuth: true, validateStatus: s => s < 500} )
            return response;
        } catch (error) {
            console.error("Error loading about data:", error);
            return error;
        }
    }

    admin_add_character = async (payload: ICharacter) => {
        try {
            const response = await api.post("/api/character", 
                {name: payload.name, details: payload.details, personality: payload.personality, image_url: ""}, 
                {requiresAuth: true, validateStatus: s => s < 500} )
            return response;
        } catch (error) {
            console.error("Error loading about data:", error);
            return error;
        }
    }
}