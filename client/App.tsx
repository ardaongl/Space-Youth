import "./global.css";

import AdminPage from "./pages/AdminPage"; 
import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
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
import { TokensProvider } from "./context/TokensContext";
import { DraftsProvider } from "./context/DraftsContext";
import { TaskSubmissionsProvider } from "./context/TaskSubmissionsContext";
import { TasksProvider } from "./context/TasksContext";
import { AuthProvider } from "./context/AuthContext";
import { BookmarksProvider } from "./context/BookmarksContext";
import MyTasks from "./pages/MyTasks";
import Leaderboard from "./pages/Leaderboard";
import Workshops from "./pages/Workshops";
import EventDetail from "./pages/EventDetail";
import AddEvent from "./pages/AddEvent";
import AddEventSessions from "./pages/AddEventSessions";
import EditEvent from "./pages/EditEvent";
import TestWizard, { OnboardingData } from "@/components/onboarding/TestWizard";
import { Provider } from "react-redux";
const queryClient = new QueryClient();
import { store } from "./store";
import Callback from "./pages/Callback";
import Dashboard from "./pages/Dashboard";
import RoleSwitcher from "./components/dev/RoleSwitcher";
import BuyCoins from "./pages/BuyCoins";
import { useAuth } from "./context/AuthContext";


const AppContent = () => {
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const { auth, refreshAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and onboarding status
    if (auth.user) {
      const done = typeof window !== "undefined" && localStorage.getItem("onboarding.completed") === "true";
      setOnboardingOpen(!done);
    } else {
      setOnboardingOpen(false);
    }
  }, [auth.user]);

  const handleComplete = (data: OnboardingData) => {
    try {
      localStorage.setItem("onboarding.data", JSON.stringify(data));
    } catch {}
    localStorage.setItem("onboarding.completed", "true");
    setOnboardingOpen(false);
    // Refresh auth state to update onboarding status
    refreshAuth();
    // Redirect to dashboard after completion
    navigate("/dashboard");
  };
  
  const resetOnboarding = () => {
    try {
      localStorage.removeItem("onboarding.completed");
      // Optionally keep data; comment next line if you want to preserve
      localStorage.removeItem("onboarding.data");
    } catch {}
    setOnboardingOpen(true);
  };

  return (
    <>
      <BrowserRouter>
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
      </BrowserRouter>

      {/* Only show onboarding for logged in users */}
      {auth.user && (
        <TestWizard
          open={onboardingOpen}
          onClose={() => { /* Gate: do nothing to enforce completion */ }}
          onComplete={handleComplete}
        />
      )}

      {import.meta.env.DEV && !onboardingOpen && auth.user && (
        <>
          <RoleSwitcher />
          <button
            onClick={resetOnboarding}
            className="fixed bottom-4 right-4 z-50 rounded-full bg-foreground text-background px-4 py-2 text-sm shadow hover:brightness-110"
            title="Geliştirme: Sorulara dön"
          >
            Sorulara dön
          </button>
        </>
      )}
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TokensProvider>
            <BookmarksProvider>
              <DraftsProvider>
                <TaskSubmissionsProvider>
                  <TasksProvider>
                    <TooltipProvider>
                      <Toaster />
                      <Sonner />
                      <AppContent />
                    </TooltipProvider>
                  </TasksProvider>
                </TaskSubmissionsProvider>
              </DraftsProvider>
            </BookmarksProvider>
          </TokensProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);