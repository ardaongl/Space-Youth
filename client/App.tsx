import "./global.css";

import AdminPage from "./pages/AdminPage"; 
import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Placeholder from "./pages/Placeholder";
import CourseDetail from "./pages/CourseDetail";
import ZoomCallback from "./pages/ZoomCallback";
import AddCourse from "./pages/AddCourse";
import AddLessons from "./pages/AddLessons";
import EditCourse from "./pages/EditCourse";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import TaskDetail from "./pages/TaskDetail";
import PostProject from "./pages/PostProject";
import Bookmarks from "./pages/Bookmarks";
import Tutorials from "./pages/Tutorials";
import Certifications from "./pages/Certifications";
import JobBoard from "./pages/JobBoard";
import { Profile } from "./pages/Profile";
import About from "./pages/About";
import { TokensProvider } from "./context/TokensContext";
import { DraftsProvider } from "./context/DraftsContext";
import { TaskSubmissionsProvider } from "./context/TaskSubmissionsContext";
import { AuthProvider } from "./context/AuthContext";
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


const App = () => {
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  useEffect(() => {
    const done = typeof window !== "undefined" && localStorage.getItem("onboarding.completed") === "true";
    setOnboardingOpen(!done);
  }, []);

  const handleComplete = (data: OnboardingData) => {
    try {
      localStorage.setItem("onboarding.data", JSON.stringify(data));
    } catch {}
    localStorage.setItem("onboarding.completed", "true");
    setOnboardingOpen(false);
    // Redirect to profile after completion
    try {
      window.location.assign("/profile");
    } catch {}
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
    <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
      <TokensProvider>
        <DraftsProvider>
          <TaskSubmissionsProvider>
          <TooltipProvider>
          <Toaster />
          <Sonner />
          {/* Router renders the app UI; TestWizard overlays above to gate access */}
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/callback" element={<Callback />} />
              <Route path="/zoom/callback" element={<ZoomCallback />} />
              <Route path="/dashboard" element={<Dashboard />} />
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
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} /> 
              <Route path="/admin" element={<AdminPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>

          <TestWizard
            open={onboardingOpen}
            onClose={() => { /* Gate: do nothing to enforce completion */ }}
            onComplete={handleComplete}
          />

          {import.meta.env.DEV && !onboardingOpen && (
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
        </TooltipProvider>
        </TaskSubmissionsProvider>
        </DraftsProvider>
      </TokensProvider>
      </AuthProvider>
    </QueryClientProvider>
    </Provider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
