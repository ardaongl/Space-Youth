import AppLayout from "@/components/layout/AppLayout";
import { ArrowRight, CheckCircle2, Clock, Bookmark, Star } from "lucide-react";
import { Link } from "react-router-dom";

function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:brightness-110">
      {children}
    </button>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border bg-card shadow-sm ${className}`}>{children}</div>
  );
}

export default function Home() {
  const Right = (
    <aside className="hidden lg:block sticky top-[4.5rem] h-max space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold">Getting started</h3>
        <ul className="mt-2 space-y-2 text-sm">
          <li>
            <button className="w-full justify-between rounded-xl border px-3 py-2 hover:bg-secondary inline-flex items-center">
              <span>Start your first course</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </li>
          <li>
            <button className="w-full justify-between rounded-xl border px-3 py-2 hover:bg-secondary inline-flex items-center">
              <span>Complete a lesson quiz</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </li>
          <li>
            <button className="w-full justify-between rounded-xl border px-3 py-2 hover:bg-secondary inline-flex items-center">
              <span>Take Uxcel Pulse test</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </li>
        </ul>
      </Card>

      <Card className="p-5">
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
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div className="font-semibold">0 day streak</div>
          <div className="h-6 w-6 rounded-md bg-secondary grid place-items-center">⚡</div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Earn 100 PX to start a new streak</p>
        <div className="mt-3 flex items-center justify-between">
          {"TFSsMTW".split("").map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1 text-[10px] text-muted-foreground">
              <div className={`h-6 w-6 rounded-full ${i===0 ? 'bg-foreground/10 border border-border' : 'bg-secondary'} grid place-items-center`}></div>
              <span className={`${i===0 ? 'font-semibold text-foreground' : ''}`}>{d}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Quartz league</div>
            <div className="text-sm text-muted-foreground">4 days left to join</div>
          </div>
          <div className="h-8 w-8 rounded-md bg-rose-200" />
        </div>
        <div className="mt-4 rounded-xl border bg-secondary p-6 text-sm text-center">Earn pixels to join this week's league</div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Skill graph</div>
            <div className="text-sm text-muted-foreground">Recommended for you</div>
          </div>
          <span className="text-[10px] rounded-md border bg-secondary px-1.5 py-0.5">PM</span>
        </div>
        <div className="mt-4 aspect-[4/3] rounded-xl bg-secondary"></div>
        <button className="mt-3 text-sm font-medium text-primary hover:underline">Get started</button>
      </Card>
    </aside>
  );

  const CourseCard = ({ popular }: { popular?: boolean }) => (
    <Card className="p-6">
      <div className="relative">
        {popular && (
          <span className="absolute left-2 top-2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 border border-amber-200">Popular</span>
        )}
        <div className="aspect-[5/3] w-full rounded-xl bg-accent grid place-items-center mb-4">
          <div className="h-20 w-20 rounded-lg bg-secondary" />
        </div>
      </div>
      <div className="text-[10px] font-semibold tracking-widest text-muted-foreground">COURSE</div>
      <div className="mt-1 text-lg font-semibold">Workshop Facilitation</div>
      <div className="mt-1 text-sm text-muted-foreground">Colin Michael Pace</div>
      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">Learn the essentials of planning and leading effective workshops. Build skills in facilitation and collaboration.</p>
      <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4 text-primary" /> 4h</span>
        <span className="inline-flex items-center gap-1">Advanced</span>
        <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 text-yellow-500" /> 4.6</span>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Link to="/courses/workshop-facilitation" className="rounded-full border px-3 py-1.5 text-sm">View course</Link>
        <button className="rounded-full border px-3 py-1.5 text-sm">Mark as read</button>
      </div>
    </Card>
  );

  return (
    <AppLayout right={Right}>
      <div className="py-6 space-y-8">
        <section>
          <h2 className="text-sm font-semibold tracking-tight text-muted-foreground">Continue learning</h2>
          <Card className="mt-3 p-4">
            <div className="grid grid-cols-[220px_1fr] gap-4 items-center">
              <div className="aspect-[4/3] rounded-xl border grid place-items-center bg-accent">
                <div className="h-16 w-16 rounded-full border-2 border-dashed grid place-items-center text-muted-foreground">●</div>
              </div>
              <div className="space-y-3">
                <div className="text-[10px] font-semibold tracking-widest text-muted-foreground">COURSE</div>
                <div className="font-semibold">You don't have any active courses</div>
                <p className="text-sm text-muted-foreground">Select a course and start improving your skills.</p>
                <PrimaryButton>Browse courses</PrimaryButton>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex -space-x-2">
                    <span className="h-5 w-5 rounded-full bg-secondary inline-block" />
                    <span className="h-5 w-5 rounded-full bg-secondary inline-block" />
                    <span className="h-5 w-5 rounded-full bg-secondary inline-block" />
                  </span>
                  6033 learning this week
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Bulletin board</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <button className="rounded-full border px-2 py-1 text-xs">⟳</button>
              <button className="rounded-full border px-2 py-1 text-xs">↗</button>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1,2,3].map((i) => (
              <Card key={i} className="p-4">
                <div className="text-[10px] font-semibold tracking-widest text-muted-foreground">NEW COURSE</div>
                <div className="mt-1 font-semibold">Human-Centered AI</div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">Learn AI design principles to create user-centric, trustworthy, and effective AI experiences.</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-primary" /> 3h</span>
                  <span className="inline-flex items-center gap-1">Advanced</span>
                  <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 text-yellow-500" /> 4.8</span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Link to="/courses/human-centered-ai" className="rounded-full border px-3 py-1.5 text-sm">View course</Link>
                  <button className="rounded-full border px-3 py-1.5 text-sm">Mark as read</button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recommended for you</h2>
            <button className="text-sm text-muted-foreground hover:underline">View all</button>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <CourseCard />
            <CourseCard popular />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Upcoming events</h2>
            <button className="text-sm text-muted-foreground hover:underline">View all</button>
          </div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            {["Lazar Pavlovic","Mentors Meetup"].map((title, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-primary/30 to-indigo-300" />
                <div className="p-4">
                  <div className="text-[10px] font-semibold tracking-widest text-muted-foreground">Free event</div>
                  <div className="mt-1 font-semibold">{title}</div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
