import { ICharacter, IPersonality } from "@/types/common/common";
import { api } from "../api";

export class PersonalityAPI {

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

}