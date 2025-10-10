import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Coins } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { isAdmin } from "@/utils/roles";

export default function EditCourse() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { auth } = useAuth();
  
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isPaid, setIsPaid] = useState(true);

  const adminUser = isAdmin(auth.user?.role);

  useEffect(() => {
    // Load course data - in real app, fetch from API
    // Mock data for now
    setCourseName(slug ? slug.replace(/-/g, " ") : "Workshop Facilitation");
    setCourseDescription("Workshops are powerful tools for tackling complex problems and driving innovative solutions.");
    setPrice("250");
  }, [slug]);

  if (!adminUser) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Yetkisiz Erişim</h1>
            <p className="text-muted-foreground mb-4">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
            <Button onClick={() => navigate('/courses')}>Kurslara Dön</Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const handleSave = () => {
    const courseData = {
      name: courseName,
      description: courseDescription,
      price: isPaid ? parseInt(price) : 0,
      isPaid,
    };

    console.log("Saving course:", courseData);
    // TODO: Send to API

    navigate('/courses');
  };

  const isValid = courseName.trim() !== "" && courseDescription.trim() !== "" && (!isPaid || price.trim() !== "");

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
          Geri Dön
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg border shadow-sm p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Kurs Düzenle (Admin)</h1>
              <p className="text-muted-foreground mt-2">
                Kurs bilgilerini ve fiyatlandırmayı düzenleyin
              </p>
            </div>

            <div className="space-y-6">
              {/* Course Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Kursun Adı <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="Kurs adını girin"
                  className="w-full"
                />
              </div>

              {/* Course Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Kursun Açıklaması <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  placeholder="Kurs açıklamasını girin"
                  rows={6}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              {/* Pricing Section */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Fiyatlandırma</h2>
                
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
                      <p className="font-medium">Ücretli Kurs</p>
                      <p className="text-sm text-muted-foreground">
                        Öğrenciler bu kursa erişmek için coin ödemesi yapacak
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
                      <p className="font-medium">Ücretsiz Kurs</p>
                      <p className="text-sm text-muted-foreground">
                        Tüm öğrenciler bu kursa ücretsiz erişebilir
                      </p>
                    </div>
                  </label>
                </div>

                {/* Price Input */}
                {isPaid && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Kurs Ücreti (Coin) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-yellow-600" />
                      <Input
                        type="number"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Örn: 250"
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Öğrencilerin kursa erişmek için ödemesi gereken coin miktarı
                    </p>
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold mb-3">Önizleme</h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{courseName || "Kurs Adı"}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {courseDescription || "Kurs açıklaması"}
                      </p>
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
                        <span className="text-lg font-bold text-green-600">Ücretsiz</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => navigate('/courses')}
                >
                  İptal
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!isValid}
                  size="lg"
                >
                  Değişiklikleri Kaydet
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
