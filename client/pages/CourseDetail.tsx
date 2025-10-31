import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CheckCircle2, Clock, ShieldCheck, BookOpen, ListChecks, ArrowLeft, Bookmark, BookmarkCheck, Coins, Play, Users, Video, FileText, Download, ExternalLink, Copy } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { isAdmin, isTeacher } from "@/utils/roles";
import { useBookmarks } from "@/hooks/useBookmarks";
import { BookmarkedContent, EnrolledContent } from "@/store/slices/bookmarksSlice";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { useAppSelector } from "@/store";
import { apis } from "@/services";

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

  const [courseData, setCourseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Find course ID from slug by fetching courses list
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        console.log('🔍 CourseDetail: Fetching course data for slug:', slug);
        
        // First, get all courses to find the one matching the slug
        const coursesResponse = await apis.course.get_courses();
        
        if (coursesResponse.status === 200 && coursesResponse.data) {
          console.log('📚 All courses fetched:', coursesResponse.data.length);
          
          // Find course by matching slug (title -> slug conversion)
          const matchingCourse = coursesResponse.data.find((course: any) => {
            const courseSlug = course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            return courseSlug === slug;
          });

          if (matchingCourse) {
            console.log('✅ Found matching course:', matchingCourse.id, matchingCourse.title);
            
            // Now fetch full course details
            const courseResponse = await apis.course.get_course(matchingCourse.id.toString());
            
            if (courseResponse.status === 200 && courseResponse.data) {
              console.log('✅ Course details fetched successfully');
              setCourseData(courseResponse.data);
            } else {
              console.error('❌ Failed to fetch course details:', courseResponse);
              setError('Kurs detayları yüklenemedi');
            }
          } else {
            console.error('❌ No course found for slug:', slug);
            setError('Kurs bulunamadı');
          }
        } else {
          console.error('❌ Failed to fetch courses:', coursesResponse);
          setError('Kurslar yüklenemedi');
        }
      } catch (err) {
        console.error('❌ Error in fetchCourseData:', err);
        setError('Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCourseData();
    }
  }, [slug]);

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto py-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('common.loading') || 'Yükleniyor...'}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !courseData) {
    return (
      <AppLayout>
        <div className="container mx-auto py-6">
          <div className="text-center py-12">
            <p className="text-destructive">{error || 'Kurs bulunamadı'}</p>
            <Button onClick={() => navigate('/courses')} className="mt-4">
              {t('common.back')}
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Transform API data to match component expectations
  const transformedCourseData = {
    id: courseData.id?.toString() || `course-${slug}`,
    title: courseData.title || 'Untitled Course',
    description: courseData.description || '',
    price: courseData.points || 250,
    teacherId: courseData.teacher?.id || '',
    teacherName: courseData.teacher 
      ? `${courseData.teacher.first_name || ''} ${courseData.teacher.last_name || ''}`.trim()
      : 'Unknown Teacher',
    duration: courseData.duration 
      ? `${courseData.duration} dakika`
      : 'N/A',
    level: courseData.level || 'N/A',
    rating: courseData.points?.toString() || '0',
    certification: !!courseData.certificate_url,
    lessonsCount: courseData.lessons?.length || 0,
    examsCount: 0, // API'de exams yok şimdilik
    image_url: courseData.image_url,
    certificate_url: courseData.certificate_url,
    lessons: courseData.lessons || [],
    labels: courseData.labels || [],
    teacher: courseData.teacher,
    participants: [] // TODO: API'den participants endpoint'i eklendiğinde
  };

  const bookmarked = isBookmarked(transformedCourseData.id);
  const enrolled = isEnrolled(transformedCourseData.id);
  
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
      removeBookmark(transformedCourseData.id);
      toast({
        title: t('bookmarks.removedFromBookmarks'),
        description: `${transformedCourseData.title} ${t('bookmarks.removedFromBookmarks')}.`,
      });
    } else {
      const bookmarkItem: BookmarkedContent = {
        id: transformedCourseData.id,
        title: transformedCourseData.title,
        author: transformedCourseData.teacherName,
        level: transformedCourseData.level,
        rating: transformedCourseData.rating,
        time: transformedCourseData.duration,
        type: "course",
        slug: slug || "",
        bookmarkedAt: Date.now(),
        description: transformedCourseData.description
      };
      addBookmark(bookmarkItem);
      toast({
        title: t('bookmarks.addedToBookmarks'),
        description: `${transformedCourseData.title} ${t('bookmarks.addedToBookmarks')}.`,
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
      id: transformedCourseData.id,
      title: transformedCourseData.title,
      author: transformedCourseData.teacherName,
      level: transformedCourseData.level,
      rating: transformedCourseData.rating,
      time: transformedCourseData.duration,
      type: "course",
      slug: slug || "",
      bookmarkedAt: Date.now(),
      enrolledAt: Date.now(),
      progress: 0,
      description: transformedCourseData.description
    };
    addEnrollment(enrollmentItem);
    toast({
      title: t('courses.enrolledSuccessfully'),
      description: t('courses.enrolledSuccessfullyDescription', { title: transformedCourseData.title }),
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
              <h1 className="text-4xl font-bold tracking-tight">{transformedCourseData.title}</h1>
              
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
                          {transformedCourseData.price} {t('courseDetail.enrollWithCoins')}
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
                  {transformedCourseData.description}
                </p>
              </div>

              {/* Details Section */}
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">{t('courseDetail.details')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors group"
                    onClick={() => transformedCourseData.teacherId && navigate(`/instructor/${transformedCourseData.teacherId}`)}
                  >
                    <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{t('courseDetail.teacher')}</p>
                      <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">{transformedCourseData.teacherName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{t('courseDetail.duration')}</p>
                      <p className="text-sm text-muted-foreground">{transformedCourseData.duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{t('courseDetail.certificate')}</p>
                      <p className="text-sm text-muted-foreground">
                        {transformedCourseData.certification ? t('courseDetail.certified') : t('courseDetail.nonCertified')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <ListChecks className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{t('courseDetail.content')}</p>
                      <p className="text-sm text-muted-foreground">
                        {transformedCourseData.lessonsCount} {t('courseDetail.lessons')}, {transformedCourseData.examsCount} {t('courseDetail.exams')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Labels */}
                  {transformedCourseData.labels && transformedCourseData.labels.length > 0 && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Etiketler</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {transformedCourseData.labels.map((label: any) => (
                            <span key={label.id} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                              {label.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
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

          {/* Right Sidebar - Course Image & Lessons */}
          <div className="space-y-6">
            {/* Course Photo */}
            {transformedCourseData.image_url ? (
              <div className="rounded-lg border overflow-hidden bg-muted">
                <img 
                  src={transformedCourseData.image_url} 
                  alt={transformedCourseData.title}
                  className="w-full aspect-video object-cover"
                />
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden bg-muted aspect-video flex items-center justify-center">
                <p className="text-muted-foreground">Kurs fotoğrafı yok</p>
              </div>
            )}

            {/* Course Lessons */}
            {transformedCourseData.lessons && transformedCourseData.lessons.length > 0 ? (
              transformedCourseData.lessons.length === 1 ? (
                // Single lesson - display directly
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Dersler</h3>
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg hover:bg-muted/50 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{transformedCourseData.lessons[0].title}</p>
                          <p className="text-sm text-muted-foreground mt-1">{transformedCourseData.lessons[0].content}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {transformedCourseData.lessons[0].duration} dakika
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Multiple lessons - display as list
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Dersler ({transformedCourseData.lessons.length})</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {transformedCourseData.lessons.map((lesson: any, index: number) => (
                      <div key={lesson.id || index} className="p-4 border rounded-lg hover:bg-muted/50 transition">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-primary">{index + 1}.</span>
                              <p className="font-medium">{lesson.title}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">{lesson.content}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {lesson.duration} dakika
                              </span>
                              {lesson.zoom_join_url && (
                                <a
                                  href={lesson.zoom_join_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline flex items-center gap-1"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  Zoom
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ) : null}

            {/* Participants List - Only for Admin and Teachers */}
            {canViewParticipants && transformedCourseData.participants && transformedCourseData.participants.length > 0 && (
              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Kurs Katılımcıları</h3>
                  <span className="text-sm text-muted-foreground">({transformedCourseData.participants.length})</span>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {transformedCourseData.participants.map((participant: any) => (
                    <div key={participant.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {participant.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{participant.name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground truncate">{participant.email || ''}</p>
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
