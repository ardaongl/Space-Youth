import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload, X, Image as ImageIcon, Video, Calendar, MapPin, Users2 } from "lucide-react";

type EventType = "workshop" | "hackathon";

export default function AddEvent() {
  const navigate = useNavigate();
  const [eventType, setEventType] = useState<EventType>("workshop");
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [price, setPrice] = useState("");
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
    // Store event data in session/state and navigate to sessions page
    const eventData = {
      type: eventType,
      name: eventName,
      description: eventDescription,
      organizer: organizerName,
      date: eventDate,
      location: eventLocation,
      maxParticipants: parseInt(maxParticipants) || 0,
      price: parseInt(price) || 0,
      achievements: achievements.filter(a => a.trim() !== ""),
      photos,
      videos,
    };
    
    // Store in sessionStorage for now
    sessionStorage.setItem("eventData", JSON.stringify({
      ...eventData,
      photoNames: photos.map(p => p.name),
      videoNames: videos.map(v => v.name),
    }));

    navigate("/events/add/sessions");
  };

  const isValid = 
    eventName.trim() !== "" && 
    eventDescription.trim() !== "" &&
    organizerName.trim() !== "" &&
    eventDate !== "" &&
    eventLocation.trim() !== "" &&
    maxParticipants !== "";

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

        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg border shadow-sm p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Yeni Etkinlik Ekle</h1>
              <p className="text-muted-foreground mt-2">Adım 1/2: Etkinlik Bilgileri</p>
            </div>

            <div className="space-y-6">
              {/* Event Type Selection */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Etkinlik Tipi <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setEventType("workshop")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      eventType === "workshop"
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="font-semibold">Workshop</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Uygulamalı öğrenme ve beceri geliştirme
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setEventType("hackathon")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      eventType === "hackathon"
                        ? "border-purple-500 bg-purple-50 text-purple-900"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="text-2xl mb-2">💻</div>
                    <div className="font-semibold">Hackathon</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Yoğun kodlama maratonu ve yarışma
                    </div>
                  </button>
                </div>
              </div>

              {/* Event Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {eventType === "workshop" ? "Workshop" : "Hackathon"} Adı <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder={eventType === "workshop" ? "Örn: UX Research Fundamentals" : "Örn: AI Hackathon 2024"}
                  className="w-full"
                />
              </div>

              {/* Event Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Etkinlik Açıklaması <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Etkinliğiniz hakkında detaylı bilgi verin..."
                  rows={6}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              {/* Organizer Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Organizatör Adı <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  placeholder="Örn: Tech Community"
                  className="w-full"
                />
              </div>

              {/* Event Date, Location, and Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Etkinlik Tarihi <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="datetime-local"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Konum <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      placeholder="Örn: TechHub Istanbul veya Online - Zoom"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Maksimum Katılımcı <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Users2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={maxParticipants}
                      onChange={(e) => setMaxParticipants(e.target.value)}
                      placeholder="Örn: 50"
                      min="1"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Katılım Ücreti (Coins)
                  </label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Örn: 150 (ücretsiz için 0)"
                    min="0"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Achievements */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Etkinlik Sonunda Kazanılacaklar
                </label>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="text"
                        value={achievement}
                        onChange={(e) => handleAchievementChange(index, e.target.value)}
                        placeholder={`Kazanım ${index + 1}`}
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
                    + Kazanım Ekle
                  </Button>
                </div>
              </div>

              {/* File Upload - Photo and Video side by side */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Medya Ekle
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
                        <p className="text-sm font-medium">Fotoğraf Yükle</p>
                        <p className="text-xs text-muted-foreground">
                          JPG, PNG formatlarında yükleyebilirsiniz
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
                        <p className="text-sm font-medium">Video Yükle</p>
                        <p className="text-xs text-muted-foreground">
                          MP4, MOV formatlarında yükleyebilirsiniz
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
                  onClick={() => navigate('/workshops')}
                >
                  İptal
                </Button>
                <Button
                  onClick={handleContinue}
                  disabled={!isValid}
                  size="lg"
                >
                  Devam Et
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

