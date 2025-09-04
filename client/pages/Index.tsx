import AppLayout from "@/components/layout/AppLayout";
import { Link } from "react-router-dom";
import { Star, Clock, Award, Trophy, Bookmark } from "lucide-react";

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <button className="rounded-full border px-3 py-1 text-xs font-medium text-foreground/80 hover:bg-secondary">
      {children}
    </button>
  );
}

function CourseCard({
  to,
  title,
  author,
  level,
  rating,
  time,
  popular,
}: {
  to: string;
  title: string;
  author: string;
  level: string;
  rating: string;
  time: string;
  popular?: boolean;
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border bg-card shadow-sm hover:shadow-md transition overflow-hidden"
    >
      <div className="relative p-5 pb-0">
        {popular && (
          <span className="absolute left-5 top-5 z-10 rounded-full bg-amber-100 text-amber-800 text-[11px] font-semibold px-2 py-0.5 border border-amber-200">
            Popular
          </span>
        )}
        <button className="absolute right-5 top-5 z-10 p-1.5 rounded-full bg-background/80 border opacity-0 group-hover:opacity-100 transition">
          <Bookmark className="h-4 w-4" />
        </button>
        <div className="aspect-[5/4] w-full rounded-xl bg-accent grid place-items-center">
          <img src="/placeholder.svg" alt="course" className="h-24 opacity-70"/>
        </div>
      </div>
      <div className="p-5">
        <div className="text-[11px] font-semibold tracking-widest text-muted-foreground">COURSE</div>
        <div className="mt-1 text-lg font-semibold leading-snug group-hover:underline">{title}</div>
        <div className="mt-1 text-sm text-muted-foreground">{author}</div>
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
          Learn the essentials of planning and leading effective workshops. Build skills in facilitation, collaboration, and driving desired outcomes.
        </p>
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4 text-primary" /> {time}</span>
            <span className="inline-flex items-center gap-1"><Trophy className="h-4 w-4 text-primary" /> {level}</span>
          </div>
          <div className="inline-flex items-center gap-1"><Star className="h-4 w-4 text-yellow-500" /> {rating}</div>
        </div>
      </div>
    </Link>
  );
}

export default function Courses() {
  return (
    <AppLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold">Courses</h1>
        <p className="text-muted-foreground mt-1">Improve your skills through interactive, hands-on professional courses.</p>

        <div className="mt-4 flex items-center gap-2">
          <Chip>All</Chip>
          <Chip>UX</Chip>
          <Chip>PM</Chip>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button className="rounded-full border px-3 py-1.5 text-sm">For you</button>
          <button className="rounded-full border px-3 py-1.5 text-sm">Filters</button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <CourseCard
            to="/courses/workshop-facilitation"
            title="Workshop Facilitation"
            author="Colin Michael Pace"
            level="Advanced"
            rating="4.6 (4,061)"
            time="4h"
            popular
          />
          <CourseCard
            to="/courses/ux-design-foundations"
            title="UX Design Foundations"
            author="Gene Kamenez"
            level="Beginner"
            rating="4.8 (3,834)"
            time="6h"
          />
          <CourseCard
            to="/courses/introduction-to-customer-journey-mapping"
            title="Introduction to Customer Journey Mapping"
            author="Oliver West"
            level="Intermediate"
            rating="4.7 (2,102)"
            time="5h"
          />
        </div>
      </div>
    </AppLayout>
  );
}
