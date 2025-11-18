import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Clock, ShieldCheck, BookOpen, ListChecks, ArrowLeft, Bookmark, BookmarkCheck, Coins, Users, Video, ExternalLink } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { isAdmin, isTeacher } from "@/utils/roles";
import { useBookmarks } from "@/hooks/useBookmarks";
import { BookmarkedContent, EnrolledContent } from "@/store/slices/bookmarksSlice";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { useAppDispatch, useAppSelector } from "@/store";
import { apis } from "@/services";
import { setUser } from "@/store/slices/userSlice";
import { UserProfileView } from "@/components/UserProfileView";

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

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

  const formatLessonDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return null;

    return {
      date: date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
    };
  };

  const translate = (
    key: string,
    fallback: string,
    params?: Record<string, string | number>
  ) => {
    const translation = t(key, params);
    return translation === key ? fallback : translation;
  };

  const lessonScheduleTitle = translate('courseDetail.lessonSchedule', 'Ders Programı');
  const zoomLinkInfoText = translate(
    'courseDetail.zoomLinkInfo',
    'Zoom bağlantısı ders başlangıcında aktif olacaktır.'
  );
  const todayLessonTitle = translate('courseDetail.todayLesson', 'Günün Dersleri');
  const joinZoomLabel = translate('courseDetail.joinZoom', 'Zooma Katıl');
  const zoomPasswordLabel = translate('courseDetail.zoomPassword', 'Şifre');
  const noScheduledTimeText = translate('courseDetail.noScheduledTime', 'Tarih bilgisi bulunmuyor');
  const noLessonTodayText = translate('courseDetail.noLessonToday', 'Bugün dersiniz yok.');
  const zoomLinkActiveSoonText = translate(
    'courseDetail.zoomLinkActiveSoon',
    'Zoom bağlantısı ders başlamadan 15 dakika önce aktif olacaktır.'
  );

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

  const lessonsWithDate = (transformedCourseData.lessons || [])
    .filter((lesson: any) => lesson.zoom_start_time)
    .map((lesson: any) => {
      const lessonDate = new Date(lesson.zoom_start_time);
      if (Number.isNaN(lessonDate.getTime())) {
        return null;
      }

      return {
        ...lesson,
        dateObj: lessonDate,
      };
    })
    .filter(
      (lesson: any): lesson is any & { dateObj: Date } => Boolean(lesson)
    );

  const todayLessons = (() => {
    if (lessonsWithDate.length === 0) {
      return [];
    }

    const todayStart = new Date(currentTime);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(currentTime);
    todayEnd.setHours(23, 59, 59, 999);

    return lessonsWithDate
      .filter((lesson: any) => lesson.dateObj >= todayStart && lesson.dateObj <= todayEnd)
      .sort((a: any, b: any) => a.dateObj.getTime() - b.dateObj.getTime());
  })();

  const isJoinAvailable = (lessonDate: Date) => {
    const activationTime = new Date(lessonDate.getTime() - 15 * 60 * 1000);
    return currentTime >= activationTime;
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
      console.log(courseId);
      
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

        try {
          const userResponse = await apis.user.get_user();
          if (userResponse.status === 200 && userResponse.data) {
            const existingUser = user.user;
            if (existingUser) {
              dispatch(
                setUser({
                  ...existingUser,
                  points:
                    typeof userResponse.data.points === "number"
                      ? userResponse.data.points
                      : existingUser.points || 0,
                })
              );
            }
          }
        } catch (userRefreshError) {
          console.error("Failed to refresh user data:", userRefreshError);
        }
        
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
                    <div 
                      key={student.id} 
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedUserId(student.id);
                        setIsProfileModalOpen(true);
                      }}
                    >
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
                    <div 
                      key={participant.id} 
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => {
                        if (participant.id) {
                          setSelectedUserId(participant.id);
                          setIsProfileModalOpen(true);
                        }
                      }}
                    >
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
              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Video className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">{todayLessonTitle}</h3>
                </div>
                
                {todayLessons.length > 0 ? (
                  <div className="space-y-3">
                    {todayLessons.map((lesson: any, index: number) => {
                      const formatted = formatLessonDateTime(lesson.zoom_start_time);
                      const joinEnabled = isJoinAvailable(lesson.dateObj);

                      return (
                        <div
                          key={lesson.id || `${lesson.zoom_start_time}-${index}`}
                          className="p-4 bg-muted/50 rounded-lg"
                        >
                          <div className="mb-3">
                            <p className="text-sm font-medium mb-1">{lesson.title}</p>
                            {lesson.content && (
                              <p className="text-xs text-muted-foreground">{lesson.content}</p>
                            )}
                          </div>
                          {formatted && (
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                              <span>{formatted.date}</span>
                              <span>{formatted.time}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{joinZoomLabel}</span>
                            <Button
                              onClick={() => lesson.zoom_join_url && window.open(lesson.zoom_join_url, '_blank')}
                              size="sm"
                              disabled={!joinEnabled || !lesson.zoom_join_url}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              {joinZoomLabel}
                            </Button>
                          </div>
                          {!joinEnabled && (
                            <p className="mt-3 text-xs text-muted-foreground">
                              {zoomLinkActiveSoonText}
                            </p>
                          )}
                          {joinEnabled && lesson.zoom_password && (
                            <div className="mt-3 text-sm text-muted-foreground">
                              {`${zoomPasswordLabel}: `}
                              <span className="font-mono">{lesson.zoom_password}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">{noLessonTodayText}</p>
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>
        {transformedCourseData.lessons && transformedCourseData.lessons.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">{lessonScheduleTitle}</h2>
            <div className="grid gap-4">
              {transformedCourseData.lessons.map((lesson: any, index: number) => {
                const formatted = formatLessonDateTime(lesson.zoom_start_time);

                return (
                  <div key={lesson.id || index} className="rounded-lg border bg-card p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-primary">{index + 1}.</span>
                          <p className="font-medium">{lesson.title}</p>
                        </div>
                        {lesson.content && (
                          <p className="text-sm text-muted-foreground">{lesson.content}</p>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground text-right min-w-[140px]">
                        {formatted ? (
                          <>
                            <p>{formatted.date}</p>
                            <p>{formatted.time}</p>
                          </>
                        ) : (
                          <p>{noScheduledTimeText}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      {lesson.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lesson.duration} dakika
                        </span>
                      )}
                      {lesson.zoom_start_time && (
                        <span>{zoomLinkInfoText}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* User Profile Modal */}
      {selectedUserId && (
        <UserProfileView
          userId={selectedUserId}
          open={isProfileModalOpen}
          onOpenChange={setIsProfileModalOpen}
        />
      )}
    </AppLayout>
  );
}
