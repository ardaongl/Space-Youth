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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AddTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskAdded?: () => void;
}

export function AddTaskModal({ open, onOpenChange, onTaskAdded }: AddTaskModalProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coins: "",
    difficulty: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement API call to create task
      console.log("Creating task:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: t('success.created'),
        description: t('tasks.addTask') + " - " + formData.title,
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        coins: "",
        difficulty: "",
      });

      onTaskAdded?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: t('common.error'),
        description: t('errors.somethingWentWrong'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('tasks.addTask')}</DialogTitle>
          <DialogDescription>
            {t('tasks.taskDescription') || 'Yeni bir görev oluşturun ve öğrencilerinizle paylaşın'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="title">{t('tasks.taskTitle')} *</Label>
            <Input
              id="title"
              placeholder={t('tasks.taskTitle')}
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </div>

          {/* Task Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t('tasks.taskDescription')} *</Label>
            <Textarea
              id="description"
              placeholder={t('tasks.taskDescription')}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={5}
              required
            />
          </div>

          {/* Coin Value */}
          <div className="space-y-2">
            <Label htmlFor="coins">{t('tasks.coinValue')} *</Label>
            <Input
              id="coins"
              type="number"
              min="1"
              placeholder="100"
              value={formData.coins}
              onChange={(e) => handleChange("coins", e.target.value)}
              required
            />
          </div>

          {/* Difficulty Level */}
          <div className="space-y-2">
            <Label htmlFor="difficulty">{t('courses.level')} *</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => handleChange("difficulty", value)}
              required
            >
              <SelectTrigger className={cn(
                "w-full",
                !formData.difficulty && "[&>span]:text-muted-foreground"
              )}>
                <SelectValue placeholder={`${t('common.select')} ${t('courses.level')}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">{t('courses.beginner')}</SelectItem>
                <SelectItem value="intermediate">{t('courses.intermediate')}</SelectItem>
                <SelectItem value="advanced">{t('courses.advanced')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? t('common.loading') : t('tasks.addTask')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

