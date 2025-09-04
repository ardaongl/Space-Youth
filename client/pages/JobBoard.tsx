import AppLayout from "@/components/layout/AppLayout";
import { BriefcaseBusiness, MapPin, Search } from "lucide-react";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border bg-card shadow-sm ${className}`}>{children}</div>;
}

function JobCard({ company, title, meta, isNew }: { company: string; title: string; meta: string; isNew?: boolean }) {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-full bg-secondary grid place-items-center text-lg font-bold">{company[0]}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {isNew && <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 border border-emerald-200">New</span>}
            <span className="text-xs text-muted-foreground">{company}</span>
            <span className="ml-auto text-xs text-muted-foreground">5 days ago</span>
          </div>
          <div className="mt-1 font-semibold">{title}</div>
          <div className="mt-2 text-xs text-muted-foreground">{meta}</div>
        </div>
      </div>
    </Card>
  );
}

export default function JobBoard() {
  const jobs = [
    { company: "MusicGPT", title: "Product Manager - MusicGPT", meta: "Remote | Anywhere • Full-time • $24 - $52", isNew: true },
    { company: "Kyra", title: "Senior Product Designer", meta: "Remote | Anywhere • Full-time", isNew: true },
    { company: "Devoted Studios", title: "UI/UX Designer", meta: "Remote | Anywhere • Full-time", isNew: true },
  ];
  return (
    <AppLayout>
      <div className="py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Job Board</h1>
            <p className="text-muted-foreground mt-1">40 results</p>
          </div>
          <label className="relative w-72 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input className="w-full h-9 rounded-2xl border bg-secondary/50 pl-9 pr-3 text-sm outline-none" placeholder="Filter by keyword" />
          </label>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button className="rounded-full border px-3 py-1 text-xs font-medium">All jobs</button>
          <button className="rounded-full border px-3 py-1 text-xs font-medium">UX</button>
          <button className="rounded-full border px-3 py-1 text-xs font-medium">PM</button>
          <button className="rounded-full border px-3 py-1 text-xs font-medium">My job postings</button>
          <div className="ml-auto flex items-center gap-2">
            <button className="rounded-full border px-3 py-1.5 text-sm">Filters</button>
            <button className="rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">Post free job</button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {jobs.map((j) => (
            <JobCard key={j.title} {...j} />
          ))}
        </div>

        <Card className="mt-6 p-5 bg-gradient-to-r from-primary/10 to-indigo-200">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-background grid place-items-center border"><BriefcaseBusiness className="h-6 w-6"/></div>
            <div className="flex-1">
              <div className="font-semibold">Get your personalized job feed</div>
              <p className="text-sm text-muted-foreground">Stop wasting your time with jobs that don't fit your requirements. Add your career preferences and get a curated job feed tailored specifically to you.</p>
            </div>
            <button className="rounded-full border bg-background px-4 py-2 text-sm">Add Career Preferences</button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
