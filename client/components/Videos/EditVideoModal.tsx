import { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { apis } from "@/services";
import { Tutorial } from "@shared/api";

interface EditVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tutorial: Tutorial | null;
  onVideoUpdated?: () => void;
}

export function EditVideoModal({ open, onOpenChange, tutorial, onVideoUpdated }: EditVideoModalProps) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video_url: "",
  });

  useEffect(() => {
    if (tutorial) {
      setFormData({
        title: tutorial.title || "",
        description: tutorial.description || "",
        video_url: tutorial.video_url || "",
      });
    }
  }, [tutorial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorial) return;
    
    setIsLoading(true);

    try {
      const response = await apis.tutorial.update_tutorial(tutorial.id, {
        title: formData.title,
        description: formData.description,
        video_url: formData.video_url,
      });

      if (response.status !== 200) {
        throw new Error(t('tutorials.videoUpdateError'));
      }

      onOpenChange(false);
      onVideoUpdated?.();
    } catch (error) {
      console.error("Video güncelleme hatası:", error);
      alert(t('tutorials.videoUpdateErrorRetry'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!tutorial) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('tutorials.editVideo')}</DialogTitle>
          <DialogDescription>
            {t('tutorials.editVideoDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('tutorials.videoTitle')} *</Label>
            <Input
              id="title"
              placeholder={t('tutorials.enterVideoTitle')}
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('tutorials.videoDescription')} *</Label>
            <Textarea
              id="description"
              placeholder={t('tutorials.enterVideoDescription')}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video_url">{t('tutorials.videoUrl')} *</Label>
            <Input
              id="video_url"
              type="url"
              placeholder={t('tutorials.enterVideoUrl')}
              value={formData.video_url}
              onChange={(e) => handleChange("video_url", e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              {t('tutorials.videoUrlHelp')}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {t('tutorials.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('tutorials.updating')}
                </>
              ) : (
                t('tutorials.updateVideo')
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
