import AppLayout from "@/components/layout/AppLayout";
import { Link } from "react-router-dom";
import { MessageSquareText, Star, Eye, Heart } from "lucide-react";

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <button className="rounded-full border px-3 py-1 text-xs font-medium text-foreground/80 hover:bg-secondary">
      {children}
    </button>
  );
}

function TutorialCard({
  title,
  author,
  image,
}: {
  title: string;
  author: string;
  image?: string;
}) {
  return (
    <Link to="#" className="group rounded-2xl border bg-card shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="p-3 pb-0">
        <div className="aspect-[4/3] w-full rounded-xl bg-accent grid place-items-center overflow-hidden">
          <img src={image || "/placeholder.svg"} alt="tutorial" className="h-20 opacity-80" />
        </div>
      </div>
      <div className="p-4">
        <div className="text-[10px] font-semibold tracking-widest text-muted-foreground">TUTORIAL</div>
        <div className="mt-1 font-semibold leading-snug group-hover:underline line-clamp-2">{title}</div>
        <div className="mt-1 text-xs text-muted-foreground">{author}</div>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5"/> 2k</span>
          <span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5"/> 85</span>
          <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 text-yellow-500"/> 4.8</span>
        </div>
      </div>
    </Link>
  );
}

export default function Tutorials() {
  const tutorials = [
    {
      title: "ChatGPT for Product Managers: 10 Prompts That Will Save You…",
      author: "Alessya Dzanga",
    },
    { title: "How To Write User Stories That Actually Get Built", author: "Raghuvir Sethi" },
    { title: "Best Practices for Addressing Psychological Needs of Users", author: "Alessya Dzanga" },
  ];
  return (
    <AppLayout>
      <div className="py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Tutorials</h1>
            <p className="text-muted-foreground mt-1">Learn from industry experts with step-by-step, practical guides.</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button className="rounded-full border px-3 py-1.5 text-sm">Newest ▾</button>
            <button className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow">Post tutorial</button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Chip>All</Chip>
          <Chip>UX</Chip>
          <Chip>PM</Chip>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {tutorials.map((t, i) => (
            <TutorialCard key={i} title={t.title} author={t.author} />
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <TutorialCard key={`more-${i}`} title={`Tutorial ${i + 4}`} author="Author" />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
