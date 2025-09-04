import AppLayout from "@/components/layout/AppLayout";
import React from "react";
import { BadgeCheck, Clock, Gauge, Star, Coins } from "lucide-react";
import { useTokens } from "@/context/TokensContext";
import { toast } from "@/hooks/use-toast";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border bg-card shadow-sm ${className}`}>{children}</div>;
}

function AssessmentCard({
  title,
  difficulty,
  time,
  reward,
}: {
  title: string;
  difficulty: string;
  time: string;
  reward: number;
}) {
  const { addTokens } = useTokens();
  const [completed, setCompleted] = React.useState(false);

  const handleComplete = () => {
    if (completed) return;
    addTokens(reward);
    setCompleted(true);
    toast({
      title: "Assessment completed",
      description: `You earned ${reward} tokens`,
    });
  };

  return (
    <Card className="p-5">
      <div className="aspect-[5/3] w-full rounded-xl bg-accent grid place-items-center mb-4">
        <BadgeCheck className="h-8 w-8 text-primary" />
      </div>
      <div className="text-[10px] font-semibold tracking-widest text-muted-foreground">ASSESSMENT</div>
      <h3 className="mt-1 text-lg font-semibold">{title}</h3>
      <div className="mt-3 flex items-center gap-6 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4 text-primary"/> {time}</span>
        <span className="inline-flex items-center gap-1"><Gauge className="h-4 w-4 text-primary"/> {difficulty}</span>
        <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 text-yellow-500"/> 4.7</span>
      </div>
      <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-2.5 py-1 text-xs text-amber-700 dark:text-amber-300">
        <Coins className="h-3.5 w-3.5 text-amber-500" />
        Earn <span className="font-semibold tabular-nums">{reward}</span> tokens
      </div>
      <button
        onClick={handleComplete}
        disabled={completed}
        className="mt-4 rounded-full border px-3 py-1.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {completed ? "Completed ✓" : "Take assessment"}
      </button>
    </Card>
  );
}

export default function Assessments() {
  const items = [
    { title: "UX Fundamentals", difficulty: "Beginner", time: "25 min", reward: 20 },
    { title: "Wireframing", difficulty: "Intermediate", time: "30 min", reward: 25 },
    { title: "Accessibility", difficulty: "Advanced", time: "35 min", reward: 30 },
    { title: "Interaction Design", difficulty: "Intermediate", time: "30 min", reward: 25 },
    { title: "Design Systems", difficulty: "Advanced", time: "40 min", reward: 35 },
    { title: "Research Methods", difficulty: "Beginner", time: "20 min", reward: 15 },
  ];
  return (
    <AppLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold">Assessments</h1>
        <p className="text-muted-foreground mt-1">Measure your skills and earn tokens as you complete assessments.</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((it) => (
            <AssessmentCard key={it.title} {...it} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
