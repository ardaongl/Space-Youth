import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Coins, Calendar, CheckCircle2, ArrowLeft } from "lucide-react";
import { useTasks } from "@/context/TasksContext";
import { useTaskSubmissions } from "@/context/TaskSubmissionsContext";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export default function TaskDetail() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const { t } = useLanguage();
  const { tasks, updateTaskStatus } = useTasks();
  const { addSubmission } = useTaskSubmissions();
  
  const task = tasks.find(t => t.href.split('/').pop() === taskId);

  if (!task) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t('tasks.taskNotFound')}</h1>
            <Button onClick={() => navigate('/tasks')}>{t('tasks.backToTasks')}</Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "In Progress":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "In Review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Accepted":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300";
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "To Do":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "Overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSubmitWork = () => {
    if (task) {
      // Navigate to PostProject page for file upload
      navigate(`/tasks/${taskId}/post`);
    }
  };

  return (
    <AppLayout>
      <div className="container py-4 ml-1">
        <div className="max-w-7xl">
          <div className="flex items-start gap-4">
            {/* Back Button */}
            <Button
              variant="ghost"
              size="lg"
              className="mt-1 flex-shrink-0 gap-2"
              onClick={() => navigate('/tasks')}
            >
              <ArrowLeft className="h-5 w-5" />
              Geri Dön
            </Button>

            {/* Task Card */}
            <div className="flex-1 bg-card rounded-lg border shadow-sm overflow-hidden">
            {/* Task Layout: Image Left, Content Right */}
            <div className="flex flex-col md:flex-row gap-0">
              {/* Task Image - Left Side */}
              {task.image && (
                <div className="w-full md:w-80 lg:w-96 flex-shrink-0 bg-muted flex items-center justify-center overflow-hidden">
                  <img
                    src={task.image}
                    alt={task.title}
                    className="w-full h-full object-cover min-h-[300px] md:min-h-full"
                  />
                </div>
              )}

              {/* Task Content - Right Side */}
              <div className="flex-1 p-8">
                {/* Status Badge */}
                <div className="mb-4 flex justify-end">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "rounded-full px-3 py-1",
                      getStatusColor(task.status)
                    )}
                  >
                    {task.status}
                  </Badge>
                </div>

                {/* Task Title */}
                <h1 className="text-3xl lg:text-4xl font-bold mb-4">{task.title}</h1>

                {/* Task Meta Info */}
                <div className="flex flex-wrap gap-6 mb-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-yellow-600" />
                    <span className="font-semibold text-yellow-600">+{task.coins}</span>
                    <span>coins</span>
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold mb-3">Description</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {task.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Task Details</h3>
                    <div className="space-y-3 text-muted-foreground">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                        <div>
                          <p className="font-medium">Category</p>
                          <p>{task.category}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                        <div>
                          <p className="font-medium">Level</p>
                          <p>{task.level}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                        <div>
                          <p className="font-medium">Type</p>
                          <p>{task.type}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">What you'll achieve</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                        <span>Develop essential {task.category} skills through hands-on practice</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                        <span>Build portfolio-ready work that showcases your abilities</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                        <span>Earn {task.coins} coins upon successful completion</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Submit Work Button */}
                <div className="mt-8 pt-6 border-t">
                  <div className="flex items-center gap-4">
                    <Button
                      size="lg"
                      className="flex-1 gap-2"
                      onClick={handleSubmitWork}
                      disabled={task.status === "Done" || task.status === "Accepted" || task.status === "Rejected"}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      {task.status === "Done" ? "Task Completed" : 
                       task.status === "Accepted" ? "Work Accepted" :
                       task.status === "Rejected" ? "Work Rejected" :
                       task.status === "In Review" ? "Work Under Review" : "Submit Work"}
                    </Button>
                  </div>
                  {task.status === "To Do" && (
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                      Complete your work and submit it for review to earn {task.coins} coins.
                    </p>
                  )}
                  {task.status === "In Review" && (
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                      Your work is currently under review. You will be notified of the result soon.
                    </p>
                  )}
                  {task.status === "Accepted" && (
                    <p className="text-sm text-green-600 mt-4 text-center">
                      Congratulations! Your work has been accepted and you earned {task.coins} coins.
                    </p>
                  )}
                  {task.status === "Rejected" && (
                    <p className="text-sm text-red-600 mt-4 text-center">
                      Your work needs revision. Please review the feedback and resubmit.
                    </p>
                  )}
                  {task.status === "Done" && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-4 text-center font-medium">
                      🎉 Tebrikler! Bu görevi tamamladınız ve {task.coins} coin kazandınız!
                    </p>
                  )}
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}