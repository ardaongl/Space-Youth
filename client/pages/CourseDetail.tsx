import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CheckCircle2, Clock, ShieldCheck, BookOpen, ListChecks, ArrowLeft, Bookmark, BookmarkCheck, Coins, Play } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { isAdmin } from "@/utils/roles";
import { useBookmarks, BookmarkedContent, EnrolledContent } from "@/context/BookmarksContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { t } = useLanguage();
  const adminUser = isAdmin(auth.user?.role);
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
    ]
  };

  const bookmarked = isBookmarked(courseData.id);
  const enrolled = isEnrolled(courseData.id);

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
                  
                  {/* Featured Enroll Button with Coin Display */}
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

            
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
