import { api } from "../api";

export class CourseAPI {
    
    get_courses = async () => {
        try {
            const response = await api.get("/api/courses", {requiresAuth: true, validateStatus: s => s < 500})
            return response;
        } catch (error) {
            return error;
        }
    }

    get_course = async (id: string) => {
        try {
            const response = await api.get(`/api/courses/${id}`, {requiresAuth: true, validateStatus: s => s < 500})
            return response;
        } catch (error) {
            return error;
        }
    }

    add_course = async (payload: {
        title: string;
        description: string;
        level: string;
        labels?: number[];
        lessons?: Array<{
            title: string;
            content: string;
            video_url: string;
            order: number;
            duration: number;
            start_time: string;
        }>;
    }) => {
        try {
            const response = await api.post(`/api/courses`, 
                {
                    title: payload.title,
                    description: payload.description,
                    level: payload.level,
                    labels: payload.labels,
                    lessons: payload.lessons
                }, {requiresAuth: true, validateStatus: s => s < 500})
            return response;
        } catch (error) {
            return error;
        }
    }

    delete_course = async (id: string) => {
        try {
            const response = await api.delete(`/api/courses/${id}`, {requiresAuth: true, validateStatus: s => s < 500})
            return response;
        } catch (error) {
            return error;
        }
    }
}