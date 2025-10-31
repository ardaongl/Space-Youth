import { useNavigate } from "react-router-dom";
import { isTeacher } from "@/utils/roles";
import { Plus } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAppSelector } from "@/store";

export default function AddCourseButton() {
  const navigate = useNavigate();

  const { t } = useLanguage();
  
  const user = useAppSelector(state => state.user.user)
  const role = user?.role;

  if (!isTeacher(role)) {
    return null;
  }

  return (
    <button
      data-testid="add-course-btn"
      className="inline-flex items-center gap-2 rounded-lg bg-purple-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-purple-700 transition-colors shadow-sm"
      onClick={() => navigate('/courses/add')}
    >
      <Plus className="h-5 w-5" />
{t('addCourseButton.addContent')}
    </button>
  );
}
