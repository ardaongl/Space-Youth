import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface BookmarksState {
  bookmarkedItems: BookmarkedContent[];
  enrolledItems: EnrolledContent[];
}

// Load from localStorage on initialization
const loadFromLocalStorage = (key: string, defaultValue: any) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    console.error(`Failed to parse ${key} from localStorage`, e);
    return defaultValue;
  }
};

const initialState: BookmarksState = {
  bookmarkedItems: loadFromLocalStorage("bookmarkedItems", []),
  enrolledItems: loadFromLocalStorage("enrolledItems", []),
};

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    addBookmark: (state, action: PayloadAction<BookmarkedContent>) => {
      const item = action.payload;
      // Don't add duplicates
      if (!state.bookmarkedItems.some((i) => i.id === item.id)) {
        state.bookmarkedItems.push({ ...item, bookmarkedAt: Date.now() });
        // Save to localStorage
        localStorage.setItem("bookmarkedItems", JSON.stringify(state.bookmarkedItems));
      }
    },
    removeBookmark: (state, action: PayloadAction<string>) => {
      state.bookmarkedItems = state.bookmarkedItems.filter((item) => item.id !== action.payload);
      // Save to localStorage
      localStorage.setItem("bookmarkedItems", JSON.stringify(state.bookmarkedItems));
    },
    addEnrollment: (state, action: PayloadAction<EnrolledContent>) => {
      const item = action.payload;
      // Don't add duplicates
      if (!state.enrolledItems.some((i) => i.id === item.id)) {
        state.enrolledItems.push({ ...item, enrolledAt: Date.now() });
        // Save to localStorage
        localStorage.setItem("enrolledItems", JSON.stringify(state.enrolledItems));
      }
    },
    clearBookmarks: (state) => {
      state.bookmarkedItems = [];
      localStorage.removeItem("bookmarkedItems");
    },
    clearEnrollments: (state) => {
      state.enrolledItems = [];
      localStorage.removeItem("enrolledItems");
    },
  },
});

export const {
  addBookmark,
  removeBookmark,
  addEnrollment,
  clearBookmarks,
  clearEnrollments,
} = bookmarksSlice.actions;

export default bookmarksSlice.reducer;
