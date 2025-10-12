import { useState } from "react";
import { Video } from "@shared/api";
import { Eye, Heart, Star, Play, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface VideoCardProps {
  video: Video;
  canDelete?: boolean;
  onDelete?: (videoId: string) => void;
}

export function VideoCard({ video, canDelete = false, onDelete }: VideoCardProps) {
  const [showPlayer, setShowPlayer] = useState(false);

  // Extract YouTube video ID from URL
  const getYouTubeEmbedUrl = (url: string): string | null => {
    try {
      const urlObj = new URL(url);
      let videoId = null;

      if (urlObj.hostname.includes("youtube.com")) {
        videoId = urlObj.searchParams.get("v");
      } else if (urlObj.hostname.includes("youtu.be")) {
        videoId = urlObj.pathname.substring(1);
      }

      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch {
      return null;
    }
  };

  const embedUrl = getYouTubeEmbedUrl(video.videoUrl);
  const thumbnailUrl = video.thumbnailUrl || (embedUrl ? `https://img.youtube.com/vi/${embedUrl.split("/").pop()}/hqdefault.jpg` : "/placeholder.svg");

  const handleDelete = async () => {
    if (window.confirm("Bu videoyu silmek istediğinizden emin misiniz?")) {
      onDelete?.(video.id);
    }
  };

  return (
    <>
      <div className="group rounded-2xl border bg-card shadow-sm hover:shadow-md transition overflow-hidden">
        <div className="p-3 pb-0">
          <div 
            className="aspect-video w-full rounded-xl bg-accent overflow-hidden cursor-pointer relative"
            onClick={() => setShowPlayer(true)}
          >
            <img 
              src={thumbnailUrl} 
              alt={video.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
              </div>
            </div>
            {video.duration && (
              <Badge className="absolute bottom-2 right-2 bg-black/80 text-white">
                {video.duration}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="text-[10px] font-semibold tracking-widest text-muted-foreground">
                {video.category || "DERS VİDEOSU"}
              </div>
              <div className="mt-1 font-semibold leading-snug line-clamp-2">
                {video.title}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {video.teacherName}
              </div>
              <div className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {video.description}
              </div>
            </div>
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" /> {video.views || 0}
            </span>
            <span className="inline-flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" /> {video.likes || 0}
            </span>
          </div>
        </div>
      </div>

      <Dialog open={showPlayer} onOpenChange={setShowPlayer}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>{video.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {embedUrl ? (
              <div className="aspect-video w-full">
                <iframe
                  src={embedUrl}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <video
                src={video.videoUrl}
                className="w-full rounded-lg"
                controls
              />
            )}
            <div className="mt-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                Eğitmen: {video.teacherName}
              </p>
              <p className="text-sm">{video.description}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

