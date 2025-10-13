import React, { createContext, useContext, useState, useEffect } from 'react';

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface TaskSubmission {
  id: string;
  taskId: string;
  title: string;
  description: string;
  coverImage?: File | string;
  status: SubmissionStatus;
  submittedAt: Date;
}

interface TaskSubmissionsContextType {
  submissions: TaskSubmission[];
  addSubmission: (submission: Omit<TaskSubmission, 'id' | 'status' | 'submittedAt'>) => void;
  updateSubmissionStatus: (submissionId: string, status: SubmissionStatus) => void;
  getSubmissionsByTaskId: (taskId: string) => TaskSubmission[];
}

const TaskSubmissionsContext = createContext<TaskSubmissionsContextType | undefined>(undefined);

export function TaskSubmissionsProvider({ children }: { children: React.ReactNode }) {
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);

  // Reset submissions on every page load
  useEffect(() => {
    setSubmissions([]);
  }, []);

  const addSubmission = (submission: Omit<TaskSubmission, 'id' | 'status' | 'submittedAt'>) => {
    setSubmissions(prev => [...prev, {
      ...submission,
      id: crypto.randomUUID(),
      status: 'pending',
      submittedAt: new Date()
    }]);
  };

  const updateSubmissionStatus = (submissionId: string, status: SubmissionStatus) => {
    setSubmissions(prev => 
      prev.map(submission => 
        submission.id === submissionId 
          ? { ...submission, status }
          : submission
      )
    );
  };

  const getSubmissionsByTaskId = (taskId: string) => {
    return submissions.filter(submission => submission.taskId === taskId);
  };

  return (
    <TaskSubmissionsContext.Provider 
      value={{ 
        submissions, 
        addSubmission, 
        updateSubmissionStatus,
        getSubmissionsByTaskId
      }}
    >
      {children}
    </TaskSubmissionsContext.Provider>
  );
}

export function useTaskSubmissions() {
  const context = useContext(TaskSubmissionsContext);
  if (context === undefined) {
    throw new Error('useTaskSubmissions must be used within a TaskSubmissionsProvider');
  }
  return context;
}
