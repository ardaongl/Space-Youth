import { useTaskSubmissions, type SubmissionStatus } from "@/context/TaskSubmissionsContext";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, XCircle, Clock4 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusConfig: Record<SubmissionStatus, { icon: typeof Clock, color: string, text: string }> = {
  pending: { 
    icon: Clock4, 
    color: "text-yellow-500 bg-yellow-500/10", 
    text: "İnceleme Bekliyor" 
  },
  approved: { 
    icon: CheckCircle2, 
    color: "text-emerald-500 bg-emerald-500/10", 
    text: "Kabul Edildi" 
  },
  rejected: { 
    icon: XCircle, 
    color: "text-red-500 bg-red-500/10", 
    text: "Reddedildi" 
  }
};

export default function MyTasks() {
  const { submissions } = useTaskSubmissions();
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Görevlerim</h1>
            <p className="mt-1 text-muted-foreground">
              Gönderdiğiniz görevleri ve durumlarını takip edin
            </p>
          </div>

          <div className="space-y-4">
            {submissions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Henüz görev gönderilmedi
              </div>
            ) : (
              submissions.map(submission => {
                const { icon: StatusIcon, color, text } = statusConfig[submission.status];
                
                return (
                  <div 
                    key={submission.id} 
                    className="rounded-lg border bg-card p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{submission.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {submission.description}
                        </p>
                      </div>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm ${color}`}>
                        <StatusIcon className="h-4 w-4" />
                        <span>{text}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          Gönderildi: {new Intl.DateTimeFormat('tr-TR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          }).format(submission.submittedAt)}
                        </span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/tasks/${submission.taskId}`)}
                      >
                        Görevi Gör
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
