import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, GraduationCap, School } from "lucide-react";
import { apis } from "@/services";
import { useToast } from "@/hooks/use-toast";

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const { toast } = useToast();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await apis.user.user_visit(userId!);
      
      if (response.status === 200 && response.data) {
        setUserData(response.data);
      } else {
        toast({
          title: "Hata",
          description: "Kullanıcı profili yüklenemedi",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      toast({
        title: "Hata",
        description: error?.response?.data?.message || "Kullanıcı profili yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const buildImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    const baseUrl = import.meta.env.VITE_BASE_URL || '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('/')) {
      return `${baseUrl}${url}`;
    }
    return `${baseUrl}/${url}`;
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8 max-w-4xl">
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Yükleniyor...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!userData) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8 max-w-4xl">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Kullanıcı bulunamadı</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-8 max-w-4xl">
        <Card className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {(userData.first_name?.[0] || '') + (userData.last_name?.[0] || '') || 'U'}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">
                {userData.first_name} {userData.last_name}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={userData.role === "student" ? "default" : "secondary"}>
                  {userData.role === "student" ? "Öğrenci" : "Öğretmen"}
                </Badge>
                {userData.points !== undefined && (
                  <Badge variant="outline">
                    {userData.points} puan
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Student Specific */}
          {userData.role === "student" && (
            <>
              {/* School Info */}
              {(userData.school || userData.department) && (
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <School className="h-5 w-5" />
                    Okul Bilgileri
                  </h2>
                  {userData.school && (
                    <p><span className="font-medium">Okul:</span> {userData.school}</p>
                  )}
                  {userData.department && (
                    <p><span className="font-medium">Bölüm:</span> {userData.department}</p>
                  )}
                </div>
              )}

              {/* Character */}
              {userData.character && (
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold">Karakter</h2>
                  <div className="flex gap-4">
                    {userData.character.image_url && (
                      <img
                        src={buildImageUrl(userData.character.image_url) || ''}
                        alt={userData.character.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{userData.character.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{userData.character.details}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Personality */}
              {userData.personality && (
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold">Kişilik Tipi</h2>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{userData.personality.type}</Badge>
                      <span className="font-semibold">{userData.personality.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {userData.personality.short_description}
                    </p>
                    <p className="text-sm leading-relaxed">
                      {userData.personality.long_description}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Teacher Specific */}
          {userData.role === "teacher" && userData.teacher && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Öğretmen Bilgileri
              </h2>
              {userData.teacher.school && (
                <p><span className="font-medium">Okul:</span> {userData.teacher.school}</p>
              )}
              {userData.teacher.branch && (
                <p><span className="font-medium">Branş:</span> {userData.teacher.branch}</p>
              )}
              <Badge variant={userData.teacher.admin_approved ? "default" : "secondary"}>
                {userData.teacher.admin_approved ? "Onaylandı" : "Onay Bekliyor"}
              </Badge>
            </div>
          )}

          {/* Labels */}
          {userData.labels && userData.labels.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Etiketler</h2>
              <div className="flex flex-wrap gap-2">
                {userData.labels.map((label: any) => (
                  <Badge key={label.id || label} variant="outline">
                    {label.name || label}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}

