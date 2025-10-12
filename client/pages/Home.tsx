import AppLayout from "@/components/layout/AppLayout";
import { ArrowRight, CheckCircle2, Clock, Bookmark, Star, Bell, Briefcase, GraduationCap, Target, Users, Flame, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { EventCalendar } from "@/components/ui/event-calendar";
import FeatureSlider from "@/components/ui/FeatureSlider";

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
  // Sample events data - replace with actual data from your backend
  const sampleEvents = [
    { id: '1', date: new Date(2025, 9, 8), title: 'AI Workshop', color: 'bg-blue-500' },
    { id: '2', date: new Date(2025, 9, 8), title: 'Team Meeting', color: 'bg-green-500' },
    { id: '3', date: new Date(2025, 9, 10), title: 'Design Sprint', color: 'bg-purple-500' },
    { id: '4', date: new Date(2025, 9, 15), title: 'Code Review', color: 'bg-amber-500' },
    { id: '5', date: new Date(2025, 9, 20), title: 'Project Demo', color: 'bg-rose-500' },
  ];

  const Right = (
    <aside className="hidden lg:block sticky top-[4.5rem] h-max space-y-4">
      {/* Takvim */}
      <Card className="p-0 overflow-hidden">
        <EventCalendar 
          events={sampleEvents}
          onDateSelect={(date) => console.log('Selected date:', date)}
        />
      </Card>

      {/* Streak */}
      <Card className="p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold text-white text-lg">Streak</div>
            <Flame className="h-6 w-6 text-purple-200" />
          </div>
          <div className="flex items-center justify-between gap-2">
            {[
              { day: 1, coins: 10, completed: true },
              { day: 2, coins: 20, completed: true },
              { day: 3, coins: 30, completed: false },
              { day: 4, coins: 40, completed: false },
              { day: 5, coins: 50, completed: false },
              { day: 6, coins: 60, completed: false },
              { day: 7, coins: 70, completed: false }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div className="text-[10px] text-gray-400 font-medium">Gün {item.day}</div>
                <div className="relative">
                  <Flame 
                    className={`h-10 w-10 ${
                      item.completed 
                        ? 'text-purple-200 fill-purple-200' 
                        : 'text-gray-500 fill-gray-700'
                    }`} 
                  />
                </div>
                <div className={`text-[11px] font-semibold ${
                  item.completed ? 'text-white' : 'text-gray-400'
                }`}>
                  {item.coins}
                </div>
              </div>
            ))}
          </div>
        </div>
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
      <div className="py-6 space-y-12">
        {/* Feature Slider Section */}
        <section>
          <FeatureSlider />
        </section>

        {/* Önerilen Görevler */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Önerilen Görevler</h2>
            </div>
            <Link to="/tasks" className="text-base text-muted-foreground hover:underline">Tümünü Gör</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { title: "Kullanıcı Araştırması Yapma", coins: 120, level: "Orta", time: "2h" },
              { title: "Wireframe Oluşturma", coins: 100, level: "Başlangıç", time: "1.5h" },
            ].map((task, i) => (
              <Card key={i} className="p-12 hover:shadow-lg transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base">{task.title}</h3>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" /> {task.time}
                      </span>
                      <span>{task.level}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-semibold text-yellow-600">{task.coins} coins</div>
                  </div>
                </div>
                <Link to="/tasks" className="mt-4 inline-block text-base text-primary hover:underline font-medium">
                  Görevi Gör →
                </Link>
              </Card>
            ))}
          </div>
        </section>

        {/* Önerilen Kurslar */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Önerilen Kurslar</h2>
            </div>
            <Link to="/courses" className="text-sm text-muted-foreground hover:underline">Tümünü Gör</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CourseCard />
            <CourseCard popular />
          </div>
        </section>

        {/* Önerilen Eğitimler (Tutorials) */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Önerilen Eğitimler</h2>
            </div>
            <Link to="/tutorials" className="text-base text-muted-foreground hover:underline">Tümünü Gör</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "React Hooks Kullanımı", duration: "30 dk", difficulty: "Orta" },
              { title: "CSS Grid Layout", duration: "45 dk", difficulty: "Başlangıç" },
              { title: "TypeScript Temelleri", duration: "1 saat", difficulty: "Orta" },
            ].map((tutorial, i) => (
              <Card key={i} className="p-6 hover:shadow-lg transition">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-200 rounded-lg mb-4 flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-white/80 flex items-center justify-center">
                    <Bookmark className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-base">{tutorial.title}</h3>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> {tutorial.duration}
                  </span>
                  <span>{tutorial.difficulty}</span>
                </div>
                <Link to="/tutorials" className="mt-4 inline-block text-base text-primary hover:underline font-medium">
                  Başla →
                </Link>
              </Card>
            ))}
          </div>
        </section>

        {/* Önerilen Workshop'lar */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Önerilen Workshop'lar</h2>
            </div>
            <Link to="/workshops" className="text-base text-muted-foreground hover:underline">Tümünü Gör</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Design Thinking Workshop", date: "15 Ekim 2025", time: "14:00" },
              { title: "Agile Metodolojiler", date: "20 Ekim 2025", time: "16:00" },
            ].map((workshop, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition">
                <div className="h-48 bg-gradient-to-br from-primary/30 to-indigo-300" />
                <div className="p-6">
                  <h3 className="font-semibold text-base">{workshop.title}</h3>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span>{workshop.date}</span>
                    <span>•</span>
                    <span>{workshop.time}</span>
                  </div>
                  <Link to="/workshops" className="mt-4 inline-block text-base text-primary hover:underline font-medium">
                    Detayları Gör →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}