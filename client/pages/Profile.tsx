import { Edit, Share2, Calendar, Trophy, BookOpen, Video, Clock, CheckCircle2, Settings, ExternalLink, TrendingUp, GraduationCap, Users, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import AppLayout from "@/components/layout/AppLayout";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { AvatarDisplay } from "@/components/ui/avatar-display";
import { Progress } from "@/components/ui/progress";

export function Profile() {
  const { auth } = useAuth();
  const userName = auth.user?.name || "User";
  const userEmail = auth.user?.email || "user@spaceyouth.com";
  const [zoomConnected, setZoomConnected] = React.useState<boolean>(() => {
    try { return localStorage.getItem("zoom.connected") === "true"; } catch { return false; }
  });

  const similarity = 78;
  const primaryArchetype = {
    code: "innovative-visionary",
    name: "Innovative Visionary",
    tr: "Yenilikçi Vizyoner",
    color: "bg-gradient-to-r from-amber-500 to-orange-500",
  };

  // Mock data for profile stats
  const profileStats = {
    currentLeague: "Diamond",
    rank: 142,
  };

  const upcomingEvents = [
    { id: 1, title: "AI & Machine Learning Workshop", date: "Oct 15, 2025", time: "14:00", duration: "2h", hasZoom: true },
    { id: 2, title: "Rapid Prototyping Session", date: "Oct 18, 2025", time: "16:00", duration: "3h", hasZoom: true },
    { id: 3, title: "Career Mentorship Meeting", date: "Oct 20, 2025", time: "10:00", duration: "1h", hasZoom: false },
  ];

  const enrolledCourses = [
    { 
      id: 1, 
      title: "React & TypeScript Mastery", 
      type: "Kurs",
      instructor: "Sarah Johnson",
      progress: 75, 
      totalLessons: 24,
      completedLessons: 18,
      enrollDate: "Sep 1, 2025",
      status: "in-progress",
      color: "bg-blue-500"
    },
    { 
      id: 2, 
      title: "Design Thinking Workshop", 
      type: "Workshop",
      instructor: "Michael Chen",
      progress: 100, 
      totalLessons: 8,
      completedLessons: 8,
      enrollDate: "Sep 5, 2025",
      status: "completed",
      color: "bg-green-500"
    },
    { 
      id: 3, 
      title: "Space Tech Hackathon 2025", 
      type: "Hackathon",
      instructor: "SpaceYouth Team",
      progress: 60, 
      totalLessons: 5,
      completedLessons: 3,
      enrollDate: "Sep 10, 2025",
      status: "in-progress",
      color: "bg-purple-500"
    },
    { 
      id: 4, 
      title: "Python for Data Science", 
      type: "Kurs",
      instructor: "Dr. Emily Rodriguez",
      progress: 45, 
      totalLessons: 32,
      completedLessons: 14,
      enrollDate: "Aug 25, 2025",
      status: "in-progress",
      color: "bg-orange-500"
    },
    { 
      id: 5, 
      title: "UX/UI Design Fundamentals", 
      type: "Workshop",
      instructor: "Alex Turner",
      progress: 90, 
      totalLessons: 12,
      completedLessons: 11,
      enrollDate: "Aug 15, 2025",
      status: "in-progress",
      color: "bg-pink-500"
    },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        {/* Hero Section with Personality Card */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Personality Hero Card - Similar to Elon Musk card */}
            <Card className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-orange-950/30 border-none shadow-xl overflow-hidden mb-8">
              <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
              <div className="relative p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* Left Side - Text Content */}
                  <div className="space-y-4 z-10">
                    <Badge className={`${primaryArchetype.color} text-white border-none px-4 py-1.5 text-sm font-semibold shadow-lg`}>
                      {primaryArchetype.name} • {primaryArchetype.tr}
                    </Badge>
                    <h2 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                      Yaratıcı Problem Çözme Profilin
                    </h2>
                    <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                      Büyük düşünüyorsun, hızlı prototipliyorsun ve kısıtlı kaynakları fırsata çeviriyorsun. Sistem düşüncesi ve vizyon odaklı yaklaşımınla öne çıkıyorsun.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Sistem Düşüncesi", "Kaynak Üreticiliği", "Hızlı Deney", "Vizyon"].map((trait) => (
                        <Badge key={trait} variant="secondary" className="px-3 py-1">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Right Side - Visual with Elon Musk Image & Similarity */}
                  <div className="relative h-[250px] lg:h-[280px]">
                    <div className="absolute inset-0 flex items-end justify-center">
                      <div className="w-72 h-72 lg:w-80 lg:h-80 bg-[url('/ElonMusk.png')] bg-no-repeat bg-contain bg-bottom -ml-48   lg:-ml-62" />
                    </div>
                    <div className="absolute top-1 right-1 lg:w-[270px] bg-white/40 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-3.5 shadow-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-foreground">Elon Musk</span>
                        <span className="text-sm text-muted-foreground">Benzerlik Oranı</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={similarity} className="flex-1 h-2" />
                        <span className="text-lg font-bold text-orange-500">%{similarity}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Risk alma, sistem düşüncesi ve kaynak yaratma kalıplarına göre hesaplandı.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Profile Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-6">
              <div className="flex items-center gap-6">
                <AvatarDisplay name={userName} size="xl" className="border-4 border-background shadow-xl" />
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{userName}</h1>
                  <p className="text-muted-foreground mb-3">{userEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>

            {/* Main Content - Single Column */}
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Yaklaşan Eğitimler */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Yaklaşan Eğitimler</h3>
                      <p className="text-sm text-muted-foreground">Kayıt olduğunuz eğitimler</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center">
                            {event.hasZoom ? <Video className="h-6 w-6 text-blue-600" /> : <Calendar className="h-6 w-6 text-purple-600" />}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{event.title}</div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3" />
                              <span>{event.date}</span>
                              <span>•</span>
                              <Clock className="h-3 w-3" />
                              <span>{event.time}</span>
                              <span>•</span>
                              <span>{event.duration}</span>
                            </div>
                          </div>
                        </div>
                        {event.hasZoom && zoomConnected && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Katıl
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Kayıt Olunan Eğitimler */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-xl flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Kayıt Olunan Eğitimler</h3>
                        <p className="text-sm text-muted-foreground">{enrolledCourses.length} eğitime kayıtlısınız</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {enrolledCourses.map((course) => {
                      const typeIcon = course.type === "Kurs" ? BookOpen : course.type === "Workshop" ? Users : Code;
                      const typeColor = course.type === "Kurs" ? "bg-blue-100 text-blue-700 border-blue-200" : 
                                       course.type === "Workshop" ? "bg-purple-100 text-purple-700 border-purple-200" : 
                                       "bg-orange-100 text-orange-700 border-orange-200";
                      const statusBadge = course.status === "completed" ? "bg-green-100 text-green-700 border-green-200" : "bg-yellow-100 text-yellow-700 border-yellow-200";
                      const statusText = course.status === "completed" ? "Tamamlandı" : "Devam Ediyor";
                      const TypeIcon = typeIcon;

                      return (
                        <div key={course.id} className="border rounded-lg p-5 hover:bg-muted/50 transition-colors">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="h-14 w-14 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                                <TypeIcon className="h-7 w-7 text-gray-600 dark:text-gray-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-2 mb-2">
                                  <h4 className="font-semibold text-foreground text-base">{course.title}</h4>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                  <Badge className={typeColor}>
                                    {course.type}
                                  </Badge>
                                  <Badge className={statusBadge}>
                                    {statusText}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    <span>{course.instructor}</span>
                                  </div>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>Kayıt: {course.enrollDate}</span>
                                  </div>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <BookOpen className="h-3 w-3" />
                                    <span>{course.completedLessons}/{course.totalLessons} Ders</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">İlerleme</span>
                                    <span className="font-semibold text-foreground">{course.progress}%</span>
                                  </div>
                                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full ${course.color} transition-all duration-300`} 
                                      style={{ width: `${course.progress}%` }} 
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="ml-4 flex-shrink-0"
                            >
                              {course.status === "completed" ? "Tekrar İzle" : "Devam Et"}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
