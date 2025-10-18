import AppLayout from "@/components/layout/AppLayout";
import { Link } from "react-router-dom";
import { Clock, Trophy, Bookmark, BookmarkCheck, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/services";
import AddCourseButton from "@/components/Courses/AddCourseButton";
import { useBookmarks, BookmarkedContent } from "@/context/BookmarksContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";

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
        description: "Learn the essentials of planning and leading effective workshops. Build skills in facilitation, collaboration, and driving desired outcomes."
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
        <div className="aspect-[5/4] w-full rounded-xl bg-accent grid place-items-center">
          <img src="/placeholder.svg" alt="course" className="h-24 opacity-70"/>
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
  const [courses, setCourses] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  const handleGetCourses = async () => {
    try {
      // Mock courses data - since we don't have real backend
      const mockCourses = [
        {
          id: "course-1",
          title: "Workshop Facilitation",
          author: "Colin Michael Pace",
          level: "Advanced",
          rating: "4.6 (4,061)",
          time: `4${t('common.hours')}`,
          popular: true
        },
        {
          id: "course-2", 
          title: "UX Design Foundations",
          author: "Gene Kamenez",
          level: "Beginner",
          rating: "4.8 (3,834)",
          time: `6${t('common.hours')}`,
          popular: false
        },
        {
          id: "course-3",
          title: "Introduction to Customer Journey Mapping", 
          author: "Oliver West",
          level: "Intermediate",
          rating: "4.7 (2,102)",
          time: `5${t('common.hours')}`,
          popular: false
        }
      ];
      
      setCourses(mockCourses);
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  }

  useEffect(() => {
    handleGetCourses();
  }, [t])

  return (
    // courses.map ile yapılmalı
    <AppLayout>
      <div className="py-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{t('courses.title')}</h1>
          <AddCourseButton />
        </div>

        {/* Search and Filters Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={t('common.search')}
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

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                showFilters 
                  ? 'bg-purple-600 text-white border-purple-600' 
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span className="font-medium">{t('common.filter')}</span>
            </button>
          </div>

          {/* Filters Dropdown */}
          {showFilters && (
            <div className="mt-4 flex items-center gap-4 pt-4 border-t border-gray-200">
              <select className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>En Yeniye Göre Sırala</option>
                <option>En Eskiye Göre Sırala</option>
                <option>A-Z Sırala</option>
                <option>Z-A Sırala</option>
              </select>

              <select className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>Tüm Kategoriler</option>
                <option>Programlama</option>
                <option>Tasarım</option>
                <option>İş Geliştirme</option>
                <option>Pazarlama</option>
              </select>
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <CourseCard
            id="course-1"
            to="/courses/workshop-facilitation"
            slug="workshop-facilitation"
            title="Workshop Facilitation"
            author="Colin Michael Pace"
            level="Advanced"
            rating="4.6 (4,061)"
            time={`4${t('common.hours')}`}
            popular
          />
          <CourseCard
            id="course-2"
            to="/courses/ux-design-foundations"
            slug="ux-design-foundations"
            title="UX Design Foundations"
            author="Gene Kamenez"
            level="Beginner"
            rating="4.8 (3,834)"
            time={`6${t('common.hours')}`}
          />
          <CourseCard
            id="course-3"
            to="/courses/introduction-to-customer-journey-mapping"
            slug="introduction-to-customer-journey-mapping"
            title="Introduction to Customer Journey Mapping"
            author="Oliver West"
            level="Intermediate"
            rating="4.7 (2,102)"
            time={`5${t('common.hours')}`}
          />
        </div>
      </div>
    </AppLayout>
  );
}
