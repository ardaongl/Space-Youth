import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { tasks } from "@/data/tasks";
import { StreakStars } from "@/components/tasks/StreakStars";

type Category = "All" | "UX" | "PM";

export default function Tasks() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");

  const filteredTasks = selectedCategory === "All"
    ? tasks
    : tasks.filter(task => task.category === selectedCategory);

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Briefs</h1>
              <p className="mt-1 text-muted-foreground">
                Complete real-world exercises, build your professional portfolio, and receive expert feedback.
              </p>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex flex-col gap-1">
                <StreakStars completedCount={2} />
                <span className="text-sm text-muted-foreground">Keep going! You're doing great!</span>
              </div>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600"
                onClick={() => navigate('/my-tasks')}
              >
                My Tasks
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            {(["All", "UX", "PM"] as const).map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={cn(
                  "rounded-full",
                  selectedCategory === category && "bg-primary text-primary-foreground"
                )}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} {...task} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}