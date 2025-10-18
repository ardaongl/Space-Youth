import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { 
  Rocket, 
  Target, 
  Users, 
  Trophy, 
  BookOpen, 
  Video,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function Explore() {
  const { auth } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Redirect logged in users to dashboard (which is now the main platform)
  useEffect(() => {
    if (auth.user) {
      navigate("/dashboard");
    }
  }, [auth.user, navigate]);

  const features = [
    {
      icon: Target,
      // @ts-ignore
      title: t('explore.features.tasks'),
      // @ts-ignore
      description: t('explore.features.tasksDescription'),
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: BookOpen,
      // @ts-ignore
      title: t('explore.features.courses'),
      // @ts-ignore
      description: t('explore.features.coursesDescription'),
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      // @ts-ignore
      title: t('explore.features.workshops'),
      // @ts-ignore
      description: t('explore.features.workshopsDescription'),
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Trophy,
      // @ts-ignore
      title: t('explore.features.leaderboard'),
      // @ts-ignore
      description: t('explore.features.leaderboardDescription'),
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Video,
      // @ts-ignore
      title: t('explore.features.videos'),
      // @ts-ignore
      description: t('explore.features.videosDescription'),
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: Zap,
      // @ts-ignore
      title: t('explore.features.jobs'),
      // @ts-ignore
      description: t('explore.features.jobsDescription'),
      color: "from-amber-500 to-yellow-500"
    }
  ];

  const stats = [
    // @ts-ignore
    { label: t('explore.stats.activeStudents'), value: "10,000+", icon: Users },
    // @ts-ignore
    { label: t('explore.stats.completedProjects'), value: "5,000+", icon: Target },
    // @ts-ignore
    { label: t('explore.stats.expertInstructors'), value: "100+", icon: Sparkles },
    // @ts-ignore
    { label: t('explore.stats.jobOpportunities'), value: "500+", icon: Trophy }
  ];

  return (
    <AppLayout right={null}>
      <div className="min-h-screen">

        {/* Hero Section */}
        <section className="relative overflow-hidden py-12 sm:py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/10 -z-10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10" />
          
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Rocket className="h-4 w-4 text-primary" />
                  {/* @ts-ignore */}
                  <span className="text-sm font-medium text-primary">{t('explore.hero.tagline')}</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent">
                  {/* @ts-ignore */}
                  {t('explore.hero.title')}
                </h1>
                
                <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
                  {/* @ts-ignore */}
                  {t('explore.hero.description')}
                </p>

                {!auth.user ? (
                  <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">
                    <Link to="/register">
                      <Button 
                        size="lg" 
                        className="rounded-full px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                      >
                        {/* @ts-ignore */}
                        {t('explore.hero.startNow')} <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="rounded-full px-8 py-6 text-base font-semibold"
                      >
                        {t('auth.login')}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Link to="/">
                    <Button 
                      size="lg" 
                      className="rounded-full px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      {/* @ts-ignore */}
                      {t('explore.hero.goToPlatform')} <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                )}
              </div>

              {/* Right Side - Animated Video Character */}
              <div className="relative flex items-center justify-center lg:justify-end">
                {/* Decorative gradient circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute w-64 h-64 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse delay-75" />
                </div>

                {/* Main video container with circular frame */}
                <div className="relative z-10">
                  {/* Circular video frame */}
                  <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96">
                    {/* Gradient border ring */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 p-1 animate-spin-slow">
                      <div className="w-full h-full rounded-full bg-background" />
                    </div>
                    
                    {/* Video container */}
                    <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-background shadow-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
                      <video
                        src="/spaceyouth-video.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover scale-110"
                        onError={(e) => console.error('Video load error:', e)}
                        onLoadedData={() => console.log('Video loaded successfully!')}
                      />
                    </div>
                  </div>

                  {/* Floating connection icons */}
                  <div className="absolute -top-4 -right-4 w-14 h-14 bg-background rounded-full shadow-lg border-2 border-border flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>

                  <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-background rounded-full shadow-lg border-2 border-border flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>

                  <div className="absolute top-1/2 -right-8 -translate-y-1/2 w-14 h-14 bg-background rounded-full shadow-lg border-2 border-border flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, idx) => (
                <Card key={idx} className="p-6 text-center hover:shadow-lg transition-all">
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="text-2xl sm:text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                {/* @ts-ignore */}
                {t('explore.features.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {/* @ts-ignore */}
                {t('explore.features.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <Card 
                  key={idx} 
                  className="p-6 hover:shadow-xl transition-all group cursor-pointer border-2 hover:border-primary/50"
                >
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.color} p-2.5 mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-full w-full text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 sm:py-24 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                {/* @ts-ignore */}
                {t('explore.howItWorks.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {/* @ts-ignore */}
                {t('explore.howItWorks.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: t('explore.howItWorks.step1.title'),
                  description: t('explore.howItWorks.step1.description')
                },
                {
                  step: "2",
                  title: t('explore.howItWorks.step2.title'),
                  description: t('explore.howItWorks.step2.description')
                },
                {
                  step: "3",
                  title: t('explore.howItWorks.step3.title'),
                  description: t('explore.howItWorks.step3.description')
                }
              ].map((item, idx) => (
                <div key={idx} className="relative text-center">
                  <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                  {idx < 2 && (
                    <ArrowRight className="hidden md:block absolute top-8 -right-4 h-6 w-6 text-primary/30" />
                  )}
                </div>
              ))}
            </div>

            {!auth.user && (
              <div className="text-center mt-12">
                <Link to="/register">
                  <Button 
                    size="lg"
                    className="rounded-full px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    {t('explore.howItWorks.startNow')} <Sparkles className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 sm:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  {t('explore.benefits.title')}
                </h2>
                <div className="space-y-4">
                  {[
                    t('explore.benefits.benefit1'),
                    t('explore.benefits.benefit2'),
                    t('explore.benefits.benefit3'),
                    t('explore.benefits.benefit4'),
                    t('explore.benefits.benefit5'),
                    t('explore.benefits.benefit6')
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-lg">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <Card className="p-8 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border-2">
                <div className="text-center">
                  <Trophy className="h-16 w-16 mx-auto mb-4 text-primary" />
                  <h3 className="text-2xl font-bold mb-3">{t('explore.benefits.rewards.title')}</h3>
                  <p className="text-muted-foreground mb-6">
                    {t('explore.benefits.rewards.description')}
                  </p>
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-100 text-amber-800 font-semibold text-lg">
                    <Zap className="h-5 w-5" />
                    {t('explore.benefits.rewards.earnCoins')}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!auth.user && (
          <section className="py-16 sm:py-24 px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="p-12 text-center bg-gradient-to-br from-primary via-primary to-purple-600 text-white border-0">
                <Rocket className="h-16 w-16 mx-auto mb-6" />
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  {t('explore.cta.title')}
                </h2>
                <p className="text-lg mb-8 text-white/90">
                  {t('explore.cta.description')}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/register">
                    <Button 
                      size="lg"
                      variant="secondary"
                      className="rounded-full px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      {t('explore.cta.registerFree')} <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button 
                      size="lg"
                      variant="outline"
                      className="rounded-full px-8 py-6 text-base font-semibold bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      {t('explore.cta.alreadyMember')}
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </section>
        )}
      </div>
    </AppLayout>
  );
}

