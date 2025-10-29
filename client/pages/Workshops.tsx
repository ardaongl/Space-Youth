import AppLayout from "@/components/layout/AppLayout";
import { Link } from "react-router-dom";
import { Clock, Trophy, Bookmark, BookmarkCheck, SlidersHorizontal, Calendar, Users2 } from "lucide-react";
import { useEffect, useState } from "react";
import { canSeeAddCourse } from "@/utils/roles";
import { useBookmarks } from "@/hooks/useBookmarks";
import { BookmarkedContent } from "@/store/slices/bookmarksSlice";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { useAppSelector } from "@/store";

type EventType = "workshop" | "hackathon";

function EventCard({
  id,
  to,
  title,
  author,
  level,
  rating,
  time,
  popular,
  eventType,
  date,
  participants,
  maxParticipants,
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
  eventType: EventType;
  date?: string;
  participants?: number;
  maxParticipants?: number;
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
        title: t('bookmarks.removedFromBookmarks'),
        description: `${title} ${t('bookmarks.removedFromBookmarks')}.`,
      });
    } else {
      const bookmarkItem: BookmarkedContent = {
        id,
        title,
        author,
        level,
        rating,
        time,
        type: eventType,
        slug,
        bookmarkedAt: Date.now(),
        date,
        participants,
        maxParticipants,
        description: eventType === "workshop" 
          ? t('workshops.workshopDescription')
          : t('workshops.hackathonDescription')
      };
      addBookmark(bookmarkItem);
      toast({
        title: t('bookmarks.addedToBookmarks'),
        description: `${title} ${t('bookmarks.addedToBookmarks')}.`,
      });
    }
  };

  return (
    <Link
      to={to}
      className="group rounded-2xl border bg-card shadow-sm hover:shadow-md transition overflow-hidden"
    >
      <div className="relative p-5 pb-0">
        {/* Event Type Tag */}
        <span className={`absolute left-5 top-5 z-10 rounded-full text-[11px] font-semibold px-3 py-1 border ${
          eventType === "workshop" 
            ? "bg-blue-100 text-blue-800 border-blue-200" 
            : "bg-purple-100 text-purple-800 border-purple-200"
        }`}>
          {eventType === "workshop" ? t('workshops.workshop') : t('workshops.hackathon')}
        </span>
        
        {popular && (
          <span className="absolute left-5 top-12 z-10 rounded-full bg-amber-100 text-amber-800 text-[11px] font-semibold px-2 py-0.5 border border-amber-200">
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
          <img src="/placeholder.svg" alt="event" className="h-24 opacity-70"/>
        </div>
      </div>
      
      <div className="p-5">
        <div className="text-[11px] font-semibold tracking-widest text-muted-foreground">
          {eventType === "workshop" ? t('workshops.workshop').toUpperCase() : t('workshops.hackathon').toUpperCase()}
        </div>
        <div className="mt-1 text-lg font-semibold leading-snug group-hover:underline">{title}</div>
        <div className="mt-1 text-sm text-muted-foreground">{author}</div>
        
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
          {eventType === "workshop" 
            ? t('workshops.workshopDescription')
            : t('workshops.hackathonDescription')}
        </p>
        
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4 text-primary" /> {time}
          </span>
          {date && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-4 w-4 text-primary" /> 
              {new Date(date).toLocaleDateString(t('common.locale') === 'tr' ? "tr-TR" : "en-US", { month: "short", day: "numeric" })}
            </span>
          )}
        </div>
        
        {participants !== undefined && maxParticipants !== undefined && (
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Users2 className="h-3.5 w-3.5" />
            <span>{participants}/{maxParticipants} {t('workshops.participants')}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function Workshops() {
  const user = useAppSelector(state => state.user);
  const { t } = useLanguage();
  const role = user.user?.role ?? null;
  const [events, setEvents] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState<"all" | EventType>("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - gerçek uygulamada API'den gelecek
  useEffect(() => {
    const mockEvents = [
      {
        id: 1,
        type: "workshop",
        title: "UX Research Fundamentals",
        author: "Emily Parker",
        level: "Beginner",
        rating: "4.8 (245)",
        time: "2h",
        date: "2024-03-20",
        participants: 45,
        maxParticipants: 50,
        popular: true,
      },
      {
        id: 2,
        type: "hackathon",
        title: "AI Hackathon 2024",
        author: "Tech Community",
        level: "Advanced",
        rating: "4.9 (180)",
        time: "48h",
        date: "2024-03-25",
        participants: 120,
        maxParticipants: 150,
        popular: true,
      },
      {
        id: 3,
        type: "workshop",
        title: "Product Strategy Workshop",
        author: "Michael Ross",
        level: "Intermediate",
        rating: "4.7 (312)",
        time: "3h",
        date: "2024-03-22",
        participants: 28,
        maxParticipants: 30,
      },
      {
        id: 4,
        type: "hackathon",
        title: "Web3 Development Sprint",
        author: "Blockchain Labs",
        level: "Advanced",
        rating: "4.6 (95)",
        time: "24h",
        date: "2024-04-01",
        participants: 60,
        maxParticipants: 80,
      },
      {
        id: 5,
        type: "workshop",
        title: "Design Thinking Masterclass",
        author: "Sarah Johnson",
        level: "Intermediate",
        rating: "4.8 (421)",
        time: "4h",
        date: "2024-03-28",
        participants: 35,
        maxParticipants: 40,
      },
      {
        id: 6,
        type: "hackathon",
        title: "Mobile App Challenge",
        author: "Dev Community",
        level: "Intermediate",
        rating: "4.7 (156)",
        time: "36h",
        date: "2024-04-05",
        participants: 85,
        maxParticipants: 100,
      },
    ];
    setEvents(mockEvents);
  }, []);

  // Filtreleme ve sıralama
  const filteredEvents = events
    .filter(event => {
      // Tip filtresi
      if (filterType !== "all" && event.type !== filterType) return false;
      
      // Arama filtresi
      if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "a-z":
          return a.title.localeCompare(b.title);
        case "z-a":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  return (
    <AppLayout>
      <div className="py-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{t('navigation.workshops')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('workshops.subtitle')}
            </p>
          </div>
          
          {canSeeAddCourse(role) && (
            <Link
              to="/events/add"
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-purple-700 transition-colors shadow-sm"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('workshops.addEvent')}
            </Link>
          )}
        </div>

        {/* Search and Filters Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={t('workshops.searchEvents')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="newest">{t('workshops.sortByNewest')}</option>
                <option value="oldest">{t('workshops.sortByOldest')}</option>
                <option value="a-z">{t('workshops.sortByAZ')}</option>
                <option value="z-a">{t('workshops.sortByZA')}</option>
              </select>

              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as "all" | EventType)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">{t('workshops.allTypes')}</option>
                <option value="workshop">{t('workshops.workshop')}</option>
                <option value="hackathon">{t('workshops.hackathon')}</option>
              </select>
            </div>
          )}
        </div>

        {/* Filter Summary */}
        {filterType !== "all" && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t('workshops.filtering')}:</span>
            <button
              onClick={() => setFilterType("all")}
              className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium hover:bg-purple-200 transition"
            >
              {filterType === "workshop" ? t('workshops.workshop') : t('workshops.hackathon')}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Events Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                id={`event-${event.id}`}
                to={`/events/${event.type}-${event.id}`}
                slug={`${event.type}-${event.id}`}
                title={event.title}
                author={event.author}
                level={event.level}
                rating={event.rating}
                time={event.time}
                popular={event.popular}
                eventType={event.type}
                date={event.date}
                participants={event.participants}
                maxParticipants={event.maxParticipants}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? t('workshops.noEventsFound') : t('workshops.noEventsYet')}
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
