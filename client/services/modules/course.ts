export class CourseAPI {
    
    async getAllCourses(): Promise<any> {
        try {
            // Mock courses data - since we don't have real backend
            const mockCourses = [
                {
                    id: "course-1",
                    title: "Workshop Facilitation",
                    author: "Colin Michael Pace",
                    level: "Advanced",
                    rating: "4.6 (4,061)",
                    time: "4h",
                    popular: true
                },
                {
                    id: "course-2", 
                    title: "UX Design Foundations",
                    author: "Gene Kamenez",
                    level: "Beginner",
                    rating: "4.8 (3,834)",
                    time: "6h",
                    popular: false
                },
                {
                    id: "course-3",
                    title: "Introduction to Customer Journey Mapping", 
                    author: "Oliver West",
                    level: "Intermediate",
                    rating: "4.7 (2,102)",
                    time: "5h",
                    popular: false
                }
            ];
            
            return mockCourses;
        } catch (error) {
            console.log(error);
            throw new Error(
                (error?.response?.status) || error.message
            );
        }
    }

}