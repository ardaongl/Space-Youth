import {
  Search,
  Bell,
  Coins,
  Menu,
  Home,
  Bookmark,
  Medal,
  BookOpen,
  ClipboardList,
  PencilRuler,
  GraduationCap,
  Gamepad2,
  Images,
  BadgeCheck,
  BriefcaseBusiness,
  ChevronRight,
  User,
  Settings,
  Gift,
  Building2,
  Sun,
  Moon,
  Monitor,
  Users,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { NavLink, useNavigate } from "react-router-dom";
import { useTokens } from "@/context/TokensContext";
import { Separator } from "@/components/ui/separator";

function TokenWallet() {
  const { tokens } = useTokens();
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm">
      <Coins className="h-5 w-5 text-amber-500" />
      <span className="tabular-nums">{tokens}</span>
    </div>
  );
}

export function Header() {
  const navigate = useNavigate();
  
  return (
    <header className="sticky top-0 z-30 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="h-14 flex items-center gap-3 px-4">
        {/* Mobile hamburger menu */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-full hover:bg-secondary" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[20rem] sm:max-w-xs overflow-y-auto">
              {/* Branded header */}
              <div className="px-4 pt-3 pb-2 border-b bg-gradient-to-br from-primary/10 via-transparent to-indigo-400/10">
                <div className="flex items-center gap-3">
                  <img src="/SpaceYouth-logo.png" alt="SpaceYouth" className="h-12 w-auto" />
                </div>
                <div className="hidden text-sm text-muted-foreground">
                  Learn, assess, and level up your skills.
                </div>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {/* Navigation */}
                <nav className="p-1.5">
                  <div className="hidden px-2 py-0 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                    Navigation
                  </div>
                  <ul className="space-y-0 mt-0">
                    {[
                      { to: "/", label: "Ana Ekran", icon: Home },
                      { to: "/tasks", label: "Görevler", icon: ClipboardList },
                      { to: "/courses", label: "Kurslar", icon: BookOpen },
                      { to: "/workshops", label: "Workshops & Hackathons", icon: Users },
                      { to: "/tutorials", label: "Ders Videoları", icon: PencilRuler },
                      { to: "/job-board", label: "Job Board", icon: BriefcaseBusiness },
                    ].map(({ to, label, icon: Icon }) => (
                      <li key={to}>
                        <SheetClose asChild>
                          <NavLink
                            to={to}
                            className={({ isActive }) =>
                              `flex items-center justify-between rounded-lg px-2 py-0.5 text-lg font-medium ${
                                isActive
                                  ? "bg-secondary font-semibold text-foreground"
                                  : "hover:bg-secondary text-foreground"
                              }`
                            }
                          >
                            <span className="flex items-center gap-0.5">
                              <Icon className="h-5 w-5" />
                              <span className="leading-none tracking-tight">{label}</span>
                            </span>
                            <ChevronRight className="hidden h-2 w-2 text-muted-foreground" />
                           </NavLink>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>

                  {/* Quick actions (hidden to maximize space) */}
                  <div className="hidden mt-2.5 px-2 py-0 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                    Quick Actions
                  </div>
                  <div className="hidden mt-1 grid grid-cols-2 gap-1 px-1">
                    <a href="#" className="rounded-xl border px-3 py-1 text-sm hover:bg-secondary">Share</a>
                    <a href="#" className="rounded-xl border px-3 py-1 text-sm hover:bg-secondary">Settings</a>
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex-1 max-w-xl">
          <label className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              className="w-full h-9 rounded-2xl border bg-secondary/50 px-9 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="Search"
            />
          </label>
        </div>
        {/* Right side buttons - sağ tarafa dayalı */}
        <div className="flex items-center gap-2 ml-auto">
          <button 
            className="px-3 py-2 rounded-full hover:bg-secondary"
            onClick={() => navigate('/bookmarks')}
            aria-label="Bookmarks"
          >
            <Bookmark className="h-6 w-6" />
          </button>
          <TokenWallet />
          <button className="px-3 py-2 rounded-full hover:bg-secondary">
            <Bell className="h-6 w-6" />
          </button>
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-indigo-500 text-white grid place-items-center text-sm font-bold cursor-pointer hover:opacity-80 transition-opacity">
                S
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 p-0" align="end">
              <div className="p-4">
                {/* Üst Bölüm - Kullanıcı Bilgileri */}
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-indigo-500 text-white grid place-items-center text-xl font-bold mb-2">
                    S
                  </div>
                  <div className="font-semibold text-foreground">Cenker Gültekin</div>
                  <div className="text-sm text-muted-foreground">Starter Plan</div>
                </div>
                
                <Separator className="mb-4" />
                
                {/* Orta Bölüm - Ana Menü Öğeleri */}
                <div className="space-y-1 mb-4">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary cursor-pointer" onClick={() => navigate('/profile')}>
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Profile</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary cursor-pointer">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Settings</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary cursor-pointer">
                    <Gift className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Refer friends, get rewards</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary cursor-pointer">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Uxcel for Teams</span>
                  </div>
                </div>
                
                <Separator className="mb-4" />
                
                {/* Alt Bölüm - Ek Seçenekler ve Çıkış */}
                <div className="space-y-1">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary cursor-pointer">
                    <span className="text-sm">Help Center</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary cursor-pointer">
                    <span className="text-sm">Sign Out</span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </header>
  );
}
