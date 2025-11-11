import { api } from "../api";

export class TaskAPI {
    
    get_task = async (id: string) => {
        try {
            const response = await api.get(`/api/task/${id}`, {requiresAuth: true, validateStatus: s => s < 500})
            return response;
        } catch (error) {
            return error;
        }
    }

    get_tasks = async () => {
        try {
            const response = await api.get("/api/tasks", {requiresAuth: true, validateStatus: s => s < 500})
            return response;
        } catch (error) {
            return error;
        }
    }
    
    admin_add_task = async (payload: {
        name: string;
        description: string;
        point: number;
        achivements: string;
        image_url: string;
        level: string;
    }) => {
        try {
            const response = await api.post("/api/task", payload, {requiresAuth: true, validateStatus: s => s < 500})
            return response;
        } catch (error) {
            return error;
        }
    }

    admin_delete_task = async (id: string) => {
        try {
            const response = await api.delete(`/api/task/${id}`, {requiresAuth: true, validateStatus: s => s < 500})
            return response;
        } catch (error) {
            return error;
        }
    }

    admin_update_task = async (id: string, payload: {
        name: string;
        description: string;
        point: number;
        achivements: string;
        image_url: string;
        level: string;
    }) => {
        try {
            const response = await api.put(`/api/task/${id}`, payload, {requiresAuth: true, validateStatus: s => s < 500})
            return response;
        } catch (error) {
            return error;
        }
    }

    get_completed_tasks = async (task_id: string) => {
        try {
            const response = await api.get(`/api/task/completed/${task_id}`, {requiresAuth: true, validateStatus: s => s < 500})
            return response;
        } catch (error) {
            return error;
        }
    }

    get_user_completed_tasks = async () => {
        try {
            const response = await api.get("/api/task/user/completed", {requiresAuth: true, validateStatus: s => s < 500});
            return response;
        } catch (error) {
            return error;
        }
    }

    admin_approve_task = async (submission_id: string, approve: boolean) => {
        try {
            const response = await api.post(`/api/task/approve`, {
                id: submission_id,
                approve: approve
            }, {requiresAuth: true, validateStatus: s => s < 500})
            return response;
        } catch (error) {
            return error;
        }   
    }

}