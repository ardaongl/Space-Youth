import { Bell, GraduationCap } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

// Mock bildirim verisi - gerçek uygulamada API'den gelecek
const notifications = [
  {
    id: 1,
    title: "WordPress Okulu adlı kullanıcı bir duyuru yayınladı: Arkadaslar...",
    time: "24 gün önce",
    isRead: false,
    icon: GraduationCap,
  },
  // Daha fazla bildirim eklenebilir
];

export function NotificationsPopover() {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <button 
          className="relative px-3 py-2 rounded-full hover:bg-secondary transition-colors"
          aria-label="Bildirimler"
        >
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-2 h-4 w-4 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-96 p-0" align="end" sideOffset={8}>
        <div className="flex flex-col">
          {/* Başlık */}
          <div className="flex items-center justify-between p-4 pb-3">
            <h3 className="text-lg font-semibold">Bildirimler</h3>
          </div>
          
          <Separator />
          
          {/* Bildirimler Listesi */}
          <ScrollArea className="max-h-[400px]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Henüz bildiriminiz yok</p>
              </div>
            ) : (
              <div className="py-2">
                {notifications.map((notification, index) => (
                  <div key={notification.id}>
                    <div
                      className={`flex gap-3 px-4 py-3 hover:bg-secondary/50 cursor-pointer transition-colors ${
                        !notification.isRead ? 'bg-purple-50/50' : ''
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                          <notification.icon className="h-5 w-5 text-purple-700" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm leading-relaxed">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.time}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 rounded-full bg-purple-600"></div>
                        </div>
                      )}
                    </div>
                    {index < notifications.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

