import AppLayout from "@/components/layout/AppLayout";
import { Link } from "react-router-dom";
import { Clock, Trophy, Bookmark, BookmarkCheck } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import AddCourseButton from "@/components/Courses/AddCourseButton";
import { useBookmarks } from "@/hooks/useBookmarks";
import { BookmarkedContent } from "@/store/slices/bookmarksSlice";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { apis } from "@/services";
import { useAppSelector } from "@/store";
import { isTeacher } from "@/utils/roles";

interface CourseData {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  video_url: string | null;
  category: string;
  level: string;
  duration: number;
  certificate_url: string | null;
  points: number;
  teacher?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

function CourseCard({
  id,
  to,
  title,
  author,
  level,
  rating,
  time,
  popular,
  slug,
  imageUrl,
}: {
  id: string;
  to: string;
  title: string;
  author: string;
  level: string;
  rating: string;
  time: string;
  popular?: boolean;
  slug: string;
  imageUrl?: string | null;
}) {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const { toast } = useToast();
  const { t } = useLanguage();
  const bookmarked = isBookmarked(id);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (bookmarked) {
      removeBookmark(id);
      toast({
        title: t('success.deleted'),
        description: t('bookmarks.removedFromBookmarks', { title }),
      });
    } else {
      const bookmarkItem: BookmarkedContent = {
        id,
        title,
        author,
        level,
        rating,
        time,
        type: "course",
        slug,
        bookmarkedAt: Date.now(),
        description: t('courses.sampleDescription')
      };
      addBookmark(bookmarkItem);
      toast({
        title: t('success.saved'),
        description: t('bookmarks.addedToBookmarks', { title }),
      });
    }
  };

  return (
    <Link
      to={to}
      className="group rounded-2xl border bg-card shadow-sm hover:shadow-md transition overflow-hidden"
    >
      <div className="relative p-5 pb-0">
        {popular && (
          <span className="absolute left-5 top-5 z-10 rounded-full bg-amber-100 text-amber-800 text-[11px] font-semibold px-2 py-0.5 border border-amber-200">
            {t('courses.popular')}
          </span>
        )}
        <button 
          onClick={handleBookmark}
          className="absolute right-5 top-5 z-10 p-1.5 rounded-full bg-background/80 border opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground transition"
        >
          {bookmarked ? (
            <BookmarkCheck className="h-4 w-4 fill-current" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </button>
        <div className="aspect-[5/4] w-full rounded-xl bg-accent grid place-items-center overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover"/>
          ) : (
            <img src="/placeholder.svg" alt="course" className="h-24 opacity-70"/>
          )}
        </div>
      </div>
      <div className="p-5">
        <div className="text-[11px] font-semibold tracking-widest text-muted-foreground">{t('courses.courseType')}</div>
        <div className="mt-1 text-lg font-semibold leading-snug group-hover:underline">{title}</div>
        <div className="mt-1 text-sm text-muted-foreground">{author}</div>
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
          {t('courses.sampleDescription')}
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4 text-primary" /> {time}</span>
          <span className="inline-flex items-center gap-1"><Trophy className="h-4 w-4 text-primary" /> {level}</span>
        </div>
      </div>
    </Link>
  );
}

export default function Courses() {
  const { t } = useLanguage();
  const [myCourses, setMyCourses] = useState<CourseData[]>([])
  const [otherCourses, setOtherCourses] = useState<CourseData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast();
  const user = useAppSelector(state => state.user);
  const isTeacherRole = isTeacher(user.user?.role);

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

  const matchesSearch = useCallback(
    (course: CourseData) => {
      const normalizedSearch = searchTerm.trim().toLowerCase();
      if (!normalizedSearch) return true;

      const teacherName = course.teacher
        ? `${course.teacher.first_name} ${course.teacher.last_name}`
        : "";

      const fieldsToSearch = [
        course.title ?? "",
        course.category ?? "",
        course.level ?? "",
        teacherName ?? "",
      ];

      return fieldsToSearch.some((field) =>
        field.toLowerCase().includes(normalizedSearch)
      );
    },
    [searchTerm]
  );

  const handleGetCourses = useCallback(async () => {
    try {
      const response = await apis.course.get_courses();
      
      if (response.status === 200 && response.data) {
        const allCourses = response.data;
        
        // If user is a teacher, separate their courses from others
        if (isTeacherRole && user.user?.id) {
          const myCourseList = allCourses.filter((course: CourseData) => 
            course.teacher?.id === user.user?.id
          );
          const otherCourseList = allCourses.filter((course: CourseData) => 
            course.teacher?.id !== user.user?.id
          );
          setMyCourses(myCourseList);
          setOtherCourses(otherCourseList);
        } else {
          setMyCourses([]);
          setOtherCourses(allCourses);
        }
      } else {
        toast({
          title: t('error.title') || 'Error',
          description: t('error.loadingCourses') || 'Failed to load courses',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error("Error loading courses:", error);
      toast({
        title: t('error.title') || 'Error',
        description: t('error.loadingCourses') || 'Failed to load courses',
        variant: 'destructive'
      });
    }
  }, [isTeacherRole, user.user?.id, toast, t])

  useEffect(() => {
    handleGetCourses();
  }, [handleGetCourses])

  const filteredMyCourses = isTeacherRole
    ? myCourses.filter(matchesSearch)
    : [];
  const filteredOtherCourses = otherCourses.filter(matchesSearch);

  return (
    <AppLayout>
      <div className="py-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{t('courses.title')}</h1>
          <AddCourseButton />
        </div>

        {/* Search and Filters Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="relative">
            <input
              type="text"
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Conditional rendering based on user role */}
        {isTeacherRole && filteredMyCourses.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">{t('courses.myCourses')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredMyCourses.map((course) => {
                const slug = course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                const durationHours = Math.floor(course.duration / 60);
                const durationMinutes = course.duration % 60;
                const timeString = durationHours > 0 
                  ? `${durationHours}${t('common.hours')}` 
                  : `${durationMinutes}${t('common.minutes')}`;
                
                return (
                  <CourseCard
                    key={course.id}
                    id={course.id.toString()}
                    to={`/courses/${slug}`}
                    slug={slug}
                    title={course.title}
                    author={course.category || 'N/A'}
                    level={course.level}
                    rating={`${course.points} ${t('common.points')}`}
                    time={timeString}
                    popular={course.points > 100}
                    imageUrl={buildImageUrl(course.image_url)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Other courses section */}
        <div className={isTeacherRole && filteredMyCourses.length > 0 ? "mt-10" : "mt-6"}>
          {isTeacherRole && (
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">{t('courses.otherCourses')}</h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredOtherCourses.map((course) => {
              const slug = course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
              const durationHours = Math.floor(course.duration / 60);
              const durationMinutes = course.duration % 60;
              const timeString = durationHours > 0 
                ? `${durationHours}${t('common.hours')}` 
                : `${durationMinutes}${t('common.minutes')}`;
              
              return (
                <CourseCard
                  key={course.id}
                  id={course.id.toString()}
                  to={`/courses/${slug}`}
                  slug={slug}
                  title={course.title}
                  author={course.category || 'N/A'}
                  level={course.level}
                  rating={`${course.points} ${t('common.points')}`}
                  time={timeString}
                  popular={course.points > 100}
                  imageUrl={buildImageUrl(course.image_url)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
