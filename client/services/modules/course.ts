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

    get_course = async (id: number) => {
        try {
            const response = await api.get(`/api/course/`, {requiresAuth: true, validateStatus: s => s < 500, params: { id }})
            
            console.log('✅ Course API Response:', {
                status: response.status,
                data: response.data,
                hasImage: !!response.data?.image_url,
                hasLessons: response.data?.lessons?.length > 0,
                lessonsCount: response.data?.lessons?.length || 0,
                teacherName: response.data?.teacher ? `${response.data.teacher.first_name} ${response.data.teacher.last_name}` : 'N/A'
            });
            
            return response;
        } catch (error) {
            console.error('❌ Error fetching course:', error);
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
            const response = await api.post(`/api/course`, 
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

    upload_course_file = async (courseId: number, file: File, fileType: 'image' | 'certificate') => {
        try {
            const formData = new FormData();
            // Backend expects the file field to be named 'image'
            formData.append('image', file, file.name);
            // Backend expects file_type in req.body
            formData.append('file_type', fileType);

            console.log('Uploading file:', {
                courseId,
                fileName: file.name,
                fileSize: file.size,
                fileMimeType: file.type,
                uploadType: fileType,
                formDataKeys: Array.from(formData.keys())
            });

            const response = await api.post(
                `/courses/${courseId}/upload-file`,
                formData,
                {
                    requiresAuth: true,
                    validateStatus: s => s < 500,
                }
            );
            
            console.log('Upload response:', response);
            return response;
        } catch (error: any) {
            console.error('Upload error:', error);
            // If error is an axios error, return the response
            if (error.response) {
                return error.response;
            }
            return error;
        }
    }
}