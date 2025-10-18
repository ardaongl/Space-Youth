import { CommonAPI } from "./modules/common";
import { CourseAPI } from "./modules/course";
import { UserAPI } from "./modules/user";
import { StudentAPI } from "./modules/student";
export class API {
  user: UserAPI;
  course: CourseAPI;
  common: CommonAPI;
  student: StudentAPI;

  constructor() {
    this.user = new UserAPI();
    this.course = new CourseAPI();
    this.common = new CommonAPI();
    this.student = new StudentAPI()
  }
}

// Export a default instance
export const api = new API();
