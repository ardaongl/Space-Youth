import React, { createContext, useContext, useEffect, ReactNode, useState } from "react";
import { apis } from "@/services";
import { useAuth } from "./AuthContext";

export interface StudentData {
  id: number;
  user_id: number;
  approved: boolean;
  questions_and_answers?: string;
  created_at?: string;
  updated_at?: string;
}

interface StudentContextType {
  studentData: StudentData | null;
  isLoading: boolean;
  error: string | null;
  refetchStudent: () => Promise<void>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
};

interface StudentProviderProps {
  children: ReactNode;
}

export const StudentProvider: React.FC<StudentProviderProps> = ({ children }) => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { auth } = useAuth();

  const fetchStudentData = async () => {
    // Only fetch student data if user is a student
    if (auth.user?.role !== "student") {
      setStudentData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apis.student.get_student();
      if (response && response.data) {
        setStudentData(response.data);
      } else {
        setStudentData(null);
      }
    } catch (err) {
      console.error("Failed to fetch student data:", err);
      setError("Öğrenci verileri alınırken hata oluştu");
      setStudentData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (auth.user?.role === "student") {
      fetchStudentData();
    } else {
      setStudentData(null);
    }
  }, [auth.user]);

  return (
    <StudentContext.Provider value={{ 
      studentData, 
      isLoading, 
      error, 
      refetchStudent: fetchStudentData 
    }}>
      {children}
    </StudentContext.Provider>
  );
};
