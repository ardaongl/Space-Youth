import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CheckCircle2, Clock, ShieldCheck, BookOpen, ListChecks, ArrowLeft, Bookmark, Coins, Play } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { isAdmin } from "@/utils/roles";

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const adminUser = isAdmin(auth.user?.role);

  // Mock course data - in real app, fetch from API
  const courseData = {
    title: slug ? slug.replace(/-/g, " ") : "Workshop Facilitation",
    description: "Workshops are powerful tools for tackling complex problems and driving innovative solutions. This course equips you with the skills to effectively facilitate workshops that inspire collaboration, enhance teamwork, and generate breakthrough ideas. Throughout the course, you'll explore common challenges teams face and learn how to overcome them.",
    price: 250, // coin value
    teacherName: "Colin Michael Pace",
    duration: "4 hours",
    certification: true,
    lessonsCount: 15,
    examsCount: 3,
    teacherPhotos: [
      "/image.png",
      "/image.png",
      "/image.png"
    ],
    teacherVideos: [
      { thumbnail: "/image.png", title: "Introduction to Workshop Facilitation" },
      { thumbnail: "/image.png", title: "Advanced Techniques" }
    ]
  };

  const handleSave = () => {
    console.log("Course saved");
    // TODO: Implement save functionality
  };

  const handleEnroll = () => {
    console.log("Course enrolled");
    // TODO: Implement enroll functionality
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate('/courses')}
        >
          <ArrowLeft className="h-4 w-4" />
          Geri Dön
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8">
          {/* Left Content */}
          <div>
            {/* Course Header */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight capitalize">{courseData.title}</h1>
              
              {/* Price and Actions */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Coins className="h-6 w-6 text-yellow-600" />
                  <span className="text-2xl font-bold text-yellow-600">{courseData.price}</span>
                  <span className="text-muted-foreground">coins</span>
                </div>
                
                <div className="flex gap-4 items-center flex-wrap">
                  {adminUser && (
                    <Button
                      size="default"
                      className="gap-2"
                      onClick={() => navigate(`/courses/${slug}/edit`)}
                    >
                      Düzenle
                    </Button>
                  )}
                  <Button variant="outline" size="lg" className="gap-2" onClick={handleSave}>
                    <Bookmark className="h-5 w-5" />
                  </Button>
                  
                  {/* Featured Enroll Button */}
                  <Button 
                    size="lg" 
                    className="gap-2 px-8 py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105" 
                    onClick={handleEnroll}
                  >
                    Kursa Kayıt Ol
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Açıklama</h2>
                <p className="text-muted-foreground leading-7">
                  {courseData.description}
                </p>
              </div>

              {/* Details Section */}
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Detaylar</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Öğretmen</p>
                      <p className="text-sm text-muted-foreground">{courseData.teacherName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Süre</p>
                      <p className="text-sm text-muted-foreground">{courseData.duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Sertifika</p>
                      <p className="text-sm text-muted-foreground">
                        {courseData.certification ? "Sertifikalı" : "Sertifikasız"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <ListChecks className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">İçerik</p>
                      <p className="text-sm text-muted-foreground">
                        {courseData.lessonsCount} ders, {courseData.examsCount} sınav
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Bu kursta kazanacağınız beceriler:</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                    <p className="leading-7"><span className="font-semibold">Başarılı tasarım atölyeleri planlama ve yürütme</span> — Tasarım atölyesi çağrısının ne zaman yapılacağını, hedeflerin nasıl belirleneceğini ve doğru çıktıları üretmek için doğru süreçleri ve aktiviteleri nasıl planlayacağınızı öğrenin.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                    <p className="leading-7"><span className="font-semibold">Beyin fırtınası ve karar verme aktiviteleri keşfetme</span> — Yaratıcı fikir üretimini teşvik eden ve tasarım kararlarında fikir birliği oluşturmanın yollarını öğrenin.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                    <p className="leading-7"><span className="font-semibold">Uzaktan atölyeler yürütme ve harika sunumlar oluşturma</span> — Başarılı bir uzaktan atölye yürütmek için ihtiyacınız olan tüm sanal araçları ve teknikleri öğrenin.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Teacher Photos & Videos */}
          <div className="space-y-6">
            {/* Course Photo */}
            <div className="rounded-lg border overflow-hidden bg-muted">
              <img 
                src={courseData.teacherPhotos[0]} 
                alt="Course photo"
                className="w-full aspect-video object-cover"
              />
            </div>

            {/* Course Videos */}
            {courseData.teacherVideos.length === 1 ? (
              // Single video - display directly
              <div className="rounded-lg border bg-card p-6">
                <div className="group cursor-pointer">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={courseData.teacherVideos[0].thumbnail} 
                      alt={courseData.teacherVideos[0].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <p className="text-sm font-medium mt-2">{courseData.teacherVideos[0].title}</p>
                </div>
              </div>
            ) : (
              // Multiple videos - display as carousel
              <div className="rounded-lg border bg-card p-6">
                <Carousel className="w-full">
                  <CarouselContent>
                    {courseData.teacherVideos.map((video, index) => (
                      <CarouselItem key={index}>
                        <div className="group cursor-pointer">
                          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                            <img 
                              src={video.thumbnail} 
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition">
                              <Play className="h-12 w-12 text-white" />
                            </div>
                          </div>
                          <p className="text-sm font-medium mt-2">{video.title}</p>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              </div>
            )}

            
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
