import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CheckCircle2, Clock, ShieldCheck, BookOpen, ListChecks, ArrowLeft, Bookmark, BookmarkCheck, Coins, Play, Users, Video, FileText, Download, ExternalLink, Copy } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { isAdmin, isTeacher } from "@/utils/roles";
import { useBookmarks, BookmarkedContent, EnrolledContent } from "@/context/BookmarksContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { useAppSelector } from "@/store";

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const user = useAppSelector(state => state.user);

  const { t } = useLanguage();
  const adminUser = isAdmin(user.user?.role);
  const teacherUser = isTeacher(user.user?.role);
  const canJoinCourse = !adminUser && !teacherUser;
  const canViewParticipants = adminUser || teacherUser;
  const { addBookmark, removeBookmark, isBookmarked, addEnrollment, isEnrolled } = useBookmarks();
  const { toast } = useToast();

  // Mock course data - in real app, fetch from API
  const courseData = {
    id: `course-${slug}`,
    title: slug ? slug.replace(/-/g, " ") : "Workshop Facilitation",
    description: "Workshops are powerful tools for tackling complex problems and driving innovative solutions. This course equips you with the skills to effectively facilitate workshops that inspire collaboration, enhance teamwork, and generate breakthrough ideas. Throughout the course, you'll explore common challenges teams face and learn how to overcome them.",
    price: 250, // coin value
    teacherId: "1", // instructor id for navigation
    teacherName: "Colin Michael Pace",
    duration: "4 hours",
    level: "Advanced",
    rating: "4.6",
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
    ],
    participants: [
      { id: 1, name: "Ahmet Yılmaz", email: "ahmet@example.com" },
      { id: 2, name: "Ayşe Demir", email: "ayse@example.com" },
      { id: 3, name: "Mehmet Kaya", email: "mehmet@example.com" },
      { id: 4, name: "Fatma Özkan", email: "fatma@example.com" },
      { id: 5, name: "Ali Çelik", email: "ali@example.com" },
      { id: 6, name: "Zeynep Arslan", email: "zeynep@example.com" },
      { id: 7, name: "Can Yıldız", email: "can@example.com" },
      { id: 8, name: "Elif Korkmaz", email: "elif@example.com" }
    ]
  };

  const bookmarked = isBookmarked(courseData.id);
  const enrolled = isEnrolled(courseData.id);
  
  // Mock data for enrolled content
  const enrolledContent = {
    zoomLink: "https://zoom.us/j/123456789?pwd=abcdefghijklmnop",
    zoomPassword: "123456",
    courseMaterials: [
      { id: 1, title: "Introduction to Workshop Facilitation", type: "video", duration: "15 min" },
      { id: 2, title: "Advanced Techniques", type: "video", duration: "25 min" },
      { id: 3, title: "Workshop Templates", type: "pdf", size: "2.3 MB" },
      { id: 4, title: "Best Practices Guide", type: "pdf", size: "1.8 MB" },
      { id: 5, title: "Interactive Exercises", type: "doc", size: "850 KB" }
    ]
  };

  const handleSave = () => {
    if (bookmarked) {
      removeBookmark(courseData.id);
      toast({
        title: t('bookmarks.removedFromBookmarks'),
        description: `${courseData.title} ${t('bookmarks.removedFromBookmarks')}.`,
      });
    } else {
      const bookmarkItem: BookmarkedContent = {
        id: courseData.id,
        title: courseData.title,
        author: courseData.teacherName,
        level: courseData.level,
        rating: courseData.rating,
        time: courseData.duration,
        type: "course",
        slug: slug || "",
        bookmarkedAt: Date.now(),
        description: courseData.description
      };
      addBookmark(bookmarkItem);
      toast({
        title: t('bookmarks.addedToBookmarks'),
        description: `${courseData.title} ${t('bookmarks.addedToBookmarks')}.`,
      });
    }
  };

  const handleEnroll = () => {
    if (enrolled) {
      toast({
        title: t('courses.alreadyEnrolled'),
        description: t('courses.alreadyEnrolledDescription'),
      });
      return;
    }
    
    const enrollmentItem: EnrolledContent = {
      id: courseData.id,
      title: courseData.title,
      author: courseData.teacherName,
      level: courseData.level,
      rating: courseData.rating,
      time: courseData.duration,
      type: "course",
      slug: slug || "",
      bookmarkedAt: Date.now(),
      enrolledAt: Date.now(),
      progress: 0,
      description: courseData.description
    };
    addEnrollment(enrollmentItem);
    toast({
      title: t('courses.enrolledSuccessfully'),
      description: t('courses.enrolledSuccessfullyDescription', { title: courseData.title }),
    });
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
          {t('common.back')}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8">
          {/* Left Content */}
          <div>
            {/* Course Header */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight capitalize">{courseData.title}</h1>
              
              {/* Price and Actions */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex gap-4 items-center flex-wrap">
                  {adminUser && (
                    <Button
                      size="default"
                      className="gap-2"
                      onClick={() => navigate(`/courses/${slug}/edit`)}
                    >
                      {t('common.edit')}
                    </Button>
                  )}
                  <Button 
                    variant={bookmarked ? "default" : "outline"} 
                    size="lg" 
                    className="gap-2" 
                    onClick={handleSave}
                  >
                    {bookmarked ? (
                      <BookmarkCheck className="h-5 w-5 fill-current" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </Button>
                  
                  {/* Featured Enroll Button with Coin Display - Only for students */}
                  {canJoinCourse && (
                    <Button 
                      size="lg" 
                      className="gap-2 px-8 py-3 text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105" 
                      onClick={handleEnroll}
                      disabled={enrolled}
                    >
                      {enrolled ? (
                        t('courseDetail.enrolled')
                      ) : (
                        <>
                          <Coins className="h-5 w-5" />
                          {courseData.price} {t('courseDetail.enrollWithCoins')}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">{t('courseDetail.description')}</h2>
                <p className="text-muted-foreground leading-7">
                  {courseData.description}
                </p>
              </div>

              {/* Details Section */}
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">{t('courseDetail.details')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors group"
                    onClick={() => navigate(`/instructor/${courseData.teacherId}`)}
                  >
                    <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{t('courseDetail.teacher')}</p>
                      <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">{courseData.teacherName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{t('courseDetail.duration')}</p>
                      <p className="text-sm text-muted-foreground">{courseData.duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{t('courseDetail.certificate')}</p>
                      <p className="text-sm text-muted-foreground">
                        {courseData.certification ? t('courseDetail.certified') : t('courseDetail.nonCertified')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <ListChecks className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{t('courseDetail.content')}</p>
                      <p className="text-sm text-muted-foreground">
                        {courseData.lessonsCount} {t('courseDetail.lessons')}, {courseData.examsCount} {t('courseDetail.exams')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">{t('courseDetail.skillsYouWillGain')}</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                    <p className="leading-7"><span className="font-semibold">{t('courseDetail.skills.designWorkshops')}</span></p>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                    <p className="leading-7"><span className="font-semibold">{t('courseDetail.skills.brainstorming')}</span></p>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                    <p className="leading-7"><span className="font-semibold">{t('courseDetail.skills.remoteWorkshops')}</span></p>
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

            {/* Participants List - Only for Admin and Teachers */}
            {canViewParticipants && (
              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Kurs Katılımcıları</h3>
                  <span className="text-sm text-muted-foreground">({courseData.participants.length})</span>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {courseData.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{participant.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{participant.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enrolled Content - Only for enrolled students */}
            {enrolled && !canViewParticipants && (
              <div className="space-y-6">
                {/* Zoom Link Section */}
                <div className="rounded-lg border bg-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Video className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Canlı Eğitim</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Zoom Linki</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(enrolledContent.zoomLink);
                            toast({
                              title: "Link kopyalandı",
                              description: "Zoom linki panoya kopyalandı.",
                            });
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          value={enrolledContent.zoomLink}
                          readOnly
                          className="flex-1"
                        />
                        <Button
                          onClick={() => window.open(enrolledContent.zoomLink, '_blank')}
                          size="sm"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Katıl
                        </Button>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Şifre: <span className="font-mono">{enrolledContent.zoomPassword}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Materials Section */}
                <div className="rounded-lg border bg-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Eğitim İçerikleri</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {enrolledContent.courseMaterials.map((material) => (
                      <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          {material.type === 'video' ? (
                            <Video className="h-5 w-5 text-red-500" />
                          ) : (
                            <FileText className="h-5 w-5 text-blue-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium">{material.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {material.type === 'video' ? material.duration : material.size}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Mock download/view action
                            console.log(`Opening ${material.title}`);
                            toast({
                              title: "İçerik açılıyor",
                              description: `${material.title} açılıyor...`,
                            });
                          }}
                        >
                          {material.type === 'video' ? (
                            <Play className="h-4 w-4 mr-1" />
                          ) : (
                            <Download className="h-4 w-4 mr-1" />
                          )}
                          {material.type === 'video' ? 'İzle' : 'İndir'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
