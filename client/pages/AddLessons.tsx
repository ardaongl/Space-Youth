import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Upload, X, FileText, Calendar, Clock, Award } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  files: File[];
}

export default function AddLessons() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson>({
    id: crypto.randomUUID(),
    title: "",
    description: "",
    duration: "",
    date: "",
    files: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);

  useEffect(() => {
    // Check if course data exists
    const courseData = sessionStorage.getItem("courseData");
    if (!courseData) {
      navigate("/courses/add");
    }
  }, [navigate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCurrentLesson({
        ...currentLesson,
        files: [...currentLesson.files, ...Array.from(e.target.files)],
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    setCurrentLesson({
      ...currentLesson,
      files: currentLesson.files.filter((_, i) => i !== index),
    });
  };

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCertificateFile(e.target.files[0]);
    }
  };

  const handleRemoveCertificate = () => {
    setCertificateFile(null);
  };

  const handleAddLesson = () => {
    if (currentLesson.title.trim() === "" || currentLesson.description.trim() === "") {
      alert("Lütfen ders başlığı ve açıklamasını doldurun");
      return;
    }

    if (isEditing && editingIndex !== null) {
      // Update existing lesson
      const updatedLessons = [...lessons];
      updatedLessons[editingIndex] = currentLesson;
      setLessons(updatedLessons);
      setIsEditing(false);
      setEditingIndex(null);
    } else {
      // Add new lesson
      setLessons([...lessons, currentLesson]);
    }

    // Reset form
    setCurrentLesson({
      id: crypto.randomUUID(),
      title: "",
      description: "",
      duration: "",
      date: "",
      files: [],
    });
  };

  const handleEditLesson = (index: number) => {
    setCurrentLesson(lessons[index]);
    setIsEditing(true);
    setEditingIndex(index);
  };

  const handleDeleteLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const handleSaveAllLessons = () => {
    if (lessons.length === 0) {
      alert("En az bir ders eklemelisiniz");
      return;
    }

    // Get course data from session
    const courseDataStr = sessionStorage.getItem("courseData");
    if (!courseDataStr) {
      navigate("/courses/add");
      return;
    }

    const courseData = JSON.parse(courseDataStr);
    
    // Combine course data with lessons
    const fullCourseData = {
      ...courseData,
      lessons: lessons.map(lesson => ({
        ...lesson,
        fileNames: lesson.files.map(f => f.name),
      })),
      certificateFile: certificateFile,
      certificateFileName: certificateFile?.name,
    };

    console.log("Complete course data:", fullCourseData);
    // TODO: Send to API

    // Clear session storage
    sessionStorage.removeItem("courseData");
    
    // Navigate back to courses
    navigate("/courses");
  };

  const isCurrentLessonValid = currentLesson.title.trim() !== "" && currentLesson.description.trim() !== "";

  const zoomConnected = (() => {
    try { return localStorage.getItem("zoom.connected") === "true"; } catch { return false; }
  })();


  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate('/courses/add')}
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">{t('courses.addCourse')}</h1>
          <p className="text-muted-foreground mt-2">{t('courses.step2Info')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-6">
          {/* Left Side - Lesson Form */}
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">
              {isEditing ? t('lessons.editLesson') : t('lessons.addNewLesson')}
            </h2>

            <div className="space-y-6">
              {/* Lesson Title */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t('lessons.lessonTitle')} <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={currentLesson.title}
                  onChange={(e) => setCurrentLesson({ ...currentLesson, title: e.target.value })}
                  placeholder={t('lessons.enterLessonTitle')}
                  className="w-full"
                />
              </div>

              {/* Lesson Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t('lessons.lessonDescription')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={currentLesson.description}
                  onChange={(e) => setCurrentLesson({ ...currentLesson, description: e.target.value })}
                  placeholder={t('lessons.enterLessonDescription')}
                  rows={4}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              {/* Lesson Duration and Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {t('lessons.lessonDuration')}
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      value={currentLesson.duration}
                      onChange={(e) => setCurrentLesson({ ...currentLesson, duration: e.target.value })}
                      placeholder={t('lessons.enterLessonDuration')}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {t('lessons.lessonDate')}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={currentLesson.date}
                      onChange={(e) => setCurrentLesson({ ...currentLesson, date: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t('lessons.addFiles')}
                </label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="lesson-file-upload"
                  />
                  <label
                    htmlFor="lesson-file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <p className="text-sm font-medium">{t('lessons.uploadFiles')}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('lessons.fileFormats')}
                    </p>
                  </label>
                </div>

                {currentLesson.files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {currentLesson.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add/Update Lesson Button */}
              <Button
                onClick={handleAddLesson}
                disabled={!isCurrentLessonValid}
                className="w-full"
                size="lg"
              >
                {isEditing ? t('lessons.updateLesson') : t('lessons.addLesson')}
              </Button>
            </div>
          </div>

          {/* Right Side - Created Lessons */}
          <div className="space-y-4">
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{t('lessons.createdLessons')}</h3>
                <span className="text-sm text-muted-foreground">
                  {lessons.length} {t('lessons.lessons')}
                </span>
              </div>

              {lessons.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">{t('lessons.noLessons')}</p>
                  <p className="text-xs mt-1">{t('lessons.addFirstLesson')}</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">
                            {index + 1}. {lesson.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {lesson.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            {lesson.duration && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {lesson.duration}
                              </span>
                            )}
                            {lesson.date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(lesson.date).toLocaleDateString('tr-TR')}
                              </span>
                            )}
                            {lesson.files.length > 0 && (
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {lesson.files.length} {t('lessons.files')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditLesson(index)}
                          className="flex-1"
                        >
                          {t('common.edit')}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteLesson(index)}
                          className="flex-1"
                        >
                          {t('common.delete')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Certificate Upload */}
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5" />
                {t('lessons.certificateUpload')}
              </h3>
              
              {!certificateFile ? (
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCertificateUpload}
                    className="hidden"
                    id="certificate-upload"
                  />
                  <label
                    htmlFor="certificate-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Award className="h-10 w-10 text-muted-foreground" />
                    <p className="text-sm font-medium">{t('lessons.uploadCertificate')}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('lessons.certificateFormats')}
                    </p>
                  </label>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{certificateFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(certificateFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveCertificate}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Zoom Info and Save Button */}
            <div className="space-y-3">
              {/* Zoom notification */}
              <div className={`p-3 rounded-lg text-sm ${
                zoomConnected 
                  ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800" 
                  : "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
              }`}>
                {zoomConnected 
                  ? t('lessons.zoomConnected') 
                  : t('lessons.zoomNotConnected')}
              </div>
              
              <Button
                onClick={handleSaveAllLessons}
                disabled={lessons.length === 0}
                className="w-full"
                size="lg"
              >
                {t('lessons.saveAllLessons')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
