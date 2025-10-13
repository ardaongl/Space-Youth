import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDrafts } from "@/context/DraftsContext";
import { useTaskSubmissions } from "@/context/TaskSubmissionsContext";
import { useTasks } from "@/context/TasksContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon } from "lucide-react";

export default function PostProject() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const { saveDraft, getDraftByTaskId } = useDrafts();
  const { addSubmission } = useTaskSubmissions();
  const { tasks, updateTaskStatus } = useTasks();
  
  const [dragActive, setDragActive] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);

  // Load existing draft if any
  useEffect(() => {
    if (taskId) {
      const existingDraft = getDraftByTaskId(taskId);
      if (existingDraft) {
        setTitle(existingDraft.title);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
          >
            İptal
          </Button>
          <h1 className="text-xl font-semibold">Proje Paylaş</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                if (taskId && (title || description || coverImage)) {
                  saveDraft({
                    taskId,
                    title,
                    description,
                    coverImage: coverImage || undefined
                  });
                  navigate(`/tasks/${taskId}`);
                }
              }}
            >
              Taslak olarak kaydet
            </Button>
            <Button
              onClick={() => {
                if (taskId && (title || description || coverImage)) {
                  // Find the task and update its status to "In Review"
                  const task = tasks.find(t => t.href.split('/').pop() === taskId);
                  if (task) {
                    updateTaskStatus(task.id, "In Review");
                  }
                  
                  // Add submission
                  addSubmission({
                    taskId,
                    title,
                    description,
                    coverImage: coverImage || undefined
                  });
                  
                  navigate('/my-tasks');
                }
              }}
            >
              Görevi Gönder
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-center">Projenize isim verin</h2>
            <Input
              placeholder="Proje adını girin"
              className="text-lg py-6"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-muted"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 text-muted-foreground">
                <ImageIcon className="w-full h-full" />
              </div>
              <div className="text-center">
                <p className="font-medium">
                  Kapak görseli sürükleyip bırakın veya{" "}
                  <Button variant="link" className="px-1">Gözat</Button>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Minimum 1600px genişlik önerilir. Maksimum dosya boyutu 10MB (videolar için 20MB).
                </p>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• Yüksek çözünürlüklü görseller (png, jpg, gif)</div>
                <div>• Hareketli gifler</div>
                <div>• Videolar (mp4)</div>
                <div>• Yalnızca hakkına sahip olduğunuz medyaları yükleyin</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Proje Açıklaması</h3>
            <Textarea
              placeholder="Projenizin arkasındaki karar verme sürecini ve mantığını detaylı bir şekilde açıklayın. Ne kadar detaylı olursanız o kadar iyi!"
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
