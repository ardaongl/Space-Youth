import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store";
import { setUser } from "@/store/slices/userSlice";

export default function ZoomCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user)
  const isTeacherOrAdmin = user.user?.role === "teacher" || user.user?.role === "admin";

  useEffect(() => {
    // UI-only: Simulate exchanging code for tokens and mark as connected
    const code = params.get("code");
    const state = params.get("state");
    if (code) {
      try {
        localStorage.setItem("zoom.connected", "true");
      } catch {}

      if (user.user?.teacher) {
        dispatch(
          setUser({
            ...user.user,
            teacher: {
              ...user.user.teacher,
              zoom_connected: true,
            },
          }),
        );
      }
    }
  }, [params, dispatch, user.user]);

  return (
    <AppLayout>
      <div className="container mx-auto py-10">
        <div className="max-w-xl mx-auto border rounded-lg bg-card p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Zoom hesabı bağlandı</h1>
          <p className="text-muted-foreground mb-6">
            {isTeacherOrAdmin 
              ? "Hesabınız başarıyla bağlandı. Artık dersler için Zoom toplantı linkleri oluşturabilirsiniz."
              : "Hesabınız başarıyla bağlandı. Artık Zoom ile yapılacak derslere katılabilirsiniz."
            }
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate("/profile")}>Profile dön</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
