import { api } from "../api";
import { CreateTutorialRequest, UpdateTutorialRequest, Tutorial } from "@shared/api";

export class TutorialAPI {
  get_tutorials = async () => {
    try {
      const response = await api.get("/api/tutorials", {
        requiresAuth: true,
        validateStatus: (s) => s < 500,
      });
      return response;
    } catch (error) {
      console.error("Error getting tutorials:", error);
      return error;
    }
  };

  get_tutorial = async (id: string) => {
    try {
      const response = await api.get(`/api/tutorial/${id}`, {
        requiresAuth: true,
        validateStatus: (s) => s < 500,
      });
      return response;
    } catch (error) {
      console.error("Error getting tutorial:", error);
      return error;
    }
  };

  get_teacher_tutorials = async () => {
    try {
      const response = await api.get("/api/teacher/tutorials", {
        requiresAuth: true,
        validateStatus: (s) => s < 500,
      });
      return response;
    } catch (error) {
      console.error("Error getting teacher tutorials:", error);
      return error;
    }
  };

  create_tutorial = async (payload: CreateTutorialRequest) => {
    try {
      const response = await api.post("/api/tutorial", payload, {
        requiresAuth: true,
        validateStatus: (s) => s < 500,
      });
      return response;
    } catch (error) {
      console.error("Error creating tutorial:", error);
      return error;
    }
  };

  update_tutorial = async (id: string, payload: UpdateTutorialRequest) => {
    try {
      const response = await api.put(`/api/tutorial/${id}`, payload, {
        requiresAuth: true,
        validateStatus: (s) => s < 500,
      });
      return response;
    } catch (error) {
      console.error("Error updating tutorial:", error);
      return error;
    }
  };

  delete_tutorial = async (id: string) => {
    try {
      const response = await api.delete(`/api/tutorial/${id}`, {
        requiresAuth: true,
        validateStatus: (s) => s < 500,
      });
      return response;
    } catch (error) {
      console.error("Error deleting tutorial:", error);
      return error;
    }
  };
}
