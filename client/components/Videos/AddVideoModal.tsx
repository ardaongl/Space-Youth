import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateVideoRequest } from "@shared/api";
import { Loader2, Link, Upload, Video, Image, FileVideo, X } from "lucide-react";

interface AddVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVideoAdded?: () => void;
}

export function AddVideoModal({ open, onOpenChange, onVideoAdded }: AddVideoModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [videoType, setVideoType] = useState<"url" | "file">("url");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<CreateVideoRequest>({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    duration: "",
    category: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (videoType === "file") {
        // Handle file upload
        if (!videoFile) {
          alert("Lütfen bir video dosyası seçin");
          setIsLoading(false);
          return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("duration", formData.duration || "");
        formDataToSend.append("video", videoFile);
        if (thumbnailFile) {
          formDataToSend.append("thumbnail", thumbnailFile);
        }

        const response = await fetch("/api/videos/upload", {
          method: "POST",
          body: formDataToSend,
        });

        if (!response.ok) {
          throw new Error("Video yüklenirken bir hata oluştu");
        }
      } else {
        // Handle URL
        const response = await fetch("/api/videos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            videoUrl: formData.videoUrl,
            duration: formData.duration,
          }),
        });

        if (!response.ok) {
          throw new Error("Video eklenirken bir hata oluştu");
        }
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        videoUrl: "",
        thumbnailUrl: "",
        duration: "",
        category: "",
      });
      setVideoFile(null);
      setThumbnailFile(null);

      onOpenChange(false);
      onVideoAdded?.();
    } catch (error) {
      console.error("Video ekleme hatası:", error);
      alert("Video eklenirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof CreateVideoRequest, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni Video Ekle</DialogTitle>
          <DialogDescription>
            Öğrencilerinizle paylaşmak için yeni bir ders videosu ekleyin.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Video Başlığı *</Label>
            <Input
              id="title"
              placeholder="Örn: Python'a Giriş - Değişkenler"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama *</Label>
            <Textarea
              id="description"
              placeholder="Video hakkında kısa bir açıklama yazın..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              required
            />
          </div>

          <Tabs value={videoType} onValueChange={(v) => setVideoType(v as "url" | "file")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted p-1">
              <TabsTrigger 
                value="url" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground"
              >
                <Link className="h-4 w-4" />
                Video URL
              </TabsTrigger>
              <TabsTrigger 
                value="file" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground"
              >
                <Upload className="h-4 w-4" />
                Dosya Yükle
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL *</Label>
                <Input
                  id="videoUrl"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.videoUrl}
                  onChange={(e) => handleChange("videoUrl", e.target.value)}
                  required={videoType === "url"}
                />
                <p className="text-xs text-muted-foreground">
                  YouTube video linki veya direkt video URL'si girin
                </p>
              </div>
            </TabsContent>

            <TabsContent value="file" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="videoFile">Video Dosyası *</Label>
                <div className="relative">
                  <label
                    htmlFor="videoFile"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
                  >
                    {videoFile ? (
                      <div className="flex flex-col items-center justify-center gap-2 text-center p-4">
                        <FileVideo className="h-8 w-8 text-primary" />
                        <p className="text-sm font-medium">{videoFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Video className="h-10 w-10 text-muted-foreground" />
                        <p className="text-sm font-medium">Video Dosyası Seçin</p>
                        <p className="text-xs text-muted-foreground">
                          MP4, AVI, MOV veya diğer video formatları
                        </p>
                      </div>
                    )}
                  </label>
                  {videoFile && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.preventDefault();
                        setVideoFile(null);
                        const input = document.getElementById("videoFile") as HTMLInputElement;
                        if (input) input.value = "";
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Input
                    id="videoFile"
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    required={videoType === "file"}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnailFile">Kapak Görseli (Opsiyonel)</Label>
                <div className="relative">
                  <label
                    htmlFor="thumbnailFile"
                    className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
                  >
                    {thumbnailFile ? (
                      <div className="flex flex-col items-center justify-center gap-2 text-center p-4">
                        <Image className="h-8 w-8 text-primary" />
                        <p className="text-sm font-medium">{thumbnailFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(thumbnailFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Image className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm font-medium">Kapak Görseli Seçin</p>
                        <p className="text-xs text-muted-foreground">
                          JPG, PNG veya diğer görsel formatları
                        </p>
                      </div>
                    )}
                  </label>
                  {thumbnailFile && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.preventDefault();
                        setThumbnailFile(null);
                        const input = document.getElementById("thumbnailFile") as HTMLInputElement;
                        if (input) input.value = "";
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Input
                    id="thumbnailFile"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              İptal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {videoType === "file" ? "Yükleniyor..." : "Ekleniyor..."}
                </>
              ) : (
                "Video Ekle"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

