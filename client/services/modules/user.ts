import { api } from "../api";

// Mock data for offline development
const MOCK_USERS = {
    "student@test.com": {
        id: 1,
        name: "Ahmet Öğrenci",
        email: "student@test.com",
        role: "student",
        password: "123456"
    },
    "teacher@test.com": {
        id: 2,
        name: "Ayşe Öğretmen", 
        email: "teacher@test.com",
        role: "teacher",
        password: "123456"
    },
    "admin@test.com": {
        id: 3,
        name: "Admin User",
        email: "admin@test.com", 
        role: "admin",
        password: "123456"
    }
};

export class UserAPI {

    register = async (firstname:string, lastname:string , role:string ,email:string, password: string) => {
        // Mock registration - always return success
        return {
            status: 200,
            data: {
                message: "Kullanıcı başarıyla kaydedildi",
                user_id: Date.now()
            }
        };
    }

    login = async (email:string, password: string) => {
        // Mock login - check against mock users
        const user = MOCK_USERS[email as keyof typeof MOCK_USERS];
        
        if (!user || user.password !== password) {
            return {
                status: 401,
                data: {
                    error: { type: "InvalidCredentials", message: "Geçersiz giriş bilgileri" }
                }
            };
        }

        // Generate mock token
        const mockToken = `mock-token-${user.id}-${Date.now()}`;
        
        return {
            status: 200,
            data: {
                user_id: user.id,
                auth_token: mockToken,
                expire_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            }
        };
    }

    get_user = async () => {
        // Mock user data - extract user info from stored token
        const token = localStorage.getItem("token");
        
        if (!token) {
            return {
                status: 401,
                data: { error: { type: "Unauthorized", message: "Token bulunamadı" }}
            };
        }

        // Extract user ID from mock token
        const userIdMatch = token.match(/mock-token-(\d+)-/);
        if (!userIdMatch) {
            return {
                status: 401,
                data: { error: { type: "InvalidToken", message: "Geçersiz token" }}
            };
        }

        const userId = parseInt(userIdMatch[1]);
        const user = Object.values(MOCK_USERS).find(u => u.id === userId);
        
        if (!user) {
            return {
                status: 404,
                data: { error: { type: "UserNotFound", message: "Kullanıcı bulunamadı" }}
            };
        }

        return {
            status: 200,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }

    get_user_admin = async (id:number) => {
        // Mock admin user data
        return {
            status: 200,
            data: {
                id: id,
                name: "Admin User",
                email: "admin@test.com",
                role: "admin"
            }
        };
    }
}