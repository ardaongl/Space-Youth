import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Clock, Trophy, Users, ArrowRight, Share2, Award, BookOpen } from "lucide-react";
import { tasks } from "@/data/tasks";
import { cn } from "@/lib/utils";
import { useDrafts } from "@/context/DraftsContext";
import { DraftCard } from "@/components/tasks/DraftCard";

export default function TaskDetail() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const { getDraftByTaskId } = useDrafts();
  const task = tasks.find(t => t.href.split('/').pop() === taskId);
  const draft = taskId ? getDraftByTaskId(taskId) : undefined;

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-8">
          {/* Left Content */}
          <div>
            {/* Header Section */}
            <div className="space-y-4 mb-8">
              <h1 className="text-4xl font-bold tracking-tight">{task.title}</h1>
              <p className="text-lg text-muted-foreground">{task.description}</p>
              
              {/* Task Meta Info */}
              <div className="flex flex-wrap gap-6 items-center pt-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <span>{task.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award className="h-5 w-5" />
                  <span>{task.level}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-5 w-5" />
                  <span>4500 PX</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground"
                  onClick={() => navigate(`/tasks/${taskId}/post`)}
                >
                  Pre-save
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">About this task</h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    This practical task helps you develop essential {task.category} skills through 
                    hands-on experience. You'll work on real-world scenarios and receive expert feedback 
                    to improve your portfolio.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">What you'll learn</h2>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-primary" />
                    </div>
                    <span>Professional {task.category} best practices and methodologies</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-primary" />
                    </div>
                    <span>Real-world problem-solving techniques</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-primary" />
                    </div>
                    <span>Portfolio-ready project development</span>
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Prerequisites</h2>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <span>Basic understanding of {task.category} principles</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <span>Familiarity with industry standard tools</span>
                  </li>
                </ul>
              </section>
            </div>
          </div>

          {/* Right Sidebar Card */}
          <div className="space-y-6">
            <div className="rounded-xl border bg-card">
              <div className="p-6 space-y-6">
                {/* Card Icon */}
                <div className="bg-muted/30 rounded-lg p-6 w-max mx-auto">
                  <div className="w-16 h-16">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                      <path
                        fill="currentColor"
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Card Content */}
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-xl">Post your project & receive feedback</h3>
                  <p className="text-muted-foreground text-sm">
                    Share your work for expert feedback & community insights. Iterate on the feedback,
                    and improve your craft.
                  </p>
                </div>

                {/* Card Button */}
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => navigate(`/tasks/${taskId}/post`)}
                >
                  Post project
                </Button>

                {/* Points Info */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Trophy className="h-4 w-4" />
                  <span>Earn 750 PX</span>
                </div>
              </div>
            </div>
            {draft && <DraftCard draft={draft} />}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}