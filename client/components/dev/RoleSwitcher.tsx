import { useState } from "react";
import { useAppDispatch } from "@/store";
import { setUser, setUserToken } from "@/store/slices/userSlice";
import { authService } from "@/services/authService";
import { UserRole } from "@/utils/roles";
import { User2, ChevronDown } from "lucide-react";

const MOCK_USERS: Record<UserRole, { id: string; name: string; email: string; role: UserRole }> = {
  student: {
    id: "student-1",
    name: "Ahmet Öğrenci",
    email: "ogrenci@test.com",
    role: "student",
  },
  teacher: {
    id: "teacher-1",
    name: "Ayşe Öğretmen",
    email: "ogretmen@test.com",
    role: "teacher",
  },
  admin: {
    id: "admin-1",
    name: "Mehmet Admin",
    email: "admin@test.com",
    role: "admin",
  },
};

export default function RoleSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>("student");
  const dispatch = useAppDispatch();

  const handleRoleChange = (role: UserRole) => {
    const mockUser = MOCK_USERS[role];
    dispatch(setUser(mockUser));
    // Also set a development token so that any requiresAuth requests work
    dispatch(setUserToken("dev-token"));
    try { authService.setToken("dev-token"); } catch {}
    setCurrentRole(role);
    setIsOpen(false);
    
    // Toast bildirimi göster
    console.log(`🔄 Rol değiştirildi: ${mockUser.name} (${role})`);
    console.log("📦 Redux'a gönderilen user:", mockUser);
    
    // Verify after dispatch
    setTimeout(() => {
      console.log("✅ Rol değişikliği tamamlandı. Sayfayı yenileyin veya /courses'a gidin.");
    }, 100);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "student":
        return "👨‍🎓 Öğrenci";
      case "teacher":
        return "👨‍🏫 Öğretmen";
      case "admin":
        return "👑 Admin";
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-full bg-purple-600 text-white px-4 py-2 text-sm shadow-lg hover:bg-purple-700 transition-colors"
          title="Geliştirme: Rol Değiştir"
        >
          <User2 className="h-4 w-4" />
          {getRoleLabel(currentRole)}
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute bottom-full mb-2 right-0 bg-white border rounded-lg shadow-xl overflow-hidden min-w-[200px]">
            <div className="p-2 bg-purple-50 border-b text-xs font-semibold text-purple-900">
              🔧 DEV: Rol Seç
            </div>
            {(["student", "teacher", "admin"] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-purple-50 transition-colors ${
                  currentRole === role ? "bg-purple-100 font-semibold" : ""
                }`}
              >
                {getRoleLabel(role)}
                <div className="text-xs text-gray-500 mt-0.5">
                  {MOCK_USERS[role].name}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
