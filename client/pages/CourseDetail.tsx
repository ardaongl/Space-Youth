import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, ShieldCheck, BookOpen, ListChecks, ArrowLeft, Bookmark, BookmarkCheck, Coins, Users, Video, ExternalLink, Copy } from "lucide-react";
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
  const [isEnrolling, setIsEnrolling] = useState(false);

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

  // Helper function to build full image URL
  const buildImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    const baseUrl = import.meta.env.VITE_BASE_URL || '';
    // If URL already starts with http:// or https://, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // If URL starts with /, it's already a path, just prepend base URL
    if (url.startsWith('/')) {
      return `${baseUrl}${url}`;
    }
    // Otherwise, add / between base URL and path
    return `${baseUrl}/${url}`;
  };

  // Transform API data to match component expectations
  const transformedCourseData = {
    id: courseData.id?.toString() || `course-${slug}`,
    title: courseData.title || 'Untitled Course',
    description: courseData.description || '',
    price: courseData.points || 250,
    points: courseData.points || 0,
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
    image_url: buildImageUrl(courseData.image_url),
    video_url: buildImageUrl(courseData.video_url),
    certificate_url: buildImageUrl(courseData.certificate_url),
    lessons: courseData.lessons || [],
    labels: courseData.labels || [],
    teacher: courseData.teacher,
    students: courseData.students || [],
    participants: [] // TODO: API'den participants endpoint'i eklendiğinde
  };

  const bookmarked = isBookmarked(transformedCourseData.id);
  // Check if current user is enrolled by checking students array
  const isUserEnrolled = user.user?.id && transformedCourseData.students.some((student: any) => student.id === user.user.id);
  const enrolled = isUserEnrolled;
  
  // Find the lesson with the closest date (today or next upcoming)
  const getNextLesson = () => {
    if (!transformedCourseData.lessons || transformedCourseData.lessons.length === 0) {
      return null;
    }

    const now = new Date();

    // Filter lessons that have zoom_start_time and zoom link
    const lessonsWithDate = transformedCourseData.lessons
      .filter((lesson: any) => {
        return lesson.zoom_start_time && lesson.zoom_join_url;
      })
      .map((lesson: any) => {
        const lessonDate = new Date(lesson.zoom_start_time);
        return {
          ...lesson,
          dateObj: lessonDate,
        };
      });

    if (lessonsWithDate.length === 0) {
      return null;
    }

    // Find today's lesson first (same day), otherwise find the next upcoming lesson
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const todayLesson = lessonsWithDate.find((lesson: any) => {
      return lesson.dateObj >= todayStart && lesson.dateObj <= todayEnd;
    });

    if (todayLesson) {
      return todayLesson;
    }

    // Find the next upcoming lesson
    const upcomingLessons = lessonsWithDate.filter((lesson: any) => {
      return lesson.dateObj >= now;
    });

    if (upcomingLessons.length === 0) {
      return null;
    }

    // Sort by date and return the closest one
    upcomingLessons.sort((a: any, b: any) => {
      return a.dateObj.getTime() - b.dateObj.getTime();
    });

    return upcomingLessons[0];
  };

  const nextLesson = getNextLesson();

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

  const handleEnroll = async () => {
    if (enrolled) {
      toast({
        title: t('courses.alreadyEnrolled'),
        description: t('courses.alreadyEnrolledDescription'),
      });
      return;
    }
    
    if (isEnrolling) return; // Prevent multiple clicks
    
    try {
      setIsEnrolling(true);
      const courseId = parseInt(transformedCourseData.id);
      if (isNaN(courseId)) {
        toast({
          title: 'Hata',
          description: 'Geçersiz kurs ID',
          variant: 'destructive',
        });
        setIsEnrolling(false);
        return;
      }

      const response = await apis.course.attend_course(courseId);
      
      if (response.status === 200 || response.status === 201) {
        // Update course data to refresh students list
        const coursesResponse = await apis.course.get_courses();
        if (coursesResponse.status === 200 && coursesResponse.data) {
          const matchingCourse = coursesResponse.data.find((course: any) => {
            const courseSlug = course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            return courseSlug === slug;
          });

          if (matchingCourse) {
            const courseResponse = await apis.course.get_course(matchingCourse.id.toString());
            if (courseResponse.status === 200 && courseResponse.data) {
              setCourseData(courseResponse.data);
            }
          }
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
      } else {
        toast({
          title: 'Hata',
          description: response.data?.message || 'Kursa kayıt olunurken bir hata oluştu',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Enroll error:', error);
      toast({
        title: 'Hata',
        description: error?.response?.data?.message || 'Kursa kayıt olunurken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setIsEnrolling(false);
    }
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
                      className="gap-2 px-8 py-3 text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" 
                      onClick={handleEnroll}
                      disabled={enrolled || isEnrolling}
                    >
                      {enrolled ? (
                        "Bu kursa kayıtlısınız"
                      ) : isEnrolling ? (
                        "Kayıt olunuyor..."
                      ) : (
                        <>
                          <Coins className="h-5 w-5" />
                          {transformedCourseData.points} {t('courseDetail.enrollWithCoins')}
                        </>
                      )}
                    </Button>
                  )}
                </div>
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

              {/* Description Section */}
              {transformedCourseData.description && (
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold mb-4">{t('courseDetail.description')}</h2>
                  <p className="text-muted-foreground leading-7">
                    {transformedCourseData.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Course Image & Lessons */}
          <div className="space-y-6">
            {/* Course Video or Image */}
            {transformedCourseData.video_url ? (
              <div className="rounded-lg border overflow-hidden bg-muted">
                <video 
                  src={transformedCourseData.video_url} 
                  controls
                  className="w-full aspect-video object-cover"
                  poster={transformedCourseData.image_url || undefined}
                >
                  Tarayıcınız video oynatmayı desteklemiyor.
                </video>
              </div>
            ) : transformedCourseData.image_url ? (
              <div className="rounded-lg border overflow-hidden bg-muted">
                <img 
                  src={transformedCourseData.image_url} 
                  alt={transformedCourseData.title}
                  className="w-full aspect-video object-cover"
                />
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden bg-muted aspect-video flex items-center justify-center">
                <p className="text-muted-foreground">Kurs içeriği yok</p>
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
                          {transformedCourseData.lessons[0].zoom_join_url && (
                            <Button
                              size="sm"
                              className="mt-3 gap-2"
                              onClick={() => window.open(transformedCourseData.lessons[0].zoom_join_url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                              {t('courseDetail.joinZoom')}
                            </Button>
                          )}
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
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {lesson.duration} dakika
                                </span>
                              </div>
                              {lesson.zoom_join_url && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-2"
                                  onClick={() => window.open(lesson.zoom_join_url, '_blank')}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  {t('courseDetail.joinZoom')}
                                </Button>
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

            {/* Students List - Show enrolled students */}
            {transformedCourseData.students && transformedCourseData.students.length > 0 && (
              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Kursa Kayıtlı Öğrenciler</h3>
                  <span className="text-sm text-muted-foreground">({transformedCourseData.students.length})</span>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {transformedCourseData.students.map((student: any) => (
                    <div key={student.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {student.first_name?.[0]?.toUpperCase() || ''}{student.last_name?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {student.first_name || ''} {student.last_name || ''}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{student.email || ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
            {enrolled && !canViewParticipants && nextLesson && (
              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Video className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Canlı Eğitim</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="mb-2">
                      <p className="text-sm font-medium mb-1">{nextLesson.title}</p>
                      {nextLesson.content && (
                        <p className="text-xs text-muted-foreground">{nextLesson.content}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Zoom Linki</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (nextLesson.zoom_join_url) {
                            navigator.clipboard.writeText(nextLesson.zoom_join_url);
                            toast({
                              title: "Link kopyalandı",
                              description: "Zoom linki panoya kopyalandı.",
                            });
                          }
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        value={nextLesson.zoom_join_url || ''}
                        readOnly
                        className="flex-1"
                      />
                      <Button
                        onClick={() => nextLesson.zoom_join_url && window.open(nextLesson.zoom_join_url, '_blank')}
                        size="sm"
                        disabled={!nextLesson.zoom_join_url}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Katıl
                      </Button>
                    </div>
                    {nextLesson.zoom_password && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        Şifre: <span className="font-mono">{nextLesson.zoom_password}</span>
                      </div>
                    )}
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
