import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { canSeeAddCourse } from "@/utils/roles";
import { Video, VideoListResponse } from "@shared/api";
import { VideoCard } from "@/components/Videos/VideoCard";
import { AddVideoModal } from "@/components/Videos/AddVideoModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Tutorials() {
  const { auth } = useAuth();
  const { t } = useLanguage();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);

  const canAddVideo = canSeeAddCourse(auth.user?.role);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/videos");
      if (!response.ok) {
        throw new Error(t('tutorials.videosLoadError'));
      }
      const data: VideoListResponse = await response.json();
      setVideos(data.videos);
    } catch (error) {
      console.error(t('tutorials.videoLoadError'), error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDeleteVideo = async (videoId: string) => {
    try {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(t('tutorials.videoDeleteError'));
      }

      setVideos((prev) => prev.filter((v) => v.id !== videoId));
    } catch (error) {
      console.error(t('tutorials.videoDeleteError'), error);
      alert(t('tutorials.videoDeleteAlert'));
    }
  };

  // Filter videos by search query
  const filteredVideos = videos.filter((video) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      video.title.toLowerCase().includes(query) ||
      video.description.toLowerCase().includes(query) ||
      video.teacherName.toLowerCase().includes(query) ||
      video.category?.toLowerCase().includes(query)
    );
  });

  return (
    <AppLayout>
      <div className="py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('tutorials.title')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('tutorials.subtitle')}
            </p>
          </div>
          {canAddVideo && (
            <Button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {t('tutorials.addVideo')}
            </Button>
          )}
        </div>

        <div className="mt-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('tutorials.searchVideos')}
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
                ? t('tutorials.noResultsFound', { query: searchQuery })
                : t('tutorials.noVideosYet')}
            </p>
            {canAddVideo && !searchQuery.trim() && (
              <Button
                onClick={() => setShowAddModal(true)}
                variant="outline"
                className="mt-4"
              >
                {t('tutorials.addFirstVideo')}
              </Button>
            )}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                canDelete={canAddVideo && video.teacherId === auth.user?.id}
                onDelete={handleDeleteVideo}
              />
            ))}
          </div>
        )}
      </div>

      <AddVideoModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onVideoAdded={fetchVideos}
      />
    </AppLayout>
  );
}
