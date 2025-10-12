import { RequestHandler } from "express";
import { Video, VideoListResponse, VideoResponse, CreateVideoRequest } from "@shared/api";
import multer from "multer";

// Configure multer for file uploads
const storage = multer.memoryStorage();
export const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

// In-memory storage for videos (in production, this would be a database)
let videos: Video[] = [
  {
    id: "1",
    title: "Python'a Giriş - Değişkenler ve Veri Tipleri",
    description: "Bu videoda Python programlama diline giriş yapıyoruz. Değişkenler, veri tipleri ve temel operatörleri öğreniyoruz.",
    videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
    thumbnailUrl: "",
    duration: "15:30",
    category: "Python",
    teacherId: "teacher-1",
    teacherName: "Mehmet Hoca",
    views: 245,
    likes: 32,
    rating: 4.8,
    createdAt: new Date("2024-01-15").toISOString(),
    updatedAt: new Date("2024-01-15").toISOString(),
  },
  {
    id: "2",
    title: "Web Geliştirme - HTML ve CSS Temelleri",
    description: "HTML ve CSS kullanarak modern web sayfaları oluşturmayı öğrenin. Responsive tasarım ve flexbox konularını ele alıyoruz.",
    videoUrl: "https://www.youtube.com/watch?v=UB1O30fR-EE",
    thumbnailUrl: "",
    duration: "22:15",
    category: "Web Geliştirme",
    teacherId: "teacher-2",
    teacherName: "Ayşe Öğretmen",
    views: 189,
    likes: 28,
    rating: 4.9,
    createdAt: new Date("2024-01-20").toISOString(),
    updatedAt: new Date("2024-01-20").toISOString(),
  },
];

let nextId = 3;

// GET /api/videos - List all videos
export const handleGetVideos: RequestHandler = (_req, res) => {
  const response: VideoListResponse = {
    videos: videos.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
  };
  res.json(response);
};

// GET /api/videos/:id - Get a specific video
export const handleGetVideo: RequestHandler = (req, res) => {
  const { id } = req.params;
  const video = videos.find((v) => v.id === id);

  if (!video) {
    res.status(404).json({ error: "Video bulunamadı" });
    return;
  }

  const response: VideoResponse = { video };
  res.json(response);
};

// POST /api/videos - Create a new video
export const handleCreateVideo: RequestHandler = (req, res) => {
  try {
    const data = req.body as CreateVideoRequest;

    // Validation
    if (!data.title || !data.description || !data.videoUrl) {
      res.status(400).json({ error: "Başlık, açıklama ve video URL'si zorunludur" });
      return;
    }

    // In a real application, you would get the teacher info from the authenticated user
    const newVideo: Video = {
      id: String(nextId++),
      title: data.title,
      description: data.description,
      videoUrl: data.videoUrl,
      thumbnailUrl: data.thumbnailUrl || "",
      duration: data.duration || "",
      category: data.category || "",
      teacherId: "teacher-1", // This should come from auth in production
      teacherName: "Mock Teacher", // This should come from auth in production
      views: 0,
      likes: 0,
      rating: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    videos.push(newVideo);

    const response: VideoResponse = { video: newVideo };
    res.status(201).json(response);
  } catch (error) {
    console.error("Video oluşturma hatası:", error);
    res.status(500).json({ error: "Video oluşturulurken bir hata oluştu" });
  }
};

// PUT /api/videos/:id - Update a video
export const handleUpdateVideo: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body as Partial<CreateVideoRequest>;

    const videoIndex = videos.findIndex((v) => v.id === id);

    if (videoIndex === -1) {
      res.status(404).json({ error: "Video bulunamadı" });
      return;
    }

    // In production, check if the user is the owner or has permission
    const updatedVideo: Video = {
      ...videos[videoIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    videos[videoIndex] = updatedVideo;

    const response: VideoResponse = { video: updatedVideo };
    res.json(response);
  } catch (error) {
    console.error("Video güncelleme hatası:", error);
    res.status(500).json({ error: "Video güncellenirken bir hata oluştu" });
  }
};

// DELETE /api/videos/:id - Delete a video
export const handleDeleteVideo: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const videoIndex = videos.findIndex((v) => v.id === id);

    if (videoIndex === -1) {
      res.status(404).json({ error: "Video bulunamadı" });
      return;
    }

    // In production, check if the user is the owner or has permission
    videos = videos.filter((v) => v.id !== id);

    res.json({ message: "Video başarıyla silindi" });
  } catch (error) {
    console.error("Video silme hatası:", error);
    res.status(500).json({ error: "Video silinirken bir hata oluştu" });
  }
};

// POST /api/videos/upload - Upload a video file
export const handleUploadVideo: RequestHandler = (req, res) => {
  try {
    const { title, description, duration } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const videoFile = files?.video?.[0];
    const thumbnailFile = files?.thumbnail?.[0];

    if (!title || !description) {
      res.status(400).json({ error: "Başlık ve açıklama zorunludur" });
      return;
    }

    if (!videoFile) {
      res.status(400).json({ error: "Video dosyası zorunludur" });
      return;
    }

    // In production, you would:
    // 1. Save the file to cloud storage (AWS S3, Google Cloud Storage, etc.)
    // 2. Get the URL from the storage service
    // For now, we'll create a mock URL
    const videoUrl = `https://storage.example.com/videos/${videoFile.originalname}`;
    const thumbnailUrl = thumbnailFile 
      ? `https://storage.example.com/thumbnails/${thumbnailFile.originalname}`
      : "";

    const newVideo: Video = {
      id: String(nextId++),
      title,
      description,
      videoUrl,
      thumbnailUrl,
      duration: duration || "",
      category: "",
      teacherId: "teacher-1", // This should come from auth in production
      teacherName: "Mock Teacher", // This should come from auth in production
      views: 0,
      likes: 0,
      rating: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    videos.push(newVideo);

    const response: VideoResponse = { video: newVideo };
    res.status(201).json(response);
  } catch (error) {
    console.error("Video yükleme hatası:", error);
    res.status(500).json({ error: "Video yüklenirken bir hata oluştu" });
  }
};

