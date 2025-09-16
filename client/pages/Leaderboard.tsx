import AppLayout from "@/components/layout/AppLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Star } from "lucide-react";

const leaderboardData = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "",
    points: 12500,
    completedTasks: 25,
    rank: 1,
  },
  {
    id: 2,
    name: "Sarah Miller",
    avatar: "",
    points: 11200,
    completedTasks: 22,
    rank: 2,
  },
  {
    id: 3,
    name: "David Chen",
    avatar: "",
    points: 10800,
    completedTasks: 20,
    rank: 3,
  },
  // Add more users here
];

const rankStyles: Record<number, string> = {
  1: "bg-yellow-500/10 text-yellow-500",
  2: "bg-gray-300/10 text-gray-400",
  3: "bg-amber-600/10 text-amber-600",
};

export default function Leaderboard() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Leaderboard</h1>
            <p className="mt-1 text-muted-foreground">
              Top performers in the community
            </p>
          </div>

          {/* Top 3 Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leaderboardData.slice(0, 3).map((user) => (
              <div
                key={user.id}
                className="rounded-xl border bg-card p-6 text-center space-y-4"
              >
                <div className="relative inline-block">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-sm font-medium ${rankStyles[user.rank as keyof typeof rankStyles] || "bg-muted"}`}>
                    #{user.rank}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.points.toLocaleString()} PX</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Trophy className="h-4 w-4" />
                  <span>{user.completedTasks} tasks completed</span>
                </div>
              </div>
            ))}
          </div>

          {/* Full Leaderboard */}
          <div className="rounded-xl border bg-card">
            <div className="p-6 space-y-4">
              {leaderboardData.slice(3).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground font-medium min-w-[2rem]">
                      #{user.rank}
                    </span>
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {user.completedTasks} tasks completed
                      </p>
                    </div>
                  </div>
                  <div className="font-medium">{user.points.toLocaleString()} PX</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
