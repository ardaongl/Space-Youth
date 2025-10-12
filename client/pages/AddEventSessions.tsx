import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Upload, X, FileText, Calendar, Clock } from "lucide-react";

interface Session {
  id: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  files: File[];
}

export default function AddEventSessions() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session>({
    id: crypto.randomUUID(),
    title: "",
    description: "",
    duration: "",
    date: "",
    files: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [eventData, setEventData] = useState<any>(null);

  useEffect(() => {
    // Check if event data exists
    const eventDataStr = sessionStorage.getItem("eventData");
    if (!eventDataStr) {
      navigate("/events/add");
    } else {
      setEventData(JSON.parse(eventDataStr));
    }
  }, [navigate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCurrentSession({
        ...currentSession,
        files: [...currentSession.files, ...Array.from(e.target.files)],
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    setCurrentSession({
      ...currentSession,
      files: currentSession.files.filter((_, i) => i !== index),
    });
  };

  const handleAddSession = () => {
    if (currentSession.title.trim() === "" || currentSession.description.trim() === "") {
      alert("Lütfen oturum başlığı ve açıklamasını doldurun");
      return;
    }

    if (isEditing && editingIndex !== null) {
      // Update existing session
      const updatedSessions = [...sessions];
      updatedSessions[editingIndex] = currentSession;
      setSessions(updatedSessions);
      setIsEditing(false);
      setEditingIndex(null);
    } else {
      // Add new session
      setSessions([...sessions, currentSession]);
    }

    // Reset form
    setCurrentSession({
      id: crypto.randomUUID(),
      title: "",
      description: "",
      duration: "",
      date: "",
      files: [],
    });
  };

  const handleEditSession = (index: number) => {
    setCurrentSession(sessions[index]);
    setIsEditing(true);
    setEditingIndex(index);
  };

  const handleDeleteSession = (index: number) => {
    setSessions(sessions.filter((_, i) => i !== index));
  };

  const handleSaveAllSessions = () => {
    if (sessions.length === 0) {
      alert("En az bir oturum eklemelisiniz");
      return;
    }

    // Get event data from session
    const eventDataStr = sessionStorage.getItem("eventData");
    if (!eventDataStr) {
      navigate("/events/add");
      return;
    }

    const eventData = JSON.parse(eventDataStr);
    
    // Combine event data with sessions
    const fullEventData = {
      ...eventData,
      sessions: sessions.map(session => ({
        ...session,
        fileNames: session.files.map(f => f.name),
      })),
    };

    console.log("Complete event data:", fullEventData);
    // TODO: Send to API

    // Clear session storage
    sessionStorage.removeItem("eventData");
    
    // Navigate back to workshops
    navigate("/workshops");
  };

  const isCurrentSessionValid = currentSession.title.trim() !== "" && currentSession.description.trim() !== "";

  const zoomConnected = (() => {
    try { return localStorage.getItem("zoom.connected") === "true"; } catch { return false; }
  })();

  const eventType = eventData?.type || "workshop";
  const eventTypeLabel = eventType === "workshop" ? "Workshop" : "Hackathon";
  const sessionLabel = eventType === "workshop" ? "Oturum" : "Etkinlik Günü";

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate('/events/add')}
        >
          <ArrowLeft className="h-4 w-4" />
          Geri Dön
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Yeni {eventTypeLabel} Ekle</h1>
          <p className="text-muted-foreground mt-2">Adım 2/2: {sessionLabel} Oluşturma</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-6">
          {/* Left Side - Session Form */}
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">
              {isEditing ? `${sessionLabel} Düzenle` : `Yeni ${sessionLabel} Ekle`}
            </h2>

            <div className="space-y-6">
              {/* Session Title */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {sessionLabel} Başlığı <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={currentSession.title}
                  onChange={(e) => setCurrentSession({ ...currentSession, title: e.target.value })}
                  placeholder={eventType === "workshop" ? "Örn: Kullanıcı Araştırması Temelleri" : "Örn: Gün 1 - Takım Oluşturma ve Planlama"}
                  className="w-full"
                />
              </div>

              {/* Session Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {sessionLabel} Konusu/Açıklaması <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={currentSession.description}
                  onChange={(e) => setCurrentSession({ ...currentSession, description: e.target.value })}
                  placeholder={`${sessionLabel} içeriği hakkında detaylı bilgi verin...`}
                  rows={4}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              {/* Session Duration and Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {sessionLabel} Süresi
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      value={currentSession.duration}
                      onChange={(e) => setCurrentSession({ ...currentSession, duration: e.target.value })}
                      placeholder={eventType === "workshop" ? "Örn: 45 dakika" : "Örn: 8 saat"}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {sessionLabel} Tarihi
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="datetime-local"
                      value={currentSession.date}
                      onChange={(e) => setCurrentSession({ ...currentSession, date: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {sessionLabel}'a Eklenecek Dosyalar
                </label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="session-file-upload"
                  />
                  <label
                    htmlFor="session-file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <p className="text-sm font-medium">Dosya Yükle</p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOC, PPT ve diğer dosyaları yükleyebilirsiniz
                    </p>
                  </label>
                </div>

                {currentSession.files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {currentSession.files.map((file, index) => (
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

              {/* Add/Update Session Button */}
              <Button
                onClick={handleAddSession}
                disabled={!isCurrentSessionValid}
                className="w-full"
                size="lg"
              >
                {isEditing ? `${sessionLabel} Güncelle` : `${sessionLabel} Ekle`}
              </Button>
            </div>
          </div>

          {/* Right Side - Created Sessions */}
          <div className="space-y-4">
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Oluşturulan {sessionLabel}lar</h3>
                <span className="text-sm text-muted-foreground">
                  {sessions.length} {sessionLabel.toLowerCase()}
                </span>
              </div>

              {sessions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">Henüz {sessionLabel.toLowerCase()} eklenmedi</p>
                  <p className="text-xs mt-1">Soldaki formu kullanarak {sessionLabel.toLowerCase()} ekleyin</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {sessions.map((session, index) => (
                    <div
                      key={session.id}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">
                            {index + 1}. {session.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {session.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            {session.duration && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {session.duration}
                              </span>
                            )}
                            {session.date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(session.date).toLocaleDateString('tr-TR')}
                              </span>
                            )}
                            {session.files.length > 0 && (
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {session.files.length} dosya
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSession(index)}
                          className="flex-1"
                        >
                          Düzenle
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteSession(index)}
                          className="flex-1"
                        >
                          Sil
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
              {eventType === "workshop" && (
                <div className={`p-3 rounded-lg text-sm ${
                  zoomConnected 
                    ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800" 
                    : "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                }`}>
                  {zoomConnected 
                    ? "📹 Oturumlar için otomatik Zoom linkleri oluşturulacaktır" 
                    : "⚠️ Zoom bağlanmadan link oluşturulamaz. Lütfen önce profilinizden Zoom hesabınızı bağlayın."}
                </div>
              )}
              
              <Button
                onClick={handleSaveAllSessions}
                disabled={sessions.length === 0}
                className="w-full"
                size="lg"
              >
                Tüm {sessionLabel}ları Kaydet
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

