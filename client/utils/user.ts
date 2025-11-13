import type { User, UserLabel, TeacherInfo } from "@/store/slices/userSlice";
import type { UserRole } from "@/utils/roles";

const normalizeRole = (value: unknown): UserRole => {
  const role = typeof value === "string" ? value.toLowerCase() : "";
  if (role === "teacher" || role === "admin") {
    return role;
  }
  return "student";
};

const normalizeLanguage = (value: unknown): "TR" | "EN" => {
  const lang = typeof value === "string" ? value.toUpperCase() : "";
  return lang === "EN" ? "EN" : "TR";
};

const normalizeGender = (value: unknown): "male" | "female" => {
  const gender = typeof value === "string" ? value.toLowerCase() : "";
  return gender === "female" ? "female" : "male";
};

const mapLabels = (labels: unknown): UserLabel[] => {
  if (!Array.isArray(labels)) return [];

  return labels
    .filter(
      (label): label is { id: number; name: string } =>
        label !== null &&
        typeof label === "object" &&
        typeof (label as any).id === "number" &&
        typeof (label as any).name === "string",
    )
    .map((label) => ({
      id: label.id,
      name: label.name,
    }));
};

export const mapTeacherFromResponse = (teacher: unknown): TeacherInfo | undefined => {
  if (!teacher || typeof teacher !== "object") return undefined;
  const teacherData = teacher as Record<string, unknown>;
  const id = teacherData.id;

  if (typeof id !== "string" || !id) return undefined;

  const zoomConnectedField = teacherData.zoom_connected;
  const zoomConnected =
    typeof zoomConnectedField === "boolean"
      ? zoomConnectedField
      : zoomConnectedField === 1;

  const teacherInfo: TeacherInfo = {
    id,
    school: (teacherData.school ?? null) as string | null | undefined,
    branch: (teacherData.branch ?? null) as string | null | undefined,
  };

  if (typeof zoomConnected === "boolean") {
    teacherInfo.zoom_connected = zoomConnected;
  }

  return teacherInfo;
};

export const mapUserResponseToState = (apiUser: unknown): User | null => {
  if (!apiUser || typeof apiUser !== "object") return null;
  const data = apiUser as Record<string, unknown>;
  const id = data.id;
  if (typeof id !== "string" || !id) return null;

  const firstName = typeof data.first_name === "string" ? data.first_name : "";
  const lastName = typeof data.last_name === "string" ? data.last_name : "";
  const email = typeof data.email === "string" ? data.email : "";

  const fullName = [firstName, lastName].filter(Boolean).join(" ") || firstName || lastName || email;

  const age = typeof data.age === "number" ? data.age : null;
  const points = typeof data.points === "number" ? data.points : 0;
  const labels = mapLabels(data.labels);
  const teacher = mapTeacherFromResponse(data.teacher);

  return {
    id,
    name: fullName,
    email,
    role: normalizeRole(data.role),
    age,
    gender: normalizeGender(data.gender),
    language: normalizeLanguage(data.language),
    points,
    labels,
    teacher,
  };
};

