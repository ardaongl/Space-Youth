import React, { useState, useEffect, FormEvent } from "react";
import "./AdminPage.css";
import axios from "axios";
import { useAppSelector } from "@/store";
import { apis } from "@/services";
import { useNavigate } from "react-router-dom";
import { IPersonality } from "@/types/common/common";

const baseUrl = import.meta.env.VITE_BASE_URL;

// LocalStorage anahtarları + güvenli JSON parse
const LS_KEYS = {
  TASKS: "admin_tasks",
  PERSONALITIES: "admin_personalities",
  CHARACTERS: "admin_characters",
} as const;

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  age?: number;
  students?: {
    cv_url: string,
    department: string
    id: string,
    phases: any
    questions_and_answers: string
    school:string, 
    status: string,
  }
}

interface Answer {
  id: number;
  student_name: string;
  answer: string;
}

interface Task {
  id?: number;
  name: string;
  description: string;
  point: number;
  achivements: string;
  image_url: string;
  level: string;
}

interface Character {
  id: number;
  name: string;
  details: string;
  image_url: string;
  personality: string;
  image?: File; // For editing purposes
}

interface CharacterFormData {
  name: string;
  details: string;
  personality: string;
  image: File;
}

interface CourseLabel {
  id: number;
  name: string;
}

interface CourseTeacher {
  first_name: string;
  last_name: string;
  email: string;
}

interface CourseLesson {
  id: string;
  title: string;
  duration: number;
  order: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  image_url?: string | null;
  video_url?: string | null;
  level: string;
  duration?: number | null;
  certificate_url?: string | null;
  points?: number | null;
  status?: string | null;
  labels?: CourseLabel[];
  teacher?: CourseTeacher | null;
  lessons?: CourseLesson[];
}

type EditEntity = "task" | "personality" | "character";
type EditData = Task | IPersonality | Character;
interface EditState {
  entity: EditEntity;
  data: EditData;
}

type FeedbackState = {
  type: "success" | "error";
  message: string;
};

const AdminPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<
    "students" | "answers" | "tasks" | "personalities" | "characters" | "courses"
  >("students");
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [personalities, setPersonalities] = useState<IPersonality[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [actionFeedback, setActionFeedback] = useState<Record<string, FeedbackState | undefined>>({});
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseSearch, setCourseSearch] = useState<string>("");
  const [courseLoading, setCourseLoading] = useState(false);
  const [courseError, setCourseError] = useState<string | null>(null);
  const [activationPoints, setActivationPoints] = useState<Record<number, string>>({});
  const [courseActivationLoading, setCourseActivationLoading] = useState<Record<number, boolean>>({});
  const [courseActivationFeedback, setCourseActivationFeedback] = useState<Record<number, FeedbackState | undefined>>({});

  const user = useAppSelector(state => state.user.user)
  const token = useAppSelector(state => state.user.token);
  

  useEffect(() => {
    const getPersonalities = async () => {
      try {
        const response = await apis.personality.get_personalities();
        console.log(response);
        
        if(response.status == 200){
          console.log(response);
          
          setPersonalities(response.data);
        }
      } catch (error) {
        
      }
    }

    getPersonalities()
  }, [])

  const handleReturnHome = () => {
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
  }
  const fetchStudents = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apis.student.get_students();
      setStudents(res.data || []);
      console.log(res.data);
      
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.error?.message ||
        "Öğrenciler getirilirken bir hata oluştu."
      );
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCharacters = async () => {
    try {
      const response = await apis.character.get_characters();
      setCharacters(response.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apis.task.get_tasks();
      if (response.status === 200) {
        setTasks(response.data || []);
      }
    } catch (error: any) {
      console.error(error);
      setError(
        error.response?.data?.error?.message ||
        "Görevler getirilirken bir hata oluştu."
      );
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

  const fetchCourses = async () => {
    setCourseLoading(true);
    setCourseError(null);
    try {
      const response = await apis.course.get_courses();
      if (response?.status === 200) {
        const courseList: Course[] = response.data || [];
        setCourses(courseList);
        const initialPoints: Record<number, string> = {};
        courseList.forEach((course) => {
          initialPoints[course.id] = course.points !== null && course.points !== undefined ? course.points.toString() : "";
        });
        setActivationPoints(initialPoints);
      } else {
        setCourseError(
          response?.data?.error?.message ||
          response?.data?.message ||
          "Kurslar getirilirken bir hata oluştu."
        );
        setCourses([]);
      }
    } catch (err: any) {
      console.error("Error fetching courses:", err);
      setCourseError(
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        "Kurslar getirilirken bir hata oluştu."
      );
      setCourses([]);
    } finally {
      setCourseLoading(false);
    }
  };

  const handleActivateCourse = async (courseId: number) => {
    const rawPoints = activationPoints[courseId];
    const pointsValue = Number(rawPoints);
    if (
      rawPoints === undefined ||
      rawPoints === null ||
      rawPoints.toString().trim() === "" ||
      Number.isNaN(pointsValue) ||
      pointsValue <= 0
    ) {
      setCourseActivationFeedback((prev) => ({
        ...prev,
        [courseId]: {
          type: "error",
          message: "Lütfen geçerli bir puan değeri girin."
        }
      }));
      return;
    }

    setCourseActivationLoading((prev) => ({ ...prev, [courseId]: true }));
    setCourseActivationFeedback((prev) => ({ ...prev, [courseId]: undefined }));

    try {
      const response = await apis.course.admin_activate_course(courseId, pointsValue);
      const statusCode = response?.status;
      const responseMessage =
        response?.data?.message ||
        response?.data?.success ||
        "Kurs başarıyla aktifleştirildi.";

      if (statusCode === 200 || statusCode === 201) {
        setCourses((prev) =>
          prev.map((course) =>
            course.id === courseId
              ? { ...course, status: "ACTIVE", points: pointsValue }
              : course
          )
        );
        setCourseActivationFeedback((prev) => ({
          ...prev,
          [courseId]: {
            type: "success",
            message: responseMessage
          }
        }));
      } else {
        setCourseActivationFeedback((prev) => ({
          ...prev,
          [courseId]: {
            type: "error",
            message:
              response?.data?.error?.message ||
              response?.data?.message ||
              "Kurs aktifleştirilirken bir hata oluştu."
          }
        }));
      }
    } catch (error: any) {
      console.error("Error activating course:", error);
      setCourseActivationFeedback((prev) => ({
        ...prev,
        [courseId]: {
          type: "error",
          message:
            error?.response?.data?.error?.message ||
            error?.response?.data?.message ||
            "Kurs aktifleştirilirken bir hata oluştu."
        }
      }));
    } finally {
      setCourseActivationLoading((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  useEffect(() => {
    if (selectedTab === "students" || selectedTab === "answers") fetchStudents();
    if (selectedTab === "characters") fetchCharacters();
    if (selectedTab === "tasks") fetchTasks();
    if (selectedTab === "courses") fetchCourses();
  }, [selectedTab]);

  const filteredStudents = students.filter(
    (s) =>
      s.first_name.toLowerCase().includes(search.toLowerCase()) ||
      s.last_name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.students.school && s.students.school.toLowerCase().includes(search.toLowerCase())) ||
      (s.students.department && s.students.department.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredCourses = courses.filter((course) => {
    const query = courseSearch.trim().toLowerCase();
    if (!query) return true;

    const searchableFields = [
      course.title,
      course.description,
      course.level,
      course.teacher?.first_name,
      course.teacher?.last_name,
      course.teacher?.email,
      ...(course.labels?.map((label) => label.name) ?? [])
    ];

    return searchableFields.some((field) =>
      field?.toLowerCase().includes(query)
    );
  });

  const handleAddTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
      description: { value: string };
      point: { value: string };
      achivements: { value: string };
      image_url: { value: string };
      level: { value: string };
    };
    
    const payload = {
      name: target.name.value,
      description: target.description.value,
      point: parseInt(target.point.value) || 0,
      achivements: target.achivements.value,
      image_url: target.image_url.value,
      level: target.level.value,
    };

    try {
      const response = await apis.task.admin_add_task(payload);
      if (response.status === 200 || response.status === 201) {
        // Reset form before closing
        if (e.currentTarget) {
          e.currentTarget.reset();
        }
        // Refresh tasks list after successful addition
        fetchTasks();
        // Close form after a short delay to ensure reset completes
        setTimeout(() => {
          setIsTaskFormOpen(false);
        }, 100);
      } else {
        alert("Görev eklenirken bir hata oluştu");
      }
    } catch (error: any) {
      console.error("Error adding task:", error);
      alert("Görev eklenirken bir hata oluştu");
    }
  };

  const handleAddPersonality = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
      type: { value: string };
      description: { value: string };
      longDescription: { value: string };
    };

    const newPersonality: IPersonality = {
      name: target.name.value,
      type: target.type.value,
      short_description: target.description.value,
      long_description: target.longDescription.value,
    };
    setPersonalities([...personalities, newPersonality]);
    
    const response = await apis.personality.admin_add_personality(newPersonality);
    console.log(response);
    
    e.currentTarget.reset();
  };

  const handleAddCharacter = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
      details: { value: string };
      image: { files: FileList };
      personality: { value: string };
    };

    const imageFile = target.image.files?.[0];
    if (!imageFile) {
      alert("Lütfen bir görsel seçin");
      return;
    }

    const formData: CharacterFormData = {
      name: target.name.value,
      details: target.details.value,
      personality: target.personality.value,
      image: imageFile,
    };
    
    console.log("Form data:", formData);
    
    try {
      const response = await apis.character.admin_add_character(formData);
      console.log("Character added:", response);
      
      if (response.status === 200 || response.status === 201) {
        // Refresh characters list after successful addition
        fetchCharacters();
      }
    } catch (error) {
      console.error("Error adding character:", error);
      alert("Karakter eklenirken bir hata oluştu");
    }

    // Reset form if it's still available
    if (e.currentTarget) {
      e.currentTarget.reset();
    }
  };

  /** Drawer aç */
  const openEdit = (entity: EditEntity, data: EditData) => {
    // Derin kopya (formda controlled input için)
    setEditState({ entity, data: JSON.parse(JSON.stringify(data)) });
    // body scroll kilidi (opsiyonel)
    document.body.style.overflow = "hidden";
  };

  /** Drawer kapat */
  const closeEdit = () => {
    setEditState(null);
    document.body.style.overflow = "";
  };

  /** Drawer içi form alanı güncelleme (controlled) */
  const onEditChange = (field: string, value: string | File | number) => {
    if (!editState) return;
    setEditState({
      ...editState,
      data: { ...(editState.data as any), [field]: value } as EditData,
    });
  };

  const saveEdit = async () => {
    if (!editState) return;

    if (editState.entity === "task") {
      const item = editState.data as Task;
      if (item.id) {
        try {
          const payload = {
            name: item.name,
            description: item.description,
            point: item.point,
            achivements: item.achivements,
            image_url: item.image_url,
            level: item.level,
          };
          const response = await apis.task.admin_update_task(item.id.toString(), payload);
          if (response.status === 200 || response.status === 201) {
            fetchTasks();
          } else {
            alert("Görev güncellenirken bir hata oluştu");
          }
        } catch (error) {
          console.error("Error updating task:", error);
          alert("Görev güncellenirken bir hata oluştu");
        }
      }
    }
    if (editState.entity === "personality") {
      const item = editState.data as IPersonality;
      setPersonalities((prev) => prev.map((p) => (p.id === item.id ? item : p)));
    }
    if (editState.entity === "character") {
      const item = editState.data as Character;
      
      // If there's a new image file, upload it
      if (item.image) {
        try {
          const formData = {
            name: item.name,
            details: item.details,
            personality: item.personality,
            image: item.image
          };
          
          const response = await apis.character.admin_add_character(formData);
          console.log("Character updated:", response);
          
          if (response.status === 200 || response.status === 201) {
            // Refresh characters list
            fetchCharacters();
          }
        } catch (error) {
          console.error("Error updating character:", error);
          alert("Karakter güncellenirken bir hata oluştu");
        }
      } else {
        // Just update locally if no new image
        setCharacters((prev) => prev.map((c) => (c.id === item.id ? item : c)));
      }
    }
    closeEdit();
  };

  const renderDrawerForm = () => {
    if (!editState) return null;

    if (editState.entity === "task") {
      const d = editState.data as Task;
      return (
        <>
          <h3>Görev Düzenle</h3>
          <label>Ad</label>
          <input
            value={d.name}
            onChange={(e) => onEditChange("name", e.target.value)}
            placeholder="Görev adı"
          />
          <label>Açıklama</label>
          <textarea
            value={d.description}
            onChange={(e) => onEditChange("description", e.target.value)}
            placeholder="Görev açıklaması"
            rows={4}
          />
          <label>Puan</label>
          <input
            type="number"
            value={d.point}
            onChange={(e) => onEditChange("point", parseInt(e.target.value) || 0)}
            placeholder="Puan"
          />
          <label>Başarılar</label>
          <input
            value={d.achivements}
            onChange={(e) => onEditChange("achivements", e.target.value)}
            placeholder="Başarılar"
          />
          <label>Görsel URL</label>
          <input
            type="url"
            value={d.image_url}
            onChange={(e) => onEditChange("image_url", e.target.value)}
            placeholder="Görsel URL"
          />
          <label>Seviye</label>
          <input
            value={d.level}
            onChange={(e) => onEditChange("level", e.target.value)}
            placeholder="Seviye"
          />
        </>
      );
    }

    if (editState.entity === "personality") {
      const d = editState.data as IPersonality;
      return (
        <>
          <h3>Kişilik Tipi Düzenle</h3>
          <label>Ad</label>
          <input
            value={d.name}
            onChange={(e) => onEditChange("name", e.target.value)}
            placeholder="Ad"
          />
          <label>Tip</label>
          <input
            value={d.type}
            onChange={(e) => onEditChange("type", e.target.value)}
            placeholder="Tip (INTJ-A / INTJ-T)"
          />
          <label>Açıklama</label>
          <textarea
            value={d.short_description}
            onChange={(e) => onEditChange("description", e.target.value)}
            placeholder="Açıklama"
            rows={5}
          />
          <label>Uzun Açıklama</label>
          <textarea
            value={d.long_description}
            onChange={(e) => onEditChange("longDescription", e.target.value)}
            placeholder="Uzun açıklama"
            rows={6}
            style={{ resize: "vertical" }}
          />
        </>
      );
    }

    // character
    const d = editState.data as Character;
    return (
      <>
        <h3>Karakter Düzenle</h3>
        <label>Ad</label>
        <input
          value={d.name}
          onChange={(e) => onEditChange("name", e.target.value)}
          placeholder="Karakter adı"
        />
        <label>Kişilik Tipi</label>
        <input
          value={d.personality}
          onChange={(e) => onEditChange("personality", e.target.value)}
          placeholder="Kişilik tipi"
          list="personalityList"
        />
        <datalist id="personalityList">
          {personalities.map((p, i) => (
            <option key={i} value={p.name} />
          ))}
        </datalist>
        <label>Detaylar</label>
        <textarea
          value={d.details}
          onChange={(e) => onEditChange("details", e.target.value)}
          placeholder="Detaylar"
          rows={5}
        />
        <label>Görsel (opsiyonel)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onEditChange("image", file);
            }
          }}
          placeholder="Yeni görsel seçin"
        />
        {d.image_url && (
          <div style={{ marginTop: "8px" }}>
            <small>Mevcut görsel:</small>
            <br />
            <img 
              src={d.image_url} 
              alt="Current character" 
              style={{ maxWidth: "100px", maxHeight: "100px", marginTop: "4px" }}
            />
          </div>
        )}
      </>
    );
  };

  const approve = async (student_id: string, approveStatus: string) => {
    setActionLoading((prev) => ({ ...prev, [student_id]: true }));
    setActionFeedback((prev) => ({ ...prev, [student_id]: undefined }));

    try {
      const response = await apis.student.admin_approve_student(student_id, approveStatus);
      console.log(response);

      const statusCode = response?.status;
      const responseMessage = typeof response?.data?.message === "string" ? response.data.message : undefined;
      const defaultSuccessMessage =
        approveStatus === "reject"
          ? "Öğrenci reddedildi."
          : approveStatus === "ai_approve"
          ? "Öğrenci yapay zeka ile onaylandı."
          : "Öğrenci onaylandı.";

      if (statusCode === 200) {
        setActionFeedback((prev) => ({
          ...prev,
          [student_id]: { type: "success", message: responseMessage || defaultSuccessMessage },
        }));
        await fetchStudents();
      } else {
        setActionFeedback((prev) => ({
          ...prev,
          [student_id]: {
            type: "error",
            message: responseMessage || "İşlem tamamlanamadı.",
          },
        }));
      }
    } catch (error: any) {
      console.error("Error approving student:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error?.message ||
        "İşlem sırasında bir hata oluştu.";

      setActionFeedback((prev) => ({
        ...prev,
        [student_id]: { type: "error", message: errorMessage },
      }));
    } finally {
      setActionLoading((prev) => ({ ...prev, [student_id]: false }));
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <h2>Admin Paneli</h2>
        <ul>
          <li
            className={selectedTab === "students" ? "active" : ""}
            onClick={() => setSelectedTab("students")}
          >
            Öğrenciler
          </li>
          <li
            className={selectedTab === "answers" ? "active" : ""}
            onClick={() => setSelectedTab("answers")}
          >
            Öğrenci Cevapları
          </li>
          <li
            className={selectedTab === "tasks" ? "active" : ""}
            onClick={() => setSelectedTab("tasks")}
          >
            Görevler
          </li>
          <li
            className={selectedTab === "personalities" ? "active" : ""}
            onClick={() => setSelectedTab("personalities")}
          >
            Kişilik Tipleri
          </li>
          <li
            className={selectedTab === "characters" ? "active" : ""}
            onClick={() => setSelectedTab("characters")}
          >
            Karakterler
          </li>
          <li
            className={selectedTab === "courses" ? "active" : ""}
            onClick={() => setSelectedTab("courses")}
          >
            Kurslar
          </li>
        </ul>
        <button
        onClick={handleReturnHome}>
            anasayfaya dön
        </button>
      </div>

      <div className="content">
        {/* Öğrenciler */}
        {selectedTab === "students" && (
          <>
            <h3 style={{ fontWeight: "bold", color: "#2c3e50" }}>
              Öğrenci Listesi
            </h3>
            {!token ? (
              <p style={{ color: "red" }}>Lütfen giriş yapınız.</p>
            ) : loading ? (
              <p>Yükleniyor...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : students.length === 0 ? (
              <p>Öğrenci bulunmamaktadır.</p>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="İsim, email, okul veya bölüm ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />
                <table className="students-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Ad</th>
                      <th>Soyad</th>
                      <th>Email</th>
                      <th>Okul</th>
                      <th>Yaş</th>
                      <th>Bölüm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((s, indx) => (
                      <tr key={indx}>
                        <td>{s.id}</td>
                        <td>{s.first_name}</td>
                        <td>{s.last_name}</td>
                        <td>{s.email}</td>
                        <td>{s.students.school || "Bilinmiyor"}</td>
                        <td>{s.age || "-"}</td>
                        <td>{s.students.department || "Bilinmiyor"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </>
        )}

        {/* Cevaplar */}
        {selectedTab === "answers" && (
          <>
            <h3 style={{ fontWeight: "bold", color: "#2c3e50", marginBottom: 10 }}>
              Öğrenciler
            </h3>

            {!token ? (
              <p style={{ color: "red" }}>Lütfen giriş yapınız.</p>
            ) : loading ? (
              <p>Yükleniyor...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : students.length === 0 ? (
              <p>Henüz öğrenci bulunmamaktadır.</p>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="İsim, e-posta, okul veya bölüm ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    marginBottom: "15px",
                    outline: "none",
                    transition: "0.2s all",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {students.map((s, idx) => {
                    const isPending = !!actionLoading[s.id];
                    const feedback = actionFeedback[s.id];
                    return (
                      <details
                      key={s.id || idx}
                      style={{
                        background: "#fff",
                        borderRadius: "10px",
                        border: "1px solid #e1e4e8",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                        padding: "14px 18px",
                        transition: "0.2s",
                      }}
                    >
                      <summary
                        style={{
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "15px",
                          color: "#2c3e50",
                          outline: "none",
                          listStyle: "none",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                              {idx + 1}. {s.first_name} {s.last_name}
                            </span>
                            <span style={{ fontSize: "14px", color: "#555" }}>{s.email}</span>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              alignItems: "center",
                              gap: "14px",
                              fontSize: "14px",
                              color: "#34495e",
                            }}
                          >
                            <span>
                              <b>Okul:</b> {s.students.school || "-"}
                            </span>
                            <span>
                              <b>Bölüm:</b> {s.students.department || "-"}
                            </span>
                            <span>
                              <b>Durum:</b>{" "}
                              <span
                                style={{
                                  fontWeight: "bold",
                                  color:
                                    s.students.status === "APPROVED"
                                      ? "green"
                                      : s.students.status === "REJECTED"
                                      ? "red"
                                      : "gray",
                                }}
                              >
                                {s.students.status || "PENDING"}
                              </span>
                            </span>
                            <span>
                              <b>CV:</b>{" "}
                              {s.students.cv_url ? (
                                <a
                                  href={s.students.cv_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: "#3498db",
                                    textDecoration: "none",
                                    fontWeight: "500",
                                  }}
                                >
                                  Görüntüle
                                </a>
                              ) : (
                                "-"
                              )}
                            </span>
                          </div>
                        </div>
                      </summary>

                      {/* FORM DETAYI */}
                      <div
                        style={{
                          marginTop: "15px",
                          background: "#f9fbfd",
                          borderRadius: "8px",
                          padding: "14px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "10px",
                            background: "#fff",
                            padding: "10px",
                            borderRadius: "6px",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                          }}
                        >
                          <p>
                            <b>Yaş:</b> {s.students.phases?.phase1?.age || s.age || "-"}
                          </p>
                          <p>
                            <b>Okul:</b> {s.students.phases?.phase1?.school || "-"}
                          </p>
                          <p>
                            <b>Bölüm:</b> {s.students.phases?.phase1?.department || "-"}
                          </p>
                        </div>

                        <div
                          style={{
                            borderTop: "1px solid #e0e0e0",
                            paddingTop: "10px",
                          }}
                        >
                          <h4
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              marginBottom: "6px",
                              color: "#2c3e50",
                            }}
                          >
                            Form Yanıtları
                          </h4>
                          <pre
                            style={{
                              background: "#fff",
                              padding: "10px",
                              borderRadius: "6px",
                              whiteSpace: "pre-wrap",
                              wordWrap: "break-word",
                              fontSize: "13px",
                              color: "#34495e",
                              lineHeight: "1.5",
                              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
                            }}
                          >
                            {s.students.questions_and_answers || "Cevap bulunamadı."}
                          </pre>
                        </div>
                      </div>
                      {s.students.status == "PENDING" && <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: "10px",
                          marginTop: "16px",
                        }}
                      >
                        <button
                          style={{
                            backgroundColor: "#2ecc71",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "8px 14px",
                            fontWeight: "600",
                            cursor: isPending ? "not-allowed" : "pointer",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            transition: "0.2s all",
                            ...(isPending ? { opacity: 0.6 } : {}),
                          }}
                          disabled={isPending}
                          onMouseEnter={(e) => {
                            if (isPending) return;
                            e.currentTarget.style.backgroundColor = "#27ae60";
                          }}
                          onMouseLeave={(e) => {
                            if (isPending) return;
                            e.currentTarget.style.backgroundColor = "#2ecc71";
                          }}
                          onClick={() => approve( s.id, "approve")}
                        >
                          Onayla
                        </button>

                        <button
                          style={{
                            backgroundColor: "#3498db",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "8px 14px",
                            fontWeight: "600",
                            cursor: isPending ? "not-allowed" : "pointer",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            transition: "0.2s all",
                            ...(isPending ? { opacity: 0.6 } : {}),
                          }}
                          disabled={isPending}
                          onMouseEnter={(e) => {
                            if (isPending) return;
                            e.currentTarget.style.backgroundColor = "#2980b9";
                          }}
                          onMouseLeave={(e) => {
                            if (isPending) return;
                            e.currentTarget.style.backgroundColor = "#3498db";
                          }}
                          onClick={() => approve( s.id, "ai_approve")}
                        >
                          AI ile Onayla
                        </button>

                        <button
                          style={{
                            backgroundColor: "#e74c3c",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "8px 14px",
                            fontWeight: "600",
                            cursor: isPending ? "not-allowed" : "pointer",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            transition: "0.2s all",
                            ...(isPending ? { opacity: 0.6 } : {}),
                          }}
                          disabled={isPending}
                          onMouseEnter={(e) => {
                            if (isPending) return;
                            e.currentTarget.style.backgroundColor = "#c0392b";
                          }}
                          onMouseLeave={(e) => {
                            if (isPending) return;
                            e.currentTarget.style.backgroundColor = "#e74c3c";
                          }}
                          onClick={() => approve( s.id ,"reject")}
                        >
                          Reddet
                        </button>
                      </div>}

                      {feedback && (
                        <p
                          style={{
                            marginTop: "12px",
                            fontWeight: 600,
                            color: feedback.type === "success" ? "#27ae60" : "#e74c3c",
                          }}
                        >
                          {feedback.message}
                        </p>
                      )}

                      </details>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {/* Görevler */}
        {selectedTab === "tasks" && (
          <div>
            <h3 style={{ fontWeight: "bold", color: "#2c3e50", marginBottom: "24px" }}>
              Görevler
            </h3>
            {loading ? (
              <p>Yükleniyor...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : (
              <>
                {/* Modern Form Design - Açılır Kapanır */}
                <div style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "12px",
                  padding: "24px",
                  marginBottom: "32px",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                  color: "white",
                  width: "100%"
                }}>
                  <div 
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      marginBottom: isTaskFormOpen ? "20px" : "0"
                    }}
                    onClick={() => setIsTaskFormOpen(!isTaskFormOpen)}
                  >
                    <h4 style={{ 
                      margin: "0",
                      fontSize: "18px", 
                      fontWeight: "600",
                      color: "white"
                    }}>
                      ✨ Yeni Görev Ekle
                    </h4>
                    <span style={{
                      fontSize: "20px",
                      transition: "transform 0.3s ease",
                      transform: isTaskFormOpen ? "rotate(180deg)" : "rotate(0deg)"
                    }}>
                      ▼
                    </span>
                  </div>
                  
                  {isTaskFormOpen && (
                    <form onSubmit={handleAddTask} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* Görev Adı, Puan ve Seviye yan yana */}
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: "12fr 3fr 5fr", 
                      gap: "12px",
                    }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ 
                          fontSize: "13px", 
                          fontWeight: "500", 
                          color: "rgba(255,255,255,0.9)" 
                        }}>
                          Görev Adı *
                        </label>
                        <input 
                          name="name" 
                          placeholder="Örn: İlk Projenizi Oluşturun" 
                          required 
                          style={{
                            padding: "14px 16px",
                            borderRadius: "8px",
                            border: "none",
                            fontSize: "15px",
                            backgroundColor: "rgba(255,255,255,0.95)",
                            color: "#2c3e50",
                            outline: "none",
                            transition: "all 0.2s ease",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            height: "48px",
                            width: "100%"
                          }}
                          onFocus={(e) => e.target.style.backgroundColor = "white"}
                          onBlur={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.95)"}
                        />
                      </div>
                      
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ 
                          fontSize: "13px", 
                          fontWeight: "500", 
                          color: "rgba(255,255,255,0.9)" 
                        }}>
                          Puan *
                        </label>
                        <input 
                          name="point" 
                          type="number" 
                          placeholder="100" 
                          required 
                          style={{
                            padding: "14px 16px",
                            borderRadius: "8px",
                            border: "none",
                            fontSize: "15px",
                            backgroundColor: "rgba(255,255,255,0.95)",
                            color: "#2c3e50",
                            outline: "none",
                            transition: "all 0.2s ease",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            height: "48px",
                            width: "100%"
                          }}
                          onFocus={(e) => e.target.style.backgroundColor = "white"}
                          onBlur={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.95)"}
                        />
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ 
                          fontSize: "13px", 
                          fontWeight: "500", 
                          color: "rgba(255,255,255,0.9)" 
                        }}>
                          Seviye *
                        </label>
                        <select 
                          name="level" 
                          required 
                          style={{
                            padding: "14px 16px",
                            borderRadius: "8px",
                            border: "none",
                            fontSize: "15px",
                            backgroundColor: "rgba(255,255,255,0.95)",
                            color: "#2c3e50",
                            outline: "none",
                            transition: "all 0.2s ease",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            height: "48px",
                            width: "100%",
                            cursor: "pointer",
                            appearance: "none",
                            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232c3e50' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 16px center",
                            paddingRight: "40px"
                          }}
                          onFocus={(e) => e.target.style.backgroundColor = "white"}
                          onBlur={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.95)"}
                        >
                          <option value="">Seçin</option>
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
                      <label style={{ 
                        fontSize: "13px", 
                        fontWeight: "500", 
                        color: "rgba(255,255,255,0.9)" 
                      }}>
                        Görev Açıklaması *
                      </label>
                      <textarea
                        name="description" 
                        placeholder="Görevin detaylı açıklamasını yazın..."
                        required 
                        rows={3}
                        style={{
                          padding: "14px 16px",
                          borderRadius: "8px",
                          border: "none",
                          fontSize: "15px",
                          backgroundColor: "rgba(255,255,255,0.95)",
                          color: "#2c3e50",
                          outline: "none",
                          resize: "vertical",
                          minHeight: "80px",
                          maxHeight: "150px",
                          width: "100%",
                          fontFamily: "inherit",
                          transition: "all 0.2s ease",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                        }}
                        onFocus={(e) => e.target.style.backgroundColor = "white"}
                        onBlur={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.95)"}
                      />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
                      <label style={{ 
                        fontSize: "13px", 
                        fontWeight: "500", 
                        color: "rgba(255,255,255,0.9)" 
                      }}>
                        Başarılar *
                      </label>
                      <textarea
                        name="achivements" 
                        placeholder="Başarılar ve ödüller hakkında detaylı bilgi yazın..."
                        required 
                        rows={4}
                        style={{
                          padding: "14px 16px",
                          borderRadius: "8px",
                          border: "none",
                          fontSize: "15px",
                          backgroundColor: "rgba(255,255,255,0.95)",
                          color: "#2c3e50",
                          outline: "none",
                          resize: "vertical",
                          minHeight: "100px",
                          maxHeight: "200px",
                          width: "100%",
                          fontFamily: "inherit",
                          transition: "all 0.2s ease",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                        }}
                        onFocus={(e) => e.target.style.backgroundColor = "white"}
                        onBlur={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.95)"}
                      />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
                      <label style={{ 
                        fontSize: "13px", 
                        fontWeight: "500", 
                        color: "rgba(255,255,255,0.9)" 
                      }}>
                        Görsel URL
                      </label>
                      <input 
                        name="image_url" 
                        type="url" 
                        placeholder="https://example.com/image.jpg" 
                        style={{
                          padding: "14px 16px",
                          borderRadius: "8px",
                          border: "none",
                          fontSize: "15px",
                          backgroundColor: "rgba(255,255,255,0.95)",
                          color: "#2c3e50",
                          outline: "none",
                          transition: "all 0.2s ease",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          height: "48px",
                          width: "100%"
                        }}
                        onFocus={(e) => e.target.style.backgroundColor = "white"}
                        onBlur={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.95)"}
                      />
                    </div>
                    
                    <button 
                      type="submit" 
                      style={{
                        background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        padding: "14px 24px",
                        fontSize: "15px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 15px rgba(79, 172, 254, 0.3)",
                        alignSelf: "flex-start",
                        minWidth: "160px",
                        height: "48px",
                        marginTop: "8px"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(79, 172, 254, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 15px rgba(79, 172, 254, 0.3)";
                      }}
                    >
                      ✨ Görev Ekle
                    </button>
                  </form>
                  )}
                </div>

                {tasks.length === 0 ? (
                  <p>Görev bulunmamaktadır.</p>
                ) : (
                  <table className="tasks-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Ad</th>
                        <th>Açıklama</th>
                        <th>Puan</th>
                        <th>Başarılar</th>
                        <th>Seviye</th>
                        <th>İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task, idx) => (
                        <tr key={task.id || idx}>
                          <td>{task.id || "-"}</td>
                          <td>{task.name}</td>
                          <td>{task.description}</td>
                          <td>{task.point}</td>
                          <td>{task.achivements}</td>
                          <td>{task.level}</td>
                          <td>
                            <button
                              onClick={() => openEdit("task", task)}
                              className="edit-btn"
                            >
                              Düzenle
                            </button>
                            <button
                              onClick={async () => {
                                if (task.id) {
                                  try {
                                    await apis.task.admin_delete_task(task.id.toString());
                                    fetchTasks();
                                  } catch (error) {
                                    console.error("Error deleting task:", error);
                                    alert("Görev silinirken bir hata oluştu");
                                  }
                                }
                              }}
                              className="delete-btn"
                            >
                              Sil
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </div>
        )}

        {/* Kişilik Tipleri — Kart Grid */}
        {selectedTab === "personalities" && (
          <div className="personality-section">
            <h3 style={{ fontWeight: "bold", color: "#2c3e50", marginBottom: "24px" }}>
              Kişilik Tipleri
            </h3>
            
            {/* Modern Compact Form Design */}
            <div style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "24px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
              color: "white",
              width: "100%"
            }}>
              <h4 style={{ 
                margin: "0 0 16px 0", 
                fontSize: "18px", 
                fontWeight: "600",
                color: "white"
              }}>
                Yeni Kişilik Tipi Ekle
              </h4>
              
              <form onSubmit={handleAddPersonality} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr", 
                  gap: "12px",
                }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ 
                      fontSize: "13px", 
                      fontWeight: "500", 
                      color: "rgba(255,255,255,0.9)" 
                    }}>
                      Kişilik Adı *
                    </label>
                    <input 
                      name="name" 
                      placeholder="Örn: Analitik Düşünür" 
                      required 
                      style={{
                        padding: "14px 16px",
                        borderRadius: "8px",
                        border: "none",
                        fontSize: "15px",
                        backgroundColor: "rgba(255,255,255,0.95)",
                        color: "#2c3e50",
                        outline: "none",
                        transition: "all 0.2s ease",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        height: "48px"
                      }}
                      onFocus={(e) => e.target.style.backgroundColor = "white"}
                      onBlur={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.95)"}
                    />
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ 
                      fontSize: "13px", 
                      fontWeight: "500", 
                      color: "rgba(255,255,255,0.9)" 
                    }}>
                      Tip Kodu *
                    </label>
                    <input 
                      name="type" 
                      placeholder="INTJ-A / INTJ-T" 
                      required 
                      style={{
                        padding: "14px 16px",
                        borderRadius: "8px",
                        border: "none",
                        fontSize: "15px",
                        backgroundColor: "rgba(255,255,255,0.95)",
                        color: "#2c3e50",
                        outline: "none",
                        transition: "all 0.2s ease",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        height: "48px"
                      }}
                      onFocus={(e) => e.target.style.backgroundColor = "white"}
                      onBlur={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.95)"}
                    />
                  </div>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
                  <label style={{ 
                    fontSize: "13px", 
                    fontWeight: "500", 
                    color: "rgba(255,255,255,0.9)" 
                  }}>
                    Kısa Açıklama *
                  </label>
                  <textarea
                    name="description" 
                    placeholder="Bu kişilik tipinin kısa ve öz açıklamasını yazın..."
                    required 
                    rows={1}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "8px",
                      border: "none",
                      fontSize: "15px",
                      backgroundColor: "rgba(255,255,255,0.95)",
                      color: "#2c3e50",
                      outline: "none",
                      resize: "vertical",
                      minHeight: "40px",
                      maxHeight: "80px",
                      width: "100%",
                      fontFamily: "inherit",
                      transition: "all 0.2s ease",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }}
                    onFocus={(e) => e.target.style.backgroundColor = "white"}
                    onBlur={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.95)"}
                  />
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
                  <label style={{ 
                    fontSize: "13px", 
                    fontWeight: "500", 
                    color: "rgba(255,255,255,0.9)" 
                  }}>
                    Detaylı Açıklama *
                  </label>
                  <textarea
                    name="longDescription"
                    placeholder="Bu kişilik tipinin detaylı özelliklerini, güçlü yanlarını, zayıf yanlarını ve genel karakteristiklerini yazın..."
                    rows={2}
                    style={{ 
                      resize: "vertical",
                      padding: "14px 16px",
                      borderRadius: "8px",
                      border: "none",
                      fontSize: "15px",
                      backgroundColor: "rgba(255,255,255,0.95)",
                      color: "#2c3e50",
                      outline: "none",
                      minHeight: "60px",
                      maxHeight: "120px",
                      width: "100%",
                      fontFamily: "inherit",
                      transition: "all 0.2s ease",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }}
                    required
                    onFocus={(e) => e.target.style.backgroundColor = "white"}
                    onBlur={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.95)"}
                  />
                </div>
                
                <button 
                  type="submit" 
                  style={{
                    background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "12px 20px",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(79, 172, 254, 0.3)",
                    alignSelf: "flex-start",
                    minWidth: "140px",
                    height: "44px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(79, 172, 254, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(79, 172, 254, 0.3)";
                  }}
                >
                  ✨ Kişilik Tipi Ekle
                </button>
              </form>
            </div>

            {personalities.length === 0 ? (
              <p>Kişilik tipi bulunmamaktadır.</p>
            ) : (
              <div className="personality-cards">
                {personalities.map((p, i) => (
                  <div key={i} className="personality-card">
                    <div>
                      <h4>{p.name}</h4>
                      <span>{p.type}</span>
                      <p>{p.short_description}</p>
                      {p.long_description && (
                        <p className="long-description">{p.long_description}</p>
                      )}
                    </div>

                    <div className="card-actions">
                      <button
                        className="edit-btn"
                        onClick={() => openEdit("personality", p)}
                      >
                        Düzenle
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleAddPersonality
                        }
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Karakterler — Kart Grid */}
        {selectedTab === "characters" && (
          <div className="character-section">
            <h3 style={{ fontWeight: "bold", color: "#2c3e50" }}>Karakterler</h3>

            <form onSubmit={handleAddCharacter} encType="multipart/form-data">
              <input name="name" placeholder="Karakter Adı" required />
              <input name="details" placeholder="Detaylar" required />
              <input 
                name="image" 
                type="file" 
                accept="image/*" 
                placeholder="Karakter Görseli" 
                required 
              />
              <select name="personality" required>
                <option value="">Kişilik Tipi Seçin</option>
                {personalities.map((p, i) => (
                  <option key={i} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <button type="submit">Ekle</button>
            </form>

            {characters.length === 0 ? (
              <p>Karakter bulunmamaktadır.</p>
            ) : (
              <div className="character-cards">
                {characters.map((c) => (
                  <div key={c.id} className="character-card">
                    <div className="character-head">
                      {/* Görseli şimdilik opsiyonel tutuyoruz */}
                      {c.image_url ? (
                        <img
                          src={ import.meta.env.VITE_BASE_URL + c.image_url}
                          alt={c.name}
                          className="character-thumb"
                        />
                      ) : (
                        <div className="character-thumb placeholder">No Image</div>
                      )}
                      <div className="character-meta">
                        <h4>{c.name}</h4>
                        <span className="personality-badge">{c.personality}</span>
                      </div>
                    </div>

                    <p className="character-details">{c.details}</p>

                    <div className="card-actions">
                      <button
                        className="edit-btn"
                        onClick={() => openEdit("character", c)}
                      >
                        Düzenle
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() =>
                          setCharacters(characters.filter((x) => x.id !== c.id))
                        }
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedTab === "courses" && (
          <div className="courses-section">
            <h3 style={{ fontWeight: "bold", color: "#2c3e50", marginBottom: "24px" }}>
              Kurslar
            </h3>

            {!token ? (
              <p style={{ color: "red" }}>Lütfen giriş yapınız.</p>
            ) : courseLoading ? (
              <p>Yükleniyor...</p>
            ) : courseError ? (
              <p style={{ color: "red" }}>{courseError}</p>
            ) : courses.length === 0 ? (
              <p>Kurs bulunmamaktadır.</p>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    marginBottom: "24px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "12px",
                    padding: "20px",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                    color: "white"
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "18px",
                      fontWeight: 600
                    }}
                  >
                    Kurs Arama
                  </h4>
                  <input
                    type="text"
                    placeholder="Başlık, seviye, öğretmen veya etiket ara..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "none",
                      fontSize: "15px",
                      color: "#2c3e50",
                      outline: "none",
                      backgroundColor: "rgba(255,255,255,0.95)",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                    }}
                    onFocus={(e) => (e.target.style.backgroundColor = "white")}
                    onBlur={(e) => (e.target.style.backgroundColor = "rgba(255,255,255,0.95)")}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: "20px"
                  }}
                >
                  {filteredCourses.map((course) => {
                    const isActive = course.status === "ACTIVE";
                    const activationPending = !!courseActivationLoading[course.id];
                    const feedback = courseActivationFeedback[course.id];
                    const pointsValue = activationPoints[course.id] ?? "";

                    return (
                      <div
                        key={course.id}
                        style={{
                          background: "#ffffff",
                          borderRadius: "16px",
                          padding: "20px",
                          boxShadow: "0 10px 30px rgba(31, 45, 61, 0.08)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "16px",
                          border: "1px solid rgba(103, 119, 239, 0.15)"
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: "12px"
                          }}
                        >
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <h4 style={{ margin: 0, fontSize: "18px", color: "#2c3e50" }}>
                              {course.title}
                            </h4>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                fontSize: "13px",
                                fontWeight: 600
                              }}
                            >
                              <span
                                style={{
                                  padding: "4px 10px",
                                  borderRadius: "999px",
                                  backgroundColor: isActive ? "rgba(46, 213, 115, 0.15)" : "rgba(255, 165, 2, 0.15)",
                                  color: isActive ? "#2ecc71" : "#f39c12",
                                  fontWeight: 600
                                }}
                              >
                                {isActive ? "ACTİVE" : "PASİF"}
                              </span>
                              <span
                                style={{
                                  padding: "4px 10px",
                                  borderRadius: "999px",
                                  backgroundColor: "rgba(104, 109, 224, 0.12)",
                                  color: "#4c51bf",
                                  fontWeight: 600
                                }}
                              >
                                {course.level?.toUpperCase() || "Bilinmiyor"}
                              </span>
                            </span>
                          </div>

                          {course.image_url ? (
                            <img
                              src={`${baseUrl}${course.image_url}`}
                              alt={course.title}
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "12px",
                                border: "1px solid rgba(0,0,0,0.05)"
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "12px",
                                background: "linear-gradient(135deg, #cfd9ff 0%, #e0e7ff 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                fontWeight: 600,
                                color: "#4c51bf"
                              }}
                            >
                              Kurs
                            </div>
                          )}
                        </div>

                        <p
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            lineHeight: 1.6,
                            color: "#4b5563"
                          }}
                        >
                          {course.description}
                        </p>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                            gap: "12px",
                            background: "#f8fafc",
                            borderRadius: "12px",
                            padding: "12px"
                          }}
                        >
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
                              Süre
                            </span>
                            <span style={{ fontSize: "14px", color: "#1e293b", fontWeight: 600 }}>
                              {course.duration ? `${course.duration} dk` : "-"}
                            </span>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
                              Puan
                            </span>
                            <span style={{ fontSize: "14px", color: "#1e293b", fontWeight: 600 }}>
                              {course.points ?? "-"}
                            </span>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
                              Ders Sayısı
                            </span>
                            <span style={{ fontSize: "14px", color: "#1e293b", fontWeight: 600 }}>
                              {course.lessons?.length ?? 0}
                            </span>
                          </div>
                        </div>

                        {course.labels && course.labels.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {course.labels.map((label) => (
                              <span
                                key={label.id}
                                style={{
                                  padding: "6px 12px",
                                  borderRadius: "999px",
                                  background: "rgba(79, 172, 254, 0.12)",
                                  color: "#1f7aec",
                                  fontSize: "12px",
                                  fontWeight: 600
                                }}
                              >
                                #{label.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {course.teacher && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                              padding: "12px",
                              borderRadius: "12px",
                              background: "linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)"
                            }}
                          >
                            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
                              Eğitmen
                            </span>
                            <span style={{ fontSize: "14px", color: "#1e293b", fontWeight: 600 }}>
                              {course.teacher.first_name} {course.teacher.last_name}
                            </span>
                            <span style={{ fontSize: "13px", color: "#475569" }}>
                              {course.teacher.email}
                            </span>
                          </div>
                        )}

                        {course.lessons && course.lessons.length > 0 && (
                          <details
                            style={{
                              background: "#f9fafb",
                              borderRadius: "12px",
                              padding: "14px",
                              border: "1px solid rgba(15, 23, 42, 0.08)"
                            }}
                          >
                            <summary
                              style={{
                                cursor: "pointer",
                                fontWeight: 600,
                                color: "#334155"
                              }}
                            >
                              Dersleri Görüntüle
                            </summary>
                            <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                              {course.lessons.map((lesson) => (
                                <div
                                  key={lesson.id}
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "10px 12px",
                                    borderRadius: "10px",
                                    background: "white",
                                    boxShadow: "0 1px 4px rgba(15, 23, 42, 0.06)"
                                  }}
                                >
                                  <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span style={{ fontWeight: 600, color: "#1f2937" }}>
                                      {lesson.order}. {lesson.title}
                                    </span>
                                    <span style={{ fontSize: "12px", color: "#6b7280" }}>
                                      Süre: {lesson.duration ? `${lesson.duration} dk` : "-"}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </details>
                        )}

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px"
                          }}
                        >
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label
                              style={{
                                fontSize: "13px",
                                color: "#475569",
                                fontWeight: 600
                              }}
                            >
                              Aktif Etmek İçin Puan
                            </label>
                            <input
                              type="number"
                              min={0}
                              value={pointsValue}
                              onChange={(e) =>
                                setActivationPoints((prev) => ({
                                  ...prev,
                                  [course.id]: e.target.value
                                }))
                              }
                              disabled={isActive}
                              placeholder="Örn: 100"
                              style={{
                                padding: "12px 14px",
                                borderRadius: "8px",
                                border: "1px solid rgba(148, 163, 184, 0.6)",
                                fontSize: "14px",
                                outline: "none",
                                backgroundColor: isActive ? "#f1f5f9" : "#ffffff",
                                color: "#1e293b"
                              }}
                            />
                          </div>

                          <button
                            onClick={() => handleActivateCourse(course.id)}
                            disabled={isActive || activationPending}
                            style={{
                              background: isActive
                                ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                                : "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                              color: "white",
                              border: "none",
                              borderRadius: "8px",
                              padding: "12px 18px",
                              fontSize: "15px",
                              fontWeight: 600,
                              cursor: isActive || activationPending ? "not-allowed" : "pointer",
                              opacity: isActive || activationPending ? 0.7 : 1,
                              transition: "transform 0.2s ease, box-shadow 0.2s ease",
                              boxShadow: "0 8px 18px rgba(79,172,254,0.35)"
                            }}
                            onMouseEnter={(e) => {
                              if (isActive || activationPending) return;
                              e.currentTarget.style.transform = "translateY(-2px)";
                              e.currentTarget.style.boxShadow = "0 12px 25px rgba(79,172,254,0.4)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "0 8px 18px rgba(79,172,254,0.35)";
                            }}
                          >
                            {isActive ? "Aktif" : activationPending ? "Aktifleştiriliyor..." : "Kursu Aktifleştir"}
                          </button>

                          {feedback && (
                            <span
                              style={{
                                fontWeight: 600,
                                color: feedback.type === "success" ? "#22c55e" : "#ef4444"
                              }}
                            >
                              {feedback.message}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ===== Drawer */}
      <div
        className={`drawer-overlay ${editState ? "open" : ""}`}
        onClick={closeEdit}
        aria-hidden={!editState}
      />
      <aside className={`drawer ${editState ? "open" : ""}`} aria-hidden={!editState}>
        <div className="drawer-header">
          <button className="drawer-close" onClick={closeEdit} aria-label="Kapat">
            ✕
          </button>
        </div>

        <div className="drawer-body">
          {renderDrawerForm()}
        </div>

        <div className="drawer-footer">
          <button className="delete-btn ghost" onClick={closeEdit}>
            Vazgeç
          </button>
          <button className="save-btn" onClick={saveEdit}>
            Güncelle
          </button>
        </div>
      </aside>
    </div>
  );
};

export default AdminPage;     