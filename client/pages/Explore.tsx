import { Link } from "react-router-dom";
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

export default function Explore() {
  const { auth } = useAuth();

  const features = [
    {
      icon: Target,
      title: "Görevler & Projeler",
      description: "Gerçek dünya projeleriyle deneyim kazan, yeteneklerini geliştir ve ödüller kazan.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: BookOpen,
      title: "Kurslar & Eğitimler",
      description: "Uzman eğitmenlerden öğren, sertifikalar kazan ve kariyerine yön ver.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Workshop & Hackathon",
      description: "Canlı etkinliklere katıl, ekip çalışması yap ve network oluştur.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Trophy,
      title: "Liderlik Tablosu",
      description: "Diğer öğrencilerle yarış, başarılarını sergile ve zirvede yer al.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Video,
      title: "Video İçerikler",
      description: "Zengin video kütüphanemizden istediğin zaman öğren ve pratik yap.",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: Zap,
      title: "İş Fırsatları",
      description: "Job Board üzerinden iş ve staj fırsatlarını keşfet, kariyerine başla.",
      color: "from-amber-500 to-yellow-500"
    }
  ];

  const stats = [
    { label: "Aktif Öğrenci", value: "10,000+", icon: Users },
    { label: "Tamamlanan Proje", value: "5,000+", icon: Target },
    { label: "Uzman Eğitmen", value: "100+", icon: Sparkles },
    { label: "İş Fırsatı", value: "500+", icon: Trophy }
  ];

  return (
    <AppLayout right={null}>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-12 sm:py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/10 -z-10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10" />
          
          <div className="max-w-5xl mx-auto text-center px-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Rocket className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Geleceğini Şekillendir</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent">
              Space Youth'a Hoş Geldin
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Öğren, Geliştir, Kazan! Gençlerin yeteneklerini keşfetmesi, geliştirmesi ve 
              gerçek dünya projelerinde deneyim kazanması için tasarlanmış kapsamlı bir platform.
            </p>

            {!auth.user ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register">
                  <Button 
                    size="lg" 
                    className="rounded-full px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Hemen Başla <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="rounded-full px-8 py-6 text-base font-semibold"
                  >
                    Giriş Yap
                  </Button>
                </Link>
              </div>
            ) : (
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  className="rounded-full px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Dashboard'a Git <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}

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
                Platform Özellikleri
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Space Youth ile öğrenme yolculuğunda ihtiyacın olan her şey burada
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
                Nasıl Çalışır?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Sadece birkaç adımda Space Youth topluluğuna katıl
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Kayıt Ol",
                  description: "Hızlı ve kolay kayıt işlemiyle hesabını oluştur."
                },
                {
                  step: "2",
                  title: "Profili Tamamla",
                  description: "Kişilik analizi testini tamamla ve karakterini keşfet."
                },
                {
                  step: "3",
                  title: "Öğrenmeye Başla",
                  description: "Görevleri tamamla, kursları bitir ve ödüller kazan!"
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
                    Şimdi Başla <Sparkles className="ml-2 h-5 w-5" />
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
                  Neden Space Youth?
                </h2>
                <div className="space-y-4">
                  {[
                    "Pratik yaparak öğren ve gerçek dünya deneyimi kazan",
                    "Sertifikalar ve rozetlerle başarılarını belgele",
                    "Uzman mentorlardan rehberlik al",
                    "Global toplulukla network oluştur",
                    "İş ve staj fırsatlarına ulaş",
                    "Kendi hızında esnek öğrenme imkanı"
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
                  <h3 className="text-2xl font-bold mb-3">Ödül Kazan</h3>
                  <p className="text-muted-foreground mb-6">
                    Tamamladığın her görev ve kurs için coin kazan. 
                    Coinlerini kullanarak özel içeriklere erişebilir, 
                    sertifikalar alabilir ve hediyeler kazanabilirsin!
                  </p>
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-100 text-amber-800 font-semibold text-lg">
                    <Zap className="h-5 w-5" />
                    1000+ Coin Kazan
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
                  Hazır mısın?
                </h2>
                <p className="text-lg mb-8 text-white/90">
                  Binlerce genç gibi sen de Space Youth topluluğuna katıl ve 
                  geleceğini şekillendirmeye bugün başla!
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/register">
                    <Button 
                      size="lg"
                      variant="secondary"
                      className="rounded-full px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      Ücretsiz Kayıt Ol <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button 
                      size="lg"
                      variant="outline"
                      className="rounded-full px-8 py-6 text-base font-semibold bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      Zaten Üye misin? Giriş Yap
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

