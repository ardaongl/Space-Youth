import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  BookOpen,
  ClipboardList,
  PencilRuler,
  BriefcaseBusiness,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useLanguage } from "@/context/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRole, isStudent } from "@/utils/roles";
import React from "react";
import { useAppSelector } from "@/store";
import { IUserRoles } from "@/types/user/user";


const getInitials = (name: string | undefined): string => {
  if (!name || typeof name !== 'string') {
    return 'U';
  }
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function Sidebar() {
  const navigate = useNavigate();
  const flag = false;
  const user = useAppSelector(state => state.user)
  
  const { t } = useLanguage();
  const exploreItem = { to: "/", label: t('navigation.explore'), icon: Compass };
  

  const items = [
    { to: "/dashboard", label: t('navigation.dashboard'), icon: Home },
    { to: "/tasks", label: t('navigation.tasks'), icon: ClipboardList },
    { to: "/courses", label: t('navigation.courses'), icon: BookOpen },
    { to: "/tutorials", label: t('navigation.tutorials'), icon: PencilRuler },
    { to: "/job-board", label: t('navigation.jobBoard'), icon: BriefcaseBusiness },
  ];
   
  // Removed automatic redirect - let users navigate manually

  if(user.user && user.user.role == IUserRoles.ADMIN){
    items.push({ to: "/admin", label: t('admin'), icon: BriefcaseBusiness },)
  }

  if(user.user && user.user.role == IUserRoles.TEACHER){
    items.push({ to: "/teacher", label: t('teacher'), icon: BriefcaseBusiness },)
  }

  const getRoleLabel = (role: UserRole): string => {
    const roleLabels: Record<UserRole, string> = {
      student: t('profile.student'),
      teacher: t('profile.teacher'),
      admin: t('profile.admin'),
    };
    return roleLabels[role];
  };
  const isAuthenticated = user.user !== null;
  const canAccessPlatform = isAuthenticated;

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
      {user.user && canAccessPlatform && (
        <div className="px-2 pb-3 border-t pt-3">
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" alt={user.user?.name || 'User'} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(user.user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground">
                {user.user ? getRoleLabel(user.user.role) : ''}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}


