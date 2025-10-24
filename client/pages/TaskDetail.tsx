import { useParams, useNavigate } from "react-router-dom";
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Clock, Coins, Calendar, CheckCircle2, ArrowLeft, Users, FileText, CheckCircle, Clock3, XCircle, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { useTasks } from "@/context/TasksContext";
import { useTaskSubmissions } from "@/context/TaskSubmissionsContext";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { isTeacher, isAdmin } from "@/utils/roles";

export default function TaskDetail() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const { t } = useLanguage();
  const { auth } = useAuth();
  const { tasks, updateTaskStatus } = useTasks();
  const { addSubmission } = useTaskSubmissions();
  
  const isTeacherUser = isTeacher(auth.user?.role);
  const isAdminUser = isAdmin(auth.user?.role);
  const canViewSubmissions = isTeacherUser || isAdminUser;
  const canManageTasks = isTeacherUser || isAdminUser;
  
  const task = tasks.find(t => t.href.split('/').pop() === taskId);

  // Mock data for task submissions
  const taskSubmissions = [
    {
      id: 1,
      userId: 1,
      userName: "Ahmet Yılmaz",
      userEmail: "ahmet@example.com",
      status: "completed",
      submittedAt: "2024-01-15T10:30:00Z",
      files: ["project_report.pdf", "presentation.pptx"],
      comment: "Görevi başarıyla tamamladım. Rapor ve sunum dosyalarını ekliyorum."
    },
    {
      id: 2,
      userId: 2,
      userName: "Ayşe Demir",
      userEmail: "ayse@example.com",
      status: "pending",
      submittedAt: "2024-01-16T14:20:00Z",
      files: ["task_solution.zip"],
      comment: "Görev çözümümü gönderiyorum. İncelemenizi bekliyorum."
    },
    {
      id: 3,
      userId: 3,
      userName: "Mehmet Kaya",
      userEmail: "mehmet@example.com",
      status: "completed",
      submittedAt: "2024-01-14T09:15:00Z",
      files: ["final_project.pdf", "code_repository.zip"],
      comment: "Proje tamamlandı. Kod ve dokümantasyon hazır."
    },
    {
      id: 4,
      userId: 4,
      userName: "Fatma Özkan",
      userEmail: "fatma@example.com",
      status: "pending",
      submittedAt: "2024-01-17T16:45:00Z",
      files: ["submission.pdf"],
      comment: "Görev teslimim. Lütfen değerlendirin."
    }
  ];

  const [submissions, setSubmissions] = React.useState(taskSubmissions);
  
  const completedSubmissions = submissions.filter(sub => sub.status === "completed");
  const pendingSubmissions = submissions.filter(sub => sub.status === "pending");
  const rejectedSubmissions = submissions.filter(sub => sub.status === "rejected");

  const handleApproveSubmission = (submissionId: number) => {
    setSubmissions(prev => 
      prev.map(sub => 
        sub.id === submissionId 
          ? { ...sub, status: "completed" as const }
          : sub
      )
    );
  };

  const handleRejectSubmission = (submissionId: number) => {
    setSubmissions(prev => 
      prev.map(sub => 
        sub.id === submissionId 
          ? { ...sub, status: "rejected" as const }
          : sub
      )
    );
  };

  const handleEditTask = () => {
    // Navigate to edit task page
    navigate(`/tasks/${taskId}/edit`);
  };

  const handleDeleteTask = () => {
    if (window.confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
      // Delete task logic
      console.log('Deleting task:', taskId);
      // In real app, this would call an API to delete the task
      navigate('/tasks');
    }
  };

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
                {/* Status Badge - Only for students */}
                {!canManageTasks && (
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
                )}

                {/* Task Title */}
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl lg:text-4xl font-bold">{task.title}</h1>
                  {canManageTasks && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleEditTask}>
                          <Edit className="h-4 w-4 mr-2" />
                          Görevi Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={handleDeleteTask}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Görevi Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

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

                {/* Submit Work Button - Only for students */}
                {!canManageTasks && (
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
                  </div>
                )}
                {!canManageTasks && (
                  <>
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
                  </>
                )}
              </div>
            </div>
            </div>
          </div>

          {/* Task Submissions Section - Only for teachers and admins */}
          {canViewSubmissions && (
            <div className="mt-8">
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Görev Teslimleri</h2>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{submissions.length}</div>
                    <div className="text-sm text-muted-foreground">Toplam Teslim</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{completedSubmissions.length}</div>
                    <div className="text-sm text-muted-foreground">Tamamlanan</div>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-950 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{pendingSubmissions.length}</div>
                    <div className="text-sm text-muted-foreground">Onay Bekleyen</div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{rejectedSubmissions.length}</div>
                    <div className="text-sm text-muted-foreground">Reddedilen</div>
                  </div>
                </div>

                {/* Pending Submissions */}
                {pendingSubmissions.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-yellow-600" />
                      Onay Bekleyen Teslimler ({pendingSubmissions.length})
                    </h3>
                    <div className="space-y-4">
                      {pendingSubmissions.map((submission) => (
                        <div key={submission.id} className="border rounded-lg p-4 bg-yellow-50/50 dark:bg-yellow-950/20">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-sm font-semibold text-primary">
                                    {submission.userName.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-semibold">{submission.userName}</h4>
                                  <p className="text-sm text-muted-foreground">{submission.userEmail}</p>
                                </div>
                                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                  Onay Bekliyor
                                </Badge>
                              </div>
                              <div className="mb-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    Yüklenen Dosyalar ({submission.files.length})
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {submission.files.map((file, index) => (
                                    <Button
                                      key={index}
                                      variant="outline"
                                      size="sm"
                                      className="text-xs h-8"
                                      onClick={() => {
                                        // Mock file download/view action
                                        console.log(`Opening file: ${file}`);
                                        // In real app, this would open/download the file
                                      }}
                                    >
                                      <FileText className="h-3 w-3 mr-1" />
                                      {file}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Teslim Tarihi: {new Date(submission.submittedAt).toLocaleDateString('tr-TR')}
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApproveSubmission(submission.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Onayla
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => handleRejectSubmission(submission.id)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reddet
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Completed Submissions */}
                {completedSubmissions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Tamamlanan Teslimler ({completedSubmissions.length})
                    </h3>
                    <div className="space-y-4">
                      {completedSubmissions.map((submission) => (
                        <div key={submission.id} className="border rounded-lg p-4 bg-green-50/50 dark:bg-green-950/20">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                  <span className="text-sm font-semibold text-green-600">
                                    {submission.userName.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-semibold">{submission.userName}</h4>
                                  <p className="text-sm text-muted-foreground">{submission.userEmail}</p>
                                </div>
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  Tamamlandı
                                </Badge>
                              </div>
                              <div className="mb-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    Yüklenen Dosyalar ({submission.files.length})
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {submission.files.map((file, index) => (
                                    <Button
                                      key={index}
                                      variant="outline"
                                      size="sm"
                                      className="text-xs h-8"
                                      onClick={() => {
                                        // Mock file download/view action
                                        console.log(`Opening file: ${file}`);
                                        // In real app, this would open/download the file
                                      }}
                                    >
                                      <FileText className="h-3 w-3 mr-1" />
                                      {file}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Tamamlanma Tarihi: {new Date(submission.submittedAt).toLocaleDateString('tr-TR')}
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button size="sm" variant="outline">
                                <FileText className="h-4 w-4 mr-1" />
                                Tümünü İndir
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rejected Submissions */}
                {rejectedSubmissions.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      Reddedilen Teslimler ({rejectedSubmissions.length})
                    </h3>
                    <div className="space-y-4">
                      {rejectedSubmissions.map((submission) => (
                        <div key={submission.id} className="border rounded-lg p-4 bg-red-50/50 dark:bg-red-950/20">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                                  <span className="text-sm font-semibold text-red-600">
                                    {submission.userName.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-semibold">{submission.userName}</h4>
                                  <p className="text-sm text-muted-foreground">{submission.userEmail}</p>
                                </div>
                                <Badge variant="outline" className="text-red-600 border-red-600">
                                  Reddedildi
                                </Badge>
                              </div>
                              <div className="mb-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    Yüklenen Dosyalar ({submission.files.length})
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {submission.files.map((file, index) => (
                                    <Button
                                      key={index}
                                      variant="outline"
                                      size="sm"
                                      className="text-xs h-8"
                                      onClick={() => {
                                        // Mock file download/view action
                                        console.log(`Opening file: ${file}`);
                                        // In real app, this would open/download the file
                                      }}
                                    >
                                      <FileText className="h-3 w-3 mr-1" />
                                      {file}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Reddedilme Tarihi: {new Date(submission.submittedAt).toLocaleDateString('tr-TR')}
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleApproveSubmission(submission.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Tekrar Onayla
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No submissions message */}
                {submissions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Henüz teslim yok</p>
                    <p className="text-sm">Bu görevi henüz kimse tamamlamamış.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}