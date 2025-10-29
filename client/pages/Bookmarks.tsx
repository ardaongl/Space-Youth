import AppLayout from "@/components/layout/AppLayout";
import { Clock, Trophy, Bookmark, BookmarkCheck, Search, X, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { BookmarkedContent, EnrolledContent, ContentType } from "@/store/slices/bookmarksSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

type SortOption = "recent" | "title" | "oldest" | "rating";

function ContentCard({ 
  item, 
  onRemoveBookmark, 
  showProgress = false 
}: { 
  item: BookmarkedContent | EnrolledContent; 
  onRemoveBookmark?: (id: string) => void;
  showProgress?: boolean;
}) {
  const { t } = useLanguage();
  const progress = showProgress && 'progress' in item ? item.progress : undefined;
  
  const getTypeLabel = (type: ContentType) => {
    switch (type) {
      case "course": return t('courses.title');
      case "workshop": return t('navigation.workshops');
      case "hackathon": return t('bookmarks.hackathon');
      case "tutorial": return t('navigation.tutorials');
      default: return type;
    }
  };

  const getTypeColor = (type: ContentType) => {
    switch (type) {
      case "course": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "workshop": return "bg-blue-100 text-blue-800 border-blue-200";
      case "hackathon": return "bg-purple-100 text-purple-800 border-purple-200";
      case "tutorial": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoutePrefix = (type: ContentType) => {
    switch (type) {
      case "course": return "/courses";
      case "workshop":
      case "hackathon": return "/events";
      case "tutorial": return "/tutorials";
      default: return "/courses";
    }
  };

  return (
    <div className="group rounded-2xl border bg-card shadow-sm hover:shadow-md transition overflow-hidden relative">
      <div className="relative p-5 pb-0">
        <span className={`absolute left-5 top-5 z-10 rounded-full text-[11px] font-semibold px-3 py-1 border ${getTypeColor(item.type)}`}>
          {getTypeLabel(item.type)}
        </span>
        
        {onRemoveBookmark && (
          <button 
            className="absolute right-5 top-5 z-10 p-1.5 rounded-full bg-background/90 border hover:bg-destructive hover:text-destructive-foreground transition"
            onClick={() => onRemoveBookmark(item.id)}
            title="Kayıtlılardan Kaldır"
          >
            <BookmarkCheck className="h-4 w-4 fill-current" />
          </button>
        )}
        
        <div className="aspect-[5/4] w-full rounded-xl bg-accent grid place-items-center mt-8">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover rounded-xl" />
          ) : (
            <img src="/placeholder.svg" alt="course" className="h-24 opacity-70" />
          )}
        </div>
      </div>
      
      <div className="p-5">
        <div className="text-lg font-semibold line-clamp-2 min-h-[3.5rem]">{item.title}</div>
        <div className="mt-1 text-sm text-muted-foreground">{item.author}</div>
        
        {item.description && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        )}
        
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          {item.time && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4 text-primary" /> {item.time}
            </span>
          )}
          {item.level && (
            <span className="inline-flex items-center gap-1">
              <Trophy className="h-4 w-4 text-primary" /> {item.level}
            </span>
          )}
        </div>

        {progress !== undefined && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">{t('bookmarks.progress')}</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        
        <div className="mt-4 flex items-center gap-2">
          <Link 
            to={`${getRoutePrefix(item.type)}/${item.slug}`} 
            className="flex-1 text-center rounded-full border px-4 py-2 text-sm font-medium hover:bg-secondary transition"
          >
{t('bookmarks.viewDetails')}
          </Link>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ 
  title, 
  description, 
  icon: Icon 
}: { 
  title: string; 
  description: string; 
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="rounded-full bg-secondary p-6 mb-4">
        <Icon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md">{description}</p>
    </div>
  );
}

