import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload, X, Image as ImageIcon, Video } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AddCourse() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [achievements, setAchievements] = useState<string[]>([""]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

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
      description: courseDescription,
      achievements: achievements.filter(a => a.trim() !== ""),
      photos,
      videos,
    };
    
    // Store in sessionStorage for now
    sessionStorage.setItem("courseData", JSON.stringify({
      ...courseData,
      photoNames: photos.map(p => p.name),
      videoNames: videos.map(v => v.name),
    }));

    navigate("/courses/add/lessons");
  };

  const isValid = courseName.trim() !== "" && courseDescription.trim() !== "";

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

              {/* Achievements */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t('courses.achievements')}
                </label>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="text"
                        value={achievement}
                        onChange={(e) => handleAchievementChange(index, e.target.value)}
                        placeholder={t('courses.achievement', { number: index + 1 })}
                        className="flex-1"
                      />
                      {achievements.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveAchievement(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddAchievement}
                    className="w-full"
                  >
                    + {t('courses.addAchievement')}
                  </Button>
                </div>
              </div>

              {/* File Upload - Photo and Video side by side */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t('courses.addFiles')}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Photo Upload */}
                  <div>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                        <p className="text-sm font-medium">{t('courses.uploadPhotos')}</p>
                        <p className="text-xs text-muted-foreground">
                          {t('courses.photoFormats')}
                        </p>
                      </label>
                    </div>

                    {photos.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        {photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`Photo ${index + 1}`}
                              className="w-full aspect-video object-cover rounded-lg"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition h-6 w-6"
                              onClick={() => handleRemovePhoto(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Video Upload */}
                  <div>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="video/*"
                        multiple
                        onChange={handleVideoUpload}
                        className="hidden"
                        id="video-upload"
                      />
                      <label
                        htmlFor="video-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <Video className="h-10 w-10 text-muted-foreground" />
                        <p className="text-sm font-medium">{t('courses.uploadVideos')}</p>
                        <p className="text-xs text-muted-foreground">
                          {t('courses.videoFormats')}
                        </p>
                      </label>
                    </div>

                    {videos.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {videos.map((video, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Video className="h-5 w-5 text-muted-foreground" />
                              <span className="text-sm font-medium">{video.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveVideo(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
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
