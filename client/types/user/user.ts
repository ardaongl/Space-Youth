export enum IUserRoles {
    STUDENT = "student",
    TEACHER = "teacher",
    ADMIN = "admin"
}


export enum STUDENT_STATUS {
    INCOMPLETE = "INCOMPLETE",
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}

export interface Student {
    id: string;
    status: STUDENT_STATUS;
    questions_and_answers: string;
}


