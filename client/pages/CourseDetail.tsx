import AppLayout from "@/components/layout/AppLayout";
import { CheckCircle2, Clock, Star, ShieldCheck, Award, Users, Trophy, BookOpen, Globe, Phone, Gamepad2, ListChecks, CalendarClock } from "lucide-react";
import { useParams } from "react-router-dom";

function Stat({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mr-4">
      <Icon className="h-4 w-4 text-primary" />
      <span>{children}</span>
    </div>
  );
}

export default function CourseDetail() {
  const { slug } = useParams();
  return (
    <AppLayout
      right={
        <aside className="hidden lg:block sticky top-[4.5rem] h-max">
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="aspect-[4/3] w-full rounded-xl bg-accent grid place-items-center mb-4">
              <img src="/placeholder.svg" alt="certificate" className="h-24 opacity-90" />
            </div>
            <h3 className="text-lg font-semibold">Earn your course certificate</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Complete the course to earn your certificate of completion and showcase your expertise.
            </p>
            <button className="mt-4 w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition hover:brightness-110">
              Start course for free
            </button>
          </div>
          <div className="mt-4 rounded-2xl border bg-card p-5 shadow-sm">
            <div className="flex gap-1 mb-3">
              <button className="px-3 py-1 rounded-full text-sm font-medium bg-primary text-primary-foreground">Individual</button>
              <button className="px-3 py-1 rounded-full text-sm font-medium bg-secondary text-foreground">Team</button>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary"/> 100+ courses, projects & assessments</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary"/> Professional certificates</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary"/> Mentor-led project reviews</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary"/> Full access on mobile</li>
            </ul>
            <button className="mt-4 w-full rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background shadow transition hover:brightness-110">
              Get full access with Pro
            </button>
          </div>
        </aside>
      }
    >
      <div className="py-6">
        <div className="text-sm text-muted-foreground">Courses ▸</div>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight">{slug ? slug.replace(/-/g, " ") : "Workshop Facilitation"}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Stat icon={Clock}>4 hours</Stat>
          <Stat icon={Trophy}>Advanced</Stat>
          <Stat icon={Star}>4.6 (4,061)</Stat>
          <Stat icon={Users}>50,913 learners</Stat>
          <Stat icon={Award}>5250 XP</Stat>
        </div>
        <div className="mt-4 flex gap-3">
          <button className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow hover:brightness-110">
            Start course for free
          </button>
          <button className="rounded-full border px-5 py-2 text-sm font-semibold">Save</button>
          <button className="rounded-full border px-5 py-2 text-sm font-semibold">Share</button>
        </div>

        <section className="mt-8 grid gap-8 lg:max-w-3xl">
          <div>
            <h2 className="text-xl font-semibold">About this course</h2>
            <p className="mt-2 text-muted-foreground leading-7">
              Workshops are powerful tools for tackling complex problems and driving innovative solutions. This course equips you with the skills to effectively facilitate workshops that inspire collaboration, enhance teamwork, and generate breakthrough ideas.
            </p>
            <p className="mt-2 text-muted-foreground leading-7">
              Throughout the course, you'll explore common challenges teams face and learn how to overcome them.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><BookOpen className="h-4 w-4 text-primary"/> By Colin Michael Pace</div>
              <div className="flex items-center gap-2 text-muted-foreground"><ShieldCheck className="h-4 w-4 text-primary"/> Certificate of completion</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Trophy className="h-4 w-4 text-primary"/> Advanced level</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Globe className="h-4 w-4 text-primary"/> English language</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4 text-primary"/> About 4 hours to complete</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4 text-primary"/> Learn on iOS or Android</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Gamepad2 className="h-4 w-4 text-primary"/> Gamified and interactive</div>
              <div className="flex items-center gap-2 text-muted-foreground"><ListChecks className="h-4 w-4 text-primary"/> 15 lessons, 3 quizzes</div>
              <div className="flex items-center gap-2 text-muted-foreground"><CalendarClock className="h-4 w-4 text-primary"/> Last updated Sep 4, 2025</div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Skills you'll gain with course:</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary" />
                <p className="leading-7"><span className="font-semibold">Plan and execute successful design workshops</span> — Understand when to call for a design workshop, how to set goals, and plan the correct processes and activities to produce the right deliverables.</p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary" />
                <p className="leading-7"><span className="font-semibold">Discover helpful brainstorming and decision-making workshop activities</span> — Familiarize yourself with tried-and-tested individual and group activities to stimulate creative idea generation and ways to build consensus on design decisions.</p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary" />
                <p className="leading-7"><span className="font-semibold">Understand how to run remote design workshops and build great presentations</span> — Learn about all the virtual tools and techniques you'll need to run a successful remote workshop and how to keep your audience engaged with your presentations.</p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary" />
                <p className="leading-7"><span className="font-semibold">Master people management during workshops</span> — Learn management techniques that will help you encourage workshop participants and handle conflicts with ease.</p>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
