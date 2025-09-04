import AppLayout from "@/components/layout/AppLayout";
import { Trophy, Users, Medal, ArrowUpRight } from "lucide-react";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border bg-card shadow-sm ${className}`}>{children}</div>;
}

export default function Leagues() {
  return (
    <AppLayout>
      <div className="py-6 space-y-8">
        <header>
          <h1 className="text-2xl font-bold">Leagues</h1>
          <p className="text-muted-foreground mt-1">Compete weekly and climb through Quartz → Diamond by earning XP.</p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">This week</div>
                <h2 className="text-xl font-semibold">Quartz league</h2>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/20 grid place-items-center">
                <Medal className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-6 rounded-xl border bg-secondary p-6 text-sm">
              Earn pixels to join this week's league. Complete lessons and quizzes to gain XP and move up.
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold">Weekly rewards</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center gap-2"><Trophy className="h-4 w-4 text-primary"/> 1st place — 500 XP</li>
              <li className="flex items-center gap-2"><Trophy className="h-4 w-4 text-primary"/> 2nd place — 300 XP</li>
              <li className="flex items-center gap-2"><Trophy className="h-4 w-4 text-primary"/> 3rd place — 150 XP</li>
            </ul>
          </Card>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Leaderboard</h2>
            <button className="text-sm text-muted-foreground hover:underline inline-flex items-center gap-1">View all <ArrowUpRight className="h-4 w-4"/></button>
          </div>
          <Card className="mt-3 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60">
                <tr>
                  <th className="text-left px-4 py-2">Rank</th>
                  <th className="text-left px-4 py-2">User</th>
                  <th className="text-left px-4 py-2">XP</th>
                </tr>
              </thead>
              <tbody>
                {[1,2,3,4,5].map((i)=> (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2">{i}</td>
                    <td className="px-4 py-2 inline-flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-secondary inline-block"/> Player {i}</td>
                    <td className="px-4 py-2">{(6-i)*250} XP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>

        <section>
          <h2 className="font-semibold">Past leagues</h2>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Quartz","Topaz","Sapphire"].map((n)=> (
              <Card key={n} className="p-4">
                <div className="text-sm text-muted-foreground">Completed</div>
                <div className="mt-1 font-semibold">{n} league</div>
                <div className="mt-3 inline-flex items-center gap-2 text-sm"><Users className="h-4 w-4"/> 120 participants</div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
