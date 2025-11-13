import { Edit, Video, Info, Users, Plus, Loader2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
import { isTeacher, isStudent } from "@/utils/roles";
import { useAppDispatch, useAppSelector } from "@/store";
import { apis } from "@/services";
import { useToast } from "@/hooks/use-toast";
import { setUser } from "@/store/slices/userSlice";

type OnboardingData = {
  phase1: any;
  phase2: { q1: string; q2: string; q3: string; q4: string };
  phase3: any;
  phase4?: any;
};

type StudentDetailsResponse = {
  student: {
    id: string;
    status: string;
    school?: string;
    department?: string;
    cv_url?: string;
    questions_and_answers: string;
    phases: Record<string, any>;
    graphic_test_completed?: boolean | null;
    graphic_test_scores?: string | Record<string, number>;
  };
  character: {
    id: string;
    name: string;
    details: string;
    image_url: string;
    created_at: string;
    updated_at: string;
  };
  personality: {
    id: string;
    name: string;
    type: string;
    short_description: string;
    long_description: string;
  };
};

type GraphicTestAnswer = "yes" | "no";

function sanitizeGraphicTestScores(raw: string): Record<string, number> | null {
  if (!raw) return null;
  let cleaned = raw.trim();
  if (!cleaned) return null;

  const fenceStart = /^```(?:json)?\s*/i;
  if (fenceStart.test(cleaned)) {
    cleaned = cleaned.replace(fenceStart, "");
  }
  const fenceEnd = /\s*```$/;
  if (fenceEnd.test(cleaned)) {
    cleaned = cleaned.replace(fenceEnd, "");
  }
  cleaned = cleaned.trim();
  if (!cleaned) return null;

  try {
    const parsed = JSON.parse(cleaned);
    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, number>;
    }
  } catch (error) {
    console.warn("sanitizeGraphicTestScores parse error:", error);
  }
  return null;
}

