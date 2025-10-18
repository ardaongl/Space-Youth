import { axiosInstance } from "../api";

export class StudentAPI {

    get_student = async ()  => {
        try {
            const response = await axiosInstance.get(
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

    set_student_answers = async (ques_and_answes: string) => {
        try {
            const response = await axiosInstance.post(
                '/api/student',
                {questions_and_answers: ques_and_answes},
                {requiresAuth: true, validateStatus: s => s < 500},
            )
        } catch (error) {
            
        }
    }

    admin_approve_student = async (_id:number , _check: boolean) => {
        try {
            const response = await axiosInstance.post(
                '/api/student/approve',
                {
                    student_id: _id,
                    ai_check: _check
                },
                {requiresAuth: true, validateStatus: s => s < 500},
            )
        } catch (error) {
            
        }
    }

}