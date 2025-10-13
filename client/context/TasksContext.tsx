import React, { createContext, useContext, useState, useEffect } from 'react';
import { tasks as initialTasks, Task, TaskStatus } from '@/data/tasks';

interface TasksContextType {
  tasks: Task[];
  updateTaskStatus: (taskId: number, status: TaskStatus) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Reset tasks to original state on every page load
  useEffect(() => {
    setTasks(initialTasks);
  }, []);

  const updateTaskStatus = (taskId: number, status: TaskStatus) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, status }
          : task
      )
    );
  };

  return (
    <TasksContext.Provider 
      value={{ 
        tasks, 
        updateTaskStatus
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}
