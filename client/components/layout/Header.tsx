import {
  Search,
  Bell,
  HelpCircle,
  Sparkles,
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
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { NavLink } from "react-router-dom";
import { useTokens } from "@/context/TokensContext";

function TokenWallet() {
  const { tokens } = useTokens();
  return (
    <div className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm">
      <Coins className="h-4 w-4 text-amber-500" />
      <span className="tabular-nums">{tokens}</span>
    </div>
  );
}

export function Header() {
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
            <SheetContent side="left" className="p-0 w-[20rem] sm:max-w-xs">
              {/* Branded header */}
              <div className="px-4 pt-3 pb-2 border-b bg-gradient-to-br from-primary/10 via-transparent to-indigo-400/10">
                <div className="flex items-center gap-2.5">
                  <img src="/logo.png" alt="SpaceYouth" className="h-13 w-auto" />
                </div>
                <div className="hidden text-sm text-muted-foreground">
                  Learn, assess, and level up your skills.
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-1.5">
                <div className="hidden px-2 py-0 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                  Navigation
                </div>
                <ul className="space-y-0 mt-0">
                  {[
                    { to: "/", label: "Home", icon: Home },
                    { to: "/bookmarks", label: "Bookmarks", icon: Bookmark },
                    { to: "/leagues", label: "Leagues", icon: Medal },
                    { to: "/courses", label: "Courses", icon: BookOpen },
                    { to: "/briefs", label: "Briefs", icon: ClipboardList },
                    { to: "/tutorials", label: "Tutorials", icon: PencilRuler },
                    { to: "/assessments", label: "Assessments", icon: GraduationCap },
                    { to: "/arcade", label: "Arcade", icon: Gamepad2 },
                    { to: "/showcase", label: "Showcase", icon: Images },
                    { to: "/certifications", label: "Certifications", icon: BadgeCheck },
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
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground whitespace-nowrap">
          For Teams
        </a>
        <a
          href="#"
          className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow transition hover:brightness-110"
        >
          <Sparkles className="h-4 w-4" /> Upgrade
        </a>
        <TokenWallet />
        <button className="p-2 rounded-full hover:bg-secondary">
          <HelpCircle className="h-5 w-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-secondary">
          <Bell className="h-5 w-5" />
        </button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-indigo-500 text-white grid place-items-center text-sm font-bold">
          S
        </div>
      </div>
    </header>
  );
}
