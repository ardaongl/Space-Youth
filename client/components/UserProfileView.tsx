import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, GraduationCap, School, User, Mail, Calendar, Award } from "lucide-react";
import { apis } from "@/services";
import { useToast } from "@/hooks/use-toast";

interface UserProfileViewProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface StudentUser {
  id: string;
  first_name: string;
  last_name: string;
  gender: string | null;
  age: number | null;
  language: string;
  role: "student";
  points: number;
  labels: any[];
  school: string;
  department: string;
  character: {
    id: string;
    name: string;
    details: string;
    image_url: string;
    created_at: string;
    updated_at: string;
    personality: {
      id: string;
      name: string;
      type: string;
      short_description: string;
      long_description: string;
    };
  };
  personality: {
    id: string;
    name: string;
    type: string;
    short_description: string;
    long_description: string;
  };
  created_at: string;
  updated_at: string;
}

interface TeacherUser {
  id: string;
  first_name: string;
  last_name: string;
  gender: string | null;
  age: number | null;
  language: string;
  role: "teacher";
  points: number;
  labels: any[];
  teacher: {
    id: string;
    school: string | null;
    branch: string | null;
    admin_approved: boolean;
  };
  courses: any[];
  created_at: string;
  updated_at: string;
}

type UserData = StudentUser | TeacherUser;

export function UserProfileView({ userId, open, onOpenChange }: UserProfileViewProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && userId) {
      fetchUserProfile();
    } else {
      setUserData(null);
    }
  }, [open, userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await apis.user.user_visit(userId);
      
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

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Kullanıcı Profili</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : userData ? (
          <div className="space-y-6">
            {/* User Header */}
            <Card className="p-6">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                  {userData.first_name?.[0]?.toUpperCase() || ''}{userData.last_name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">
                    {userData.first_name} {userData.last_name}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={userData.role === "student" ? "default" : "secondary"}>
                      {userData.role === "student" ? "Öğrenci" : "Öğretmen"}
                    </Badge>
                    {userData.points !== undefined && (
                      <Badge variant="outline" className="gap-1">
                        <Award className="h-3 w-3" />
                        {userData.points} puan
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                    {userData.gender && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{userData.gender}</span>
                      </div>
                    )}
                    {userData.age && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{userData.age} yaş</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{userData.language}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Student Specific Content */}
            {userData.role === "student" && (
              <>
                {/* School Info */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <School className="h-5 w-5" />
                    Okul Bilgileri
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Okul:</span>
                      <span>{userData.school || "Belirtilmemiş"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <School className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Bölüm:</span>
                      <span>{userData.department || "Belirtilmemiş"}</span>
                    </div>
                  </div>
                </Card>

                {/* Character */}
                {userData.character && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Karakter</h3>
                    <div className="flex gap-4">
                      {userData.character.image_url && (
                        <img
                          src={buildImageUrl(userData.character.image_url) || ''}
                          alt={userData.character.name}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{userData.character.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{userData.character.details}</p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Personality */}
                {userData.personality && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Kişilik Tipi</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{userData.personality.type}</Badge>
                          <span className="font-semibold">{userData.personality.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {userData.personality.short_description}
                        </p>
                        <p className="text-sm leading-relaxed">
                          {userData.personality.long_description}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Labels */}
                {userData.labels && userData.labels.length > 0 && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Etiketler</h3>
                    <div className="flex flex-wrap gap-2">
                      {userData.labels.map((label: any) => (
                        <Badge key={label.id || label} variant="outline">
                          {label.name || label}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                )}
              </>
            )}

            {/* Teacher Specific Content */}
            {userData.role === "teacher" && (
              <>
                {/* Teacher Info */}
                {userData.teacher && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <School className="h-5 w-5" />
                      Öğretmen Bilgileri
                    </h3>
                    <div className="space-y-2">
                      {userData.teacher.school && (
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Okul:</span>
                          <span>{userData.teacher.school}</span>
                        </div>
                      )}
                      {userData.teacher.branch && (
                        <div className="flex items-center gap-2">
                          <School className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Branş:</span>
                          <span>{userData.teacher.branch}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge variant={userData.teacher.admin_approved ? "default" : "secondary"}>
                          {userData.teacher.admin_approved ? "Onaylandı" : "Onay Bekliyor"}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Courses */}
                {userData.courses && userData.courses.length > 0 && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Kurslar</h3>
                    <div className="space-y-2">
                      {userData.courses.map((course: any) => (
                        <div key={course.id} className="p-3 rounded-lg bg-muted/50">
                          <p className="font-medium">{course.title || "İsimsiz Kurs"}</p>
                          {course.description && (
                            <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Labels */}
                {userData.labels && userData.labels.length > 0 && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Etiketler</h3>
                    <div className="flex flex-wrap gap-2">
                      {userData.labels.map((label: any) => (
                        <Badge key={label.id || label} variant="outline">
                          {label.name || label}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Kullanıcı bilgileri yüklenemedi
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

