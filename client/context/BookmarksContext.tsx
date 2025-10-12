import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ContentType = "course" | "workshop" | "hackathon" | "tutorial";

export interface BookmarkedContent {
  id: string;
  title: string;
  author: string;
  description?: string;
  type: ContentType;
  level?: string;
  rating?: string;
  time?: string;
  date?: string;
  participants?: number;
  maxParticipants?: number;
  imageUrl?: string;
  slug: string;
  bookmarkedAt: number;
}

export interface EnrolledContent extends BookmarkedContent {
  enrolledAt: number;
  progress?: number;
}

interface BookmarksContextType {
  bookmarkedItems: BookmarkedContent[];
  enrolledItems: EnrolledContent[];
  addBookmark: (item: BookmarkedContent) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  addEnrollment: (item: EnrolledContent) => void;
  isEnrolled: (id: string) => boolean;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarkedItems, setBookmarkedItems] = useState<BookmarkedContent[]>([]);
  const [enrolledItems, setEnrolledItems] = useState<EnrolledContent[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("bookmarkedItems");
    const savedEnrollments = localStorage.getItem("enrolledItems");
    
    if (savedBookmarks) {
      try {
        setBookmarkedItems(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      }
    }
    
    if (savedEnrollments) {
      try {
        setEnrolledItems(JSON.parse(savedEnrollments));
      } catch (e) {
        console.error("Failed to parse enrollments", e);
      }
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("bookmarkedItems", JSON.stringify(bookmarkedItems));
  }, [bookmarkedItems]);

  // Save enrollments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("enrolledItems", JSON.stringify(enrolledItems));
  }, [enrolledItems]);

  const addBookmark = (item: BookmarkedContent) => {
    setBookmarkedItems((prev) => {
      // Don't add duplicates
      if (prev.some((i) => i.id === item.id)) {
        return prev;
      }
      return [...prev, { ...item, bookmarkedAt: Date.now() }];
    });
  };

  const removeBookmark = (id: string) => {
    setBookmarkedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const isBookmarked = (id: string) => {
    return bookmarkedItems.some((item) => item.id === id);
  };

  const addEnrollment = (item: EnrolledContent) => {
    setEnrolledItems((prev) => {
      // Don't add duplicates
      if (prev.some((i) => i.id === item.id)) {
        return prev;
      }
      return [...prev, { ...item, enrolledAt: Date.now() }];
    });
  };

  const isEnrolled = (id: string) => {
    return enrolledItems.some((item) => item.id === id);
  };

  return (
    <BookmarksContext.Provider
      value={{
        bookmarkedItems,
        enrolledItems,
        addBookmark,
        removeBookmark,
        isBookmarked,
        addEnrollment,
        isEnrolled,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarksContext);
  if (context === undefined) {
    throw new Error("useBookmarks must be used within a BookmarksProvider");
  }
  return context;
}

