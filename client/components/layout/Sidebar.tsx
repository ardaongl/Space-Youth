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
  Video,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRole } from "@/utils/roles";
import { Button } from "@/components/ui/button";
import React from "react";

// These will be moved inside the component to use translations

// This will be moved inside the component to use translations

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function Sidebar() {
  const { auth } = useAuth();
  const { t } = useLanguage();

  const exploreItem = { to: "/", label: t('navigation.explore'), icon: Compass };

  const items = [
    { to: "/dashboard", label: t('navigation.dashboard'), icon: Home },
    { to: "/tasks", label: t('navigation.tasks'), icon: ClipboardList },
    { to: "/courses", label: t('navigation.courses'), icon: BookOpen },
    { to: "/workshops", label: t('navigation.workshops'), icon: Users },
    { to: "/tutorials", label: t('navigation.tutorials'), icon: PencilRuler },
    { to: "/job-board", label: t('navigation.jobBoard'), icon: BriefcaseBusiness },
  ];

  const getRoleLabel = (role: UserRole): string => {
    const roleLabels: Record<UserRole, string> = {
      student: t('profile.student'),
      teacher: t('profile.teacher'),
      admin: t('profile.admin'),
    };
    return roleLabels[role];
  };
  const [zoomConnected, setZoomConnected] = React.useState<boolean>(() => {
    try { return localStorage.getItem("zoom.connected") === "true"; } catch { return false; }
  });

  // Check if user is authenticated and has completed onboarding
  const isAuthenticated = auth.status === "authenticated" && auth.user !== null;
  const hasCompletedOnboarding = typeof window !== "undefined" && 
    localStorage.getItem("onboarding.completed") === "true";
  const canAccessPlatform = isAuthenticated && hasCompletedOnboarding;

  // Listen for storage changes to update Zoom connection status
  React.useEffect(() => {
    const checkZoomStatus = () => {
      try {
        const connected = localStorage.getItem("zoom.connected") === "true";
        setZoomConnected(connected);
      } catch {}
    };

    window.addEventListener("storage", checkZoomStatus);
    return () => window.removeEventListener("storage", checkZoomStatus);
  }, []);

  const handleZoomConnect = () => {
    if (zoomConnected) {
      try { 
        localStorage.removeItem("zoom.connected"); 
        setZoomConnected(false);
      } catch {}
    } else {
      try { 
        sessionStorage.setItem("zoom.oauth.state", crypto.randomUUID()); 
      } catch {}
      window.location.assign("/zoom/callback?code=mock_code&state=" + (sessionStorage.getItem("zoom.oauth.state") || "state"));
    }
  };

  return (
    <aside className="hidden lg:flex h-screen sticky top-0 flex-col border-r bg-sidebar-background/60 backdrop-blur supports-[backdrop-filter]:bg-sidebar-background/70 w-64 px-2 py-3">
      <div className="px-3 pb-3">
        <a href="/" className="block">
          <img
            src="/SpaceYouth-logo.png"
            alt="SpaceYouth"
            className="h-12 w-auto"
          />
        </a>
      </div>
      <nav className="flex-1 overflow-auto pr-2">
        <ul className="space-y-1.5">
          {/* Explore Item - Always accessible, separated from others */}
          <li key={exploreItem.to}>
            <NavLink
              to={exploreItem.to}
              className={({ isActive }) =>
                cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary border border-primary/30"
                    : "text-muted-foreground hover:bg-sidebar-accent/60",
                )
              }
            >
              <span className="absolute left-1 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-primary origin-center scale-y-0 transition-transform group-hover:scale-y-100" />
              <span className="relative">
                <exploreItem.icon className="h-5 w-5" />
              </span>
              <span className="font-medium">{exploreItem.label}</span>
            </NavLink>
          </li>

          {/* Divider */}
          <li className="py-2">
            <div className="h-px bg-border" />
          </li>

          {/* Platform Items - Disabled if not authenticated or onboarding not complete */}
          {items.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              {canAccessPlatform ? (
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
              ) : (
                <div
                  className="group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors text-muted-foreground/50 cursor-not-allowed opacity-50"
                  title="Giriş yapın ve onboarding'i tamamlayın"
                >
                  <span className="relative">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-medium">{label}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Zoom Integration - Only show for authenticated users */}
      {canAccessPlatform && (
        <div className="px-2 pb-3 mb-2">
          <div className="flex items-center justify-between gap-2 px-2">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Video className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium">Zoom</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className={cn(
                "h-8 px-3 text-xs font-medium flex-shrink-0",
                zoomConnected 
                  ? "border-green-600 text-green-700 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950/30" 
                  : "border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950/30"
              )}
              onClick={handleZoomConnect}
            >
              {zoomConnected ? t('zoom.connected') : t('zoom.connect')}
            </Button>
          </div>
        </div>
      )}

      {/* User profile section - Only show for authenticated users */}
      {auth.user && canAccessPlatform && (
        <div className="px-2 pb-3 border-t pt-3">
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" alt={auth.user.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(auth.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{auth.user.name}</p>
              <p className="text-xs text-muted-foreground">
                {getRoleLabel(auth.user.role)}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}


