import { Edit, Share2, MoreHorizontal, Plus, Info, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/components/layout/AppLayout";
import React from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as ReTooltip
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type OnboardingData = {
  phase1: any;
  phase2: { q1: string; q2: string; q3: string; q4: string };
  phase3: any;
  phase4?: any;
};

function useOnboardingScores() {
  const [scores, setScores] = React.useState<
    { key: string; label: string; value: number }[]
  >([
    { key: "selfControl", label: "Kendini kontrol", value: 0 },
    { key: "reliability", label: "Güvenilirlik", value: 0 },
    { key: "conscientiousness", label: "Vicdanlı Olma", value: 0 },
    { key: "openness", label: "Yeniliklere açık olma", value: 0 },
    { key: "adaptability", label: "Uyum yeteneği", value: 0 },
  ]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("onboarding.data");
      if (!raw) return;
      const data: OnboardingData = JSON.parse(raw);
      const s3 = Number(data?.phase2?.q3 || "3"); // 1-5
      const s4 = Number(data?.phase2?.q4 || "3"); // 1-5
      const team = data?.phase2?.q1 === "team";
      const creative = data?.phase2?.q2 === "creative";

      const selfControl = Math.round((Math.min(5, Math.max(1, s3)) / 5) * 100);
      const conscientiousness = Math.round((Math.min(5, Math.max(1, s4)) / 5) * 100);
      const openness = creative ? 90 : 70;
      const adaptability = team ? 85 : 70;
      const reliability = team ? 95 : 85;

      setScores([
        { key: "selfControl", label: "Kendini kontrol", value: selfControl },
        { key: "reliability", label: "Güvenilirlik", value: reliability },
        { key: "conscientiousness", label: "Vicdanlı Olma", value: conscientiousness },
        { key: "openness", label: "Yeniliklere açık olma", value: openness },
        { key: "adaptability", label: "Uyum yeteneği", value: adaptability },
      ]);
    } catch {}
  }, []);

  return scores;
}

