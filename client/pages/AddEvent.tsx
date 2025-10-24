import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload, X, Image as ImageIcon, Video, Calendar, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type EventType = "workshop" | "hackathon";

export default function AddEvent() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [eventType, setEventType] = useState<EventType>("workshop");
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
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
    eventLocation.trim() !== "";

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
          {t('common.back')}
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg border shadow-sm p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">{t('events.addNewEvent')}</h1>
              <p className="text-muted-foreground mt-2">{t('events.step1Info')}</p>
            </div>

            <div className="space-y-6">
              {/* Event Type Selection */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  {t('events.eventType')} <span className="text-red-500">*</span>
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
                    <div className="font-semibold">{t('workshops.workshop')}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t('workshops.workshopSubtitle')}
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
                    <div className="font-semibold">{t('workshops.hackathon')}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t('workshops.hackathonSubtitle')}
                    </div>
                  </button>
                </div>
              </div>

              {/* Event Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {eventType === "workshop" ? t('workshops.workshop') : t('workshops.hackathon')} {t('events.eventName')} <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder={eventType === "workshop" ? t('events.workshopTitlePlaceholder') : t('events.hackathonTitlePlaceholder')}
                  className="w-full"
                />
              </div>

              {/* Event Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t('events.eventDescription')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder={t('events.enterEventDescription')}
                  rows={6}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              {/* Organizer Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t('events.organizerName')} <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  placeholder={t('events.enterOrganizerName')}
                  className="w-full"
                />
              </div>

              {/* Event Date, Location, and Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {t('events.eventDate')} <span className="text-red-500">*</span>
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
                    {t('events.location')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      placeholder={t('events.enterLocation')}
                      className="pl-10"
                    />
                  </div>
                </div>


                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {t('events.participationFee')}
                  </label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder={t('events.pricePlaceholder')}
                    min="0"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Achievements */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t('events.achievements')}
                </label>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="text"
                        value={achievement}
                        onChange={(e) => handleAchievementChange(index, e.target.value)}
                        placeholder={t('events.achievement', { number: index + 1 })}
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
                    + {t('events.addAchievement')}
                  </Button>
                </div>
              </div>

              {/* File Upload - Photo and Video side by side */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t('events.addFiles')}
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
                        <p className="text-sm font-medium">{t('events.uploadPhotos')}</p>
                        <p className="text-xs text-muted-foreground">
                          {t('events.photoFormats')}
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
                        <p className="text-sm font-medium">{t('events.uploadVideos')}</p>
                        <p className="text-xs text-muted-foreground">
                          {t('events.videoFormats')}
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

