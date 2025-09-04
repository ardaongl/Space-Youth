import AppLayout from "@/components/layout/AppLayout";
import { ClipboardList, Clock, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border bg-card shadow-sm ${className}`}>{children}</div>;
}

function BriefCard({ title, level, time }: { title: string; level: string; time: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-[10px] font-semibold tracking-widest text-muted-foreground">
        <ClipboardList className="h-3.5 w-3.5" /> BRIEF
      </div>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">Design a solution to a realistic product challenge. Submit your work to get feedback.</p>
      <div className="mt-4 flex items-center gap-5 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4 text-primary"/> {time}</span>
        <span className="inline-flex items-center gap-1"><Trophy className="h-4 w-4 text-primary"/> {level}</span>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Link to="/showcase" className="rounded-full border px-3 py-1.5 text-sm">Start brief</Link>
        <button className="rounded-full border px-3 py-1.5 text-sm">Save</button>
      </div>
    </Card>
  );
}

export default function Briefs() {
  const briefs = [
    { title: "Redesign a Travel App", level: "Intermediate", time: "3–5h" },
    { title: "Onboarding Flow Improvements", level: "Beginner", time: "2–3h" },
    { title: "Checkout Optimization", level: "Advanced", time: "4–6h" },
    { title: "Dashboard Analytics", level: "Intermediate", time: "3–4h" },
    { title: "Notifications Center", level: "Beginner", time: "2h" },
    { title: "Subscription Paywall", level: "Advanced", time: "5h" },
  ];
  return (
    <AppLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold">Briefs</h1>
        <p className="text-muted-foreground mt-1">Hands-on design assignments to practice real-world problems.</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {briefs.map((b) => (
            <BriefCard key={b.title} {...b} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
