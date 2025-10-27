import { IUserRoles } from "@/types/user/user";
import { api } from "../api";

export class StudentAPI {

    get_student = async ()  => {
        try {
            const response = await api.get(
                '/api/student',
                {
                    requiresAuth: true,
                    validateStatus: s => s < 500
                },
            );
            console.log(response);
            
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    set_student_answers = async (payload: {
        school?: string;
        department?: string;
        cv_url?: string;
        questions_and_answers: string;
        phases: Record<string, any>;
      }) => {
        try {            
          const response = await api.post(
            '/api/student',
            payload,
            { requiresAuth: true, validateStatus: s => s < 500 }
          );
          return response;
        } catch (error) {
          console.error("API error:", error);
          throw error;
        }
      }

    admin_approve_student = async (_id:number , _check: boolean) => {
        try {
            const response = await api.post(
                '/api/student/approve',
                {
                    student_id: _id,
                    ai_check: _check
                },
                {requiresAuth: true, validateStatus: s => s < 500},
            )
        } catch (error) {
            return error;
        }
    }

    get_students = async () => {
        try {
            const response = await api.get("/api/users",
                {
                    requiresAuth: true,
                    validateStatus: s => s < 500,
                    params: {role: IUserRoles.STUDENT}
                })
            return response;
        } catch (error) {
            return error;
        }
    }

}