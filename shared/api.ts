/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Video interface for tutorial videos
 */
export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  videoUrl: string; // YouTube URL or direct video URL
  duration?: string; // e.g., "10:45"
  category?: string;
  teacherId: string;
  teacherName: string;
  views?: number;
  likes?: number;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVideoRequest {
  title: string;
  description: string;
  thumbnailUrl?: string;
  videoUrl: string;
  duration?: string;
  category?: string;
}

export interface VideoListResponse {
  videos: Video[];
}

export interface VideoResponse {
  video: Video;
}