function getRandomScore(min = 55, max = 90) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const scores = useOnboardingScores();
  const [onboarding, setOnboarding] = React.useState<OnboardingData | null>(null);
  const [zoomConnected, setZoomConnected] = React.useState<boolean>(false);
  const [studentDetails, setStudentDetails] = React.useState<StudentDetailsResponse | null>(null);
  const [loadingDetails, setLoadingDetails] = React.useState(false);
  const graphicTestQuestions = React.useMemo(
    () => [
      { id: "q1", label: t("profile.graphicTestQuestions.q1") },
      { id: "q2", label: t("profile.graphicTestQuestions.q2") },
      { id: "q3", label: t("profile.graphicTestQuestions.q3") },
      { id: "q4", label: t("profile.graphicTestQuestions.q4") },
      { id: "q5", label: t("profile.graphicTestQuestions.q5") },
      { id: "q6", label: t("profile.graphicTestQuestions.q6") },
      { id: "q7", label: t("profile.graphicTestQuestions.q7") },
      { id: "q8", label: t("profile.graphicTestQuestions.q8") },
      { id: "q9", label: t("profile.graphicTestQuestions.q9") },
      { id: "q10", label: t("profile.graphicTestQuestions.q10") },
    ],
    [t],
  );
  const [graphicTestAnswers, setGraphicTestAnswers] = React.useState<Record<string, GraphicTestAnswer | "">>({});
  const [graphicTestError, setGraphicTestError] = React.useState<string | null>(null);
  const [graphicTestSubmitting, setGraphicTestSubmitting] = React.useState(false);
  const scoreKeyConfigs = React.useMemo(
    () => [
      {
        key: "selfControl" as const,
        label: t("profile.selfControl"),
        matchKeys: [t("profile.selfControl"), "Kendini kontrol"],
      },
      {
        key: "reliability" as const,
        label: t("profile.reliability"),
        matchKeys: [t("profile.reliability"), "Güvenilirlik"],
      },
      {
        key: "conscientiousness" as const,
        label: t("profile.conscientiousness"),
        matchKeys: [t("profile.conscientiousness"), "Vicdanlı Olma"],
      },
      {
        key: "openness" as const,
        label: t("profile.openness"),
        matchKeys: [t("profile.openness"), "Yeniliklere açık olma"],
      },
      {
        key: "adaptability" as const,
        label: t("profile.adaptability"),
        matchKeys: [t("profile.adaptability"), "Uyum yeteneği"],
      },
    ],
    [t],
  );

  const isTeacherUser = isTeacher(user.user?.role);
  const isStudentUser = isStudent(user.user?.role);
  const showGraphicTest = Boolean(
    isStudentUser &&
      !loadingDetails &&
      studentDetails?.student &&
      !studentDetails.student.graphic_test_completed,
  );
  React.useEffect(() => {
    if (typeof user.user?.teacher?.zoom_connected === "boolean") {
      setZoomConnected(user.user.teacher.zoom_connected);
      return;
    }

    try {
      const stored = localStorage.getItem("zoom.connected");
      setZoomConnected(stored === "true");
    } catch {
      setZoomConnected(false);
    }
  }, [user.user?.teacher?.zoom_connected]);
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("onboarding.data");
      if (raw) setOnboarding(JSON.parse(raw));
    } catch {}
  }, []);

  React.useEffect(() => {
    if (showGraphicTest) {
      setGraphicTestAnswers(prev =>
        graphicTestQuestions.reduce<Record<string, GraphicTestAnswer | "">>((acc, question) => {
          acc[question.id] = prev[question.id] ?? "";
          return acc;
        }, {}),
      );
    } else {
      setGraphicTestAnswers({});
      setGraphicTestError(null);
      setGraphicTestSubmitting(false);
    }
  }, [showGraphicTest, graphicTestQuestions]);

  React.useEffect(() => {
    const fetchStudentDetails = async () => {
      if (!isStudentUser) return;
      
      setLoadingDetails(true);
      try {
        const response = await apis.student.get_student_details();
        console.log("response => ", response);
        console.log("response.data => ", response?.data);
        
        if (response?.data) {
          // Ensure the data structure matches our expected format
          const data = response.data;
          if (data.character || data.personality || data.student) {
            setStudentDetails(data as StudentDetailsResponse);
          } else {
            console.warn("Unexpected response structure:", data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch student details:", error);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchStudentDetails();
  }, [isStudentUser]);

  const handleGraphicTestAnswerChange = (questionId: string, answer: GraphicTestAnswer) => {
    setGraphicTestAnswers(prev => ({ ...prev, [questionId]: answer }));
    setGraphicTestError(null);
  };

  const handleGraphicTestSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGraphicTestError(null);

    if (graphicTestQuestions.some(question => !graphicTestAnswers[question.id])) {
      setGraphicTestError(t("profile.graphicTestIncomplete"));
      return;
    }

    try {
      setGraphicTestSubmitting(true);
      const payload = graphicTestQuestions.reduce<Record<string, GraphicTestAnswer>>(
        (acc, question) => {
          acc[question.id] = graphicTestAnswers[question.id] as GraphicTestAnswer;
          return acc;
        },
        {},
      );

      const formDataText = graphicTestQuestions
        .map(question => {
          const answer = payload[question.id];
          const answerLabel = answer === "yes" ? "Yes" : "No";
          return `${question.label}\nAnswer: ${answerLabel}`;
        })
        .join("\n\n");

      const response = await apis.student.graphic_test_send({ form_data: formDataText });

      if (response && typeof response.status === "number" && response.status >= 200 && response.status < 400) {
        setStudentDetails(prev =>
          prev
            ? {
                ...prev,
                student: {
                  ...prev.student,
                  graphic_test_completed: true,
                },
              }
            : prev,
        );
        toast({ title: t("profile.graphicTestSubmitSuccess") });
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error) {
      console.error("Failed to submit graphic test:", error);
      setGraphicTestError(t("profile.graphicTestSubmitError"));
    } finally {
      setGraphicTestSubmitting(false);
    }
  };

  const similarity = 78; // placeholder similarity score
  const displayScores = React.useMemo(() => {
    const fallbackMap = new Map(scores.map(entry => [entry.key, entry]));
    const rawScores = studentDetails?.student?.graphic_test_scores;
    if (!rawScores) {
      return scoreKeyConfigs.map(config => ({
        key: config.key,
        label: config.label,
        value: fallbackMap.get(config.key)?.value ?? 0,
      }));
    }

    let parsedScores: Record<string, number> | null = null;
    if (typeof rawScores === "string") {
      parsedScores = sanitizeGraphicTestScores(rawScores);
    } else if (typeof rawScores === "object" && rawScores !== null) {
      parsedScores = rawScores;
    }

    if (!parsedScores) {
      return scoreKeyConfigs.map(config => ({
        key: config.key,
        label: config.label,
        value: fallbackMap.get(config.key)?.value ?? 0,
      }));
    }

    const normalizedEntries = Object.entries(parsedScores).reduce<Record<string, number>>(
      (acc, [label, value]) => {
        const numeric = Number(value);
        if (!Number.isNaN(numeric)) {
          acc[label.trim().toLowerCase()] = numeric;
        }
        return acc;
      },
      {},
    );

    return scoreKeyConfigs.map(config => {
      const matchedScore = config.matchKeys.reduce<number | undefined>((found, key) => {
        if (found !== undefined) return found;
        const normalizedKey = key.trim().toLowerCase();
        if (normalizedKey in normalizedEntries) {
          return normalizedEntries[normalizedKey];
        }
        return undefined;
      }, undefined);

      const fallbackValue =
        fallbackMap.get(config.key)?.value ?? getRandomScore();
      return {
        key: config.key,
        label: config.label,
        value: matchedScore ?? fallbackValue,
      };
    });
  }, [scores, studentDetails?.student?.graphic_test_scores, scoreKeyConfigs]);

  const primaryArchetype = studentDetails?.personality ? {
    code: studentDetails.personality.type.toLowerCase(),
    name: studentDetails.personality.name,
    tr: studentDetails.personality.type,
    color: "bg-amber-500",
  } : {
    code: "innovative-visionary",
    name: "Innovative Visionary",
    tr: "Yenilikçi Vizyoner",
    color: "bg-amber-500",
  };

  // Teacher profile data
  const [teacherDetails, setTeacherDetails] = React.useState<{
    first_name?: string;
    last_name?: string;
    email?: string;
    about?: string;
  } | null>(null);
  const [teacherCourses, setTeacherCourses] = React.useState<any[]>([]);
  const [loadingTeacher, setLoadingTeacher] = React.useState(false);

  React.useEffect(() => {
    const fetchTeacherData = async () => {
      if (!isTeacherUser) return;
      
      setLoadingTeacher(true);
      try {
        // Fetch user details
        const userResponse = await apis.user.get_user();
        if (userResponse?.data) {
          setTeacherDetails({
            first_name: userResponse.data.first_name,
            last_name: userResponse.data.last_name,
            email: userResponse.data.email,
            about: userResponse.data.about || "",
          });
        }

        // Fetch teacher's courses
        const coursesResponse = await apis.course.get_courses();
        if (coursesResponse?.data && Array.isArray(coursesResponse.data)) {
          // Filter courses where teacher is the creator (assuming teacher_id matches user.id)
          const userCourses = coursesResponse.data.filter((course: any) => 
            course.teacher?.id === user.user?.id || course.teacher_id === user.user?.id
          );
          setTeacherCourses(userCourses);
        }
      } catch (error) {
        console.error("Failed to fetch teacher data:", error);
      } finally {
        setLoadingTeacher(false);
      }
    };

    fetchTeacherData();
  }, [isTeacherUser, user.user?.id]);

  if (isTeacherUser) {
    const teacherName = teacherDetails 
      ? `${teacherDetails.first_name || ''} ${teacherDetails.last_name || ''}`.trim() || user.user?.name
      : user.user?.name || t('profile.user');
    const teacherInitials = teacherDetails 
      ? `${teacherDetails.first_name?.charAt(0) || ''}${teacherDetails.last_name?.charAt(0) || ''}`.toUpperCase() || user.user?.name?.charAt(0).toUpperCase()
      : user.user?.name?.charAt(0).toUpperCase() || 'T';

    return (
      <AppLayout>
        <div className="container mx-auto py-8 max-w-7xl">
          {loadingTeacher ? (
            <div className="space-y-8">
              <Card className="p-8 mb-8">
                <div className="animate-pulse">
                  <div className="h-32 bg-muted rounded w-32 mb-4"></div>
                  <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </div>
              </Card>
              <Card className="p-8 mb-8">
                <div className="animate-pulse">
                  <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </Card>
            </div>
          ) : (
            <>
              {/* Header Card - Similar to Udemy */}
              <Card className="p-8 mb-8">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary to-indigo-500 text-white grid place-items-center text-2xl font-bold border-4 border-background shadow-lg">
                      {teacherInitials}
                    </div>
                  </div>

                  {/* Info and Actions */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{teacherName}</h1>
                      {teacherDetails?.email && (
                        <p className="text-lg text-muted-foreground">{teacherDetails.email}</p>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        onClick={() => navigate('/settings')}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        {t('profile.editProfile')}
                      </Button>
                      <Button 
                        onClick={() => navigate('/courses/add')}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        {t('courses.addCourse')}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* About Section */}
              {teacherDetails?.about && (
                <Card className="p-8 mb-8">
                  <h2 className="text-2xl font-semibold mb-4">{t('instructor.about')}</h2>
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {teacherDetails.about}
                  </div>
                </Card>
              )}

              {/* Courses Section */}
              <Card className="p-8">
                <h2 className="text-2xl font-semibold mb-6">
                  {t('instructor.myCourses')} ({teacherCourses.length})
                </h2>
                
                {teacherCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teacherCourses.map((course) => {
                      const courseSlug = course.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || '';
                      return (
                        <div 
                          key={course.id}
                          onClick={() => navigate(`/courses/${courseSlug}`)}
                          className="cursor-pointer group"
                        >
                          <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                            <div className="aspect-video relative overflow-hidden bg-muted">
                              {course.image_url ? (
                                <img 
                                  src={course.image_url} 
                                  alt={course.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                                  <Video className="h-12 w-12" />
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                {course.title}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                                {course.level && (
                                  <Badge variant="secondary">{course.level}</Badge>
                                )}
                                {course.students_count !== undefined && (
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {course.students_count.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="mb-4">{t('instructor.noCourses')}</p>
                    <Button 
                      onClick={() => navigate('/courses/add')}
                      className="flex items-center gap-2 mx-auto"
                    >
                      <Plus className="h-4 w-4" />
                      {t('courses.addCourse')}
                    </Button>
                  </div>
                )}
              </Card>
            </>
          )}
        </div>
      </AppLayout>
    );
  }

  // Student profile (existing code)
  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Top Status Bar */}
        <div className="flex justify-center pt-6 pb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            {t('profile.availableForWork')}
          </div>
        </div>

        {/* Profile Header Section */}
        <div className="max-w-7xl mx-auto px-8 mb-8">
          <Card className="p-6 lg:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Profile Picture */}
              <div className="flex-shrink-0">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-indigo-500 text-white grid place-items-center text-2xl font-bold border-4 border-background shadow-lg">
                  {user.user?.name?.charAt(0).toUpperCase() || 'S'}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                      {user.user?.name || t('profile.user')}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                      {studentDetails?.student?.department || 'Full-Stack Developer'}
                    </p>
                    {studentDetails?.student?.school && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {studentDetails.student.school}
                      </p>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
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
            </div>
          </Card>
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
                    <p className="text-sm sm:text-base leading-relaxed">
                      {studentDetails?.personality?.short_description || t('profile.personalityDescription')}
                    </p>
                  </div>

                  {/* Right: Visual column (image background + similarity block pinned bottom-right) */}
                  <div className="relative w-full h-full min-h-[160px] lg:min-h-[320px]">
                    {/* Only the right half carries the background image */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-0 from-background/70 via-background/40 to-transparent" />
                      {studentDetails?.character?.image_url ? (
                        <div className="absolute bottom-0 right-0 w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96 translate-x-6 translate-y-4">
                          <img 
                            src={studentDetails.character.image_url} 
                            alt={studentDetails.character.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="absolute bottom-0 right-0 w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-[url('/ElonMusk.png')] bg-no-repeat bg-contain translate-x-6 translate-y-4" />
                      )}
                    </div>

                    {/* Similarity block anchored bottom-right inside the right column */}
                    <div className="absolute bottom-3 right-3 left-3 lg:left-auto lg:w-[360px] flex flex-col items-end gap-2 lg:gap-3">
                      <div className="flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap">
                        <span className="font-semibold text-white">{studentDetails?.character?.name || "Elon Musk"}</span>
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

            {/* Character and Personality Section */}
            {loadingDetails ? (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="animate-pulse">
                    <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </Card>
              </div>
            ) : studentDetails && (studentDetails.character || studentDetails.personality) ? (
              <div className="space-y-6">
                {/* Character Card */}
                {studentDetails.character && (
                  <Card className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {studentDetails.character.image_url && (
                        <div className="flex-shrink-0">
                          <img 
                            src={studentDetails.character.image_url} 
                            alt={studentDetails.character.name || "Character"}
                            className="w-32 h-32 rounded-lg object-cover border"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">
                          {studentDetails.character.name || t('profile.character')}
                        </h3>
                        {studentDetails.character.details && (
                          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {studentDetails.character.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                )}

                {/* Personality Card */}
                {studentDetails.personality && (
                  <Card className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">
                          {studentDetails.personality.name || t('profile.personality')}
                        </h3>
                        {studentDetails.personality.type && (
                          <Badge variant="secondary" className="mt-1">
                            {studentDetails.personality.type}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {studentDetails.personality.short_description && (
                        <div>
                          <h4 className="font-medium mb-2">{t('profile.shortDescription')}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                            {studentDetails.personality.short_description}
                          </p>
                        </div>
                      )}
                      {studentDetails.personality.long_description && (
                        <div>
                          <h4 className="font-medium mb-2">{t('profile.detailedDescription')}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                            {studentDetails.personality.long_description}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            ) : null}

            {/* Tabs Section */}
            {/* <div className="bg-card border rounded-lg p-4">
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

        
                <TabsContent value="overview">
                  <div className="grid gap-4 md:grid-cols-3">
          
                    <div className="md:col-span-2 border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">{t('profile.aiSummary')}</h3>
                      <p className="mb-2">{t('profile.aiSummary1')}</p>
                      <p className="mb-2">{t('profile.aiSummary2')}</p>
                      <p className="text-muted-foreground">{t('profile.aiSummary3')}</p>
                    </div>
                
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
            
            */}

            </div>
          

          {/* Right Column - Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24 h-[calc(100vh-6rem)] overflow-auto min-w-0">
            {/* Zoom Connection Section - Only show for teachers and admins */}
            {!isStudent(user.user?.role) && (
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
                      onClick={() => {
                        try {
                          localStorage.removeItem("zoom.connected");
                        } catch {}
                        setZoomConnected(false);
                        if (user.user?.teacher) {
                          dispatch(
                            setUser({
                              ...user.user,
                              teacher: {
                                ...user.user.teacher,
                                zoom_connected: false,
                              },
                            }),
                          );
                        }
                      }}
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
            )}
            {/* Skill Graph Section */}
            <div className="bg-card border rounded-lg p-4">
                <div className="h-56 lg:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={displayScores.map((s) => ({ subject: s.label, A: s.value }))} outerRadius={85}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}`} />
                      <ReTooltip formatter={(v: number) => [`% ${v.toFixed(0)}`, t('profile.score')]} />
                      <Radar name={t('profile.score')} dataKey="A" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-3 mt-3 text-xs sm:text-sm text-muted-foreground">
                  {displayScores.map((s) => (
                    <div key={s.key} className="flex items-center gap-1">
                      <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
                      <span>{s.label}: <b>% {s.value.toFixed(0)}</b></span>
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

        {showGraphicTest && (
          <div className="max-w-5xl mx-auto px-8 pb-20 mt-20">
            <Card className="relative overflow-hidden border border-amber-200/60 bg-gradient-to-br from-amber-50 via-white to-rose-50 shadow-xl backdrop-blur">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-16 -right-12 h-56 w-56 rounded-full bg-amber-200/50 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-rose-200/40 blur-3xl" />
                <div className="absolute inset-0 bg-grid-slate-100/40" />
              </div>

              <form className="relative flex flex-col gap-10" onSubmit={handleGraphicTestSubmit}>
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="grid h-14 w-14 place-items-center rounded-xl bg-white/70 text-amber-600 shadow-inner">
                      <Palette className="h-7 w-7" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-semibold text-amber-900 sm:text-3xl">
                        {t('profile.graphicTestTitle')}
                      </h2>
                      <p className="text-sm text-amber-900/80 sm:text-base">
                        {t('profile.graphicTestDescription')}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant="secondary"
                    className="self-start rounded-full border border-amber-200 bg-white/70 text-amber-700 backdrop-blur"
                  >
                    {t('profile.availableForWork')}
                  </Badge>
                </div>

                <div className="grid gap-4">
                  {graphicTestQuestions.map(question => {
                    const answerValue = graphicTestAnswers[question.id];
                    return (
                      <div
                        key={question.id}
                        className="space-y-4 rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <p className="text-sm font-medium text-amber-950 sm:text-base">
                          {question.label}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {(["yes", "no"] as GraphicTestAnswer[]).map(option => {
                            const isActive = answerValue === option;
                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() => handleGraphicTestAnswerChange(question.id, option)}
                                aria-pressed={isActive}
                                className={`rounded-lg border px-5 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                  isActive
                                    ? "border-emerald-500 bg-emerald-500 text-white shadow-md"
                                    : "border-amber-200 bg-white/80 text-amber-950 hover:border-amber-400"
                                }`}
                              >
                                {option === "yes" ? t('common.yes') : t('common.no')}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {graphicTestError && (
                  <p className="text-sm font-medium text-rose-600">{graphicTestError}</p>
                )}

                <div className="flex flex-col items-start gap-2">
                  <Button
                    type="submit"
                    disabled={graphicTestSubmitting}
                    className="bg-amber-500 text-white hover:bg-amber-500/90 px-8"
                  >
                    {graphicTestSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t('common.submit')}
                  </Button>
                  <p className="text-xs text-amber-900/60">
                    {t('profile.graphicTestIncomplete')}
                  </p>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}