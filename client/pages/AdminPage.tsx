import React, { useState, useEffect, FormEvent } from "react";
import "./AdminPage.css";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  school?: string;
  age?: number;
  department?: string;
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

const AdminPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"students" | "answers" | "tasks">("students");
  const [students, setStudents] = useState<Student[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const fetchStudents = async () => {
    if (!token) return; 
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get<{ user: Student }[]>(
        `${baseUrl}/api/users?role=student`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const studentsData = res.data.map((item) => item.user);
      setStudents(studentsData || []);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error?.message || "Öğrenciler getirilirken bir hata oluştu.");
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
      setError(err.response?.data?.error?.message || "Öğrenci cevapları getirilirken bir hata oluştu.");
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
      (s.school && s.school.toLowerCase().includes(search.toLowerCase())) ||
      (s.department && s.department.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      title: { value: string };
      description: { value: string };
    };
    const newTask: Task = {
      id: tasks.length + 1,
      title: target.title.value,
      description: target.description.value,
    };
    setTasks([...tasks, newTask]);
    e.currentTarget.reset();
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
        </ul>
      </div>

      <div className="content">
        {/* Öğrenciler */}
        {selectedTab === "students" && (
          <>
            <h3 style={{ fontWeight: 'bold', color: '#2c3e50' }}>Öğrenci Listesi</h3>
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
                    {filteredStudents.map((s) => (
                      <tr key={s.id}>
                        <td>{s.id}</td>
                        <td>{s.first_name}</td>
                        <td>{s.last_name}</td>
                        <td>{s.email}</td>
                        <td>{s.school || "Bilinmiyor"}</td>
                        <td>{s.age || "-"}</td>
                        <td>{s.department || "Bilinmiyor"}</td>
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
            <h3 style={{ fontWeight: 'bold', color: '#2c3e50' }}>Öğrenci Cevapları</h3>
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
            <h3 style={{ fontWeight: 'bold', color: '#2c3e50' }}>Görevler</h3>
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
                          onClick={() => {
                            const newTitle = prompt("Yeni başlık:", task.title);
                            const newDesc = prompt("Yeni açıklama:", task.description);
                            if (newTitle && newDesc) {
                              setTasks(
                                tasks.map((t) =>
                                  t.id === task.id
                                    ? { ...t, title: newTitle, description: newDesc }
                                    : t
                                )
                              );
                            }
                          }}
                          className="edit-btn"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => setTasks(tasks.filter((t) => t.id !== task.id))}
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
      </div>
    </div>
  );
};

export default AdminPage;   