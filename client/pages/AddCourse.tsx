import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload, X, Image as ImageIcon, Video } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { apis } from "@/services";

interface Label {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export default function AddCourse() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [achievements, setAchievements] = useState<string[]>([""]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<number[]>([]);
  const [loadingLabels, setLoadingLabels] = useState(false);
  const [level, setLevel] = useState<string>("");
  const [registrationDeadline, setRegistrationDeadline] = useState<string>("");

  useEffect(() => {
    const fetchLabels = async () => {
      setLoadingLabels(true);
      try {
        const response = await apis.label.get_labels();
        console.log(response);
        if (response.status === 200 && response.data) {
          setLabels(response.data);
        }
      } catch (error) {
        console.error("Error fetching labels:", error);
      } finally {
        setLoadingLabels(false);
      }
    };
    fetchLabels();
  }, []);

  const handleLabelToggle = (labelId: number) => {
    setSelectedLabels(prev => 
      prev.includes(labelId)
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    );
  };

  const handleAddAchievement = () => {
    setAchievements([...achievements, ""]);
  };

  const handleRemoveAchievement = (index: number) => {
    const newAchievements = achievements.filter((_, i) => i !== index);
    setAchievements(newAchievements);
  };

  const handleAchievementChange = (index: number, value: string) => {
    const newAchievements = [...achievements];
    newAchievements[index] = value;
    setAchievements(newAchievements);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos([...photos, ...Array.from(e.target.files)]);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideos([...videos, ...Array.from(e.target.files)]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    // Store course data in session/state and navigate to lessons page
    const courseData = {
      name: courseName,
      title: courseName,
      description: courseDescription,
      level: level,
      registration_deadline: registrationDeadline,
      achievements: achievements.filter(a => a.trim() !== ""),
      photos,
      videos,
      labels: selectedLabels,
    };
    
    // Store in sessionStorage for now
    sessionStorage.setItem("courseData", JSON.stringify({
      ...courseData,
      photoNames: photos.map(p => p.name),
      videoNames: videos.map(v => v.name),
    }));

    navigate("/courses/add/lessons");
  };

  const isValid = courseName.trim() !== "" && courseDescription.trim() !== "" && level !== "" && registrationDeadline !== "";

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate('/courses')}
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg border shadow-sm p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">{t('courses.addCourse')}</h1>
              <p className="text-muted-foreground mt-2">{t('courses.step1Info')}</p>
            </div>

            <div className="space-y-6">
              {/* Course Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t('courses.courseTitle')} <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder={t('courses.enterCourseTitle')}
                  className="w-full"
                />
              </div>

              {/* Course Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t('courses.description')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  placeholder={t('courses.enterDescription')}
                  rows={6}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              {/* Level Selection */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t('courses.level')} <span className="text-red-500">*</span>
                </label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('courses.selectLevel')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">{t('courses.levelEasy')}</SelectItem>
                    <SelectItem value="medium">{t('courses.levelMedium')}</SelectItem>
                    <SelectItem value="hard">{t('courses.levelHard')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Registration Deadline */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Son Kayıt Tarihi <span className="text-red-500">*</span>
                </label>
                <Input
                  type="datetime-local"
                  value={registrationDeadline}
                  onChange={(e) => setRegistrationDeadline(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Son kayıt tarihi, en erken dersin başlangıç tarihinden önce olmalıdır.
                </p>
              </div>

              {/* Labels Selection */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t('courses.labels') || 'Etiketler'}
                </label>
                {loadingLabels ? (
                  <p className="text-muted-foreground text-sm">{t('common.loading') || 'Yükleniyor...'}</p>
                ) : labels.length === 0 ? (
                  <p className="text-muted-foreground text-sm">{t('courses.noLabels') || 'Etiket bulunamadı'}</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-input rounded-md bg-background">
                    {labels.map((label) => (
                      <div key={label.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`label-${label.id}`}
                          checked={selectedLabels.includes(label.id)}
                          onCheckedChange={() => handleLabelToggle(label.id)}
                        />
                        <label
                          htmlFor={`label-${label.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {label.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => navigate('/courses')}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  onClick={handleContinue}
                  disabled={!isValid}
                  size="lg"
                >
                  {t('common.continue')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
