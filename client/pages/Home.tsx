import AppLayout from "@/components/layout/AppLayout";
import { ArrowRight, CheckCircle2, Clock, Bookmark, Bell, Briefcase, GraduationCap, Target, Users, Flame, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { EventCalendar } from "@/components/ui/event-calendar";
import FeatureSlider from "@/components/ui/FeatureSlider";
import { useLanguage } from "@/context/LanguageContext";

function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:brightness-110">
      {children}
    </button>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border bg-card shadow-sm w-full ${className}`}>{children}</div>
  );
}

export default function Home() {
  const { t } = useLanguage();
  
  // Sample events data - replace with actual data from your backend
  const sampleEvents = [
    { id: '1', date: new Date(2025, 9, 8), title: 'AI Workshop', color: 'bg-blue-500' },
    { id: '2', date: new Date(2025, 9, 8), title: 'Team Meeting', color: 'bg-green-500' },
    { id: '3', date: new Date(2025, 9, 10), title: 'Design Sprint', color: 'bg-purple-500' },
    { id: '4', date: new Date(2025, 9, 15), title: 'Code Review', color: 'bg-amber-500' },
    { id: '5', date: new Date(2025, 9, 20), title: 'Project Demo', color: 'bg-rose-500' },
  ];

  // TODO: Date and streak sections temporarily removed - keep code for future use
  const Right = (
    <aside className="hidden lg:block sticky top-[4.5rem] h-max space-y-4">
      {/* Takvim - TEMPORARILY COMMENTED OUT */}
      {/* <Card className="p-0 overflow-hidden">
        <EventCalendar 
          events={sampleEvents}
          onDateSelect={(date) => console.log('Selected date:', date)}
        />
      </Card> */}

      {/* Streak - TEMPORARILY COMMENTED OUT */}
      {/* <Card className="p-0 overflow-hidden">
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
      </Card> */}
    </aside>
  );

  const CourseCard = ({ popular }: { popular?: boolean }) => (
    <Card className="p-4 sm:p-6">
      <div className="relative">
        {popular && (
          <span className="absolute left-2 top-2 rounded-full bg-amber-100 text-amber-800 text-[8px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 border border-amber-200">{t('courses.popular')}</span>
        )}
        <div className="aspect-[5/3] w-full rounded-xl bg-accent grid place-items-center mb-3 sm:mb-4">
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg bg-secondary" />
        </div>
      </div>
      <div className="text-[8px] sm:text-[10px] font-semibold tracking-widest text-muted-foreground">{t('courses.courseType').toUpperCase()}</div>
      <div className="mt-1 text-base sm:text-lg font-semibold">{t('courses.sampleTitle')}</div>
      <div className="mt-1 text-xs sm:text-sm text-muted-foreground">{t('courses.sampleAuthor')}</div>
      <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground line-clamp-2">{t('courses.sampleDescription')}</p>
      <div className="mt-3 sm:mt-4 flex items-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary" /> 4{t('common.hours')}</span>
        <span className="inline-flex items-center gap-1">{t('courses.advanced')}</span>
      </div>
      <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <Link to="/courses/workshop-facilitation" className="rounded-full border px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm">{t('courses.viewCourse')}</Link>
        <button className="rounded-full border px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm">{t('courses.markAsRead')}</button>
      </div>
    </Card>
  );

  return (
    <AppLayout>
      <div className="py-4 sm:py-6 space-y-8 sm:space-y-12 w-full max-w-full overflow-x-hidden">
        {/* Feature Slider Section */}
        <section>
          <FeatureSlider />
        </section>

        {/* Önerilen Görevler */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold">{t('dashboard.recommendedTasks')}</h2>
            </div>
            <Link to="/tasks" className="text-sm sm:text-base text-muted-foreground hover:underline">{t('common.viewAll')}</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
            {[
              { title: t('tasks.sampleTask1'), coins: 120, level: t('tasks.medium'), time: `2${t('common.hours')}` },
              { title: t('tasks.sampleTask2'), coins: 100, level: t('tasks.beginner'), time: `1.5${t('common.hours')}` },
            ].map((task, i) => (
              <Card key={i} className="p-6 sm:p-8 lg:p-12 hover:shadow-lg transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm sm:text-base">{task.title}</h3>
                    <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground">
                      <span className="flex items-center gap-1 sm:gap-1.5">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" /> {task.time}
                      </span>
                      <span>{task.level}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm sm:text-base font-semibold text-yellow-600">{task.coins} coins</div>
                  </div>
                </div>
                <Link to="/tasks" className="mt-3 sm:mt-4 inline-block text-sm sm:text-base text-primary hover:underline font-medium">
                  {t('tasks.viewTask')} →
                </Link>
              </Card>
            ))}
          </div>
        </section>

        {/* Önerilen Kurslar */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold">{t('dashboard.recommendedCourses')}</h2>
            </div>
            <Link to="/courses" className="text-xs sm:text-sm text-muted-foreground hover:underline">{t('common.viewAll')}</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
            <CourseCard />
            <CourseCard popular />
          </div>
        </section>

        {/* Önerilen Eğitimler (Tutorials) */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div className="flex items-center gap-2">
              <Bookmark className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold">{t('dashboard.recommendedTutorials')}</h2>
            </div>
            <Link to="/tutorials" className="text-sm sm:text-base text-muted-foreground hover:underline">{t('common.viewAll')}</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
            {[
              { title: t('tutorials.reactHooks'), duration: `30 ${t('common.minutes')}`, difficulty: t('courses.intermediate') },
              { title: "CSS Grid Layout", duration: `45 ${t('common.minutes')}`, difficulty: t('courses.beginner') },
              { title: t('tutorials.typescriptBasics'), duration: `1 ${t('common.hours')}`, difficulty: t('courses.intermediate') },
            ].map((tutorial, i) => (
              <Card key={i} className="p-4 sm:p-6 hover:shadow-lg transition">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-200 rounded-lg mb-3 sm:mb-4 flex items-center justify-center">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-white/80 flex items-center justify-center">
                    <Bookmark className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-sm sm:text-base">{tutorial.title}</h3>
                <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground">
                  <span className="flex items-center gap-1 sm:gap-1.5">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" /> {tutorial.duration}
                  </span>
                  <span>{tutorial.difficulty}</span>
                </div>
                <Link to="/tutorials" className="mt-3 sm:mt-4 inline-block text-sm sm:text-base text-primary hover:underline font-medium">
                  {t('common.start')} →
                </Link>
              </Card>
            ))}
          </div>
        </section>

        {/* Önerilen Workshop'lar */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold">{t('dashboard.recommendedWorkshops')}</h2>
            </div>
            <Link to="/workshops" className="text-sm sm:text-base text-muted-foreground hover:underline">{t('common.viewAll')}</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
            {[
              { title: "Design Thinking Workshop", date: t('workshops.october15'), time: "14:00" },
              { title: t('workshops.agileMethodologies'), date: t('workshops.october20'), time: "16:00" },
            ].map((workshop, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition">
                <div className="h-32 sm:h-40 lg:h-48 bg-gradient-to-br from-primary/30 to-indigo-300" />
                <div className="p-4 sm:p-6">
                  <h3 className="font-semibold text-sm sm:text-base">{workshop.title}</h3>
                  <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground">
                    <span>{workshop.date}</span>
                    <span>•</span>
                    <span>{workshop.time}</span>
                  </div>
                  <Link to="/workshops" className="mt-3 sm:mt-4 inline-block text-sm sm:text-base text-primary hover:underline font-medium">
                    {t('common.viewDetails')} →
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