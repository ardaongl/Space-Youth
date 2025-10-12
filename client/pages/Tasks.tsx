import { useState } from "react";
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
import { Search, Filter, Plus, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { tasks, TaskStatus } from "@/data/tasks";
import { useAuth } from "@/context/AuthContext";
import { isAdmin } from "@/utils/roles";
import { cn } from "@/lib/utils";

export default function Tasks() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus[]>([]);

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
      case "To Do":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "Overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleTaskClick = (taskHref: string) => {
    const taskId = taskHref.split('/').pop();
    navigate(`/tasks/${taskId}`);
  };

  const handleEditTask = (taskId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Edit task:", taskId);
    // TODO: Implement edit functionality
  };

  const handleDeleteTask = (taskId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Delete task:", taskId);
    // TODO: Implement delete functionality
  };

  const toggleStatusFilter = (status: TaskStatus) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const adminUser = isAdmin(auth.user?.role);

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Tüm Görevler</h1>
              <p className="text-muted-foreground mt-1">
                {filteredTasks.length} {filteredTasks.length === 1 ? "görev" : "görev"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Input */}
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Görevlerde Ara"
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
                    Filtrele
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Duruma Göre Filtrele</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(["To Do", "In Progress", "Done", "Overdue"] as TaskStatus[]).map((status) => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={statusFilter.includes(status)}
                      onCheckedChange={() => toggleStatusFilter(status)}
                    >
                      {status}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Admin: Add New Task Button */}
              {adminUser && (
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Yeni görev ekle
                </Button>
              )}
            </div>
          </div>

          {/* Tasks Table */}
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Görev Adı</TableHead>
                  <TableHead>Coin Değeri</TableHead>
                  <TableHead>Durum</TableHead>
                  {adminUser && <TableHead className="text-right">İşlemler</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={adminUser ? 4 : 3}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Görev bulunamadı
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map((task) => (
                    <TableRow
                      key={task.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleTaskClick(task.href)}
                    >
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-600 font-semibold">{task.coins}</span>
                          <span className="text-muted-foreground">coin</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "rounded-full px-3 py-1",
                            getStatusColor(task.status)
                          )}
                        >
                          {task.status}
                        </Badge>
                      </TableCell>
                      {adminUser && (
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
                                Düzenle
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => handleDeleteTask(task.id, e)}
                                className="gap-2 text-red-600 dark:text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                                Sil
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
          </div>
        </div>
      </div>
    </AppLayout>
  );
}