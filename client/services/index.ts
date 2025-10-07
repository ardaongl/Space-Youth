import { CommonAPI } from "./modules/common";
import { CourseAPI } from "./modules/course";
import { UserAPI } from "./modules/user";

export class API {
  user: UserAPI;
  course: CourseAPI;
  common: CommonAPI;

  constructor() {
    this.user = new UserAPI();
    this.course = new CourseAPI();
    this.common = new CommonAPI();
  }
}

export const apis = new API();
