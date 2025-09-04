import AppLayout from "@/components/layout/AppLayout";
import { Gamepad2, Sparkles } from "lucide-react";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border bg-card shadow-sm ${className}`}>{children}</div>;
}

function GameCard({ title, tag }: { title: string; tag: string }) {
  return (
    <Card className="overflow-hidden">
      <div className="h-40 bg-gradient-to-br from-primary/30 to-indigo-300 grid place-items-center">
        <Gamepad2 className="h-8 w-8 text-primary" />
      </div>
      <div className="p-4">
        <div className="text-[10px] font-semibold tracking-widest text-muted-foreground">ARCADE</div>
        <h3 className="mt-1 text-lg font-semibold">{title}</h3>
        <div className="mt-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs">
          <Sparkles className="h-3.5 w-3.5"/> {tag}
        </div>
      </div>
    </Card>
  );
}

export default function Arcade() {
  const games = [
    { title: "UI Speed Run", tag: "Timed" },
    { title: "Color Match", tag: "Free" },
    { title: "Layout Puzzle", tag: "New" },
    { title: "Icon Hunt", tag: "Free" },
  ];
  return (
    <AppLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold">Arcade</h1>
        <p className="text-muted-foreground mt-1">Practice with quick games and challenges.</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {games.map((g) => (
            <GameCard key={g.title} {...g} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
