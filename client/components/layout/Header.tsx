import {
  Coins,
  Menu,
  Home,
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
import { NotificationsPopover } from "./NotificationsPopover";
import { useLanguage } from "@/context/LanguageContext";
import { AvatarDisplay } from "@/components/ui/avatar-display";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useAppSelector } from "@/store";
import { useDispatch } from "react-redux";
import { clearUser } from "@/store/slices/userSlice";

function TokenWallet({ points }: { points?: number | null }) {
  const { tokens } = useTokens();
  const displayBalance =
    typeof points === "number" && !Number.isNaN(points) ? points : tokens;
  
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm bg-background/60">
      <Coins className="h-5 w-5 text-amber-500" />
      <span className="tabular-nums">{displayBalance}</span>
    </div>
  );
}

export function Header() {
  const navigate = useNavigate();
  const user = useAppSelector(state => state.user.user)
  const { t } = useLanguage();
  const userName = user?.name || "User";

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
  };
  
  return (
    <header className="sticky top-0 z-30 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="h-14 flex items-center gap-3 px-4">
        {/* Mobile hamburger menu - only show when user is authenticated */}
        {user && (
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
                      { to: "/", label: t('navigation.home'), icon: Home },
                      { to: "/tasks", label: t('navigation.tasks'), icon: ClipboardList },
                      { to: "/courses", label: t('navigation.courses'), icon: BookOpen },
                      { to: "/workshops", label: t('navigation.workshops'), icon: Users },
                      { to: "/tutorials", label: t('navigation.tutorials'), icon: PencilRuler },
                      { to: "/job-board", label: t('navigation.jobBoard'), icon: BriefcaseBusiness },
                      { to: "/profile", label: t('navigation.profile'), icon: User },
                      { to: "/settings", label: t('navigation.settings'), icon: Settings },
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
        )}

        <div className="flex-1" />
        {/* Right side buttons - sağ tarafa dayalı */}
        <div className="flex items-center gap-2 ml-auto">
          {user ? (
            <>
              <LanguageSwitcher />
              <TokenWallet points={user?.points} />
              {/*<NotificationsPopover /> */}
              <HoverCard openDelay={0}>
                <HoverCardTrigger asChild>
                  <div className="cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarDisplay name={userName} size="sm" />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-0" align="end">
                  <div className="p-4">
                    {/* Üst Bölüm - Kullanıcı Bilgileri */}
                    <div className="flex flex-col items-center text-center mb-4">
                      <div className="mb-2">
                        <AvatarDisplay name={userName} size="md" />
                      </div>
                      <div className="font-semibold text-foreground">{userName}</div>
                      <div className="text-sm text-muted-foreground">{t('profile.starterPlan')}</div>
                    </div>
                    
                    <Separator className="mb-4" />
                    
                    {/* Orta Bölüm - Ana Menü Öğeleri */}
                    <div className="space-y-1 mb-4">
                      <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary cursor-pointer" onClick={() => navigate('/profile')}>
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{t('navigation.profile')}</span>
                      </div>
                      <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary cursor-pointer" onClick={() => navigate('/settings')}>
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{t('navigation.settings')}</span>
                      </div>
                    </div>
                    
                    <Separator className="mb-4" />
                    
                    {/* Alt Bölüm - Çıkış */}
                    <div className="space-y-1">
                      <div 
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive cursor-pointer transition-colors"
                        onClick={handleLogout}
                      >
                        <span className="text-sm font-medium">{t('profile.logout')}</span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-full text-sm font-medium hover:bg-secondary transition-colors"
              >
                {t('auth.login')}
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="px-4 py-2 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:brightness-110 transition-all shadow"
              >
                {t('auth.register')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
