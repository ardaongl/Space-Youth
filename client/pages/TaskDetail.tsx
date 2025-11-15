import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Clock, Coins, Calendar, CheckCircle2, ArrowLeft, Users, FileText, CheckCircle, Clock3, XCircle, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { isTeacher, isAdmin } from "@/utils/roles";
import { useAppSelector } from "@/store";
import { apis } from "@/services";
import { Task, TaskStatus } from "@/data/tasks";

// API'den gelen Task interface'i
interface ApiTask {
  id?: number;
  name: string;
  description: string;
  point: number;
  achivements: string;
  image_url: string;
  level: string;
}

// Task'a achivements eklemek için genişletilmiş interface
interface TaskWithAchievements extends Task {
  achivements?: string;
}

// API'den gelen submission interface'i
interface ApiSubmission {
  id: string;
  description: string;
  file_url: string;
  file_name: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  task: {
    id: string;
    name: string;
    point: number;
    description: string;
    image_url: string;
    level: string;
    achivements: string;
  };
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    [key: string]: any;
  };
}

// UI'da kullanılan submission interface'i
interface Submission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: "completed" | "pending" | "rejected";
  submittedAt: string;
  files: { name: string; url: string }[];
  comment: string;
}

export default function TaskDetail() {
  const user = useAppSelector(state => state.user);
  const navigate = useNavigate();
  const { taskId } = useParams();
  const { t } = useLanguage();
  
  const [task, setTask] = useState<TaskWithAchievements | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  
  const isTeacherUser = isTeacher(user.user?.role);
  const isAdminUser = isAdmin(user.user?.role);
  const canViewSubmissions = isTeacherUser || isAdminUser;
  const canManageTasks = isTeacherUser || isAdminUser;

  // API'den görevi çek
  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) return;
      
      setLoading(true);
      setError(null);
      try {
        const response = await apis.task.get_task(taskId);
        if (response.status === 200 && response.data) {
          const apiTask: ApiTask = response.data;
          // API'den gelen veriyi UI'da kullanılan Task formatına map et
          const mappedTask: TaskWithAchievements = {
            id: apiTask.id || 0,
            title: apiTask.name,
            description: apiTask.description,
            duration: "",
            level: apiTask.level,
            type: "",
            category: "UX" as const,
            href: `/tasks/${apiTask.id}`,
            icon: null,
            coins: apiTask.point,
            status: "To Do" as TaskStatus,
            deadline: "",
            image: apiTask.image_url || undefined,
            completionCount: 0,
            achivements: apiTask.achivements,
          };
          setTask(mappedTask);
        } else {
          setError("Görev bulunamadı");
        }
      } catch (err: any) {
        console.error("Error fetching task:", err);
        setError(err.response?.data?.error?.message || "Görev getirilirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  // API'den submission'ları çek (sadece admin/teacher için)
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!taskId || !canViewSubmissions) return;
      
      setLoadingSubmissions(true);
      try {
        const response = await apis.task.get_completed_tasks(taskId);
        if (response.status === 200 && response.data) {
          // API'den gelen veriyi UI formatına map et
          const mappedSubmissions: Submission[] = response.data.map((apiSub: ApiSubmission) => ({
            id: apiSub.id,
            userId: apiSub.user.id,
            userName: `${apiSub.user.first_name} ${apiSub.user.last_name}`,
            userEmail: apiSub.user.email,
            status: apiSub.status === "APPROVED" ? "completed" as const :
                    apiSub.status === "REJECTED" ? "rejected" as const :
                    "pending" as const,
            submittedAt: new Date().toISOString(), // API'den gelmiyorsa şimdilik
            files: [{
              name: apiSub.file_name,
              url: apiSub.file_url
            }],
            comment: apiSub.description || "",
          }));
          setSubmissions(mappedSubmissions);
        }
      } catch (err: any) {
        console.error("Error fetching submissions:", err);
        setSubmissions([]);
      } finally {
        setLoadingSubmissions(false);
      }
    };

    fetchSubmissions();
  }, [taskId, canViewSubmissions]);
  
  const completedSubmissions = submissions.filter(sub => sub.status === "completed");
  const pendingSubmissions = submissions.filter(sub => sub.status === "pending");
  const rejectedSubmissions = submissions.filter(sub => sub.status === "rejected");

  const handleApproveSubmission = async (submissionId: string) => {
    try {
      const response = await apis.task.admin_approve_task(submissionId, true);
      if (response.status === 200 || response.status === 201) {
        // Submission'ları yeniden yükle
        if (taskId) {
          const fetchResponse = await apis.task.get_completed_tasks(taskId);
          if (fetchResponse.status === 200 && fetchResponse.data) {
            const mappedSubmissions: Submission[] = fetchResponse.data.map((apiSub: ApiSubmission) => ({
              id: apiSub.id,
              userId: apiSub.user.id,
              userName: `${apiSub.user.first_name} ${apiSub.user.last_name}`,
              userEmail: apiSub.user.email,
              status: apiSub.status === "APPROVED" ? "completed" as const :
                      apiSub.status === "REJECTED" ? "rejected" as const :
                      "pending" as const,
              submittedAt: new Date().toISOString(),
              files: [{
                name: apiSub.file_name,
                url: apiSub.file_url
              }],
              comment: apiSub.description || "",
            }));
            setSubmissions(mappedSubmissions);
          }
        }
      }
    } catch (error: any) {
      console.error("Error approving submission:", error);
      alert("Teslim onaylanırken bir hata oluştu");
    }
  };

  const handleRejectSubmission = async (submissionId: string) => {
    try {
      const response = await apis.task.admin_approve_task(submissionId, false);
      if (response.status === 200 || response.status === 201) {
        // Submission'ları yeniden yükle
        if (taskId) {
          const fetchResponse = await apis.task.get_completed_tasks(taskId);
          if (fetchResponse.status === 200 && fetchResponse.data) {
            const mappedSubmissions: Submission[] = fetchResponse.data.map((apiSub: ApiSubmission) => ({
              id: apiSub.id,
              userId: apiSub.user.id,
              userName: `${apiSub.user.first_name} ${apiSub.user.last_name}`,
              userEmail: apiSub.user.email,
              status: apiSub.status === "APPROVED" ? "completed" as const :
                      apiSub.status === "REJECTED" ? "rejected" as const :
                      "pending" as const,
              submittedAt: new Date().toISOString(),
              files: [{
                name: apiSub.file_name,
                url: apiSub.file_url
              }],
              comment: apiSub.description || "",
            }));
            setSubmissions(mappedSubmissions);
          }
        }
      }
    } catch (error: any) {
      console.error("Error rejecting submission:", error);
      alert("Teslim reddedilirken bir hata oluştu");
    }
  };

  const handleEditTask = () => {
    // Navigate to edit task page
    navigate(`/tasks/${taskId}/edit`);
  };

  const handleDeleteTask = async () => {
    if (!taskId || !window.confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      const response = await apis.task.admin_delete_task(taskId);
      if (response.status === 200 || response.status === 204) {
        navigate('/tasks');
      } else {
        alert("Görev silinirken bir hata oluştu");
      }
    } catch (error: any) {
      console.error("Error deleting task:", error);
      alert("Görev silinirken bir hata oluştu");
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8">
          <div className="text-center">
            <p className="text-muted-foreground">Yükleniyor...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !task) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{error || t('tasks.taskNotFound')}</h1>
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
                    <span>{t('common.coins')}</span>
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
                    {task.achivements ? (
                      <div className="text-muted-foreground whitespace-pre-line">
                        {task.achivements}
                      </div>
                    ) : (
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
                          <span>Earn {task.coins} {t('common.coins')} upon successful completion</span>
                        </li>
                      </ul>
                    )}
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
                        Complete your work and submit it for review to earn {task.coins} {t('common.coins')}.
                      </p>
                    )}
                    {task.status === "In Review" && (
                      <p className="text-sm text-muted-foreground mt-4 text-center">
                        Your work is currently under review. You will be notified of the result soon.
                      </p>
                    )}
                    {task.status === "Accepted" && (
                      <p className="text-sm text-green-600 mt-4 text-center">
                        Congratulations! Your work has been accepted and you earned {task.coins} {t('common.coins')}.
                      </p>
                    )}
                    {task.status === "Rejected" && (
                      <p className="text-sm text-red-600 mt-4 text-center">
                        Your work needs revision. Please review the feedback and resubmit.
                      </p>
                    )}
                    {task.status === "Done" && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-4 text-center font-medium">
                        🎉 Tebrikler! Bu görevi tamamladınız ve {task.coins} {t('common.coins')} kazandınız!
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
                  {loadingSubmissions && (
                    <span className="text-sm text-muted-foreground">(Yükleniyor...)</span>
                  )}
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
                                        // Dosyayı yeni sekmede aç
                                        window.open(file.url, '_blank');
                                      }}
                                    >
                                      <FileText className="h-3 w-3 mr-1" />
                                      {file.name}
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
                                        // Dosyayı yeni sekmede aç
                                        window.open(file.url, '_blank');
                                      }}
                                    >
                                      <FileText className="h-3 w-3 mr-1" />
                                      {file.name}
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
                                        // Dosyayı yeni sekmede aç
                                        window.open(file.url, '_blank');
                                      }}
                                    >
                                      <FileText className="h-3 w-3 mr-1" />
                                      {file.name}
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