import "./global.css";

import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider, useDispatch } from "react-redux";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Placeholder from "./pages/Placeholder";
import CourseDetail from "./pages/CourseDetail";
import ZoomCallback from "./pages/ZoomCallback";
import AddCourse from "./pages/AddCourse";
import AddLessons from "./pages/AddLessons";
import EditCourse from "./pages/EditCourse";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import TaskDetail from "./pages/TaskDetail";
import PostProject from "./pages/PostProject";
import Bookmarks from "./pages/Bookmarks";
import Tutorials from "./pages/Tutorials";
import Certifications from "./pages/Certifications";
import JobBoard from "./pages/JobBoard";
import { Profile } from "./pages/Profile";
import { InstructorProfile } from "./pages/InstructorProfile";
import About from "./pages/About";
import Settings from "./pages/Settings";
import MyTasks from "./pages/MyTasks";
import Leaderboard from "./pages/Leaderboard";
import Callback from "./pages/Callback";
import Dashboard from "./pages/Dashboard";
import AdminPage from "./pages/AdminPage";
import Teacher from "./pages/Teacher";

import { TokensProvider } from "./context/TokensContext";
import { DraftsProvider } from "./context/DraftsContext";
import { TaskSubmissionsProvider } from "./context/TaskSubmissionsContext";
import { TasksProvider } from "./context/TasksContext";
import { StudentProvider } from "./context/StudentContext";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import TestWizard, { OnboardingData } from "@/components/onboarding/TestWizard";
import PendingStatus from "@/components/status/PendingStatus";
import RejectedStatus from "@/components/status/RejectedStatus";
import { store, useAppSelector } from "./store";
import { apis } from "./services";
import { IUserRoles, STUDENT_STATUS } from "./types/user/user";
import { setUser } from "./store/slices/userSlice";
import { setStudent } from "./store/slices/studentSlice";
import { useToast } from "./hooks/use-toast";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { RoleProtectedRoute } from "./components/auth/RoleProtectedRoute";
import { mapStudentResponseToState } from "@/utils/student";
import { mapUserResponseToState } from "@/utils/user";

const queryClient = new QueryClient();


