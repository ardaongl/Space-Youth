import { IUserRoles } from "@/types/user/user";
import { api } from "../api";

export class UserAPI {

    register = async (firstname:string, lastname:string , role:string ,email:string, password: string) => {
        const response = await api.post("/user/register",
            {
                first_name: firstname,
                last_name: lastname,
                email: email,
                password: password,
                language: "tr",
                role: role
            }
        )
        return response;
    }

    login = async (email:string, password: string, verification_code?: string) => {
        try {
            const payload: Record<string, string> = {
                email,
                password,
            };

            if (verification_code) {
                payload.verification_code = verification_code;
            }

            const response = await api.post(
                "/user/login", 
                payload,
                { requiresAuth: false, validateStatus: s => s < 500}
            )
    
            return response;
        } catch (error) {
            return error;
        }
    }

    login_with_code = async (email:string, password: string, verification_code: string) => {
        return this.login(email, password, verification_code);
    }

    get_user = async () => {
        try {
            const response = await api.get("/api/user", {requiresAuth: true, validateStatus: s => s < 500})
            return response;
        } catch (error) {
            return error;
        }
    }

    delete_account = async (userId?: string) => {
        try {
            const config: {
                requiresAuth: boolean;
                validateStatus: (status: number) => boolean;
                params?: { user_id: string };
            } = {
                requiresAuth: true,
                validateStatus: s => s < 500,
            };

            if (userId) {
                config.params = { user_id: userId };
            }

            const response = await api.delete("/api/user", config);
            return response;
        } catch (error) {
            return error;
        }
    }

    change_password = async (old_password: string, new_password: string) => {
        try {
            const response = await api.post("/api/renew_password", {old_password, new_password}, {requiresAuth: true, validateStatus: s => s < 500})
            return response;
        } catch (error) {
            return error;
        }
    }

    update_user = async (payload: {
        first_name?: string;
        last_name?: string;
        age?: number;
        gender?: string;
        email?: string;
        language?: string;
        labels?: number[];
    }) => {
        try {
            console.log("update_user_payload: ", payload);
            const response = await api.post("/api/user", payload, {requiresAuth: true, validateStatus: s => s < 500})
            console.log("update_user_response: ", response);
            return response;
        } catch (error) {
            return error;
        }
    }

    verify_email = async (email:string, verification_code: string) => {
        try {
            const response = await api.post("/user/verify_email", {email, code: verification_code}, {requiresAuth: true, validateStatus: s => s < 500})
            return response;
        } catch (error) {
            return error;
        }
    }

    connect_zoom = async () => {
        try {
            const response = await api.get(
                "/api/zoom/auth",
                { requiresAuth: true, validateStatus: s => s < 500 }
            );
            return response;
        } catch (error) {
            return error;
        }
    }

    admin_get_users = async (role: IUserRoles) => {
        try {
            const response = await api.get("/api/users", {requiresAuth: true, validateStatus: s => s < 500, params: {role: role.toLowerCase()}})
            return response;
        } catch (error) {
            return error;
        }
    }

    admin_teacher_approve = async (user_id: string, approve: boolean) => {
        try {
            const response = await api.post("/api/teacher/approve", {user_id, approve}, {requiresAuth: true, validateStatus: s => s < 500})
            return response;
        } catch (error) {
            return error;
        }
    }

    user_visit = async (user_id: string) => {
        try {
            const response = await api.post("/api/user/visit", {user_id}, {requiresAuth: true, validateStatus: s => s < 500})
            return response;
        } catch (error) {
            return error;
        }
    }
}