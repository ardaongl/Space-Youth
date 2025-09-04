import "./global.css";

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
import Home from "./pages/Home";
import Leagues from "./pages/Leagues";
import Bookmarks from "./pages/Bookmarks";
import Briefs from "./pages/Briefs";
import Assessments from "./pages/Assessments";
import Arcade from "./pages/Arcade";
import Showcase from "./pages/Showcase";
import Tutorials from "./pages/Tutorials";
import Certifications from "./pages/Certifications";
import JobBoard from "./pages/JobBoard";
import { TokensProvider } from "./context/TokensContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TokensProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/leagues" element={<Leagues />} />
            <Route path="/courses" element={<Index />} />
            <Route path="/courses/:slug" element={<CourseDetail />} />
            <Route path="/briefs" element={<Briefs />} />
            <Route path="/practice" element={<Tutorials />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/arcade" element={<Arcade />} />
            <Route path="/showcase" element={<Showcase />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/job-board" element={<JobBoard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </TokensProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
