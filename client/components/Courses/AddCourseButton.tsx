import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { canSeeAddCourse } from "@/utils/roles";
import { Plus } from "lucide-react";

export default function AddCourseButton() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  // Use role directly to support DEV role switching without strict status check
  const role = auth.user?.role ?? null;

  if (!canSeeAddCourse(role)) {
    return null;
  }

  return (
    <button
      data-testid="add-course-btn"
      className="inline-flex items-center gap-2 rounded-lg bg-purple-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-purple-700 transition-colors shadow-sm"
      onClick={() => navigate('/courses/add')}
    >
      <Plus className="h-5 w-5" />
      İçerik Ekle
    </button>
  );
}
