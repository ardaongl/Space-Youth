import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CheckCircle2, Clock, ShieldCheck, BookOpen, ListChecks, ArrowLeft, Bookmark, Coins, Play, Calendar, Users2, MapPin } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { isAdmin } from "@/utils/roles";

type EventType = "workshop" | "hackathon";

export default function EventDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const adminUser = isAdmin(auth.user?.role);

  // Slug'dan event type'ı çıkar
  const eventType: EventType = slug?.startsWith("workshop") ? "workshop" : "hackathon";

  // Mock event data - gerçek uygulamada API'den gelecek
  const eventData = {
    title: eventType === "workshop" 
      ? "UX Research Fundamentals Workshop" 
      : "AI Hackathon 2024",
    description: eventType === "workshop"
      ? "Workshop'lar, karmaşık problemleri çözmek ve yenilikçi çözümler üretmek için güçlü araçlardır. Bu workshop, işbirliğini teşvik eden, ekip çalışmasını geliştiren ve çığır açan fikirler üreten workshop'ları etkili bir şekilde yönetme becerilerini size kazandıracaktır. Workshop boyunca, ekiplerin karşılaştığı yaygın zorlukları keşfedecek ve bunların üstesinden nasıl geleceğinizi öğreneceksiniz."
      : "48 saatlik yoğun bir kodlama maratonu! Yapay zeka ve makine öğrenmesi alanında yenilikçi projeler geliştirin, endüstri liderlerinden geri bildirim alın ve harika ödüller kazanın. Ekip olarak çalışın ve networking fırsatlarından yararlanın.",
    price: eventType === "workshop" ? 150 : 0, // Hackathon'lar genelde ücretsiz
    organizerName: eventType === "workshop" ? "Emily Parker" : "Tech Community",
    duration: eventType === "workshop" ? "2 hours" : "48 hours",
    certification: true,
    sessionsCount: eventType === "workshop" ? 4 : 10,
    date: "2024-03-25T10:00:00Z",
    location: eventType === "workshop" ? "Online - Zoom" : "TechHub Istanbul",
    maxParticipants: eventType === "workshop" ? 50 : 150,
    currentParticipants: eventType === "workshop" ? 45 : 120,
    eventPhotos: [
      "/image.png",
      "/image.png",
      "/image.png"
    ],
    eventVideos: [
      { thumbnail: "/image.png", title: eventType === "workshop" ? "Workshop Tanıtımı" : "Hackathon Highlights" },
      { thumbnail: "/image.png", title: eventType === "workshop" ? "İleri Teknikler" : "Geçen Yılın Kazananları" }
    ],
    eventType: eventType
  };

  const handleSave = () => {
    console.log("Event saved");
    // TODO: Implement save functionality
  };

  const handleJoin = () => {
    console.log("Joined event");
    // TODO: Implement join functionality
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate('/workshops')}
        >
          <ArrowLeft className="h-4 w-4" />
          Geri Dön
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8">
          {/* Left Content */}
          <div>
            {/* Event Header */}
            <div className="space-y-4">
              {/* Event Type Badge */}
              <div>
                <span className={`inline-flex items-center gap-2 rounded-full text-sm font-semibold px-4 py-2 border ${
                  eventType === "workshop" 
                    ? "bg-blue-100 text-blue-800 border-blue-200" 
                    : "bg-purple-100 text-purple-800 border-purple-200"
                }`}>
                  {eventType === "workshop" ? "🎯 Workshop" : "💻 Hackathon"}
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight">{eventData.title}</h1>
              
              {/* Price and Actions */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  {eventData.price > 0 ? (
                    <>
                      <Coins className="h-6 w-6 text-yellow-600" />
                      <span className="text-2xl font-bold text-yellow-600">{eventData.price}</span>
                      <span className="text-muted-foreground">coins</span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-green-600">ÜCRETSİZ</span>
                  )}
                </div>
                
                <div className="flex gap-4 items-center flex-wrap">
                  {adminUser && (
                    <Button
                      size="default"
                      className="gap-2"
                      onClick={() => navigate(`/events/${slug}/edit`)}
                    >
                      Düzenle
                    </Button>
                  )}
                  <Button variant="outline" size="lg" className="gap-2" onClick={handleSave}>
                    <Bookmark className="h-5 w-5" />
                  </Button>
                  
                  {/* Featured Join Button */}
                  <Button 
                    size="lg" 
                    className="gap-2 px-8 py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105" 
                    onClick={handleJoin}
                  >
                    {eventType === "workshop" ? "Workshop'a Katıl" : "Hackathon'a Kayıt Ol"}
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Açıklama</h2>
                <p className="text-muted-foreground leading-7">
                  {eventData.description}
                </p>
              </div>

              {/* Details Section */}
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Detaylar</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Organizatör</p>
                      <p className="text-sm text-muted-foreground">{eventData.organizerName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Süre</p>
                      <p className="text-sm text-muted-foreground">{eventData.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Tarih</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(eventData.date).toLocaleDateString("tr-TR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Konum</p>
                      <p className="text-sm text-muted-foreground">{eventData.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Sertifika</p>
                      <p className="text-sm text-muted-foreground">
                        {eventData.certification ? "Sertifikalı" : "Sertifikasız"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Users2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Katılımcılar</p>
                      <p className="text-sm text-muted-foreground">
                        {eventData.currentParticipants}/{eventData.maxParticipants} kişi
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills/Benefits Section */}
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">
                  {eventType === "workshop" ? "Bu workshop'ta kazanacağınız beceriler:" : "Bu hackathon'da kazanacaklarınız:"}
                </h2>
                <ul className="space-y-3">
                  {eventType === "workshop" ? (
                    <>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                        <p className="leading-7">
                          <span className="font-semibold">Başarılı UX araştırmaları planlama ve yürütme</span> — 
                          Kullanıcı araştırmasının ne zaman yapılacağını, hedeflerin nasıl belirleneceğini ve doğru sonuçları elde etmek için uygun yöntemleri nasıl seçeceğinizi öğrenin.
                        </p>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                        <p className="leading-7">
                          <span className="font-semibold">Veri toplama ve analiz teknikleri</span> — 
                          Kullanıcı görüşmeleri, anketler ve kullanılabilirlik testleri ile nasıl etkili veri toplanacağını ve analiz edileceğini keşfedin.
                        </p>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                        <p className="leading-7">
                          <span className="font-semibold">İçgörüleri eyleme dönüştürme</span> — 
                          Araştırma bulgularınızı tasarım kararlarına nasıl çevireceğinizi ve paydaşlara nasıl sunacağınızı öğrenin.
                        </p>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                        <p className="leading-7">
                          <span className="font-semibold">Gerçek dünya problem çözme deneyimi</span> — 
                          Zaman baskısı altında çalışarak, hızlı prototipleme ve MVP geliştirme becerilerinizi geliştirin.
                        </p>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                        <p className="leading-7">
                          <span className="font-semibold">Ekip çalışması ve networking</span> — 
                          Farklı disiplinlerden insanlarla çalışın, yeni bağlantılar kurun ve sektör profesyonelleriyle tanışın.
                        </p>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                        <p className="leading-7">
                          <span className="font-semibold">Değerli ödüller ve tanınma</span> — 
                          Projenizi endüstri liderlerine sunun, geri bildirim alın ve kazanma şansınızı yakalayın.
                        </p>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Event Photos & Videos */}
          <div className="space-y-6">
            {/* Event Photo */}
            <div className="rounded-lg border overflow-hidden bg-muted">
              <img 
                src={eventData.eventPhotos[0]} 
                alt="Event photo"
                className="w-full aspect-video object-cover"
              />
            </div>

            {/* Participants Progress */}
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Katılım Durumu</span>
                <span className="text-sm text-muted-foreground">
                  {eventData.currentParticipants}/{eventData.maxParticipants}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(eventData.currentParticipants / eventData.maxParticipants) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {eventData.maxParticipants - eventData.currentParticipants} kişilik kontenjan kaldı
              </p>
            </div>

            {/* Event Videos */}
            {eventData.eventVideos.length === 1 ? (
              // Single video - display directly
              <div className="rounded-lg border bg-card p-6">
                <div className="group cursor-pointer">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={eventData.eventVideos[0].thumbnail} 
                      alt={eventData.eventVideos[0].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <p className="text-sm font-medium mt-2">{eventData.eventVideos[0].title}</p>
                </div>
              </div>
            ) : (
              // Multiple videos - display as carousel
              <div className="rounded-lg border bg-card p-6">
                <Carousel className="w-full">
                  <CarouselContent>
                    {eventData.eventVideos.map((video, index) => (
                      <CarouselItem key={index}>
                        <div className="group cursor-pointer">
                          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                            <img 
                              src={video.thumbnail} 
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition">
                              <Play className="h-12 w-12 text-white" />
                            </div>
                          </div>
                          <p className="text-sm font-medium mt-2">{video.title}</p>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

