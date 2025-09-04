import AppLayout from "@/components/layout/AppLayout";
import { Clock, Star, Trophy, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border bg-card shadow-sm ${className}`}>{children}</div>;
}

function SavedCourse() {
  return (
    <Card className="p-6">
      <button className="absolute right-4 top-4 p-1.5 rounded-full bg-background/80 border"><Bookmark className="h-4 w-4"/></button>
      <div className="aspect-[5/3] w-full rounded-xl bg-accent grid place-items-center mb-4"/>
      <div className="text-[10px] font-semibold tracking-widest text-muted-foreground">COURSE</div>
      <div className="mt-1 text-lg font-semibold">Workshop Facilitation</div>
      <div className="mt-1 text-sm text-muted-foreground">Colin Michael Pace</div>
      <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4 text-primary" /> 4h</span>
        <span className="inline-flex items-center gap-1"><Trophy className="h-4 w-4 text-primary" /> Advanced</span>
        <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 text-yellow-500" /> 4.6</span>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Link to="/courses/workshop-facilitation" className="rounded-full border px-3 py-1.5 text-sm">Open</Link>
        <button className="rounded-full border px-3 py-1.5 text-sm">Remove</button>
      </div>
    </Card>
  );
}

export default function Bookmarks() {
  return (
    <AppLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold">Bookmarks</h1>
        <p className="text-muted-foreground mt-1">Your saved courses.</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map((i)=> (
            <SavedCourse key={i} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
