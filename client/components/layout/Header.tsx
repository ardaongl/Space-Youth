import { Search, Bell, HelpCircle, Sparkles, Coins, Menu } from "lucide-react";
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
            <SheetContent side="left" className="p-0 w-80 sm:max-w-xs">
              <div className="px-4 py-3 border-b">
                <div className="flex items-center gap-3">
                  <img src="/spaceyouth-logo.svg" alt="SpaceYouth" className="h-8 w-auto" />
                </div>
              </div>
              <nav className="p-3">
                <ul className="space-y-1">
                  {[
                    { to: "/", label: "Home" },
                    { to: "/bookmarks", label: "Bookmarks" },
                    { to: "/leagues", label: "Leagues" },
                    { to: "/courses", label: "Courses" },
                    { to: "/briefs", label: "Briefs" },
                    { to: "/tutorials", label: "Tutorials" },
                    { to: "/assessments", label: "Assessments" },
                    { to: "/arcade", label: "Arcade" },
                    { to: "/showcase", label: "Showcase" },
                    { to: "/certifications", label: "Certifications" },
                    { to: "/job-board", label: "Job Board" },
                  ].map((it) => (
                    <li key={it.to}>
                      <SheetClose asChild>
                        <NavLink
                          to={it.to}
                          className={({ isActive }) =>
                            `block rounded-lg px-3 py-2 text-sm ${
                              isActive ? "bg-secondary font-medium" : "hover:bg-secondary"
                            }`
                          }
                        >
                          {it.label}
                        </NavLink>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
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
