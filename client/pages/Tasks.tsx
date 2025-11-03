import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { TaskStatus } from "@/data/tasks";
import { Task } from "@/data/tasks";

import { useLanguage } from "@/context/LanguageContext";
import { isAdmin, isTeacher } from "@/utils/roles";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store";
import { apis } from "@/services";

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

export default function Tasks() {
  const user = useAppSelector(state => state.user);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus[]>([]);

  // API'den görevleri çek
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apis.task.get_tasks();
        if (response.status === 200 && response.data) {
          // API'den gelen veriyi UI'da kullanılan Task formatına map et
          const mappedTasks: Task[] = response.data.map((apiTask: ApiTask) => ({
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
          }));
          setTasks(mappedTasks);
        }
      } catch (err: any) {
        console.error("Error fetching tasks:", err);
        setError(err.response?.data?.error?.message || "Görevler getirilirken bir hata oluştu.");
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(task.status);
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: TaskStatus) => {
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

  const getStatusTranslation = (status: TaskStatus) => {
    switch (status) {
      case "Done": return t('tasks.completed');
      case "In Progress": return t('tasks.inProgress');
      case "In Review": return t('tasks.inReview');
      case "Accepted": return t('tasks.accepted');
      case "Rejected": return t('tasks.rejected');
      case "To Do": return t('tasks.pending');
      case "Overdue": return t('tasks.overdue');
      default: return status;
    }
  };

  const handleTaskClick = (taskId: number) => {
    navigate(`/tasks/${taskId}`);
  };

  const handleEditTask = async (taskId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Edit task:", taskId);
    // TODO: Implement edit functionality - navigate to edit page or open modal
  };

  const handleDeleteTask = async (taskId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Bu görevi silmek istediğinizden emin misiniz?")) {
      return;
    }
    
    try {
      const deleteResponse = await apis.task.admin_delete_task(taskId.toString());
      if (deleteResponse.status === 200 || deleteResponse.status === 204) {
        // Görevleri yeniden yükle
        const fetchResponse = await apis.task.get_tasks();
        if (fetchResponse.status === 200 && fetchResponse.data) {
          const mappedTasks: Task[] = fetchResponse.data.map((apiTask: ApiTask) => ({
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
          }));
          setTasks(mappedTasks);
        }
      }
    } catch (error: any) {
      console.error("Error deleting task:", error);
      alert("Görev silinirken bir hata oluştu");
    }
  };

  const toggleStatusFilter = (status: TaskStatus) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const adminUser = isAdmin(user.user?.role);
  const teacherUser = isTeacher(user.user?.role);
  const canManageTasks = adminUser || teacherUser;

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{t('tasks.title')}</h1>
              <p className="text-muted-foreground mt-1">
                {filteredTasks.length} {filteredTasks.length === 1 ? t('tasks.task') : t('tasks.tasks')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Input */}
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t('common.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="default" className="gap-2">
                    <Filter className="h-4 w-4" />
                    {t('common.filter')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>{t('tasks.filterByStatus')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(["To Do", "In Progress", "In Review", "Accepted", "Rejected", "Done", "Overdue"] as TaskStatus[]).map((status) => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={statusFilter.includes(status)}
                      onCheckedChange={() => toggleStatusFilter(status)}
                    >
                      {getStatusTranslation(status)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Tasks Table */}
          <div className="rounded-lg border bg-card">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                {t('common.loading') || "Yükleniyor..."}
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-600">
                {error}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('tasks.taskName')}</TableHead>
                    <TableHead>{t('tasks.coinValue')}</TableHead>
                    <TableHead>{canManageTasks ? t('tasks.completedStudents') : t('tasks.status')}</TableHead>
                    {canManageTasks && <TableHead className="text-right">{t('tasks.actions')}</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={adminUser ? 4 : 3}
                        className="h-24 text-center text-muted-foreground"
                      >
                        {t('tasks.noTasksFound')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTasks.map((task) => (
                      <TableRow
                        key={task.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleTaskClick(task.id)}
                      >
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-600 font-semibold">{task.coins}</span>
                          <span className="text-muted-foreground">coin</span>
                        </div>
                      </TableCell>
                    <TableCell>
                      {canManageTasks ? (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-primary">
                            {task.completionCount || 0}
                          </span>
                          <span className="text-muted-foreground">
                            {task.completionCount === 1 ? t('tasks.student') : t('tasks.students')}
                          </span>
                        </div>
                      ) : (
                        <Badge
                          variant="secondary"
                          className={cn(
                            "rounded-full px-3 py-1",
                            getStatusColor(task.status)
                          )}
                        >
                          {getStatusTranslation(task.status)}
                        </Badge>
                      )}
                    </TableCell>
                      {canManageTasks && (
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => handleEditTask(task.id, e)}
                                className="gap-2"
                              >
                                <Pencil className="h-4 w-4" />
                                {t('tasks.editTask')}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => handleDeleteTask(task.id, e)}
                                className="gap-2 text-red-600 dark:text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                                {t('tasks.deleteTask')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}