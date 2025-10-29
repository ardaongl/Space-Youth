import { ICharacter, IPersonality } from "@/types/common/common";
import { api } from "../api";

export class CommonAPI {
    about = async () => {
        try {
            const response = await api.get("/api/about", {requiresAuth: false, validateStatus: s => s < 500} )
            return response;
        } catch (error) {
            console.error("Error getting about:", error);
            return error;
        }
    }

}