const AppContent = () => {
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAppSelector(state => state.user.user) 
  const { student, isLoading: isStudentLoading } = useAppSelector(state => state.student);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { t } = useLanguage();

  // Handle student status routing
  useEffect(() => {
    if (user && user.role === IUserRoles.STUDENT && student) {
      switch (student.status) {
        case STUDENT_STATUS.INCOMPLETE:
          setOnboardingOpen(true);
          break;
        case STUDENT_STATUS.PENDING:
        case STUDENT_STATUS.REJECTED:
          setOnboardingOpen(false);
          break;
        case STUDENT_STATUS.APPROVED:
          setOnboardingOpen(false);
          break;
        default:
          setOnboardingOpen(false);
      }
    } else {
      setOnboardingOpen(false);
    }
  }, [user, student]);

  const handleComplete = async (data: OnboardingData) => {
    setOnboardingOpen(false);
  
    // Phase sorularını buraya yazıyoruz (güncel olanları)
    const phase2Questions = [
      "1. Takım içinde çalışmayı mı yoksa tek başına çalışmayı mı tercih edersin?",
      "2. Bir projede problemle karşılaştığında nasıl çözüm üretirsin?",
      "3. 1'den 5'e kadar, zaman yönetimi konusunda kendini nasıl değerlendirirsin?",
      "4. 1'den 5'e kadar, yeni şeyler öğrenmeye açıklığını değerlendir."
    ];
  
    const phase3Questions = [
      "1. Bir köyde tüm elektrik kesildi ve insanlar karanlıkta kaldı. Elektrik şirketi üç gün sonra gelecek. Sadece bir bisiklet, bir masa lambası ve birkaç plastik şişeniz var. Köyü nasıl aydınlatırsınız?",
      "2. Bir fil acilen başka bir ülkeye gitmek zorunda ama tüm uçak biletleri satılmış. Onu başka nasıl taşırsınız?",
      "3. Okul kütüphanesinin kapısı yanlışlıkla içeriden kilitlendi ve içerideki öğrenciler sınava hazırlanıyor. Kapıyı kırmadan onları nasıl çıkarırsınız?",
      "4. Mars yerleşimine sadece 3 konteyner malzeme gönderebilirsiniz. Hangi 3 şeyi seçer ve neden?",
      "5. Bir parkta herkesin cep telefonu aniden çalışmıyor ve insanlar iletişim kuramıyor. Bir saat içinde birbirlerini bulmalarına nasıl yardım edersiniz?"
    ];
  
    const phase4Questions = [
      "1. Lütfen kendini birkaç cümleyle tanıt.",
      "2. En büyük başarın nedir?",
      "3. Zor bir durumla karşılaştığında nasıl tepki verirsin?",
      "4. Gelecekte hangi alanda uzmanlaşmak istiyorsun?",
      "5. Bizi neden seçtin?"
    ];
  
    const allQA = [
      ...phase2Questions.map((q, i) => `${q}\nCevap: ${data.phase2?.[`q${i + 1}`] || ""}`),
      ...phase3Questions.map((q, i) => `${q}\nCevap: ${data.phase3?.[`a${i + 1}`] || ""}`),
      ...phase4Questions.map((q, i) => `${q}\nCevap: ${data.phase4?.[i] || ""}`)
    ].join("\n\n"); // her soru-cevap arasında boş satır bırakıyoruz
  
    const payload = {
      school: data.phase1.school,
      department: data.phase1.department,
      cv_url: data.phase1.cvFileName || null,
      phases: {
        phase1: data.phase1,
        phase2: data.phase2,
        phase3: data.phase3,
        phase4: data.phase4,
        form_version: data.version,
      },
      questions_and_answers: allQA // ✅ ekledik
    };
    
    try {
      const response = await apis.student.set_student_answers(payload);
      if(response.status == 200){
        // Refresh user and student data to get updated status
        const userResponse: any = await apis.user.get_user();
        if (userResponse && userResponse.data) {
          // Update user
          const updatedUser = mapUserResponseToState(userResponse.data);
          if (updatedUser) {
            console.log(updatedUser);
            dispatch(setUser(updatedUser));
          }
          
          // Update student
          const mappedStudent = mapStudentResponseToState(userResponse.data);
          if (mappedStudent) {
            dispatch(setStudent(mappedStudent));
          }
        }
        
        toast({
          title: t('testWizard.submitSuccess'),
          description: t('testWizard.submitSuccessDesc'),
        });
      }else{
        toast({
          title: t('error.submitFailed'),
          description: t('error.submitFailedDesc'),
          variant: "destructive"
        })
      }

    } catch (error) {
      console.error("Failed to save onboarding data:", error);
      toast({
        title: t('error.submitFailed'),
        description: t('error.submitFailedDesc'),
        variant: "destructive"
      });
    }
  };
  
  
  const resetOnboarding = () => {
    setOnboardingOpen(true);
  };

  // Check if user is a non-approved student
  const shouldRestrictStudentAccess = user && 
    user.role === IUserRoles.STUDENT && 
    (isStudentLoading || !student || student.status !== STUDENT_STATUS.APPROVED);

  // If user is a non-approved student, show only status components
  if (shouldRestrictStudentAccess) {
    if (isStudentLoading || !student) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <span className="text-muted-foreground">Yükleniyor...</span>
        </div>
      );
    }

    return (
      <>
        {/* Show onboarding for incomplete applications */}
        {student.status === STUDENT_STATUS.INCOMPLETE && (
          <TestWizard
            open={onboardingOpen}
            onClose={() => { /* Gate: do nothing to enforce completion */ }}
            onComplete={handleComplete}
          />
        )}
        
        {/* Show pending status for pending applications */}
        {student.status === STUDENT_STATUS.PENDING && <PendingStatus />}
        
        {/* Show rejected status for rejected applications */}
        {student.status === STUDENT_STATUS.REJECTED && <RejectedStatus />}
      </>
    );
  }

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Explore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/zoom/callback" element={<ZoomCallback />} />
        
        {/* Public but content may be restricted */}
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/:taskId" element={<TaskDetail />} />
        <Route path="/courses" element={<Index />} />
        <Route path="/courses/:slug" element={<CourseDetail />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/practice" element={<Tutorials />} />
        <Route path="/tutorials" element={<Tutorials />} />
        <Route path="/instructor/:id" element={<InstructorProfile />} />
        
        {/* Protected Routes - Requires Authentication */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/:taskId/post"
          element={
            <ProtectedRoute>
              <PostProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-tasks"
          element={
            <ProtectedRoute>
              <MyTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/certifications"
          element={
            <ProtectedRoute>
              <Certifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/job-board"
          element={
            <ProtectedRoute>
              <JobBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute>
              <Bookmarks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        {/* Role Protected Routes - Teacher & Admin */}
        <Route
          path="/courses/add"
          element={
            <RoleProtectedRoute allowedRoles={["teacher", "admin"]}>
              <AddCourse />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/courses/add/lessons"
          element={
            <RoleProtectedRoute allowedRoles={["teacher", "admin"]}>
              <AddLessons />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/courses/:slug/edit"
          element={
            <RoleProtectedRoute allowedRoles={["teacher", "admin"]}>
              <EditCourse />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <RoleProtectedRoute allowedRoles={["teacher", "admin"]}>
              <Teacher />
            </RoleProtectedRoute>
          }
        />
        
        {/* Admin Only Routes */}
        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminPage />
            </RoleProtectedRoute>
          }
        />
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
            <StudentProvider>
              <TokensProvider>
                <DraftsProvider>
                  <TaskSubmissionsProvider>
                    <TasksProvider>
                      <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        <BrowserRouter>
                          <AppContent />
                        </BrowserRouter>
                      </TooltipProvider>
                    </TasksProvider>
                  </TaskSubmissionsProvider>
                </DraftsProvider>
              </TokensProvider>
            </StudentProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </Provider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);