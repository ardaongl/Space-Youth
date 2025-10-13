import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Mock callback - just redirect to dashboard
    // In a real app, this would handle OAuth callback
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Yönlendiriliyor…</p>
      </div>
    </div>
  );
}
