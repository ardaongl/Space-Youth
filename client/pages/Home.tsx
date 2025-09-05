import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import AppLayout from "@/components/layout/AppLayout";

export default function Home() {
  return (
    <AppLayout>
      <div className="py-6 space-y-8">
        <section>
          <h2 className="text-sm font-semibold tracking-tight text-muted-foreground">Continue learning</h2>
          <div className="mt-3 p-4 rounded-2xl border bg-card shadow-sm">
            <div className="grid grid-cols-[220px_1fr] gap-4 items-center">
              <div className="aspect-[4/3] rounded-xl border grid place-items-center bg-accent">
                <div className="h-16 w-16 rounded-full border-2 border-dashed grid place-items-center text-muted-foreground">●</div>
              </div>
              <div className="space-y-3">
                <div className="text-[10px] font-semibold tracking-widest text-muted-foreground">COURSE</div>
                <div className="font-semibold">You don't have any active courses</div>
                <p className="text-sm text-muted-foreground">Select a course and start improving your skills.</p>
                <button className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:brightness-110">
                  Browse courses
                </button>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-semibold">Welcome to SpaceYouth</h2>
          <p className="text-muted-foreground mt-2">Your learning journey starts here!</p>
        </section>
      </div>
    </AppLayout>
  );
}
