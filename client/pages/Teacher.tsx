import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Tutorial, Video } from "@shared/api";
import { VideoCard } from "@/components/Videos/VideoCard";
import { AddVideoModal } from "@/components/Videos/AddVideoModal";
import { EditVideoModal } from "@/components/Videos/EditVideoModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2, Search, Video as VideoIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAppSelector } from "@/store";
import { apis } from "@/services";

// Helper function to convert Tutorial to Video format
const tutorialToVideo = (tutorial: Tutorial): Video => {
  return {
    id: tutorial.id,
    title: tutorial.title,
    description: tutorial.description,
    videoUrl: tutorial.video_url,
    teacherId: tutorial.teacher_id || "",
    teacherName: tutorial.teacher_name || "",
    createdAt: tutorial.created_at || new Date().toISOString(),
    updatedAt: tutorial.updated_at || new Date().toISOString(),
  };
};

export default function Teacher() {
  const user = useAppSelector(state => state.user);
  const { t } = useLanguage();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);

  const fetchTeacherTutorials = async () => {
    setIsLoading(true);
    try {
      const response = await apis.tutorial.get_teacher_tutorials();
      console.log(response);
      if (response.status === 200 && response.data) {
        const tutorialsData = Array.isArray(response.data) ? response.data : [];
        setTutorials(tutorialsData);
        // Convert Tutorial to Video format for VideoCard component
        setVideos(tutorialsData.map(tutorialToVideo));
      } else {
        throw new Error(t('tutorials.videosLoadError') || 'Videolar yüklenemedi');
      }
    } catch (error) {
      console.error('Error loading teacher tutorials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherTutorials();
  }, []);

  const handleDeleteVideo = async (videoId: string) => {
    try {
      const response = await apis.tutorial.delete_tutorial(videoId);

      if (response.status !== 200) {
        throw new Error(t('tutorials.videoDeleteError') || 'Video silinemedi');
      }

      setTutorials((prev) => prev.filter((t) => t.id !== videoId));
      setVideos((prev) => prev.filter((v) => v.id !== videoId));
    } catch (error) {
      console.error('Error deleting video:', error);
      alert(t('tutorials.videoDeleteAlert') || 'Video silinirken bir hata oluştu');
    }
  };

  const handleEditVideo = (video: Video) => {
    const tutorial = tutorials.find((t) => t.id === video.id);
    if (tutorial) {
      setSelectedTutorial(tutorial);
      setShowEditModal(true);
    }
  };

  const handleVideoUpdated = () => {
    fetchTeacherTutorials();
  };

  // Filter videos by search query
  const filteredVideos = videos.filter((video) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      video.title.toLowerCase().includes(query) ||
      video.description.toLowerCase().includes(query) ||
      video.teacherName.toLowerCase().includes(query)
    );
  });

  return (
    <AppLayout>
      <div className="py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('teacher') || 'Öğretmen Paneli'}</h1>
          <p className="text-muted-foreground mt-2">
            Eğitim videolarınızı yönetin ve öğrencilerinizle paylaşın
          </p>
        </div>

        {/* Eğitim Videoları Bölümü */}
        <div className="bg-card rounded-xl border p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <VideoIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Eğitim Videoları</h2>
                <p className="text-sm text-muted-foreground">
                  Oluşturduğunuz eğitim videolarını buradan yönetebilirsiniz
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Yeni Video Ekle
            </Button>
          </div>

          <div className="mt-4 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Videolarda ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>

          {isLoading ? (
            <div className="mt-8 flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="mt-8 text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery.trim() 
                  ? `"${searchQuery}" için sonuç bulunamadı`
                  : 'Henüz video eklenmemiş'}
              </p>
              {!searchQuery.trim() && (
                <Button
                  onClick={() => setShowAddModal(true)}
                  variant="outline"
                  className="mt-4"
                >
                  İlk Videoyu Ekle
                </Button>
              )}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  canEdit={true}
                  canDelete={true}
                  onEdit={handleEditVideo}
                  onDelete={handleDeleteVideo}
                />
              ))}
            </div>
          )}
        </div>

        {/* Gelecekte eklenecek diğer bölümler için placeholder */}
        {/* 
        <div className="bg-card rounded-xl border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Diğer Bölümler</h2>
          <p className="text-muted-foreground">Yakında eklenecek...</p>
        </div>
        */}
      </div>

      <AddVideoModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onVideoAdded={fetchTeacherTutorials}
      />

      <EditVideoModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        tutorial={selectedTutorial}
        onVideoUpdated={handleVideoUpdated}
      />
    </AppLayout>
  );
}