export function Profile() {
  const scores = useOnboardingScores();
  const [onboarding, setOnboarding] = React.useState<OnboardingData | null>(null);
  const [zoomConnected, setZoomConnected] = React.useState<boolean>(() => {
    try { return localStorage.getItem("zoom.connected") === "true"; } catch { return false; }
  });
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("onboarding.data");
      if (raw) setOnboarding(JSON.parse(raw));
    } catch {}
  }, []);

  const similarity = 78; // placeholder similarity score
  const primaryArchetype = {
    code: "innovative-visionary",
    name: "Innovative Visionary",
    tr: "Yenilikçi Vizyoner",
    color: "bg-amber-500",
  };
  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Top Status Bar */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            Available for work
          </div>
        </div>

        {/* Header Section */}
        <div className="relative mb-6">
          {/* Cover Image Placeholder */}
          <div className="h-48 bg-muted/30 rounded-lg mx-8 mb-4 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-6 bg-muted rounded"></div>
              <div className="h-8 w-6 bg-primary/20 rounded relative">
                <div className="absolute inset-1 bg-primary/40 rounded"></div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-2">Add a cover image. We recommend 2288 x 512.</p>
            <Button variant="link" className="text-blue-600 p-0 h-auto">Upload file</Button>
          </div>

          {/* Profile Picture - İsmin tam üstünde, merkezi 'C' harfi ile hizalı */}
          <div className="absolute left-44 -bottom-8">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-indigo-500 text-white grid place-items-center text-2xl font-bold border-4 border-background">
              S
            </div>
          </div>
        </div>

        {/* User Info Section - Profil fotoğrafının sağında */}
        <div className="ml-40 mb-6 pt-8">
          <div className="flex items-start justify-between max-w-6xl">
            {/* Sol taraf - İsim ve unvan */}
            <div className="ml-8">
              <h1 className="text-2xl font-bold text-foreground mb-1">Cenker Gültekin</h1>
              <p className="text-muted-foreground mb-4">Full-Stack Developer</p>
            </div>
            
            {/* Sağ taraf - Aksiyon butonları */}
            <div className="flex items-center gap-3 mr-8">
              <Button className="bg-primary hover:bg-primary/90">
                <Edit className="h-4 w-4 mr-2" />
                Edit profile
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>


        </div>


        {/* Main Content - Two Columns */}
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Compact Hero*/}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Hero Result Section */}
              <div className="relative bg-[#fcf5ff] border rounded-lg p-5 lg:p-6 shadow-sm lg:col-span-2 lg:min-h-[320px] overflow-hidden">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start h-full">
                  {/* Left: Title, Intro, Badge (text column) */}
                  <div className="min-w-0 flex flex-col self-start space-y-4 sm:space-y-5">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Yaratıcı Problem Çözme Profilin Hazır!</h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">Yanıtların yapay zekâ ile incelendi. Aşağıda kişilik tipin, güçlü yönlerin ve sana özel atölye önerileri var.</p>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs sm:text-[13px] font-medium text-white shadow ${primaryArchetype.color}`}
                        aria-label="Kişilik Rozeti"
                      >
                        {primaryArchetype.name} • {primaryArchetype.tr}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base leading-relaxed">Büyük düşünüyorsun, hızlı prototipliyorsun ve kısıtlı kaynakları fırsata çeviriyorsun.</p>
                  </div>

                  {/* Right: Visual column (image background + similarity block pinned bottom-right) */}
                  <div className="relative w-full h-full min-h-[160px] lg:min-h-[320px]">
                    {/* Only the right half carries the background image */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-0 from-background/70 via-background/40 to-transparent" />
                      <div className="absolute bottom-0 right-0 w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-[url('/ElonMusk.png')] bg-no-repeat bg-contain  translate-x-6 translate-y-4" />
                    </div>

                    {/* Similarity block anchored bottom-right inside the right column */}
                    <div className="absolute bottom-3 right-3 left-3 lg:left-auto lg:w-[360px] flex flex-col items-end gap-2 lg:gap-3">
                      <div className="flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap">
                        <span className="font-semibold text-white">Elon Musk</span>
                        <Tooltip>
                          <TooltipTrigger aria-label="Eşleşmenin nasıl hesaplandığı"><Info className="h-4 w-4 text-muted-foreground text-white" /></TooltipTrigger>
                          <TooltipContent>
                            Bu eşleşme, çözüm yaklaşımındaki risk alma, sistem düşüncesi ve kaynak yaratma kalıplarına göre hesaplandı.
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="flex items-center gap-2 w-full">
                        <div
                          className="h-2 flex-1 rounded-full bg-amber-200/60 overflow-hidden"
                          role="progressbar"
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={similarity}
                        >
                          <div className="h-full bg-amber-500" style={{ width: `${similarity}%` }} />
                        </div>
                        <span className="text-xs sm:text-sm text-muted-foreground text-white">%{similarity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-card border rounded-lg p-4">
              <Tabs defaultValue="overview" className="w-full">
                <div className="overflow-x-auto">
                  <TabsList className="min-w-max">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="strengths">Strengths</TabsTrigger>
                    <TabsTrigger value="growth">Growth</TabsTrigger>
                    <TabsTrigger value="evidence">Evidence</TabsTrigger>
                    <TabsTrigger value="workshops">Workshops</TabsTrigger>
                  </TabsList>
                </div>

                {/* Overview */}
                <TabsContent value="overview">
                  <div className="grid gap-4 md:grid-cols-3">
                    {/* AI Summary */}
                    <div className="md:col-span-2 border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">AI Özeti</h3>
                      <p className="mb-2">Cevaplarında risk almayı ve ilkelerini hızlıca test etmeyi tercih ediyorsun. Karmaşık problemleri parçalara bölüp pratik çözüm üretmede iyisin.</p>
                      <p className="mb-2">Kısıtları fırsata çevirme yaklaşımın, sınırlı kaynaklarla ilerleme hızını artırıyor. Prototip odaklı yaklaşımınla hızla öğreniyorsun.</p>
                      <p className="text-muted-foreground">Bazen ayrıntı planlama adımlarını atlama eğilimi gösterebilirsin; iletişim çerçevesini netleştirmen faydalı olur.</p>
                    </div>
                    {/* Feature Chips */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3">Ana Özellikler</h3>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: "Sistem Düşüncesi", tip: "Bileşenler arası ilişkileri görebilme" },
                          { label: "Kaynak Üreticiliği", tip: "Kısıtları yarara çevirme" },
                          { label: "Hızlı Deney", tip: "Hipotez – prototip – ölçüm döngüsü" },
                          { label: "Vizyon", tip: "Büyük resim ve hedef uyumu" },
                        ].map((c) => (
                          <Tooltip key={c.label}>
                            <TooltipTrigger className="rounded-full bg-muted px-3 py-1 text-xs">{c.label}</TooltipTrigger>
                            <TooltipContent>{c.tip}</TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold mb-1">Kariyer İpuçları</h4>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          <li>Product Management stajlarına bak</li>
                          <li>Teknoloji girişim topluluğuna katıl</li>
                          <li>Hackathon’larda rol al</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Strengths */}
                <TabsContent value="strengths">
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { name: "Yaratıcılık", value: 90, proof: "Fil taşımada çok modlu lojistik önerdin." },
                      { name: "Uygulanabilirlik", value: 82, proof: "Kaynak sınırlamalarını ölçülü çözümlerle dengeledin." },
                      { name: "Yapılandırma", value: 70, proof: "Adımları şematik hale getirdin; daha da detaylanabilir." },
                      { name: "İletişim", value: 76, proof: "Çözümün ana fikrini net aktardın." },
                      { name: "İşbirliği", value: 80, proof: "Takım rollerine atıfta bulundun." },
                    ].map((m) => (
                      <div key={m.name} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{m.name}</h4>
                          <span className="text-sm text-muted-foreground">%{m.value}</span>
                        </div>
                        <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={m.value} aria-valuemin={0} aria-valuemax={100}>
                          <div className="h-full bg-emerald-500" style={{ width: `${m.value}%` }} />
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{m.proof}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Growth */}
                <TabsContent value="growth">
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { title: "Plan Derinliği", tip: "Çözümüne 3 kademeli risk azaltma ekle" },
                      { title: "İletişim Netliği", tip: "Sunumunu 1-2-3 formatı ile yapılandır" },
                      { title: "Ekip İşbirliği", tip: "Rolleri ve bağımlılıkları erken netleştir" },
                    ].map((g) => (
                      <div key={g.title} className="border rounded-lg p-4">
                        <h4 className="font-medium">{g.title}</h4>
                        <p className="text-sm text-muted-foreground">{g.tip}</p>
                        <div className="mt-3 text-xs text-muted-foreground">Mini alıştırmalar: 15dk constraint-to-idea, 5-5-5 fikir üretimi</div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Evidence */}
                <TabsContent value="evidence">
                  <div className="space-y-3">
                    {(
                      [
                        { t: "Köy aydınlatma", k: onboarding?.phase3?.a1 || "…", q: "1" },
                        { t: "Fil taşıma", k: onboarding?.phase3?.a2 || "…", q: "2" },
                        { t: "Kütüphane kapısı", k: onboarding?.phase3?.a3 || "…", q: "3" },
                        { t: "Mars ikmal", k: onboarding?.phase3?.a4 || "…", q: "4" },
                        { t: "Telefon yok iletişim", k: onboarding?.phase3?.a5 || "…", q: "5" },
                      ] as const
                    ).map((row, idx) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-medium">{row.t}</div>
                            <div className="text-sm text-muted-foreground line-clamp-2">“{row.k}”</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-muted rounded-full px-2 py-1">Rubrik: 4.2/5</span>
                            {onboarding?.phase4?.recordingUrl && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">İzle</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>{row.t}</DialogTitle>
                                  </DialogHeader>
                                  <video className="w-full h-auto" src={onboarding.phase4.recordingUrl} controls />
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </div>
                        <details className="mt-3">
                          <summary className="text-sm cursor-pointer">AI gerekçesi ve zaman çizgisi</summary>
                          <div className="text-sm text-muted-foreground mt-2 space-y-1">
                            <p>AI gerekçesi: Anahtar kelimeler ve çözüm kalıpları üzerinden benzerlik analizi.</p>
                            <p>Zaman çizgisi: Yanıt süresi ~{15 + idx * 5}s, ikinci deneme yok.</p>
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Workshops */}
                <TabsContent value="workshops">
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">Bu içerikler profilinle iyi eşleşiyor.</div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { title: "Design Thinking Bootcamp", tags: "Uygulamalı • 2 gün • Başlangıç-Orta", benefit: "Hızlı prototipleme ve kullanıcı içgörüsü" },
                        { title: "Rapid Prototyping 101", tags: "Uygulamalı • 1 gün • Başlangıç", benefit: "No-code/Maker araçlarıyla hızlı deneme" },
                        { title: "Systems Thinking Lab", tags: "Atölye • 3 saat • Orta", benefit: "Sistem haritalama ve geri-besleme" },
                        { title: "Pitch & Storytelling", tags: "Atölye • 2 saat • Başlangıç", benefit: "Net iletişim ve yapılandırma" },
                      ].map((w) => (
                        <div key={w.title} className="border rounded-lg p-4">
                          <div className="font-medium mb-1">{w.title}</div>
                          <div className="text-xs text-muted-foreground mb-2">{w.tags}</div>
                          <div className="text-sm mb-3">{w.benefit}</div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" className="bg-primary">Kayıt Ol</Button>
                            <Button size="sm" variant="outline">Takvime Ekle</Button>
                            <Button size="sm" variant="ghost">Bilgi İste</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            </div>
          

          {/* Right Column - Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24 h-[calc(100vh-6rem)] overflow-auto min-w-0">
            {/* Zoom Connection Section */}
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Video className="h-4 w-4 text-primary" /> Zoom Entegrasyonu
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${zoomConnected ? "bg-green-100 text-green-700" : "bg-muted text-foreground"}`}>
                  {zoomConnected ? "Bağlı" : "Bağlı değil"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Zoom hesabınızı bağlayarak dersler için otomatik toplantı linkleri oluşturabilirsiniz.
              </p>
              <div className="mt-3 flex gap-2">
                {!zoomConnected ? (
                  <Button
                    onClick={() => {
                      // UI-only: simulate an OAuth start; backend redirect hedefi /zoom/callback olacaktır
                      try { sessionStorage.setItem("zoom.oauth.state", crypto.randomUUID()); } catch {}
                      window.location.assign("/zoom/callback?code=mock_code&state=" + (sessionStorage.getItem("zoom.oauth.state") || "state"));
                    }}
                    className="flex-1"
                  >
                    Zoom Hesabını Bağla
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        alert("Toplantı oluşturma yetkiniz aktif. Ders sayfalarından Zoom linkleri üretebilirsiniz.");
                      }}
                    >
                      Durum: Aktif
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => { try { localStorage.removeItem("zoom.connected"); } catch {}; setZoomConnected(false); }}
                    >
                      Bağlantıyı Kes
                    </Button>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Not: Bu bir arayüz simülasyonudur. Backend ile OAuth tamamlandığında bu buton geri dönüş URL'siyle çalışacaktır.
              </p>
            </div>
            {/* Skill Graph Section */}
            <div className="bg-card border rounded-lg p-4">
                <div className="h-64 lg:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={scores.map((s) => ({ subject: s.label, A: s.value }))} outerRadius={110}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tickFormatter={(v) => `${v}`} />
                      <ReTooltip formatter={(v: number) => [`% ${v.toFixed(0)}`, "Skor"]} />
                      <Radar name="Skor" dataKey="A" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-3 mt-3 text-xs sm:text-sm text-muted-foreground">
                  {scores.map((s) => (
                    <div key={s.key} className="flex items-center gap-1">
                      <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
                      <span>{s.label}: <b>% {s.value.toFixed(0)}</b></span>
                    </div>
                  ))}
                </div>
              </div>
            {/* Recommended Course Roadmap */}
            <div className="border rounded-lg p-4 bg-background shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Önerilen Kurs Yol Haritası</h3>
                <div className="text-sm text-muted-foreground">İlerleme: %35</div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={35}>
                <div className="h-full bg-indigo-500" style={{ width: "35%" }} />
              </div>
              <div className="mt-4 grid gap-4">
                {[
                  { 
                    title: "Design Thinking Temelleri", 
                    description: "Yaratıcı problem çözme metodolojisi ve kullanıcı odaklı düşünme",
                    status: "completed",
                    duration: "2 hafta",
                    level: "Başlangıç"
                  },
                  { 
                    title: "Rapid Prototyping", 
                    description: "Hızlı prototip geliştirme teknikleri ve no-code araçları",
                    status: "in-progress",
                    duration: "3 hafta",
                    level: "Orta"
                  },
                  { 
                    title: "Systems Thinking", 
                    description: "Sistem düşüncesi ve karmaşık problemleri analiz etme",
                    status: "upcoming",
                    duration: "2 hafta",
                    level: "Orta"
                  },
                  { 
                    title: "Pitch & Storytelling", 
                    description: "Etkili sunum teknikleri ve hikaye anlatımı",
                    status: "upcoming",
                    duration: "1 hafta",
                    level: "Başlangıç"
                  }
                ].map((course, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`h-8 w-8 rounded-full grid place-items-center text-sm font-medium ${
                      course.status === "completed" ? "bg-green-100 text-green-700" :
                      course.status === "in-progress" ? "bg-blue-100 text-blue-700" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {course.status === "completed" ? "✓" : i + 1}
                    </div>
                    <div className="flex-1 border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium">{course.title}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="bg-muted px-2 py-1 rounded">{course.duration}</span>
                          <span className="bg-muted px-2 py-1 rounded">{course.level}</span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">{course.description}</div>
                      {course.status === "in-progress" && (
                        <div className="flex items-center gap-2">
                          <Button size="sm" className="bg-primary text-white">Devam Et</Button>
                          <Button size="sm" variant="outline">Detaylar</Button>
                        </div>
                      )}
                      {course.status === "upcoming" && (
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" disabled>Yakında</Button>
                          <Button size="sm" variant="ghost">Önizleme</Button>
                        </div>
                      )}
                      {course.status === "completed" && (
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">Tekrar İzle</Button>
                          <Button size="sm" variant="ghost">Sertifika</Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Footer - Join Date */}
            <div className="text-center text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 bg-muted rounded-full"></div>
                <span>Joined Sep 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}