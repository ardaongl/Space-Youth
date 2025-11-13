import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Upload, X, FileText, Calendar, Clock, Award } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { apis } from "@/services";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  time: string;
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
    time: "",
    files: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createdCourse, setCreatedCourse] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<File | null>(null);
  const [isUploadingCertificate, setIsUploadingCertificate] = useState(false);

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
      time: "",
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

  const handleSaveAllLessons = async () => {
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
    
    setIsCreating(true);
    
    try {
      // Prepare lessons data for API
      const lessonsData = lessons.map((lesson, index) => {
        // Convert date to ISO 8601 format (date-time)
        let startTime: string;
        if (lesson.date) {
          const timeValue = lesson.time || "00:00";
          const dateTimeString = `${lesson.date}T${timeValue}`;
          const date = new Date(dateTimeString);
          if (Number.isNaN(date.getTime())) {
            startTime = new Date(lesson.date).toISOString();
          } else {
            startTime = date.toISOString();
          }
        } else {
          // If no date, use current date/time
          startTime = new Date().toISOString();
        }

        return {
          title: lesson.title,
          content: lesson.description,
          video_url: "", // TODO: Video URL handling if needed
          order: index + 1,
          duration: lesson.duration ? parseInt(lesson.duration) || 0 : 0,
          start_time: startTime,
        };
      });

      // Prepare course payload
      const coursePayload = {
        title: courseData.title || courseData.name,
        description: courseData.description,
        level: courseData.level,
        labels: courseData.labels || [],
        lessons: lessonsData,
      };

      const response = await apis.course.add_course(coursePayload);
      console.log("Course response:", response);
      if (response.status === 200 || response.status === 201) {
        // Store created course data
        setCreatedCourse(response.data);
        // Clear session storage
        sessionStorage.removeItem("courseData");
      } else {
        alert("Kurs oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Kurs oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsCreating(false);
    }
  };

  const isCurrentLessonValid = currentLesson.title.trim() !== "" && currentLesson.description.trim() !== "";

  const zoomConnected = (() => {
    try { return localStorage.getItem("zoom.connected") === "true"; } catch { return false; }
  })();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleCertificateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedCertificate(e.target.files[0]);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedImage || !createdCourse?.id) {
      alert("Lütfen bir görsel seçin");
      return;
    }

    setIsUploadingImage(true);
    try {
      const response = await apis.course.upload_course_file(
        createdCourse.id,
        selectedImage,
        'image'
      );

      if (response.status === 200) {
        // Build full URL for the uploaded image
        const baseUrl = import.meta.env.VITE_BASE_URL || '';
        const imageUrl = response.data.image_url;
        const fullImageUrl = imageUrl 
          ? (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))
            ? imageUrl
            : (imageUrl.startsWith('/') ? `${baseUrl}${imageUrl}` : `${baseUrl}/${imageUrl}`)
          : null;
        
        // Update course data with new image URL
        setCreatedCourse({
          ...createdCourse,
          image_url: fullImageUrl,
        });
        setSelectedImage(null);
        alert("Kurs fotoğrafı başarıyla yüklendi!");
      } else {
        alert("Fotoğraf yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Fotoğraf yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleUploadCertificate = async () => {
    if (!selectedCertificate || !createdCourse?.id) {
      alert("Lütfen bir sertifika dosyası seçin");
      return;
    }

    setIsUploadingCertificate(true);
    try {
      const response = await apis.course.upload_course_file(
        createdCourse.id,
        selectedCertificate,
        'certificate'
      );

      console.log("Certificate upload response:", response);

      if (response.status === 200 || response.status === 201) {
        // Build full URL for the uploaded certificate
        const baseUrl = import.meta.env.VITE_BASE_URL || '';
        const certUrl = response.data?.image_url || response.data?.certificate_url;
        const fullCertUrl = certUrl 
          ? (certUrl.startsWith('http://') || certUrl.startsWith('https://'))
            ? certUrl
            : (certUrl.startsWith('/') ? `${baseUrl}${certUrl}` : `${baseUrl}/${certUrl}`)
          : null;
        
        // Update course data with new certificate URL
        // API returns image_url for both image and certificate
        setCreatedCourse({
          ...createdCourse,
          certificate_url: fullCertUrl,
        });
        setSelectedCertificate(null);
        alert("Sertifika başarıyla yüklendi!");
      } else {
        console.error("Upload failed:", response);
        const errorMessage = response.data?.error?.message || 
                           response.data?.message || 
                           response.data?.error ||
                           `HTTP ${response.status}: ${response.statusText}`;
        alert(`Sertifika yüklenirken bir hata oluştu: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error uploading certificate:", error);
      alert("Sertifika yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsUploadingCertificate(false);
    }
  };

  // Helper function to build full image URL
  const buildImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    const baseUrl = import.meta.env.VITE_BASE_URL || '';
    // If URL already starts with http:// or https://, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // If URL starts with /, it's already a path, just prepend base URL
    if (url.startsWith('/')) {
      return `${baseUrl}${url}`;
    }
    // Otherwise, add / between base URL and path
    return `${baseUrl}/${url}`;
  };

  // Show success page if course is created
  if (createdCourse) {
    // Filter out teacher's sensitive information
    const { teacher, ...courseData } = createdCourse;
    
    // Build full URLs for images
    courseData.image_url = buildImageUrl(courseData.image_url);
    courseData.certificate_url = buildImageUrl(courseData.certificate_url);
    
    const teacherDisplay = teacher ? {
      name: `${teacher.first_name} ${teacher.last_name}`,
      email: teacher.email,
    } : null;
    
    return (
      <AppLayout>
        <div className="container mx-auto py-6">
          <div className="max-w-5xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-2">Kurs Başarıyla Oluşturuldu!</h1>
              <p className="text-muted-foreground">Kursunuz hazır, şimdi fotoğraf ve sertifika ekleyebilirsiniz.</p>
            </div>

            {/* Course Information Card */}
            <div className="bg-card rounded-lg border shadow-sm p-8 mb-6">
              <h2 className="text-2xl font-bold mb-6">Kurs Bilgileri</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground block mb-1">Kurs Başlığı</label>
                    <p className="text-lg font-medium">{courseData.title}</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-muted-foreground block mb-1">Açıklama</label>
                    <p className="text-base text-muted-foreground">{courseData.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground block mb-1">Seviye</label>
                    <p className="text-base capitalize">{courseData.level}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground block mb-1">Toplam Süre</label>
                    <p className="text-base">{courseData.duration} dakika</p>
                  </div>
                  {teacherDisplay && (
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground block mb-1">Öğretmen</label>
                      <p className="text-base">{teacherDisplay.name}</p>
                      <p className="text-sm text-muted-foreground">{teacherDisplay.email}</p>
                    </div>
                  )}
                </div>
              </div>

              {courseData.labels && courseData.labels.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <label className="text-sm font-semibold text-muted-foreground mb-2 block">Etiketler</label>
                  <div className="flex flex-wrap gap-2">
                    {courseData.labels.map((label: any) => (
                      <span key={label.id} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {label.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* File Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Image Upload Section */}
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Kurs Fotoğrafı
                </h2>
                
                {courseData.image_url ? (
                  <div className="space-y-4">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                      <img 
                        src={courseData.image_url} 
                        alt={courseData.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">Kurs fotoğrafı yüklendi.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="course-image-upload"
                      />
                      <label
                        htmlFor="course-image-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          {selectedImage ? selectedImage.name : "Kurs fotoğrafı seçin"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, GIF
                        </p>
                      </label>
                    </div>

                    {selectedImage && (
                      <div className="space-y-3">
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                          <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          onClick={handleUploadImage}
                          disabled={isUploadingImage}
                          className="w-full"
                        >
                          {isUploadingImage ? "Yükleniyor..." : "Fotoğrafı Yükle"}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Certificate Upload Section */}
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Sertifika
                </h2>
                
                {courseData.certificate_url ? (
                  <div className="space-y-4">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                      <div className="text-center">
                        <Award className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm font-medium">Sertifika yüklendi</p>
                        <a
                          href={courseData.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline mt-2 inline-block"
                        >
                          Sertifikayı Görüntüle
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,image/*"
                        onChange={handleCertificateSelect}
                        className="hidden"
                        id="certificate-upload"
                      />
                      <label
                        htmlFor="certificate-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <Award className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          {selectedCertificate ? selectedCertificate.name : "Sertifika dosyası seçin"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, DOC, DOCX, Resim
                        </p>
                      </label>
                    </div>

                    {selectedCertificate && (
                      <div className="space-y-3">
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm font-medium">{selectedCertificate.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {(selectedCertificate.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <Button
                          onClick={handleUploadCertificate}
                          disabled={isUploadingCertificate}
                          className="w-full"
                        >
                          {isUploadingCertificate ? "Yükleniyor..." : "Sertifikayı Yükle"}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Lessons Section */}
            {courseData.lessons && courseData.lessons.length > 0 && (
              <div className="bg-card rounded-lg border shadow-sm p-8 mb-6">
                <h2 className="text-2xl font-bold mb-6">Dersler ({courseData.lessons.length})</h2>
                <div className="space-y-3">
                  {courseData.lessons.map((lesson: any, index: number) => (
                    <div key={lesson.id} className="border rounded-lg p-4 hover:bg-muted/50 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                              {index + 1}
                            </span>
                            <div>
                              <p className="font-semibold text-lg">{lesson.title}</p>
                              <p className="text-sm text-muted-foreground">{lesson.content}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {lesson.duration} dakika
                            </span>
                            {lesson.zoom_start_time && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(lesson.zoom_start_time).toLocaleDateString('tr-TR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                        {lesson.zoom_join_url && (
                          <a
                            href={lesson.zoom_join_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium whitespace-nowrap"
                          >
                            Zoom'a Katıl
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/courses")}
                className="flex-1"
                size="lg"
              >
                Kurslara Dön
              </Button>
              <Button
                onClick={() => {
                  setCreatedCourse(null);
                  setLessons([]);
                  navigate("/courses/add");
                }}
                className="flex-1"
                size="lg"
              >
                Yeni Kurs Ekle
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

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
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold">
                    {t('lessons.lessonTitle')} <span className="text-red-500">*</span>
                  </label>
                  <span className={`text-xs ${
                    currentLesson.title.length > 100 
                      ? 'text-red-500' 
                      : 'text-muted-foreground'
                  }`}>
                    {currentLesson.title.length}/100
                  </span>
                </div>
                <Input
                  type="text"
                  value={currentLesson.title}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 100) {
                      setCurrentLesson({ ...currentLesson, title: value });
                    }
                  }}
                  placeholder={t('lessons.enterLessonTitle')}
                  maxLength={100}
                  className="w-full"
                />
              </div>

              {/* Lesson Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold">
                    {t('lessons.lessonDescription')} <span className="text-red-500">*</span>
                  </label>
                  <span className={`text-xs ${
                    currentLesson.description.length > 500 
                      ? 'text-red-500' 
                      : 'text-muted-foreground'
                  }`}>
                    {currentLesson.description.length}/500
                  </span>
                </div>
                <textarea
                  value={currentLesson.description}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 500) {
                      setCurrentLesson({ ...currentLesson, description: value });
                    }
                  }}
                  placeholder={t('lessons.enterLessonDescription')}
                  rows={4}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              {/* Lesson Duration and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {t('lessons.lessonDuration')}
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min="0"
                      max="999"
                      value={currentLesson.duration}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Sadece pozitif sayıları kabul et ve maksimum 3 haneli
                        if (value === '' || (/^\d+$/.test(value) && value.length <= 3)) {
                          setCurrentLesson({ ...currentLesson, duration: value });
                        }
                      }}
                      onKeyDown={(e) => {
                        // e, E, +, -, . karakterlerini engelle
                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-' || e.key === '.') {
                          e.preventDefault();
                        }
                      }}
                      placeholder={t('lessons.enterLessonDuration')}
                      className="pl-10"
                      maxLength={3}
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
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {t('lessons.lessonTime')}
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      value={currentLesson.time}
                      onChange={(e) => setCurrentLesson({ ...currentLesson, time: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
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
                            {lesson.time && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {lesson.time}
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
                disabled={lessons.length === 0 || isCreating}
                className="w-full"
                size="lg"
              >
                {isCreating ? "Oluşturuluyor..." : "Kurs Oluştur"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
