import { useEffect, useMemo, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { ArrowRight, CheckCircle2, Clock, Bookmark, Bell, Briefcase, GraduationCap, Target, Users, Flame, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { EventCalendar } from "@/components/ui/event-calendar";
import { useLanguage } from "@/context/LanguageContext";
import { apis } from "@/services";
import { useAppSelector } from "@/store";
import { Video } from "@shared/api";
import { VideoCard } from "@/components/Videos/VideoCard";

function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:brightness-110">
      {children}
    </button>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border bg-card shadow-sm w-full ${className}`}>{children}</div>
  );
}

interface DashboardTask {
  id?: string | number;
  title: string;
  coins: number;
  level?: string | null;
  duration?: string | null;
  description?: string | null;
  href?: string;
}

interface DashboardCourse {
  id: number | string;
  title: string;
  description?: string;
  level?: string | null;
  duration?: string | null;
  coins?: number | null;
  status?: string | null;
  labels: number[];
  slug: string;
  href: string;
  image_url?: string | null;
}

const createSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

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

function pickRandom<T>(items: T[], count: number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

export default function Home() {
  const { t } = useLanguage();
  const userToken = useAppSelector((state) => state.user.token);
  const userLabels = useAppSelector((state) => state.user.user?.labels ?? []);
  const userLabelIds = useMemo(
    () =>
      Array.isArray(userLabels)
        ? userLabels
            .map((label) => {
              if (typeof label === "object" && label && "id" in label) {
                return (label as { id: number }).id;
              }
              return null;
            })
            .filter((id): id is number => typeof id === "number")
        : [],
    [userLabels],
  );
  const isAuthenticated = Boolean(userToken);
  const [recommendedTasks, setRecommendedTasks] = useState<DashboardTask[]>([]);
  const [recommendedTutorialVideos, setRecommendedTutorialVideos] = useState<Video[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<DashboardCourse[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setRecommendedTasks([]);
      setRecommendedTutorialVideos([]);
      setRecommendedCourses([]);
      return;
    }

    let isMounted = true;

    const fetchRecommendedTasks = async () => {
      try {
        const [tasksResponse, completedResponse] = await Promise.all([
          apis.task.get_tasks(),
          apis.task.get_user_completed_tasks(),
        ]);

        if (!isMounted) return;

        if (tasksResponse?.status === 200 && Array.isArray(tasksResponse.data)) {
          const completedTaskIds = new Set<string>();

          if (completedResponse?.status === 200 && Array.isArray(completedResponse.data)) {
            completedResponse.data.forEach((item: any) => {
              const completedId = item?.task?.id;
              if (completedId) {
                completedTaskIds.add(completedId);
              }
            });
          }

          const availableTasks = tasksResponse.data.filter((task: any) => task?.id && !completedTaskIds.has(task.id));

          if (availableTasks.length > 0) {
            const selectedTasks = pickRandom(availableTasks, 2).map((task: any) => ({
              id: task.id,
              title: task.name,
              coins: typeof task.point === "number" ? task.point : Number(task.point) || 0,
              level: task.level,
              description: task.description,
              href: `/tasks/${task.id}`,
            }));
            setRecommendedTasks(selectedTasks);
          } else {
            setRecommendedTasks([]);
          }
        } else {
          setRecommendedTasks([]);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to load recommended tasks:", error);
        setRecommendedTasks([]);
      }
    };

    fetchRecommendedTasks();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const fallbackTasks = useMemo<DashboardTask[]>(() => [
    { id: "sample-1", title: t('tasks.sampleTask1'), coins: 120, level: "intermediate", duration: `2${t('common.hours')}`, href: "/tasks" },
    { id: "sample-2", title: t('tasks.sampleTask2'), coins: 100, level: "beginner", duration: `1.5${t('common.hours')}`, href: "/tasks" },
  ], [t]);

  const tasksToRender = recommendedTasks.length > 0 ? recommendedTasks : fallbackTasks;

  useEffect(() => {
    if (!isAuthenticated) {
      setRecommendedCourses([]);
      return;
    }

    let isMounted = true;

    const fetchRecommendedCourses = async () => {
      try {
        const [coursesResponse, attendedResponse] = await Promise.all([
          apis.course.get_courses(),
          apis.course.attended_courses(),
        ]);

        if (!isMounted) return;

        const allCourses: DashboardCourse[] = Array.isArray(coursesResponse?.data)
          ? coursesResponse.data
              .map((course: any) => {
                const status = typeof course?.status === "string" ? course.status : null;
                if (status !== "ACTIVE") return null;

                const courseId = course?.id ?? course?.course_id;
                if (typeof courseId !== "number" && typeof courseId !== "string") {
                  return null;
                }

                const labels: number[] = Array.isArray(course?.labels)
                  ? course.labels
                      .map((label: any) => {
                        if (typeof label === "number") return label;
                        if (label && typeof label?.id === "number") return label.id;
                        return null;
                      })
                      .filter((id): id is number => typeof id === "number")
                  : [];

                const title: string = course?.title ?? course?.name ?? t('courses.sampleTitle');
                const slugFromApi =
                  typeof course?.slug === "string" && course.slug.trim().length > 0
                    ? course.slug.trim()
                    : createSlug(title);
                const fallbackSlug =
                  typeof courseId === "string"
                    ? courseId
                    : `course-${courseId}`;
                const slug = slugFromApi.length > 0 ? slugFromApi : fallbackSlug;

                return {
                  id: courseId,
                  title,
                  description: course?.description ?? "",
                  level: course?.level ?? "",
                  duration:
                    typeof course?.duration === "string"
                      ? course.duration
                      : typeof course?.duration === "number"
                        ? `${course.duration}${t('common.hours')}`
                        : "",
                  coins: typeof course?.points === "number" ? course.points : null,
                  status,
                  labels,
                  slug,
                  href: `/courses/${slug}`,
                  image_url: course?.image_url ?? null,
                } as DashboardCourse;
              })
              .filter((course): course is DashboardCourse => course !== null)
          : [];

        const attendedIds = new Set<number | string>(
          Array.isArray(attendedResponse?.data)
            ? attendedResponse.data
                .map((course: any) => course?.course_id ?? course?.id ?? course)
                .filter((id: any) => typeof id === "number" || typeof id === "string")
            : [],
        );

        const unAttendedCourses = allCourses.filter((course) => !attendedIds.has(course.id));

        let labelMatchedCourses: DashboardCourse[] = [];
        if (userLabelIds.length > 0) {
          labelMatchedCourses = unAttendedCourses.filter((course) =>
            course.labels.some((labelId) => userLabelIds.includes(labelId)),
          );
        }

        const recommendationPool =
          labelMatchedCourses.length > 0 ? labelMatchedCourses : unAttendedCourses;

        const selectedCourses = pickRandom(recommendationPool, Math.min(4, recommendationPool.length));

        if (selectedCourses.length < 4) {
          const selectedIds = new Set(selectedCourses.map((course) => course.id));
          const fallbackPool = unAttendedCourses.filter((course) => !selectedIds.has(course.id));
          const fallbackSelection = pickRandom(
            fallbackPool,
            Math.min(4 - selectedCourses.length, fallbackPool.length),
          );
          selectedCourses.push(...fallbackSelection);
        }

        setRecommendedCourses(selectedCourses.slice(0, 4));
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to load recommended courses:", error);
        setRecommendedCourses([]);
      }
    };

    fetchRecommendedCourses();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, userLabelIds, t]);

  useEffect(() => {
    if (!isAuthenticated) {
      setRecommendedTutorialVideos([]);
      return;
    }

    let isMounted = true;

    const tutorialToVideo = (tutorial: any): Video => {
      const fallbackUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      return {
        id: tutorial.id ?? `tutorial-${Math.random().toString(36).slice(2)}`,
        title: tutorial.title ?? t('tutorials.untitledVideo'),
        description: tutorial.description ?? "",
        videoUrl: tutorial.video_url || tutorial.videoUrl || fallbackUrl,
        duration: tutorial.duration ?? undefined,
        category: tutorial.category ?? "Tutorial",
        teacherId: tutorial.teacher_id ?? "",
        teacherName: tutorial.teacher_name ?? "Space Youth",
        createdAt: tutorial.created_at ?? new Date().toISOString(),
        updatedAt: tutorial.updated_at ?? new Date().toISOString(),
        thumbnailUrl: tutorial.thumbnail_url ?? tutorial.thumbnailUrl ?? undefined,
        views: tutorial.views ?? 0,
        likes: tutorial.likes ?? 0,
      };
    };

    const fetchRecommendedTutorials = async () => {
      try {
        const tutorialsResponse = await apis.tutorial.get_tutorials();

        if (!isMounted) return;

        const tutorialsData = Array.isArray(tutorialsResponse?.data)
          ? tutorialsResponse.data
          : Array.isArray(tutorialsResponse?.data?.data)
            ? tutorialsResponse.data.data
            : [];

        if (tutorialsResponse?.status === 200 && tutorialsData.length > 0) {
          const selectedTutorials = pickRandom(tutorialsData, 3).map((tutorial: any) => tutorialToVideo(tutorial));
          setRecommendedTutorialVideos(selectedTutorials);
        } else {
          setRecommendedTutorialVideos([]);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to load recommended tutorials:", error);
        setRecommendedTutorialVideos([]);
      }
    };

    fetchRecommendedTutorials();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, t]);

  const fallbackTutorialVideos = useMemo<Video[]>(() => [
    {
      id: "tutorial-sample-1",
      title: t('tutorials.reactHooks'),
      description: t('tutorials.subtitle'),
      videoUrl: "https://www.youtube.com/watch?v=dpw9EHDh2bM",
      duration: `30 ${t('common.minutes')}`,
      category: "Tutorial",
      teacherId: "space-youth",
      teacherName: "Space Youth",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 1250,
      likes: 320,
    },
    {
      id: "tutorial-sample-2",
      title: "CSS Grid Layout",
      description: t('tutorials.subtitle'),
      videoUrl: "https://www.youtube.com/watch?v=EFafSYg-PkI",
      duration: `45 ${t('common.minutes')}`,
      category: "Tutorial",
      teacherId: "space-youth",
      teacherName: "Space Youth",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 980,
      likes: 210,
    },
    {
      id: "tutorial-sample-3",
      title: t('tutorials.typescriptBasics'),
      description: t('tutorials.subtitle'),
      videoUrl: "https://www.youtube.com/watch?v=gp5H0Vw39yw",
      duration: `1 ${t('common.hours')}`,
      category: "Tutorial",
      teacherId: "space-youth",
      teacherName: "Space Youth",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 1420,
      likes: 275,
    },
  ], [t]);

  const tutorialsToRender = recommendedTutorialVideos.length > 0 ? recommendedTutorialVideos : fallbackTutorialVideos;

  const getLevelLabel = (level?: string | null) => {
    if (!level) return null;
    const normalized = level.toLowerCase();
    switch (normalized) {
      case "beginner":
        return t('courses.beginner');
      case "intermediate":
        return t('courses.intermediate');
      case "advanced":
        return t('courses.advanced');
      default:
        return level;
    }
  };
  
  // Sample events data - replace with actual data from your backend
  const sampleEvents = [
    { id: '1', date: new Date(2025, 9, 8), title: 'AI Workshop', color: 'bg-blue-500' },
    { id: '2', date: new Date(2025, 9, 8), title: 'Team Meeting', color: 'bg-green-500' },
    { id: '3', date: new Date(2025, 9, 10), title: 'Design Sprint', color: 'bg-purple-500' },
    { id: '4', date: new Date(2025, 9, 15), title: 'Code Review', color: 'bg-amber-500' },
    { id: '5', date: new Date(2025, 9, 20), title: 'Project Demo', color: 'bg-rose-500' },
  ];

  // TODO: Date and streak sections temporarily removed - keep code for future use
  const Right = (
    <aside className="hidden lg:block sticky top-[4.5rem] h-max space-y-4">
      {/* Takvim - TEMPORARILY COMMENTED OUT */}
      {/* <Card className="p-0 overflow-hidden">
        <EventCalendar 
          events={sampleEvents}
          onDateSelect={(date) => console.log('Selected date:', date)}
        />
      </Card> */}

      {/* Streak - TEMPORARILY COMMENTED OUT */}
      {/* <Card className="p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold text-white text-lg">Streak</div>
            <Flame className="h-6 w-6 text-purple-200" />
          </div>
          <div className="flex items-center justify-between gap-2">
            {[
              { day: 1, coins: 10, completed: true },
              { day: 2, coins: 20, completed: true },
              { day: 3, coins: 30, completed: false },
              { day: 4, coins: 40, completed: false },
              { day: 5, coins: 50, completed: false },
              { day: 6, coins: 60, completed: false },
              { day: 7, coins: 70, completed: false }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div className="text-[10px] text-gray-400 font-medium">Gün {item.day}</div>
                <div className="relative">
                  <Flame 
                    className={`h-10 w-10 ${
                      item.completed 
                        ? 'text-purple-200 fill-purple-200' 
                        : 'text-gray-500 fill-gray-700'
                    }`} 
                  />
                </div>
                <div className={`text-[11px] font-semibold ${
                  item.completed ? 'text-white' : 'text-gray-400'
                }`}>
                  {item.coins}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card> */}
    </aside>
  );

  return (
    <AppLayout>
      <div className="py-4 sm:py-6 space-y-8 sm:space-y-12 w-full max-w-full overflow-x-hidden">
        {/* Önerilen Görevler */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold">{t('dashboard.recommendedTasks')}</h2>
            </div>
            <Link to="/tasks" className="text-sm sm:text-base text-muted-foreground hover:underline">{t('common.viewAll')}</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
            {tasksToRender.map((task, i) => {
              const levelLabel = getLevelLabel(task.level);
              const durationLabel = task.duration;
              const description = task.description;
              const coinsLabel = typeof task.coins === "number" && !Number.isNaN(task.coins) ? task.coins : 0;
              const taskHref = task.href || (task.id ? `/tasks/${task.id}` : "/tasks");

              return (
              <Card key={task.id ?? i} className="p-6 sm:p-8 lg:p-12 hover:shadow-lg transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm sm:text-base">{task.title}</h3>
                    {(durationLabel || levelLabel) && (
                      <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground">
                        {durationLabel && (
                          <span className="flex items-center gap-1 sm:gap-1.5">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" /> {durationLabel}
                          </span>
                        )}
                        {levelLabel && <span>{levelLabel}</span>}
                      </div>
                    )}
                    {description && (
                      <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground line-clamp-2">
                        {description}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm sm:text-base font-semibold text-yellow-600">{coinsLabel} {t('common.coins')}</div>
                  </div>
                </div>
                <Link to={taskHref} className="mt-3 sm:mt-4 inline-block text-sm sm:text-base text-primary hover:underline font-medium">
                  {t('tasks.viewTask')} →
                </Link>
              </Card>
            )})}
          </div>
        </section>

        {/* Önerilen Kurslar */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold">{t('dashboard.recommendedCourses')}</h2>
            </div>
            <Link to="/courses" className="text-xs sm:text-sm text-muted-foreground hover:underline">{t('common.viewAll')}</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
            {recommendedCourses.length === 0 ? (
              <Card className="p-6 text-sm text-muted-foreground flex items-center justify-center">
                {t('courses.noRecommendedCourses') ?? "Önerilen kurs bulunamadı."}
              </Card>
            ) : (
              recommendedCourses.map((course) => (
              <Card key={course.id} className="p-4 sm:p-6 hover:shadow-lg transition">
                <div className="relative">
                  <div className="aspect-[5/3] w-full rounded-xl bg-accent overflow-hidden mb-3 sm:mb-4 relative">
                    {buildImageUrl(course.image_url) ? (
                      <img 
                        src={buildImageUrl(course.image_url) || ''}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : null}
                    {(!buildImageUrl(course.image_url) || course.image_url === null) && (
                      <div className="absolute inset-0 w-full h-full grid place-items-center">
                        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg bg-secondary" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-[8px] sm:text-[10px] font-semibold tracking-widest text-muted-foreground">
                  {t('courses.courseType').toUpperCase()}
                </div>
                <div className="mt-1 text-base sm:text-lg font-semibold line-clamp-2">{course.title}</div>
                {course.description && (
                  <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>
                )}
                {(course.level || course.duration) && (
                  <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
                    {course.duration && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary" /> {course.duration}
                      </span>
                    )}
                    {course.level && <span className="inline-flex items-center gap-1">{getLevelLabel(course.level)}</span>}
                  </div>
                )}
                {typeof course.coins === "number" && (
                  <div className="mt-3 text-sm sm:text-base font-semibold text-yellow-600">
                    {course.coins} {t('common.coins')}
                  </div>
                )}
                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <Link to={course.href} className="rounded-full border px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm">
                    {t('courses.viewCourse')}
                  </Link>
                </div>
              </Card>
            )))}
          </div>
        </section>

        {/* Önerilen Eğitimler (Tutorials) */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div className="flex items-center gap-2">
              <Bookmark className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold">{t('dashboard.recommendedTutorials')}</h2>
            </div>
            <Link to="/tutorials" className="text-sm sm:text-base text-muted-foreground hover:underline">{t('common.viewAll')}</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
            {tutorialsToRender.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>

      </div>
    </AppLayout>
  );
}