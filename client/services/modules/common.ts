export class CommonAPI {
    about = async () => {
        try {
            // Mock about data - since we don't have real backend
            const mockAboutData = {
                title: "Space Youth Hakkında",
                description: "Gençlerin yeteneklerini keşfetmesi ve geliştirmesi için tasarlanmış kapsamlı bir platform.",
                stats: {
                    students: 10000,
                    courses: 500,
                    instructors: 100,
                    projects: 5000
                }
            };
            
            return mockAboutData;
        } catch (error) {
            console.error("Error loading about data:", error);
            return null;
        }
    }
}