export default function Bookmarks() {
  const { t } = useLanguage();
  const { bookmarkedItems, enrolledItems, removeBookmark } = useBookmarks();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ContentType | "all">("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [showFilters, setShowFilters] = useState(false);

  const filterAndSortItems = (items: (BookmarkedContent | EnrolledContent)[]) => {
    let filtered = [...items];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.type === selectedCategory);
    }

    // Level filter
    if (selectedLevel !== "all") {
      filtered = filtered.filter(item => item.level === selectedLevel);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return ('enrolledAt' in b ? b.enrolledAt : b.bookmarkedAt) - 
                 ('enrolledAt' in a ? a.enrolledAt : a.bookmarkedAt);
        case "oldest":
          return ('enrolledAt' in a ? a.enrolledAt : a.bookmarkedAt) - 
                 ('enrolledAt' in b ? b.enrolledAt : b.bookmarkedAt);
        case "title":
          return a.title.localeCompare(b.title);
        case "rating":
          return (parseFloat(b.rating || "0")) - (parseFloat(a.rating || "0"));
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredEnrolledItems = useMemo(() => 
    filterAndSortItems(enrolledItems), 
    [enrolledItems, searchQuery, selectedCategory, selectedLevel, sortBy]
  );

  const filteredBookmarkedItems = useMemo(() => 
    filterAndSortItems(bookmarkedItems), 
    [bookmarkedItems, searchQuery, selectedCategory, selectedLevel, sortBy]
  );

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedLevel("all");
    setSortBy("recent");
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || selectedLevel !== "all" || sortBy !== "recent";

  return (
    <AppLayout>
      <div className="py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{t('bookmarks.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('bookmarks.subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('bookmarks.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 rounded-full border bg-background pl-12 pr-12 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition",
              showFilters && "bg-secondary"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t('common.filter')}
            {hasActiveFilters && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
                {t('common.active')}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mb-6 p-6 rounded-2xl border bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{t('bookmarks.filterCriteria')}</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  {t('common.reset')}
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Sort By */}
              <div>
                <label className="text-sm font-medium mb-2 block">{t('bookmarks.sortBy')}</label>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('bookmarks.selectSorting')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">{t('bookmarks.recentlyAccessed')}</SelectItem>
                    <SelectItem value="oldest">{t('bookmarks.oldest')}</SelectItem>
                    <SelectItem value="title">{t('bookmarks.titleAZ')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-medium mb-2 block">{t('bookmarks.categories')}</label>
                <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as ContentType | "all")}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('bookmarks.selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('bookmarks.allCategories')}</SelectItem>
                    <SelectItem value="course">{t('bookmarks.courses')}</SelectItem>
                    <SelectItem value="workshop">{t('bookmarks.workshop')}</SelectItem>
                    <SelectItem value="hackathon">{t('bookmarks.hackathon')}</SelectItem>
                    <SelectItem value="tutorial">{t('bookmarks.tutorialVideos')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Level */}
              <div>
                <label className="text-sm font-medium mb-2 block">{t('bookmarks.level')}</label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('bookmarks.selectLevel')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('bookmarks.allLevels')}</SelectItem>
                    <SelectItem value="Beginner">{t('courses.beginner')}</SelectItem>
                    <SelectItem value="Intermediate">{t('courses.intermediate')}</SelectItem>
                    <SelectItem value="Advanced">{t('courses.advanced')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="enrolled" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="enrolled" className="gap-2">
              {t('bookmarks.allTrainings')}
              <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-semibold">
                {filteredEnrolledItems.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="bookmarked" className="gap-2">
              {t('bookmarks.saved')}
              <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-semibold">
                {filteredBookmarkedItems.length}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Enrolled Items */}
          <TabsContent value="enrolled">
            {filteredEnrolledItems.length === 0 ? (
              enrolledItems.length === 0 ? (
                <EmptyState
                  icon={Trophy}
                  title={t('bookmarks.noEnrollments')}
                  description={t('bookmarks.noEnrollmentsDescription')}
                />
              ) : (
                <EmptyState
                  icon={Search}
                  title={t('bookmarks.noResults')}
                  description={t('bookmarks.noResultsDescription')}
                />
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEnrolledItems.map((item) => (
                  <ContentCard key={item.id} item={item} showProgress={true} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Bookmarked Items */}
          <TabsContent value="bookmarked">
            {filteredBookmarkedItems.length === 0 ? (
              bookmarkedItems.length === 0 ? (
                <EmptyState
                  icon={Bookmark}
                  title={t('bookmarks.noBookmarks')}
                  description={t('bookmarks.noBookmarksDescription')}
                />
              ) : (
                <EmptyState
                  icon={Search}
                  title={t('bookmarks.noResults')}
                  description={t('bookmarks.noResultsDescription')}
                />
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBookmarkedItems.map((item) => (
                  <ContentCard 
                    key={item.id} 
                    item={item} 
                    onRemoveBookmark={removeBookmark}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
