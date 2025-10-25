export enum IUserRoles {
    STUDENT = "student",
    TEACHER = "teacher",
    ADMIN = "admin"
}

export interface Student {
    id: string;
    approved: string;
    questions_and_answers: string;
}