import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDrafts } from "@/context/DraftsContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, Loader2, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { apis } from "@/services";
import { useToast } from "@/hooks/use-toast";

export default function PostProject() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const { saveDraft, getDraftByTaskId } = useDrafts();
  const { t } = useLanguage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [dragActive, setDragActive] = useState(false);
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing draft if any
  useEffect(() => {
    if (taskId) {
      const existingDraft = getDraftByTaskId(taskId);
      if (existingDraft) {
        setDescription(existingDraft.description);
        if (existingDraft.coverImage instanceof File) {
          setCoverImage(existingDraft.coverImage);
        }
      }
    }
  }, [taskId, getDraftByTaskId]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setCoverImage(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setCoverImage(file);
    }
  };

  const handleRemoveFile = () => {
    setCoverImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveDraft = () => {
    if (!taskId || (!description && !coverImage)) {
      return;
    }

    saveDraft({
      taskId,
      title: "",
      description,
      coverImage: coverImage || undefined,
    });

    toast({
      title: t("common.success"),
      description: t("project.draftSaved"),
    });
  };

  const handleSubmit = async () => {
    if (!taskId) {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: t("project.missingTaskId"),
      });
      return;
    }

    if (!description.trim()) {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: t("project.descriptionRequired"),
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apis.task.complete_task({
        task_id: taskId,
        description: description.trim(),
        file: coverImage ?? undefined,
      });

      const status = (response as any)?.status ?? (response as any)?.response?.status;
      const data = (response as any)?.data ?? (response as any)?.response?.data;

      if (status >= 200 && status < 300) {
        toast({
          title: t("project.submissionSuccessTitle"),
          description: t("project.submissionSuccessDescription"),
        });
        navigate(`/tasks/${taskId}`);
      } else {
        const errorMessage =
          (data && data.error && data.error.message) || t("project.submissionFailed");
        toast({
          variant: "destructive",
          title: t("common.error"),
          description: errorMessage,
        });
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error?.message || error?.message || t("project.submissionFailed");
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
{t('common.cancel')}
          </Button>
          <h1 className="text-xl font-semibold">{t('project.shareProject')}</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
              disabled={!taskId || (!description && !coverImage) || isSubmitting}
            >
{t('project.saveAsDraft')}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                t('project.submitTask')
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <div
            className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer ${
              dragActive ? "border-primary bg-primary/5" : "border-muted"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 text-muted-foreground">
                <ImageIcon className="w-full h-full" />
              </div>
              <div className="text-center">
                <p className="font-medium">
                  {t('project.dragAndDropCover')}{" "}
                  <Button
                    variant="link"
                    className="px-1"
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    {t('project.browse')}
                  </Button>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('project.coverImageRequirements')}
                </p>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• {t('project.highResImages')}</div>
                <div>• {t('project.animatedGifs')}</div>
                <div>• {t('project.videos')}</div>
                <div>• {t('project.onlyOwnedMedia')}</div>
              </div>
            </div>
          </div>

          {coverImage && (
            <div className="flex items-center justify-between rounded-md border bg-muted/50 p-3">
              <div>
                <p className="text-sm font-medium">{t('project.selectedFile')}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                  {coverImage.name}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={handleRemoveFile}
              >
                <X className="mr-2 h-4 w-4" />
                {t('project.removeFile')}
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-lg font-medium">{t('project.projectDescription')}</h3>
            <Textarea
              placeholder={t('project.descriptionPlaceholder')}
              className="min-h-[200px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
