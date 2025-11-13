import { Student, STUDENT_STATUS } from "@/types/user/user";

export const normalizeStudentStatus = (status: unknown): STUDENT_STATUS => {
  if (typeof status === "boolean") {
    return status ? STUDENT_STATUS.APPROVED : STUDENT_STATUS.PENDING;
  }

  if (typeof status === "string") {
    const normalized = status.toUpperCase();
    if ((Object.values(STUDENT_STATUS) as string[]).includes(normalized)) {
      return normalized as STUDENT_STATUS;
    }
  }

  return STUDENT_STATUS.PENDING;
};

export const mapStudentResponseToState = (raw: unknown): Student | null => {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const source: Record<string, unknown> =
    "student" in (raw as Record<string, unknown>)
      ? ((raw as Record<string, unknown>).student as Record<string, unknown>) ?? {}
      : (raw as Record<string, unknown>);

  const id =
    source.id ??
    source.student_id ??
    source.user_id ??
    null;

  if (typeof id !== "string" && typeof id !== "number") {
    return null;
  }

  const statusSource =
    source.status ??
    source.application_status ??
    source.approved;

  const questions =
    typeof source.questions_and_answers === "string"
      ? source.questions_and_answers
      : "";

  return {
    id: String(id),
    status: normalizeStudentStatus(statusSource),
    questions_and_answers: questions,
  };
};

