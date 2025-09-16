import { Clock, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Draft } from "@/context/DraftsContext";

interface DraftCardProps {
  draft: Draft;
}

export function DraftCard({ draft }: DraftCardProps) {
  const navigate = useNavigate();
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(draft.lastUpdated);

  return (
    <div className="rounded-xl border bg-card">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Draft in Progress</h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary"
            onClick={() => navigate(`/tasks/${draft.taskId}/post`)}
          >
            <FileEdit className="h-4 w-4 mr-2" />
            Continue Editing
          </Button>
        </div>

        <div className="space-y-2">
          {draft.title && (
            <p className="text-sm font-medium">{draft.title}</p>
          )}
          {draft.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {draft.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Last edited {formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
