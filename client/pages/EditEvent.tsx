import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Coins, Calendar, MapPin, Users2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { isAdmin } from "@/utils/roles";
import { useLanguage } from "@/context/LanguageContext";

type EventType = "workshop" | "hackathon";

export default function EditEvent() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { auth } = useAuth();
  const { t } = useLanguage();
  
  const [eventType, setEventType] = useState<EventType>("workshop");
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [price, setPrice] = useState("");
  const [isPaid, setIsPaid] = useState(true);

  const adminUser = isAdmin(auth.user?.role);

  useEffect(() => {
    // Load event data - in real app, fetch from API
    // Mock data for now based on slug
    const type: EventType = slug?.startsWith("workshop") ? "workshop" : "hackathon";
    setEventType(type);
    
    if (type === "workshop") {
      setEventName("UX Research Fundamentals");
      setEventDescription("Workshop'lar, karmaşık problemleri çözmek ve yenilikçi çözümler üretmek için güçlü araçlardır.");
      setOrganizerName("Emily Parker");
      setEventDate("2024-03-20T10:00");
      setEventLocation("Online - Zoom");
      setMaxParticipants("50");
      setPrice("150");
      setIsPaid(true);
    } else {
      setEventName("AI Hackathon 2024");
      setEventDescription("48 saatlik yoğun bir kodlama maratonu! Yapay zeka ve makine öğrenmesi alanında yenilikçi projeler geliştirin.");
      setOrganizerName("Tech Community");
      setEventDate("2024-03-25T10:00");
      setEventLocation("TechHub Istanbul");
      setMaxParticipants("150");
      setPrice("0");
      setIsPaid(false);
    }
  }, [slug]);

  if (!adminUser) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t('common.unauthorizedAccess')}</h1>
            <p className="text-muted-foreground mb-4">{t('common.noAccessRights')}</p>
            <Button onClick={() => navigate('/workshops')}>{t('common.backToEvents')}</Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const handleSave = () => {
    const eventData = {
      type: eventType,
      name: eventName,
      description: eventDescription,
      organizer: organizerName,
      date: eventDate,
      location: eventLocation,
      maxParticipants: parseInt(maxParticipants) || 0,
      price: isPaid ? parseInt(price) : 0,
      isPaid,
    };

    console.log("Saving event:", eventData);
    // TODO: Send to API

    navigate('/workshops');
  };

  const isValid = 
    eventName.trim() !== "" && 
    eventDescription.trim() !== "" &&
    organizerName.trim() !== "" &&
    eventDate !== "" &&
    eventLocation.trim() !== "" &&
    maxParticipants !== "" &&
    (!isPaid || price.trim() !== "");

  const eventTypeLabel = eventType === "workshop" ? t('events.workshop') : t('events.hackathon');

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
              <div className="flex items-center gap-3 mb-3">
                <span className={`inline-flex items-center gap-2 rounded-full text-sm font-semibold px-4 py-2 border ${
                  eventType === "workshop" 
                    ? "bg-blue-100 text-blue-800 border-blue-200" 
                    : "bg-purple-100 text-purple-800 border-purple-200"
                }`}>
{eventType === "workshop" ? "🎯 Workshop" : "💻 Hackathon"}
                </span>
              </div>
              <h1 className="text-3xl font-bold">{eventTypeLabel} {t('common.edit')} ({t('common.admin')})</h1>
              <p className="text-muted-foreground mt-2">
                {t('events.editEventInfo')}
              </p>
            </div>

            <div className="space-y-6">
              {/* Event Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t('events.eventName')} <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder={t('events.enterEventName')}
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

              {/* Event Details Grid */}
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
                    {t('events.maxParticipants')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Users2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={maxParticipants}
                      onChange={(e) => setMaxParticipants(e.target.value)}
                      placeholder={t('events.enterMaxParticipants')}
                      min="1"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">{t('events.pricing')}</h2>
                
                {/* Price Type */}
                <div className="space-y-3 mb-4">
                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition">
                    <input
                      type="radio"
                      name="priceType"
                      checked={isPaid}
                      onChange={() => setIsPaid(true)}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{t('events.paidEvent')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('events.paidEventDescription')}
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition">
                    <input
                      type="radio"
                      name="priceType"
                      checked={!isPaid}
                      onChange={() => setIsPaid(false)}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{t('events.freeEvent')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('events.freeEventDescription')}
                      </p>
                    </div>
                  </label>
                </div>

                {/* Price Input */}
                {isPaid && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {t('events.participationFee')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-yellow-600" />
                      <Input
                        type="number"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder={t('events.pricePlaceholder')}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
{t('events.priceDescription')}
                    </p>
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold mb-3">{t('common.preview')}</h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${
                          eventType === "workshop" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-purple-100 text-purple-800"
                        }`}>
{eventType === "workshop" ? t('events.workshop') : t('events.hackathon')}
                        </span>
                      </div>
                      <h4 className="font-semibold text-lg">{eventName || t('events.eventName')}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {organizerName || t('events.organizer')}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {eventDescription || t('events.eventDescription')}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                        {eventDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(eventDate).toLocaleDateString("tr-TR")}
                          </span>
                        )}
                        {eventLocation && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {eventLocation}
                          </span>
                        )}
                        {maxParticipants && (
                          <span className="flex items-center gap-1">
                            <Users2 className="h-4 w-4" />
{t('events.participantCount', { count: maxParticipants })}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {isPaid ? (
                        <div className="flex items-center gap-2">
                          <Coins className="h-5 w-5 text-yellow-600" />
                          <span className="text-xl font-bold text-yellow-600">
                            {price || "0"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-green-600">{t('common.free')}</span>
                      )}
                    </div>
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
                  onClick={handleSave}
                  disabled={!isValid}
                  size="lg"
                >
{t('common.saveChanges')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

