import React, { createContext, useContext, useEffect, ReactNode, useState } from "react";
import { apis } from "@/services";
import { useAppDispatch, useAppSelector } from "@/store";
import { setStudent, setLoading, clearStudent } from "@/store/slices/studentSlice";
import { mapStudentResponseToState } from "@/utils/student";

export interface StudentData {
  id: number;
  user_id: number;
  approved: boolean;
  status?: string;
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
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  const fetchStudentData = async () => {
    // Only fetch student data if user is a student
    if (user.user?.role !== "student") {
      setStudentData(null);
      dispatch(clearStudent());
      return;
    }

    setIsLoading(true);
    setError(null);
    dispatch(setLoading(true));

    try {
      const response = await apis.student.get_student();
      if (response && response.data) {
        setStudentData(response.data);
        const mapped = mapStudentResponseToState(response.data);
        if (mapped) {
          dispatch(setStudent(mapped));
        } else {
          dispatch(clearStudent());
        }
      } else {
        setStudentData(null);
        dispatch(clearStudent());
      }
    } catch (err) {
      console.error("Failed to fetch student data:", err);
      setError("Öğrenci verileri alınırken hata oluştu");
      setStudentData(null);
      dispatch(clearStudent());
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user.user?.role === "student") {
      fetchStudentData();
    } else {
      setStudentData(null);
    }
  }, [user.user]);

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
