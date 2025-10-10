import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";

export default function ZoomCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // UI-only: Simulate exchanging code for tokens and mark as connected
    const code = params.get("code");
    const state = params.get("state");
    if (code) {
      try {
        localStorage.setItem("zoom.connected", "true");
      } catch {}
    }
  }, [params]);

  return (
    <AppLayout>
      <div className="container mx-auto py-10">
        <div className="max-w-xl mx-auto border rounded-lg bg-card p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Zoom hesabı bağlandı</h1>
          <p className="text-muted-foreground mb-6">
            Hesabınız başarıyla bağlandı. Artık dersler için Zoom toplantı linkleri oluşturabilirsiniz.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate("/profile")}>Profile dön</Button>
            <Button variant="outline" onClick={() => navigate("/courses/add/lessons")}>Ders oluştur</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
