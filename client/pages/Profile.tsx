import { Edit, Video, Info } from "lucide-react";
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
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";

type OnboardingData = {
  phase1: any;
  phase2: { q1: string; q2: string; q3: string; q4: string };
  phase3: any;
  phase4?: any;
};

function useOnboardingScores() {
  const { t } = useLanguage();
  const [scores, setScores] = React.useState<
    { key: string; label: string; value: number }[]
  >([
    { key: "selfControl", label: t('profile.selfControl'), value: 0 },
    { key: "reliability", label: t('profile.reliability'), value: 0 },
    { key: "conscientiousness", label: t('profile.conscientiousness'), value: 0 },
    { key: "openness", label: t('profile.openness'), value: 0 },
    { key: "adaptability", label: t('profile.adaptability'), value: 0 },
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
        { key: "selfControl", label: t('profile.selfControl'), value: selfControl },
        { key: "reliability", label: t('profile.reliability'), value: reliability },
        { key: "conscientiousness", label: t('profile.conscientiousness'), value: conscientiousness },
        { key: "openness", label: t('profile.openness'), value: openness },
        { key: "adaptability", label: t('profile.adaptability'), value: adaptability },
      ]);
    } catch {}
  }, [t]);

  return scores;
}

export function Profile() {
  const { t } = useLanguage();
  const navigate = useNavigate();
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
            {t('profile.availableForWork')}
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
            <p className="text-muted-foreground text-sm mb-2">{t('profile.addCoverImage')}</p>
            <Button variant="link" className="text-blue-600 p-0 h-auto">{t('profile.uploadFile')}</Button>
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
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={() => navigate('/settings')}
              >
                <Edit className="h-4 w-4 mr-2" />
                {t('profile.editProfile')}
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
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t('profile.creativeProfileReady')}</h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{t('profile.profileAnalysis')}</p>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs sm:text-[13px] font-medium text-white shadow ${primaryArchetype.color}`}
                        aria-label={t('profile.personalityBadge')}
                      >
                        {primaryArchetype.name} • {primaryArchetype.tr}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base leading-relaxed">{t('profile.personalityDescription')}</p>
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
                          <TooltipTrigger aria-label={t('profile.matchCalculation')}><Info className="h-4 w-4 text-muted-foreground text-white" /></TooltipTrigger>
                          <TooltipContent>
                            {t('profile.matchDescription')}
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
                    <TabsTrigger value="overview">{t('profile.overview')}</TabsTrigger>
                    <TabsTrigger value="strengths">{t('profile.strengths')}</TabsTrigger>
                    <TabsTrigger value="growth">{t('profile.growth')}</TabsTrigger>
                    <TabsTrigger value="evidence">{t('profile.evidence')}</TabsTrigger>
                    <TabsTrigger value="workshops">{t('profile.workshops')}</TabsTrigger>
                  </TabsList>
                </div>

                {/* Overview */}
                <TabsContent value="overview">
                  <div className="grid gap-4 md:grid-cols-3">
                    {/* AI Summary */}
                    <div className="md:col-span-2 border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">{t('profile.aiSummary')}</h3>
                      <p className="mb-2">{t('profile.aiSummary1')}</p>
                      <p className="mb-2">{t('profile.aiSummary2')}</p>
                      <p className="text-muted-foreground">{t('profile.aiSummary3')}</p>
                    </div>
                    {/* Feature Chips */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3">{t('profile.mainFeatures')}</h3>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: t('profile.systemThinking'), tip: t('profile.systemThinkingTip') },
                          { label: t('profile.resourceGeneration'), tip: t('profile.resourceGenerationTip') },
                          { label: t('profile.rapidExperiment'), tip: t('profile.rapidExperimentTip') },
                          { label: t('profile.vision'), tip: t('profile.visionTip') },
                        ].map((c) => (
                          <Tooltip key={c.label}>
                            <TooltipTrigger className="rounded-full bg-muted px-3 py-1 text-xs">{c.label}</TooltipTrigger>
                            <TooltipContent>{c.tip}</TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold mb-1">{t('profile.careerTips')}</h4>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          <li>{t('profile.careerTip1')}</li>
                          <li>{t('profile.careerTip2')}</li>
                          <li>{t('profile.careerTip3')}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Strengths */}
                <TabsContent value="strengths">
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { name: t('profile.creativity'), value: 90, proof: t('profile.creativityProof') },
                      { name: t('profile.applicability'), value: 82, proof: t('profile.applicabilityProof') },
                      { name: t('profile.structuring'), value: 70, proof: t('profile.structuringProof') },
                      { name: t('profile.communication'), value: 76, proof: t('profile.communicationProof') },
                      { name: t('profile.collaboration'), value: 80, proof: t('profile.collaborationProof') },
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
                      { title: t('profile.planDepth'), tip: t('profile.planDepthTip') },
                      { title: t('profile.communicationClarity'), tip: t('profile.communicationClarityTip') },
                      { title: t('profile.teamCollaboration'), tip: t('profile.teamCollaborationTip') },
                    ].map((g) => (
                      <div key={g.title} className="border rounded-lg p-4">
                        <h4 className="font-medium">{g.title}</h4>
                        <p className="text-sm text-muted-foreground">{g.tip}</p>
                        <div className="mt-3 text-xs text-muted-foreground">{t('profile.miniExercises')}</div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Evidence */}
                <TabsContent value="evidence">
                  <div className="space-y-3">
                    {(
                      [
                        { t: t('profile.villageLighting'), k: onboarding?.phase3?.a1 || "…", q: "1" },
                        { t: t('profile.elephantTransport'), k: onboarding?.phase3?.a2 || "…", q: "2" },
                        { t: t('profile.libraryDoor'), k: onboarding?.phase3?.a3 || "…", q: "3" },
                        { t: t('profile.marsSupply'), k: onboarding?.phase3?.a4 || "…", q: "4" },
                        { t: t('profile.noPhoneCommunication'), k: onboarding?.phase3?.a5 || "…", q: "5" },
                      ] as const
                    ).map((row, idx) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-medium">{row.t}</div>
                            <div className="text-sm text-muted-foreground line-clamp-2">"{row.k}"</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-muted rounded-full px-2 py-1">{t('profile.rubric')}: 4.2/5</span>
                            {onboarding?.phase4?.recordingUrl && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">{t('profile.watch')}</Button>
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
                          <summary className="text-sm cursor-pointer">{t('profile.aiReasoningAndTimeline')}</summary>
                          <div className="text-sm text-muted-foreground mt-2 space-y-1">
                            <p>{t('profile.aiReasoning')}</p>
                            <p>{t('profile.timeline', { time: 15 + idx * 5 })}</p>
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Workshops */}
                <TabsContent value="workshops">
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">{t('profile.workshopsMatch')}</div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { title: t('profile.designThinkingBootcamp'), tags: t('profile.practical2Days'), benefit: t('profile.rapidPrototypingBenefit') },
                        { title: t('profile.rapidPrototyping101'), tags: t('profile.practical1Day'), benefit: t('profile.noCodeBenefit') },
                        { title: t('profile.systemsThinkingLab'), tags: t('profile.workshop3Hours'), benefit: t('profile.systemMappingBenefit') },
                        { title: t('profile.pitchStorytelling'), tags: t('profile.workshop2Hours'), benefit: t('profile.clearCommunicationBenefit') },
                      ].map((w) => (
                        <div key={w.title} className="border rounded-lg p-4">
                          <div className="font-medium mb-1">{w.title}</div>
                          <div className="text-xs text-muted-foreground mb-2">{w.tags}</div>
                          <div className="text-sm mb-3">{w.benefit}</div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" className="bg-primary">{t('profile.register')}</Button>
                            <Button size="sm" variant="outline">{t('profile.addToCalendar')}</Button>
                            <Button size="sm" variant="ghost">{t('profile.requestInfo')}</Button>
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
                  <Video className="h-4 w-4 text-primary" /> {t('profile.zoomIntegration')}
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${zoomConnected ? "bg-green-100 text-green-700" : "bg-muted text-foreground"}`}>
                  {zoomConnected ? t('profile.connected') : t('profile.notConnected')}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {t('profile.zoomDescription')}
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
                    {t('profile.connectZoomAccount')}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        alert(t('profile.meetingCreationActive'));
                      }}
                    >
                      {t('profile.statusActive')}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => { try { localStorage.removeItem("zoom.connected"); } catch {}; setZoomConnected(false); }}
                    >
                      {t('profile.disconnect')}
                    </Button>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {t('profile.zoomNote')}
              </p>
            </div>
            {/* Skill Graph Section */}
            <div className="bg-card border rounded-lg p-4">
                <div className="h-56 lg:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={scores.map((s) => ({ subject: s.label, A: s.value }))} outerRadius={85}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}`} />
                      <ReTooltip formatter={(v: number) => [`% ${v.toFixed(0)}`, t('profile.score')]} />
                      <Radar name={t('profile.score')} dataKey="A" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
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
                <h3 className="font-semibold">{t('profile.recommendedCourseRoadmap')}</h3>
                <div className="text-sm text-muted-foreground">{t('profile.progress')}: %35</div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={35}>
                <div className="h-full bg-indigo-500" style={{ width: "35%" }} />
              </div>
              <div className="mt-4 grid gap-4">
                {[
                  { 
                    title: t('profile.designThinkingFundamentals'), 
                    description: t('profile.designThinkingDescription'),
                    status: "completed",
                    duration: t('profile.weeks2'),
                    level: t('courses.beginner')
                  },
                  { 
                    title: t('profile.rapidPrototyping'), 
                    description: t('profile.rapidPrototypingDescription'),
                    status: "in-progress",
                    duration: t('profile.weeks3'),
                    level: t('courses.intermediate')
                  },
                  { 
                    title: t('profile.systemsThinking'), 
                    description: t('profile.systemsThinkingDescription'),
                    status: "upcoming",
                    duration: t('profile.weeks2'),
                    level: t('courses.intermediate')
                  },
                  { 
                    title: t('profile.pitchStorytelling'), 
                    description: t('profile.pitchStorytellingDescription'),
                    status: "upcoming",
                    duration: t('profile.weeks1'),
                    level: t('courses.beginner')
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
                          <Button size="sm" className="bg-primary text-white">{t('common.continue')}</Button>
                          <Button size="sm" variant="outline">{t('common.viewDetails')}</Button>
                        </div>
                      )}
                      {course.status === "upcoming" && (
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" disabled>{t('profile.comingSoon')}</Button>
                          <Button size="sm" variant="ghost">{t('profile.preview')}</Button>
                        </div>
                      )}
                      {course.status === "completed" && (
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">{t('profile.watchAgain')}</Button>
                          <Button size="sm" variant="ghost">{t('profile.certificate')}</Button>
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