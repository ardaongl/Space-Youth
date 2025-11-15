import { Users, Video, GraduationCap, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/layout/AppLayout";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { apis } from "@/services";
import { useToast } from "@/hooks/use-toast";

interface TeacherInfo {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  about?: string;
  school?: string;
  branch?: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  level: string;
  points: number;
  duration: number;
  status?: string;
  students_count?: number;
}

export function InstructorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo | null>(null);
  const [teacherCourses, setTeacherCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to build full image URL
  const buildImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    const baseUrl = import.meta.env.VITE_BASE_URL || '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('/')) {
      return `${baseUrl}${url}`;
    }
    return `${baseUrl}/${url}`;
  };

  useEffect(() => {
    const fetchInstructorData = async () => {
      if (!id) {
        setError('Öğretmen ID bulunamadı');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch all courses to find teacher's courses
        const coursesResponse = await apis.course.get_courses();
        
        if (coursesResponse.status === 200 && coursesResponse.data) {
          // Filter courses by teacher ID
          const teacherCoursesList = coursesResponse.data.filter((course: any) => 
            course.teacher?.id === id || course.teacher_id === id
          );

          if (teacherCoursesList.length > 0) {
            // Get teacher info from first course (all courses should have same teacher)
            const firstCourse = teacherCoursesList[0];
            if (firstCourse.teacher) {
              // Filter out sensitive fields
              const safeTeacherInfo: TeacherInfo = {
                id: firstCourse.teacher.id,
                first_name: firstCourse.teacher.first_name,
                last_name: firstCourse.teacher.last_name,
                // Don't include email, password, token, or other sensitive data
                about: firstCourse.teacher.about,
                school: firstCourse.teacher.school,
                branch: firstCourse.teacher.branch,
              };
              setTeacherInfo(safeTeacherInfo);
            }

            // Transform courses data
            const transformedCourses: Course[] = teacherCoursesList
              .filter((course: any) => course.status === "ACTIVE")
              .map((course: any) => ({
                id: course.id,
                title: course.title,
                description: course.description || '',
                image_url: course.image_url,
                level: course.level || 'N/A',
                points: course.points || 0,
                duration: course.duration || 0,
                status: course.status,
                students_count: course.students?.length || 0,
              }));
            
            setTeacherCourses(transformedCourses);
          } else {
            setError('Bu öğretmene ait kurs bulunamadı');
          }
        } else {
          setError('Kurslar yüklenemedi');
        }
      } catch (err) {
        console.error('Error fetching instructor data:', err);
        setError('Öğretmen bilgileri yüklenirken bir hata oluştu');
        toast({
          title: t('error.title') || 'Hata',
          description: 'Öğretmen bilgileri yüklenemedi',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorData();
  }, [id, toast, t]);

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8 max-w-7xl">
          <div className="space-y-8">
            <Card className="p-8">
              <div className="animate-pulse">
                <div className="h-32 bg-muted rounded w-32 mb-4"></div>
                <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
              </div>
            </Card>
            <Card className="p-8">
              <div className="animate-pulse">
                <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </Card>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !teacherInfo) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8 max-w-7xl">
          <Button
            variant="ghost"
            className="mb-6 gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            {t('common.back')}
          </Button>
          <Card className="p-8">
            <div className="text-center py-12">
              <p className="text-destructive mb-4">{error || 'Öğretmen bulunamadı'}</p>
              <Button onClick={() => navigate('/courses')}>
                {t('courses.backToCourses') || 'Kurslara Dön'}
              </Button>
            </div>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const teacherName = `${teacherInfo.first_name || ''} ${teacherInfo.last_name || ''}`.trim() || 'Öğretmen';
  const teacherInitials = `${teacherInfo.first_name?.charAt(0) || ''}${teacherInfo.last_name?.charAt(0) || ''}`.toUpperCase() || 'T';

  return (
    <AppLayout>
      <div className="container mx-auto py-8 max-w-7xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Button>

        {/* Header Card */}
        <Card className="p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary to-indigo-500 text-white grid place-items-center text-2xl font-bold border-4 border-background shadow-lg">
                {teacherInitials}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{teacherName}</h1>
                {teacherInfo.school && (
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>{teacherInfo.school}</span>
                    {teacherInfo.branch && <span>• {teacherInfo.branch}</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* About Section */}
        {teacherInfo.about && (
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('instructor.about')}</h2>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {teacherInfo.about}
            </div>
          </Card>
        )}

        {/* Courses Section */}
        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-6">
            {t('instructor.myCourses')} ({teacherCourses.length})
          </h2>
          
          {teacherCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teacherCourses.map((course) => {
                const courseSlug = course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                return (
                  <div 
                    key={course.id}
                    onClick={() => navigate(`/courses/${courseSlug}`)}
                    className="cursor-pointer group"
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                      <div className="aspect-video relative overflow-hidden bg-muted">
                        {course.image_url ? (
                          <img 
                            src={buildImageUrl(course.image_url) || '/placeholder.svg'} 
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                            <Video className="h-12 w-12" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                          {course.level && (
                            <Badge variant="secondary">{course.level}</Badge>
                          )}
                          {course.students_count !== undefined && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {course.students_count.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>{t('instructor.noCourses') || 'Henüz kurs bulunmuyor'}</p>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}

