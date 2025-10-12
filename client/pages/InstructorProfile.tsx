import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import AppLayout from "@/components/layout/AppLayout";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export function InstructorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock instructor data - in real app, fetch from API based on id
  const instructor = {
    id: id,
    name: "Academind by Maximilian Schwarzmüller",
    title: "Online Education",
    avatar: "/placeholder.svg",
    totalCourses: 48,
    about: "Bundling the courses and know how of successful instructors, Academind strives to deliver high quality online education.\n\nOnline Education, Real-Life Success - that's what Academind stands for. Learn topics like web development, data analyses and more in a fun and engaging way.\n\nWe've taught more than 3,000,000 students on a broad variety of topics. We'd love to teach you as well! :)\n\nKeep learning!",
    courses: [
      {
        id: 1,
        title: "React - The Complete Guide",
        thumbnail: "/image.png",
        level: "Beginner",
        students: 450000,
        rating: "4.6"
      },
      {
        id: 2,
        title: "Flutter & Dart - The Complete Guide",
        thumbnail: "/image.png",
        level: "Intermediate",
        students: 320000,
        rating: "4.7"
      },
      {
        id: 3,
        title: "Docker & Kubernetes",
        thumbnail: "/image.png",
        level: "Advanced",
        students: 280000,
        rating: "4.5"
      },
      {
        id: 4,
        title: "Node.js - The Complete Guide",
        thumbnail: "/image.png",
        level: "Intermediate",
        students: 390000,
        rating: "4.8"
      },
      {
        id: 5,
        title: "Python for Data Science",
        thumbnail: "/image.png",
        level: "Beginner",
        students: 275000,
        rating: "4.6"
      },
      {
        id: 6,
        title: "Angular - The Complete Guide",
        thumbnail: "/image.png",
        level: "Intermediate",
        students: 310000,
        rating: "4.7"
      },
      {
        id: 7,
        title: "Vue.js - Complete Guide",
        thumbnail: "/image.png",
        level: "Beginner",
        students: 265000,
        rating: "4.5"
      },
      {
        id: 8,
        title: "MongoDB - The Complete Guide",
        thumbnail: "/image.png",
        level: "Intermediate",
        students: 195000,
        rating: "4.6"
      },
      {
        id: 9,
        title: "GraphQL with Node.js",
        thumbnail: "/image.png",
        level: "Advanced",
        students: 145000,
        rating: "4.7"
      },
      {
        id: 10,
        title: "TypeScript - The Complete Guide",
        thumbnail: "/image.png",
        level: "Intermediate",
        students: 380000,
        rating: "4.8"
      },
      {
        id: 11,
        title: "Next.js & React - Complete Guide",
        thumbnail: "/image.png",
        level: "Advanced",
        students: 290000,
        rating: "4.9"
      },
      {
        id: 12,
        title: "AWS Fundamentals",
        thumbnail: "/image.png",
        level: "Beginner",
        students: 225000,
        rating: "4.5"
      }
    ]
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8 max-w-7xl">
        {/* Header Card - Similar to Udemy */}
        <Card className="p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-muted border-4 border-background shadow-lg">
                <img 
                  src={instructor.avatar} 
                  alt={instructor.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{instructor.name}</h1>
                <p className="text-lg text-muted-foreground">{instructor.title}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* About Section */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Hakkımda</h2>
          <div className="text-muted-foreground leading-1">
            {instructor.about}
          </div>
        </Card>

        {/* Courses Section */}
        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-6">
            Kurslarım ({instructor.totalCourses})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructor.courses.map((course) => (
              <div 
                key={course.id}
                onClick={() => navigate(`/courses/${course.id}`)}
                className="cursor-pointer group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <Badge variant="secondary">{course.level}</Badge>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {course.students.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

