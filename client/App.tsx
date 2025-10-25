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
import Workshops from "./pages/Workshops";
import EventDetail from "./pages/EventDetail";
import AddEvent from "./pages/AddEvent";
import AddEventSessions from "./pages/AddEventSessions";
import EditEvent from "./pages/EditEvent";
import Callback from "./pages/Callback";
import Dashboard from "./pages/Dashboard";
import AdminPage from "./pages/AdminPage";
import BuyCoins from "./pages/BuyCoins";

import { TokensProvider } from "./context/TokensContext";
import { DraftsProvider } from "./context/DraftsContext";
import { TaskSubmissionsProvider } from "./context/TaskSubmissionsContext";
import { TasksProvider } from "./context/TasksContext";
import { StudentProvider, useStudent } from "./context/StudentContext";
import { BookmarksProvider } from "./context/BookmarksContext";
import { LanguageProvider } from "./context/LanguageContext";
import TestWizard, { OnboardingData } from "@/components/onboarding/TestWizard";
import RoleSwitcher from "./components/dev/RoleSwitcher";
import { store, useAppSelector } from "./store";
import { apis } from "./services";
import { IUserRoles } from "./types/user/user";
import { clearUser } from "./store/slices/userSlice";

const queryClient = new QueryClient();


const AppContent = () => {
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAppSelector(state => state.user.user) 
  const student = useAppSelector(state => state.student.student);
  const dispatch = useDispatch();


  useEffect(() => {
    if (user) {
      if (user.role === IUserRoles.STUDENT) {
        const shouldShowOnboarding = student && !student.approved;        
        setOnboardingOpen(shouldShowOnboarding);
      } else {
        setOnboardingOpen(false);
      }
    } else {
      dispatch(clearUser())
      navigate("/login");
    }
  }, [user, student]);

  const handleComplete = async (data: OnboardingData) => {
    setOnboardingOpen(false);
    try {
      await apis.student.set_student_answers(JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save onboarding data:", error);
    }
    navigate("/");
  };
  
  const resetOnboarding = () => {
    setOnboardingOpen(true);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/zoom/callback" element={<ZoomCallback />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/:taskId" element={<TaskDetail />} />
        <Route path="/tasks/:taskId/post" element={<PostProject />} />
        <Route path="/my-tasks" element={<MyTasks />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/workshops" element={<Workshops />} />
        <Route path="/events/add" element={<AddEvent />} />
        <Route path="/events/add/sessions" element={<AddEventSessions />} />
        <Route path="/events/:slug/edit" element={<EditEvent />} />
        <Route path="/events/:slug" element={<EventDetail />} />
        <Route path="/courses" element={<Index />} />
        <Route path="/courses/add" element={<AddCourse />} />
        <Route path="/courses/add/lessons" element={<AddLessons />} />
        <Route path="/courses/:slug/edit" element={<EditCourse />} />
        <Route path="/courses/:slug" element={<CourseDetail />} />
        <Route path="/practice" element={<Tutorials />} />
        <Route path="/tutorials" element={<Tutorials />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/job-board" element={<JobBoard />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/instructor/:id" element={<InstructorProfile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} /> 
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/buy-coins" element={<BuyCoins />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Only show onboarding for logged in users */}
      {user && (
        <TestWizard
          open={onboardingOpen}
          onClose={() => { /* Gate: do nothing to enforce completion */ }}
          onComplete={handleComplete}
        />
      )}
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
                <BookmarksProvider>
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
                </BookmarksProvider>
              </TokensProvider>
            </StudentProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </Provider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);