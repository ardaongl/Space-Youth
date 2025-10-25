import React, { useState, useEffect, FormEvent } from "react";
import "./AdminPage.css";
import axios from "axios";
import { useAppSelector } from "@/store";
import { apis } from "@/services";
import { useNavigate } from "react-router-dom";

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
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  age?: number;
  students?: {
    approved: false,
    school: string | null,
    department: string,
    cv_url: string,
    questions_and_answers: string,
    introduce: string,
  }
}

interface Answer {
  id: number;
  student_name: string;
  answer: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
}

interface Personality {
  id: number;
  name: string;
  type: string;
  description: string;
  longDescription: string;
}

interface Character {
  id: number;
  name: string;
  details: string;
  image_url: string;
  personality: string;
}

type EditEntity = "task" | "personality" | "character";
type EditData = Task | Personality | Character;
interface EditState {
  entity: EditEntity;
  data: EditData;
}

const AdminPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<
    "students" | "answers" | "tasks" | "personalities" | "characters"
  >("students");
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);

  const user = useAppSelector(state => state.user.user)
  const token = useAppSelector(state => state.user.token);
  

  useEffect(() => {
    localStorage.setItem(LS_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem(LS_KEYS.PERSONALITIES, JSON.stringify(personalities));
  }, [personalities]);
  useEffect(() => {
    localStorage.setItem(LS_KEYS.CHARACTERS, JSON.stringify(characters));
  }, [characters]);

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

  const fetchAnswers = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get<Answer[]>(`${baseUrl}/api/answers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnswers(res.data || []);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.error?.message ||
        "Öğrenci cevapları getirilirken bir hata oluştu."
      );
      setAnswers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTab === "students") fetchStudents();
    if (selectedTab === "answers") fetchAnswers();
  }, [selectedTab]);

  const filteredStudents = students.filter(
    (s) =>
      s.first_name.toLowerCase().includes(search.toLowerCase()) ||
      s.last_name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.students.school && s.students.school.toLowerCase().includes(search.toLowerCase())) ||
      (s.students.department && s.students.department.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      title: { value: string };
      description: { value: string };
    };
    const newTask: Task = {
      id: tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
      title: target.title.value,
      description: target.description.value,
    };
    setTasks([...tasks, newTask]);
    e.currentTarget.reset();
  };

  const handleAddPersonality = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
      type: { value: string };
      description: { value: string };
      longDescription: { value: string };
    };

    const newPersonality: Personality = {
      id: personalities.length ? Math.max(...personalities.map((p) => p.id)) + 1 : 1,
      name: target.name.value,
      type: target.type.value,
      description: target.description.value,
      longDescription: target.longDescription.value,
    };
    setPersonalities([...personalities, newPersonality]);
    e.currentTarget.reset();
  };

  const handleAddCharacter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
      details: { value: string };
      image_url: { value: string };
      personality: { value: string };
    };

    const newCharacter: Character = {
      id: characters.length ? Math.max(...characters.map((c) => c.id)) + 1 : 1,
      name: target.name.value,
      details: target.details.value,
      image_url: target.image_url.value,
      personality: target.personality.value,
    };

    setCharacters([...characters, newCharacter]);
    e.currentTarget.reset();
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
  const onEditChange = (field: string, value: string) => {
    if (!editState) return;
    setEditState({
      ...editState,
      data: { ...(editState.data as any), [field]: value } as EditData,
    });
  };

  const saveEdit = () => {
    if (!editState) return;

    if (editState.entity === "task") {
      const item = editState.data as Task;
      setTasks((prev) => prev.map((t) => (t.id === item.id ? item : t)));
    }
    if (editState.entity === "personality") {
      const item = editState.data as Personality;
      setPersonalities((prev) => prev.map((p) => (p.id === item.id ? item : p)));
    }
    if (editState.entity === "character") {
      const item = editState.data as Character;
      setCharacters((prev) => prev.map((c) => (c.id === item.id ? item : c)));
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
          <label>Başlık</label>
          <input
            value={d.title}
            onChange={(e) => onEditChange("title", e.target.value)}
            placeholder="Görev başlığı"
          />
          <label>Açıklama</label>
          <textarea
            value={d.description}
            onChange={(e) => onEditChange("description", e.target.value)}
            placeholder="Görev açıklaması"
            rows={4}
          />
        </>
      );
    }

    if (editState.entity === "personality") {
      const d = editState.data as Personality;
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
            value={d.description}
            onChange={(e) => onEditChange("description", e.target.value)}
            placeholder="Açıklama"
            rows={5}
          />
          <label>Uzun Açıklama</label>
          <textarea
            value={d.longDescription}
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
          {personalities.map((p) => (
            <option key={p.id} value={p.name} />
          ))}
        </datalist>
        <label>Detaylar</label>
        <textarea
          value={d.details}
          onChange={(e) => onEditChange("details", e.target.value)}
          placeholder="Detaylar"
          rows={5}
        />
        <label>Görsel URL (opsiyonel)</label>
        <input
          value={d.image_url}
          onChange={(e) => onEditChange("image_url", e.target.value)}
          placeholder="https://..."
        />
      </>
    );
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
            <h3 style={{ fontWeight: "bold", color: "#2c3e50" }}>
              Öğrenci Cevapları
            </h3>
            {!token ? (
              <p style={{ color: "red" }}>Lütfen giriş yapınız.</p>
            ) : loading ? (
              <p>Yükleniyor...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : answers.length === 0 ? (
              <p>Öğrenci cevabı bulunmamaktadır.</p>
            ) : (
              <table className="tasks-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Öğrenci</th>
                    <th>Cevap</th>
                  </tr>
                </thead>
                <tbody>
                  {answers.map((a) => (
                    <tr key={a.id}>
                      <td>{a.id}</td>
                      <td>{a.student_name}</td>
                      <td>{a.answer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* Görevler */}
        {selectedTab === "tasks" && (
          <div>
            <h3 style={{ fontWeight: "bold", color: "#2c3e50" }}>Görevler</h3>
            <form onSubmit={handleAddTask}>
              <input name="title" placeholder="Görev başlığı" required />
              <input name="description" placeholder="Görev açıklaması" required />
              <button type="submit">Görev Ekle</button>
            </form>

            {tasks.length === 0 ? (
              <p>Görev bulunmamaktadır.</p>
            ) : (
              <table className="tasks-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Başlık</th>
                    <th>Açıklama</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.id}</td>
                      <td>{task.title}</td>
                      <td>{task.description}</td>
                      <td>
                        <button
                          onClick={() => openEdit("task", task)}
                          className="edit-btn"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() =>
                            setTasks(tasks.filter((t) => t.id !== task.id))
                          }
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
          </div>
        )}

        {/* Kişilik Tipleri — Kart Grid */}
        {selectedTab === "personalities" && (
          <div className="personality-section">
            <h3 style={{ fontWeight: "bold", color: "#2c3e50" }}>
              Kişilik Tipleri
            </h3>
            <form onSubmit={handleAddPersonality}>
              <input name="name" placeholder="Ad" required />
              <input name="type" placeholder="Tip (örnek: INTJ-A / INTJ-T)" required />
              <input name="description" placeholder="Kısa Açıklama" required />
              <textarea
                name="longDescription"
                placeholder="Uzun Açıklama"
                rows={4}
                style={{ resize: "vertical" }}
                required
              />
              <button type="submit">Ekle</button>
            </form>

            {personalities.length === 0 ? (
              <p>Kişilik tipi bulunmamaktadır.</p>
            ) : (
              <div className="personality-cards">
                {personalities.map((p) => (
                  <div key={p.id} className="personality-card">
                    <div>
                      <h4>{p.name}</h4>
                      <span>{p.type}</span>
                      <p>{p.description}</p>
                      {p.longDescription && (
                        <p className="long-description">{p.longDescription}</p>
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
                          setPersonalities(
                            personalities.filter((x) => x.id !== p.id)
                          )
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

            <form onSubmit={handleAddCharacter}>
              <input name="name" placeholder="Karakter Adı" required />
              <input name="details" placeholder="Detaylar" required />
              <input name="image_url" placeholder="Görsel URL (opsiyonel)" />
              <select name="personality" required>
                <option value="">Kişilik Tipi Seçin</option>
                {personalities.map((p) => (
                  <option key={p.id} value={p.name}>
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
                          src={c.image_url}
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