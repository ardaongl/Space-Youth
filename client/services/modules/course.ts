import { api } from "../api"

export class CourseAPI {
    
    async getAllCourses(): Promise<any> {
        try {
            const response = await api.get("/api/courses", 
            {requiresAuth: true, validateStatus: s => s < 500})
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error(
                (error?.response?.status) || error.message
            );
        }
    }

}