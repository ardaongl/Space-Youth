import { NavLink } from "react-router-dom";
import {
  Home,
  BookOpen,
  ClipboardList,
  PencilRuler,
  BadgeCheck,
  BriefcaseBusiness,
  Trophy,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Ana Ekran", icon: Home },
  { to: "/tasks", label: "Görevler", icon: ClipboardList },
  { to: "/courses", label: "Kurslar", icon: BookOpen },
  { to: "/workshops", label: "Workshops & Hackathons", icon: Users },
  { to: "/tutorials", label: "Ders Videoları", icon: PencilRuler },
  { to: "/my-tasks", label: "Ödevler", icon: ClipboardList },
  { to: "/job-board", label: "Job Board", icon: BriefcaseBusiness },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex h-screen sticky top-0 flex-col border-r bg-sidebar-background/60 backdrop-blur supports-[backdrop-filter]:bg-sidebar-background/70 w-64 px-2 py-3">
      <div className="px-3 pb-3">
        <a href="/" className="block">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fe593452711cd42b29cbfa5d41f1f5a37%2F5dd0ad7f51d347fc928a50c6c2e284f5?format=webp&width=400"
            alt="Logo"
            className="h-12 w-auto"
          />
        </a>
      </div>
      <nav className="flex-1 overflow-auto pr-2">
        <ul className="space-y-1.5">
          {items.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent/70 text-sidebar-foreground border border-sidebar-border"
                      : "text-muted-foreground hover:bg-sidebar-accent/60",
                  )
                }
              >
                <span className="absolute left-1 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-sidebar-ring origin-center scale-y-0 transition-transform group-hover:scale-y-100" />
                <span className="relative">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-medium">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

