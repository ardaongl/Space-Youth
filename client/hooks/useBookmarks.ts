import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  addBookmark,
  removeBookmark,
  addEnrollment,
  clearBookmarks,
  clearEnrollments,
} from '../store/slices/bookmarksSlice';
import type { BookmarkedContent, EnrolledContent } from '../store/slices/bookmarksSlice';

export const useBookmarks = () => {
  const dispatch = useAppDispatch();
  const { bookmarkedItems, enrolledItems } = useAppSelector((state) => state.bookmarks);

  const handleAddBookmark = useCallback(
    (item: BookmarkedContent) => {
      dispatch(addBookmark(item));
    },
    [dispatch]
  );

  const handleRemoveBookmark = useCallback(
    (id: string) => {
      dispatch(removeBookmark(id));
    },
    [dispatch]
  );

  const handleAddEnrollment = useCallback(
    (item: EnrolledContent) => {
      dispatch(addEnrollment(item));
    },
    [dispatch]
  );

  const handleClearBookmarks = useCallback(() => {
    dispatch(clearBookmarks(undefined));
  }, [dispatch]);

  const handleClearEnrollments = useCallback(() => {
    dispatch(clearEnrollments(undefined));
  }, [dispatch]);

  const isBookmarked = useCallback(
    (id: string) => {
      return bookmarkedItems.some((item) => item.id === id);
    },
    [bookmarkedItems]
  );

  const isEnrolled = useCallback(
    (id: string) => {
      return enrolledItems.some((item) => item.id === id);
    },
    [enrolledItems]
  );

  return {
    bookmarkedItems,
    enrolledItems,
    addBookmark: handleAddBookmark,
    removeBookmark: handleRemoveBookmark,
    addEnrollment: handleAddEnrollment,
    clearBookmarks: handleClearBookmarks,
    clearEnrollments: handleClearEnrollments,
    isBookmarked,
    isEnrolled,
  };
};
